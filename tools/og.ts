// 開發用：以遊戲本身的渲染器產生分享預覽圖畫面（不進入正式 build）。
import { Renderer2D } from '../src/render/renderer2d';
import { AI_DECKS, AI_LEVELS, AiController, Game } from '../src/sim';
import { fillCard } from '../src/ui/cardview';

const canvas = document.getElementById('arena') as HTMLCanvasElement;
const renderer = new Renderer2D(canvas);
renderer.resize(320, 570);

// 固定 seed 的電腦對電腦：先找雙方部隊最多的時間點，再用同一個 seed 重播到該處畫出來
function setup() {
  const game = new Game({ seed: 2026, decks: [[...AI_DECKS[2].cards], [...AI_DECKS[1].cards]] });
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
  // 只保留最後幾步的特效，並像實際遊玩一樣逐幀老化
  if (i >= best - 6) {
    renderer.pushEvents(ev, run.game);
    renderer.render(run.game, 1, 1 / 30);
  }
}

const cards = document.getElementById('cards')!;
for (const id of ['knight', 'baby_dragon', 'fireball', 'golem']) {
  const el = document.createElement('div');
  el.className = 'card';
  fillCard(el, id);
  cards.appendChild(el);
}

// apple-touch-icon：把 favicon 畫成 180×180 PNG 資料
const img = document.getElementById('icon') as HTMLImageElement;
img.src = '/favicon.svg';

(window as unknown as { __ogReady: boolean }).__ogReady = true;
