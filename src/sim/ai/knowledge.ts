// 電腦對手的卡牌知識：角色、秒傷與能量價值全部由 cards.ts 的數值推導，
// 卡牌數值調整後不必另外改這裡。
import { CARDS, UNITS, type CardDef, type SpellStats, type UnitStats } from '../cards';

export interface CardInfo {
  id: string;
  def: CardDef;
  cost: number;
  kind: CardDef['kind'];
  st?: UnitStats; // 部隊／建築的單位數值
  spell?: SpellStats;
  count: number;
  hp: number; // 總血量（多隻合計）
  dps: number; // 對部隊的總秒傷（熔岩塔取第二段）
  splash: number; // 範圍傷害半徑（法術為法術半徑）
  hitsAir: boolean;
  flying: boolean;
  ranged: boolean; // 射程 ≥ 3 格
  hunter: boolean; // 只打建築
  swarm: boolean; // 3 隻以上、單隻血量低
  tank: boolean; // 單隻高血量前排
  bruiser: boolean; // 中型近戰（能扛也能打）
  spirit: boolean; // 自爆精靈
  win: boolean; // 進攻核心：只打建築、衝鋒、飛桶或地道挖掘者
  damageSpell: boolean; // 用來打價值的傷害法術（不含飛桶、冰凍、狂暴）
  freeze: boolean; // 冰凍法術
  rage: boolean; // 狂暴法術
  pump: boolean; // 能量收集器
  tunnel: boolean; // 可鑽地部署到任何地方
}

const cache = new Map<string, CardInfo>();

export function cardInfo(id: string): CardInfo {
  const hit = cache.get(id);
  if (hit) return hit;
  const def = CARDS[id];
  const st = def.unit ? UNITS[def.unit].stats : undefined;
  const spell = def.spell;
  const count = def.count ?? 1;
  const dmg = st ? (st.ramp ? st.ramp.damages[1] : st.damage) : 0;
  const ci: CardInfo = {
    id,
    def,
    cost: def.cost,
    kind: def.kind,
    st,
    spell,
    count,
    hp: st ? st.hp * count : 0,
    dps: st && st.hitSpeed > 0 ? (dmg * count) / st.hitSpeed : 0,
    splash: st ? (st.splash ?? st.projectile?.splash ?? 0) : (spell?.radius ?? 0),
    hitsAir: def.kind === 'spell' ? !!spell?.hitsAir : st!.targets === 'air-ground',
    flying: !!st?.flying,
    ranged: !!st && st.range >= 3,
    hunter: st?.targets === 'buildings',
    swarm: !!st && count >= 3 && st.hp <= 400,
    tank: !!st && def.kind === 'troop' && count === 1 && st.hp >= 2500,
    bruiser: !!st && def.kind === 'troop' && count === 1 && st.hp >= 1200 && st.hp < 2500 && st.targets !== 'buildings',
    spirit: !!st?.kamikaze && !!st.projectile, // 撲上去自爆的小精靈（攻城衝車雖然也會解體，但它是推進卡）
    win: st?.targets === 'buildings' || spell?.kind === 'barrel' || !!st?.charge || !!st?.tunnelSpeed,
    damageSpell: def.kind === 'spell' && !!spell && spell.kind !== 'barrel' && spell.damage > 0 && !spell.freeze && !spell.rage,
    freeze: !!spell?.freeze,
    rage: !!spell?.rage,
    pump: !!st?.elixirGen,
    tunnel: !!st?.tunnelSpeed,
  };
  cache.set(id, ci);
  return ci;
}

// 由召喚或死亡產生的單位（沒有對應卡牌）的能量價值。
const SPAWN_VALUE: Record<string, number> = (() => {
  const out: Record<string, number> = {};
  const put = (unit: string, v: number) => {
    out[unit] = Math.min(out[unit] ?? Infinity, v);
  };
  for (const c of Object.values(CARDS)) {
    if (!c.unit) continue;
    const st = UNITS[c.unit].stats;
    put(c.unit, c.cost / (c.count ?? 1));
    const ds = st.deathSpawn;
    if (ds) {
      const child = UNITS[ds.unit].stats.hp * ds.count;
      put(ds.unit, (c.cost * (child / (st.hp + child))) / ds.count);
    }
  }
  return out;
})();

/** 單位的能量價值（滿血時）：卡牌費用平均分給同一張卡的每隻；會分裂的單位只算本體那一份。 */
export function unitValue(unit: string, cardId: string): number {
  const c = CARDS[cardId];
  if (c) {
    if (c.kind === 'spell') return c.cost / (c.spell?.spawn?.count ?? 1);
    if (c.unit === unit) {
      const st = UNITS[unit].stats;
      const ds = st.deathSpawn;
      const share = ds ? st.hp / (st.hp + UNITS[ds.unit].stats.hp * ds.count) : 1;
      return (c.cost * share) / (c.count ?? 1);
    }
  }
  return SPAWN_VALUE[unit] ?? 0.3;
}

/** 與 game.ts 相同的多隻部隊隊形（以隊伍 0 視角，+y 朝己方後方）。 */
export function formationOffsets(count: number): [number, number][] {
  switch (count) {
    case 1: return [[0, 0]];
    case 2: return [[-0.6, 0], [0.6, 0]];
    case 3: return [[0, -0.55], [-0.6, 0.4], [0.6, 0.4]];
    case 4: return [[-0.55, -0.55], [0.55, -0.55], [-0.55, 0.55], [0.55, 0.55]];
    case 5: return [[0, 0], [-0.8, -0.6], [0.8, -0.6], [-0.8, 0.6], [0.8, 0.6]];
    default: {
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

/** 法術對單一目標的總傷害（箭雨三波合計；毒霧依停留秒數估算）。 */
export function spellDamage(s: SpellStats, tower: boolean, ticks = 8): number {
  const waves = s.waves ?? 1;
  if (s.kind === 'area') {
    const per = tower ? Math.round(s.damage * s.towerPct) : s.damage;
    return per * Math.min(ticks, Math.round((s.duration ?? 1) / (s.tick ?? 1)));
  }
  const per = tower ? Math.round(s.damage * s.towerPct) : s.damage;
  return per * waves;
}
