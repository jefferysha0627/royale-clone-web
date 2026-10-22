import { ARENA, DEPLOY, DT, MATCH, SEPARATION_STRENGTH, SPELL_TRAVEL_SPEED, TOWERS, TOWER_LAYOUT } from './config';
import { CARDS, type CardDef, type UnitStats } from './cards';
import { Rng } from './rng';

export type Team = 0 | 1;
export type EntityKind = 'troop' | 'building' | 'tower';
export type Phase = 'regular' | 'overtime' | 'ended';

export interface Entity {
  id: number;
  team: Team;
  kind: EntityKind;
  cardId: string; // 塔為 'king' / 'princess'
  lane: number; // 側塔所在路線（0 左、1 右），其餘為 -1
  x: number;
  y: number;
  px: number; // 上一步位置（渲染內插用）
  py: number;
  hp: number;
  maxHp: number;
  stats: UnitStats;
  alive: boolean;
  targetId: number;
  locked: boolean;
  attacking: boolean;
  cooldown: number;
  deployTimer: number;
  stunTimer: number;
  lifetime: number;
  active: boolean; // 國王塔被喚醒前不攻擊
  avoidSide: number; // 繞過塔／建築時固定往哪一側（0 = 目前沒有繞行），避免左右抖動
}

export interface Projectile {
  id: number;
  team: Team;
  x: number;
  y: number;
  targetId: number;
  tx: number;
  ty: number;
  speed: number;
  damage: number;
  splash: number;
  hitsAir: boolean;
  hitsGround: boolean;
  sourceCard: string;
  done: boolean;
}

export interface PendingSpell {
  id: number;
  team: Team;
  cardId: string;
  x: number;
  y: number;
  delay: number;
  totalDelay: number;
  fromX: number;
  fromY: number;
}

export type GameEvent =
  | { type: 'deploy'; team: Team; cardId: string; x: number; y: number }
  | { type: 'attack'; id: number; cardId: string; x: number; y: number; tx: number; ty: number; ranged: boolean }
  | { type: 'hit'; id: number; x: number; y: number; amount: number; isTower: boolean }
  | { type: 'death'; id: number; team: Team; kind: EntityKind; cardId: string; x: number; y: number }
  | { type: 'towerDown'; team: Team; isKing: boolean; x: number; y: number; cascade?: boolean }
  | { type: 'spell'; team: Team; cardId: string; x: number; y: number; radius: number }
  | { type: 'phase'; phase: Phase }
  | { type: 'doubleElixir' }
  | { type: 'end'; result: MatchResult };

export interface PlayerState {
  elixir: number;
  hand: string[];
  queue: string[]; // queue[0] 為下一張
  crowns: number;
  cardsPlayed: number;
  elixirSpent: number;
}

export interface MatchResult {
  winner: Team | null;
  crowns: [number, number];
  reason: 'king' | 'time' | 'overtime' | 'tiebreak' | 'draw';
  time: number;
}

export type DeployFailReason = 'ended' | 'card' | 'elixir' | 'zone';
export type DeployResult = { ok: true } | { ok: false; reason: DeployFailReason };

export interface GameOptions {
  seed: number;
  decks: [string[], string[]];
}

const H = ARENA.height;

/** 以隊伍 0 的視角換算 y（隊伍 1 鏡射）。 */
export function viewY(team: Team, y: number): number {
  return team === 0 ? y : H - y;
}

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by);
}

function towerStats(type: 'king' | 'princess'): UnitStats {
  const t = TOWERS[type];
  return {
    hp: t.hp, damage: t.damage, hitSpeed: t.hitSpeed, firstHit: 0.3, range: t.range, sight: t.range,
    speed: 0, radius: t.radius, mass: 1000, flying: false, targets: 'air-ground', projectileSpeed: t.projectileSpeed,
  };
}

const FORMATIONS: Record<number, [number, number][]> = {
  1: [[0, 0]],
  2: [[-0.5, 0], [0.5, 0]],
  3: [[0, -0.5], [-0.55, 0.4], [0.55, 0.4]],
  4: [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]],
};

export class Game {
  readonly rng: Rng;
  readonly seed: number;
  time = 0;
  tick = 0;
  phase: Phase = 'regular';
  timeLeft = MATCH.regularTime;
  players: [PlayerState, PlayerState];
  entities: Entity[] = [];
  projectiles: Projectile[] = [];
  spells: PendingSpell[] = [];
  events: GameEvent[] = [];
  result: MatchResult | null = null;
  private nextId = 1;

  constructor(opts: GameOptions) {
    this.seed = opts.seed;
    this.rng = new Rng(opts.seed);
    this.players = [this.makePlayer(opts.decks[0]), this.makePlayer(opts.decks[1])];
    for (const team of [0, 1] as Team[]) {
      for (const t of TOWER_LAYOUT) {
        const x = team === 0 ? t.x : ARENA.width - t.x;
        const e = this.spawnEntity(team, 'tower', t.type, towerStats(t.type), x, viewY(team, t.y));
        // 隊伍 1 鏡射後左右互換，lane 依實際 x 判定（0 = 左側）
        e.lane = t.type === 'princess' ? (x < ARENA.width / 2 ? 0 : 1) : -1;
        e.active = t.type === 'princess';
      }
    }
  }

  private makePlayer(deck: string[]): PlayerState {
    const shuffled = this.rng.shuffle([...deck]);
    return {
      elixir: MATCH.startElixir,
      hand: shuffled.slice(0, MATCH.handSize),
      queue: shuffled.slice(MATCH.handSize),
      crowns: 0,
      cardsPlayed: 0,
      elixirSpent: 0,
    };
  }

  private spawnEntity(team: Team, kind: EntityKind, cardId: string, stats: UnitStats, x: number, y: number): Entity {
    const e: Entity = {
      id: this.nextId++, team, kind, cardId, lane: -1, x, y, px: x, py: y,
      hp: stats.hp, maxHp: stats.hp, stats, alive: true, targetId: -1, locked: false, attacking: false,
      cooldown: 0, deployTimer: 0, stunTimer: 0, lifetime: Infinity, active: true, avoidSide: 0,
    };
    this.entities.push(e);
    return e;
  }

  get(id: number): Entity | undefined {
    // 實體數量很少，線性搜尋即可
    for (const e of this.entities) if (e.id === id) return e;
    return undefined;
  }

  towers(team: Team): Entity[] {
    return this.entities.filter((e) => e.kind === 'tower' && e.team === team);
  }

  elixirMultiplier(): number {
    if (this.phase === 'overtime') return MATCH.overtimeElixirMultiplier;
    if (this.phase === 'regular' && this.timeLeft <= MATCH.doubleElixirAt) return MATCH.doubleElixirMultiplier;
    return 1;
  }

  // ───────── 部署 ─────────

  /** 該隊伍在 (x, y) 是否可部署此卡。 */
  canDeployAt(team: Team, cardId: string, x: number, y: number): boolean {
    const card = CARDS[cardId];
    if (!card) return false;
    const m = DEPLOY.edgeMargin;
    if (x < m || x > ARENA.width - m || y < m || y > H - m) return false;
    if (card.kind === 'spell') return true;
    const vy = viewY(team, y);
    let minY = DEPLOY.ownMinY;
    const enemy: Team = team === 0 ? 1 : 0;
    for (const t of this.towers(enemy)) {
      if (t.cardId === 'princess' && !t.alive && (x < ARENA.width / 2 ? 0 : 1) === t.lane) minY = DEPLOY.pocketMinY;
    }
    if (vy < minY) return false;
    // 河道與橋面不可部署（包含推倒側塔後開放的前進區）
    if (vy > ARENA.riverTop - 0.5 && vy < ARENA.riverBottom + 0.5) return false;
    const r = card.unit?.radius ?? 0.5;
    for (const e of this.entities) {
      if (!e.alive || (e.kind !== 'tower' && e.kind !== 'building')) continue;
      if (dist(x, y, e.x, e.y) < e.stats.radius + (card.kind === 'building' ? r : 0) + DEPLOY.towerClearance) return false;
    }
    return true;
  }

  deploy(team: Team, handIndex: number, x: number, y: number): DeployResult {
    if (this.phase === 'ended') return { ok: false, reason: 'ended' };
    const p = this.players[team];
    const cardId = p.hand[handIndex];
    const card = cardId ? CARDS[cardId] : undefined;
    if (!card) return { ok: false, reason: 'card' };
    if (p.elixir < card.cost) return { ok: false, reason: 'elixir' };
    if (!this.canDeployAt(team, cardId, x, y)) return { ok: false, reason: 'zone' };

    p.elixir -= card.cost;
    p.elixirSpent += card.cost;
    p.cardsPlayed++;
    const next = p.queue.shift()!;
    p.hand[handIndex] = next;
    p.queue.push(cardId);

    this.events.push({ type: 'deploy', team, cardId, x, y });
    if (card.kind === 'spell') this.castSpell(team, card, x, y);
    else this.spawnCard(team, card, x, y);
    return { ok: true };
  }

  private spawnCard(team: Team, card: CardDef, x: number, y: number): void {
    const count = card.count ?? 1;
    const form = FORMATIONS[count] ?? FORMATIONS[1];
    const sign = team === 0 ? 1 : -1;
    for (const [ox, oy] of form) {
      const e = this.spawnEntity(team, card.kind === 'building' ? 'building' : 'troop', card.id, card.unit!, x + ox, y + oy * sign);
      e.deployTimer = MATCH.deployTime;
      if (card.lifetime) e.lifetime = card.lifetime;
      this.constrain(e, true);
    }
  }

  private castSpell(team: Team, card: CardDef, x: number, y: number): void {
    const king = this.towers(team).find((t) => t.cardId === 'king')!;
    const speed = card.spell!.travelSpeed ?? SPELL_TRAVEL_SPEED;
    const d = dist(king.x, king.y, x, y);
    const delay = speed > 0 ? d / speed : 0;
    this.spells.push({ id: this.nextId++, team, cardId: card.id, x, y, delay, totalDelay: delay, fromX: king.x, fromY: king.y });
  }

  // ───────── 模擬步進 ─────────

  /** 取出並清空累積的事件（部署與每次 step 產生的事件都會累積到被取出為止）。 */
  drainEvents(): GameEvent[] {
    const out = this.events;
    this.events = [];
    return out;
  }

  step(): void {
    if (this.phase === 'ended') return;
    this.tick++;
    this.time += DT;
    for (const e of this.entities) {
      e.px = e.x;
      e.py = e.y;
    }

    const mult = this.elixirMultiplier();
    for (const p of this.players) p.elixir = Math.min(MATCH.maxElixir, p.elixir + MATCH.elixirPerSecond * mult * DT);

    this.updateSpells();
    for (const e of this.entities) if (e.alive) this.updateEntity(e);
    this.resolveCollisions();
    this.updateProjectiles();
    this.entities = this.entities.filter((e) => e.alive || e.kind === 'tower');
    this.projectiles = this.projectiles.filter((p) => !p.done);
    this.updateClock();
  }

  private updateClock(): void {
    if (this.phase === 'ended') return;
    const before = this.timeLeft;
    this.timeLeft = Math.max(0, this.timeLeft - DT);
    if (this.phase === 'regular' && before > MATCH.doubleElixirAt && this.timeLeft <= MATCH.doubleElixirAt) {
      this.events.push({ type: 'doubleElixir' });
    }
    if (this.timeLeft > 0) return;
    const [a, b] = [this.players[0].crowns, this.players[1].crowns];
    if (this.phase === 'regular') {
      if (a !== b) this.finish(a > b ? 0 : 1, 'time');
      else {
        this.phase = 'overtime';
        this.timeLeft = MATCH.overtime;
        this.events.push({ type: 'phase', phase: 'overtime' });
      }
    } else if (this.phase === 'overtime') {
      // 延長賽結束仍平手：比較雙方「最低血量比例的塔」，較低者落敗（實作選擇）
      const low = (team: Team) => Math.min(...this.towers(team).filter((t) => t.alive).map((t) => t.hp / t.maxHp));
      const l0 = low(0);
      const l1 = low(1);
      if (Math.abs(l0 - l1) < 1e-9) this.finish(null, 'draw');
      else this.finish(l0 > l1 ? 0 : 1, 'tiebreak');
    }
  }

  private finish(winner: Team | null, reason: MatchResult['reason']): void {
    if (this.phase === 'ended') return;
    this.phase = 'ended';
    this.result = { winner, crowns: [this.players[0].crowns, this.players[1].crowns], reason, time: this.time };
    this.events.push({ type: 'end', result: this.result });
  }

  private updateSpells(): void {
    for (const s of this.spells) {
      s.delay -= DT;
      if (s.delay > 0) continue;
      const spell = CARDS[s.cardId].spell!;
      this.events.push({ type: 'spell', team: s.team, cardId: s.cardId, x: s.x, y: s.y, radius: spell.radius });
      for (const e of this.entities) {
        if (!e.alive || e.team === s.team) continue;
        if (dist(e.x, e.y, s.x, s.y) > spell.radius + e.stats.radius) continue;
        const amount = e.kind === 'tower' ? Math.round(spell.damage * spell.towerDamagePct) : spell.damage;
        this.applyDamage(e, amount);
        if (spell.stun && e.alive) {
          e.stunTimer = Math.max(e.stunTimer, spell.stun);
          e.cooldown = Math.max(e.cooldown, e.stats.firstHit);
          e.attacking = false;
        }
      }
    }
    this.spells = this.spells.filter((s) => s.delay > 0);
  }

  // ───────── 索敵 ─────────

  canTarget(attacker: Entity, target: Entity): boolean {
    if (!target.alive || target.team === attacker.team) return false;
    const t = attacker.stats.targets;
    if (t === 'buildings') return target.kind !== 'troop';
    if (t === 'ground') return !target.stats.flying;
    return true;
  }

  private edgeDist(a: Entity, b: Entity): number {
    return dist(a.x, a.y, b.x, b.y) - a.stats.radius - b.stats.radius;
  }

  private acquireTarget(e: Entity): Entity | null {
    let current = e.targetId >= 0 ? this.get(e.targetId) : undefined;
    if (current && !this.canTarget(e, current)) current = undefined;
    if (current && e.locked) return current;

    let best: Entity | null = null;
    let bestD = Infinity;
    const sight = e.stats.sight;
    const isStatic = e.stats.speed === 0;
    for (const o of this.entities) {
      if (!this.canTarget(e, o)) continue;
      const d = this.edgeDist(e, o);
      if (d > sight) continue;
      if (d < bestD) {
        bestD = d;
        best = o;
      }
    }
    // 視野內沒有目標時，可移動單位預設朝最近的敵方防禦塔前進（建築只在視野內才會吸引）
    if (!best && !isStatic) {
      for (const o of this.entities) {
        if (!o.alive || o.team === e.team || o.kind !== 'tower') continue;
        const d = this.edgeDist(e, o);
        if (d < bestD) {
          bestD = d;
          best = o;
        }
      }
    }
    if (!best || best.id !== e.targetId) {
      e.attacking = false;
      e.locked = false;
    }
    e.targetId = best ? best.id : -1;
    return best;
  }

  private updateEntity(e: Entity): void {
    e.cooldown = Math.max(0, e.cooldown - DT);
    if (e.lifetime !== Infinity) {
      e.lifetime -= DT;
      e.hp -= (e.maxHp / (CARDS[e.cardId].lifetime ?? 1)) * DT;
      if (e.hp <= 0 || e.lifetime <= 0) {
        this.kill(e);
        return;
      }
    }
    if (e.deployTimer > 0) {
      e.deployTimer -= DT;
      return;
    }
    if (e.stunTimer > 0) {
      e.stunTimer -= DT;
      return;
    }
    if (e.kind === 'tower' && !e.active) return;

    const target = this.acquireTarget(e);
    if (!target) return;

    if (this.edgeDist(e, target) <= e.stats.range) {
      if (!e.attacking) {
        e.attacking = true;
        e.cooldown = Math.max(e.cooldown, e.stats.firstHit);
      }
      e.locked = true;
      if (e.cooldown <= 0) {
        this.attack(e, target);
        e.cooldown = e.stats.hitSpeed;
      }
      return;
    }

    e.attacking = false;
    e.locked = false;
    if (e.stats.speed > 0) this.moveToward(e, target);
  }

  private attack(e: Entity, t: Entity): void {
    const s = e.stats;
    const ranged = !!s.projectileSpeed;
    this.events.push({ type: 'attack', id: e.id, cardId: e.cardId, x: e.x, y: e.y, tx: t.x, ty: t.y, ranged });
    if (ranged) {
      this.projectiles.push({
        id: this.nextId++, team: e.team, x: e.x, y: e.y, targetId: t.id, tx: t.x, ty: t.y, speed: s.projectileSpeed!,
        damage: s.damage, splash: s.splash ?? 0, hitsAir: s.targets === 'air-ground', hitsGround: true,
        sourceCard: e.cardId, done: false,
      });
    } else if (s.splash) {
      this.areaDamage(e.team, t.x, t.y, s.splash, s.damage, s.targets === 'air-ground', true);
    } else {
      this.applyDamage(t, s.damage);
    }
  }

  private areaDamage(team: Team, x: number, y: number, radius: number, damage: number, hitsAir: boolean, hitsGround: boolean): void {
    for (const o of this.entities) {
      if (!o.alive || o.team === team) continue;
      if (o.stats.flying ? !hitsAir : !hitsGround) continue;
      if (dist(o.x, o.y, x, y) <= radius + o.stats.radius) this.applyDamage(o, damage);
    }
  }

  private updateProjectiles(): void {
    for (const p of this.projectiles) {
      if (p.done) continue;
      const t = this.get(p.targetId);
      if (t && t.alive) {
        p.tx = t.x;
        p.ty = t.y;
      }
      const d = dist(p.x, p.y, p.tx, p.ty);
      const stepLen = p.speed * DT;
      if (d > stepLen) {
        p.x += ((p.tx - p.x) / d) * stepLen;
        p.y += ((p.ty - p.y) / d) * stepLen;
        continue;
      }
      p.x = p.tx;
      p.y = p.ty;
      p.done = true;
      if (this.phase === 'ended') continue;
      if (p.splash > 0) this.areaDamage(p.team, p.tx, p.ty, p.splash, p.damage, p.hitsAir, p.hitsGround);
      else if (t && t.alive) this.applyDamage(t, p.damage);
      // 目標已死亡的單體投射物直接消散
    }
  }

  applyDamage(t: Entity, amount: number): void {
    if (!t.alive || this.phase === 'ended') return;
    t.hp -= amount;
    this.events.push({ type: 'hit', id: t.id, x: t.x, y: t.y, amount, isTower: t.kind === 'tower' });
    if (t.kind === 'tower' && t.cardId === 'king') t.active = true;
    if (t.hp <= 0) this.kill(t);
  }

  private kill(t: Entity): void {
    if (!t.alive) return;
    t.alive = false;
    t.hp = 0;
    this.events.push({ type: 'death', id: t.id, team: t.team, kind: t.kind, cardId: t.cardId, x: t.x, y: t.y });
    if (t.kind !== 'tower') return;

    const attacker: Team = t.team === 0 ? 1 : 0;
    const isKing = t.cardId === 'king';
    this.events.push({ type: 'towerDown', team: t.team, isKing, x: t.x, y: t.y });
    if (isKing) {
      // 國王塔倒下時，同一方剩下的塔一起倒塌（只做視覺回饋，皇冠直接記為 3）
      for (const o of this.towers(t.team)) {
        if (!o.alive) continue;
        o.alive = false;
        o.hp = 0;
        this.events.push({ type: 'towerDown', team: o.team, isKing: false, x: o.x, y: o.y, cascade: true });
      }
      this.players[attacker].crowns = 3;
      this.finish(attacker, 'king');
      return;
    }
    this.players[attacker].crowns++;
    const king = this.towers(t.team).find((k) => k.cardId === 'king');
    if (king) king.active = true;
    if (this.phase === 'overtime') this.finish(attacker, 'overtime');
  }

  // ───────── 移動與碰撞 ─────────

  private sideOf(y: number): number {
    if (y >= ARENA.riverBottom) return 1;
    if (y <= ARENA.riverTop) return -1;
    return 0;
  }

  private nearestBridge(x: number): number {
    const [a, b] = ARENA.bridgeXs;
    return Math.abs(x - a) <= Math.abs(x - b) ? a : b;
  }

  /** 地面單位跨河時先走到橋頭，再沿橋過河。 */
  waypoint(e: Entity, tx: number, ty: number): [number, number] {
    if (e.stats.flying) return [tx, ty];
    const my = this.sideOf(e.y);
    const ts = this.sideOf(ty);
    const { riverTop, riverBottom, bridgeHalfWidth } = ARENA;
    if (my !== 0 && (ts === my || ts === 0)) {
      if (ts === 0) return [tx, my > 0 ? riverBottom + 0.05 : riverTop - 0.05];
      return [tx, ty];
    }
    if (my === 0) {
      const bx = this.nearestBridge(e.x);
      if (ts === 0) return [Math.max(bx - bridgeHalfWidth, Math.min(bx + bridgeHalfWidth, tx)), ty];
      return [e.x, ts > 0 ? riverBottom + 0.3 : riverTop - 0.3];
    }
    let bx: number = ARENA.bridgeXs[0];
    let best = Infinity;
    for (const cand of ARENA.bridgeXs) {
      const c = Math.abs(e.x - cand) + Math.abs(tx - cand);
      if (c < best - 1e-6) {
        best = c;
        bx = cand;
      }
    }
    const entryY = my > 0 ? riverBottom + 0.4 : riverTop - 0.4;
    const exitY = my > 0 ? riverTop - 0.4 : riverBottom + 0.4;
    const half = bridgeHalfWidth - e.stats.radius * 0.5;
    if (Math.abs(e.x - bx) <= half && Math.abs(e.y - entryY) < 1.2) return [e.x, exitY];
    return [bx, entryY];
  }

  private moveToward(e: Entity, target: Entity): void {
    const [wx, wy] = this.waypoint(e, target.x, target.y);
    const d = dist(e.x, e.y, wx, wy);
    if (d < 1e-6) return;
    let ux = (wx - e.x) / d;
    let uy = (wy - e.y) / d;
    if (!e.stats.flying) [ux, uy] = this.steerAround(e, target, ux, uy, d);
    const stepLen = Math.min(d, e.stats.speed * DT);
    e.x += ux * stepLen;
    e.y += uy * stepLen;
  }

  /**
   * 地面單位前進方向上若有塔或建築擋路（不含自己的目標），改朝障礙物側邊繞行。
   * 只用位置與 id 決定方向，維持同 seed 可重現。
   */
  private steerAround(e: Entity, target: Entity, ux: number, uy: number, maxD: number): [number, number] {
    let block: Entity | null = null;
    let blockT = Infinity;
    let blockCross = 0;
    for (const o of this.entities) {
      if (!o.alive || o === target || o.kind === 'troop') continue;
      const R = o.stats.radius + e.stats.radius + 0.1;
      const cx = o.x - e.x;
      const cy = o.y - e.y;
      const t = cx * ux + cy * uy; // 障礙物在前進方向上的距離
      if (t < -0.2 || t > maxD + R) continue;
      const cross = ux * cy - uy * cx; // 障礙物偏離路線的側向距離（帶正負號）
      if (Math.abs(cross) >= R) continue;
      if (t < blockT) {
        blockT = t;
        block = o;
        blockCross = cross;
      }
    }
    if (!block) {
      e.avoidSide = 0;
      return [ux, uy];
    }
    if (e.avoidSide === 0) {
      if (Math.abs(blockCross) > 0.05) e.avoidSide = blockCross > 0 ? -1 : 1;
      else {
        // 正對障礙物時往場地中央那一側繞（側邊通常較寬）
        const nx = -uy;
        const towardCenter = (ARENA.width / 2 - block.x) * nx;
        e.avoidSide = towardCenter >= 0 ? 1 : -1;
      }
    }
    const R = block.stats.radius + e.stats.radius + 0.25;
    const nx = -uy * e.avoidSide;
    const ny = ux * e.avoidSide;
    const ax = block.x + nx * R - e.x;
    const ay = block.y + ny * R - e.y;
    const al = Math.hypot(ax, ay);
    if (al < 1e-6) return [ux, uy];
    return [ax / al, ay / al];
  }

  private resolveCollisions(): void {
    const movers = this.entities.filter((e) => e.alive && e.kind === 'troop');
    for (let i = 0; i < movers.length; i++) {
      const a = movers[i];
      for (let j = i + 1; j < movers.length; j++) {
        const b = movers[j];
        if (a.stats.flying !== b.stats.flying) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const minD = a.stats.radius + b.stats.radius;
        const d2 = dx * dx + dy * dy;
        if (d2 >= minD * minD) continue;
        let d = Math.sqrt(d2);
        let nx = dx;
        let ny = dy;
        if (d < 1e-6) {
          // 完全重疊時以 id 決定方向，保持可重現
          nx = a.id < b.id ? 0.7 : -0.7;
          ny = 0.7;
          d = 1;
        }
        const overlap = (minD - Math.sqrt(d2)) * SEPARATION_STRENGTH;
        const total = a.stats.mass + b.stats.mass;
        const wa = b.stats.mass / total;
        const wb = a.stats.mass / total;
        a.x -= (nx / d) * overlap * wa;
        a.y -= (ny / d) * overlap * wa;
        b.x += (nx / d) * overlap * wb;
        b.y += (ny / d) * overlap * wb;
      }
    }
    for (const e of movers) this.constrain(e, false);
  }

  /** 讓地面單位不穿越防禦塔／建築、不落入河中，並限制在場地內。 */
  private constrain(e: Entity, spawning: boolean): void {
    const r = e.stats.radius;
    e.x = Math.max(r, Math.min(ARENA.width - r, e.x));
    e.y = Math.max(r, Math.min(H - r, e.y));
    if (e.stats.flying) return;

    for (const o of this.entities) {
      if (o === e || !o.alive || o.kind === 'troop') continue;
      const minD = o.stats.radius + r;
      const dx = e.x - o.x;
      const dy = e.y - o.y;
      const d = Math.hypot(dx, dy);
      if (d >= minD) continue;
      if (d < 1e-6) {
        e.y = o.y + (e.team === 0 ? minD : -minD);
      } else {
        e.x = o.x + (dx / d) * minD;
        e.y = o.y + (dy / d) * minD;
      }
    }

    const { riverTop, riverBottom } = ARENA;
    if (e.y > riverTop && e.y < riverBottom) {
      const bx = this.nearestBridge(e.x);
      const half = ARENA.bridgeHalfWidth - r * 0.5;
      if (Math.abs(e.x - bx) > half) {
        const wasInRiver = !spawning && e.py > riverTop && e.py < riverBottom;
        if (wasInRiver) e.x = Math.max(bx - half, Math.min(bx + half, e.x));
        else {
          const refY = spawning ? e.y : e.py;
          e.y = refY >= (riverTop + riverBottom) / 2 ? riverBottom : riverTop;
        }
      }
    }
  }

  // ───────── 測試與除錯輔助 ─────────

  /** 狀態摘要，用於驗證同 seed 可重現。 */
  stateHash(): string {
    const parts: string[] = [this.tick.toString(), this.phase, this.timeLeft.toFixed(4)];
    for (const p of this.players) parts.push(p.elixir.toFixed(4), p.hand.join(','), p.queue.join(','), p.crowns.toString());
    for (const e of this.entities) parts.push(`${e.id}:${e.cardId}:${e.x.toFixed(4)}:${e.y.toFixed(4)}:${e.hp.toFixed(2)}:${e.alive ? 1 : 0}`);
    for (const p of this.projectiles) parts.push(`p${p.id}:${p.x.toFixed(4)}:${p.y.toFixed(4)}`);
    let h = 2166136261;
    const s = parts.join('|');
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return (h >>> 0).toString(16);
  }
}
