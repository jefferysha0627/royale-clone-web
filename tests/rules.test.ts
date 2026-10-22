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
              // 部隊只在己方半場；側塔倒下後，該路才可放進前進區
              if (CARDS[ev.cardId].kind !== 'spell' && ev.y >= ARENA.riverTop) {
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
