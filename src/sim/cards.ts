// 卡牌與單位資料。名稱、外觀與數值皆為本作自訂（近似原作的角色分工，非原作數值）。

export type TargetKind = 'ground' | 'air-ground' | 'buildings';

export interface UnitStats {
  hp: number;
  damage: number;
  hitSpeed: number; // 攻擊間隔（秒）
  firstHit: number; // 進入射程後第一下的準備時間（秒）
  range: number; // 攻擊距離（邊緣到邊緣，格）
  sight: number; // 索敵距離（格）
  speed: number; // 移動速度（格／秒），建築為 0
  radius: number;
  mass: number;
  flying: boolean;
  targets: TargetKind;
  splash?: number; // 範圍傷害半徑
  projectileSpeed?: number; // 有值代表遠程投射物
}

export interface SpellStats {
  radius: number;
  damage: number;
  towerDamagePct: number; // 對防禦塔的傷害比例
  stun?: number;
  travelSpeed?: number; // 未設定則使用預設飛行速度；0 代表立即生效
}

export type CardKind = 'troop' | 'spell' | 'building';

export interface CardDef {
  id: string;
  name: string;
  glyph: string; // 單字圖示
  color: string; // 卡面底色
  cost: number;
  kind: CardKind;
  role: string; // 卡組編輯畫面上的一句話說明
  count?: number;
  unit?: UnitStats;
  spell?: SpellStats;
  lifetime?: number; // 建築存在秒數
}

const melee = 0.9;

export const CARDS: Record<string, CardDef> = {
  swordsman: {
    id: 'swordsman', name: '劍士', glyph: '劍', color: '#5b7bd5', cost: 3, kind: 'troop',
    role: '耐打近戰，攻地面',
    unit: { hp: 1650, damage: 175, hitSpeed: 1.2, firstHit: 0.5, range: melee, sight: 5.5, speed: 1.0, radius: 0.5, mass: 3, flying: false, targets: 'ground' },
  },
  archers: {
    id: 'archers', name: '弓手', glyph: '弓', color: '#3f9c6b', cost: 3, kind: 'troop', count: 2,
    role: '兩名遠程，可打空中',
    unit: { hp: 320, damage: 105, hitSpeed: 0.9, firstHit: 0.4, range: 5, sight: 5.5, speed: 1.0, radius: 0.4, mass: 1, flying: false, targets: 'air-ground', projectileSpeed: 11 },
  },
  musketeer: {
    id: 'musketeer', name: '槍手', glyph: '槍', color: '#8a5bd5', cost: 4, kind: 'troop',
    role: '長射程單體，可打空中',
    unit: { hp: 740, damage: 210, hitSpeed: 1.0, firstHit: 0.4, range: 6, sight: 6, speed: 1.0, radius: 0.45, mass: 2, flying: false, targets: 'air-ground', projectileSpeed: 14 },
  },
  golem: {
    id: 'golem', name: '石巨像', glyph: '巨', color: '#8d7a63', cost: 5, kind: 'troop',
    role: '超高血量，只打建築',
    unit: { hp: 3800, damage: 230, hitSpeed: 1.5, firstHit: 0.6, range: melee, sight: 7, speed: 0.75, radius: 0.75, mass: 8, flying: false, targets: 'buildings' },
  },
  raider: {
    id: 'raider', name: '突擊騎兵', glyph: '騎', color: '#c7843a', cost: 4, kind: 'troop',
    role: '高速衝塔，只打建築',
    unit: { hp: 1650, damage: 290, hitSpeed: 1.6, firstHit: 0.5, range: melee, sight: 7, speed: 2.0, radius: 0.55, mass: 4, flying: false, targets: 'buildings' },
  },
  imps: {
    id: 'imps', name: '小鬼群', glyph: '鬼', color: '#4fa33a', cost: 2, kind: 'troop', count: 3,
    role: '三隻快速近戰，怕範圍',
    unit: { hp: 210, damage: 110, hitSpeed: 1.1, firstHit: 0.3, range: 0.6, sight: 5.5, speed: 2.0, radius: 0.35, mass: 1, flying: false, targets: 'ground' },
  },
  firemage: {
    id: 'firemage', name: '火法師', glyph: '火', color: '#d5553f', cost: 4, kind: 'troop',
    role: '遠程範圍傷害',
    unit: { hp: 720, damage: 250, hitSpeed: 1.5, firstHit: 0.5, range: 5, sight: 5.5, speed: 1.0, radius: 0.45, mass: 2, flying: false, targets: 'air-ground', splash: 1.5, projectileSpeed: 8 },
  },
  dragon: {
    id: 'dragon', name: '幼龍', glyph: '龍', color: '#2f9e9a', cost: 4, kind: 'troop',
    role: '飛行範圍噴火',
    unit: { hp: 1100, damage: 150, hitSpeed: 1.5, firstHit: 0.5, range: 3.5, sight: 5.5, speed: 1.5, radius: 0.6, mass: 3, flying: true, targets: 'air-ground', splash: 1.5, projectileSpeed: 9 },
  },
  bats: {
    id: 'bats', name: '蝙蝠群', glyph: '蝠', color: '#6a4b8c', cost: 2, kind: 'troop', count: 4,
    role: '四隻飛行，脆但快',
    unit: { hp: 80, damage: 80, hitSpeed: 1.2, firstHit: 0.3, range: 0.6, sight: 5.5, speed: 2.0, radius: 0.3, mass: 0.5, flying: true, targets: 'air-ground' },
  },
  cannon: {
    id: 'cannon', name: '加農砲', glyph: '砲', color: '#6d6f78', cost: 3, kind: 'building', lifetime: 30,
    role: '防守建築，吸引只打建築的部隊',
    unit: { hp: 900, damage: 160, hitSpeed: 0.9, firstHit: 0.4, range: 5.5, sight: 5.5, speed: 0, radius: 0.9, mass: 100, flying: false, targets: 'ground', projectileSpeed: 14 },
  },
  fireball: {
    id: 'fireball', name: '火球', glyph: '焰', color: '#e0782f', cost: 4, kind: 'spell',
    role: '中範圍高傷害法術',
    spell: { radius: 2.5, damage: 570, towerDamagePct: 0.3 },
  },
  arrows: {
    id: 'arrows', name: '箭雨', glyph: '箭', color: '#b8933a', cost: 3, kind: 'spell',
    role: '大範圍清小怪',
    spell: { radius: 4, damage: 300, towerDamagePct: 0.3 },
  },
  zap: {
    id: 'zap', name: '雷擊', glyph: '雷', color: '#3a8ed5', cost: 2, kind: 'spell',
    role: '立即小範圍傷害並暈眩',
    spell: { radius: 2.5, damage: 160, towerDamagePct: 0.3, stun: 0.5, travelSpeed: 0 },
  },
};

export const CARD_IDS = Object.keys(CARDS);

export const DEFAULT_PLAYER_DECK = ['swordsman', 'archers', 'golem', 'imps', 'firemage', 'fireball', 'cannon', 'bats'];

/** 電腦可用的牌組，每套都含對空與法術。 */
export const AI_DECKS: string[][] = [
  ['raider', 'musketeer', 'imps', 'cannon', 'fireball', 'zap', 'swordsman', 'bats'],
  ['golem', 'dragon', 'archers', 'firemage', 'arrows', 'zap', 'imps', 'swordsman'],
  ['swordsman', 'musketeer', 'dragon', 'raider', 'arrows', 'fireball', 'bats', 'cannon'],
];

export function isValidDeck(deck: readonly string[]): boolean {
  return deck.length === 8 && new Set(deck).size === 8 && deck.every((id) => id in CARDS);
}

export function canHitAir(card: CardDef): boolean {
  return card.kind === 'spell' || card.unit?.targets === 'air-ground';
}
