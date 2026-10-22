// 卡牌與單位資料。
// 名稱與外觀全為本作原創的通用奇幻原型；數值依公開資料校準到 11 級（錦標賽標準）：
//   RoyaleAPI cr-api-data（2023-10-18 資料快照）→ 上層 reference/analysis/cr-stats-l11.json
//   換算：毫秒 → 秒、1000 = 1 格、移動速度 60 = 每秒 1 格。標 [A] 者為查不到公開數字的近似值。
// 每張卡對應的資料集原型與來源見上層 EVIDENCE.md 的「卡牌對照表」。

export type TargetKind = 'ground' | 'air-ground' | 'buildings';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type CardKind = 'troop' | 'spell' | 'building';

/** 投射物外觀（只影響渲染與音效）。 */
export type ProjectileVisual =
  | 'arrow' | 'bullet' | 'fireball' | 'spear' | 'bomb' | 'spit' | 'cannonball' | 'magic' | 'ice' | 'fire' | 'tower-arrow' | 'king-ball';

export interface ProjectileSpec {
  speed: number; // 格／秒
  visual: ProjectileVisual;
  splash?: number; // 落點範圍半徑
  freeze?: number; // 命中冰凍秒數
  arc?: number; // 拋物線高度（格，只影響畫面）
}

export interface UnitStats {
  hp: number;
  damage: number;
  hitSpeed: number; // 攻擊間隔（秒）
  loadTime: number; // 鎖定目標後到第一下命中的準備時間（秒）
  range: number; // 攻擊距離（邊緣到邊緣，格）
  sight: number; // 索敵距離（格）
  speed: number; // 格／秒，建築為 0
  radius: number; // 碰撞半徑
  mass: number;
  flying: boolean;
  flyHeight: number; // 飛行高度（格，只影響畫面）
  targets: TargetKind;
  deployTime: number;
  splash?: number; // 近戰範圍傷害半徑
  splashSelf?: boolean; // 以自己為中心（旋斧）而非以目標為中心
  projectile?: ProjectileSpec;
  ignorePushback?: boolean;
  jumpsRiver?: boolean;
  kamikaze?: boolean;
  charge?: { distance: number; speedMul: number; damage: number };
  ramp?: { damages: [number, number, number]; stageTime: number };
  deathDamage?: { damage: number; radius: number; pushback: number; delay: number; towerMul: number; visual: 'quake' | 'bomb' };
  deathSpawn?: { unit: string; count: number };
  spawner?: { unit: string; count: number; start: number; pause: number; interval: number };
  lifetime?: number; // 建築存在秒數
  half?: number; // 建築方形佔地的半邊長
}

export interface UnitDef {
  id: string;
  name: string;
  stats: UnitStats;
}

export type SpellKind = 'projectile' | 'instant' | 'area' | 'roll' | 'barrel';

export interface SpellStats {
  kind: SpellKind;
  radius: number;
  damage: number;
  towerPct: number; // 對公主塔／國王塔的傷害比例
  speed: number; // 從己方國王塔飛行的速度（格／秒），0 = 立即
  hitsAir: boolean;
  waves?: number;
  waveInterval?: number;
  stun?: number;
  pushback?: number;
  duration?: number;
  tick?: number;
  slow?: number;
  rollRange?: number;
  rollHalfDepth?: number;
  spawn?: { unit: string; count: number; deployTime: number };
}

export interface CardDef {
  id: string;
  name: string;
  glyph: string; // 備援用單字圖示（WebGL 不可用時）
  color: string; // 卡面主色
  cost: number;
  kind: CardKind;
  rarity: Rarity;
  role: string; // 卡組畫面的一句話說明
  unit?: string; // 部隊／建築使用的單位 id
  count?: number;
  spell?: SpellStats;
}

const ground = (o: Partial<UnitStats> & Pick<UnitStats, 'hp' | 'damage' | 'hitSpeed' | 'loadTime' | 'range' | 'speed'>): UnitStats => ({
  sight: 5.5,
  radius: 0.5,
  mass: 4,
  flying: false,
  flyHeight: 0,
  targets: 'ground',
  deployTime: 1,
  ...o,
});

const air = (o: Partial<UnitStats> & Pick<UnitStats, 'hp' | 'damage' | 'hitSpeed' | 'loadTime' | 'range' | 'speed' | 'flyHeight'>): UnitStats =>
  ground({ targets: 'air-ground', ...o, flying: true });

// ───────── 單位（可由卡牌、建築或死亡效果產生） ─────────

export const UNITS: Record<string, UnitDef> = {
  knight: { id: 'knight', name: '騎士', stats: ground({ hp: 1766, damage: 202, hitSpeed: 1.2, loadTime: 0.7, range: 1.2, speed: 1, mass: 6 }) },
  archer: {
    id: 'archer', name: '弓箭手',
    stats: ground({ hp: 304, damage: 107, hitSpeed: 0.9, loadTime: 0.4, range: 5, speed: 1, mass: 3, targets: 'air-ground', projectile: { speed: 10, visual: 'arrow', arc: 1 } }),
  },
  giant: {
    id: 'giant', name: '巨人',
    stats: ground({ hp: 4091, damage: 254, hitSpeed: 1.5, loadTime: 1, range: 1.2, speed: 0.75, sight: 7.5, radius: 0.75, mass: 18, targets: 'buildings', ignorePushback: true }),
  },
  goblin: { id: 'goblin', name: '哥布林', stats: ground({ hp: 202, damage: 120, hitSpeed: 1.1, loadTime: 0.7, range: 0.5, speed: 2, mass: 2 }) },
  spear_goblin: {
    id: 'spear_goblin', name: '投矛哥布林',
    stats: ground({ hp: 133, damage: 81, hitSpeed: 1.7, loadTime: 1.2, range: 5.5, speed: 2, mass: 1, targets: 'air-ground', projectile: { speed: 500 / 60, visual: 'spear', arc: 1.2 } }),
  },
  skeleton: { id: 'skeleton', name: '骷髏兵', stats: ground({ hp: 81, damage: 81, hitSpeed: 1, loadTime: 0.5, range: 0.5, speed: 1.5, mass: 1 }) },
  musketeer: {
    id: 'musketeer', name: '火槍手',
    stats: ground({ hp: 720, damage: 218, hitSpeed: 1, loadTime: 0.2, range: 6, sight: 6, speed: 1, mass: 5, targets: 'air-ground', projectile: { speed: 1000 / 60, visual: 'bullet' } }),
  },
  wizard: {
    id: 'wizard', name: '火焰法師',
    stats: ground({ hp: 720, damage: 281, hitSpeed: 1.4, loadTime: 1, range: 5.5, speed: 1, mass: 5, targets: 'air-ground', projectile: { speed: 10, visual: 'fireball', splash: 1.5, arc: 0.6 } }),
  },
  iron_swordsman: { id: 'iron_swordsman', name: '鐵甲劍士', stats: ground({ hp: 1361, damage: 720, hitSpeed: 1.6, loadTime: 1.1, range: 0.8, speed: 1.5, radius: 0.45, mass: 4 }) },
  wolf_rider: {
    id: 'wolf_rider', name: '狼騎兵',
    stats: ground({ hp: 1696, damage: 318, hitSpeed: 1.6, loadTime: 1, range: 0.8, speed: 2, sight: 9.5, radius: 0.6, mass: 4, targets: 'buildings', jumpsRiver: true }),
  },
  axe_dwarf: { id: 'axe_dwarf', name: '旋斧矮人', stats: ground({ hp: 1908, damage: 267, hitSpeed: 1.5, loadTime: 1.4, range: 1.2, speed: 1, mass: 5, splash: 2, splashSelf: true }) },
  lancer: {
    id: 'lancer', name: '衝鋒騎士',
    // 衝刺距離：資料集 charge_range = 300，換算單位不明，以 3 格近似 [A]
    stats: ground({ hp: 1920, damage: 392, hitSpeed: 1.4, loadTime: 0.9, range: 1.6, speed: 1, radius: 0.6, mass: 6, ignorePushback: true, jumpsRiver: true, charge: { distance: 3, speedMul: 2, damage: 784 } }),
  },
  bomber: {
    id: 'bomber', name: '炸彈兵',
    stats: ground({ hp: 332, damage: 222, hitSpeed: 1.8, loadTime: 1.6, range: 4.5, speed: 1, mass: 4, projectile: { speed: 400 / 60, visual: 'bomb', splash: 1.5, arc: 2 } }),
  },
  barbarian: { id: 'barbarian', name: '蠻族戰士', stats: ground({ hp: 670, damage: 192, hitSpeed: 1.3, loadTime: 0.9, range: 0.7, speed: 1, mass: 4 }) },
  golem: {
    id: 'golem', name: '石巨像',
    stats: ground({
      hp: 5120, damage: 312, hitSpeed: 2.5, loadTime: 1.5, range: 0.75, speed: 0.75, sight: 7, radius: 0.75, mass: 20, targets: 'buildings', deployTime: 3, ignorePushback: true,
      deathDamage: { damage: 224, radius: 2, pushback: 1.8, delay: 0, towerMul: 1, visual: 'quake' },
      deathSpawn: { unit: 'golemite', count: 2 },
    }),
  },
  golemite: {
    id: 'golemite', name: '小石像',
    stats: ground({
      hp: 1040, damage: 49, hitSpeed: 2.5, loadTime: 1.5, range: 0.25, speed: 0.75, sight: 7, radius: 0.5, mass: 6, targets: 'buildings',
      deathDamage: { damage: 99, radius: 2, pushback: 0.9, delay: 0, towerMul: 1, visual: 'quake' },
    }),
  },
  giant_skeleton: {
    id: 'giant_skeleton', name: '巨骷髏',
    // 死亡炸彈 3 秒後爆炸、對塔雙倍傷害 [W／R]
    stats: ground({
      hp: 3424, damage: 267, hitSpeed: 1.4, loadTime: 1.1, range: 0.8, speed: 1, sight: 5, radius: 1, mass: 18, ignorePushback: true,
      deathDamage: { damage: 534, radius: 3, pushback: 1.8, delay: 3, towerMul: 2, visual: 'bomb' },
    }),
  },
  ice_spirit: {
    id: 'ice_spirit', name: '冰精靈',
    stats: ground({ hp: 230, damage: 110, hitSpeed: 0.3, loadTime: 0.1, range: 2.5, speed: 2, radius: 0.4, mass: 1, targets: 'air-ground', kamikaze: true, projectile: { speed: 400 / 60, visual: 'ice', splash: 1.5, freeze: 1.2, arc: 1.5 } }),
  },
  fire_spirit: {
    id: 'fire_spirit', name: '火精靈',
    stats: ground({ hp: 230, damage: 207, hitSpeed: 0.3, loadTime: 0.1, range: 2, speed: 2, radius: 0.4, mass: 1, targets: 'air-ground', kamikaze: true, projectile: { speed: 400 / 60, visual: 'fire', splash: 2.3, arc: 1.5 } }),
  },
  witch: {
    id: 'witch', name: '死靈女巫',
    stats: ground({
      hp: 838, damage: 134, hitSpeed: 1.1, loadTime: 0.4, range: 5.5, speed: 1, mass: 8, targets: 'air-ground', projectile: { speed: 10, visual: 'magic', splash: 1 },
      spawner: { unit: 'skeleton', count: 4, start: 1, pause: 7, interval: 0 },
    }),
  },
  baby_dragon: {
    id: 'baby_dragon', name: '幼龍',
    stats: air({ hp: 1152, damage: 160, hitSpeed: 1.5, loadTime: 1.2, range: 3.5, speed: 1.5, flyHeight: 3.5, mass: 5, projectile: { speed: 500 / 60, visual: 'fire', splash: 1.2 } }),
  },
  bat: { id: 'bat', name: '蝙蝠', stats: air({ hp: 81, damage: 81, hitSpeed: 1.3, loadTime: 0.7, range: 1.2, speed: 2, flyHeight: 2, mass: 1 }) },
  gargoyle: {
    id: 'gargoyle', name: '石像鬼',
    stats: air({ hp: 230, damage: 117, hitSpeed: 1, loadTime: 0.5, range: 1.6, speed: 1.5, flyHeight: 1.5, mass: 2, projectile: { speed: 1000 / 60, visual: 'spit' } }),
  },
  bomb_blimp: {
    id: 'bomb_blimp', name: '炸彈飛艇',
    // 死亡炸彈：資料集為 3 秒部署時間，畫面上以 1 秒落地爆炸近似 [A]
    stats: air({
      hp: 1680, damage: 640, hitSpeed: 2, loadTime: 1.8, range: 0.1, speed: 1, sight: 7.7, flyHeight: 3, mass: 6, targets: 'buildings',
      deathDamage: { damage: 240, radius: 3, pushback: 0, delay: 1, towerMul: 1, visual: 'bomb' },
    }),
  },
  cannon: {
    id: 'cannon', name: '加農砲',
    // 首發準備時間資料集為 0，以 0.3 秒近似 [A]；2×2 佔地 [A]
    stats: ground({ hp: 824, damage: 212, hitSpeed: 0.9, loadTime: 0.3, range: 5.5, speed: 0, radius: 0.6, mass: 100, lifetime: 30, half: 1, projectile: { speed: 1000 / 60, visual: 'cannonball' } }),
  },
  inferno: {
    id: 'inferno', name: '熔岩塔',
    // 三段傷害：第 1 段為資料集 11 級值，第 2、3 段以稀有度倍率換算 [R＋A]
    stats: ground({ hp: 1749, damage: 42, hitSpeed: 0.4, loadTime: 1.2, range: 6, sight: 6, speed: 0, radius: 0.6, mass: 100, targets: 'air-ground', lifetime: 30, half: 1, ramp: { damages: [42, 159, 846], stageTime: 2 } }),
  },
  tombstone: {
    id: 'tombstone', name: '骷髏墓碑',
    stats: ground({
      hp: 530, damage: 0, hitSpeed: 10, loadTime: 0, range: 0, sight: 0, speed: 0, radius: 1, mass: 100, lifetime: 30, half: 1,
      spawner: { unit: 'skeleton', count: 2, start: 0, pause: 3.5, interval: 0.5 },
      deathSpawn: { unit: 'skeleton', count: 4 },
    }),
  },
};

// ───────── 卡牌 ─────────

export const CARDS: Record<string, CardDef> = {
  knight: { id: 'knight', name: '騎士', glyph: '騎', color: '#5b7bd5', cost: 3, kind: 'troop', rarity: 'common', role: '耐打的近戰坦克，價格實惠', unit: 'knight' },
  archers: { id: 'archers', name: '弓箭手', glyph: '弓', color: '#3f9c6b', cost: 3, kind: 'troop', rarity: 'common', role: '兩名遠程射手，可打空中', unit: 'archer', count: 2 },
  giant: { id: 'giant', name: '巨人', glyph: '巨', color: '#c48a4a', cost: 5, kind: 'troop', rarity: 'rare', role: '超高血量，只攻擊建築', unit: 'giant' },
  goblins: { id: 'goblins', name: '哥布林', glyph: '哥', color: '#5fae3a', cost: 2, kind: 'troop', rarity: 'common', role: '四隻極快的近戰小兵', unit: 'goblin', count: 4 },
  spear_goblins: { id: 'spear_goblins', name: '投矛哥布林', glyph: '矛', color: '#6e9a32', cost: 2, kind: 'troop', rarity: 'common', role: '三隻遠程，可打空中', unit: 'spear_goblin', count: 3 },
  skeletons: { id: 'skeletons', name: '骷髏兵', glyph: '骷', color: '#8f97a3', cost: 1, kind: 'troop', rarity: 'common', role: '三隻便宜小兵，循環與分心', unit: 'skeleton', count: 3 },
  skeleton_army: { id: 'skeleton_army', name: '骷髏大軍', glyph: '軍', color: '#6c7380', cost: 3, kind: 'troop', rarity: 'epic', role: '十五隻骷髏圍毆單體', unit: 'skeleton', count: 15 },
  musketeer: { id: 'musketeer', name: '火槍手', glyph: '槍', color: '#8a5bd5', cost: 4, kind: 'troop', rarity: 'rare', role: '長射程單體，可打空中', unit: 'musketeer' },
  wizard: { id: 'wizard', name: '火焰法師', glyph: '法', color: '#d5553f', cost: 5, kind: 'troop', rarity: 'rare', role: '遠程範圍火焰，可打空中', unit: 'wizard' },
  iron_swordsman: { id: 'iron_swordsman', name: '鐵甲劍士', glyph: '鐵', color: '#5d6b8c', cost: 4, kind: 'troop', rarity: 'rare', role: '單體高傷害，剋坦克', unit: 'iron_swordsman' },
  wolf_rider: { id: 'wolf_rider', name: '狼騎兵', glyph: '狼', color: '#b8743a', cost: 4, kind: 'troop', rarity: 'rare', role: '極快、跳過河直衝建築', unit: 'wolf_rider' },
  axe_dwarf: { id: 'axe_dwarf', name: '旋斧矮人', glyph: '斧', color: '#c0653a', cost: 4, kind: 'troop', rarity: 'rare', role: '旋轉巨斧，周圍範圍傷害', unit: 'axe_dwarf' },
  lancer: { id: 'lancer', name: '衝鋒騎士', glyph: '衝', color: '#d0a23a', cost: 5, kind: 'troop', rarity: 'epic', role: '助跑衝鋒，第一擊雙倍傷害', unit: 'lancer' },
  bomber: { id: 'bomber', name: '炸彈兵', glyph: '炸', color: '#7a6a5a', cost: 2, kind: 'troop', rarity: 'common', role: '投擲炸彈範圍傷害，只打地面', unit: 'bomber' },
  barbarians: { id: 'barbarians', name: '蠻族戰士', glyph: '蠻', color: '#b0763c', cost: 5, kind: 'troop', rarity: 'common', role: '五名耐打的近戰戰士', unit: 'barbarian', count: 5 },
  golem: { id: 'golem', name: '石巨像', glyph: '石', color: '#7d8a6a', cost: 8, kind: 'troop', rarity: 'epic', role: '超高血量，倒下時爆炸並分裂', unit: 'golem' },
  giant_skeleton: { id: 'giant_skeleton', name: '巨骷髏', glyph: '髏', color: '#9aa0a8', cost: 6, kind: 'troop', rarity: 'epic', role: '倒下時留下巨大炸彈', unit: 'giant_skeleton' },
  ice_spirit: { id: 'ice_spirit', name: '冰精靈', glyph: '冰', color: '#5fb8e0', cost: 1, kind: 'troop', rarity: 'common', role: '撲向敵人，範圍冰凍', unit: 'ice_spirit' },
  fire_spirit: { id: 'fire_spirit', name: '火精靈', glyph: '焰', color: '#e0693a', cost: 1, kind: 'troop', rarity: 'common', role: '撲向敵人，範圍爆炸', unit: 'fire_spirit' },
  witch: { id: 'witch', name: '死靈女巫', glyph: '巫', color: '#7a4b9c', cost: 5, kind: 'troop', rarity: 'epic', role: '範圍魔法彈，持續召喚骷髏', unit: 'witch' },
  baby_dragon: { id: 'baby_dragon', name: '幼龍', glyph: '龍', color: '#c45a8a', cost: 4, kind: 'troop', rarity: 'epic', role: '飛行範圍噴火', unit: 'baby_dragon' },
  bats: { id: 'bats', name: '蝙蝠群', glyph: '蝠', color: '#6a4b8c', cost: 2, kind: 'troop', rarity: 'common', role: '五隻飛行，脆但快', unit: 'bat', count: 5 },
  gargoyles: { id: 'gargoyles', name: '石像鬼', glyph: '鬼', color: '#5a6f8a', cost: 3, kind: 'troop', rarity: 'common', role: '三隻飛行，近距離吐擊', unit: 'gargoyle', count: 3 },
  bomb_blimp: { id: 'bomb_blimp', name: '炸彈飛艇', glyph: '艇', color: '#b84a4a', cost: 5, kind: 'troop', rarity: 'epic', role: '飛行，只轟炸建築', unit: 'bomb_blimp' },
  cannon: { id: 'cannon', name: '加農砲', glyph: '砲', color: '#6d6f78', cost: 3, kind: 'building', rarity: 'common', role: '防守建築，吸引只打建築的敵人', unit: 'cannon' },
  inferno: { id: 'inferno', name: '熔岩塔', glyph: '熔', color: '#c4502a', cost: 5, kind: 'building', rarity: 'rare', role: '光束越燒越痛，剋坦克', unit: 'inferno' },
  tombstone: { id: 'tombstone', name: '骷髏墓碑', glyph: '墓', color: '#77707a', cost: 3, kind: 'building', rarity: 'rare', role: '持續召喚骷髏，倒下再放四隻', unit: 'tombstone' },
  fireball: {
    id: 'fireball', name: '火球', glyph: '球', color: '#e0782f', cost: 4, kind: 'spell', rarity: 'rare', role: '中範圍高傷害並擊退',
    spell: { kind: 'projectile', radius: 2.5, damage: 689, towerPct: 0.3, speed: 10, hitsAir: true, pushback: 1 },
  },
  arrows: {
    id: 'arrows', name: '箭雨', glyph: '箭', color: '#b8933a', cost: 3, kind: 'spell', rarity: 'common', role: '大範圍三波箭，清小兵',
    // 每波 122、共 3 波 [R]；範圍 4 格（遊戲內說明）；波間隔 [A]
    spell: { kind: 'projectile', radius: 4, damage: 122, towerPct: 0.3, speed: 1100 / 60, hitsAir: true, waves: 3, waveInterval: 0.2 },
  },
  zap: {
    id: 'zap', name: '雷擊', glyph: '雷', color: '#3a8ed5', cost: 2, kind: 'spell', rarity: 'common', role: '立即傷害並暈眩 0.5 秒',
    spell: { kind: 'instant', radius: 2.5, damage: 192, towerPct: 0.3, speed: 0, hitsAir: true, stun: 0.5 },
  },
  rocket: {
    id: 'rocket', name: '火箭', glyph: '彈', color: '#c0392b', cost: 6, kind: 'spell', rarity: 'rare', role: '小範圍超高傷害，可收塔',
    spell: { kind: 'projectile', radius: 2, damage: 1484, towerPct: 0.25, speed: 350 / 60, hitsAir: true, pushback: 1.8 },
  },
  log: {
    id: 'log', name: '滾木', glyph: '木', color: '#9b6b3d', cost: 2, kind: 'spell', rarity: 'legendary', role: '滾過地面擊退，不打空中',
    // 滾動距離 10.1 格、寬 3.9 格、速度 200 [R]
    spell: { kind: 'roll', radius: 1.95, damage: 290, towerPct: 0.2, speed: 200 / 60, hitsAir: false, pushback: 0.7, rollRange: 10.1, rollHalfDepth: 0.6 },
  },
  poison: {
    id: 'poison', name: '毒霧', glyph: '毒', color: '#7aa83a', cost: 4, kind: 'spell', rarity: 'epic', role: '8 秒持續傷害並緩速',
    spell: { kind: 'area', radius: 3.5, damage: 91, towerPct: 0.3, speed: 0, hitsAir: true, duration: 8, tick: 1, slow: 0.15 },
  },
  goblin_barrel: {
    id: 'goblin_barrel', name: '哥布林飛桶', glyph: '桶', color: '#8a6a3a', cost: 3, kind: 'spell', rarity: 'epic', role: '把三隻哥布林丟到任何地方',
    spell: { kind: 'barrel', radius: 1.5, damage: 0, towerPct: 1, speed: 400 / 60, hitsAir: false, spawn: { unit: 'goblin', count: 3, deployTime: 1.1 } },
  },
};

export const CARD_IDS = Object.keys(CARDS);

export const DEFAULT_PLAYER_DECK = ['giant', 'musketeer', 'knight', 'archers', 'fireball', 'zap', 'goblins', 'inferno'];

/** 電腦牌組：各有明確的推進核心與對空、法術。 */
export const AI_DECKS: { name: string; cards: string[] }[] = [
  { name: '巨人推進', cards: ['giant', 'wizard', 'musketeer', 'goblins', 'arrows', 'zap', 'knight', 'tombstone'] },
  { name: '狼騎快攻', cards: ['wolf_rider', 'musketeer', 'ice_spirit', 'skeletons', 'cannon', 'fireball', 'log', 'knight'] },
  { name: '石像重推', cards: ['golem', 'baby_dragon', 'gargoyles', 'iron_swordsman', 'zap', 'poison', 'ice_spirit', 'knight'] },
  { name: '誘餌消耗', cards: ['goblin_barrel', 'skeleton_army', 'spear_goblins', 'inferno', 'rocket', 'log', 'knight', 'fire_spirit'] },
  { name: '空中轟炸', cards: ['bomb_blimp', 'bats', 'gargoyles', 'axe_dwarf', 'arrows', 'fireball', 'tombstone', 'ice_spirit'] },
  { name: '騎士衝鋒', cards: ['lancer', 'giant_skeleton', 'witch', 'bomber', 'archers', 'zap', 'fire_spirit', 'iron_swordsman'] },
];

export function isValidDeck(deck: readonly string[]): boolean {
  return deck.length === 8 && new Set(deck).size === 8 && deck.every((id) => id in CARDS);
}

export function unitOf(card: CardDef): UnitDef | undefined {
  return card.unit ? UNITS[card.unit] : undefined;
}

export function canHitAir(card: CardDef): boolean {
  if (card.kind === 'spell') return card.spell!.hitsAir;
  const u = unitOf(card)!.stats;
  return u.targets === 'air-ground';
}
