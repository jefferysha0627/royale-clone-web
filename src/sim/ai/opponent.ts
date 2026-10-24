// 對手模型：像真人一樣「數能量、記牌」。
// 只用公開看得到的資訊：對手的出牌次數與花費（每張牌落地時大家都看得到費用）、
// 場上新出現的單位與法術。不讀對手的能量、手牌或牌序。
import { CARDS } from '../cards';
import { MATCH } from '../config';
import type { Game, Team } from '../game';
import type { Rng } from '../rng';

export class OpponentModel {
  /** 估計的對手能量。 */
  elixir: number = MATCH.startElixir;
  /** 依序記下的對手出牌（已辨識出的卡牌 id）。 */
  readonly plays: string[] = [];
  /** 看過的對手卡牌。 */
  readonly seen = new Set<string>();
  /** 最近一次看到對手出牌的時間與卡牌。 */
  lastPlay = { time: -99, cardId: '', x: 0, y: 0 };
  private spent = 0;
  private played = 0;
  private gained = 0;
  private time = 0;
  private maxId = 0;

  constructor(
    private readonly game: Game,
    private readonly team: Team,
    private readonly rng: Rng,
    private readonly accuracy: number, // 0～1：記錯費用的機率 = 1 - accuracy
  ) {}

  /** 每個模擬步呼叫一次（在 game.step() 之前）。 */
  update(): void {
    const g = this.game;
    const p = g.players[this.team];
    const dt = g.time - this.time;
    this.time = g.time;
    if (dt > 0) this.elixir = Math.min(MATCH.maxElixir, this.elixir + MATCH.elixirPerSecond * g.elixirMultiplier() * dt);
    // 對手的聖水收集器產生的能量（場上看得到幫浦運作）
    if (p.elixirGained !== this.gained) {
      this.elixir = Math.min(MATCH.maxElixir, this.elixir + (p.elixirGained - this.gained));
      this.gained = p.elixirGained;
    }
    if (p.cardsPlayed === this.played) return;
    const n = p.cardsPlayed - this.played;
    const spent = p.elixirSpent - this.spent;
    this.played = p.cardsPlayed;
    this.spent = p.elixirSpent;
    this.identify(n, spent);
    let guess = spent;
    // 記性差的電腦會把費用記錯 1～2 點
    if (this.rng.next() > this.accuracy) guess += (this.rng.next() < 0.5 ? -1 : 1) * (1 + this.rng.int(2));
    this.elixir = Math.max(0, Math.min(MATCH.maxElixir, this.elixir - guess));
  }

  private identify(n: number, spent: number): void {
    const g = this.game;
    const found: string[] = [];
    let top = this.maxId;
    let x = 0;
    let y = 0;
    const note = (id: number, team: Team, cardId: string, px: number, py: number, isSpell: boolean) => {
      if (id <= this.maxId) return;
      top = Math.max(top, id);
      if (team !== this.team) return;
      const c = CARDS[cardId];
      // 飛桶落地後的哥布林沿用法術 id，不重複計算
      if (!c || (c.kind === 'spell') !== isSpell || found.includes(cardId)) return;
      found.push(cardId);
      x = px;
      y = py;
    };
    for (const e of g.entities) note(e.id, e.team, e.cardId, e.x, e.y, false);
    for (const s of g.spells) note(s.id, s.team, s.cardId, s.x, s.y, true);
    for (const a of g.areas) note(a.id, a.team, a.cardId, a.x, a.y, true);
    for (const r of g.rollers) note(r.id, r.team, r.cardId, r.x, r.y, true);
    this.maxId = top;
    // 立即生效的法術（電擊法術）不會留下任何東西：用剩下的費用反推
    const known = found.reduce((s, id) => s + CARDS[id].cost, 0);
    if (found.length < n && spent - known > 0) {
      const rest = spent - known;
      const guess = Object.values(CARDS).filter((c) => c.kind === 'spell' && c.spell?.kind === 'instant' && c.cost === rest);
      if (guess.length === 1) found.push(guess[0].id);
    }
    for (const id of found) {
      this.plays.push(id);
      this.seen.add(id);
      this.lastPlay = { time: g.time, cardId: id, x, y };
    }
    if (this.plays.length > 40) this.plays.splice(0, this.plays.length - 40);
  }

  /** 最近出過的 4 張牌此時一定不在對手手上（出過的牌排到牌序最後）。 */
  recent(): string[] {
    return this.plays.slice(-4);
  }

  /** 看過這張牌，且它不在最近 4 張裡 → 可能在對手手上。 */
  mayHold(id: string): boolean {
    return this.seen.has(id) && !this.recent().includes(id);
  }
}
