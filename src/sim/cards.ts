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
  | 'arrow' | 'bullet' | 'fireball' | 'spear' | 'bomb' | 'spit' | 'cannonball' | 'magic' | 'ice' | 'fire' | 'tower-arrow' | 'king-ball' | 'flame-arrow' | 'volt' | 'axe';

export interface ProjectileSpec {
  speed: number; // 格／秒
  visual: ProjectileVisual;
  splash?: number; // 落點範圍半徑
  freeze?: number; // 命中冰凍秒數
  slow?: { mul: number; time: number }; // 命中後移動與攻擊變慢（寒霜術士）
  arc?: number; // 拋物線高度（格，只影響畫面）
  boomerang?: { reach: number; radius: number }; // 回旋斧：至少飛 reach 格再飛回手上，去程、回程各打一次沿路的敵人
}

/** 部署落地時的範圍效果（風暴術士的雷擊、寒霜術士的寒氣、巨錘騎士砸地）。 */
export interface DeployHit {
  damage: number;
  radius: number;
  stun?: number;
  slow?: { mul: number; time: number };
  pushback?: number;
  towerMul: number;
  visual: 'zap' | 'frost' | 'slam';
}

export interface UnitStats {
  hp: number;
  damage: number;
  hitSpeed: number; // 攻擊間隔（秒）
  loadTime: number; // 鎖定目標後到第一下命中的準備時間（秒）
  range: number; // 攻擊距離（邊緣到邊緣，格）
  minRange?: number; // 最小射程：比這更近的目標打不到（迫擊砲）
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
  towerMul?: number; // 對公主塔／國王塔的傷害倍率（地道挖掘者 25%）
  tunnelSpeed?: number; // 可部署到場上任何地方：從己方國王塔由地底鑽過去的速度（格／秒）
  elixirGen?: { amount: number; interval: number; onDeath: number }; // 能量收集器
  multiTarget?: number; // 一次攻擊同時打幾個目標（只有一個目標時全部打在它身上）
  stunOnHit?: number; // 每次命中讓目標暈眩的秒數（會打斷蓄力與熔岩光束）
  deployHit?: DeployHit;
  chargeUp?: boolean; // 雷能砲車：出場先蓄力 loadTime 秒，蓄滿後保持到看見目標立刻開砲；被暈眩要重新蓄力
  recoil?: number; // 開砲後自己往後退的距離（格）
  leap?: { min: number; max: number; damage: number; radius: number; time: number; pushback: number; cooldown: number }; // 巨錘騎士：跳向這個距離內的目標，落地範圍傷害
}

export interface UnitDef {
  id: string;
  name: string;
  stats: UnitStats;
}

export type SpellKind = 'projectile' | 'instant' | 'area' | 'roll' | 'barrel' | 'lightning';

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
  freeze?: boolean; // stun 以冰凍呈現（冰凍法術）
  rage?: { mul: number; linger: number }; // 狂暴：範圍內己方移動、攻擊與召喚加速，離開範圍後效果再維持 linger 秒
  bolts?: number; // 落雷：依序劈中範圍內血量最高的幾個目標（每個目標只劈一次，間隔 waveInterval）
  pull?: number; // 龍捲風：範圍內敵方部隊被拉向中心的速度（格／秒）
  graveyard?: { unit: string; interval: number; delay: number; count: number }; // 墓地：持續在範圍內隨機冒出部隊
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
  elixir_collector: {
    id: 'elixir_collector', name: '能量收集器',
    // 每 9 秒 1 點、存在 65 秒、倒下再給 1 點、碰撞半徑 1 格 [R]
    stats: ground({
      hp: 1070, damage: 0, hitSpeed: 10, loadTime: 0, range: 0, sight: 0, speed: 0, radius: 1, mass: 100, lifetime: 65, half: 1,
      elixirGen: { amount: 1, interval: 9, onDeath: 1 },
    }),
  },
  tunneler: {
    id: 'tunneler', name: '地道挖掘者',
    // 地底移動速度 650（約每秒 10.8 格）、對塔 25% [R]
    stats: ground({ hp: 1210, damage: 193, hitSpeed: 1.2, loadTime: 0.7, range: 1.2, sight: 5.5, speed: 1.5, mass: 6, towerMul: 0.25, tunnelSpeed: 650 / 60 }),
  },
  // ── v3 第二批（數值同一份快照，見上層 reference/analysis/cr-stats-l11.json）
  mega_gargoyle: {
    id: 'mega_gargoyle', name: '重甲石像鬼',
    stats: air({ hp: 837, damage: 311, hitSpeed: 1.5, loadTime: 1.1, range: 1.6, speed: 1, flyHeight: 1.5, radius: 0.6, mass: 6, projectile: { speed: 1000 / 60, visual: 'spit' } }),
  },
  siege_ram: {
    id: 'siege_ram', name: '攻城衝車',
    // 撞到建築就解體（自爆式），衝刺時傷害加倍；倒下或撞完都放出 2 名蠻族戰士 [R]；衝刺距離與衝鋒騎士相同以 3 格近似 [A]
    stats: ground({
      hp: 966, damage: 286, hitSpeed: 0.4, loadTime: 0.05, range: 0.5, speed: 1, radius: 0.75, mass: 6, targets: 'buildings', kamikaze: true,
      charge: { distance: 3, speedMul: 2, damage: 571 }, deathSpawn: { unit: 'barbarian', count: 2 },
    }),
  },
  siege_giant: {
    id: 'siege_giant', name: '攻城巨人',
    stats: ground({
      hp: 3072, damage: 307, hitSpeed: 1.7, loadTime: 0.8, range: 5, speed: 0.75, sight: 7.5, radius: 0.75, mass: 18, targets: 'buildings', ignorePushback: true,
      projectile: { speed: 1000 / 60, visual: 'cannonball', arc: 0.4 },
    }),
  },
  berserker: { id: 'berserker', name: '雙斧狂戰士', stats: ground({ hp: 1341, damage: 384, hitSpeed: 1.4, loadTime: 0.9, range: 1.2, speed: 1.5, sight: 6, mass: 4 }) },
  blowgun_goblin: {
    id: 'blowgun_goblin', name: '吹管哥布林',
    stats: ground({ hp: 260, damage: 131, hitSpeed: 0.7, loadTime: 0.35, range: 6.5, speed: 2, sight: 7.5, mass: 3, targets: 'air-ground', projectile: { speed: 800 / 60, visual: 'arrow' } }),
  },
  spirit_hut: {
    id: 'spirit_hut', name: '火靈小屋',
    // 每 5 秒放出 1 隻火精靈、存在 28 秒、倒下再放 1 隻 [R]
    stats: ground({
      hp: 848, damage: 0, hitSpeed: 10, loadTime: 0, range: 0, sight: 0, speed: 0, radius: 1, mass: 100, lifetime: 28, half: 1,
      spawner: { unit: 'fire_spirit', count: 1, start: 0, pause: 5, interval: 0 },
      deathSpawn: { unit: 'fire_spirit', count: 1 },
    }),
  },
  bomb_turret: {
    id: 'bomb_turret', name: '炸彈砲塔',
    // 只打地面、範圍 1.5；倒下留下 3 秒後爆炸的炸彈（死亡炸彈傷害以稀有度倍率換算）[R＋A]；2×2 佔地 [A]
    stats: ground({
      hp: 1356, damage: 222, hitSpeed: 1.6, loadTime: 1.1, range: 6, sight: 6, speed: 0, radius: 0.6, mass: 100, lifetime: 30, half: 1,
      projectile: { speed: 500 / 60, visual: 'bomb', splash: 1.5, arc: 2 },
      deathDamage: { damage: 222, radius: 3, pushback: 0, delay: 3, towerMul: 1, visual: 'bomb' },
    }),
  },
  // ── v3 第三批
  lava_hound: {
    id: 'lava_hound', name: '熔岩飛獸',
    // 只打建築的飛行單位，倒下分裂成 6 隻小熔岩獸 [R]
    stats: air({
      hp: 3811, damage: 54, hitSpeed: 1.3, loadTime: 0.3, range: 3.5, speed: 0.75, flyHeight: 3.5, radius: 0.75, mass: 5, targets: 'buildings',
      projectile: { speed: 400 / 60, visual: 'fire' }, deathSpawn: { unit: 'lava_pup', count: 6 },
    }),
  },
  lava_pup: {
    id: 'lava_pup', name: '小熔岩獸',
    stats: air({ hp: 216, damage: 90, hitSpeed: 1.7, loadTime: 0.7, range: 1.6, speed: 1, flyHeight: 3, radius: 0.45, mass: 5, projectile: { speed: 500 / 60, visual: 'fire' } }),
  },
  mortar: {
    id: 'mortar', name: '迫擊砲',
    // 射程 11.5、最小射程 3.5、部署 3.5 秒、首發 4 秒、每 5 秒一發、範圍 2、只打地面 [R]；2×2 佔地 [A]
    stats: ground({
      hp: 1369, damage: 266, hitSpeed: 5, loadTime: 4, range: 11.5, minRange: 3.5, sight: 11.5, speed: 0, radius: 0.6, mass: 100, deployTime: 3.5, lifetime: 30, half: 1,
      projectile: { speed: 300 / 60, visual: 'bomb', splash: 2, arc: 4 },
    }),
  },
  tombstone: {
    id: 'tombstone', name: '骷髏墓碑',
    stats: ground({
      hp: 530, damage: 0, hitSpeed: 10, loadTime: 0, range: 0, sight: 0, speed: 0, radius: 1, mass: 100, lifetime: 30, half: 1,
      spawner: { unit: 'skeleton', count: 2, start: 0, pause: 3.5, interval: 0.5 },
      deathSpawn: { unit: 'skeleton', count: 4 },
    }),
  },
  // v3 第四批（數值見 EVIDENCE.md §4；標 [A] 者為推定）
  heavy_warrior: {
    id: 'heavy_warrior', name: '重裝武士',
    // 資料集 Pekka 的 11 級值 [R]
    stats: ground({ hp: 3760, damage: 816, hitSpeed: 1.8, loadTime: 1.3, range: 1.2, speed: 0.75, sight: 5, radius: 0.75, mass: 18, ignorePushback: true }),
  },
  ranger: {
    id: 'ranger', name: '長弓遊俠',
    // 資料集 Princess：射程 9、每 3 秒一輪火箭、落點範圍 2 [R]
    stats: ground({
      hp: 261, damage: 169, hitSpeed: 3, loadTime: 2.5, range: 9, sight: 9.5, speed: 1, mass: 3, targets: 'air-ground',
      projectile: { speed: 10, visual: 'flame-arrow', splash: 2, arc: 2.6 },
    }),
  },
  inferno_drake: {
    id: 'inferno_drake', name: '灼焰飛龍',
    // 資料集 InfernoDragon：第 1 段 11 級值，第 2、3 段以稀有度倍率換算 [R＋A]
    stats: air({ hp: 1294, damage: 36, hitSpeed: 0.4, loadTime: 1.2, range: 3.5, speed: 1, flyHeight: 3.5, mass: 5, ramp: { damages: [36, 121, 423], stageTime: 2 } }),
  },
  frost_mage: {
    id: 'frost_mage', name: '寒霜術士',
    // 資料集 IceWizard：冰彈範圍 1、命中後慢 35% 2.5 秒；出場寒氣 83 傷害、半徑 3、慢 1 秒、不傷塔 [R]
    stats: ground({
      hp: 688, damage: 90, hitSpeed: 1.7, loadTime: 1.2, range: 5.5, speed: 1, mass: 5, targets: 'air-ground',
      projectile: { speed: 700 / 60, visual: 'ice', splash: 1, slow: { mul: 0.65, time: 2.5 }, arc: 0.6 },
      deployHit: { damage: 83, radius: 3, slow: { mul: 0.65, time: 1 }, towerMul: 0, visual: 'frost' },
    }),
  },
  storm_mage: {
    id: 'storm_mage', name: '風暴術士',
    // 資料集 ElectroWizard：同時打 2 個目標、每下暈眩 0.5 秒；出場雷擊 192、半徑 2.5、不傷塔 [R]；只有一個目標時兩道都打它 [A]
    stats: ground({
      hp: 713, damage: 110, hitSpeed: 1.8, loadTime: 1.2, range: 5, speed: 1.5, mass: 5, targets: 'air-ground', multiTarget: 2, stunOnHit: 0.5,
      deployHit: { damage: 192, radius: 2.5, stun: 0.5, towerMul: 0, visual: 'zap' },
    }),
  },
  volt_cart: {
    id: 'volt_cart', name: '雷能砲車',
    // 資料集 ZapMachine：蓄力 3 秒、每 4 秒一砲、範圍 1.8、只打地面、開砲後退 0.75 格 [R]
    stats: ground({
      hp: 1452, damage: 1331, hitSpeed: 4, loadTime: 3, range: 5, sight: 5, speed: 0.75, radius: 1, mass: 18, ignorePushback: true, chargeUp: true, recoil: 0.75,
      projectile: { speed: 1400 / 60, visual: 'volt', splash: 1.8 },
    }),
  },
  hammer_knight: {
    id: 'hammer_knight', name: '巨錘騎士',
    // 資料集 MegaKnight：近戰範圍 1.3；出場砸地 429、半徑 2.2；跳向 3.5～5 格的目標，落地 536（以稀有度倍率換算）[R＋A]；不跳向公主塔與國王塔 [A]
    stats: ground({
      hp: 3993, damage: 268, hitSpeed: 1.7, loadTime: 1.2, range: 1.2, speed: 1, radius: 0.75, mass: 18, ignorePushback: true, splash: 1.3,
      deployHit: { damage: 429, radius: 2.2, pushback: 1, towerMul: 1, visual: 'slam' },
      leap: { min: 3.5, max: 5, damage: 536, radius: 2.2, time: 0.8, pushback: 1, cooldown: 0.9 },
    }),
  },
  axe_thrower: {
    id: 'axe_thrower', name: '回旋斧手',
    // 資料集 AxeMan：斧頭至少飛 4.5 格、半徑 1、去回各打一次、可打空中 [R]；攻擊間隔以出手 0.9 秒＋回收 1.5 秒計 [A]
    stats: ground({
      hp: 1280, damage: 169, hitSpeed: 2.4, loadTime: 0.9, range: 4.5, speed: 1, radius: 0.6, mass: 4, targets: 'air-ground',
      projectile: { speed: 550 / 60, visual: 'axe', boomerang: { reach: 4.5, radius: 1 } },
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
  elixir_collector: { id: 'elixir_collector', name: '能量收集器', glyph: '集', color: '#c85ad0', cost: 6, kind: 'building', rarity: 'rare', role: '每 9 秒產生 1 點能量，倒下時再給 1 點', unit: 'elixir_collector' },
  tunneler: { id: 'tunneler', name: '地道挖掘者', glyph: '掘', color: '#a0743a', cost: 3, kind: 'troop', rarity: 'legendary', role: '從地底鑽到場上任何地方，對塔傷害較低', unit: 'tunneler' },
  mega_gargoyle: { id: 'mega_gargoyle', name: '重甲石像鬼', glyph: '甲', color: '#4a5a7a', cost: 3, kind: 'troop', rarity: 'rare', role: '耐打的飛行遠程，單發傷害高', unit: 'mega_gargoyle' },
  gargoyle_horde: { id: 'gargoyle_horde', name: '石像鬼群', glyph: '群', color: '#5a6f8a', cost: 5, kind: 'troop', rarity: 'common', role: '六隻飛行，用數量壓過去', unit: 'gargoyle', count: 6 },
  siege_ram: { id: 'siege_ram', name: '攻城衝車', glyph: '槌', color: '#8a5a32', cost: 4, kind: 'troop', rarity: 'rare', role: '衝向建築撞一下，撞完放出兩名蠻族戰士', unit: 'siege_ram' },
  siege_giant: { id: 'siege_giant', name: '攻城巨人', glyph: '砲', color: '#6a7fa0', cost: 6, kind: 'troop', rarity: 'common', role: '扛大砲的巨人，在 5 格外轟擊建築', unit: 'siege_giant' },
  berserkers: { id: 'berserkers', name: '雙斧狂戰士', glyph: '狂', color: '#c4532a', cost: 6, kind: 'troop', rarity: 'common', role: '兩名跑得快、出手重的近戰', unit: 'berserker', count: 2 },
  blowgun_goblin: { id: 'blowgun_goblin', name: '吹管哥布林', glyph: '吹', color: '#4f8a3a', cost: 3, kind: 'troop', rarity: 'rare', role: '射程極遠的快速射手，可打空中', unit: 'blowgun_goblin' },
  spirit_hut: { id: 'spirit_hut', name: '火靈小屋', glyph: '屋', color: '#c8572a', cost: 4, kind: 'building', rarity: 'rare', role: '每 5 秒放出一隻火精靈', unit: 'spirit_hut' },
  bomb_turret: { id: 'bomb_turret', name: '炸彈砲塔', glyph: '彈', color: '#7a6a5a', cost: 4, kind: 'building', rarity: 'rare', role: '範圍轟炸地面部隊，倒下時留下炸彈', unit: 'bomb_turret' },
  lava_hound: { id: 'lava_hound', name: '熔岩飛獸', glyph: '熔', color: '#c8502a', cost: 7, kind: 'troop', rarity: 'legendary', role: '只打建築的飛行巨獸，倒下分裂成 6 隻小熔岩獸', unit: 'lava_hound' },
  mortar: { id: 'mortar', name: '迫擊砲', glyph: '迫', color: '#7a7060', cost: 4, kind: 'building', rarity: 'common', role: '射程極遠的範圍砲擊，太近的敵人打不到', unit: 'mortar' },
  heavy_warrior: { id: 'heavy_warrior', name: '重裝武士', glyph: '武', color: '#5a5f8a', cost: 7, kind: 'troop', rarity: 'epic', role: '血厚、單下傷害極高的重裝近戰，專剋坦克', unit: 'heavy_warrior' },
  ranger: { id: 'ranger', name: '長弓遊俠', glyph: '遊', color: '#4f9a7a', cost: 3, kind: 'troop', rarity: 'legendary', role: '射程 9 格的範圍火箭，可打空中，血很少', unit: 'ranger' },
  inferno_drake: { id: 'inferno_drake', name: '灼焰飛龍', glyph: '灼', color: '#c4402a', cost: 4, kind: 'troop', rarity: 'legendary', role: '飛行熔岩光束，越燒越痛，剋坦克', unit: 'inferno_drake' },
  frost_mage: { id: 'frost_mage', name: '寒霜術士', glyph: '霜', color: '#5aa8d8', cost: 3, kind: 'troop', rarity: 'legendary', role: '範圍冰彈讓敵人變慢，出場放一圈寒氣', unit: 'frost_mage' },
  storm_mage: { id: 'storm_mage', name: '風暴術士', glyph: '暴', color: '#4a6ad8', cost: 4, kind: 'troop', rarity: 'legendary', role: '同時電擊兩個目標並打斷動作，出場放雷擊', unit: 'storm_mage' },
  volt_cart: { id: 'volt_cart', name: '雷能砲車', glyph: '砲', color: '#d8a42a', cost: 6, kind: 'troop', rarity: 'legendary', role: '蓄力後轟出超強範圍電砲，被暈眩就要重新蓄力', unit: 'volt_cart' },
  hammer_knight: { id: 'hammer_knight', name: '巨錘騎士', glyph: '錘', color: '#6a5a8a', cost: 7, kind: 'troop', rarity: 'legendary', role: '出場砸地造成範圍傷害，會跳向稍遠的敵人', unit: 'hammer_knight' },
  axe_thrower: { id: 'axe_thrower', name: '回旋斧手', glyph: '斧', color: '#8a5a3a', cost: 5, kind: 'troop', rarity: 'epic', role: '擲出回旋斧，來回各打一次沿路所有敵人', unit: 'axe_thrower' },
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
  freeze: {
    id: 'freeze', name: '冰凍', glyph: '凍', color: '#7fd3ff', cost: 4, kind: 'spell', rarity: 'epic', role: '範圍內的敵人全部凍住 4 秒',
    // 半徑 3 格、冰凍 4 秒、對塔 30% [R]
    spell: { kind: 'instant', radius: 3, damage: 115, towerPct: 0.3, speed: 0, hitsAir: true, stun: 4, freeze: true },
  },
  rage: {
    id: 'rage', name: '狂暴', glyph: '怒', color: '#d0485a', cost: 2, kind: 'spell', rarity: 'epic', role: '範圍內己方移動與攻擊加快 35%',
    // 半徑 3 格、持續 6 秒、每 0.3 秒刷新、離開後維持 2 秒、+35% [R]
    spell: { kind: 'area', radius: 3, damage: 0, towerPct: 0, speed: 0, hitsAir: true, duration: 6, tick: 0.3, rage: { mul: 1.35, linger: 2 } },
  },
  lightning: {
    id: 'lightning', name: '落雷', glyph: '霹', color: '#6a5ad5', cost: 6, kind: 'spell', rarity: 'epic', role: '依序劈中範圍內血量最高的三個目標，並短暫暈眩',
    // 每道 1056、半徑 3.5、最多 3 個目標、間隔 0.46 秒、暈眩 0.5 秒、對塔 30% [R]
    spell: { kind: 'lightning', radius: 3.5, damage: 1056, towerPct: 0.3, speed: 0, hitsAir: true, stun: 0.5, bolts: 3, waveInterval: 0.46 },
  },
  tornado: {
    id: 'tornado', name: '龍捲風', glyph: '旋', color: '#8ab0c8', cost: 3, kind: 'spell', rarity: 'epic', role: '把範圍內的敵方部隊捲向中心，並造成少量傷害',
    // 半徑 5.5、持續 1.05 秒、每 0.5 秒 85、對塔 17% [R]；拉力每秒 3.6 格 [A]（資料集 attract_percentage 360，單位不明）
    spell: { kind: 'area', radius: 5.5, damage: 85, towerPct: 0.17, speed: 0, hitsAir: true, duration: 1.05, tick: 0.5, pull: 3.6 },
  },
  graveyard: {
    id: 'graveyard', name: '亡靈墓地', glyph: '墳', color: '#5a4a6a', cost: 5, kind: 'spell', rarity: 'legendary', role: '9 秒內在範圍裡陸續冒出骷髏兵',
    // 半徑 4、持續 9.5 秒、2.2 秒後開始每 0.5 秒一隻骷髏（共 15 隻）[R]
    spell: { kind: 'area', radius: 4, damage: 0, towerPct: 0, speed: 0, hitsAir: false, duration: 9.5, graveyard: { unit: 'skeleton', interval: 0.5, delay: 2.2, count: 15 } },
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
  { name: '巨人推進', cards: ['giant', 'wizard', 'archers', 'goblins', 'arrows', 'zap', 'knight', 'tombstone'] },
  { name: '狼騎快攻', cards: ['wolf_rider', 'archers', 'ice_spirit', 'skeletons', 'cannon', 'zap', 'log', 'knight'] },
  { name: '石像重推', cards: ['golem', 'baby_dragon', 'gargoyles', 'iron_swordsman', 'zap', 'poison', 'knight', 'elixir_collector'] },
  { name: '誘餌消耗', cards: ['goblin_barrel', 'tunneler', 'skeleton_army', 'inferno', 'fireball', 'log', 'knight', 'musketeer'] },
  { name: '空中轟炸', cards: ['bomb_blimp', 'giant', 'bats', 'musketeer', 'axe_dwarf', 'arrows', 'freeze', 'ice_spirit'] },
  { name: '騎士衝鋒', cards: ['lancer', 'berserkers', 'witch', 'bomber', 'archers', 'zap', 'rage', 'iron_swordsman'] },
  { name: '地道控場', cards: ['tunneler', 'musketeer', 'skeletons', 'bomber', 'tombstone', 'log', 'fireball', 'knight'] },
  { name: '衝車連攻', cards: ['siege_ram', 'blowgun_goblin', 'mega_gargoyle', 'bomb_turret', 'zap', 'fireball', 'skeletons', 'knight'] },
  { name: '攻城砲擊', cards: ['siege_giant', 'spirit_hut', 'gargoyle_horde', 'lightning', 'log', 'bomber', 'ice_spirit', 'archers'] },
  { name: '熔岩空襲', cards: ['lava_hound', 'mega_gargoyle', 'bats', 'musketeer', 'fireball', 'zap', 'skeletons', 'tombstone'] },
  { name: '墓地迫擊', cards: ['graveyard', 'mortar', 'tornado', 'poison', 'knight', 'blowgun_goblin', 'archers', 'bomb_turret'] },
  { name: '重裝橋頭', cards: ['heavy_warrior', 'siege_ram', 'storm_mage', 'blowgun_goblin', 'poison', 'zap', 'spear_goblins', 'mega_gargoyle'] },
  { name: '巨錘地道', cards: ['hammer_knight', 'tunneler', 'inferno_drake', 'bats', 'skeleton_army', 'frost_mage', 'fireball', 'zap'] },
  { name: '巨人砲車', cards: ['giant', 'volt_cart', 'ranger', 'axe_thrower', 'goblins', 'tombstone', 'arrows', 'zap'] },
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
