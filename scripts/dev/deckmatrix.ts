// 牌組對戰矩陣：每一對電腦牌組各打 n 個 seed × 兩個座位（同難度），印出列牌組對行牌組的勝率。
// 用法：npx vite-node scripts/dev/deckmatrix.ts [n] [難度] [--a=鍵:值,...] [--set=牌組名:卡,卡,...（可重複，用來試改牌組）] [--only=牌組名（只打含這副牌組的對局）]
import { AI_DECKS, AI_LEVELS, AiController, Game, type AiLevel, type AiOptions } from '../../src/sim';

const args = process.argv.slice(2);
const pos = args.filter((a) => !a.startsWith('--'));
const n = Number(pos[0] ?? 10);
const lv = (pos[1] ?? 'normal') as AiLevel;
const spec = args.find((a) => a.startsWith('--a='))?.slice(4);
const opts = { ...AI_LEVELS[lv] } as Record<string, number | boolean>;
if (spec) for (const kv of spec.split(',')) { const [k, v] = kv.split(':'); opts[k] = v === 'true' ? true : v === 'false' ? false : Number(v); }

for (const a of args.filter((x) => x.startsWith('--set='))) {
  const [name, list] = a.slice(6).split(':');
  const cards = list.split(',');
  if (cards.length !== 8) throw new Error(`${name}: need 8 cards`);
  const d = AI_DECKS.find((x) => x.name === name);
  if (d) d.cards = cards;
  else AI_DECKS.push({ name, cards });
}
const names = AI_DECKS.map((d) => d.name);
const only = args.find((x) => x.startsWith('--only='))?.slice(7);
const win: number[][] = names.map(() => names.map(() => 0));
const cnt: number[][] = names.map(() => names.map(() => 0));
let crowns = 0, games = 0, ot = 0, tb = 0;
for (let i = 0; i < names.length; i++)
  for (let j = i + 1; j < names.length; j++)
    for (let s = 0; s < (only && names[i] !== only && names[j] !== only ? 0 : n); s++)
      for (const flip of [false, true]) {
        const [a, b] = flip ? [j, i] : [i, j];
        const g = new Game({ seed: 1000 + s * 31 + i * 7 + j, decks: [[...AI_DECKS[a].cards], [...AI_DECKS[b].cards]] });
        const ais = [new AiController(g, 0, g.rng.fork(), opts as unknown as AiOptions), new AiController(g, 1, g.rng.fork(), opts as unknown as AiOptions)];
        let steps = 0;
        while (g.phase !== 'ended' && steps++ < 30 * 600) { for (const ai of ais) ai.update(); g.step(); g.drainEvents(); }
        const r = g.result!;
        games++; crowns += r.crowns[0] + r.crowns[1];
        if (r.reason === 'overtime') ot++;
        if (r.reason === 'tiebreak' || r.reason === 'draw') tb++;
        cnt[a][b]++; cnt[b][a]++;
        if (r.winner === 0) win[a][b]++;
        else if (r.winner === 1) win[b][a]++;
      }
const pad = (s: string, w: number) => s + ' '.repeat(Math.max(0, w - [...s].length * 2));
console.log(`${games} 場（${lv}）平均皇冠 ${(crowns / games).toFixed(2)}、延長賽 ${((100 * ot) / games).toFixed(0)}%、判定 ${((100 * tb) / games).toFixed(0)}%`);
console.log(pad('', 10) + names.map((x) => pad(x.slice(0, 2), 6)).join('') + '  合計');
for (let i = 0; i < names.length; i++) {
  let w = 0, c = 0;
  const row = names.map((_, j) => { if (i === j) return pad('  -', 6); w += win[i][j]; c += cnt[i][j]; return pad(`${Math.round((100 * win[i][j]) / Math.max(1, cnt[i][j]))}%`.padStart(4), 6); });
  console.log(pad(names[i], 10) + row.join('') + `  ${Math.round((100 * w) / Math.max(1, c))}%`);
}
