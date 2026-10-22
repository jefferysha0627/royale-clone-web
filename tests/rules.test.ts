import { describe, expect, it } from 'vitest';
import { AI_DECKS, AI_LEVELS, AiController, ARENA, CARDS, DEFAULT_PLAYER_DECK, DT, Game, MATCH, Rng, TOWERS, type Entity, type GameEvent, type Team } from '../src/sim';

const DECK_B = ['swordsman', 'archers', 'musketeer', 'golem', 'raider', 'imps', 'firemage', 'dragon'];

function newGame(seed = 1, decks: [string[], string[]] = [[...DEFAULT_PLAYER_DECK], [...DECK_B]]): Game {
  return new Game({ seed, decks });
}

/** 把指定卡放進手牌第 0 格（測試用），並給足能量。 */
function hold(g: Game, team: Team, cardId: string, elixir = 10): void {
  const p = g.players[team];
  const qi = p.queue.indexOf(cardId);
  const hi = p.hand.indexOf(cardId);
  if (hi > 0) [p.hand[0], p.hand[hi]] = [p.hand[hi], p.hand[0]];
  else if (hi < 0 && qi >= 0) [p.hand[0], p.queue[qi]] = [p.queue[qi], p.hand[0]];
  else if (hi < 0) p.hand[0] = cardId;
  p.elixir = elixir;
}

function run(g: Game, seconds: number, onEvents?: (ev: GameEvent[]) => void): void {
  const steps = Math.round(seconds / DT);
  for (let i = 0; i < steps && g.phase !== 'ended'; i++) {
    g.step();
    const ev = g.drainEvents();
    onEvents?.(ev);
  }
}

const princess = (g: Game, team: Team, lane: number): Entity => g.towers(team).find((t) => t.cardId === 'princess' && t.lane === lane)!;
const king = (g: Game, team: Team): Entity => g.towers(team).find((t) => t.cardId === 'king')!;

describe('能量與出牌', () => {
  it('能量不足時不能出牌，能量與手牌都不變', () => {
    const g = newGame();
    hold(g, 0, 'golem', 4);
    const before = { hand: [...g.players[0].hand], queue: [...g.players[0].queue], elixir: g.players[0].elixir };
    const res = g.deploy(0, 0, 9, 24);
    expect(res).toEqual({ ok: false, reason: 'elixir' });
    expect(g.players[0].elixir).toBe(before.elixir);
    expect(g.players[0].hand).toEqual(before.hand);
    expect(g.players[0].queue).toEqual(before.queue);
    expect(g.entities.filter((e) => e.kind === 'troop')).toHaveLength(0);
  });

  it('成功出牌只扣一次費用，手牌由下一張補上，出過的牌排到最後', () => {
    const g = newGame();
    hold(g, 0, 'swordsman', 7);
    const next = g.players[0].queue[0];
    const res = g.deploy(0, 0, 9, 24);
    expect(res.ok).toBe(true);
    expect(g.players[0].elixir).toBeCloseTo(7 - CARDS.swordsman.cost, 9);
    expect(g.players[0].hand[0]).toBe(next);
    expect(g.players[0].queue[g.players[0].queue.length - 1]).toBe('swordsman');
    expect(g.players[0].elixirSpent).toBe(CARDS.swordsman.cost);
    const ev = g.drainEvents();
    expect(ev.filter((e) => e.type === 'deploy')).toHaveLength(1);
    // 再推進幾步也不會重複扣款
    run(g, 0.5);
    expect(g.players[0].elixirSpent).toBe(CARDS.swordsman.cost);
  });

  it('連續出 8 張牌會完整輪過整副牌，手牌加佇列永遠是同一副牌', () => {
    const g = newGame(3);
    const deck = [...DEFAULT_PLAYER_DECK].sort();
    const seen = new Set<string>();
    for (let i = 0; i < 16; i++) {
      const p = g.players[0];
      p.elixir = 10;
      const idx = i % 4;
      const card = CARDS[p.hand[idx]];
      seen.add(card.id);
      expect(g.deploy(0, idx, 9, card.kind === 'spell' ? 10 : 22)).toEqual({ ok: true });
      expect([...p.hand, ...p.queue].sort()).toEqual(deck);
      expect(p.hand).toHaveLength(MATCH.handSize);
      g.drainEvents();
      // 只檢查輪替：清掉剛放下的單位，下一張才不會被擋住
      g.entities = g.entities.filter((e) => e.kind === 'tower');
    }
    expect(seen.size).toBe(8);
  });

  it('能量每 2.8 秒回復 1 點、上限 10、永不為負；最後 60 秒加倍', () => {
    const g = newGame();
    g.players[0].elixir = 5;
    run(g, 2.8);
    expect(g.players[0].elixir).toBeCloseTo(6, 1);
    run(g, 20);
    expect(g.players[0].elixir).toBe(MATCH.maxElixir);
    // 跳到雙倍能量
    g.timeLeft = MATCH.doubleElixirAt + 0.01;
    const events: GameEvent[] = [];
    run(g, 0.1, (e) => events.push(...e));
    expect(events.some((e) => e.type === 'doubleElixir')).toBe(true);
    g.players[0].elixir = 2;
    run(g, 1.4);
    expect(g.players[0].elixir).toBeCloseTo(3, 1);
  });
});

describe('部署區域', () => {
  it('部隊只能放己方半場，不能放對方半場、河道或塔上；法術可放任何地方', () => {
    const g = newGame();
    expect(g.canDeployAt(0, 'swordsman', 9, 24)).toBe(true);
    expect(g.canDeployAt(0, 'swordsman', 9, 10)).toBe(false);
    expect(g.canDeployAt(0, 'swordsman', 9, 16)).toBe(false);
    expect(g.canDeployAt(0, 'swordsman', 3.5, 25.5)).toBe(false);
    expect(g.canDeployAt(0, 'fireball', 9, 4)).toBe(true);
    // 電腦方（上方）鏡射
    expect(g.canDeployAt(1, 'swordsman', 9, 8)).toBe(true);
    expect(g.canDeployAt(1, 'swordsman', 9, 24)).toBe(false);
  });

  it('非法位置出牌失敗且不消耗能量與卡牌', () => {
    const g = newGame();
    hold(g, 0, 'swordsman', 10);
    const hand = [...g.players[0].hand];
    expect(g.deploy(0, 0, 9, 8)).toEqual({ ok: false, reason: 'zone' });
    expect(g.players[0].elixir).toBe(10);
    expect(g.players[0].hand).toEqual(hand);
  });

  it('推倒對方側塔後，該路可往前部署，但河道仍不可放', () => {
    const g = newGame();
    const t = princess(g, 1, 0);
    expect(g.canDeployAt(0, 'swordsman', 3, 12.5)).toBe(false);
    g.applyDamage(t, t.hp);
    expect(t.alive).toBe(false);
    expect(g.canDeployAt(0, 'swordsman', 3, 12.5)).toBe(true);
    expect(g.canDeployAt(0, 'swordsman', 15, 12.5)).toBe(false); // 另一路還沒開
    expect(g.canDeployAt(0, 'swordsman', 3, 16)).toBe(false); // 河道
  });
});

describe('移動與過橋', () => {
  it('從己方側塔正後方出發的地面部隊能繞過塔、走橋過河、抵達對方塔並攻擊', () => {
    for (const [x, y] of [[3.5, 28.5], [14.5, 28.5], [9, 31.5]] as [number, number][]) {
      const g = newGame(5);
      hold(g, 0, 'swordsman');
      expect(g.deploy(0, 0, x, y).ok).toBe(true);
      const id = g.entities[g.entities.length - 1].id;
      let crossed = false;
      let attacked = false;
      for (let i = 0; i < 40 / DT; i++) {
        g.step();
        const ev = g.drainEvents();
        const e = g.get(id);
        if (!e) break;
        // 任何時候都不能站在橋以外的河面上
        if (e.y > ARENA.riverTop + 0.01 && e.y < ARENA.riverBottom - 0.01) {
          const onBridge = ARENA.bridgeXs.some((bx) => Math.abs(e.x - bx) <= ARENA.bridgeHalfWidth);
          expect(onBridge).toBe(true);
        }
        // 不能穿進塔裡
        for (const t of g.towers(0).concat(g.towers(1))) {
          if (t.alive) expect(Math.hypot(e.x - t.x, e.y - t.y)).toBeGreaterThan(t.stats.radius + e.stats.radius - 0.05);
        }
        if (e.y < ARENA.riverTop) crossed = true;
        if (ev.some((v) => v.type === 'attack' && v.id === id)) attacked = true;
        if (attacked) break;
      }
      expect(crossed, `from (${x},${y})`).toBe(true);
      expect(attacked, `from (${x},${y})`).toBe(true);
    }
  });

  it('飛行單位直線飛越河道', () => {
    const g = newGame();
    hold(g, 0, 'dragon');
    g.deploy(0, 0, 9, 22);
    const id = g.entities[g.entities.length - 1].id;
    run(g, 6);
    const e = g.get(id)!;
    expect(e.y).toBeLessThan(ARENA.riverTop);
  });
});

describe('索敵', () => {
  it('只打建築的單位忽略部隊；只打地面的近戰打不到飛行；遠程可打空中', () => {
    const g = newGame();
    const mk = (team: Team, card: string, x: number, y: number): Entity => {
      hold(g, team, card);
      g.deploy(team, 0, x, y);
      return g.entities[g.entities.length - 1];
    };
    const golem = mk(0, 'golem', 9, 20);
    const sword = mk(0, 'swordsman', 6, 20);
    const archer = mk(0, 'archers', 12, 20);
    const enemyTroop = mk(1, 'swordsman', 9, 12);
    const bat = mk(1, 'bats', 12, 12);
    expect(g.canTarget(golem, enemyTroop)).toBe(false);
    expect(g.canTarget(golem, princess(g, 1, 0))).toBe(true);
    expect(g.canTarget(sword, bat)).toBe(false);
    expect(g.canTarget(sword, enemyTroop)).toBe(true);
    expect(g.canTarget(archer, bat)).toBe(true);
  });

  it('目標死亡後換下一個目標，不會對已死亡目標持續攻擊', () => {
    const g = newGame(9);
    hold(g, 0, 'musketeer');
    expect(g.deploy(0, 0, 9, 19).ok).toBe(true);
    const m = g.entities[g.entities.length - 1];
    hold(g, 1, 'imps');
    expect(g.deploy(1, 0, 9, 12.5).ok).toBe(true);
    const imps = g.entities.filter((e) => e.cardId === 'imps' && e.team === 1).map((e) => e.id);
    const attacksOnDead: number[] = [];
    const targetsHit = new Set<number>();
    for (let i = 0; i < 12 / DT && g.get(m.id); i++) {
      g.step();
      for (const ev of g.drainEvents()) {
        if (ev.type === 'attack' && ev.id === m.id) {
          const t = g.get(m.targetId);
          if (!t || !t.alive) attacksOnDead.push(m.targetId);
          targetsHit.add(m.targetId);
        }
      }
    }
    expect(attacksOnDead).toEqual([]);
    expect(imps.every((id) => !g.get(id))).toBe(true);
    expect(targetsHit.size).toBeGreaterThanOrEqual(2);
  });
});

describe('傷害、死亡與勝負', () => {
  it('每個單位的死亡事件只出現一次，死亡單位會從場上移除', () => {
    const g = newGame(11);
    hold(g, 1, 'imps');
    g.deploy(1, 0, 9, 14);
    hold(g, 0, 'fireball');
    g.deploy(0, 0, 9, 14);
    const deaths = new Map<number, number>();
    run(g, 4, (ev) => ev.forEach((e) => e.type === 'death' && deaths.set(e.id, (deaths.get(e.id) ?? 0) + 1)));
    expect(deaths.size).toBeGreaterThanOrEqual(3);
    for (const n of deaths.values()) expect(n).toBe(1);
    expect(g.entities.some((e) => !e.alive && e.kind !== 'tower')).toBe(false);
  });

  it('法術對塔只造成部分傷害；雷擊會暈眩', () => {
    const g = newGame();
    const t = princess(g, 1, 0);
    hold(g, 0, 'fireball');
    g.deploy(0, 0, t.x, t.y);
    run(g, 3);
    expect(TOWERS.princess.hp - t.hp).toBe(Math.round(CARDS.fireball.spell!.damage * CARDS.fireball.spell!.towerDamagePct));
    hold(g, 1, 'swordsman');
    g.deploy(1, 0, 9, 10);
    const s = g.entities[g.entities.length - 1];
    hold(g, 0, 'zap');
    g.deploy(0, 0, s.x, s.y);
    g.step();
    expect(s.stunTimer).toBeGreaterThan(0);
  });

  it('推倒側塔得 1 皇冠並喚醒國王塔；推倒國王塔立即 3 皇冠獲勝，之後不再受傷', () => {
    const g = newGame();
    const k = king(g, 1);
    expect(k.active).toBe(false);
    const p = princess(g, 1, 0);
    g.applyDamage(p, p.hp + 100);
    expect(g.players[0].crowns).toBe(1);
    expect(k.active).toBe(true);
    g.applyDamage(p, 500); // 已倒下的塔不再計分
    expect(g.players[0].crowns).toBe(1);
    const events = g.drainEvents();
    expect(events.filter((e) => e.type === 'towerDown')).toHaveLength(1);
    g.applyDamage(k, k.hp);
    expect(g.phase).toBe('ended');
    expect(g.result).toMatchObject({ winner: 0, crowns: [3, 0], reason: 'king' });
    expect(g.towers(1).every((tw) => !tw.alive)).toBe(true);
    const myKing = king(g, 0);
    const hp = myKing.hp;
    g.applyDamage(myKing, 1000);
    expect(myKing.hp).toBe(hp);
    expect(g.drainEvents().filter((e) => e.type === 'end')).toHaveLength(1);
    g.step();
    expect(g.drainEvents().filter((e) => e.type === 'end')).toHaveLength(0);
  });

  it('一般時間結束時皇冠多者獲勝', () => {
    const g = newGame();
    const p = princess(g, 0, 1);
    g.applyDamage(p, p.hp);
    g.timeLeft = 0.05;
    run(g, 0.2);
    expect(g.result).toMatchObject({ winner: 1, reason: 'time', crowns: [0, 1] });
  });

  it('平手進入延長賽，延長賽先拿皇冠者勝', () => {
    const g = newGame();
    g.timeLeft = 0.05;
    run(g, 0.2);
    expect(g.phase).toBe('overtime');
    expect(g.timeLeft).toBeGreaterThan(MATCH.overtime - 1);
    const p = princess(g, 1, 1);
    g.applyDamage(p, p.hp);
    expect(g.result).toMatchObject({ winner: 0, reason: 'overtime', crowns: [1, 0] });
  });

  it('延長賽結束仍平手：最低血量塔比例較低的一方落敗；完全相同則平手', () => {
    const g = newGame();
    g.timeLeft = 0.05;
    run(g, 0.2);
    princess(g, 0, 0).hp -= 600;
    g.timeLeft = 0.05;
    run(g, 0.2);
    expect(g.result).toMatchObject({ winner: 1, reason: 'tiebreak' });

    const d = newGame();
    d.timeLeft = 0.05;
    run(d, 0.2);
    d.timeLeft = 0.05;
    run(d, 0.2);
    expect(d.result).toMatchObject({ winner: null, reason: 'draw' });
  });

  it('結束後不能再出牌', () => {
    const g = newGame();
    const k = king(g, 0);
    g.applyDamage(k, k.hp);
    hold(g, 0, 'swordsman');
    expect(g.deploy(0, 0, 9, 24)).toEqual({ ok: false, reason: 'ended' });
  });
});

describe('建築', () => {
  it('建築會隨時間衰減並在壽命結束時拆除', () => {
    const g = newGame();
    hold(g, 0, 'cannon');
    g.deploy(0, 0, 9, 22);
    const c = g.entities[g.entities.length - 1];
    run(g, CARDS.cannon.lifetime! / 2);
    expect(c.hp).toBeLessThan(c.maxHp * 0.6);
    run(g, CARDS.cannon.lifetime! / 2 + 1);
    expect(g.get(c.id)).toBeUndefined();
  });
});

describe('可重現性與電腦對手', () => {
  function playOut(seed: number, steps: number): string {
    const pick = new Rng(seed * 7919);
    const g = new Game({ seed, decks: [pick.pick(AI_DECKS), pick.pick(AI_DECKS)] });
    const ais = [new AiController(g, 0, g.rng.fork()), new AiController(g, 1, g.rng.fork())];
    for (let i = 0; i < steps && g.phase !== 'ended'; i++) {
      for (const a of ais) a.update();
      g.step();
      g.drainEvents();
    }
    return g.stateHash();
  }

  it('同一個 seed 會得到完全相同的對戰；不同 seed 結果不同', () => {
    expect(playOut(42, 1800)).toBe(playOut(42, 1800));
    expect(playOut(42, 1800)).not.toBe(playOut(43, 1800));
  });

  it('電腦只透過合法出牌行動：能量永不為負、部隊只出現在合法區域，整場能正常結束', () => {
    for (const level of ['easy', 'normal', 'hard'] as const) {
      const g = new Game({ seed: 77, decks: [[...DEFAULT_PLAYER_DECK], [...AI_DECKS[0]]] });
      const ai = new AiController(g, 1, g.rng.fork(), AI_LEVELS[level]);
      let deploys = 0;
      for (let i = 0; i < 400 / DT && g.phase !== 'ended'; i++) {
        ai.update();
        for (const ev of g.drainEvents()) {
          if (ev.type === 'deploy' && ev.team === 1) {
            deploys++;
            if (CARDS[ev.cardId].kind !== 'spell') expect(ev.y).toBeLessThanOrEqual(ARENA.riverTop - 0.5);
          }
        }
        g.step();
        expect(g.players[1].elixir).toBeGreaterThanOrEqual(0);
        expect(g.players[1].elixir).toBeLessThanOrEqual(MATCH.maxElixir);
        g.drainEvents();
      }
      expect(g.phase, level).toBe('ended');
      expect(deploys, level).toBeGreaterThanOrEqual(3);
      // 玩家完全不出牌時，電腦應該能拿下至少一座塔
      expect(g.players[1].crowns, level).toBeGreaterThanOrEqual(1);
    }
  });
});
