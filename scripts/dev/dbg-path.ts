import { DEFAULT_PLAYER_DECK, Game, DT } from '../../src/sim';
const g = new Game({ seed: 5, decks: [[...DEFAULT_PLAYER_DECK], [...DEFAULT_PLAYER_DECK]] });
const p = g.players[0];
p.hand[0] = 'knight';
p.elixir = 10;
const [x, y] = [Number(process.argv[2] ?? 3.5), Number(process.argv[3] ?? 28.5)];
console.log(g.deploy(0, 0, x, y));
const k = g.entities[g.entities.length - 1];
for (let i = 0; i < 40 / DT; i++) {
  g.step();
  g.drainEvents();
  if (i % 15 === 0) console.log((i * DT).toFixed(1), k.x.toFixed(2), k.y.toFixed(2), 'target', g.get(k.targetId)?.unit, g.get(k.targetId)?.team, 'att', k.attacking, 'avoid', k.avoidSide);
  if (!k.alive) break;
}
