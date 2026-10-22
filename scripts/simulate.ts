// 無畫面的電腦對電腦批次模擬：檢查穩定性與大致平衡。用法：npm run sim -- [場數] [起始 seed]
import { AI_DECKS, AiController, Game, Rng } from '../src/sim';

const games = Number(process.argv[2] ?? 30);
const seed0 = Number(process.argv[3] ?? 1);
const tally = { 0: 0, 1: 0, draw: 0 } as Record<string, number>;
const reasons: Record<string, number> = {};
let maxEntities = 0;
let totalTime = 0;
for (let i = 0; i < games; i++) {
  const seed = seed0 + i;
  const pick = new Rng(seed * 7919);
  const g = new Game({ seed, decks: [pick.pick(AI_DECKS), pick.pick(AI_DECKS)] });
  const ais = [new AiController(g, 0, g.rng.fork()), new AiController(g, 1, g.rng.fork())];
  let steps = 0;
  while (g.phase !== 'ended' && steps < 30 * 600) {
    for (const ai of ais) ai.update();
    g.step();
    g.drainEvents();
    steps++;
    maxEntities = Math.max(maxEntities, g.entities.length);
    for (const p of g.players) if (p.elixir < 0) throw new Error('negative elixir');
  }
  const r = g.result!;
  tally[r.winner === null ? 'draw' : String(r.winner)]++;
  reasons[r.reason] = (reasons[r.reason] ?? 0) + 1;
  totalTime += r.time;
  console.log(`seed ${seed}: winner=${r.winner} crowns=${r.crowns.join('-')} reason=${r.reason} t=${r.time.toFixed(1)}s played=${g.players.map((p) => p.cardsPlayed).join('/')}`);
}
console.log({ tally, reasons, avgTime: (totalTime / games).toFixed(1), maxEntities });
