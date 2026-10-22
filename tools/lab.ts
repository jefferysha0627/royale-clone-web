// 開發用情境實驗室：?s=情境&x=..&y=..&zoom=..&t=秒（先快轉）。只用 Game API 擺陣，畫面用正式的 3D 渲染器。
import { DT, Game, type Team } from '../src/sim';
import { Renderer3D } from '../src/render3d/renderer3d';

const P = new URLSearchParams(location.search);
const scenario = P.get('s') ?? 'melee';
const zoom = Number(P.get('zoom') ?? 2.2);
const skip = Number(P.get('t') ?? 0);
const deck = ['knight', 'archers', 'giant', 'goblins', 'fireball', 'zap', 'musketeer', 'cannon'];
const game = new Game({ seed: 1, decks: [[...deck], [...deck]] });

function put(team: Team, card: string, x: number, y: number): void {
  const p = game.players[team];
  p.hand[0] = card;
  p.elixir = 10;
  const r = game.deploy(team, 0, x, y);
  if (!r.ok) console.warn('deploy failed', card, x, y, r);
}

const S: Record<string, { at: [number, number]; setup: () => void }> = {
  melee: { at: [9, 17], setup: () => { put(0, 'knight', 8.5, 19.5); put(0, 'axe_dwarf', 10.5, 19.5); put(1, 'goblins', 9.5, 13.5); put(1, 'barbarians', 9.5, 11.5); } },
  ranged: { at: [9, 16], setup: () => { put(0, 'archers', 8.5, 20.5); put(0, 'musketeer', 10.5, 21.5); put(0, 'wizard', 9.5, 22.5); put(1, 'skeleton_army', 9.5, 12.5); put(1, 'gargoyles', 7.5, 12.5); } },
  tank: { at: [3.5, 9], setup: () => { put(0, 'giant', 3.5, 17.5); put(0, 'wizard', 3.5, 20.5); } },
  golem: { at: [14.5, 9], setup: () => { put(0, 'golem', 14.5, 17.5); put(0, 'baby_dragon', 14.5, 20.5); } },
  spells: { at: [9, 9], setup: () => { put(1, 'barbarians', 9.5, 9.5); setTimeout(() => put(0, 'fireball', 9.5, 9.5), 1500); setTimeout(() => put(0, 'zap', 9.5, 10.5), 3200); setTimeout(() => put(0, 'arrows', 9.5, 10.5), 4500); } },
  rocket: { at: [3.5, 7], setup: () => { setTimeout(() => put(0, 'rocket', 3.5, 6.5), 500); setTimeout(() => put(0, 'poison', 3.5, 6.5), 3000); } },
  log: { at: [9, 14], setup: () => { put(1, 'skeleton_army', 9.5, 12.5); setTimeout(() => put(0, 'log', 9.5, 17.5), 1600); } },
  barrel: { at: [3.5, 8], setup: () => { setTimeout(() => put(0, 'goblin_barrel', 3.5, 8.5), 400); } },
  gs: { at: [3.5, 10], setup: () => { put(0, 'giant_skeleton', 3.5, 17.5); put(1, 'knight', 3.5, 12.5); put(1, 'musketeer', 4.5, 10.5); } },
  air: { at: [14.5, 10], setup: () => { put(0, 'bomb_blimp', 14.5, 18.5); put(0, 'bats', 12.5, 19.5); put(1, 'inferno', 13, 10); } },
  riders: { at: [9, 15], setup: () => { put(0, 'wolf_rider', 3.5, 18.5); put(0, 'lancer', 13.5, 21.5); put(1, 'cannon', 9, 10); } },
  spawners: { at: [9, 20], setup: () => { put(0, 'witch', 9.5, 21.5); put(0, 'tombstone', 12, 22); put(0, 'ice_spirit', 6.5, 18.5); put(0, 'fire_spirit', 7.5, 18.5); put(1, 'knight', 6.5, 13.5); put(1, 'goblins', 9.5, 13.5); } },
  towers: { at: [9, 16], setup: () => { put(0, 'iron_swordsman', 3.5, 17.5); put(0, 'bomber', 14.5, 18.5); put(0, 'spear_goblins', 14.5, 20.5); } },
};
const sc = S[scenario] ?? S.melee;

const wrap = document.getElementById('wrap')!;
const r = new Renderer3D(document.getElementById('c') as HTMLCanvasElement, document.getElementById('ui') as HTMLCanvasElement);
r.resize(wrap.clientWidth, wrap.clientHeight);
r.debugView(sc.at[0], sc.at[1], zoom);
sc.setup();
for (let i = 0; i < skip / DT; i++) {
  game.step();
  r.pushEvents(game.drainEvents(), game);
}
const log = document.getElementById('log')!;
let last = performance.now();
let acc = 0;
const seen: string[] = [];
function frame(now: number): void {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  if (r.hitStop <= 0) acc += dt;
  while (acc >= DT) {
    game.step();
    const ev = game.drainEvents();
    for (const e of ev) if (!['hit', 'attack'].includes(e.type)) seen.push(e.type);
    r.pushEvents(ev, game);
    acc -= DT;
  }
  r.render(game, Math.min(1, acc / DT), dt);
  log.textContent = `${scenario}  t=${game.time.toFixed(1)}  ents=${game.entities.length}  fx=${r.effectCount}\n${seen.slice(-6).join(' ')}`;
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
(window as unknown as { __ready: boolean; __r: Renderer3D; __g: Game }).__ready = true;
(window as unknown as { __r: Renderer3D }).__r = r;
(window as unknown as { __g: Game }).__g = game;
