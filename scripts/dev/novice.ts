// 開發用：用「新手玩家」腳本（同 e2e 的觸控測試機器人：敵人過河就在被攻擊那路的塔前放部隊，能量 ≥ 7 才進攻）
// 對三種難度各打 n 場，估計一般玩家對各難度的勝率。用法：npx vite-node scripts/dev/novice.ts [n]
import { AI_DECKS, AI_LEVELS, AiController, CARDS, DEFAULT_PLAYER_DECK, Game, Rng, type AiLevel } from '../../src/sim';

const n = Number(process.argv[2] ?? 20);
// --easy=k:v,...／--normal=…／--hard=…：覆寫該難度的 AiOptions（調參用）
for (const a of process.argv.slice(3)) {
  const m = /^--(easy|normal|hard)=(.*)$/.exec(a);
  if (!m) continue;
  const o = AI_LEVELS[m[1] as AiLevel] as unknown as Record<string, number | boolean>;
  for (const kv of m[2].split(',')) {
    const [k, v] = kv.split(':');
    o[k] = v === 'true' ? true : v === 'false' ? false : Number(v);
  }
}
const SPELLS = ['fireball', 'arrows', 'zap', 'rocket', 'log', 'poison', 'goblin_barrel'];

function novice(g: Game) {
  let timer = 0;
  let lane = 0;
  return () => {
    timer -= 1 / 30;
    if (timer > 0) return;
    timer = 0.6;
    const p = g.players[0];
    const hand = p.hand.map((id, i) => ({ id, i })).filter((h): h is { id: string; i: number } => !!h.id);
    const threat = g.entities.filter((e) => e.team === 1 && e.kind !== 'tower' && e.alive && e.y > 15.5);
    // 一般玩家會把傷害法術丟在過河的敵人堆上（至少 3 個單位擠在一起時）
    const spell = hand.find((h) => ['fireball', 'arrows', 'zap', 'log', 'poison'].includes(h.id) && CARDS[h.id].cost <= p.elixir);
    if (spell && threat.length >= 3) {
      const c = threat.find((e) => threat.filter((o) => Math.hypot(o.x - e.x, o.y - e.y) < 2.5).length >= 3);
      if (c) {
        g.deploy(0, spell.i, c.x, c.y + (spell.id === 'log' ? 3 : 0));
        return;
      }
    }
    if (threat.length && p.elixir >= 3) {
      const tx = threat.reduce((s, e) => s + e.x, 0) / threat.length < 9 ? 3.5 : 14.5;
      const cands = hand.filter((h) => !SPELLS.includes(h.id) && CARDS[h.id].cost <= p.elixir).sort((a, b) => Math.abs(CARDS[a.id].cost - 4) - Math.abs(CARDS[b.id].cost - 4));
      if (cands.length) {
        const h = cands[0];
        const [x, y] = ['cannon', 'inferno', 'tombstone'].includes(h.id) ? [tx < 9 ? 6 : 12, 22] : [tx + (tx < 9 ? 1 : -1), 22.5];
        g.deploy(0, h.i, x, y);
        return;
      }
    }
    if (p.elixir >= 7) {
      const best = hand.filter((h) => CARDS[h.id].cost <= p.elixir).sort((a, b) => CARDS[b.id].cost - CARDS[a.id].cost)[0];
      if (!best) return;
      const x = lane === 0 ? 3.5 : 14.5;
      const id = best.id;
      const [tx, ty] = SPELLS.includes(id) ? (id === 'log' ? [x, 18.5] : [x, 7.5]) : ['cannon', 'inferno', 'tombstone'].includes(id) ? [9, 21] : ['golem', 'giant'].includes(id) ? [x, 30.5] : [x + (lane === 0 ? 1 : -1), 19.5];
      if (g.deploy(0, best.i, tx, ty).ok) lane = 1 - lane;
    }
  };
}

const only = process.argv.find((a) => a.startsWith('--only='))?.slice(7);
for (const lv of (only ? only.split(',') : ['easy', 'normal', 'hard']) as AiLevel[]) {
  let wins = 0;
  let losses = 0;
  let crownsFor = 0;
  let crownsAgainst = 0;
  for (let s = 0; s < n; s++) {
    const seed = 900 + s;
    const deck = new Rng(seed * 31).pick(AI_DECKS);
    const g = new Game({ seed, decks: [[...DEFAULT_PLAYER_DECK], [...deck.cards]] });
    const ai = new AiController(g, 1, g.rng.fork(), AI_LEVELS[lv]);
    const bot = novice(g);
    for (let i = 0; i < 30 * 600 && g.phase !== 'ended'; i++) {
      bot();
      ai.update();
      g.step();
      g.drainEvents();
    }
    const r = g.result!;
    if (r.winner === 0) wins++;
    else if (r.winner === 1) losses++;
    crownsFor += r.crowns[0];
    crownsAgainst += r.crowns[1];
  }
  console.log(`${lv}: 新手腳本 勝 ${wins}／負 ${losses}／${n} 場，平均皇冠 ${(crownsFor / n).toFixed(2)} : ${(crownsAgainst / n).toFixed(2)}`);
}
