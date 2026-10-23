import { describe, expect, it } from 'vitest';
import {
  AI_DECKS, AI_LEVELS, AiController, ARENA, CARDS, DEFAULT_PLAYER_DECK, DEPLOY, DT, Game, KING_ACTIVATION_TIME, MATCH, Rng, TOWERS, UNITS,
  type Entity, type GameEvent, type Team,
} from '../src/sim';

const DECK_B = ['knight', 'archers', 'musketeer', 'golem', 'wolf_rider', 'goblins', 'wizard', 'baby_dragon'];

function newGame(seed = 1, decks: [string[], string[]] = [[...DEFAULT_PLAYER_DECK], [...DECK_B]]): Game {
  return new Game({ seed, decks });
}

/** 把指定卡放進手牌第 0 格（測試用），並給足能量。 */
function hold(g: Game, team: Team, cardId: string, elixir = 10): void {
  const p = g.players[team];
  const hi = p.hand.indexOf(cardId);
  const qi = p.queue.indexOf(cardId);
  if (hi > 0) [p.hand[0], p.hand[hi]] = [p.hand[hi], p.hand[0]];
  else if (hi < 0 && qi >= 0) {
    const old = p.hand[0];
    p.hand[0] = cardId;
    if (old) p.queue[qi] = old;
    else p.queue.splice(qi, 1);
  } else if (hi < 0) p.hand[0] = cardId;
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

/** 部署並回傳新出現的己方實體。 */
function place(g: Game, team: Team, cardId: string, x: number, y: number): Entity[] {
  hold(g, team, cardId);
  const before = new Set(g.entities.map((e) => e.id));
  const res = g.deploy(team, 0, x, y);
  expect(res.ok, `${cardId} at (${x},${y})`).toBe(true);
  return g.entities.filter((e) => !before.has(e.id));
}

const princess = (g: Game, team: Team, lane: number): Entity => g.towers(team).find((t) => t.unit === 'princess' && t.lane === lane)!;
const king = (g: Game, team: Team): Entity => g.towers(team).find((t) => t.unit === 'king')!;

describe('能量與出牌', () => {
  it('能量不足時不能出牌，能量與手牌都不變', () => {
    const g = newGame();
    hold(g, 0, 'giant', 4);
    const before = { hand: [...g.players[0].hand], queue: [...g.players[0].queue], elixir: g.players[0].elixir };
    expect(g.deploy(0, 0, 9, 24)).toEqual({ ok: false, reason: 'elixir' });
    expect(g.players[0].elixir).toBe(before.elixir);
    expect(g.players[0].hand).toEqual(before.hand);
    expect(g.players[0].queue).toEqual(before.queue);
    expect(g.entities.filter((e) => e.kind === 'troop')).toHaveLength(0);
  });

  it('成功出牌只扣一次費用，下一張補上，出過的牌排到最後', () => {
    const g = newGame();
    hold(g, 0, 'knight', 7);
    const next = g.players[0].queue[0];
    expect(g.deploy(0, 0, 9, 24).ok).toBe(true);
    expect(g.players[0].elixir).toBeCloseTo(7 - CARDS.knight.cost, 9);
    expect(g.players[0].hand[0]).toBe(next);
    expect(g.players[0].queue[g.players[0].queue.length - 1]).toBe('knight');
    expect(g.players[0].elixirSpent).toBe(CARDS.knight.cost);
    expect(g.drainEvents().filter((e) => e.type === 'deploy')).toHaveLength(1);
    run(g, 0.5);
    expect(g.players[0].elixirSpent).toBe(CARDS.knight.cost);
  });

  it('連續出牌時，新卡要等 2 秒冷卻才補進手牌（能量加倍時 1 秒）', () => {
    const g = newGame(2);
    const p = g.players[0];
    p.elixir = 10;
    expect(g.deploy(0, 0, 3.5, 28.5).ok).toBe(true);
    expect(p.hand[0]).not.toBeNull();
    expect(g.deploy(0, 1, 14.5, 28.5).ok).toBe(true);
    expect(p.hand[1]).toBeNull();
    run(g, MATCH.cardCycleDelay - 0.1);
    expect(p.hand[1]).toBeNull();
    run(g, 0.2);
    expect(p.hand[1]).not.toBeNull();
    expect([...p.hand, ...p.queue].filter(Boolean).sort()).toEqual([...DEFAULT_PLAYER_DECK].sort());

    g.timeLeft = MATCH.doubleElixirAt - 1;
    g.step();
    expect(g.cycleDelay()).toBeCloseTo(MATCH.cardCycleDelay / 2, 9);
  });

  it('連續出 16 張牌會完整輪過整副牌兩次，手牌加佇列永遠是同一副牌', () => {
    const g = newGame(3);
    const deck = [...DEFAULT_PLAYER_DECK].sort();
    const seen = new Set<string>();
    for (let i = 0; i < 16; i++) {
      const p = g.players[0];
      p.elixir = 10;
      run(g, MATCH.cardCycleDelay + 0.05);
      const idx = i % 4;
      const id = p.hand[idx]!;
      const card = CARDS[id];
      seen.add(id);
      const y = card.kind === 'spell' ? 10.5 : 22.5;
      expect(g.deploy(0, idx, card.kind === 'building' ? 9 : 9.5, y).ok, id).toBe(true);
      expect([...p.hand, ...p.queue].filter(Boolean).sort()).toEqual(deck);
      g.drainEvents();
      g.entities = g.entities.filter((e) => e.kind === 'tower');
    }
    expect(seen.size).toBe(8);
  });

  it('能量起始 5、每 2.8 秒 1 點、上限 10；最後 60 秒雙倍；延長賽先雙倍、最後 60 秒三倍', () => {
    const g = newGame();
    expect(g.players[0].elixir).toBe(MATCH.startElixir);
    run(g, 2.8);
    expect(g.players[0].elixir).toBeCloseTo(6, 1);
    run(g, 20);
    expect(g.players[0].elixir).toBe(MATCH.maxElixir);
    g.timeLeft = MATCH.doubleElixirAt + 0.01;
    const events: GameEvent[] = [];
    run(g, 0.1, (e) => events.push(...e));
    expect(events.some((e) => e.type === 'elixirRate' && e.mult === 2)).toBe(true);
    g.players[0].elixir = 2;
    run(g, 1.4);
    expect(g.players[0].elixir).toBeCloseTo(3, 1);
    g.timeLeft = 0.05;
    run(g, 0.1);
    expect(g.phase).toBe('overtime');
    expect(g.timeLeft).toBeGreaterThan(MATCH.overtime - 1);
    expect(g.elixirMultiplier()).toBe(2);
    g.timeLeft = MATCH.tripleElixirAt - 0.5;
    expect(g.elixirMultiplier()).toBe(3);
    g.players[0].elixir = 2;
    run(g, 2.8 / 3);
    expect(g.players[0].elixir).toBeCloseTo(3, 1);
  });
});

describe('部署區域', () => {
  it('部隊只能放己方半場，不能放對方半場、河道、橋或塔上；法術可放任何地方', () => {
    const g = newGame();
    expect(g.canDeployAt(0, 'knight', 9.5, 24.5)).toBe(true);
    expect(g.canDeployAt(0, 'knight', 9.5, 10.5)).toBe(false);
    expect(g.canDeployAt(0, 'knight', 9.5, 16.5)).toBe(false);
    expect(g.canDeployAt(0, 'knight', 3.5, 16.5)).toBe(false); // 橋
    expect(g.canDeployAt(0, 'knight', 3.5, 25.5)).toBe(false); // 側塔
    expect(g.canDeployAt(0, 'knight', 9.5, 29.5)).toBe(false); // 國王塔
    expect(g.canDeployAt(0, 'knight', 9.5, 31.5)).toBe(true); // 國王塔後方一排
    expect(g.canDeployAt(0, 'knight', 0.5, 17.5)).toBe(true); // 最邊緣
    expect(g.canDeployAt(0, 'fireball', 9.5, 3.5)).toBe(true);
    expect(g.canDeployAt(1, 'knight', 9.5, 7.5)).toBe(true);
    expect(g.canDeployAt(1, 'knight', 9.5, 24.5)).toBe(false);
  });

  it('部隊對齊格子中心；2×2 建築對齊格線交點，佔地不能壓到塔或其他建築', () => {
    const g = newGame();
    expect(g.snap('knight', 9.2, 24.9)).toEqual([9.5, 24.5]);
    expect(g.snap('cannon', 9.4, 24.6)).toEqual([9, 25]);
    expect(g.canDeployAt(0, 'cannon', 9, 22)).toBe(true);
    expect(g.canDeployAt(0, 'cannon', 9, 18)).toBe(true);
    expect(g.canDeployAt(0, 'cannon', 9, 17)).toBe(false); // 一半壓到河道
    expect(g.canDeployAt(0, 'cannon', 5, 25)).toBe(false); // 壓到側塔
    place(g, 0, 'cannon', 9, 22);
    expect(g.canDeployAt(0, 'cannon', 10, 22)).toBe(false);
    expect(g.canDeployAt(0, 'knight', 9.5, 22.5)).toBe(false);
    expect(g.canDeployAt(0, 'cannon', 11, 22)).toBe(true);
  });

  it('非法位置出牌失敗且不消耗能量與卡牌', () => {
    const g = newGame();
    hold(g, 0, 'knight', 10);
    const hand = [...g.players[0].hand];
    expect(g.deploy(0, 0, 9, 8)).toEqual({ ok: false, reason: 'zone' });
    expect(g.players[0].elixir).toBe(10);
    expect(g.players[0].hand).toEqual(hand);
  });

  it('推倒對方側塔後，該路可往前部署到第 10 列，另一路與河道仍不可放', () => {
    const g = newGame();
    const t = princess(g, 1, 0);
    expect(g.canDeployAt(0, 'knight', 3.5, 12.5)).toBe(false);
    g.applyDamage(t, t.hp);
    expect(t.alive).toBe(false);
    expect(g.canDeployAt(0, 'knight', 3.5, 12.5)).toBe(true);
    expect(g.canDeployAt(0, 'knight', 6.5, 6.5)).toBe(false); // 超過前進區
    expect(g.canDeployAt(0, 'knight', 3.5, 10.5)).toBe(true);
    expect(g.canDeployAt(0, 'knight', 14.5, 12.5)).toBe(false); // 另一路還沒開
    expect(g.canDeployAt(0, 'knight', 3.5, 15.5)).toBe(false); // 河道
  });
});

describe('移動與過橋', () => {
  it('從己方側塔正後方出發的地面部隊能繞過塔、走橋過河、抵達對方塔並攻擊', () => {
    for (const [x, y] of [[3.5, 28.5], [14.5, 28.5], [9.5, 31.5]] as [number, number][]) {
      const g = newGame(5);
      const [k] = place(g, 0, 'knight', x, y);
      let crossed = false;
      let attacked = false;
      for (let i = 0; i < 45 / DT; i++) {
        g.step();
        const ev = g.drainEvents();
        const e = g.get(k.id);
        if (!e) break;
        if (e.y > ARENA.riverTop + 0.01 && e.y < ARENA.riverBottom - 0.01) {
          const onBridge = ARENA.bridgeXs.some((bx) => Math.abs(e.x - bx) <= ARENA.bridgeHalfWidth);
          expect(onBridge).toBe(true);
        }
        for (const t of g.towers(0).concat(g.towers(1))) {
          if (t.alive) expect(Math.abs(e.x - t.x) < t.half && Math.abs(e.y - t.y) < t.half).toBe(false);
        }
        if (e.y < ARENA.riverTop) crossed = true;
        if (ev.some((v) => v.type === 'attack' && v.id === k.id)) attacked = true;
        if (attacked) break;
      }
      expect(crossed, `from (${x},${y})`).toBe(true);
      expect(attacked, `from (${x},${y})`).toBe(true);
    }
  });

  it('飛行單位直線飛越河道；狼騎兵直接跳過河，不必繞到橋', () => {
    const g = newGame();
    const [d] = place(g, 0, 'baby_dragon', 9.5, 22.5);
    const [w] = place(g, 0, 'wolf_rider', 9.5, 19.5);
    let wolfJumped = false;
    run(g, 7, () => {
      const e = g.get(w.id);
      if (e && e.jumping) {
        wolfJumped = true;
        expect(ARENA.bridgeXs.some((bx) => Math.abs(e.x - bx) <= ARENA.bridgeHalfWidth)).toBe(false);
      }
    });
    expect(g.get(d.id)!.y).toBeLessThan(ARENA.riverTop);
    expect(wolfJumped).toBe(true);
  });
});

describe('索敵', () => {
  it('只打建築的單位忽略部隊；只打地面的近戰打不到飛行；遠程可打空中', () => {
    const g = newGame();
    const [giant] = place(g, 0, 'giant', 9.5, 20.5);
    const [knight] = place(g, 0, 'knight', 6.5, 20.5);
    const [archer] = place(g, 0, 'archers', 12.5, 20.5);
    const [enemyTroop] = place(g, 1, 'knight', 9.5, 12.5);
    const [bat] = place(g, 1, 'bats', 12.5, 12.5);
    expect(g.canTarget(giant, enemyTroop)).toBe(false);
    expect(g.canTarget(giant, princess(g, 1, 0))).toBe(true);
    expect(g.canTarget(knight, bat)).toBe(false);
    expect(g.canTarget(knight, enemyTroop)).toBe(true);
    expect(g.canTarget(archer, bat)).toBe(true);
  });

  it('目標死亡後換下一個目標，不會對已死亡目標持續攻擊', () => {
    const g = newGame(9);
    const [m] = place(g, 0, 'musketeer', 9.5, 19.5);
    const gobs = place(g, 1, 'goblins', 9.5, 12.5).map((e) => e.id);
    const attacksOnDead: number[] = [];
    const targetsHit = new Set<number>();
    for (let i = 0; i < 12 / DT && g.get(m.id); i++) {
      g.step();
      for (const ev of g.drainEvents()) {
        if (ev.type === 'attack' && ev.id === m.id) {
          const t = g.get(ev.targetId);
          if (!t || !t.alive) attacksOnDead.push(ev.targetId);
          targetsHit.add(ev.targetId);
        }
      }
    }
    expect(attacksOnDead).toEqual([]);
    expect(gobs.filter((id) => g.get(id)).length).toBeLessThan(gobs.length);
    expect(targetsHit.size).toBeGreaterThanOrEqual(2);
  });

  it('放在中間的建築會把過橋的巨人拉離側塔', () => {
    const g = newGame(4);
    place(g, 0, 'cannon', 9, 22);
    const [gi] = place(g, 1, 'giant', 3.5, 11.5);
    const attacked: string[] = [];
    run(g, 25, (ev) => {
      for (const v of ev) {
        if (v.type === 'attack' && v.id === gi.id) attacked.push(g.get(v.targetId)?.unit ?? '?');
      }
    });
    // 第一個攻擊對象是加農砲，而不是側塔
    expect(attacked[0]).toBe('cannon');
  });
});

describe('塔', () => {
  it('側塔與國王塔使用 11 級數值', () => {
    const g = newGame();
    expect(princess(g, 0, 0).hp).toBe(3052);
    expect(king(g, 0).hp).toBe(4824);
    expect(TOWERS.princess.damage).toBe(109);
    expect(TOWERS.king.range).toBe(7);
  });

  it('國王塔受傷才醒來，醒來後要約 4 秒才射出第一發', () => {
    const g = newGame();
    const k = king(g, 1);
    const [knight] = place(g, 0, 'knight', 9.5, 17.5);
    g.entities.find((e) => e.id === knight.id)!.y = 8; // 直接放到國王塔射程內
    run(g, 2);
    expect(k.active).toBe(false);
    g.applyDamage(k, 10);
    expect(k.active).toBe(true);
    let firstShot = -1;
    const t0 = g.time;
    run(g, 6, (ev) => {
      if (firstShot < 0 && ev.some((v) => v.type === 'attack' && v.id === k.id)) firstShot = g.time - t0;
    });
    expect(firstShot).toBeGreaterThan(KING_ACTIVATION_TIME + 0.5);
    expect(firstShot).toBeLessThan(KING_ACTIVATION_TIME + 1);
  });

  it('推倒側塔得 1 皇冠並喚醒國王塔；推倒國王塔立即 3 皇冠獲勝，之後不再受傷', () => {
    const g = newGame();
    const k = king(g, 1);
    const p = princess(g, 1, 0);
    g.applyDamage(p, p.hp + 100);
    expect(g.players[0].crowns).toBe(1);
    expect(k.active).toBe(true);
    g.applyDamage(p, 500);
    expect(g.players[0].crowns).toBe(1);
    expect(g.drainEvents().filter((e) => e.type === 'towerDown')).toHaveLength(1);
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
});

describe('特殊機制', () => {
  it('衝鋒騎士直線跑 3 格後衝刺，第一擊造成雙倍傷害', () => {
    const g = newGame();
    const [l] = place(g, 0, 'lancer', 9.5, 22.5);
    const [dummy] = place(g, 1, 'giant', 9.5, 13.5);
    dummy.stats = { ...dummy.stats, speed: 0, targets: 'buildings' };
    let charged = false;
    const hits: number[] = [];
    run(g, 12, (ev) => {
      for (const v of ev) {
        if (v.type === 'charge' && v.id === l.id) charged = true;
        if (v.type === 'hit' && v.id === dummy.id) hits.push(v.amount);
      }
    });
    expect(charged).toBe(true);
    expect(hits[0]).toBe(UNITS.lancer.stats.charge!.damage);
    expect(hits[1]).toBe(UNITS.lancer.stats.damage);
  });

  it('石巨像倒下時造成死亡傷害並分裂成兩個小石像', () => {
    const g = newGame();
    const [golem] = place(g, 0, 'golem', 9.5, 20.5);
    const [enemy] = place(g, 1, 'knight', 10.5, 12.5);
    enemy.y = 20.5;
    enemy.deployTimer = 99;
    golem.deployTimer = 0;
    const hp = enemy.hp;
    g.applyDamage(golem, golem.hp);
    expect(enemy.hp).toBe(hp - UNITS.golem.stats.deathDamage!.damage);
    expect(g.entities.filter((e) => e.alive && e.unit === 'golemite' && e.team === 0)).toHaveLength(2);
  });

  it('巨骷髏死後 3 秒炸彈爆炸，對塔雙倍傷害', () => {
    const g = newGame();
    const t = princess(g, 1, 0);
    const [gs] = place(g, 0, 'giant_skeleton', 3.5, 18.5);
    gs.x = t.x;
    gs.y = t.y + t.half + 1;
    g.applyDamage(gs, gs.hp);
    const before = t.hp;
    run(g, 2.9);
    expect(t.hp).toBe(before);
    run(g, 0.2);
    const dd = UNITS.giant_skeleton.stats.deathDamage!;
    expect(before - t.hp).toBe(dd.damage * dd.towerMul);
  });

  it('死靈女巫 1 秒後召喚 4 隻骷髏，之後每 7 秒一次', () => {
    const g = newGame();
    place(g, 0, 'witch', 14.5, 30.5);
    const count = () => g.entities.filter((e) => e.alive && e.unit === 'skeleton' && e.team === 0).length;
    run(g, UNITS.witch.stats.deployTime + 0.9);
    expect(count()).toBe(0);
    run(g, 0.2);
    expect(count()).toBe(4);
    run(g, 7);
    expect(count()).toBe(8);
  });

  it('骷髏墓碑定時召喚，被摧毀時再放出 4 隻', () => {
    const g = newGame();
    const [tomb] = place(g, 0, 'tombstone', 14, 30);
    const count = () => g.entities.filter((e) => e.alive && e.unit === 'skeleton' && e.team === 0).length;
    run(g, 1.6);
    expect(count()).toBe(2);
    const n = count();
    g.applyDamage(tomb, tomb.hp);
    expect(count()).toBe(n + 4);
  });

  it('冰精靈撲向敵人後消失，並冰凍範圍內的敵人', () => {
    const g = newGame();
    const [s] = place(g, 0, 'ice_spirit', 9.5, 18.5);
    const enemies = place(g, 1, 'goblins', 9.5, 13.5);
    let frozen = false;
    run(g, 4, () => {
      if (enemies.some((e) => e.alive && e.frozen)) frozen = true;
    });
    expect(g.get(s.id)).toBeUndefined();
    expect(frozen).toBe(true);
  });

  it('火球：部隊全額、塔 30%，擊退輕型部隊但推不動巨人', () => {
    const g = newGame();
    const t = princess(g, 1, 0);
    hold(g, 0, 'fireball');
    g.deploy(0, 0, t.x, t.y);
    run(g, 3);
    expect(TOWERS.princess.hp - t.hp).toBe(Math.round(689 * 0.3));
    const [k] = place(g, 1, 'knight', 9.5, 10.5);
    const [gi] = place(g, 1, 'giant', 12.5, 10.5);
    k.deployTimer = gi.deployTimer = 99;
    const ky = k.y;
    const gy = gi.y;
    hold(g, 0, 'fireball');
    g.deploy(0, 0, 11, 12);
    run(g, 3);
    expect(k.maxHp - k.hp).toBe(689);
    expect(Math.hypot(k.x - 9.5, k.y - ky)).toBeGreaterThan(0.5);
    expect(gi.y).toBeCloseTo(gy, 5);
  });

  it('滾木只打地面、每個目標一次、對塔 20%，滾 10.1 格後消失', () => {
    const g = newGame();
    const gobs = place(g, 1, 'goblins', 9.5, 12.5);
    const [bat] = place(g, 1, 'bats', 6.5, 12.5);
    for (const e of [...gobs, bat]) e.deployTimer = 99;
    const hits = new Map<number, number>();
    hold(g, 0, 'log');
    g.deploy(0, 0, 9.5, 19.5);
    run(g, 4, (ev) => ev.forEach((v) => v.type === 'hit' && hits.set(v.id, (hits.get(v.id) ?? 0) + 1)));
    expect(gobs.every((e) => !e.alive)).toBe(true);
    expect(hits.get(bat.id)).toBeUndefined();
    for (const e of gobs) expect(hits.get(e.id)).toBe(1);
    expect(g.rollers).toHaveLength(0);
  });

  it('毒霧 8 秒內每秒造成傷害並緩速', () => {
    const g = newGame();
    const [k] = place(g, 1, 'knight', 9.5, 10.5);
    k.deployTimer = 99;
    hold(g, 0, 'poison');
    g.deploy(0, 0, 9.5, 10.5);
    run(g, 0.1);
    expect(k.slowMul).toBeCloseTo(0.85, 5);
    run(g, 9);
    expect(k.maxHp - k.hp).toBe(91 * 8);
  });

  it('雷擊暈眩 0.5 秒並重置熔岩塔的蓄力', () => {
    const g = newGame();
    const [inf] = place(g, 0, 'inferno', 9, 22);
    const [gi] = place(g, 1, 'giant', 9.5, 13.5);
    gi.y = 17.5;
    gi.deployTimer = 0;
    gi.stats = { ...gi.stats, speed: 0 };
    const dmg: number[] = [];
    run(g, 5.6, (ev) => ev.forEach((v) => v.type === 'hit' && v.id === gi.id && dmg.push(v.amount)));
    expect(dmg[0]).toBe(42);
    expect(Math.max(...dmg)).toBe(846);
    expect(gi.alive).toBe(true);
    expect(inf.rampTime).toBeGreaterThan(4);
    hold(g, 1, 'zap');
    g.deploy(1, 0, inf.x, inf.y);
    expect(inf.stunTimer).toBeGreaterThan(0);
    expect(inf.rampTime).toBe(0);
  });

  it('箭雨分三波落下；哥布林飛桶在落點放出三隻哥布林', () => {
    const g = newGame();
    const [k] = place(g, 1, 'knight', 9.5, 10.5);
    k.deployTimer = 99;
    hold(g, 0, 'arrows');
    g.deploy(0, 0, 9.5, 10.5);
    run(g, 3);
    expect(k.maxHp - k.hp).toBe(122 * 3);
    hold(g, 0, 'goblin_barrel');
    g.deploy(0, 0, 3.5, 9.5);
    run(g, 4);
    const gob = g.entities.filter((e) => e.alive && e.unit === 'goblin' && e.team === 0);
    expect(gob).toHaveLength(3);
  });
});

describe('時間與勝負', () => {
  it('一般時間結束時皇冠多者獲勝', () => {
    const g = newGame();
    const p = princess(g, 0, 1);
    g.applyDamage(p, p.hp);
    g.timeLeft = 0.05;
    run(g, 0.2);
    expect(g.result).toMatchObject({ winner: 1, reason: 'time', crowns: [0, 1] });
  });

  it('平手進入 2 分鐘延長賽，延長賽先推倒塔者勝', () => {
    const g = newGame();
    g.timeLeft = 0.05;
    run(g, 0.2);
    expect(g.phase).toBe('overtime');
    expect(g.timeLeft).toBeGreaterThan(MATCH.overtime - 1);
    const p = princess(g, 1, 1);
    g.applyDamage(p, p.hp);
    expect(g.result).toMatchObject({ winner: 0, reason: 'overtime', crowns: [1, 0] });
  });

  it('延長賽仍平手：清空部隊、塔同步扣血，最低血量的塔倒下的一方落敗；最低血量相同則平手', () => {
    const g = newGame();
    g.timeLeft = 0.05;
    run(g, 0.2);
    place(g, 0, 'knight', 9.5, 24.5);
    princess(g, 0, 0).hp -= 600;
    g.timeLeft = 0.05;
    run(g, 0.1);
    expect(g.phase).toBe('tiebreak');
    expect(g.entities.every((e) => e.kind === 'tower')).toBe(true);
    run(g, MATCH.tiebreakDrainTime + 0.5);
    expect(g.result).toMatchObject({ winner: 1, reason: 'tiebreak', crowns: [0, 1] });

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
    hold(g, 0, 'knight');
    expect(g.deploy(0, 0, 9, 24)).toEqual({ ok: false, reason: 'ended' });
  });
});

describe('建築', () => {
  it('建築會隨時間衰減並在壽命結束時拆除', () => {
    const g = newGame();
    const [c] = place(g, 0, 'cannon', 9, 22);
    const life = UNITS.cannon.stats.lifetime!;
    run(g, life / 2);
    expect(c.hp).toBeLessThan(c.maxHp * 0.6);
    run(g, life / 2 + 1);
    expect(g.get(c.id)).toBeUndefined();
  });
});

describe('冰凍、狂暴、能量收集器、地道挖掘者', () => {
  it('冰凍：範圍內敵人（含塔）凍住 4 秒並受 115 傷害、塔 30%；凍住的塔不會攻擊', () => {
    const g = newGame();
    const t = princess(g, 1, 0);
    const [k] = place(g, 1, 'knight', t.x + 2.5, t.y + 1);
    k.deployTimer = 0;
    hold(g, 0, 'freeze');
    expect(g.deploy(0, 0, t.x + 1, t.y + 1).ok).toBe(true);
    expect(k.maxHp - k.hp).toBe(115);
    expect(TOWERS.princess.hp - t.hp).toBe(Math.round(115 * 0.3));
    expect(k.frozen && t.frozen).toBe(true);
    expect(k.stunTimer).toBeCloseTo(4, 5);
    // 凍住期間把我方部隊放進射程，塔不會出手
    const [m] = place(g, 0, 'knight', 3.5, 18.5);
    m.x = t.x;
    m.y = t.y + 3.5;
    m.deployTimer = 99;
    let towerShots = 0;
    run(g, 3.5, (ev) => ev.forEach((v) => v.type === 'attack' && v.id === t.id && towerShots++));
    expect(towerShots).toBe(0);
    run(g, 2);
    expect(t.frozen).toBe(false);
  });

  it('狂暴：範圍內己方部隊移動與攻擊加快 35%，離開範圍後效果再維持約 2 秒', () => {
    const speedOf = (rage: boolean) => {
      const g = newGame();
      const [k] = place(g, 0, 'knight', 9.5, 24.5);
      k.deployTimer = 0;
      if (rage) {
        hold(g, 0, 'rage');
        g.deploy(0, 0, 9.5, 23.5);
      }
      const y0 = k.y;
      run(g, 1);
      return { d: y0 - k.y, k, g };
    };
    const base = speedOf(false);
    const raged = speedOf(true);
    expect(raged.d / base.d).toBeCloseTo(1.35, 1);
    // 離開範圍後：效果還在，約 2 秒後消失
    raged.k.x = 2.5;
    raged.k.y = 31.5;
    run(raged.g, 0.5);
    expect(raged.k.rageTimer).toBeGreaterThan(0);
    run(raged.g, 2);
    expect(raged.k.rageTimer).toBeLessThanOrEqual(0);
  });

  it('能量收集器：每 9 秒給 1 點能量，倒下時再給 1 點，65 秒後消失', () => {
    const g = newGame();
    const [c] = place(g, 0, 'elixir_collector', 9, 22);
    const p = g.players[0];
    p.elixir = 0;
    let gains = 0;
    run(g, 1 + 9 * 2 + 0.2, (ev) => ev.forEach((v) => v.type === 'elixir' && v.team === 0 && gains++));
    expect(gains).toBe(2);
    expect(p.elixirGained).toBe(2);
    const before = p.elixirGained;
    g.applyDamage(c, c.hp);
    expect(p.elixirGained).toBe(before + 1);
    const g2 = newGame();
    const [c2] = place(g2, 0, 'elixir_collector', 9, 22);
    run(g2, 1 + 65 + 0.5);
    expect(g2.get(c2.id)).toBeUndefined();
  });

  it('地道挖掘者：可放到對方半場（河道與塔上除外），鑽地途中不能被攻擊，冒出後對塔只有 25% 傷害', () => {
    const g = newGame();
    const t = princess(g, 1, 0);
    hold(g, 0, 'tunneler');
    expect(g.canDeployAt(0, 'tunneler', 9.5, 16.5)).toBe(false); // 河道
    expect(g.canDeployAt(0, 'tunneler', t.x, t.y)).toBe(false); // 塔上
    expect(g.canDeployAt(0, 'tunneler', t.x, t.y + 2)).toBe(true);
    const r = g.deploy(0, 0, t.x, t.y + 2);
    expect(r.ok).toBe(true);
    const m = g.entities.find((e) => e.unit === 'tunneler')!;
    expect(m.tunneling).toBe(true);
    // 鑽地途中：法術打不到、敵方塔不會鎖定它
    run(g, 0.5);
    hold(g, 1, 'zap');
    g.deploy(1, 0, m.x, m.y);
    expect(m.hp).toBe(m.maxHp);
    let emerged = -1;
    const travel = Math.hypot(m.tunnelX - m.x, m.tunnelY - m.y) / UNITS.tunneler.stats.tunnelSpeed!;
    run(g, travel + 0.2, (ev) => ev.forEach((v) => v.type === 'emerge' && v.id === m.id && (emerged = g.time)));
    expect(emerged).toBeGreaterThan(0);
    expect(m.tunneling).toBe(false);
    expect(Math.hypot(m.x - t.x, m.y - (t.y + 2))).toBeLessThan(1.2);
    // 冒出後攻擊側塔：每下 193 × 25%
    const hits: number[] = [];
    run(g, 4, (ev) => ev.forEach((v) => v.type === 'hit' && v.id === t.id && hits.push(v.amount)));
    expect(hits.length).toBeGreaterThan(0);
    expect(hits[0]).toBe(Math.round(193 * 0.25));
  });
});

describe('v3 第二批：衝車、落雷、火靈小屋、炸彈砲塔、攻城巨人', () => {
  it('攻城衝車：直線跑一段後衝刺，撞到塔造成衝刺傷害後解體並放出 2 名蠻族戰士', () => {
    const g = newGame();
    const t = princess(g, 1, 0);
    const [ram] = place(g, 0, 'siege_ram', 3.5, 20.5);
    const hits: number[] = [];
    let charged = false;
    let freed = 0;
    run(g, 25, (ev) =>
      ev.forEach((v) => {
        if (v.type === 'hit' && v.id === t.id && v.team === 1) hits.push(v.amount);
        if (v.type === 'charge' && v.id === ram.id) charged = true;
        if (v.type === 'spawn' && v.source === 'death' && v.unit === 'barbarian' && v.team === 0) freed++;
      }),
    );
    expect(charged).toBe(true);
    expect(ram.alive).toBe(false);
    // 第一下是衝車的衝刺傷害（之後的命中來自放出的蠻族戰士）
    expect(hits[0]).toBe(UNITS.siege_ram.stats.charge!.damage);
    expect(freed).toBe(2);
    // 半路被打掉也會放出 2 名蠻族戰士
    const g2 = newGame();
    const [ram2] = place(g2, 0, 'siege_ram', 9.5, 24.5);
    run(g2, 1.2);
    g2.applyDamage(ram2, ram2.hp);
    expect(g2.entities.filter((e) => e.alive && e.unit === 'barbarian' && e.team === 0)).toHaveLength(2);
  });

  it('落雷：依序劈中範圍內血量最高的 3 個目標各一次（同一目標不重複），並暈眩', () => {
    const g = newGame();
    const [giant] = place(g, 1, 'giant', 9.5, 10.5);
    const [kn] = place(g, 1, 'knight', 8.5, 11.5);
    const arch = place(g, 1, 'archers', 10.5, 11.5);
    const skel = place(g, 1, 'skeletons', 9.5, 12.5);
    run(g, 1.1); // 部署完成
    hold(g, 0, 'lightning');
    expect(g.deploy(0, 0, 9.5, 11.5).ok).toBe(true);
    const struck: number[] = [];
    run(g, 1.6, (ev) => ev.forEach((v) => v.type === 'strike' && struck.push(v.targetId)));
    expect(struck).toHaveLength(3);
    expect(struck[0]).toBe(giant.id);
    expect(struck[1]).toBe(kn.id);
    expect(arch.map((a) => a.id)).toContain(struck[2]);
    expect(new Set(struck).size).toBe(3);
    expect(skel.every((s) => s.hp === s.maxHp)).toBe(true);
    expect(giant.maxHp - giant.hp).toBeGreaterThanOrEqual(1056);
    // 對塔只有 30%
    const g2 = newGame();
    const t = princess(g2, 1, 0);
    hold(g2, 0, 'lightning');
    g2.deploy(0, 0, t.x, t.y);
    const hits: number[] = [];
    run(g2, 1.6, (ev) => ev.forEach((v) => v.type === 'hit' && v.id === t.id && hits.push(v.amount)));
    expect(hits).toEqual([Math.round(1056 * 0.3)]);
  });

  it('火靈小屋：每 5 秒放出 1 隻火精靈，被摧毀時再放 1 隻', () => {
    const g = newGame();
    const [hut] = place(g, 0, 'spirit_hut', 14, 30);
    let spawned = 0;
    run(g, 1 + 5 * 2 + 0.3, (ev) => ev.forEach((v) => v.type === 'spawn' && v.source === 'spawner' && v.unit === 'fire_spirit' && spawned++));
    expect(spawned).toBe(3);
    const n = g.entities.filter((e) => e.alive && e.unit === 'fire_spirit' && e.team === 0).length;
    g.applyDamage(hut, hut.hp);
    expect(g.entities.filter((e) => e.alive && e.unit === 'fire_spirit' && e.team === 0).length).toBe(n + 1);
  });

  it('炸彈砲塔：只打地面（不理會蝙蝠），倒下時留下 3 秒後爆炸的炸彈', () => {
    const g = newGame();
    const [bt] = place(g, 0, 'bomb_turret', 9, 22);
    run(g, 1.2);
    const bats = place(g, 1, 'bats', 9.5, 13.5);
    let aimedAtBat = false;
    let nearest = 99;
    run(g, 4, () => {
      if (bats.some((b) => b.id === bt.targetId)) aimedAtBat = true;
      for (const b of bats) if (b.alive) nearest = Math.min(nearest, Math.hypot(b.x - bt.x, b.y - bt.y));
    });
    expect(nearest).toBeLessThan(6); // 蝙蝠確實飛進射程
    expect(aimedAtBat).toBe(false);
    const g2 = newGame();
    const [bt2] = place(g2, 0, 'bomb_turret', 9, 22);
    run(g2, 1.2);
    const [foe] = place(g2, 1, 'giant', 9.5, 14.5);
    let dropped = false;
    let blasted = -1;
    g2.applyDamage(bt2, bt2.hp);
    run(g2, 3.4, (ev) =>
      ev.forEach((v) => {
        if (v.type === 'bombDrop') dropped = true;
        if (v.type === 'blast' && v.unit === 'bomb_turret') blasted = g2.time;
      }),
    );
    expect(dropped).toBe(true);
    expect(blasted).toBeGreaterThan(2.9);
    expect(foe.alive).toBe(true);
  });

  it('攻城巨人：只打建築，停在約 5 格外用砲轟塔', () => {
    const g = newGame();
    const t = princess(g, 1, 0);
    const [rg] = place(g, 0, 'siege_giant', 3.5, 20.5);
    const hits: number[] = [];
    run(g, 20, (ev) => ev.forEach((v) => v.type === 'hit' && v.id === t.id && v.team === 1 && hits.push(v.amount)));
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.every((h) => h === 307)).toBe(true);
    const edge = Math.max(0, Math.abs(rg.y - t.y) - t.half) - rg.stats.radius;
    expect(edge).toBeGreaterThan(3.5);
    expect(edge).toBeLessThanOrEqual(5.05);
  });
});

describe('v3 第三批：龍捲風、墓地、熔岩飛獸、迫擊砲', () => {
  it('龍捲風：把範圍內的敵方部隊拉向中心並造成兩次傷害；建築不受影響', () => {
    const g = newGame();
    const [kn] = place(g, 1, 'knight', 13.5, 8.5);
    const [cannon] = place(g, 1, 'cannon', 9, 8);
    run(g, 1.1);
    const cx = 9.5;
    const cy = 9.5;
    const d0 = Math.hypot(kn.x - cx, kn.y - cy);
    const cannonPos = [cannon.x, cannon.y];
    const hp0 = kn.hp;
    hold(g, 0, 'tornado');
    expect(g.deploy(0, 0, cx, cy).ok).toBe(true);
    run(g, 1.1);
    const d1 = Math.hypot(kn.x - cx, kn.y - cy);
    expect(d0 - d1).toBeGreaterThan(2);
    expect(hp0 - kn.hp).toBeGreaterThanOrEqual(85 * 2);
    expect([cannon.x, cannon.y]).toEqual(cannonPos);
  });

  it('亡靈墓地：2.2 秒後開始，每 0.5 秒在範圍內冒出一隻骷髏，共 15 隻（不會冒在河上）', () => {
    const g = newGame();
    hold(g, 0, 'graveyard');
    expect(g.deploy(0, 0, 9.5, 12.5).ok).toBe(true);
    const spawns: { x: number; y: number; t: number }[] = [];
    run(g, 10, (ev) => ev.forEach((v) => v.type === 'spawn' && v.team === 0 && v.unit === 'skeleton' && spawns.push({ x: v.x, y: v.y, t: g.time })));
    expect(spawns).toHaveLength(15);
    expect(spawns[0].t).toBeGreaterThan(2.1);
    expect(spawns.every((s) => Math.hypot(s.x - 9.5, s.y - 12.5) <= 4.01)).toBe(true);
    expect(spawns.every((s) => s.y <= ARENA.riverTop - 0.3 || s.y >= ARENA.riverBottom + 0.3)).toBe(true);
  });

  it('熔岩飛獸：只打建築的飛行單位，倒下分裂成 6 隻會打空中與地面的小熔岩獸', () => {
    const g = newGame();
    const [hound] = place(g, 0, 'lava_hound', 9.5, 24.5);
    expect(hound.stats.flying).toBe(true);
    expect(hound.stats.targets).toBe('buildings');
    run(g, 1.1);
    g.applyDamage(hound, hound.hp);
    const pups = g.entities.filter((e) => e.alive && e.unit === 'lava_pup' && e.team === 0);
    expect(pups).toHaveLength(6);
    expect(pups.every((p) => p.stats.flying && p.stats.targets === 'air-ground')).toBe(true);
  });

  it('迫擊砲：射程很遠但打不到最小射程（3.5 格）以內的敵人', () => {
    const g = newGame();
    const [m] = place(g, 0, 'mortar', 9, 24);
    run(g, 3.6); // 部署 3.5 秒
    const near = place(g, 1, 'skeletons', 9.5, 14.5); // 河對岸，離迫擊砲約 8 格
    let shotNear = false;
    run(g, 6, (ev) => ev.forEach((v) => v.type === 'attack' && v.id === m.id && near.some((n) => n.id === v.targetId) && (shotNear = true)));
    expect(shotNear).toBe(true);
    // 貼近迫擊砲的敵人不會被鎖定
    const g2 = newGame();
    const [m2] = place(g2, 0, 'mortar', 9, 24);
    run(g2, 3.6);
    const [close] = place(g2, 1, 'knight', 9.5, 14.5);
    close.x = 9;
    close.y = 21.6; // 邊緣距離不到 3.5 格
    close.deployTimer = 0;
    run(g2, 0.2);
    expect(m2.targetId).not.toBe(close.id);
  });
});

describe('卡池', () => {
  it('至少 30 張卡，每張都有對應單位或法術資料', () => {
    const ids = Object.keys(CARDS);
    expect(ids.length).toBeGreaterThanOrEqual(30);
    for (const id of ids) {
      const c = CARDS[id];
      if (c.kind === 'spell') expect(c.spell, id).toBeDefined();
      else expect(UNITS[c.unit!], id).toBeDefined();
    }
    for (const d of AI_DECKS) {
      expect(d.cards).toHaveLength(8);
      expect(d.cards.every((id) => id in CARDS)).toBe(true);
    }
  });
});

describe('可重現性與電腦對手', () => {
  function playOut(seed: number, steps: number): string {
    const pick = new Rng(seed * 7919);
    const g = new Game({ seed, decks: [[...pick.pick(AI_DECKS).cards], [...pick.pick(AI_DECKS).cards]] });
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
      for (const deck of AI_DECKS) {
        const g = new Game({ seed: 77, decks: [[...DEFAULT_PLAYER_DECK], [...deck.cards]] });
        const ai = new AiController(g, 1, g.rng.fork(), AI_LEVELS[level]);
        let deploys = 0;
        for (let i = 0; i < 400 / DT && g.phase !== 'ended'; i++) {
          ai.update();
          for (const ev of g.drainEvents()) {
            if (ev.type === 'deploy' && ev.team === 1) {
              deploys++;
              // 部隊只在己方半場；側塔倒下後，該路才可放進前進區；會鑽地的部隊可放任何地方（河道除外）
              const tunnel = !!CARDS[ev.cardId].unit && !!UNITS[CARDS[ev.cardId].unit!].stats.tunnelSpeed;
              if (tunnel) expect(ev.y > ARENA.riverTop && ev.y < ARENA.riverBottom).toBe(false);
              else if (CARDS[ev.cardId].kind !== 'spell' && ev.y >= ARENA.riverTop) {
                expect(princess(g, 0, ev.x < ARENA.width / 2 ? 0 : 1).alive, `${level} ${deck.name} pocket`).toBe(false);
                expect(ev.y).toBeLessThanOrEqual(ARENA.height - DEPLOY.pocketMinY);
              }
            }
          }
          g.step();
          expect(g.players[1].elixir).toBeGreaterThanOrEqual(0);
          expect(g.players[1].elixir).toBeLessThanOrEqual(MATCH.maxElixir);
          g.drainEvents();
        }
        expect(g.phase, `${level} ${deck.name}`).toBe('ended');
        expect(deploys, `${level} ${deck.name}`).toBeGreaterThanOrEqual(3);
        // 玩家完全不出牌時，電腦應該能拿下至少一座塔
        expect(g.players[1].crowns, `${level} ${deck.name}`).toBeGreaterThanOrEqual(1);
      }
    }
  });
});
