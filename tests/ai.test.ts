import { describe, expect, it } from 'vitest';
import { AI_DECKS, AI_LEVELS, AiController, DEFAULT_PLAYER_DECK, DT, Game, Rng, type AiLevel, type GameEvent, type Team } from '../src/sim';

const deckOf = (name: string): string[] => [...AI_DECKS.find((d) => d.name === name)!.cards];

/** 把手牌換成指定的牌（必須在牌組裡），其餘排進佇列。 */
function setHand(g: Game, team: Team, cards: string[], elixir: number): void {
  const p = g.players[team];
  const all = [...p.hand.filter((c): c is string => !!c), ...p.queue];
  p.hand = [...cards];
  p.queue = all.filter((c) => !cards.includes(c));
  p.elixir = elixir;
}

/** 模擬玩家出牌：把牌換到手牌第 0 格、給足能量後部署。 */
function play(g: Game, team: Team, card: string, x: number, y: number): void {
  const p = g.players[team];
  const hi = p.hand.indexOf(card);
  const qi = p.queue.indexOf(card);
  if (hi > 0) [p.hand[0], p.hand[hi]] = [p.hand[hi], p.hand[0]];
  else if (hi < 0 && qi >= 0) [p.hand[0], p.queue[qi]] = [card, p.hand[0]!];
  else if (hi < 0) p.hand[0] = card;
  const saved = p.elixir;
  p.elixir = 10;
  expect(g.deploy(team, 0, x, y).ok, `${card} at ${x},${y}`).toBe(true);
  p.elixir = saved;
}

function run(g: Game, sec: number, ais: AiController[], onEvents?: (ev: GameEvent[]) => void): void {
  for (let i = 0; i < Math.round(sec / DT) && g.phase !== 'ended'; i++) {
    for (const a of ais) a.update();
    g.step();
    const ev = g.drainEvents();
    onEvents?.(ev);
  }
}

const princessLoss = (g: Game, team: Team, lane: number): number => {
  const t = g.towers(team).find((x) => x.unit === 'princess' && x.lane === lane)!;
  return t.maxHp - Math.max(0, t.hp);
};

describe('電腦對手的判斷', () => {
  it('會防守：玩家巨人＋火槍手推進時，塔受到的傷害遠少於完全不出牌', () => {
    const loss = (defend: boolean): number => {
      const g = new Game({ seed: 9, decks: [[...DEFAULT_PLAYER_DECK], deckOf('巨人推進')] });
      const ai = new AiController(g, 1, g.rng.fork(), AI_LEVELS.normal);
      const ais = defend ? [ai] : [];
      g.players[1].elixir = 8;
      play(g, 0, 'giant', 3.5, 18.5);
      run(g, 2, ais);
      play(g, 0, 'musketeer', 3.5, 21.5);
      run(g, 30, ais);
      return princessLoss(g, 1, 0);
    };
    const idle = loss(false);
    const defended = loss(true);
    expect(idle).toBeGreaterThan(1500);
    expect(defended).toBeLessThan(idle * 0.4);
  });

  it('骷髏大軍衝過來時，用範圍法術處理而不是單體部隊', () => {
    const g = new Game({ seed: 4, decks: [['skeleton_army', ...DEFAULT_PLAYER_DECK.slice(1)], deckOf('巨人推進')] });
    const ai = new AiController(g, 1, g.rng.fork(), AI_LEVELS.normal);
    setHand(g, 1, ['arrows', 'knight', 'musketeer', 'giant'], 7);
    play(g, 0, 'skeleton_army', 3.5, 17.5);
    let answer = '';
    run(g, 8, [ai], (ev) => {
      for (const e of ev) if (e.type === 'deploy' && e.team === 1 && !answer) answer = e.cardId;
    });
    expect(answer).toBe('arrows');
  });

  it('困難電腦數對手能量：整場估計值與實際能量的平均誤差小於 0.3', () => {
    const g = new Game({ seed: 31, decks: [deckOf('狼騎快攻'), deckOf('巨人推進')] });
    const ais = [new AiController(g, 0, g.rng.fork(), AI_LEVELS.normal), new AiController(g, 1, g.rng.fork(), AI_LEVELS.hard)];
    let err = 0;
    let n = 0;
    for (let i = 0; i < 600 / DT && g.phase !== 'ended'; i++) {
      for (const a of ais) a.update();
      g.step();
      g.drainEvents();
      if (i % 15 === 0) {
        err += Math.abs(ais[1].enemyElixirEstimate - g.players[0].elixir);
        n++;
      }
    }
    expect(n).toBeGreaterThan(100);
    expect(err / n).toBeLessThan(0.3);
    expect(ais[1].knownEnemyCards.length).toBeGreaterThanOrEqual(6);
  });
});

describe('難度強弱（交換座位的電腦對電腦對戰）', () => {
  /** 甲難度對乙難度：每個 seed 用同一組牌組各坐兩邊打一次，回傳甲的勝率與困難電腦的平均溢出能量。 */
  function series(a: AiLevel, b: AiLevel, seeds: number): { winRate: number; leakA: number } {
    let wins = 0;
    let games = 0;
    let leak = 0;
    for (let s = 0; s < seeds; s++) {
      const seed = 500 + s;
      const pick = new Rng(seed * 7919);
      const da = pick.pick(AI_DECKS).cards;
      const db = pick.pick(AI_DECKS).cards;
      for (const flip of [false, true]) {
        const seatA: Team = flip ? 1 : 0;
        const g = new Game({ seed, decks: flip ? [[...db], [...da]] : [[...da], [...db]] });
        const levels = flip ? [b, a] : [a, b];
        const ais = ([0, 1] as const).map((t) => new AiController(g, t, g.rng.fork(), AI_LEVELS[levels[t]]));
        run(g, 600, ais);
        expect(g.phase).toBe('ended');
        games++;
        if (g.result!.winner === seatA) wins++;
        leak += g.players[seatA].elixirLeaked;
      }
    }
    return { winRate: wins / games, leakA: leak / games };
  }

  it('困難勝簡單、普通勝簡單、困難不輸普通；困難幾乎不浪費能量', () => {
    const he = series('hard', 'easy', 12);
    const ne = series('normal', 'easy', 12);
    const hn = series('hard', 'normal', 12);
    expect(he.winRate).toBeGreaterThanOrEqual(0.65);
    expect(ne.winRate).toBeGreaterThanOrEqual(0.55);
    expect(hn.winRate).toBeGreaterThanOrEqual(0.5);
    expect(he.leakA).toBeLessThan(1);
  }, 120_000);
});
