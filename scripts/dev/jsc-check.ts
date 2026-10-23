// 開發用：跨 JS 引擎的重播一致性檢查。在 Node（V8）錄幾場電腦對戰，再用 macOS 內建的 JavaScriptCore（Safari 的引擎）重播，比對最後狀態。
// npx vite-node scripts/dev/jsc-check.ts [場數]
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import { AI_DECKS, AI_LEVELS, AiController, DEFAULT_PLAYER_DECK, Game, Rng, runReplay, type Replay } from '../../src/sim';

const JSC = '/System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc';
const n = Number(process.argv[2] ?? 4);
const root = fileURLToPath(new URL('../..', import.meta.url));
const out = mkdtempSync(join(tmpdir(), 'jsc-check-'));
await build({
  root,
  configFile: false,
  logLevel: 'error',
  build: { outDir: out, emptyOutDir: true, minify: false, lib: { entry: join(root, 'scripts/dev/jsc/entry.ts'), formats: ['iife'], name: 'R', fileName: () => 'bundle.js' } },
});
const bundle = readFileSync(join(out, readdirSync(out).find((f) => f.endsWith('.js'))!), 'utf8');

const cases: { rep: Replay; hash: string }[] = [];
for (let i = 0; i < n; i++) {
  const seed = 100 + i * 17;
  const d = AI_DECKS[i % AI_DECKS.length];
  const g = new Game({ seed, decks: [[...DEFAULT_PLAYER_DECK], [...d.cards]] });
  const enemy = new AiController(g, 1, g.rng.fork(), AI_LEVELS.normal);
  const player = new AiController(g, 0, new Rng(seed ^ 0x77), AI_LEVELS.hard);
  for (let s = 0; s < 30 * 600 && g.phase !== 'ended'; s++) {
    player.update();
    enemy.update();
    g.step();
    g.drainEvents();
  }
  const rep: Replay = { seed, decks: [[...DEFAULT_PLAYER_DECK], [...d.cards]], actions: g.actions, foe: d.name, lvl: 'normal', arena: 0 };
  const v8 = runReplay(rep);
  if (v8.stateHash() !== g.stateHash()) throw new Error('V8 replay mismatch');
  cases.push({ rep, hash: `${v8.stateHash()}|${JSON.stringify(v8.result)}` });
}
const script = `${bundle}\n${cases.map((c) => `print(runIt(${JSON.stringify(JSON.stringify(c.rep))}));`).join('\n')}\n`;
const file = join(out, 'run.js');
writeFileSync(file, script);
const lines = execFileSync(JSC, [file], { maxBuffer: 1 << 26 }).toString().trim().split('\n');
let same = 0;
cases.forEach((c, i) => {
  const ok = lines[i] === c.hash;
  if (ok) same++;
  const r = JSON.parse(c.hash.split('|')[1]);
  console.log(`${i + 1}. ${c.rep.foe}：${c.rep.actions.length} 次出牌、${r.crowns.join(':')}（${r.reason}）→ ${ok ? 'JavaScriptCore 與 V8 完全一致' : '不一致'}`);
});
console.log(`${same}/${cases.length} 一致`);
