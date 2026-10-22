// 電腦眼中的敵方單位快照與移動預測。只讀取場上看得到的狀態（位置、血量、目標），
// 不讀對手手牌、牌序或能量。
import type { UnitStats } from '../cards';
import { distTo, type Entity, type EntityKind, type Game, type Team } from '../game';

export interface Foe {
  e: Entity | null; // null = 尚未落地（飛行中的哥布林飛桶）
  unit: string;
  cardId: string;
  st: UnitStats;
  kind: EntityKind;
  x: number; // 世界座標
  y: number;
  hp: number; // 扣掉我方飛行中法術後的預估血量
  maxHp: number;
  value: number; // 滿血時的能量價值
  appear: number; // 幾秒後才會出現在場上（0 = 已在場上）
  deploy: number; // 出現後還要幾秒才開始行動
  pred: Map<number, [number, number]>; // 預測位置快取（鍵為 0.1 秒刻度）
}

/** 點到敵方單位邊緣的距離（與 game.ts 的 distTo 相同規則：建築／塔看方形佔地）。 */
export function edgeAt(x: number, y: number, kind: EntityKind, st: UnitStats, ux: number, uy: number): number {
  const half = st.half ?? 0;
  if (kind !== 'troop' && half > 0) {
    const dx = Math.max(0, Math.abs(x - ux) - half);
    const dy = Math.max(0, Math.abs(y - uy) - half);
    return Math.hypot(dx, dy);
  }
  return Math.max(0, Math.hypot(x - ux, y - uy) - st.radius);
}

/** 離 (x, y) 最近的某隊存活的塔。 */
export function nearestTower(game: Game, team: Team, x: number, y: number): Entity | undefined {
  let best: Entity | undefined;
  let bestD = Infinity;
  for (const t of game.entities) {
    if (t.kind !== 'tower' || !t.alive || t.team !== team) continue;
    const d = distTo(x, y, t);
    if (d < bestD) {
      bestD = d;
      best = t;
    }
  }
  return best;
}

/**
 * 推估實體 t 秒後的位置：沿目前目標（沒有就最近的敵塔）的路徑點前進，到射程內就停下。
 * 部署中、暈眩、擊退中先原地等待。
 */
export function predictPos(game: Game, e: Entity, t: number): [number, number] {
  if (t <= 0 || !e.alive || e.stats.speed <= 0) return [e.x, e.y];
  let left = t - Math.max(e.deployTimer, e.stunTimer, e.kbTime);
  if (left <= 0) return [e.x, e.y];
  let tgt = e.targetId >= 0 ? game.get(e.targetId) : undefined;
  if (!tgt || !tgt.alive) tgt = nearestTower(game, e.team === 0 ? 1 : 0, e.x, e.y);
  if (!tgt) return [e.x, e.y];
  if (e.attacking && game.edgeDist(e, tgt) <= e.stats.range + 0.05) return [e.x, e.y];
  let speed = e.stats.speed * (e.slowTimer > 0 ? e.slowMul : 1);
  if (e.charging && e.stats.charge) speed *= e.stats.charge.speedMul;
  let dist = left * speed;
  let x = e.x;
  let y = e.y;
  const probe = { x, y, stats: e.stats } as unknown as Entity;
  for (let i = 0; i < 8 && dist > 1e-3; i++) {
    const gap = distTo(x, y, tgt) - e.stats.radius - e.stats.range;
    if (gap <= 0) break;
    probe.x = x;
    probe.y = y;
    const [wx, wy] = game.waypoint(probe, tgt.x, tgt.y);
    const d = Math.hypot(wx - x, wy - y);
    if (d < 1e-4) break;
    const step = Math.min(dist, d, Math.max(0.1, gap));
    x += ((wx - x) / d) * step;
    y += ((wy - y) / d) * step;
    dist -= step;
  }
  return [x, y];
}

/** 敵方單位 t 秒後的預測位置（含快取）；尚未落地的飛桶哥布林停在落點。 */
export function foePos(game: Game, f: Foe, t: number): [number, number] {
  if (!f.e || f.kind !== 'troop') return [f.x, f.y];
  const key = Math.max(0, Math.round(t * 10));
  const hit = f.pred.get(key);
  if (hit) return hit;
  const p = predictPos(game, f.e, key / 10);
  f.pred.set(key, p);
  return p;
}
