import { DEFAULT_PLAYER_DECK, isValidDeck, type AiLevel } from '../sim';
import { load, save } from './storage';

// 只存在本機瀏覽器；儲存失敗時使用預設值，不影響開戰。
export interface Settings {
  deck: string[];
  muted: boolean;
  level: AiLevel;
  howtoSeen: boolean;
  record: { win: number; lose: number; draw: number };
}

const KEY = 'bridge-tower-duel.v1';

export function loadSettings(): Settings {
  const raw = load<Partial<Settings>>(KEY, {});
  const deck = Array.isArray(raw.deck) && isValidDeck(raw.deck) ? raw.deck : [...DEFAULT_PLAYER_DECK];
  // 第一次來的玩家預設「簡單」（多半是從社群連結點進來的新手）；選過難度就沿用
  const level: AiLevel = raw.level === 'easy' || raw.level === 'normal' || raw.level === 'hard' ? raw.level : 'easy';
  const r = raw.record;
  return {
    deck,
    muted: raw.muted === true,
    level,
    howtoSeen: raw.howtoSeen === true,
    record: {
      win: Number(r?.win) || 0,
      lose: Number(r?.lose) || 0,
      draw: Number(r?.draw) || 0,
    },
  };
}

export function saveSettings(s: Settings): void {
  save(KEY, s);
}
