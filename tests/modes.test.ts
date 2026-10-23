import { describe, expect, it } from 'vitest';
import {
  AI_DECKS, AI_LEVELS, AiController, DEFAULT_PLAYER_DECK, DT, Game, MATCH, Rng, decodeReplay, encodeReplay, runReplay,
  type GameEvent, type GameMode, type Replay, type Team,
} from '../src/sim';

const DECK_B = AI_DECKS[0].cards;

function newGame(mode: GameMode, seed = 3): Game {
  return new Game({ seed, decks: [[...DEFAULT_PLAYER_DECK], [...DECK_B]], mode });
}

function run(g: Game, seconds: number, onEvents?: (ev: GameEvent[]) => void): void {
  const steps = Math.round(seconds / DT);
  for (let i = 0; i < steps && g.phase !== 'ended'; i++) {
    g.step();
    onEvents?.(g.drainEvents());
  }
}

const princess = (g: Game, team: Team) => g.towers(team).find((t) => t.unit === 'princess')!;

describe('活動模式', () => {
  it('三倍能量：開場就是 3 倍（不發加倍事件），2.8 秒回 3 點，補牌冷卻變成 1/3', () => {
    const g = newGame('triple');
    expect(g.mode).toBe('triple');
    expect(g.elixirMultiplier()).toBe(3);
    expect(g.cycleDelay()).toBeCloseTo(MATCH.cardCycleDelay / 3);
    const rates: number[] = [];
    run(g, 2.8, (ev) => ev.forEach((e) => e.type === 'elixirRate' && rates.push(e.mult)));
    expect(rates).toEqual([]);
    expect(g.players[0].elixir).toBeCloseTo(MATCH.startElixir + 3, 1);
    // 一般時間結束平手 → 延長賽仍是 3 倍
    g.timeLeft = 0.05;
    run(g, 0.2);
    expect(g.phase).toBe('overtime');
    expect(g.elixirMultiplier()).toBe(3);
  });

  it('雙倍能量：一般時間全程 2 倍，延長賽 3 倍', () => {
    const g = newGame('double');
    expect(g.elixirMultiplier()).toBe(2);
    run(g, 2.8);
    expect(g.players[1].elixir).toBeCloseTo(MATCH.startElixir + 2, 1);
    g.timeLeft = MATCH.doubleElixirAt - 1;
    expect(g.elixirMultiplier()).toBe(2);
    const rates: number[] = [];
    g.timeLeft = 0.05;
    run(g, 0.3, (ev) => ev.forEach((e) => e.type === 'elixirRate' && rates.push(e.mult)));
    expect(g.phase).toBe('overtime');
    expect(g.elixirMultiplier()).toBe(3);
    expect(rates).toEqual([3]);
  });

  it('驟死對決：開場就是延長賽規則（先推倒任一座塔獲勝、能量 2 倍、最後 60 秒 3 倍）', () => {
    const g = newGame('sudden');
    expect(g.phase).toBe('overtime');
    expect(g.timeLeft).toBe(MATCH.regularTime);
    expect(g.elixirMultiplier()).toBe(2);
    expect(g.playing).toBe(true);
    const rates: number[] = [];
    run(g, 0.5, (ev) => ev.forEach((e) => e.type === 'elixirRate' && rates.push(e.mult)));
    g.timeLeft = MATCH.tripleElixirAt + 0.1;
    run(g, 0.3, (ev) => ev.forEach((e) => e.type === 'elixirRate' && rates.push(e.mult)));
    expect(rates).toEqual([3]);
    expect(g.elixirMultiplier()).toBe(3);
    const p = princess(g, 1);
    g.applyDamage(p, p.hp);
    expect(g.result).toMatchObject({ winner: 0, reason: 'overtime', crowns: [1, 0] });
  });

  it('驟死對決時間到仍平手：直接進決勝扣血（不再有延長賽）', () => {
    const g = newGame('sudden');
    princess(g, 0).hp -= 500;
    g.timeLeft = 0.05;
    run(g, 0.1);
    expect(g.phase).toBe('tiebreak');
    run(g, MATCH.tiebreakDrainTime + 0.5);
    expect(g.result).toMatchObject({ winner: 1, reason: 'tiebreak' });
  });

  it('一般對戰規則不變：剩 60 秒加倍、延長賽 2 倍、延長賽最後 60 秒 3 倍', () => {
    const g = new Game({ seed: 1, decks: [[...DEFAULT_PLAYER_DECK], [...DECK_B]] });
    expect(g.mode).toBe('normal');
    expect(g.elixirMultiplier()).toBe(1);
    g.timeLeft = MATCH.doubleElixirAt;
    expect(g.elixirMultiplier()).toBe(2);
    g.timeLeft = 0.05;
    run(g, 0.2);
    expect(g.phase).toBe('overtime');
    expect(g.elixirMultiplier()).toBe(2);
    g.timeLeft = MATCH.tripleElixirAt;
    expect(g.elixirMultiplier()).toBe(3);
  });

  it('活動模式的重播會記下模式，重跑結果一模一樣；一般對戰的重播字串格式不變', () => {
    for (const mode of ['triple', 'sudden'] as const) {
      const seed = mode === 'triple' ? 9 : 31;
      const g = newGame(mode, seed);
      const enemy = new AiController(g, 1, g.rng.fork(), AI_LEVELS.normal);
      const player = new AiController(g, 0, new Rng(seed ^ 0x1234), AI_LEVELS.hard);
      for (let i = 0; i < 30 * 600 && g.phase !== 'ended'; i++) {
        player.update();
        enemy.update();
        g.step();
        g.drainEvents();
      }
      expect(g.phase).toBe('ended');
      const rep: Replay = { seed, decks: [[...DEFAULT_PLAYER_DECK], [...DECK_B]], actions: g.actions, foe: AI_DECKS[0].name, lvl: 'normal', arena: 1, mode };
      const s = encodeReplay(rep);
      expect(s.split('.')[2]).toHaveLength(3);
      const back = decodeReplay(s)!;
      expect(back.mode).toBe(mode);
      const r2 = runReplay(back);
      expect(r2.mode).toBe(mode);
      expect(r2.result).toEqual(g.result);
      expect(r2.stateHash()).toBe(g.stateHash());
    }
    const normal: Replay = { seed: 1, decks: [[...DEFAULT_PLAYER_DECK], [...DECK_B]], actions: [], foe: AI_DECKS[0].name, lvl: 'easy', arena: 0 };
    const s = encodeReplay(normal);
    expect(s.split('.')[2]).toBe('00');
    expect(decodeReplay(s)!.mode).toBe('normal');
    expect(decodeReplay(s.replace('.00.', '.009.'))).toBeNull();
  });
});
