// 所有對戰規則與場地參數集中於此。
// 來源（細節與日期見上層 EVIDENCE.md）：
//   [W] 社群維基 clashroyale.fandom.com（Basics of Battle、Elixir、King's Tower、Princess Towers、Arenas，2026-10-22 讀取）
//   [R] RoyaleAPI cr-api-data（最後資料提交 2023-10-18）
//   [A] 查不到公開數字的近似值（本作自訂）
// 等級假設：雙方卡牌與塔皆為 11 級（錦標賽標準）。

export const DT = 1 / 30; // 固定模擬步長（秒）

/** 場地：18 格寬、32 格長 [W]。y 由上（電腦方）往下（玩家方）增加。 */
export const ARENA = {
  width: 18,
  height: 32,
  // 河道佔第 15、16 列 [W：兩邊各 15 列可部署區]
  riverTop: 15,
  riverBottom: 17,
  // 橋 3 格寬，與側塔對齊 [W：Arena 7、10–23 的橋寬 3 格]
  bridgeXs: [3.5, 14.5] as const,
  bridgeHalfWidth: 1.5,
};

export const MATCH = {
  regularTime: 180, // 一般時間 3 分鐘 [W]
  doubleElixirAt: 60, // 剩 60 秒（開打 2 分鐘後）能量加倍 [W]
  overtime: 120, // 延長賽 2 分鐘、驟死 [W]
  tripleElixirAt: 60, // 延長賽最後 1 分鐘三倍能量 [W]
  startElixir: 5, // [W]
  maxElixir: 10, // [W]
  elixirPerSecond: 1 / 2.8, // 每 2.8 秒 1 點 [W]
  handSize: 4,
  deckSize: 8,
  // 新卡進入「下一張」後要冷卻 2 秒才能補進手牌，能量加倍時 1 秒 [W]
  cardCycleDelay: 2,
  // 延長賽結束仍平手：所有部隊消失，塔同步快速扣血，最低血量的塔先倒 [W]；扣到倒塔所需秒數為本作設定 [A]
  tiebreakDrainTime: 2.5,
};

export interface TowerStats {
  hp: number;
  damage: number;
  hitSpeed: number;
  loadTime: number;
  range: number;
  radius: number; // 碰撞半徑（射程以邊緣到邊緣計算）
  footprint: number; // 方形佔地的半邊長（擋路與禁止部署）
  projectileSpeed: number;
}

// 11 級塔 [W]：側塔 3052 血、109 傷害、0.8 秒、射程 7.5；國王塔 4824 血、109 傷害、1 秒、射程 7。
// 碰撞半徑 1.0／1.4、投射物速度 600／1000（每 60 = 1 格／秒）[R]；側塔 3×3、國王塔 4×4 [W]。
export const TOWERS: { princess: TowerStats; king: TowerStats } = {
  princess: { hp: 3052, damage: 109, hitSpeed: 0.8, loadTime: 0.3, range: 7.5, radius: 1.0, footprint: 1.5, projectileSpeed: 10 },
  king: { hp: 4824, damage: 109, hitSpeed: 1.0, loadTime: 0.7, range: 7, radius: 1.4, footprint: 2, projectileSpeed: 1000 / 60 },
};

/** 國王塔被喚醒後，3.3 秒轉向目標、再 0.7 秒射出第一發 [W]。 */
export const KING_ACTIVATION_TIME = 3.3;

// 隊伍 0（玩家）在下方，隊伍 1（電腦）在上方，以 y = height - y 鏡射。
// 國王塔 4×4、距後方 1 格置中 [W]；側塔與橋對齊 [W 截圖觀察＋A]。
export const TOWER_LAYOUT = [
  { type: 'princess' as const, lane: 0, x: 3.5, y: 25.5 },
  { type: 'princess' as const, lane: 1, x: 14.5, y: 25.5 },
  { type: 'king' as const, lane: -1, x: 9, y: 29 },
];

/** 部署區（以隊伍 0 視角）。 */
export const DEPLOY = {
  ownMinY: 17, // 己方 15 列 [W]
  // 推倒對方側塔後，該路前進區（「pocket」）延伸到這一列 [A：維基只描述「橋後一小塊長方形」]
  pocketMinY: 10,
};

/** 法術從己方國王塔發射 [W]，飛行速度由各法術決定。 */
export const SPELL_ORIGIN = 'king';

/** 單位互相推擠的強度（每步修正比例）[A]。 */
export const SEPARATION_STRENGTH = 0.5;

/** 擊退位移在多少秒內完成 [A]。 */
export const KNOCKBACK_TIME = 0.2;
