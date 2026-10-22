// 無畫面的電腦對電腦批次模擬：檢查穩定性與大致平衡。
// 用法：npm run sim -- [場數] [起始 seed] [難度 0] [難度 1]
import { AI_DECKS, AI_LEVELS, AiController, Game, Rng, type AiLevel } from '../src/sim';

const games = Number(process.argv[2] ?? 30);
const seed0 = Number(process.argv[3] ?? 1);
const lv0 = (process.argv[4] ?? 'normal') as AiLevel;
const lv1 = (process.argv[5] ?? 'normal') as AiLevel;
const quiet = process.argv.includes('--quiet');
const tally = { 0: 0, 1: 0, draw: 0 } as Record<string, number>;
const reasons: Record<string, number> = {};
const deckWins: Record<string, [number, number]> = {};
let maxEntities = 0;
let totalTime = 0;
let totalCrowns = 0;
let totalPlayed = 0;
for (let i = 0; i < games; i++) {
  const seed = seed0 + i;
  const pick = new Rng(seed * 7919);
  const d0 = pick.pick(AI_DECKS);
  const d1 = pick.pick(AI_DECKS);
  const g = new Game({ seed, decks: [[...d0.cards], [...d1.cards]] });
  const ais = [new AiController(g, 0, g.rng.fork(), AI_LEVELS[lv0]), new AiController(g, 1, g.rng.fork(), AI_LEVELS[lv1])];
  let steps = 0;
  while (g.phase !== 'ended' && steps < 30 * 600) {
    for (const ai of ais) ai.update();
    g.step();
    g.drainEvents();
    steps++;
    maxEntities = Math.max(maxEntities, g.entities.length);
    for (const p of g.players) if (p.elixir < 0) throw new Error('negative elixir');
    for (const e of g.entities) if (!Number.isFinite(e.x) || !Number.isFinite(e.y)) throw new Error(`NaN position ${e.unit}`);
  }
  const r = g.result!;
  tally[r.winner === null ? 'draw' : String(r.winner)]++;
  reasons[r.reason] = (reasons[r.reason] ?? 0) + 1;
  totalTime += r.time;
  totalCrowns += r.crowns[0] + r.crowns[1];
  totalPlayed += g.players[0].cardsPlayed + g.players[1].cardsPlayed;
  for (const [d, t] of [[d0, 0], [d1, 1]] as const) {
    const rec = (deckWins[d.name] ??= [0, 0]);
    rec[1]++;
    if (r.winner === t) rec[0]++;
  }
  if (!quiet) {
    console.log(`seed ${seed}: ${d0.name} vs ${d1.name} winner=${r.winner} crowns=${r.crowns.join('-')} reason=${r.reason} t=${r.time.toFixed(1)}s played=${g.players.map((p) => p.cardsPlayed).join('/')} leaked=${g.players.map((p) => p.elixirLeaked.toFixed(1)).join('/')}`);
  }
}
console.log({ tally, reasons, avgTime: (totalTime / games).toFixed(1), avgCrowns: (totalCrowns / games).toFixed(2), avgPlayed: (totalPlayed / games / 2).toFixed(1), maxEntities });
console.log('deck win rate', Object.fromEntries(Object.entries(deckWins).map(([k, [w, n]]) => [k, `${w}/${n}`])));
