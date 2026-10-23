// 法術瞄準：預測移動目標在法術生效時的位置，挑打到最多價值（部隊＋塔）的落點。
import { ARENA } from '../config';
import type { SpellStats } from '../cards';
import { distTo, type Entity, type Game, type Team } from '../game';
import { cardInfo, spellDamage } from './knowledge';
import { edgeAt, foePos, type Foe } from './foe';

export interface SpellHit {
  foe: Foe;
  dmg: number;
}

export interface SpellPlan {
  cardId: string;
  x: number; // 已對齊格子的世界座標
  y: number;
  land: number; // 幾秒後生效
  value: number; // 打到的能量價值（含塔傷）
  hits: SpellHit[];
  towerDmg: number;
  tower: Entity | null;
}

export interface SpellCtx {
  game: Game;
  team: Team;
  foes: Foe[];
  towers: Entity[]; // 對手存活的塔
  aim: number; // 0～1：預判移動目標的程度（0 = 瞄準目前位置）
  delay?: number; // 打算幾秒後才出手（防守規劃用）
  towerValue: (t: Entity, dmg: number) => number; // 塔傷的能量價值
  foeBonus: (f: Foe) => number; // 額外價值倍率（例如正在威脅我方塔的單位）
}

/** 法術從己方國王塔飛到 (x, y) 的秒數；雷擊、毒霧、滾木為 0。 */
export function spellFlight(game: Game, team: Team, s: SpellStats, x: number, y: number): number {
  if (s.kind === 'instant' || s.kind === 'area' || s.kind === 'roll' || s.speed <= 0) return 0;
  const k = game.king(team);
  return Math.hypot(k.x - x, k.y - y) / s.speed;
}

/** 打掉 dmg 血的能量價值；打死另加三成（少一隻在場上輸出）。 */
function hitValue(f: Foe, dmg: number): number {
  if (f.hp <= 0) return 0;
  let v = f.value * (Math.min(dmg, f.hp) / f.maxHp);
  if (dmg >= f.hp) v += f.value * 0.3;
  return v;
}

function moving(f: Foe, land: number): boolean {
  return !!f.e && f.kind === 'troop' && f.st.speed > 0 && !f.e.attacking && f.e.deployTimer < land;
}

function poisonTicks(f: Foe): number {
  if (f.kind !== 'troop' || !f.e || f.e.attacking || f.st.speed <= 0) return 8;
  return Math.max(2, Math.min(8, Math.round(4 / f.st.speed + f.e.deployTimer)));
}

/** 落雷：只會劈範圍內血量最高的 bolts 個目標（含塔），每個一道。 */
function evalLightning(ctx: SpellCtx, cardId: string, s: SpellStats, foes: Foe[], x: number, y: number): SpellPlan {
  const g = ctx.game;
  const wait = ctx.delay ?? 0;
  const plan: SpellPlan = { cardId, x, y, land: 0, value: 0, hits: [], towerDmg: 0, tower: null };
  type Cand = { hp: number; foe?: Foe; tower?: Entity };
  const cands: Cand[] = [];
  for (const f of foes) {
    if (f.appear > wait + 1.2) continue;
    const [px, py] = foePos(g, f, wait + 0.5 * ctx.aim);
    if (edgeAt(x, y, f.kind, f.st, px, py) > s.radius) continue;
    cands.push({ hp: f.hp, foe: f });
  }
  for (const t of ctx.towers) if (distTo(x, y, t) <= s.radius) cands.push({ hp: t.hp, tower: t });
  cands.sort((a, b) => b.hp - a.hp);
  for (const c of cands.slice(0, s.bolts ?? 3)) {
    if (c.foe) {
      const f = c.foe;
      let v = hitValue(f, s.damage) * (1 + ctx.foeBonus(f));
      if (f.e && f.st.ramp && f.e.rampTime >= 1.2) v += 2;
      else if (f.e?.charging) v += 0.8;
      plan.hits.push({ foe: f, dmg: s.damage });
      plan.value += v;
    } else if (c.tower) {
      const dmg = spellDamage(s, true);
      plan.towerDmg = dmg;
      plan.tower = c.tower;
      plan.value += ctx.towerValue(c.tower, dmg);
    }
  }
  return plan;
}

function evalPoint(ctx: SpellCtx, cardId: string, s: SpellStats, foes: Foe[], x: number, y: number): SpellPlan {
  if (s.bolts) return evalLightning(ctx, cardId, s, foes, x, y);
  const g = ctx.game;
  const land = spellFlight(g, ctx.team, s, x, y);
  const wait = ctx.delay ?? 0;
  const lead = wait + land * ctx.aim;
  // 飛得越久，移動目標的落點越不準（火箭只適合打定點）
  const trust = Math.max(0.35, Math.min(1, 1.25 - 0.25 * land));
  const plan: SpellPlan = { cardId, x, y, land, value: 0, hits: [], towerDmg: 0, tower: null };
  // 持續型法術（毒霧）會打到之後才出現的目標（例如墓地陸續冒出的骷髏）
  const lastWave = land + (s.kind === 'area' ? (s.duration ?? 0) * 0.8 : (s.waves ?? 1) * (s.waveInterval ?? 0));
  for (const f of foes) {
    if (f.appear > wait + lastWave + 0.02) continue; // 法術生效時還沒落地（飛桶）
    const [px, py] = foePos(g, f, lead);
    if (edgeAt(x, y, f.kind, f.st, px, py) > s.radius) continue;
    const dmg = spellDamage(s, false, s.kind === 'area' ? poisonTicks(f) : 8);
    let v = hitValue(f, dmg) * (1 + ctx.foeBonus(f));
    if (moving(f, land)) v *= trust;
    if (s.stun && f.e) {
      // 雷擊打斷熔岩塔蓄力、衝鋒
      if (f.st.ramp && f.e.rampTime >= 1.2) v += 2;
      else if (f.e.charging) v += 0.8;
      else v += 0.1;
    }
    plan.hits.push({ foe: f, dmg });
    plan.value += v;
  }
  for (const t of ctx.towers) {
    if (distTo(x, y, t) > s.radius) continue;
    const dmg = spellDamage(s, true);
    plan.towerDmg = Math.max(plan.towerDmg, dmg);
    plan.tower = t;
    plan.value += ctx.towerValue(t, dmg);
  }
  return plan;
}

/** 滾木：從落點朝對方滾 rollRange 格，掃過寬 2×radius 的帶狀區域。 */
function planLog(ctx: SpellCtx, cardId: string, s: SpellStats, foes: Foe[]): SpellPlan | null {
  const g = ctx.game;
  const dir = ctx.team === 0 ? -1 : 1;
  const wait = ctx.delay ?? 0;
  const ground = foes.filter((f) => !f.st.flying);
  const seen = new Set<string>();
  let best: SpellPlan | null = null;
  const evalLog = (cx: number, cy: number) => {
    const [sx, sy] = g.snap(cardId, cx, cy);
    const key = `${sx},${sy}`;
    if (seen.has(key)) return;
    seen.add(key);
    const plan: SpellPlan = { cardId, x: sx, y: sy, land: 0, value: 0, hits: [], towerDmg: 0, tower: null };
    for (const f of ground) {
      if (f.appear > wait + 0.6) continue;
      const [px, py] = foePos(g, f, wait + 0.5 * ctx.aim);
      const ext = f.kind !== 'troop' && (f.st.half ?? 0) > 0 ? f.st.half! : f.st.radius;
      if (Math.abs(px - sx) - ext > s.radius) continue;
      const along = (py - sy) * dir; // 沿滾動方向的距離
      if (along < -(s.rollHalfDepth! + ext) || along > s.rollRange! + s.rollHalfDepth! + ext) continue;
      plan.hits.push({ foe: f, dmg: s.damage });
      plan.value += hitValue(f, s.damage) * (1 + ctx.foeBonus(f));
    }
    for (const t of ctx.towers) {
      const along = (t.y - sy) * dir;
      if (Math.abs(t.x - sx) - t.half > s.radius) continue;
      if (along < -(s.rollHalfDepth! + t.half) || along > s.rollRange! + s.rollHalfDepth! + t.half) continue;
      const dmg = spellDamage(s, true);
      plan.towerDmg = dmg;
      plan.tower = t;
      plan.value += ctx.towerValue(t, dmg);
    }
    if (!best || plan.value > best.value) best = plan;
  };
  for (const f of ground) {
    if (f.appear > wait + 0.6) continue;
    const [px, py] = foePos(g, f, wait + 0.5 * ctx.aim);
    // 落點放在目標「上游」一點，滾出去就先撞到它
    const cy = py - dir * (f.st.radius + 0.35);
    for (const ox of [0, -0.9, 0.9]) evalLog(Math.max(0.5, Math.min(ARENA.width - 0.5, px + ox)), cy);
  }
  return best;
}

/** 這張法術對 foes 的最佳落點；沒有可打的目標回傳 null。 */
export function planSpell(ctx: SpellCtx, cardId: string, subset?: Foe[]): SpellPlan | null {
  const ci = cardInfo(cardId);
  const s = ci.spell;
  if (!s || !ci.damageSpell) return null;
  const foes = (subset ?? ctx.foes).filter((f) => f.hp > 0 && (s.hitsAir || !f.st.flying));
  if (s.kind === 'roll') return planLog(ctx, cardId, s, foes);
  const g = ctx.game;
  const at = (f: Foe): [number, number] => {
    const t0 = spellFlight(g, ctx.team, s, f.x, f.y);
    return foePos(g, f, (ctx.delay ?? 0) + t0 * ctx.aim);
  };
  const pts: [number, number][] = [];
  const base = foes.map(at);
  for (const p of base) pts.push(p);
  const lim = Math.min(base.length, 14);
  for (let i = 0; i < lim; i++) {
    for (let j = i + 1; j < lim; j++) {
      const [ax, ay] = base[i];
      const [bx, by] = base[j];
      if (Math.hypot(ax - bx, ay - by) <= s.radius * 2) pts.push([(ax + bx) / 2, (ay + by) / 2]);
    }
  }
  for (const t of ctx.towers) {
    pts.push([t.x, t.y]);
    for (const [px, py] of base) {
      const d = distTo(px, py, t);
      if (d > s.radius * 2) continue;
      // 塔邊與部隊之間：一發同時打到塔和部隊
      pts.push([(px + t.x) / 2, (py + t.y) / 2]);
    }
  }
  const seen = new Set<string>();
  let best: SpellPlan | null = null;
  for (const [x, y] of pts) {
    const [sx, sy] = g.snap(cardId, x, y);
    const key = `${sx},${sy}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const plan = evalPoint(ctx, cardId, s, foes, sx, sy);
    if (!best || plan.value > best.value) best = plan;
  }
  return best;
}
