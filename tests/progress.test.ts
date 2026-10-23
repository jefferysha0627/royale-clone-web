import { describe, expect, it } from 'vitest';
import { isValidDeck, type MatchResult } from '../src/sim';
import { ARENA_THEMES } from '../src/render3d/arena';
import { favoriteCard, recordBattle, timeAgo, type MatchInfo } from '../src/ui/profile';
import { ARENAS, arenaIndex, arenaProgress, trophyDelta } from '../src/ui/progress';
import { DECK_PRESETS, LOG_MAX, loadSettings, useSlot } from '../src/ui/settings';

const info = (plays: Record<string, number> = {}): MatchInfo => ({
  foe: '巨人推進',
  foeCards: ['giant', 'wizard', 'archers', 'goblins', 'arrows', 'zap', 'knight', 'tombstone'],
  level: 'normal',
  deck: [...DECK_PRESETS[0]],
  plays,
});
const result = (winner: 0 | 1 | null, crowns: [number, number]): MatchResult => ({ winner, crowns, reason: 'time', time: 180 });

describe('獎盃與競技場', () => {
  it('門檻與每座競技場的外觀一一對應', () => {
    expect(ARENAS.length).toBe(ARENA_THEMES.length);
    ARENAS.forEach((a, i) => {
      expect(a.theme).toBe(i);
      if (i > 0) expect(a.min).toBeGreaterThan(ARENAS[i - 1].min);
    });
    expect(new Set(ARENA_THEMES.map((t) => t.style)).size).toBe(ARENA_THEMES.length);
  });

  it('跨過門檻換競技場，進度條與還差幾座正確', () => {
    expect(arenaIndex(0)).toBe(0);
    expect(arenaIndex(299)).toBe(0);
    expect(arenaIndex(300)).toBe(1);
    expect(arenaIndex(99999)).toBe(ARENAS.length - 1);
    const p = arenaProgress(150);
    expect(p.next?.min).toBe(300);
    expect(p.need).toBe(150);
    expect(p.frac).toBeCloseTo(0.5);
    expect(arenaProgress(99999).next).toBeNull();
  });

  it('贏的難度越高拿越多、三皇冠加分、輸了扣分但不低於 0、平手不變', () => {
    expect(trophyDelta('easy', 0, 1, 0)).toBeLessThan(trophyDelta('hard', 0, 1, 0));
    expect(trophyDelta('normal', 0, 3, 0)).toBeGreaterThan(trophyDelta('normal', 0, 2, 0));
    expect(trophyDelta('hard', 1, 0, 5)).toBe(-5);
    expect(trophyDelta('hard', null, 1, 100)).toBe(0);
  });
});

describe('對戰紀錄與個人資料', () => {
  it('每場加一筆在最前面，最多保留 LOG_MAX 筆；最高獎盃、三皇冠與出牌次數會累計', () => {
    const s = loadSettings();
    s.trophies = 40;
    recordBattle(s, result(0, [3, 0]), info({ knight: 3, zap: 1 }), 25, 1000);
    expect(s.log[0]).toMatchObject({ w: 0, c: [3, 0], d: 25, t: 40, foe: '巨人推進' });
    expect(s.threeCrowns).toBe(1);
    expect(s.bestTrophies).toBe(40);
    s.trophies = 28;
    recordBattle(s, result(1, [0, 1]), info({ knight: 2, giant: 4 }), -12, 2000);
    expect(s.log[0].w).toBe(1);
    expect(s.bestTrophies).toBe(40);
    expect(s.threeCrowns).toBe(1);
    expect(s.cardPlays).toEqual({ knight: 5, zap: 1, giant: 4 });
    expect(favoriteCard(s)).toEqual({ id: 'knight', n: 5 });
    for (let i = 0; i < LOG_MAX + 5; i++) recordBattle(s, result(null, [1, 1]), info(), 0, 3000 + i);
    expect(s.log.length).toBe(LOG_MAX);
    expect(s.log[0].at).toBe(3000 + LOG_MAX + 4);
  });

  it('時間顯示成「剛剛／分鐘／小時／天前」', () => {
    const now = 10 * 86400000;
    expect(timeAgo(now - 20000, now)).toBe('剛剛');
    expect(timeAgo(now - 5 * 60000, now)).toBe('5 分鐘前');
    expect(timeAgo(now - 3 * 3600000, now)).toBe('3 小時前');
    expect(timeAgo(now - 2 * 86400000, now)).toBe('2 天前');
  });
});

describe('牌組欄位', () => {
  it('三組預設牌組都合法且不同，換欄位時 deck 跟著換', () => {
    expect(DECK_PRESETS.every((d) => isValidDeck(d))).toBe(true);
    expect(new Set(DECK_PRESETS.map((d) => [...d].sort().join())).size).toBe(DECK_PRESETS.length);
    const s = loadSettings();
    expect(s.slot).toBe(0);
    expect(s.deck).toEqual([...DECK_PRESETS[0]]);
    useSlot(s, 2);
    expect(s.deck).toBe(s.decks[2]);
    useSlot(s, 9);
    expect(s.slot).toBe(DECK_PRESETS.length - 1);
  });
});
