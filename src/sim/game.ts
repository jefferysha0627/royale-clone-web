import { ARENA, DEPLOY, DT, KING_ACTIVATION_TIME, KNOCKBACK_TIME, MATCH, SEPARATION_STRENGTH, TOWERS, TOWER_LAYOUT } from './config';
import { CARDS, UNITS, type CardDef, type ProjectileVisual, type SpellStats, type UnitStats } from './cards';
import { Rng } from './rng';

export type Team = 0 | 1;
export type EntityKind = 'troop' | 'building' | 'tower';
export type Phase = 'regular' | 'overtime' | 'tiebreak' | 'ended';

export interface Entity {
  id: number;
  team: Team;
  kind: EntityKind;
  unit: string; // 單位 id；塔為 'king' / 'princess'
  cardId: string; // 產生它的卡牌（塔與召喚物沿用單位 id）
  lane: number; // 側塔所在路線（0 左、1 右），其餘為 -1
  x: number;
  y: number;
  px: number; // 上一步位置（渲染內插用）
  py: number;
  hp: number;
  maxHp: number;
  stats: UnitStats;
  half: number; // 建築／塔的方形佔地半邊長，部隊為 0
  alive: boolean;
  targetId: number;
  locked: boolean; // 已開打：持續追擊同一目標
  attacking: boolean;
  cooldown: number;
  deployTimer: number;
  stunTimer: number;
  frozen: boolean; // stunTimer 來自冰凍（畫面用）
  slowTimer: number;
  slowMul: number;
  lifetime: number;
  active: boolean; // 國王塔被喚醒前不攻擊
  activateTimer: number;
  avoidSide: number;
  chargeDist: number;
  charging: boolean;
  rampTime: number;
  spawnTimer: number;
  spawnLeft: number;
  spawnGap: number;
  kbx: number;
  kby: number;
  kbTime: number;
  moving: boolean;
  facing: number; // 弧度，畫面朝向
  jumping: boolean; // 跳河中
  lastAttack: number; // 最近一次出手的模擬時間（畫面用）
}

export interface Projectile {
  id: number;
  team: Team;
  x: number;
  y: number;
  sx: number;
  sy: number;
  targetId: number;
  tx: number;
  ty: number;
  speed: number;
  damage: number;
  splash: number;
  freeze: number;
  hitsAir: boolean;
  hitsGround: boolean;
  visual: ProjectileVisual;
  arc: number;
  source: string;
  done: boolean;
}

/** 從國王塔飛出的法術（火球、箭雨、火箭、哥布林飛桶）。 */
export interface PendingSpell {
  id: number;
  team: Team;
  cardId: string;
  x: number;
  y: number;
  fromX: number;
  fromY: number;
  delay: number;
  totalDelay: number;
  wavesLeft: number;
  waveTimer: number;
}

/** 持續範圍（毒霧）。 */
export interface AreaEffect {
  id: number;
  team: Team;
  cardId: string;
  x: number;
  y: number;
  radius: number;
  timeLeft: number;
  duration: number;
  tickTimer: number;
  ticksLeft: number;
}

/** 滾動法術（滾木）。 */
export interface Roller {
  id: number;
  team: Team;
  cardId: string;
  x: number;
  y: number;
  startY: number;
  dir: number; // +1 往下、-1 往上
  traveled: number;
  hit: Set<number>;
}

/** 延遲爆炸的死亡炸彈。 */
export interface Bomb {
  id: number;
  team: Team;
  unit: string;
  x: number;
  y: number;
  timer: number;
  total: number;
}

export type GameEvent =
  | { type: 'deploy'; team: Team; cardId: string; x: number; y: number; cost: number }
  | { type: 'spawn'; id: number; team: Team; unit: string; x: number; y: number; source: 'card' | 'spawner' | 'death' | 'barrel' }
  | { type: 'attack'; id: number; unit: string; team: Team; x: number; y: number; tx: number; ty: number; targetId: number; ranged: boolean; charge: boolean }
  | { type: 'hit'; id: number; team: Team; x: number; y: number; amount: number; isTower: boolean; isBuilding: boolean }
  | { type: 'impact'; team: Team; x: number; y: number; radius: number; visual: ProjectileVisual }
  | { type: 'death'; id: number; team: Team; kind: EntityKind; unit: string; x: number; y: number; kamikaze: boolean }
  | { type: 'towerDown'; team: Team; isKing: boolean; x: number; y: number; cascade: boolean }
  | { type: 'kingActivate'; team: Team }
  | { type: 'spellCast'; team: Team; cardId: string; x: number; y: number; fromX: number; fromY: number; delay: number }
  | { type: 'spell'; team: Team; cardId: string; x: number; y: number; radius: number; wave: number }
  | { type: 'bombDrop'; id: number; team: Team; unit: string; x: number; y: number; delay: number }
  | { type: 'blast'; team: Team; unit: string; x: number; y: number; radius: number; visual: 'quake' | 'bomb' }
  | { type: 'charge'; id: number }
  | { type: 'stun'; id: number; freeze: boolean }
  | { type: 'phase'; phase: Phase }
  | { type: 'elixirRate'; mult: number }
  | { type: 'end'; result: MatchResult };

export interface PlayerState {
  elixir: number;
  hand: (string | null)[];
  queue: string[]; // queue[0] 為下一張
  nextReadyAt: number; // 下一張可補進手牌的模擬時間
  crowns: number;
  cardsPlayed: number;
  elixirSpent: number;
  elixirLeaked: number;
}

export interface MatchResult {
  winner: Team | null;
  crowns: [number, number];
  reason: 'king' | 'time' | 'overtime' | 'tiebreak' | 'draw';
  time: number;
}

export type DeployFailReason = 'ended' | 'card' | 'elixir' | 'zone';
export type DeployResult = { ok: true; x: number; y: number } | { ok: false; reason: DeployFailReason };

export interface GameOptions {
  seed: number;
  decks: [string[], string[]];
}

const W = ARENA.width;
const H = ARENA.height;

/** 以隊伍 0 的視角換算 y（隊伍 1 鏡射）。 */
export function viewY(team: Team, y: number): number {
  return team === 0 ? y : H - y;
}

function dist(ax: number, ay: number, bx: number, by: number): number {
  return Math.hypot(ax - bx, ay - by);
}

/** 點到實體的距離：建築與塔以方形佔地計算，部隊以圓計算（都是到邊緣）。 */
export function distTo(px: number, py: number, e: Entity): number {
  if (e.half > 0) {
    const dx = Math.max(0, Math.abs(px - e.x) - e.half);
    const dy = Math.max(0, Math.abs(py - e.y) - e.half);
    return Math.hypot(dx, dy);
  }
  return Math.max(0, dist(px, py, e.x, e.y) - e.stats.radius);
}

function towerStats(type: 'king' | 'princess'): UnitStats {
  const t = TOWERS[type];
  return {
    hp: t.hp, damage: t.damage, hitSpeed: t.hitSpeed, loadTime: t.loadTime, range: t.range, sight: t.range,
    speed: 0, radius: t.radius, mass: 1000, flying: false, flyHeight: 0, targets: 'air-ground', deployTime: 0,
    projectile: { speed: t.projectileSpeed, visual: type === 'king' ? 'king-ball' : 'tower-arrow', arc: type === 'king' ? 0.6 : 0.8 },
    half: t.footprint,
  };
}

/** 多隻部隊的出場隊形（相對落點，以隊伍 0 視角：+y 朝己方後方）。 */
function formation(count: number): [number, number][] {
  switch (count) {
    case 1: return [[0, 0]];
    case 2: return [[-0.6, 0], [0.6, 0]];
    case 3: return [[0, -0.55], [-0.6, 0.4], [0.6, 0.4]];
    case 4: return [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]];
    case 5: return [[0, 0], [-0.8, -0.6], [0.8, -0.6], [-0.8, 0.6], [0.8, 0.6]];
    default: {
      // 骷髏大軍等：兩圈圓陣
      const out: [number, number][] = [[0, 0]];
      const inner = Math.min(6, count - 1);
      for (let i = 0; i < inner; i++) {
        const a = (i / inner) * Math.PI * 2;
        out.push([Math.cos(a) * 0.9, Math.sin(a) * 0.9]);
      }
      const outer = count - 1 - inner;
      for (let i = 0; i < outer; i++) {
        const a = (i / outer) * Math.PI * 2 + 0.3;
        out.push([Math.cos(a) * 1.75, Math.sin(a) * 1.75]);
      }
      return out;
    }
  }
}

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
  areas: AreaEffect[] = [];
  rollers: Roller[] = [];
  bombs: Bomb[] = [];
  events: GameEvent[] = [];
  result: MatchResult | null = null;
  private nextId = 1;
  private lastMult = 1;
  private drainRate = 0;

  constructor(opts: GameOptions) {
    this.seed = opts.seed;
    this.rng = new Rng(opts.seed);
    this.players = [this.makePlayer(opts.decks[0]), this.makePlayer(opts.decks[1])];
    for (const team of [0, 1] as Team[]) {
      for (const t of TOWER_LAYOUT) {
        const x = team === 0 ? t.x : W - t.x;
        const e = this.spawnEntity(team, 'tower', t.type, t.type, towerStats(t.type), x, viewY(team, t.y));
        // 隊伍 1 鏡射後左右互換，lane 依實際 x 判定（0 = 左側）
        e.lane = t.type === 'princess' ? (x < W / 2 ? 0 : 1) : -1;
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
      nextReadyAt: 0,
      crowns: 0,
      cardsPlayed: 0,
      elixirSpent: 0,
      elixirLeaked: 0,
    };
  }

  private spawnEntity(team: Team, kind: EntityKind, unit: string, cardId: string, stats: UnitStats, x: number, y: number): Entity {
    const e: Entity = {
      id: this.nextId++, team, kind, unit, cardId, lane: -1, x, y, px: x, py: y,
      hp: stats.hp, maxHp: stats.hp, stats, half: stats.half ?? 0, alive: true, targetId: -1, locked: false, attacking: false,
      cooldown: 0, deployTimer: 0, stunTimer: 0, frozen: false, slowTimer: 0, slowMul: 1, lifetime: Infinity, active: true,
      activateTimer: 0, avoidSide: 0, chargeDist: 0, charging: false, rampTime: 0, spawnTimer: 0, spawnLeft: 0, spawnGap: 0,
      kbx: 0, kby: 0, kbTime: 0, moving: false, facing: team === 0 ? -Math.PI / 2 : Math.PI / 2, jumping: false, lastAttack: -99,
    };
    this.entities.push(e);
    return e;
  }

  get(id: number): Entity | undefined {
    // 實體數量少（通常 < 100），線性搜尋即可
    for (const e of this.entities) if (e.id === id) return e;
    return undefined;
  }

  towers(team: Team): Entity[] {
    return this.entities.filter((e) => e.kind === 'tower' && e.team === team);
  }

  king(team: Team): Entity {
    return this.entities.find((e) => e.kind === 'tower' && e.team === team && e.unit === 'king')!;
  }

  elixirMultiplier(): number {
    if (this.phase === 'overtime') return this.timeLeft <= MATCH.tripleElixirAt ? 3 : 2;
    if (this.phase === 'regular' && this.timeLeft <= MATCH.doubleElixirAt) return 2;
    return 1;
  }

  /** 新卡補進手牌所需秒數（能量加倍時縮短）。 */
  cycleDelay(): number {
    return MATCH.cardCycleDelay / this.elixirMultiplier();
  }

  get playing(): boolean {
    return this.phase === 'regular' || this.phase === 'overtime';
  }

  // ───────── 部署 ─────────

  /** 依卡牌類型把座標對齊格子：部隊與法術在格子中心，2×2 建築在格線交點。 */
  snap(cardId: string, x: number, y: number): [number, number] {
    const card = CARDS[cardId];
    const half = card?.kind === 'building' ? (UNITS[card.unit!].stats.half ?? 1) : 0;
    // 偶數邊長（2×2）的建築中心落在格線交點
    if (half > 0 && Number.isInteger(half)) {
      const sx = Math.max(half, Math.min(W - half, Math.round(x)));
      const sy = Math.max(half, Math.min(H - half, Math.round(y)));
      return [sx, sy];
    }
    const sx = Math.max(0.5, Math.min(W - 0.5, Math.floor(x) + 0.5));
    const sy = Math.max(0.5, Math.min(H - 0.5, Math.floor(y) + 0.5));
    return [sx, sy];
  }

  /** 某格（格子中心 x, y）是否在隊伍的可部署範圍（只看區域，不看佔用）。 */
  inDeployZone(team: Team, x: number, y: number): boolean {
    if (x <= 0 || x >= W || y <= 0 || y >= H) return false;
    const vy = viewY(team, y);
    if (vy >= DEPLOY.ownMinY) return true;
    if (vy < DEPLOY.pocketMinY || vy >= ARENA.riverTop) return false;
    const lane = x < W / 2 ? 0 : 1;
    const enemy: Team = team === 0 ? 1 : 0;
    return this.towers(enemy).some((t) => t.unit === 'princess' && !t.alive && t.lane === lane);
  }

  private occupied(x: number, y: number, half: number): boolean {
    for (const e of this.entities) {
      if (!e.alive || e.half <= 0) continue;
      if (Math.abs(x - e.x) < e.half + half && Math.abs(y - e.y) < e.half + half) return true;
    }
    return false;
  }

  /** 該隊伍在 (x, y)（已對齊格子）是否可部署此卡。 */
  canDeployAt(team: Team, cardId: string, x: number, y: number): boolean {
    const card = CARDS[cardId];
    if (!card) return false;
    if (x < 0 || x > W || y < 0 || y > H) return false;
    if (card.kind === 'spell') return true;
    if (card.kind === 'building') {
      const half = UNITS[card.unit!].stats.half ?? 1;
      for (let ox = -half + 0.5; ox < half; ox += 1) {
        for (let oy = -half + 0.5; oy < half; oy += 1) if (!this.inDeployZone(team, x + ox, y + oy)) return false;
      }
      return !this.occupied(x, y, half);
    }
    return this.inDeployZone(team, x, y) && !this.occupied(x, y, 0.01);
  }

  deploy(team: Team, handIndex: number, x: number, y: number): DeployResult {
    if (!this.playing) return { ok: false, reason: 'ended' };
    const p = this.players[team];
    const cardId = p.hand[handIndex];
    const card = cardId ? CARDS[cardId] : undefined;
    if (!card || !cardId) return { ok: false, reason: 'card' };
    if (p.elixir < card.cost) return { ok: false, reason: 'elixir' };
    const [sx, sy] = this.snap(cardId, x, y);
    if (!this.canDeployAt(team, cardId, sx, sy)) return { ok: false, reason: 'zone' };

    p.elixir -= card.cost;
    p.elixirSpent += card.cost;
    p.cardsPlayed++;
    p.hand[handIndex] = null;
    p.queue.push(cardId);
    this.fillHand(p);

    this.events.push({ type: 'deploy', team, cardId, x: sx, y: sy, cost: card.cost });
    if (card.kind === 'spell') this.castSpell(team, card, sx, sy);
    else this.spawnCard(team, card, sx, sy);
    return { ok: true, x: sx, y: sy };
  }

  /** 空出的手牌位置在冷卻結束後由「下一張」補上。 */
  private fillHand(p: PlayerState): void {
    for (let i = 0; i < p.hand.length; i++) {
      if (p.hand[i] !== null) continue;
      if (this.time + 1e-9 < p.nextReadyAt || p.queue.length === 0) return;
      p.hand[i] = p.queue.shift()!;
      p.nextReadyAt = this.time + this.cycleDelay();
    }
  }

  private spawnCard(team: Team, card: CardDef, x: number, y: number): void {
    const def = UNITS[card.unit!];
    if (card.kind === 'building') {
      const e = this.spawnEntity(team, 'building', def.id, card.id, def.stats, x, y);
      e.deployTimer = def.stats.deployTime;
      e.lifetime = def.stats.lifetime ?? Infinity;
      this.initSpawner(e);
      this.events.push({ type: 'spawn', id: e.id, team, unit: def.id, x, y, source: 'card' });
      return;
    }
    const count = card.count ?? 1;
    const sign = team === 0 ? 1 : -1;
    for (const [ox, oy] of formation(count)) {
      this.spawnUnit(team, def.id, card.id, x + ox, y + oy * sign, def.stats.deployTime, 'card');
    }
  }

  private spawnUnit(team: Team, unit: string, cardId: string, x: number, y: number, deployTime: number, source: 'card' | 'spawner' | 'death' | 'barrel'): Entity {
    const def = UNITS[unit];
    const e = this.spawnEntity(team, 'troop', unit, cardId, def.stats, x, y);
    e.deployTimer = deployTime;
    this.initSpawner(e);
    this.constrain(e, true);
    e.px = e.x;
    e.py = e.y;
    this.events.push({ type: 'spawn', id: e.id, team, unit, x: e.x, y: e.y, source });
    return e;
  }

  private initSpawner(e: Entity): void {
    const sp = e.stats.spawner;
    if (sp) e.spawnTimer = sp.start;
  }

  private castSpell(team: Team, card: CardDef, x: number, y: number): void {
    const s = card.spell!;
    const king = this.king(team);
    switch (s.kind) {
      case 'instant':
        this.events.push({ type: 'spellCast', team, cardId: card.id, x, y, fromX: king.x, fromY: king.y, delay: 0 });
        this.applySpell(team, card.id, s, x, y, 1);
        return;
      case 'area':
        this.events.push({ type: 'spellCast', team, cardId: card.id, x, y, fromX: king.x, fromY: king.y, delay: 0 });
        this.areas.push({
          id: this.nextId++, team, cardId: card.id, x, y, radius: s.radius, timeLeft: s.duration!, duration: s.duration!,
          tickTimer: 0, ticksLeft: Math.round(s.duration! / (s.tick ?? 1)),
        });
        return;
      case 'roll': {
        const dir = team === 0 ? -1 : 1;
        this.events.push({ type: 'spellCast', team, cardId: card.id, x, y, fromX: x, fromY: y, delay: 0 });
        this.rollers.push({ id: this.nextId++, team, cardId: card.id, x, y, startY: y, dir, traveled: 0, hit: new Set() });
        return;
      }
      default: {
        const delay = dist(king.x, king.y, x, y) / s.speed;
        this.events.push({ type: 'spellCast', team, cardId: card.id, x, y, fromX: king.x, fromY: king.y, delay });
        this.spells.push({ id: this.nextId++, team, cardId: card.id, x, y, fromX: king.x, fromY: king.y, delay, totalDelay: delay, wavesLeft: s.waves ?? 1, waveTimer: 0 });
      }
    }
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
    if (this.phase === 'tiebreak') {
      this.updateTiebreak();
      return;
    }

    const mult = this.elixirMultiplier();
    if (mult !== this.lastMult) {
      this.lastMult = mult;
      if (mult > 1) this.events.push({ type: 'elixirRate', mult });
    }
    for (const p of this.players) {
      const gain = MATCH.elixirPerSecond * mult * DT;
      if (p.elixir >= MATCH.maxElixir) p.elixirLeaked += gain;
      p.elixir = Math.min(MATCH.maxElixir, p.elixir + gain);
      this.fillHand(p);
    }

    this.updateSpells();
    this.updateAreas();
    this.updateRollers();
    this.updateBombs();
    for (const e of this.entities) if (e.alive) this.updateEntity(e);
    this.resolveCollisions();
    this.updateProjectiles();
    this.entities = this.entities.filter((e) => e.alive || e.kind === 'tower');
    this.projectiles = this.projectiles.filter((p) => !p.done);
    this.updateClock();
  }

  private updateClock(): void {
    if (this.phase === 'ended') return;
    this.timeLeft = Math.max(0, this.timeLeft - DT);
    if (this.timeLeft > 0) return;
    const [a, b] = [this.players[0].crowns, this.players[1].crowns];
    if (a !== b) {
      this.finish(a > b ? 0 : 1, this.phase === 'regular' ? 'time' : 'overtime');
      return;
    }
    if (this.phase === 'regular') {
      this.phase = 'overtime';
      this.timeLeft = MATCH.overtime;
      this.events.push({ type: 'phase', phase: 'overtime' });
      return;
    }
    this.startTiebreak();
  }

  /** 延長賽仍平手：清空場上，塔同步扣血，最低血量的塔倒下的一方落敗；最低血量相同則平手。 */
  private startTiebreak(): void {
    const low = (team: Team) => Math.min(...this.towers(team).filter((t) => t.alive).map((t) => t.hp));
    const l0 = low(0);
    const l1 = low(1);
    if (Math.abs(l0 - l1) < 1e-6) {
      this.finish(null, 'draw');
      return;
    }
    for (const e of this.entities) {
      if (e.kind !== 'tower' && e.alive) e.alive = false;
    }
    this.entities = this.entities.filter((e) => e.kind === 'tower');
    this.projectiles = [];
    this.spells = [];
    this.areas = [];
    this.rollers = [];
    this.bombs = [];
    this.phase = 'tiebreak';
    this.drainRate = Math.min(l0, l1) / MATCH.tiebreakDrainTime;
    this.events.push({ type: 'phase', phase: 'tiebreak' });
  }

  private updateTiebreak(): void {
    const amount = this.drainRate * DT;
    for (const t of this.entities) {
      if (!t.alive) continue;
      t.hp -= amount;
    }
    const dead = this.entities.filter((t) => t.alive && t.hp <= 0);
    for (const t of dead) this.kill(t);
    if (dead.length && this.phase === 'tiebreak') {
      const [a, b] = [this.players[0].crowns, this.players[1].crowns];
      this.finish(a === b ? null : a > b ? 0 : 1, a === b ? 'draw' : 'tiebreak');
    }
  }

  private finish(winner: Team | null, reason: MatchResult['reason']): void {
    if (this.phase === 'ended') return;
    this.phase = 'ended';
    this.result = { winner, crowns: [this.players[0].crowns, this.players[1].crowns], reason, time: this.time };
    this.events.push({ type: 'end', result: this.result });
  }

  // ───────── 法術 ─────────

  private updateSpells(): void {
    for (const s of this.spells) {
      if (s.delay > 0) {
        s.delay -= DT;
        if (s.delay > 0) continue;
      } else {
        s.waveTimer -= DT;
        if (s.waveTimer > 0) continue;
      }
      const card = CARDS[s.cardId];
      const st = card.spell!;
      const wave = (st.waves ?? 1) - s.wavesLeft + 1;
      if (st.kind === 'barrel') {
        this.events.push({ type: 'spell', team: s.team, cardId: s.cardId, x: s.x, y: s.y, radius: st.radius, wave });
        const sp = st.spawn!;
        const offs = formation(sp.count);
        for (const [ox, oy] of offs) this.spawnUnit(s.team, sp.unit, s.cardId, s.x + ox, s.y + oy, sp.deployTime, 'barrel');
      } else {
        this.applySpell(s.team, s.cardId, st, s.x, s.y, wave);
      }
      s.wavesLeft--;
      s.waveTimer = st.waveInterval ?? 0;
    }
    this.spells = this.spells.filter((s) => s.wavesLeft > 0);
  }

  private applySpell(team: Team, cardId: string, s: SpellStats, x: number, y: number, wave: number): void {
    this.events.push({ type: 'spell', team, cardId, x, y, radius: s.radius, wave });
    for (const e of this.entities) {
      if (!e.alive || e.team === team) continue;
      if (e.stats.flying && !s.hitsAir) continue;
      if (distTo(x, y, e) > s.radius) continue;
      const amount = e.kind === 'tower' ? Math.round(s.damage * s.towerPct) : s.damage;
      if (amount > 0) this.applyDamage(e, amount);
      if (!e.alive) continue;
      if (s.stun) this.stun(e, s.stun, false);
      if (s.pushback) this.knockback(e, x, y, s.pushback, false);
    }
  }

  private updateAreas(): void {
    for (const a of this.areas) {
      a.timeLeft -= DT;
      a.tickTimer -= DT;
      const s = CARDS[a.cardId].spell!;
      for (const e of this.entities) {
        if (!e.alive || e.team === a.team || e.kind !== 'troop') continue;
        if (e.stats.flying && !s.hitsAir) continue;
        if (distTo(a.x, a.y, e) > a.radius) continue;
        if (s.slow) {
          e.slowTimer = Math.max(e.slowTimer, 0.25);
          e.slowMul = Math.min(e.slowMul, 1 - s.slow);
        }
      }
      if (a.tickTimer > 0 || a.ticksLeft <= 0) continue;
      a.tickTimer += s.tick ?? 1;
      a.ticksLeft--;
      this.events.push({ type: 'spell', team: a.team, cardId: a.cardId, x: a.x, y: a.y, radius: a.radius, wave: 0 });
      for (const e of this.entities) {
        if (!e.alive || e.team === a.team) continue;
        if (e.stats.flying && !s.hitsAir) continue;
        if (distTo(a.x, a.y, e) > a.radius) continue;
        this.applyDamage(e, e.kind === 'tower' ? Math.round(s.damage * s.towerPct) : s.damage);
      }
    }
    this.areas = this.areas.filter((a) => a.timeLeft > 0 || a.ticksLeft > 0);
  }

  private updateRollers(): void {
    for (const r of this.rollers) {
      const s = CARDS[r.cardId].spell!;
      const step = s.speed * DT;
      r.traveled = Math.min(s.rollRange!, r.traveled + step);
      r.y = r.startY + r.dir * r.traveled;
      for (const e of this.entities) {
        if (!e.alive || e.team === r.team || e.stats.flying || r.hit.has(e.id)) continue;
        // 方形掃過區：寬 2×radius、厚 2×rollHalfDepth
        const dx = e.half > 0 ? Math.max(0, Math.abs(e.x - r.x) - e.half) : Math.max(0, Math.abs(e.x - r.x) - e.stats.radius);
        const dy = e.half > 0 ? Math.max(0, Math.abs(e.y - r.y) - e.half) : Math.max(0, Math.abs(e.y - r.y) - e.stats.radius);
        if (dx > s.radius || dy > s.rollHalfDepth!) continue;
        r.hit.add(e.id);
        this.applyDamage(e, e.kind === 'tower' ? Math.round(s.damage * s.towerPct) : s.damage);
        if (e.alive && e.kind === 'troop') this.knockback(e, e.x, e.y - r.dir, s.pushback ?? 0, true);
      }
    }
    this.rollers = this.rollers.filter((r) => r.traveled < CARDS[r.cardId].spell!.rollRange! - 1e-6);
  }

  private updateBombs(): void {
    for (const b of this.bombs) {
      b.timer -= DT;
      if (b.timer > 0) continue;
      this.blast(b.team, b.unit, b.x, b.y);
    }
    this.bombs = this.bombs.filter((b) => b.timer > 0);
  }

  /** 死亡傷害爆炸。 */
  private blast(team: Team, unit: string, x: number, y: number): void {
    const dd = UNITS[unit].stats.deathDamage!;
    this.events.push({ type: 'blast', team, unit, x, y, radius: dd.radius, visual: dd.visual });
    for (const e of this.entities) {
      if (!e.alive || e.team === team) continue;
      if (e.stats.flying) continue; // 死亡傷害只打地面
      if (distTo(x, y, e) > dd.radius) continue;
      this.applyDamage(e, e.kind === 'tower' ? Math.round(dd.damage * dd.towerMul) : dd.damage);
      if (e.alive && dd.pushback > 0) this.knockback(e, x, y, dd.pushback, false);
    }
  }

  // ───────── 索敵 ─────────

  canTarget(attacker: Entity, target: Entity): boolean {
    if (!target.alive || target.team === attacker.team) return false;
    const t = attacker.stats.targets;
    if (t === 'buildings') return target.kind !== 'troop';
    if (t === 'ground') return !target.stats.flying;
    return true;
  }

  /** 攻擊者邊緣到目標邊緣的距離。 */
  edgeDist(a: Entity, b: Entity): number {
    return distTo(a.x, a.y, b) - a.stats.radius;
  }

  private acquireTarget(e: Entity): Entity | null {
    let current = e.targetId >= 0 ? this.get(e.targetId) : undefined;
    if (current && !this.canTarget(e, current)) current = undefined;
    const isStatic = e.stats.speed === 0;
    if (current && e.locked) {
      const d = this.edgeDist(e, current);
      // 已開打的部隊會追擊；固定建築／塔目標離開射程就換人
      if (isStatic ? d <= e.stats.range + 0.05 : d <= Math.max(e.stats.sight, e.stats.range) + 1) return current;
    }

    let best: Entity | null = null;
    let bestD = Infinity;
    const sight = isStatic ? e.stats.range : e.stats.sight;
    for (const o of this.entities) {
      if (!this.canTarget(e, o)) continue;
      const d = this.edgeDist(e, o);
      if (d > sight) continue;
      if (d < bestD) {
        bestD = d;
        best = o;
      }
    }
    // 視野內沒有目標時，可移動單位朝最近的敵方塔前進（建築只在視野內才會吸引）
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
      e.rampTime = 0;
    }
    e.targetId = best ? best.id : -1;
    return best;
  }

  private updateEntity(e: Entity): void {
    e.cooldown = Math.max(0, e.cooldown - DT);
    e.moving = false;
    if (e.slowTimer > 0) {
      e.slowTimer -= DT;
      if (e.slowTimer <= 0) e.slowMul = 1;
    }
    if (e.lifetime !== Infinity) {
      e.lifetime -= DT;
      e.hp -= (e.maxHp / (e.stats.lifetime ?? 1)) * DT;
      if (e.hp <= 0 || e.lifetime <= 0) {
        this.kill(e);
        return;
      }
    }
    if (e.kbTime > 0) {
      const k = Math.min(DT, e.kbTime) / KNOCKBACK_TIME;
      e.x += e.kbx * k;
      e.y += e.kby * k;
      e.kbTime -= DT;
      return;
    }
    if (e.deployTimer > 0) {
      e.deployTimer -= DT;
      return;
    }
    if (e.stunTimer > 0) {
      e.stunTimer -= DT;
      if (e.stunTimer <= 0) e.frozen = false;
      return;
    }
    if (e.kind === 'tower' && !e.active) return;
    if (e.kind === 'tower' && e.activateTimer > 0) {
      e.activateTimer -= DT;
      return;
    }
    this.updateSpawner(e);
    if (e.stats.damage <= 0 && !e.stats.ramp) return;

    const target = this.acquireTarget(e);
    if (!target) return;

    if (this.edgeDist(e, target) <= e.stats.range) {
      e.facing = Math.atan2(target.y - e.y, target.x - e.x);
      if (!e.attacking) {
        e.attacking = true;
        e.cooldown = Math.max(e.cooldown, e.stats.loadTime);
      }
      e.locked = true;
      e.chargeDist = 0;
      if (e.stats.ramp) e.rampTime += DT;
      if (e.cooldown <= 0) {
        this.attack(e, target);
        e.cooldown = e.stats.hitSpeed;
      }
      return;
    }

    e.attacking = false;
    if (e.stats.speed > 0) this.moveToward(e, target);
  }

  private updateSpawner(e: Entity): void {
    const sp = e.stats.spawner;
    if (!sp) return;
    if (e.spawnLeft > 0) {
      e.spawnGap -= DT;
      if (e.spawnGap > 0) return;
      this.spawnOne(e, sp.count - e.spawnLeft, sp.count);
      e.spawnLeft--;
      e.spawnGap = sp.interval;
      return;
    }
    e.spawnTimer -= DT;
    if (e.spawnTimer > 0) return;
    e.spawnTimer = sp.pause;
    if (sp.interval <= 0) {
      for (let i = 0; i < sp.count; i++) this.spawnOne(e, i, sp.count);
    } else {
      this.spawnOne(e, 0, sp.count);
      e.spawnLeft = sp.count - 1;
      e.spawnGap = sp.interval;
    }
  }

  private spawnOne(e: Entity, i: number, n: number): void {
    const sp = e.stats.spawner!;
    const fwd = e.team === 0 ? -1 : 1;
    let x: number;
    let y: number;
    if (e.kind === 'building') {
      // 墓碑：在前方左右交替出現
      x = e.x + (i % 2 === 0 ? -0.6 : 0.6);
      y = e.y + fwd * (e.half + 0.6);
    } else {
      const a = (i / n) * Math.PI * 2 + Math.PI / 4;
      x = e.x + Math.cos(a) * 1.1;
      y = e.y + Math.sin(a) * 1.1;
    }
    this.spawnUnit(e.team, sp.unit, sp.unit, x, y, 0.3, 'spawner');
  }

  private attack(e: Entity, t: Entity): void {
    const s = e.stats;
    const ranged = !!s.projectile;
    const charged = e.charging && !!s.charge;
    e.lastAttack = this.time;
    this.events.push({ type: 'attack', id: e.id, unit: e.unit, team: e.team, x: e.x, y: e.y, tx: t.x, ty: t.y, targetId: t.id, ranged, charge: charged });
    if (charged) {
      e.charging = false;
      e.chargeDist = 0;
    }
    if (s.kamikaze) {
      this.launch(e, t, s.damage);
      e.alive = false;
      e.hp = 0;
      this.events.push({ type: 'death', id: e.id, team: e.team, kind: e.kind, unit: e.unit, x: e.x, y: e.y, kamikaze: true });
      return;
    }
    if (ranged) {
      this.launch(e, t, s.damage);
      return;
    }
    let dmg = charged ? s.charge!.damage : s.damage;
    if (s.ramp) {
      const st = Math.min(2, Math.floor(e.rampTime / s.ramp.stageTime));
      dmg = s.ramp.damages[st];
    }
    if (s.splash) {
      const cx = s.splashSelf ? e.x : t.x;
      const cy = s.splashSelf ? e.y : t.y;
      this.areaDamage(e.team, cx, cy, s.splash, dmg, s.targets === 'air-ground', true);
    } else {
      this.applyDamage(t, dmg);
    }
  }

  private launch(e: Entity, t: Entity, damage: number): void {
    const p = e.stats.projectile!;
    this.projectiles.push({
      id: this.nextId++, team: e.team, x: e.x, y: e.y, sx: e.x, sy: e.y, targetId: t.id, tx: t.x, ty: t.y, speed: p.speed,
      damage, splash: p.splash ?? 0, freeze: p.freeze ?? 0, hitsAir: e.stats.targets === 'air-ground', hitsGround: true,
      visual: p.visual, arc: p.arc ?? 0, source: e.unit, done: false,
    });
  }

  private areaDamage(team: Team, x: number, y: number, radius: number, damage: number, hitsAir: boolean, hitsGround: boolean, freeze = 0): void {
    for (const o of this.entities) {
      if (!o.alive || o.team === team) continue;
      if (o.stats.flying ? !hitsAir : !hitsGround) continue;
      if (distTo(x, y, o) > radius) continue;
      this.applyDamage(o, damage);
      if (freeze > 0 && o.alive) this.stun(o, freeze, true);
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
      if (!this.playing) continue;
      if (p.splash > 0) {
        this.events.push({ type: 'impact', team: p.team, x: p.tx, y: p.ty, radius: p.splash, visual: p.visual });
        this.areaDamage(p.team, p.tx, p.ty, p.splash, p.damage, p.hitsAir, p.hitsGround, p.freeze);
      } else if (t && t.alive) {
        this.applyDamage(t, p.damage);
        if (p.freeze > 0 && t.alive) this.stun(t, p.freeze, true);
      }
      // 目標已死亡的單體投射物直接消散
    }
  }

  applyDamage(t: Entity, amount: number): void {
    if (!t.alive || !this.playing) return;
    t.hp -= amount;
    this.events.push({ type: 'hit', id: t.id, team: t.team, x: t.x, y: t.y, amount, isTower: t.kind === 'tower', isBuilding: t.kind === 'building' });
    if (t.kind === 'tower' && t.unit === 'king') this.activateKing(t);
    if (t.hp <= 0) this.kill(t);
  }

  private activateKing(k: Entity): void {
    if (k.active || !k.alive) return;
    k.active = true;
    k.activateTimer = KING_ACTIVATION_TIME;
    this.events.push({ type: 'kingActivate', team: k.team });
  }

  private stun(e: Entity, time: number, freeze: boolean): void {
    if (!e.alive) return;
    e.stunTimer = Math.max(e.stunTimer, time);
    e.frozen = freeze || e.frozen;
    e.attacking = false;
    e.locked = false;
    e.cooldown = Math.max(e.cooldown, e.stats.loadTime);
    e.charging = false;
    e.chargeDist = 0;
    e.rampTime = 0;
    this.events.push({ type: 'stun', id: e.id, freeze });
  }

  private knockback(e: Entity, fx: number, fy: number, distance: number, force: boolean): void {
    if (e.kind !== 'troop' || e.stats.flying || distance <= 0) return;
    if (e.stats.ignorePushback && !force) return;
    let dx = e.x - fx;
    let dy = e.y - fy;
    let d = Math.hypot(dx, dy);
    if (d < 1e-6) {
      dx = 0;
      dy = e.team === 0 ? 1 : -1;
      d = 1;
    }
    e.kbx = (dx / d) * distance;
    e.kby = (dy / d) * distance;
    e.kbTime = KNOCKBACK_TIME;
    e.attacking = false;
    e.locked = false;
    e.charging = false;
    e.chargeDist = 0;
    e.cooldown = Math.max(e.cooldown, e.stats.loadTime);
  }

  private kill(t: Entity): void {
    if (!t.alive) return;
    t.alive = false;
    t.hp = 0;
    this.events.push({ type: 'death', id: t.id, team: t.team, kind: t.kind, unit: t.unit, x: t.x, y: t.y, kamikaze: false });
    if (t.kind !== 'tower') {
      this.deathEffects(t);
      return;
    }

    const attacker: Team = t.team === 0 ? 1 : 0;
    const isKing = t.unit === 'king';
    this.events.push({ type: 'towerDown', team: t.team, isKing, x: t.x, y: t.y, cascade: false });
    if (isKing) {
      // 國王塔倒下時，同一方剩下的塔一起倒塌，攻方直接拿到 3 頂皇冠
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
    this.activateKing(this.king(t.team));
    if (this.phase === 'overtime') this.finish(attacker, 'overtime');
  }

  private deathEffects(t: Entity): void {
    const s = t.stats;
    if (s.deathDamage) {
      if (s.deathDamage.delay > 0) {
        const b: Bomb = { id: this.nextId++, team: t.team, unit: t.unit, x: t.x, y: t.y, timer: s.deathDamage.delay, total: s.deathDamage.delay };
        this.bombs.push(b);
        this.events.push({ type: 'bombDrop', id: b.id, team: t.team, unit: t.unit, x: t.x, y: t.y, delay: b.total });
      } else {
        this.blast(t.team, t.unit, t.x, t.y);
      }
    }
    if (s.deathSpawn) {
      const n = s.deathSpawn.count;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2 + Math.PI / 2;
        const r = t.half > 0 ? t.half * 0.6 : 0.6;
        this.spawnUnit(t.team, s.deathSpawn.unit, s.deathSpawn.unit, t.x + Math.cos(a) * r, t.y + Math.sin(a) * r, 0.5, 'death');
      }
    }
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

  /** 地面單位跨河時先走到橋頭，再沿橋過河；會跳河的單位直線前進。 */
  waypoint(e: Entity, tx: number, ty: number): [number, number] {
    if (e.stats.flying || e.stats.jumpsRiver) return [tx, ty];
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
    const half = bridgeHalfWidth - e.stats.radius * 0.6;
    // 已在橋頭範圍內就直接過橋（保留目前 x，讓多隻部隊並排通過）；留一點容差避免卡在邊界
    if (Math.abs(e.x - bx) <= half + 0.02 && Math.abs(e.y - entryY) < 1.2) return [Math.max(bx - half + 0.05, Math.min(bx + half - 0.05, e.x)), exitY];
    const ex = Math.max(bx - half + 0.05, Math.min(bx + half - 0.05, e.x));
    return [ex, entryY];
  }

  private moveToward(e: Entity, target: Entity): void {
    const [wx, wy] = this.waypoint(e, target.x, target.y);
    const d = dist(e.x, e.y, wx, wy);
    if (d < 1e-6) return;
    let ux = (wx - e.x) / d;
    let uy = (wy - e.y) / d;
    if (!e.stats.flying) [ux, uy] = this.steerAround(e, target, ux, uy, d);
    let speed = e.stats.speed * e.slowMul;
    if (e.stats.charge) {
      if (e.charging) speed *= e.stats.charge.speedMul;
    }
    const stepLen = Math.min(d, speed * DT);
    e.x += ux * stepLen;
    e.y += uy * stepLen;
    e.moving = stepLen > 1e-6;
    e.facing = Math.atan2(uy, ux);
    if (e.stats.charge && !e.charging) {
      e.chargeDist += stepLen;
      if (e.chargeDist >= e.stats.charge.distance) {
        e.charging = true;
        this.events.push({ type: 'charge', id: e.id });
      }
    }
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
      const R = o.half * 1.2 + e.stats.radius + 0.1;
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
        const towardCenter = (W / 2 - block.x) * nx;
        e.avoidSide = towardCenter >= 0 ? 1 : -1;
      }
    }
    const R = block.half * 1.2 + e.stats.radius + 0.3;
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

  /** 讓地面單位不穿越防禦塔／建築、不落入河中（橋與跳河單位除外），並限制在場地內。 */
  private constrain(e: Entity, spawning: boolean): void {
    const r = e.stats.radius;
    e.x = Math.max(r, Math.min(W - r, e.x));
    e.y = Math.max(r, Math.min(H - r, e.y));
    e.jumping = false;
    if (e.stats.flying) return;

    for (const o of this.entities) {
      if (o === e || !o.alive || o.half <= 0) continue;
      // 圓與方形佔地的推出
      const hx = o.half + r;
      const dx = e.x - o.x;
      const dy = e.y - o.y;
      if (Math.abs(dx) >= hx || Math.abs(dy) >= hx) continue;
      // 在角落區域時以圓角判定
      const cx = Math.max(-o.half, Math.min(o.half, dx));
      const cy = Math.max(-o.half, Math.min(o.half, dy));
      const ox = dx - cx;
      const oy = dy - cy;
      const od = Math.hypot(ox, oy);
      if (od > 0 && od < r) {
        e.x = o.x + cx + (ox / od) * r;
        e.y = o.y + cy + (oy / od) * r;
        continue;
      }
      if (od >= r) continue;
      // 中心在方形內：沿最短軸推出
      const px = hx - Math.abs(dx);
      const py = hx - Math.abs(dy);
      if (px < py) e.x = o.x + Math.sign(dx || (e.team === 0 ? 1 : -1)) * hx;
      else e.y = o.y + Math.sign(dy || (e.team === 0 ? 1 : -1)) * hx;
    }

    const { riverTop, riverBottom } = ARENA;
    if (e.y > riverTop && e.y < riverBottom) {
      if (e.stats.jumpsRiver && !spawning && e.kbTime <= 0) {
        e.jumping = true;
        return;
      }
      const bx = this.nearestBridge(e.x);
      const half = ARENA.bridgeHalfWidth - r * 0.6;
      if (Math.abs(e.x - bx) > half + 0.01) {
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
    for (const e of this.entities) parts.push(`${e.id}:${e.unit}:${e.x.toFixed(4)}:${e.y.toFixed(4)}:${e.hp.toFixed(2)}:${e.alive ? 1 : 0}`);
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
