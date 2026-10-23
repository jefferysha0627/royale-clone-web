import { DEFAULT_PLAYER_DECK, isValidDeck, type AiLevel } from '../sim';
import { load, save } from './storage';

// 只存在本機瀏覽器；儲存失敗時使用預設值，不影響開戰。
export interface Settings {
  /** 目前使用的牌組（= decks[slot]）。 */
  deck: string[];
  /** 三個牌組欄位，可以各存一副牌、隨時切換。 */
  decks: string[][];
  slot: number;
  muted: boolean;
  level: AiLevel;
  howtoSeen: boolean;
  record: { win: number; lose: number; draw: number };
  trophies: number;
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
  return {
    deck: decks[slot],
    decks,
    slot,
    muted: raw.muted === true,
    level,
    howtoSeen: raw.howtoSeen === true,
    record: {
      win: Number(r?.win) || 0,
      lose: Number(r?.lose) || 0,
      draw: Number(r?.draw) || 0,
    },
    trophies: Math.max(0, Math.floor(Number(raw.trophies) || 0)),
  };
}

/** 換到另一個牌組欄位（deck 跟著指向那一副）。 */
export function useSlot(s: Settings, slot: number): void {
  s.slot = Math.max(0, Math.min(DECK_SLOTS - 1, slot));
  s.deck = s.decks[s.slot];
}

export function saveSettings(s: Settings): void {
  save(KEY, s);
}
