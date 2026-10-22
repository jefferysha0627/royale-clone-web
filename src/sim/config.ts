// 所有對戰規則與平衡參數集中於此。
// 數值為「實作選擇／近似值」，不是從原作取得的精確數據（見上層 EVIDENCE.md）。

export const DT = 1 / 30; // 固定模擬步長（秒）

export const ARENA = {
  width: 18,
  height: 32,
  riverTop: 15, // 河道 y 範圍 [riverTop, riverBottom]
  riverBottom: 17,
  bridgeXs: [3.5, 14.5] as const,
  bridgeHalfWidth: 1.2,
};

export const MATCH = {
  regularTime: 180, // 一般時間（秒）
  doubleElixirAt: 60, // 一般時間剩 60 秒進入雙倍能量
  overtime: 60, // 延長賽，期間先拿到皇冠者勝
  startElixir: 5,
  maxElixir: 10,
  elixirPerSecond: 1 / 2.8,
  overtimeElixirMultiplier: 2,
  doubleElixirMultiplier: 2,
  deployTime: 1, // 部署後無法行動的秒數
  handSize: 4,
  deckSize: 8,
};

export interface TowerStats {
  hp: number;
  damage: number;
  hitSpeed: number;
  range: number;
  radius: number;
  projectileSpeed: number;
}

// 射程皆以「邊緣到邊緣」計算。
export const TOWERS: { princess: TowerStats; king: TowerStats } = {
  princess: { hp: 3000, damage: 90, hitSpeed: 0.8, range: 6.5, radius: 1.5, projectileSpeed: 14 },
  king: { hp: 4800, damage: 110, hitSpeed: 1.0, range: 5.5, radius: 2, projectileSpeed: 14 },
};

// 隊伍 0（玩家）在下方，隊伍 1（電腦）在上方，座標以 y = height - y 鏡射。
export const TOWER_LAYOUT = [
  { type: 'princess' as const, lane: 0, x: 3.5, y: 25.5 },
  { type: 'princess' as const, lane: 1, x: 14.5, y: 25.5 },
  { type: 'king' as const, lane: -1, x: 9, y: 29 },
];

/** 部署區：己方半場；對方側塔倒下後，可往該路推進到此 y（以隊伍 0 視角）。 */
export const DEPLOY = {
  ownMinY: 17.5,
  pocketMinY: 11.5,
  edgeMargin: 0.5,
  towerClearance: 0.4,
};

/** 法術從己方國王塔飛行的速度（格／秒），用來計算落地延遲。 */
export const SPELL_TRAVEL_SPEED = 12;

/** 單位互相推擠的強度（每步修正比例）。 */
export const SEPARATION_STRENGTH = 0.5;
