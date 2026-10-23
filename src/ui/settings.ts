import { CARDS, DEFAULT_PLAYER_DECK, isValidDeck, type AiLevel, type Team } from '../sim';
import { load, save } from './storage';

// 只存在本機瀏覽器；儲存失敗時使用預設值，不影響開戰。

/** 對戰紀錄的一筆（最新的在最前面）。 */
export interface BattleLogEntry {
  at: number; // 結束時間（毫秒）
  w: Team | null; // 勝方（0 = 你）
  c: [number, number]; // 皇冠（你、電腦）
  lvl: AiLevel;
  foe: string; // 電腦牌組名稱
  foeCards: string[];
  deck: string[];
  d: number; // 獎盃增減
  t: number; // 打完後的獎盃
  rep?: string; // 重播（encodeReplay 的字串）
}

export const LOG_MAX = 20;

export interface Settings {
  /** 目前使用的牌組（= decks[slot]）。 */
  deck: string[];
  /** 三個牌組欄位，可以各存一副牌、隨時切換。 */
  decks: string[][];
  slot: number;
  muted: boolean;
  level: AiLevel;
  howtoSeen: boolean;
  /** 第一場的新手教學提示已經看過。 */
  coachDone: boolean;
  record: { win: number; lose: number; draw: number };
  trophies: number;
  bestTrophies: number;
  threeCrowns: number;
  /** 每張卡累計出過幾次。 */
  cardPlays: Record<string, number>;
  log: BattleLogEntry[];
}

const KEY = 'bridge-tower-duel.v1';

/** 三個欄位的預設牌組：均衡推進、低費快攻、空中與衝鋒。 */
export const DECK_PRESETS: readonly (readonly string[])[] = [
  DEFAULT_PLAYER_DECK,
  ['wolf_rider', 'ice_spirit', 'skeletons', 'musketeer', 'cannon', 'log', 'fireball', 'knight'],
  ['baby_dragon', 'lancer', 'bats', 'wizard', 'bomber', 'arrows', 'rage', 'tombstone'],
];
export const DECK_SLOTS = DECK_PRESETS.length;

export function loadSettings(): Settings {
  const raw = load<Partial<Settings>>(KEY, {});
  const decks = DECK_PRESETS.map((p, i) => {
    const d = Array.isArray(raw.decks) ? raw.decks[i] : undefined;
    return Array.isArray(d) && isValidDeck(d) ? [...d] : [...p];
  });
  // 舊版只存一副牌：放到第 1 個欄位
  if (!Array.isArray(raw.decks) && Array.isArray(raw.deck) && isValidDeck(raw.deck)) decks[0] = [...raw.deck];
  const slot = Number.isInteger(raw.slot) && (raw.slot as number) >= 0 && (raw.slot as number) < DECK_SLOTS ? (raw.slot as number) : 0;
  // 第一次來的玩家預設「簡單」（多半是從社群連結點進來的新手）；選過難度就沿用
  const level: AiLevel = raw.level === 'easy' || raw.level === 'normal' || raw.level === 'hard' ? raw.level : 'easy';
  const r = raw.record;
  const trophies = Math.max(0, Math.floor(Number(raw.trophies) || 0));
  const cardPlays: Record<string, number> = {};
  if (raw.cardPlays && typeof raw.cardPlays === 'object') {
    for (const [id, n] of Object.entries(raw.cardPlays)) if (id in CARDS && Number(n) > 0) cardPlays[id] = Math.floor(Number(n));
  }
  return {
    deck: decks[slot],
    decks,
    slot,
    muted: raw.muted === true,
    level,
    howtoSeen: raw.howtoSeen === true,
    coachDone: raw.coachDone === true,
    record: {
      win: Number(r?.win) || 0,
      lose: Number(r?.lose) || 0,
      draw: Number(r?.draw) || 0,
    },
    trophies,
    bestTrophies: Math.max(trophies, Math.floor(Number(raw.bestTrophies) || 0)),
    threeCrowns: Math.max(0, Math.floor(Number(raw.threeCrowns) || 0)),
    cardPlays,
    log: Array.isArray(raw.log) ? raw.log.filter(validEntry).slice(0, LOG_MAX) : [],
  };
}

const validCards = (v: unknown): v is string[] => Array.isArray(v) && v.length === 8 && v.every((id) => typeof id === 'string' && id in CARDS);

function validEntry(e: unknown): e is BattleLogEntry {
  if (!e || typeof e !== 'object') return false;
  const x = e as Record<string, unknown>;
  const c = x.c as unknown[];
  return (
    typeof x.at === 'number' && (x.w === 0 || x.w === 1 || x.w === null) && Array.isArray(c) && c.length === 2 && c.every((n) => typeof n === 'number') &&
    (x.lvl === 'easy' || x.lvl === 'normal' || x.lvl === 'hard') && typeof x.foe === 'string' && validCards(x.foeCards) && validCards(x.deck) &&
    typeof x.d === 'number' && typeof x.t === 'number' && (x.rep === undefined || typeof x.rep === 'string')
  );
}

/** 換到另一個牌組欄位（deck 跟著指向那一副）。 */
export function useSlot(s: Settings, slot: number): void {
  s.slot = Math.max(0, Math.min(DECK_SLOTS - 1, slot));
  s.deck = s.decks[s.slot];
}

export function saveSettings(s: Settings): void {
  save(KEY, s);
}
