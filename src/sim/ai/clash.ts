// 防守評估用的簡化交戰模擬：沿用 game.ts 的索敵規則（視野內最近、沒有就走向最近的塔、
// 開打後鎖定、建築與塔只打射程內），但走直線、不推擠、不繞橋，
// 用來比較「不出牌」與「出某張牌」在接下來幾秒的結果（塔掉血、雙方剩下的價值）。
// 數值直接讀 cards.ts 的 UnitStats：範圍傷害、衝鋒、熔岩塔蓄力、冰凍、召喚、死亡效果都有估算。
import { UNITS, type UnitStats } from '../cards';
import { KING_ACTIVATION_TIME } from '../config';
import { unitValue } from './knowledge';

export type ClashKind = 'troop' | 'building' | 'tower';

export interface ClashUnit {
  side: 0 | 1; // 0 = 電腦自己，1 = 對手
  kind: ClashKind;
  st: UnitStats;
  x: number;
  y: number;
  hp: number;
  hp0: number;
  maxHp: number;
  value: number; // 滿血時的能量價值（塔為 0）
  ready: number; // 幾秒後開始行動（部署、暈眩）
  exists: number; // 幾秒後才會出現在場上（之前不能被打）
  alive: boolean;
  active: boolean; // 國王塔未喚醒時不攻擊
  target: ClashUnit | null;
  locked: boolean;
  attacking: boolean;
  nextHit: number;
  rampT: number;
  moved: number; // 衝鋒累積距離
  charging: boolean;
  spawnAt: number;
  repickAt: number;
  ref: number; // 對應的實體 id（-1 = 假想單位）
  lockRef: number; // 開打中的目標實體 id
}

export interface ClashResult {
  towerDamage: number; // 我方塔損失的血量（含模擬結束時仍在打塔的敵人之後幾秒的傷害）
  towersLost: number;
  enemyTowerDamage: number; // 反推時對方塔損失的血量
  enemyRemain: number; // 對手剩下的能量價值（依血量比例）
  ourRemain: number; // 我方部隊／建築剩下的能量價值
  clearTime: number; // 對手部隊全滅的時間（沒清完 = horizon）
}

/** 預定在某個時間點生效的法術傷害（已算好打到哪些單位）。 */
export interface ClashHit {
  u: ClashUnit;
  dmg: number;
  at: number;
  stun: number;
}

export function clashUnit(
  side: 0 | 1, kind: ClashKind, st: UnitStats, x: number, y: number,
  o: { hp?: number; value?: number; ready?: number; exists?: number; active?: boolean; charging?: boolean; ref?: number; lockRef?: number; rampT?: number } = {},
): ClashUnit {
  const hp = o.hp ?? st.hp;
  const ready = o.ready ?? 0;
  return {
    side, kind, st, x, y, hp, hp0: hp, maxHp: st.hp, value: o.value ?? 0, ready, exists: o.exists ?? 0, alive: hp > 0,
    active: o.active ?? true, target: null, locked: false, attacking: false, nextHit: 0, rampT: o.rampT ?? 0, moved: 0,
    charging: !!o.charging, spawnAt: ready + (st.spawner?.start ?? 0), repickAt: 0, ref: o.ref ?? -1, lockRef: o.lockRef ?? -1,
  };
}

/** 點到單位邊緣的距離（建築／塔看方形佔地，部隊看圓）。 */
function reach(x: number, y: number, o: ClashUnit): number {
  const half = o.st.half ?? 0;
  if (o.kind !== 'troop' && half > 0) {
    const dx = Math.max(0, Math.abs(x - o.x) - half);
    const dy = Math.max(0, Math.abs(y - o.y) - half);
    return Math.hypot(dx, dy);
  }
  return Math.max(0, Math.hypot(x - o.x, y - o.y) - o.st.radius);
}

function edge(a: ClashUnit, b: ClashUnit): number {
  return reach(a.x, a.y, b) - a.st.radius;
}

function canHit(a: ClashUnit, b: ClashUnit): boolean {
  const t = a.st.targets;
  if (t === 'buildings') return b.kind !== 'troop';
  if (t === 'ground') return !b.st.flying;
  return true;
}

const KING_WAKE = KING_ACTIVATION_TIME + 0.7;

export function runClash(list: ClashUnit[], horizon = 11, dt = 0.2, hits: ClashHit[] = [], trace?: (msg: string) => void): ClashResult {
  const blasts: { at: number; side: 0 | 1; x: number; y: number; st: UnitStats }[] = [];
  const queue = [...hits].sort((a, b) => a.at - b.at);
  for (const u of list) {
    if (u.lockRef < 0) continue;
    const t = list.find((o) => o.ref === u.lockRef && o.side !== u.side);
    if (t) {
      u.target = t;
      u.locked = true;
    }
  }

  const wakeKing = (side: 0 | 1, now: number): void => {
    for (const k of list) {
      if (k.kind === 'tower' && k.side === side && k.alive && !k.active) {
        k.active = true;
        k.ready = Math.max(k.ready, now + KING_WAKE);
      }
    }
  };

  const spawn = (side: 0 | 1, unit: string, x: number, y: number, now: number, delay: number): void => {
    const st = UNITS[unit].stats;
    list.push(clashUnit(side, 'troop', st, x, y, { value: unitValue(unit, unit), ready: now + delay, exists: now }));
  };

  const kill = (o: ClashUnit, now: number): void => {
    o.alive = false;
    o.hp = 0;
    const s = o.st;
    if (s.deathDamage) blasts.push({ at: now + s.deathDamage.delay, side: o.side, x: o.x, y: o.y, st: s });
    if (s.deathSpawn) {
      const n = s.deathSpawn.count;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        spawn(o.side, s.deathSpawn.unit, o.x + Math.cos(a) * 0.6, o.y + Math.sin(a) * 0.6, now, 0.5);
      }
    }
    if (o.kind === 'tower') wakeKing(o.side, now);
  };

  const hurt = (o: ClashUnit, amount: number, now: number): void => {
    if (!o.alive || now < o.exists) return;
    o.hp -= amount;
    if (o.kind === 'tower' && !o.active) wakeKing(o.side, now);
    if (o.hp <= 0) kill(o, now);
  };

  /** 與 Game.acquireTarget 相同的規則。 */
  const acquire = (u: ClashUnit, now: number): ClashUnit | null => {
    const isStatic = u.st.speed <= 0;
    const sight = isStatic ? u.st.range : u.st.sight;
    let best: ClashUnit | null = null;
    let bestD = Infinity;
    for (let i = 0; i < list.length; i++) {
      const o = list[i];
      if (!o.alive || o.side === u.side || now < o.exists || !canHit(u, o)) continue;
      const d = edge(u, o);
      if (d <= sight && d < bestD) {
        bestD = d;
        best = o;
      }
    }
    if (best || isStatic) return best;
    for (let i = 0; i < list.length; i++) {
      const o = list[i];
      if (!o.alive || o.side === u.side || o.kind !== 'tower') continue;
      const d = edge(u, o);
      if (d < bestD) {
        bestD = d;
        best = o;
      }
    }
    return best;
  };

  const strike = (u: ClashUnit, tgt: ClashUnit, now: number): void => {
    const s = u.st;
    let dmg = s.damage;
    if (u.charging && s.charge) {
      dmg = s.charge.damage;
      u.charging = false;
      u.moved = 0;
    }
    if (s.ramp) dmg = s.ramp.damages[Math.min(2, Math.floor(u.rampT / s.ramp.stageTime))];
    const splash = s.splash ?? s.projectile?.splash ?? 0;
    const freeze = s.projectile?.freeze ?? 0;
    if (splash > 0) {
      const cx = s.splashSelf ? u.x : tgt.x;
      const cy = s.splashSelf ? u.y : tgt.y;
      const air = s.targets === 'air-ground';
      for (let i = 0; i < list.length; i++) {
        const o = list[i];
        if (!o.alive || o.side === u.side || now < o.exists) continue;
        if (o.st.flying && !air) continue;
        if (reach(cx, cy, o) > splash) continue;
        hurt(o, dmg, now);
        if (freeze > 0 && o.alive) o.ready = Math.max(o.ready, now + freeze);
      }
    } else {
      hurt(tgt, dmg, now);
      if (freeze > 0 && tgt.alive) tgt.ready = Math.max(tgt.ready, now + freeze);
    }
    if (s.kamikaze) {
      u.alive = false;
      u.hp = 0;
    }
  };

  let clear = horizon;
  const steps = Math.ceil(horizon / dt);
  for (let k = 0; k < steps; k++) {
    const now = k * dt;
    while (queue.length && queue[0].at <= now + 1e-9) {
      const h = queue.shift()!;
      if (!h.u.alive) continue;
      hurt(h.u, h.dmg, now);
      if (h.stun > 0 && h.u.alive) {
        h.u.ready = Math.max(h.u.ready, now + h.stun);
        h.u.attacking = false;
        h.u.rampT = 0;
        h.u.charging = false;
        h.u.moved = 0;
      }
    }
    for (let i = blasts.length - 1; i >= 0; i--) {
      const b = blasts[i];
      if (b.at > now) continue;
      blasts.splice(i, 1);
      const dd = b.st.deathDamage!;
      for (let j = 0; j < list.length; j++) {
        const o = list[j];
        if (!o.alive || o.side === b.side || o.st.flying || now < o.exists) continue;
        if (reach(b.x, b.y, o) > dd.radius) continue;
        hurt(o, o.kind === 'tower' ? Math.round(dd.damage * dd.towerMul) : dd.damage, now);
      }
    }
    let foes = 0;
    for (let i = 0; i < list.length; i++) {
      const u = list[i];
      if (!u.alive) continue;
      if (u.side === 1 && u.kind !== 'tower') foes++;
      if (now < u.ready || now < u.exists) continue;
      const s = u.st;
      if (u.kind === 'building' && s.lifetime) {
        u.hp -= (u.maxHp / s.lifetime) * dt;
        if (u.hp <= 0) {
          kill(u, now);
          continue;
        }
      }
      if (s.spawner && now >= u.spawnAt) {
        const sp = s.spawner;
        for (let c = 0; c < sp.count; c++) spawn(u.side, sp.unit, u.x + (c % 2 === 0 ? -0.6 : 0.6), u.y + (u.side === 0 ? 0.6 : -0.6), now, 0.3 + c * sp.interval);
        u.spawnAt = now + sp.pause;
      }
      if (u.kind === 'tower' && !u.active) continue;
      if (s.damage <= 0 && !s.ramp) continue;

      const isStatic = s.speed <= 0;
      let t = u.target;
      if (t && !t.alive) t = null;
      if (t && u.locked) {
        const d = edge(u, t);
        if (isStatic ? d > s.range + 0.05 : d > Math.max(s.sight, s.range) + 1) t = null;
      }
      if (!t || (!u.locked && now >= u.repickAt)) {
        t = acquire(u, now);
        u.repickAt = now + 0.4;
      }
      if (t !== u.target) {
        u.attacking = false;
        u.locked = false;
        u.rampT = 0;
        u.target = t;
      }
      if (!t) continue;
      const d = edge(u, t);
      if (d <= s.range) {
        if (!u.attacking) {
          u.attacking = true;
          u.nextHit = Math.max(u.nextHit, now + s.loadTime);
        }
        u.locked = true;
        if (s.ramp) u.rampT += dt;
        if (now >= u.nextHit) {
          strike(u, t, now);
          u.nextHit = now + s.hitSpeed;
        }
        u.moved = 0;
        continue;
      }
      u.attacking = false;
      if (isStatic) continue;
      const speed = s.speed * (u.charging && s.charge ? s.charge.speedMul : 1);
      const stepLen = Math.min(d - s.range + 0.02, speed * dt);
      const dx = t.x - u.x;
      const dy = t.y - u.y;
      const len = Math.hypot(dx, dy) || 1;
      u.x += (dx / len) * stepLen;
      u.y += (dy / len) * stepLen;
      if (s.charge) {
        u.moved += stepLen;
        if (u.moved >= s.charge.distance) u.charging = true;
      }
    }
    if (trace && k % 5 === 0) {
      trace(`${now.toFixed(1)} ${list.filter((u) => u.alive).map((u) => `${u.side}:${u.kind === 'tower' ? 'T' : ''}${u.st.hp}@${u.x.toFixed(1)},${u.y.toFixed(1)}:${Math.round(u.hp)}${u.attacking ? '*' : ''}`).join(' ')}`);
    }
    if (foes === 0 && blasts.length === 0 && queue.length === 0) {
      clear = now;
      break;
    }
  }

  const r: ClashResult = { towerDamage: 0, towersLost: 0, enemyTowerDamage: 0, enemyRemain: 0, ourRemain: 0, clearTime: clear };
  for (const u of list) {
    if (u.kind === 'tower') {
      if (u.side === 0) {
        r.towerDamage += u.hp0 - Math.max(0, u.hp);
        if (!u.alive) r.towersLost++;
      } else r.enemyTowerDamage += u.hp0 - Math.max(0, u.hp);
      continue;
    }
    const frac = u.alive ? Math.max(0, u.hp) / u.maxHp : 0;
    if (u.side === 1) {
      r.enemyRemain += u.value * frac;
      // 模擬結束時還在打塔的敵人：之後幾秒也會繼續造成傷害
      if (u.alive && u.attacking && u.target?.kind === 'tower' && u.st.hitSpeed > 0) r.towerDamage += (u.st.damage / u.st.hitSpeed) * 4;
    } else r.ourRemain += u.value * frac;
  }
  return r;
}
