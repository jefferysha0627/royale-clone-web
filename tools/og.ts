// 開發用：以遊戲本身的 3D 渲染器與卡圖產生分享預覽圖（不進入正式 build）。
import { Renderer3D } from '../src/render3d/renderer3d';
import { portraits } from '../src/render3d/portraits';
import { AI_DECKS, AI_LEVELS, AiController, Game } from '../src/sim';
import { fillCard } from '../src/ui/cardview';

const W = 330;
const H = 582;
const renderer = new Renderer3D(document.getElementById('arena') as HTMLCanvasElement, document.getElementById('arena-ui') as HTMLCanvasElement);
renderer.resize(W, H);

// 固定 seed 的電腦對電腦：先找雙方部隊最多的時間點，再用同一個 seed 重播到該處畫出來
function setup() {
  const game = new Game({ seed: 2026, decks: [[...AI_DECKS[0].cards], [...AI_DECKS[3].cards]] });
  const ais = [new AiController(game, 0, game.rng.fork(), AI_LEVELS.hard), new AiController(game, 1, game.rng.fork(), AI_LEVELS.hard)];
  return { game, tick: () => { for (const a of ais) a.update(); game.step(); return game.drainEvents(); } };
}
const scan = setup();
let best = 0;
let bestScore = -1;
for (let i = 0; i < 150 * 30 && scan.game.phase !== 'ended'; i++) {
  scan.tick();
  const troops = scan.game.entities.filter((e) => e.alive && e.kind === 'troop');
  const score = Math.min(troops.filter((e) => e.team === 0).length, troops.filter((e) => e.team === 1).length) * 10 + troops.length;
  if (score > bestScore) {
    bestScore = score;
    best = i;
  }
}
const run = setup();
for (let i = 0; i <= best; i++) {
  const ev = run.tick();
  renderer.pushEvents(ev, run.game);
  // 最後一段像實際遊玩一樣逐幀畫，讓特效與動畫成形
  if (i >= best - 40) renderer.render(run.game, 1, 1 / 30);
}

const ids = ['giant', 'wizard', 'baby_dragon', 'fireball', 'golem'];
portraits.start(ids);
portraits.onUpdate(() => {
  if (!ids.every((id) => portraits.get(id))) return;
  const cards = document.getElementById('cards')!;
  if (cards.childElementCount) return;
  for (const id of ids) {
    const el = document.createElement('div');
    el.className = 'card';
    fillCard(el, id);
    cards.appendChild(el);
  }
  setTimeout(() => {
    renderer.render(run.game, 1, 1 / 30);
    (window as unknown as { __ogReady: boolean }).__ogReady = true;
  }, 100);
});

// apple-touch-icon：把 favicon 畫成 180×180 PNG 資料
const img = document.getElementById('icon') as HTMLImageElement;
img.src = '/favicon.svg';
