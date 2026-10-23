import { describe, expect, it } from 'vitest';
import { AI_DECKS, AI_LEVELS, AiController, DEFAULT_PLAYER_DECK, Game, Rng, decodeReplay, encodeReplay, runReplay, type Replay } from '../src/sim';
import { dcos, dsin, len } from '../src/sim/dmath';

/** 模仿正式對戰：電腦用遊戲主亂數分出的亂數流；「玩家」用另一個獨立亂數（真人輸入不會動到遊戲亂數）。 */
function playMatch(seed: number, deckB: string[]): Game {
  const g = new Game({ seed, decks: [[...DEFAULT_PLAYER_DECK], [...deckB]] });
  const enemy = new AiController(g, 1, g.rng.fork(), AI_LEVELS.normal);
  const player = new AiController(g, 0, new Rng(seed ^ 0x1234), AI_LEVELS.hard);
  for (let i = 0; i < 30 * 600 && g.phase !== 'ended'; i++) {
    player.update();
    enemy.update();
    g.step();
    g.drainEvents();
  }
  return g;
}

describe('對戰重播', () => {
  it('依出牌紀錄重跑會得到完全相同的對戰（結果、皇冠、最後狀態）', () => {
    for (const [seed, d] of [[11, 0], [23, 3], [47, 8]] as const) {
      const deckB = AI_DECKS[d % AI_DECKS.length].cards;
      const g = playMatch(seed, deckB);
      expect(g.actions.length).toBeGreaterThan(10);
      const rep: Replay = { seed, decks: [[...DEFAULT_PLAYER_DECK], [...deckB]], actions: g.actions, foe: AI_DECKS[d % AI_DECKS.length].name, lvl: 'normal', arena: 2 };
      const r2 = runReplay(rep);
      expect(r2.result).toEqual(g.result);
      expect(r2.stateHash()).toBe(g.stateHash());
    }
  });

  it('編成字串再解開，內容不變；長度適合放進網址；版本或內容不對就拒絕', () => {
    const deckB = AI_DECKS[1].cards;
    const g = playMatch(5, deckB);
    const rep: Replay = { seed: 5, decks: [[...DEFAULT_PLAYER_DECK], [...deckB]], actions: g.actions, foe: AI_DECKS[1].name, lvl: 'hard', arena: 4 };
    const s = encodeReplay(rep);
    expect(s.length).toBeLessThan(1500);
    expect(/^[A-Za-z0-9._~-]+$/.test(s)).toBe(true);
    const back = decodeReplay(s)!;
    expect(back.seed).toBe(5);
    expect(back.decks).toEqual(rep.decks);
    expect(back.lvl).toBe('hard');
    expect(back.arena).toBe(4);
    expect(back.foe).toBe(AI_DECKS[1].name);
    expect(back.actions).toEqual(rep.actions);
    expect(runReplay(back).result).toEqual(g.result);
    expect(decodeReplay(s.replace(/^r1\./, 'r0.'))).toBeNull();
    expect(decodeReplay('r1.abc')).toBeNull();
    expect(decodeReplay(s.replace('knight', 'nope_card'))).toBeNull();
  });
});

describe('跨引擎一致的數學（模擬只用加減乘除與 sqrt）', () => {
  it('dsin／dcos 與 Math.sin／cos 的差距 < 1e-10，len 與 Math.hypot 的差距 < 1e-12', () => {
    for (let i = -200; i <= 200; i++) {
      const x = i * 0.0731;
      expect(Math.abs(dsin(x) - Math.sin(x))).toBeLessThan(1e-10);
      expect(Math.abs(dcos(x) - Math.cos(x))).toBeLessThan(1e-10);
      expect(Math.abs(len(x, x * 0.37 - 1) - Math.hypot(x, x * 0.37 - 1))).toBeLessThan(1e-12);
    }
  });
});
