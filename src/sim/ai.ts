import { ARENA, DT, MATCH } from './config';
import { CARDS, UNITS } from './cards';
import { distTo, viewY, type Entity, type Game, type Team } from './game';
import type { Rng } from './rng';
import { cardInfo, formationOffsets, spellDamage, unitValue, type CardInfo } from './ai/knowledge';
import { edgeAt, foePos, nearestTower, type Foe } from './ai/foe';
import { clashUnit, runClash, type ClashHit, type ClashResult, type ClashUnit } from './ai/clash';
import { planSpell, type SpellCtx, type SpellPlan } from './ai/spells';
import { OpponentModel } from './ai/opponent';

export interface AiOptions {
  reaction: number; // 平均思考間隔（秒）
  reactDelay: number; // 對手新單位出現後，過多久才會注意到（秒）
  skill: number; // 0～1：選到評估最佳應對的機率（其餘時候隨便挑一張還算合理的牌）
  noise: number; // 部署位置的隨機偏差（格）
  aim: number; // 0～1：法術對移動目標的預判程度（0 = 瞄準目前位置）
  track: number; // 0～1：數對手能量、記對手出牌的準確度（< 0.5 時不拿來做決策）
  pushElixir: number; // 一倍能量、沒有能量優勢時，累積到多少才主動進攻
  spellValue: number; // 純價值法術的出手門檻（打到的能量價值 ÷ 費用）
  leak: number; // 能量高於此值一定出牌，避免溢出
  counterPush: number; // 0～1：防守後跟進反攻、替推進補支援的機率
  minGain: number; // 防守出牌至少要比「交給塔處理」好多少（能量當量）
  plan: number; // 防守時比較幾個出手時間點（1 = 只看現在，越多越會等最佳時機）
  pocket: boolean; // 推倒側塔後是否把部隊放進對方半場的前進區
}

export type AiLevel = 'easy' | 'normal' | 'hard';

// 三種難度只差在反應、判斷與準度；全部只透過 Game.deploy() 出牌，遵守同一套能量、手牌、冷卻與部署區規則，
// 也只看得到場上公開的資訊（對手的出牌與花費可以記，手牌、牌序與能量看不到）。
export const AI_LEVELS: Record<AiLevel, AiOptions> = {
  easy: {
    // 新手對手：反應慢、常出錯、幾乎不主動進攻（能量滿了才出牌）
    reaction: 2.8, reactDelay: 2.8, skill: 0, noise: 3, aim: 0, track: 0, pushElixir: 10, spellValue: 2.5, leak: 10,
    counterPush: 0, minGain: 4, plan: 1, pocket: false,
  },
  normal: {
    reaction: 1.0, reactDelay: 0.8, skill: 0.6, noise: 1.0, aim: 0.5, track: 0.5, pushElixir: 7.4, spellValue: 1.1, leak: 9.7,
    counterPush: 0.75, minGain: 0.8, plan: 2, pocket: false,
  },
  hard: {
    reaction: 0.4, reactDelay: 0.12, skill: 0.95, noise: 0.25, aim: 1, track: 1, pushElixir: 7.4, spellValue: 1.25, leak: 9.4,
    counterPush: 0.95, minGain: 0.35, plan: 5, pocket: true,
  },
};

export const AI_NORMAL: AiOptions = AI_LEVELS.normal;

interface HandCard {
  index: number;
  id: string;
  ci: CardInfo;
}

/** 某一路正朝我方來的敵人。 */
interface Threat {
  lane: 0 | 1;
  foes: Foe[];
  front: Foe; // 預測最快壓到我方的敵人
  frontVy: number;
  eta: number; // 最快幾秒後開始打到我方
  value: number;
  hunters: Foe[]; // 只打建築的
  troopHitters: boolean;
  tower: Entity; // 主要被威脅的我方塔
}

interface Sit {
  now: number;
  elixir: number;
  rate: number; // 每秒回復的能量
  mult: number;
  overtime: boolean;
  hand: HandCard[]; // 手上所有牌（含能量還不夠的）
  foes: Foe[];
  threats: Threat[];
  enemyElixir: number;
  hold: number; // 為即將到來的防守保留的能量
  lead: number; // 皇冠差（我方 − 對方）
  spellCtx: SpellCtx;
}

/** 部署位置（己方視角 y）。 */
interface Place {
  x: number;
  vy: number;
}

interface DefOption {
  h: HandCard;
  gain: number;
  plan: SpellPlan | null;
  place: Place | null;
  delay: number; // 0 = 現在出；> 0 = 再等幾秒效果更好
}

// 防守時比較「現在出」與「晚一點出」的時間點（秒）。
const DELAYS = [0, 0.8, 1.6, 2.6, 3.8];

// 找合法部署點的搜尋順序：由近到遠，稍微偏好往己方後方退。
const SEARCH: [number, number][] = (() => {
  const out: [number, number, number][] = [];
  for (let dx = -4; dx <= 4; dx++) {
    for (let dy = -4; dy <= 4; dy++) {
      const d = Math.hypot(dx, dy);
      if (d <= 4.3) out.push([dx, dy, d + (dy < 0 ? 0.3 : 0)]);
    }
  }
  out.sort((a, b) => a[2] - b[2] || b[1] - a[1] || a[0] - b[0]);
  return out.map(([dx, dy]) => [dx, dy] as [number, number]);
})();

/**
 * 電腦對手：只透過 Game.deploy() 出牌，與玩家遵循相同的能量、手牌與部署規則。
 * 以「隊伍自身視角」思考（己方在下方、vy 越大越靠己方後場），再換算回世界座標。
 *
 * 每次思考依序考慮：收塔 → 防守（用簡化交戰模擬比較每張牌與「交給塔」的差別）→ 價值法術
 * → 替推進／反攻補支援 → 主動進攻 → 避免能量溢出。
 */
export class AiController {
  private thinkTimer: number;
  private readonly model: OpponentModel;
  private readonly seenAt = new Map<number, number>(); // 對手單位／法術第一次出現的時間
  private maxSeen = 0;
  private lane: 0 | 1;
  private lastPrune = 0;
  /** 除錯用：設定後會回報每次出牌的理由（預設關閉）。 */
  trace: ((msg: string) => void) | null = null;
  /** 除錯用：印出交戰模擬過程。 */
  clashTrace: ((msg: string) => void) | null = null;

  constructor(
    private readonly game: Game,
    readonly team: Team,
    private readonly rng: Rng,
    private readonly opts: AiOptions = AI_NORMAL,
  ) {
    this.thinkTimer = 1 + rng.range(0, 1);
    this.model = new OpponentModel(game, team === 0 ? 1 : 0, rng, opts.track);
    this.lane = rng.int(2) as 0 | 1;
  }

  /** 估計的對手能量（測試與除錯用；電腦自己也只靠這個估計值）。 */
  get enemyElixirEstimate(): number {
    return this.model.elixir;
  }

  /** 已記住的對手卡牌。 */
  get knownEnemyCards(): string[] {
    return [...this.model.seen];
  }

  update(): void {
    const g = this.game;
    if (!g.playing) return;
    this.model.update();
    this.noticeNew();
    this.thinkTimer -= DT;
    if (this.thinkTimer > 0) return;
    this.thinkTimer = this.opts.reaction * this.rng.range(0.7, 1.3);
    this.think();
  }

  private get enemy(): Team {
    return this.team === 0 ? 1 : 0;
  }

  private vy(y: number): number {
    return viewY(this.team, y);
  }

  private wy(vy: number): number {
    return viewY(this.team, vy);
  }

  private laneOf(x: number): 0 | 1 {
    return x < ARENA.width / 2 ? 0 : 1;
  }

  private chance(p: number): boolean {
    return this.rng.next() < p;
  }

  /** 記下對手新單位／飛行中法術第一次出現的時間（反應延遲用）。 */
  private noticeNew(): void {
    const g = this.game;
    const ents = g.entities;
    let top = this.maxSeen;
    for (let i = ents.length - 1; i >= 0; i--) {
      const e = ents[i];
      if (e.id <= this.maxSeen) break;
      if (e.id > top) top = e.id;
      if (e.team !== this.team) this.seenAt.set(e.id, g.time);
    }
    this.maxSeen = top;
    for (const s of g.spells) if (s.team !== this.team && !this.seenAt.has(s.id)) this.seenAt.set(s.id, g.time);
    for (const a of g.areas) if (a.team !== this.team && !this.seenAt.has(a.id)) this.seenAt.set(a.id, g.time);
    if (g.time - this.lastPrune > 10) {
      this.lastPrune = g.time;
      for (const [id, t] of this.seenAt) {
        if (g.time - t > 5 && !g.get(id) && !g.spells.some((s) => s.id === id) && !g.areas.some((a) => a.id === id)) this.seenAt.delete(id);
      }
    }
  }

  // ───────── 局勢 ─────────

  private think(): void {
    const s = this.situation();
    if (s.hand.length === 0) return;
    this.why = '';
    if (this.finisher(s)) return this.report(s, 'finish');
    if (this.defend(s)) return this.report(s, 'defend');
    if (this.boost(s)) return this.report(s, 'boost');
    if (this.tiebreakChip(s)) return this.report(s, 'chip');
    if (this.chipTower(s)) return this.report(s, 'chip');
    if (this.valueSpell(s)) return this.report(s, 'spell');
    if (this.support(s)) return this.report(s, 'support');
    if (this.pump(s)) return this.report(s, 'pump');
    if (this.push(s, false)) return this.report(s, 'push');
    if (this.avoidLeak(s)) this.report(s, 'leak');
  }

  private why = '';
  private lastBoost = -99;

  /** 狂暴與冰凍：我方部隊打到對方塔時使用（冰凍連同塔與附近的防守部隊一起凍住）。 */
  private boost(s: Sit): boolean {
    const g = this.game;
    if (g.time - this.lastBoost < 3 || !this.chance(0.2 + this.opts.skill * 0.8)) return false;
    const urgent = s.threats.some((t) => t.eta < 5 && t.value >= 3);
    const rage = s.hand.find((h) => h.ci.rage && h.ci.cost <= s.elixir - (urgent ? 2 : 0));
    const freeze = s.hand.find((h) => h.ci.freeze && h.ci.cost <= s.elixir - (urgent ? 2 : 0));
    if (!rage && !freeze) return false;
    for (const t of g.towers(this.enemy)) {
      if (!t.alive) continue;
      const attackers = g.entities.filter(
        (e) => e.alive && e.team === this.team && e.kind === 'troop' && !e.tunneling && e.deployTimer <= 0 && distTo(e.x, e.y, t) <= Math.max(e.stats.range, 1) + 2.5,
      );
      if (attackers.length === 0) continue;
      const value = attackers.reduce((sum, e) => sum + unitValue(e.unit, e.cardId) * (e.hp / e.maxHp), 0);
      const cx = attackers.reduce((a, e) => a + e.x, 0) / attackers.length;
      const cy = attackers.reduce((a, e) => a + e.y, 0) / attackers.length;
      if (freeze && value >= 3.5) {
        // 落點在塔與部隊之間：塔要在範圍內，順便凍住附近的防守部隊
        const fx = (cx + t.x) / 2;
        const fy = (cy + t.y) / 2;
        if (distTo(fx, fy, t) <= freeze.ci.spell!.radius - 0.3) {
          const dv = s.foes.filter((f) => f.e && Math.hypot(f.x - fx, f.y - fy) <= 3.2).reduce((sum, f) => sum + f.value * (f.hp / f.maxHp), 0);
          if (dv >= 2 || t.hp < t.maxHp * 0.5) {
            this.lastBoost = g.time;
            return this.castSpell(freeze, fx, fy, true);
          }
        }
      }
      if (rage && attackers.length >= 2 && value >= 4) {
        this.lastBoost = g.time;
        return this.castSpell(rage, cx, cy, true);
      }
    }
    return false;
  }

  /** 能量收集器：沒有威脅、能量充足時放在後場（另一路的後方）。 */
  private pump(s: Sit): boolean {
    const h = s.hand.find((x) => x.ci.pump && x.ci.cost <= s.elixir);
    if (!h || s.threats.some((t) => t.eta < 10)) return false;
    if (s.mult < 2 && s.elixir < Math.min(9.5, h.ci.cost + 2.5)) return false;
    const mine = this.game.entities.filter((e) => e.alive && e.team === this.team && e.stats.elixirGen).length;
    if (mine >= 2) return false;
    const side = this.lane === 0 ? 1 : -1;
    return this.deployOwn(h, 9 + side * 4.5, 30.5);
  }

  /** 地道挖掘者：鑽到對方側塔外側貼著塔身冒出來。 */
  private deployTunnel(h: HandCard, lane: 0 | 1): boolean {
    const g = this.game;
    const princesses = g.towers(this.enemy).filter((t) => t.alive && t.unit === 'princess');
    const t = princesses.find((x) => x.lane === lane) ?? princesses.sort((a, b) => a.hp - b.hp)[0] ?? g.king(this.enemy);
    const out = t.x < ARENA.width / 2 ? -1 : 1;
    const back = this.team === 0 ? -1 : 1; // 對方塔的後方（遠離河道）
    const r = t.half + 0.5;
    for (const [ox, oy] of [[out * r, 0], [0, back * r], [-out * r, 0], [0, -back * r]] as [number, number][]) {
      const n = this.opts.noise * 0.3;
      const [sx, sy] = g.snap(h.id, t.x + ox + this.rng.range(-n, n), t.y + oy + this.rng.range(-n, n));
      if (!g.canDeployAt(this.team, h.id, sx, sy)) continue;
      const ok = g.deploy(this.team, h.index, sx, sy).ok;
      if (ok && this.trace) this.why += ` => ${h.id}@${sx.toFixed(1)},${this.vy(sy).toFixed(1)}`;
      return ok;
    }
    return false;
  }

  private report(s: Sit, kind: string): void {
    if (!this.trace) return;
    const th = s.threats.map((t) => `L${t.lane}:eta${t.eta.toFixed(1)}/v${t.value.toFixed(1)}`).join(' ');
    this.trace(`${kind} e=${s.elixir.toFixed(1)} est=${s.enemyElixir.toFixed(1)} ${this.why} [${th}]`);
  }

  private situation(): Sit {
    const g = this.game;
    const p = g.players[this.team];
    const mult = g.elixirMultiplier();
    const hand: HandCard[] = [];
    p.hand.forEach((id, index) => {
      if (id) hand.push({ index, id, ci: cardInfo(id) });
    });
    const foes = this.snapshotFoes();
    const s: Sit = {
      now: g.time,
      elixir: p.elixir,
      rate: MATCH.elixirPerSecond * mult,
      mult,
      overtime: g.phase === 'overtime',
      hand,
      foes,
      threats: [],
      enemyElixir: this.model.elixir,
      hold: 0,
      lead: p.crowns - g.players[this.enemy].crowns,
      spellCtx: undefined as unknown as SpellCtx,
    };
    s.spellCtx = {
      game: g,
      team: this.team,
      foes,
      towers: g.towers(this.enemy).filter((t) => t.alive),
      aim: this.opts.aim,
      towerValue: (t, dmg) => this.towerDamageValue(t, dmg, s),
      foeBonus: (f) => (this.vy(f.y) >= ARENA.riverTop ? 0.35 : 0),
    };
    s.threats = this.findThreats(s);
    return s;
  }

  /** 場上看得到的敵方部隊／建築（含飛行中的哥布林飛桶），扣掉我方已在路上的法術傷害。 */
  private snapshotFoes(): Foe[] {
    const g = this.game;
    const out: Foe[] = [];
    const delay = this.opts.reactDelay;
    for (const e of g.entities) {
      if (!e.alive || e.team === this.team || e.kind === 'tower') continue;
      const seen = this.seenAt.get(e.id);
      if (seen === undefined || g.time - seen < delay) continue;
      if (e.tunneling) {
        // 鑽地中：看得到地面隆起往哪裡去，當成之後會在落點冒出來的部隊
        const eta = Math.hypot(e.tunnelX - e.x, e.tunnelY - e.y) / (e.stats.tunnelSpeed ?? 10);
        out.push({
          e: null, unit: e.unit, cardId: e.cardId, st: e.stats, kind: e.kind, x: e.tunnelX, y: e.tunnelY, hp: e.hp, maxHp: e.maxHp,
          value: unitValue(e.unit, e.cardId), appear: eta, deploy: e.stats.deployTime, pred: new Map(),
        });
        continue;
      }
      out.push({
        e, unit: e.unit, cardId: e.cardId, st: e.stats, kind: e.kind, x: e.x, y: e.y, hp: e.hp, maxHp: e.maxHp,
        value: unitValue(e.unit, e.cardId), appear: 0, deploy: e.deployTimer, pred: new Map(),
      });
    }
    for (const sp of g.spells) {
      if (sp.team === this.team) continue;
      const st = CARDS[sp.cardId]?.spell;
      if (!st || st.kind !== 'barrel' || !st.spawn) continue;
      const seen = this.seenAt.get(sp.id);
      if (seen === undefined || g.time - seen < delay) continue;
      const ust = UNITS[st.spawn.unit].stats;
      for (const [ox, oy] of formationOffsets(st.spawn.count)) {
        out.push({
          e: null, unit: st.spawn.unit, cardId: sp.cardId, st: ust, kind: 'troop', x: sp.x + ox, y: sp.y + oy, hp: ust.hp, maxHp: ust.hp,
          value: unitValue(st.spawn.unit, sp.cardId), appear: Math.max(0, sp.delay), deploy: st.spawn.deployTime, pred: new Map(),
        });
      }
    }
    // 對手的墓地：還沒冒出來的骷髏也算威脅（之後會在範圍內陸續出現），毒霧這類持續法術才會想到要蓋上去
    for (const a of g.areas) {
      if (a.team === this.team || !a.spawnsLeft) continue;
      const gy = CARDS[a.cardId]?.spell?.graveyard;
      if (!gy) continue;
      const seen = this.seenAt.get(a.id);
      if (seen === undefined || g.time - seen < delay) continue;
      const ust = UNITS[gy.unit].stats;
      for (let i = 0; i < a.spawnsLeft; i++) {
        out.push({
          e: null, unit: gy.unit, cardId: a.cardId, st: ust, kind: 'troop', x: a.x, y: a.y, hp: ust.hp, maxHp: ust.hp,
          value: CARDS[a.cardId].cost / gy.count, appear: Math.max(0, a.spawnTimer ?? 0) + i * gy.interval, deploy: 0.3, pred: new Map(),
        });
      }
    }
    this.applyPending(out);
    return out.filter((f) => f.hp > 0);
  }

  /** 我方已經丟出去、還沒生效的法術：預先扣血，避免重複出手。 */
  private applyPending(foes: Foe[]): void {
    const g = this.game;
    for (const sp of g.spells) {
      if (sp.team !== this.team) continue;
      const st = CARDS[sp.cardId].spell!;
      if (st.kind === 'barrel') continue;
      const t = Math.max(0, sp.delay);
      for (const f of foes) {
        if (f.st.flying && !st.hitsAir) continue;
        const [px, py] = foePos(g, f, t);
        if (edgeAt(sp.x, sp.y, f.kind, f.st, px, py) > st.radius) continue;
        f.hp -= st.damage * sp.wavesLeft;
      }
    }
    for (const a of g.areas) {
      if (a.team !== this.team) continue;
      const st = CARDS[a.cardId].spell!;
      for (const f of foes) {
        if (f.st.flying && !st.hitsAir) continue;
        if (edgeAt(a.x, a.y, f.kind, f.st, f.x, f.y) > a.radius) continue;
        f.hp -= st.damage * Math.min(a.ticksLeft, 4);
      }
    }
    for (const r of g.rollers) {
      if (r.team !== this.team) continue;
      const st = CARDS[r.cardId].spell!;
      const left = st.rollRange! - r.traveled;
      for (const f of foes) {
        if (f.st.flying || (f.e && r.hit.has(f.e.id))) continue;
        if (Math.abs(f.x - r.x) - f.st.radius > st.radius) continue;
        const along = (f.y - r.y) * r.dir;
        if (along < -(st.rollHalfDepth! + f.st.radius) || along > left + 1) continue;
        f.hp -= st.damage;
      }
    }
  }

  private defendTower(lane: 0 | 1): Entity {
    const p = this.game.towers(this.team).find((t) => t.unit === 'princess' && t.lane === lane && t.alive);
    return p ?? this.game.king(this.team);
  }

  /** 敵人是否正朝我方來（在對方半場和我方部隊纏鬥的不算）。 */
  private incoming(f: Foe): boolean {
    if (!f.e) return true;
    if (this.vy(f.y) >= 13) return true;
    const t = f.e.targetId >= 0 ? this.game.get(f.e.targetId) : undefined;
    if (!t || !t.alive) return true;
    return t.team === this.team && (t.kind !== 'troop' || this.vy(t.y) >= 13);
  }

  /** 敵人幾秒後開始打到我方東西。 */
  private timeToHit(f: Foe): number {
    if (!f.e) return f.appear + f.deploy;
    const g = this.game;
    const e = f.e;
    let t = e.targetId >= 0 ? g.get(e.targetId) : undefined;
    if (!t || !t.alive || t.team !== this.team) t = nearestTower(g, this.team, e.x, e.y);
    if (!t) return Infinity;
    if (e.attacking) return 0;
    const gap = Math.max(0, g.edgeDist(e, t) - e.stats.range);
    const detour = e.stats.flying || e.stats.jumpsRiver ? 1 : 1.15;
    const speed = Math.max(0.2, e.stats.speed * (e.slowTimer > 0 ? e.slowMul : 1));
    return Math.max(0, e.deployTimer, e.stunTimer) + (gap * detour) / speed;
  }

  private findThreats(s: Sit): Threat[] {
    const g = this.game;
    const out: Threat[] = [];
    for (const lane of [0, 1] as const) {
      const fs = s.foes.filter((f) => f.kind === 'troop' && this.laneOf(f.x) === lane && this.incoming(f));
      if (fs.length === 0) continue;
      let eta = Infinity;
      let front = fs[0];
      let frontVy = -Infinity;
      let value = 0;
      for (const f of fs) {
        eta = Math.min(eta, this.timeToHit(f));
        const vy = this.vy(foePos(g, f, 1)[1]);
        if (vy > frontVy) {
          frontVy = vy;
          front = f;
        }
        value += f.value * (f.hp / f.maxHp);
      }
      out.push({
        lane, foes: fs, front, frontVy, eta, value,
        hunters: fs.filter((f) => f.st.targets === 'buildings').sort((a, b) => this.vy(b.y) - this.vy(a.y)),
        troopHitters: fs.some((f) => f.st.targets !== 'buildings' && f.st.damage > 0),
        tower: this.defendTower(lane),
      });
    }
    return out;
  }

  private reserve(s: Sit): number {
    if (s.elixir >= 9.6) return 0;
    let r = s.hold;
    if (this.opts.track >= 0.5) r = Math.max(r, Math.min(4, s.enemyElixir - 4));
    else r = Math.max(r, 1.5);
    if (s.overtime) r += 1;
    if (s.mult >= 2) r -= 1;
    return Math.max(0, r);
  }

  private towerDamageValue(t: Entity, dmg: number, s: Sit): number {
    if (dmg >= t.hp) return t.unit === 'king' || s.overtime ? 60 : 12;
    let v = dmg / 230;
    if (s.overtime && this.game.timeLeft < 25) v *= 2.5;
    return v;
  }

  private hpPerElixir(t: Entity, s: Sit): number {
    let hpe = 190;
    if (t.hp < 1300) hpe *= 0.65;
    if (t.unit === 'king') hpe *= 0.7;
    if (s.overtime) hpe *= 0.6;
    return hpe;
  }

  /** 對手可能握著能一次清掉這張小兵牌的法術（只用記牌資訊）。 */
  private spellRisk(ci: CardInfo): number {
    if (!ci.st || this.opts.track < 0.5) return 0;
    let risk = this.model.seen.size < 8 ? 0.2 : 0;
    for (const id of this.model.seen) {
      const c = cardInfo(id);
      if (!c.damageSpell || !this.model.mayHold(id) || c.cost > this.model.elixir + 0.5) continue;
      if (ci.flying && !c.spell!.hitsAir) continue;
      if (spellDamage(c.spell!, false, 4) >= ci.st.hp) risk = Math.max(risk, 0.8);
    }
    return risk;
  }

  private enemyMayHoldHunter(): boolean {
    if (this.opts.track < 0.5) return false;
    for (const id of this.model.seen) if (cardInfo(id).hunter && this.model.mayHold(id)) return true;
    return false;
  }

  // ───────── 收塔 ─────────

  private pendingTowerDamage(t: Entity): number {
    const g = this.game;
    let d = 0;
    for (const sp of g.spells) {
      if (sp.team !== this.team) continue;
      const st = CARDS[sp.cardId].spell!;
      // 落雷每個目標只劈一次
      if (st.kind !== 'barrel' && distTo(sp.x, sp.y, t) <= st.radius) d += Math.round(st.damage * st.towerPct) * (st.bolts ? 1 : sp.wavesLeft);
    }
    for (const a of g.areas) {
      if (a.team !== this.team || distTo(a.x, a.y, t) > a.radius) continue;
      const st = CARDS[a.cardId].spell!;
      d += Math.round(st.damage * st.towerPct) * a.ticksLeft;
    }
    for (const r of g.rollers) {
      if (r.team !== this.team || r.hit.has(t.id)) continue;
      const st = CARDS[r.cardId].spell!;
      const along = (t.y - r.y) * r.dir;
      if (Math.abs(t.x - r.x) - t.half <= st.radius && along >= -t.half && along <= st.rollRange! - r.traveled + t.half) d += Math.round(st.damage * st.towerPct);
    }
    return d;
  }

  /** 對方塔的血量低於手上法術的塔傷就直接收掉（兩張合計也算）。 */
  private finisher(s: Sit): boolean {
    if (this.opts.skill < 0.5 && !this.chance(0.5)) return false;
    const spells = s.hand.filter((h) => h.ci.damageSpell);
    if (spells.length === 0) return false;
    for (const t of this.game.towers(this.enemy)) {
      if (!t.alive) continue;
      const need = t.hp - this.pendingTowerDamage(t);
      if (need <= 0) continue;
      let pick: HandCard | null = null;
      for (const h of spells) {
        if (h.ci.cost > s.elixir) continue;
        if (spellDamage(h.ci.spell!, true) >= need && (!pick || h.ci.cost < pick.ci.cost)) pick = h;
      }
      if (!pick) {
        // 兩張合計：先丟飛得慢的，第二張下次思考時補上
        for (const a of spells) {
          for (const b of spells) {
            if (a === b || a.ci.cost > s.elixir || a.ci.cost + b.ci.cost > s.elixir + s.rate * 1.5) continue;
            if (spellDamage(a.ci.spell!, true) + spellDamage(b.ci.spell!, true) < need) continue;
            if ((a.ci.spell!.speed || 1e9) <= (b.ci.spell!.speed || 1e9)) pick = a;
          }
        }
      }
      if (pick) return this.castAtTower(s, pick, t);
    }
    return false;
  }

  private castAtTower(s: Sit, h: HandCard, t: Entity): boolean {
    const st = h.ci.spell!;
    const plan = planSpell(s.spellCtx, h.id);
    if (plan && plan.tower === t) return this.castSpell(h, plan.x, plan.y, false);
    if (st.kind === 'roll') {
      // 滾木要從塔的前方（靠我方那側）往塔滾
      const vy = this.vy(t.y) + t.half + 0.5;
      return this.castSpell(h, t.x, this.wy(vy), false);
    }
    return this.castSpell(h, t.x, t.y, false);
  }

  /** 延長賽最後幾秒：塔血決定勝負時，用法術削對方最低血量的塔。 */
  private tiebreakChip(s: Sit): boolean {
    const g = this.game;
    if (!s.overtime || g.timeLeft > 20 || s.lead !== 0) return false;
    const mine = Math.min(...g.towers(this.team).filter((t) => t.alive).map((t) => t.hp));
    const theirs = g.towers(this.enemy).filter((t) => t.alive).sort((a, b) => a.hp - b.hp);
    if (theirs.length === 0) return false;
    const low = theirs[0];
    const margin = low.hp - this.pendingTowerDamage(low) - mine;
    if (margin < 0) return false; // 已經領先
    const spells = s.hand.filter((h) => h.ci.damageSpell && h.ci.cost <= s.elixir);
    const dmgOf = (h: HandCard) => spellDamage(h.ci.spell!, true);
    spells.sort((a, b) => dmgOf(b) - dmgOf(a));
    const h = spells.find((x) => dmgOf(x) > margin) ?? (g.timeLeft < 8 ? spells[0] : undefined);
    return h ? this.castAtTower(s, h, low) : false;
  }

  /**
   * 雙倍能量後，對方有塔血量已低到幾發法術就能收掉時，像真人一樣用法術慢慢削（順便打到塔邊的部隊更好）。
   */
  private chipTower(s: Sit): boolean {
    const g = this.game;
    if (s.mult < 2 && !(g.timeLeft < 30 && s.lead <= 0)) return false;
    if (s.threats.some((t) => t.eta < 5 && t.value >= 2)) return false;
    const towers = g.towers(this.enemy).filter((t) => t.alive).sort((a, b) => a.hp - b.hp);
    if (towers.length === 0) return false;
    const low = towers[0];
    const need = low.hp - this.pendingTowerDamage(low);
    if (need <= 0) return false;
    let best: HandCard | null = null;
    let bestRate = 0;
    for (const h of s.hand) {
      if (!h.ci.damageSpell || h.ci.cost > s.elixir - Math.max(2.5, s.hold)) continue;
      const dmg = spellDamage(h.ci.spell!, true);
      // 延長賽（先拿塔就贏）可以從更遠的血量開始削；一般雙倍能量時只削快倒的塔
      if (need > dmg * (s.overtime ? 8 : 3)) continue;
      const rate = dmg / h.ci.cost;
      if (rate > bestRate) {
        bestRate = rate;
        best = h;
      }
    }
    if (!best || bestRate < 35) return false;
    return this.castAtTower(s, best, low);
  }

  // ───────── 防守 ─────────

  private defend(s: Sit): boolean {
    const list = s.threats.filter((t) => t.eta < 11).sort((a, b) => a.eta - b.eta);
    for (const th of list) if (this.planDefense(s, th)) return true;
    // 遠方還有大推進正在過來：先存能量
    for (const th of s.threats) if (th.eta >= 11 && th.value >= 4) s.hold = Math.max(s.hold, 3);
    return false;
  }

  /**
   * 對一路威脅比較每張手牌在不同時間點、不同位置出手的結果，與「交給塔處理」的差距（能量當量）。
   * 最佳選項是現在出就出；要再等一下就先保留能量。
   */
  private planDefense(s: Sit, th: Threat): boolean {
    const base = this.score(this.clash(th, null, null, 0), 0, th, s);
    const opts: DefOption[] = [];
    for (const h of s.hand) {
      const o = this.defOption(s, th, h, base);
      if (o) opts.push(o);
    }
    if (opts.length === 0) return false;
    opts.sort((a, b) => b.gain - a.gain);
    let best = opts[0];
    if (best.gain < this.opts.minGain) return false;
    if (!this.chance(this.opts.skill)) {
      // 判斷失誤：從還說得過去的選項裡隨便挑
      const pool = opts.filter((o) => o.gain > Math.min(0, best.gain - 4));
      best = this.rng.pick(pool);
    }
    if (this.trace) this.why = `L${th.lane} ${opts.map((o) => `${o.h.id}:${o.gain.toFixed(1)}${o.delay ? `(+${o.delay})` : ''}`).join(' ')}`;
    if (best.delay === 0) return this.execDefense(best);
    if (best.delay < 5) s.hold = Math.max(s.hold, best.h.ci.cost);
    return false;
  }

  /** 這張牌對這路威脅的最佳出手時機與位置。 */
  private defOption(s: Sit, th: Threat, h: HandCard, base: number): DefOption | null {
    const ci = h.ci;
    if (ci.kind === 'spell' ? !ci.damageSpell : ci.hunter || !ci.st || ci.pump) return null;
    let best: DefOption | null = null;
    for (const d of DELAYS.slice(0, Math.max(1, this.opts.plan))) {
      if (ci.cost > s.elixir + s.rate * d + 1e-6) continue; // 到時候能量還不夠
      if (d > 0 && d > th.eta + 1.5) break; // 等到敵人已經打塔之後就沒意義了
      let gain: number;
      let plan: SpellPlan | null = null;
      let place: Place | null = null;
      if (ci.kind === 'spell') {
        plan = planSpell({ ...s.spellCtx, delay: d }, h.id, th.foes);
        if (!plan || plan.hits.length === 0 || plan.value < 0.5) continue;
        gain = this.score(this.clash(th, null, plan, d), ci.cost, th, s) - base;
        // 大法術盡量留給價值與收塔
        if (ci.cost >= 4 && plan.hits.length <= 1 && !plan.tower) gain -= 0.8;
      } else {
        place = this.defPlace(ci, th, d);
        gain = this.score(this.clash(th, { ci, place }, null, d), ci.cost, th, s) - base;
        if (ci.swarm) gain -= this.spellRisk(ci) * ci.cost * 0.5;
        // 便宜的牽制兵對單一重型近戰：交戰模擬沒算到「拉到兩座塔中間」
        if (ci.cost <= 2 && th.foes.length <= 2 && th.front.st.hp >= 1200 && th.front.st.targets !== 'buildings') gain += 0.5;
        // 建築留給對手只打建築的核心
        if (ci.kind === 'building' && th.hunters.length === 0 && this.enemyMayHoldHunter()) gain -= 1;
      }
      gain -= d * 0.15; // 越晚出越不確定
      if (!best || gain > best.gain) best = { h, gain, plan, place, delay: d };
    }
    return best;
  }

  private execDefense(o: DefOption): boolean {
    if (o.plan) return this.castSpell(o.h, o.plan.x, o.plan.y, true);
    return this.deployOwn(o.h, o.place!.x, o.place!.vy);
  }

  private score(r: ClashResult, cost: number, th: Threat, s: Sit): number {
    const hpe = this.hpPerElixir(th.tower, s);
    return (
      -r.towerDamage / hpe - r.towersLost * (s.overtime ? 40 : 8) + r.enemyTowerDamage / 400 - r.enemyRemain * 0.75 + r.ourRemain * 0.5 - cost
    );
  }

  /** 我方附近的部隊與建築（會參與這場防守）。 */
  private nearThreat(e: Entity, th: Threat): boolean {
    for (const f of th.foes) if (Math.hypot(e.x - f.x, e.y - f.y) <= 8) return true;
    return false;
  }

  /** 用簡化交戰模擬估計：場上狀況（＋ delay 秒後出的候選部隊或法術）在接下來 11 秒的結果。 */
  private clash(th: Threat, cand: { ci: CardInfo; place: Place } | null, plan: SpellPlan | null, delay: number): ClashResult {
    const g = this.game;
    const list: ClashUnit[] = [];
    const [fx, fy] = foePos(g, th.front, 1);
    for (const t of g.towers(this.team)) {
      if (!t.alive) continue;
      if (t.unit === 'princess' && t.lane !== th.lane && distTo(fx, fy, t) > t.stats.range + 2) continue;
      list.push(clashUnit(0, 'tower', t.stats, t.x, t.y, { hp: t.hp, active: t.active, ready: t.activateTimer, ref: t.id, lockRef: t.locked ? t.targetId : -1 }));
    }
    // 對方這一路的側塔：追過河的防守部隊會被它打
    const et = g.towers(this.enemy).find((t) => t.alive && t.unit === 'princess' && t.lane === th.lane);
    if (et) list.push(clashUnit(1, 'tower', et.stats, et.x, et.y, { hp: et.hp, ref: et.id }));
    for (const e of g.entities) {
      if (!e.alive || e.team !== this.team || e.kind === 'tower' || !this.nearThreat(e, th)) continue;
      list.push(clashUnit(0, e.kind, e.stats, e.x, e.y, {
        hp: e.hp, value: unitValue(e.unit, e.cardId), ready: Math.max(e.deployTimer, e.stunTimer), ref: e.id,
        lockRef: e.locked ? e.targetId : -1, charging: e.charging, rampT: e.rampTime,
      }));
    }
    if (cand) {
      const st = cand.ci.st!;
      const sign = this.team === 0 ? 1 : -1;
      const wx = cand.place.x;
      const wyy = this.wy(cand.place.vy);
      const value = unitValue(cand.ci.def.unit!, cand.ci.id);
      const kind = cand.ci.kind === 'building' ? 'building' : 'troop';
      for (const [ox, oy] of formationOffsets(kind === 'building' ? 1 : cand.ci.count)) {
        list.push(clashUnit(0, kind, st, wx + ox, wyy + oy * sign, { value, ready: delay + st.deployTime + 0.1, exists: delay }));
      }
    }
    const hits: ClashHit[] = [];
    const stun = plan ? (CARDS[plan.cardId].spell!.stun ?? 0) : 0;
    for (const f of th.foes) {
      const e = f.e;
      const u = clashUnit(1, f.kind, f.st, f.x, f.y, {
        hp: f.hp, value: f.value, ready: e ? Math.max(e.deployTimer, e.stunTimer, e.kbTime) : f.appear + f.deploy, exists: e ? 0 : f.appear,
        ref: e ? e.id : -1, lockRef: e && e.locked ? e.targetId : -1, charging: !!e?.charging, rampT: e?.rampTime ?? 0,
      });
      list.push(u);
      if (plan) for (const x of plan.hits) if (x.foe === f) hits.push({ u, dmg: x.dmg, at: delay + plan.land, stun });
    }
    return runClash(list, 11, 0.2, hits, this.clashTrace ?? undefined);
  }

  /** delay 秒後出牌的防守位置（己方視角）。 */
  private defPlace(ci: CardInfo, th: Threat, delay: number): Place {
    const g = this.game;
    const st = ci.st!;
    const tc = th.lane === 0 ? 1 : -1; // 朝場地中央的方向
    const tx = th.tower.x;
    const tvy = this.vy(th.tower.y);
    const [fx, fyw] = foePos(g, th.front, delay + st.deployTime + 0.3);
    const fvy = this.vy(fyw);
    const fst = th.front.st;
    const at = (x: number, vy: number): Place => ({
      x: Math.max(0.5, Math.min(ARENA.width - 0.5, x)),
      vy: Math.max(ARENA.riverBottom + 0.5, Math.min(ARENA.height - 0.5, vy)),
    });

    if (ci.kind === 'building') {
      const hunter = th.hunters.find((h) => !h.e?.locked);
      if (hunter) {
        const spot = this.pullSpot(ci, th, hunter, delay);
        if (spot) return at(spot[0], spot[1]);
      }
      // 不是只打建築的威脅：放在塔前偏中央，負責輸出與吸引火力
      return at(tx + tc * 2.5, tvy - 3);
    }
    if (ci.spirit) return at(fx, fvy + 2);
    const canHitAir = th.foes.some((f) => f.st.targets === 'air-ground' && f.st.damage > 0);
    if (ci.flying && (!canHitAir || ci.swarm)) return at(fx, fvy + 1);
    if (ci.ranged) {
      // 遠程站在塔後方（只有打建築的敵人時可以站前面一點）
      const safe = !th.troopHitters;
      return at(tx + tc * (safe ? 2.5 : 1.5), safe ? tvy - 1.5 : tvy + 3);
    }
    const big = fst.hp >= 1200 && !fst.flying;
    if ((ci.swarm || ci.count >= 4) && big) return at(fx, fvy + 0.6);
    if (fst.targets === 'buildings' && !fst.flying) return at(fx + tc * 0.8, fvy + 1.2);
    // 在敵人前方攔截，稍微往中間拉，讓兩座塔都打得到
    if (fvy < 19.5) return at(fx + (ARENA.width / 2 - fx) * 0.35, 20.5);
    return at(fx + tc, fvy + 1.5);
  }

  /** 建築拉怪點：比塔更靠近只打建築的敵人，且在場地中央（兩座塔都打得到）。 */
  private pullSpot(ci: CardInfo, th: Threat, hunter: Foe, delay: number): [number, number] | null {
    const g = this.game;
    const tc = th.lane === 0 ? 1 : -1;
    const [hx, hy] = foePos(g, hunter, delay + ci.st!.deployTime);
    const dTower = distTo(hx, hy, th.tower);
    const half = ci.st!.half ?? 1;
    const cands: [number, number][] = [[9 - tc, 21], [9 - tc, 22], [9 - 2 * tc, 21], [9, 21], [9 - 2 * tc, 22], [9 - 3 * tc, 22], [9 - 2 * tc, 23], [9 - 3 * tc, 23]];
    for (const [x, vy] of cands) {
      const [sx, sy] = g.snap(ci.id, x, this.wy(vy));
      if (!g.canDeployAt(this.team, ci.id, sx, sy)) continue;
      const dx = Math.max(0, Math.abs(hx - sx) - half);
      const dy = Math.max(0, Math.abs(hy - sy) - half);
      const d = Math.hypot(dx, dy);
      if (d < dTower - 0.6 && d <= hunter.st.sight + 1.5) return [sx, this.vy(sy)];
    }
    return null;
  }

  // ───────── 價值法術 ─────────

  private valueSpell(s: Sit): boolean {
    let best: { h: HandCard; plan: SpellPlan; score: number } | null = null;
    for (const h of s.hand) {
      if (!h.ci.damageSpell || h.ci.cost > s.elixir) continue;
      const plan = planSpell(s.spellCtx, h.id);
      if (!plan) continue;
      if (plan.value < h.ci.cost * this.opts.spellValue) continue;
      // 像真人一樣：要打死東西、一次打到好幾個，或連塔一起打，才值得交法術
      const kills = plan.hits.filter((x) => x.dmg >= x.foe.hp).length;
      if (kills === 0 && plan.hits.length < 2 && !plan.tower) continue;
      // 為防守保留的能量不拿來丟法術，除非這發非常划算
      if (s.elixir - h.ci.cost < s.hold - 0.01 && plan.value < h.ci.cost * 1.8) continue;
      const sc = plan.value - h.ci.cost;
      if (!best || sc > best.score) best = { h, plan, score: sc };
    }
    return best ? this.castSpell(best.h, best.plan.x, best.plan.y, true) : false;
  }

  // ───────── 進攻 ─────────

  /** 己方正在往前推的部隊（依路線）。 */
  private ownPush(lane: 0 | 1): Entity[] {
    return this.game.entities.filter((e) => {
      if (!e.alive || e.team !== this.team || e.kind !== 'troop' || this.laneOf(e.x) !== lane) return false;
      const vy = this.vy(e.y);
      if (vy > 27 || vy < 6) return false;
      // 往前走（vy 變小）或已在對方半場
      return vy < ARENA.riverTop || this.vy(e.y) < this.vy(e.py) - 1e-4;
    });
  }

  /** 替推進中的坦克補後排，或替防守後存活的部隊補前排（反攻）。 */
  private support(s: Sit): boolean {
    if (s.hand.length === 0 || !this.chance(this.opts.counterPush)) return false;
    if (s.threats.some((t) => t.eta < 4 && t.value >= 2)) return false;
    const room = s.elixir - this.reserve(s);
    for (const lane of [0, 1] as const) {
      const ours = this.ownPush(lane);
      if (ours.length === 0) continue;
      const value = ours.reduce((sum, e) => sum + unitValue(e.unit, e.cardId) * (e.hp / e.maxHp), 0);
      if (value < 2.5) continue;
      const tanks = ours.filter((e) => e.stats.hp >= 1200 || e.stats.targets === 'buildings').sort((a, b) => this.vy(a.y) - this.vy(b.y));
      const tank = tanks[0];
      if (tank) {
        const tvy = this.vy(tank.y);
        if (tvy < 14 || tvy > 25.5) continue;
        // 已經有後排就不再補；能量充裕（或雙倍能量）時可以補到兩張
        const backed = ours.filter((e) => e !== tank && (e.stats.range >= 3 || e.stats.flying) && Math.hypot(e.x - tank.x, e.y - tank.y) < 6).length;
        const want = s.mult >= 2 || s.elixir >= 7 ? 2 : 1;
        if (backed >= want) continue;
        const pick = this.bestSupport(s, room, (ci) => ci.kind === 'troop' && !ci.hunter && (ci.ranged || ci.splash > 0 || (ci.flying && ci.swarm)));
        if (pick) return this.deployOwn(pick, tank.x, Math.max(ARENA.riverBottom + 0.5, tvy + 2.5));
        continue;
      }
      const fwd = ours.reduce((a, b) => (this.vy(b.y) < this.vy(a.y) ? b : a));
      const fvy = this.vy(fwd.y);
      if (fvy > 23 || value < 3) continue;
      const pick = this.bestSupport(s, room, (ci) => ci.kind === 'troop' && (ci.tank || ci.bruiser || ci.hunter) && !ci.flying);
      if (pick) return this.deployOwn(pick, fwd.x, Math.max(ARENA.riverBottom + 0.5, fvy - 1.5));
    }
    return false;
  }

  private bestSupport(s: Sit, room: number, ok: (ci: CardInfo) => boolean): HandCard | null {
    let best: HandCard | null = null;
    let bestV = -Infinity;
    const swarmy = [...this.model.seen].some((id) => cardInfo(id).swarm);
    const airy = [...this.model.seen].some((id) => cardInfo(id).flying);
    for (const h of s.hand) {
      const ci = h.ci;
      if (ci.cost > room || ci.cost > s.elixir || !ok(ci)) continue;
      let v = ci.dps / 120 + (ci.splash > 0 ? 1.2 : 0) + (ci.ranged ? 0.8 : 0) + ci.hp / 1500 - ci.cost * 0.35;
      if (swarmy && ci.splash > 0) v += 0.8;
      if (airy && ci.hitsAir) v += 0.5;
      v += this.rng.range(0, 0.4);
      if (v > bestV) {
        bestV = v;
        best = h;
      }
    }
    return best;
  }

  private attackLane(s: Sit): 0 | 1 {
    const g = this.game;
    const score = [0, 0];
    for (const lane of [0, 1] as const) {
      const p = g.towers(this.enemy).find((t) => t.unit === 'princess' && t.lane === lane);
      score[lane] = p && p.alive ? p.hp : g.king(this.enemy).hp * 0.75;
      for (const e of this.ownPush(lane)) score[lane] -= unitValue(e.unit, e.cardId) * 150;
    }
    // 對手剛在後場下重注：打另一路
    for (const f of s.foes) {
      if (f.kind === 'troop' && f.value >= 4 && this.vy(f.y) < 13) score[this.laneOf(f.x)] += 500;
    }
    score[this.lane] -= 150;
    this.lane = score[0] <= score[1] ? 0 : 1;
    return this.lane;
  }

  private pocketOpen(lane: 0 | 1): boolean {
    return this.opts.pocket && this.game.towers(this.enemy).some((t) => t.unit === 'princess' && t.lane === lane && !t.alive);
  }

  private push(s: Sit, force: boolean): boolean {
    const g = this.game;
    const urgent = s.threats.some((t) => t.eta < 7 && t.value >= 1.5);
    const tracking = this.opts.track >= 0.5;
    let punish = tracking && s.enemyElixir <= 2.5 && !urgent;
    let tankOnly = false;
    if (!force) {
      if (urgent) return false;
      let thr = this.opts.pushElixir;
      if (s.mult >= 3) thr -= 3;
      else if (s.mult >= 2) thr -= 2;
      if (tracking && s.elixir - s.enemyElixir >= 3) thr -= 1.5;
      if (s.overtime && s.mult < 3) thr += 0.5;
      if (!s.overtime && g.timeLeft < 40) thr += s.lead < 0 ? -2 : s.lead > 0 ? 1.5 : 0;
      if (s.threats.some((t) => t.value >= 4)) thr += 1;
      // 沒有威脅時，坦克可以早一點下在後場（下完還留一點能量補後排）
      const calm = !s.threats.some((t) => t.eta < 9 && t.value >= 2);
      tankOnly = calm && s.elixir < thr && s.hand.some((h) => h.ci.tank && s.elixir >= h.ci.cost + (s.mult >= 2 ? 0.5 : 1.5));
      if (s.elixir < thr && !punish && !tankOnly) return false;
      // 能量夠多就照常進攻；只有在能量不足門檻、靠「對手沒能量」出手時才算懲罰
      if (s.elixir >= thr || tankOnly) punish = false;
      else if (!s.hand.some((h) => (h.ci.win || h.ci.bruiser || h.ci.tank) && h.ci.cost <= s.elixir - s.hold)) return false;
    }
    const lane = this.attackLane(s);
    // 懲罰時不必保留一般預備能量，但為即將到來的防守保留的能量不能動
    const room = force ? s.elixir : s.elixir - (punish ? s.hold : this.reserve(s));
    let best: HandCard | null = null;
    let bestV = -Infinity;
    for (const h of s.hand) {
      const ci = h.ci;
      if (ci.cost > room || ci.cost > s.elixir) continue;
      if (ci.kind === 'building' || (ci.kind === 'spell' && ci.spell?.kind !== 'barrel' && !ci.spell?.graveyard)) continue;
      if (punish && !(ci.win || ci.bruiser || ci.tank)) continue;
      if (tankOnly && !ci.tank) continue;
      const v = this.pushScore(ci, s, punish);
      if (v > bestV) {
        bestV = v;
        best = h;
      }
    }
    if (!best || (bestV < 0 && !force)) return false;
    if (!this.chance(this.opts.skill)) {
      // 失誤：隨便挑一張能出的部隊牌
      const pool = s.hand.filter((h) => h.ci.cost <= room && h.ci.cost <= s.elixir && h.ci.kind === 'troop');
      if (pool.length) best = this.rng.pick(pool);
    }
    return this.pushDeploy(best, lane, punish || s.mult >= 2);
  }

  private pushScore(ci: CardInfo, s: Sit, punish: boolean): number {
    let v: number;
    if (ci.spell?.kind === 'barrel' || ci.spell?.graveyard) {
      // 飛桶、墓地是這副牌主要的勝利條件：對手小法術可能在手上時價值降低，但仍要定期丟出去逼對手交法術
      v = 2.2 + (punish ? 2.5 : 0);
      if (this.opts.track >= 0.5) {
        let answers = 0;
        for (const id of ['zap', 'log', 'arrows', 'fireball', 'poison']) if (this.model.mayHold(id) && CARDS[id].cost <= s.enemyElixir) answers++;
        v -= Math.min(2, answers) * 0.8;
      }
    } else if (ci.tank) {
      v = 3;
      if (s.elixir < ci.cost + (s.mult >= 2 ? 0 : 1)) v -= 5; // 坦克下完要還有能量補後排
      if (s.mult >= 2) v += 1;
    } else if (ci.win) v = 2.6 + (punish ? 2.5 : 0);
    else if (ci.ranged && !ci.swarm) v = 1.2;
    else if (ci.bruiser) v = 1 + (punish ? 1 : 0);
    else if (ci.swarm || ci.spirit) v = 0.4 + (punish && !ci.spirit ? 0.8 : 0);
    else v = 0.6;
    if (ci.swarm) v -= this.spellRisk(ci) * 1.5;
    // 對手有飛行核心時，唯一的對空牌留著防守
    if (ci.hitsAir && this.opts.track >= 0.5 && [...this.model.seen].some((id) => cardInfo(id).flying && cardInfo(id).win && this.model.mayHold(id))) {
      const others = s.hand.filter((h) => h.ci !== ci && h.ci.hitsAir && h.ci.kind !== 'spell').length;
      if (others === 0) v -= 1.5;
    }
    return v + this.rng.range(0, 0.8);
  }

  private pushDeploy(h: HandCard, lane: 0 | 1, fast: boolean): boolean {
    const g = this.game;
    const ci = h.ci;
    const bx = ARENA.bridgeXs[lane];
    const tc = lane === 0 ? 1 : -1;
    if (ci.tunnel) return this.deployTunnel(h, lane);
    if (ci.spell?.graveyard) {
      // 墓地：蓋在塔上，骷髏從塔的四周冒出來
      const p = g.towers(this.enemy).find((t) => t.unit === 'princess' && t.lane === lane && t.alive);
      const t = p ?? g.king(this.enemy);
      return this.castSpell(h, t.x, t.y, true);
    }
    if (ci.spell?.kind === 'barrel') {
      const p = g.towers(this.enemy).find((t) => t.unit === 'princess' && t.lane === lane && t.alive);
      const t = p ?? g.king(this.enemy);
      // 落在塔的前緣，哥布林一落地就能打塔
      return this.castSpell(h, t.x + (p ? 0 : -tc * 1.2), this.wy(this.vy(t.y) + t.half + 0.7), true);
    }
    if (this.pocketOpen(lane) && (ci.win || ci.tank || ci.bruiser)) return this.deployOwn(h, bx + tc * 1.5, 11.5, true, true);
    if (ci.tank) {
      if (ci.cost >= 7 || !fast) return this.deployOwn(h, ci.cost >= 7 ? 9 - tc * 1.5 : bx, ci.cost >= 7 ? 31.5 : 28.5);
      return this.deployOwn(h, bx, 18.5);
    }
    if (ci.win) return this.deployOwn(h, bx, ci.st?.charge ? 20.5 : ci.flying ? 19.5 : 18.5);
    if (ci.ranged) return this.deployOwn(h, bx + tc * 0.5, 29.5);
    if (ci.bruiser) return this.deployOwn(h, bx, fast ? 18.5 : 28.5);
    return this.deployOwn(h, fast ? bx : bx - tc * 2.5, fast ? 18.5 : 30.5);
  }

  /** 能量快滿了還沒出牌：照常推進；不行就把便宜部隊放後場。 */
  private avoidLeak(s: Sit): boolean {
    const soon = this.opts.skill >= 0.5 && s.elixir + s.rate * this.opts.reaction * 1.1 >= MATCH.maxElixir;
    if (s.elixir < this.opts.leak && !soon) return false;
    if (this.push(s, true)) return true;
    const troops = s.hand.filter((h) => h.ci.kind === 'troop' && h.ci.cost <= s.elixir).sort((a, b) => a.ci.cost - b.ci.cost);
    if (troops.length) return this.deployOwn(troops[0], ARENA.bridgeXs[this.lane], 30.5);
    // 只剩建築：對手有只打建築的牌時，預先放在拉怪點
    const b = s.hand.find((h) => h.ci.kind === 'building' && !h.ci.pump && h.ci.cost <= s.elixir);
    if (b && [...this.model.seen].some((id) => cardInfo(id).hunter)) return this.deployOwn(b, 9 - (this.lane === 0 ? 1 : -1), 22);
    return false;
  }

  // ───────── 出牌 ─────────

  /** 在己方視角 (x, vy) 附近找合法位置出部隊／建築。 */
  private deployOwn(h: HandCard, x: number, vy: number, noisy = true, pocket = false): boolean {
    const g = this.game;
    if (h.ci.cost > g.players[this.team].elixir) return false;
    const n = noisy ? this.opts.noise : 0;
    if (n > 0) {
      x += this.rng.range(-n, n);
      vy += this.rng.range(-n, n) * 0.6;
    }
    for (const [ox, oy] of SEARCH) {
      const px = Math.max(0.5, Math.min(ARENA.width - 0.5, x + ox));
      const pvy = Math.max(0.5, Math.min(ARENA.height - 0.5, vy + oy));
      const [sx, sy] = g.snap(h.id, px, this.wy(pvy));
      // 沒有要進前進區時，只放在己方半場
      if (!pocket && this.vy(sy) - (h.ci.kind === 'building' ? (h.ci.st?.half ?? 1) : 0) < ARENA.riverBottom) continue;
      if (!g.canDeployAt(this.team, h.id, sx, sy)) continue;
      const ok = g.deploy(this.team, h.index, sx, sy).ok;
      if (ok && this.trace) this.why += ` => ${h.id}@${sx.toFixed(1)},${this.vy(sy).toFixed(1)}`;
      return ok;
    }
    return false;
  }

  /** 法術出手（世界座標）；準度較差的電腦會偏一點。 */
  private castSpell(h: HandCard, x: number, y: number, noisy: boolean): boolean {
    const g = this.game;
    if (h.ci.cost > g.players[this.team].elixir) return false;
    const n = noisy ? this.opts.noise * 0.35 : 0;
    if (n > 0) {
      x += this.rng.range(-n, n);
      y += this.rng.range(-n, n);
    }
    x = Math.max(0.5, Math.min(ARENA.width - 0.5, x));
    y = Math.max(0.5, Math.min(ARENA.height - 0.5, y));
    const ok = g.deploy(this.team, h.index, x, y).ok;
    if (ok && this.trace) this.why += ` => ${h.id}@${x.toFixed(1)},${this.vy(y).toFixed(1)}`;
    return ok;
  }
}
