// 無畫面的電腦對電腦批次模擬：檢查穩定性、難度強弱與大致平衡。
// 用法：npm run sim -- [場數] [起始 seed] [難度 0] [難度 1] [--quiet] [--swap] [--deck=牌組名]
//   --swap：每個 seed 打兩場，同一組對局（難度＋牌組）交換座位，抵銷座位的影響
//   --deck=名稱：雙方固定使用這副電腦牌組（鏡像對戰）；--deck=甲/乙：難度 0 用甲、難度 1 用乙
//   --log：印出電腦每次出牌的理由與塔被推倒的時間（建議只跑 1 場）
//   --a=鍵:值,鍵:值／--b=…：覆寫難度 0／難度 1 的 AiOptions（調參實驗用，例如 --a=skill:0.8,noise:0.5）
import { AI_DECKS, AI_LEVELS, AiController, Game, Rng, type AiLevel, type AiOptions } from '../src/sim';

const args = process.argv.slice(2);
const pos = args.filter((a) => !a.startsWith('--'));
const flag = (name: string) => args.find((a) => a === `--${name}` || a.startsWith(`--${name}=`));
const games = Number(pos[0] ?? 30);
const seed0 = Number(pos[1] ?? 1);
const lv0 = (pos[2] ?? 'normal') as AiLevel;
const lv1 = (pos[3] ?? 'normal') as AiLevel;
const quiet = !!flag('quiet');
const swap = !!flag('swap');
const fixedDeck = flag('deck')?.split('=')[1];
const log = !!flag('log');
const override = (name: string, base: AiOptions): AiOptions => {
  const spec = flag(name)?.split('=')[1];
  if (!spec) return base;
  const out = { ...base } as Record<string, number | boolean>;
  for (const kv of spec.split(',')) {
    const [k, v] = kv.split(':');
    if (!(k in out)) throw new Error(`unknown option ${k}`);
    out[k] = v === 'true' ? true : v === 'false' ? false : Number(v);
  }
  return out as unknown as AiOptions;
};
const optsOf: Record<string, AiOptions> = { [lv0]: override('a', AI_LEVELS[lv0]) };
optsOf[lv1] = lv1 === lv0 ? optsOf[lv0] : override('b', AI_LEVELS[lv1]);
for (const lv of [lv0, lv1]) if (!(lv in AI_LEVELS)) throw new Error(`unknown level ${lv}`);

interface Side {
  games: number;
  wins: number;
  crowns: number;
  played: number;
  leaked: number;
  spent: number;
  dealt: number; // 對對方塔造成的總傷害（倒塔以滿血計）
}
const side = (): Side => ({ games: 0, wins: 0, crowns: 0, played: 0, leaked: 0, spent: 0, dealt: 0 });
// 依難度（相同難度時依座位）統計
const label = (lv: AiLevel, seat: number) => (lv0 === lv1 ? `${lv}#${seat}` : lv);
const stats: Record<string, Side> = {};
const reasons: Record<string, number> = {};
const deckWins: Record<string, [number, number]> = {};
let draws = 0;
let regCrowns = 0; // 一般時間結束時的皇冠數
let regDecided = 0; // 一般時間內就有塔倒下的場數
const lowBuckets = [0, 0, 0, 0]; // 判定／延長賽結束時，雙方最低血量塔的分布（<800、<1600、<2400、其餘）
let maxEntities = 0;
let totalTime = 0;
let totalCrowns = 0;
let totalSteps = 0;
const t0 = performance.now();

for (let i = 0; i < games; i++) {
  const seed = swap ? seed0 + Math.floor(i / 2) : seed0 + i;
  const flip = swap && i % 2 === 1;
  const levels: [AiLevel, AiLevel] = flip ? [lv1, lv0] : [lv0, lv1];
  const pick = new Rng(seed * 7919);
  const fixed = fixedDeck?.split('/').map((name) => AI_DECKS.find((d) => d.name === name) ?? (() => { throw new Error(`unknown deck ${name}`); })());
  const a = fixed ? fixed[0] : pick.pick(AI_DECKS);
  const b = fixed ? (fixed[1] ?? fixed[0]) : pick.pick(AI_DECKS);
  const [d0, d1] = flip ? [b, a] : [a, b];
  const g = new Game({ seed, decks: [[...d0.cards], [...d1.cards]] });
  const ais = [new AiController(g, 0, g.rng.fork(), optsOf[levels[0]]), new AiController(g, 1, g.rng.fork(), optsOf[levels[1]])];
  if (log) {
    ais.forEach((ai, t) => {
      ai.trace = (msg) => console.log(`${g.time.toFixed(1).padStart(6)} T${t} ${levels[t]}: ${msg}`);
    });
  }
  let steps = 0;
  let lowAtOvertimeEnd: number[] = [];
  let regCounted = false;
  while (g.phase !== 'ended' && steps < 30 * 600) {
    if (!regCounted && g.phase === 'regular' && g.timeLeft <= 1.5 * (1 / 30)) {
      regCounted = true;
      const c = g.players[0].crowns + g.players[1].crowns;
      regCrowns += c;
      if (c > 0) regDecided++;
    }
    if (g.phase === 'overtime') lowAtOvertimeEnd = ([0, 1] as const).map((t) => Math.min(...g.towers(t).filter((x) => x.alive).map((x) => x.hp)));
    for (const ai of ais) ai.update();
    g.step();
    const ev = g.drainEvents();
    if (log) {
      for (const v of ev) {
        if (v.type === 'towerDown') console.log(`${g.time.toFixed(1).padStart(6)} ** T${v.team} ${v.isKing ? 'king' : 'princess'} down`);
        if (v.type === 'phase' || v.type === 'elixirRate') console.log(`${g.time.toFixed(1).padStart(6)} -- ${JSON.stringify(v)}`);
      }
      if (steps % 450 === 0) {
        const hp = (t: 0 | 1) => g.towers(t).map((x) => Math.round(x.hp)).join('/');
        console.log(`${g.time.toFixed(1).padStart(6)} -- towers T0 ${hp(0)}  T1 ${hp(1)}`);
      }
    }
    steps++;
    maxEntities = Math.max(maxEntities, g.entities.length);
    for (const p of g.players) if (p.elixir < 0) throw new Error('negative elixir');
    for (const e of g.entities) if (!Number.isFinite(e.x) || !Number.isFinite(e.y)) throw new Error(`NaN position ${e.unit}`);
  }
  totalSteps += steps;
  const r = g.result!;
  if (r.winner === null) draws++;
  if (r.reason === 'tiebreak' || r.reason === 'draw') {
    // 判定前塔已同步扣血，改用延長賽結束前的紀錄
    for (const v of lowAtOvertimeEnd) lowBuckets[v < 800 ? 0 : v < 1600 ? 1 : v < 2400 ? 2 : 3]++;
  }
  reasons[r.reason] = (reasons[r.reason] ?? 0) + 1;
  totalTime += r.time;
  totalCrowns += r.crowns[0] + r.crowns[1];
  for (const seat of [0, 1] as const) {
    const s = (stats[label(levels[seat], seat)] ??= side());
    const p = g.players[seat];
    s.games++;
    if (r.winner === seat) s.wins++;
    s.crowns += r.crowns[seat];
    s.played += p.cardsPlayed;
    s.leaked += p.elixirLeaked;
    s.spent += p.elixirSpent;
    s.dealt += g.towers(seat === 0 ? 1 : 0).reduce((sum, t) => sum + (t.maxHp - Math.max(0, t.hp)), 0);
  }
  // 牌組勝率只在同難度時有意義
  if (lv0 === lv1) {
    for (const [d, t] of [[d0, 0], [d1, 1]] as const) {
      if (d0.name === d1.name) continue; // 鏡像對戰不計入
      const rec = (deckWins[d.name] ??= [0, 0]);
      rec[1]++;
      if (r.winner === t) rec[0]++;
    }
  }
  if (!quiet) {
    console.log(
      `seed ${seed}: ${levels[0]}/${d0.name} vs ${levels[1]}/${d1.name} winner=${r.winner} crowns=${r.crowns.join('-')} reason=${r.reason} t=${r.time.toFixed(1)}s ` +
        `played=${g.players.map((p) => p.cardsPlayed).join('/')} leaked=${g.players.map((p) => p.elixirLeaked.toFixed(1)).join('/')}`,
    );
  }
}

const ms = performance.now() - t0;
const pct = (n: number, d: number) => `${((100 * n) / Math.max(1, d)).toFixed(0)}%`;
console.log(`${games} 場  ${lv0} vs ${lv1}${swap ? '（交換座位）' : ''}${fixedDeck ? `  牌組：${fixedDeck}` : ''}`);
console.log(
  `結束原因：${Object.entries(reasons).map(([k, v]) => `${k} ${v} (${pct(v, games)})`).join('、')}；平手 ${draws}`,
);
console.log(`一般時間結束時：平均皇冠 ${(regCrowns / games).toFixed(2)}（未計提早以國王塔結束的場）、有塔倒下的場 ${pct(regDecided, games)}`);
if (lowBuckets.some((n) => n > 0)) console.log(`判定局雙方最低塔血：<800 ${lowBuckets[0]}、<1600 ${lowBuckets[1]}、<2400 ${lowBuckets[2]}、≥2400 ${lowBuckets[3]}`);
console.log(`平均時間 ${(totalTime / games).toFixed(1)} 秒、平均皇冠 ${(totalCrowns / games).toFixed(2)} 頂／場、最多實體 ${maxEntities}`);
for (const [k, s] of Object.entries(stats)) {
  console.log(
    `  ${k.padEnd(9)} 勝 ${s.wins}/${s.games} (${pct(s.wins, s.games)})  皇冠 ${(s.crowns / s.games).toFixed(2)}  出牌 ${(s.played / s.games).toFixed(1)}  ` +
      `花費 ${(s.spent / s.games).toFixed(1)}  溢出 ${(s.leaked / s.games).toFixed(1)}  塔傷 ${Math.round(s.dealt / s.games)}`,
  );
}
if (Object.keys(deckWins).length) {
  console.log(`牌組勝率：${Object.entries(deckWins).map(([k, [w, n]]) => `${k} ${w}/${n} (${pct(w, n)})`).join('、')}`);
}
console.log(`耗時 ${(ms / 1000).toFixed(1)} 秒（每場 ${(ms / games).toFixed(0)} ms、每步 ${((ms * 1000) / Math.max(1, totalSteps)).toFixed(1)} µs）`);
