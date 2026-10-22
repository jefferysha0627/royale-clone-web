import { Renderer } from '../render/renderer';
import { AI_DECKS, AI_LEVELS, AiController, ARENA, CARDS, DT, Game, Rng, type AiLevel, type GameEvent, type MatchResult } from '../sim';
import type { Sound } from './audio';
import { fillCard } from './cardview';
import { shareGame, shareUrl } from './share';

export interface BattleHost {
  onResult(result: MatchResult): void;
  onQuit(): void;
  onDeck(): void;
}

interface Drag {
  pointerId: number;
  index: number;
  sx: number;
  sy: number;
  moved: boolean;
  fromArena: boolean;
  wasSelected: boolean;
}

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

function fmtTime(sec: number): string {
  const s = Math.max(0, Math.ceil(sec));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

const LEVEL_NAME: Record<AiLevel, string> = { easy: '簡單', normal: '普通', hard: '困難' };

const REASON_TEXT: Record<MatchResult['reason'], (winner: 0 | 1 | null) => string> = {
  king: (w) => (w === 0 ? '你推倒了對方的國王塔！' : '我方國王塔被推倒了'),
  time: () => '時間到，皇冠較多的一方獲勝',
  overtime: () => '延長賽中率先拿下皇冠',
  tiebreak: () => '延長賽結束，比較雙方血量最低的塔',
  draw: () => '延長賽結束，雙方不分勝負',
};

export class Battle {
  game!: Game;
  private ai!: AiController;
  private readonly renderer: Renderer;
  private raf = 0;
  private active = false;
  paused = false;
  private last = 0;
  private acc = 0;
  private selected: number | null = null;
  private drag: Drag | null = null;
  private endAt = 0;
  private resultShown = false;
  private deck: string[] = [];
  private level: AiLevel = 'normal';
  private seed = 0;
  private handKey = '';
  private hudKey = '';
  private toastTimer = 0;
  private bannerTimer = 0;
  private sizeW = 0;
  private sizeH = 0;
  /** 自動測試用：每個模擬步數的計數（不影響遊戲）。 */
  stepsRun = 0;

  private readonly root = $<HTMLElement>('screen-battle');
  private readonly wrap = $<HTMLElement>('arena-wrap');
  private readonly canvas = $<HTMLCanvasElement>('arena');
  private readonly panel = $<HTMLElement>('hand-panel');
  private readonly cards = Array.from(document.querySelectorAll<HTMLButtonElement>('#hand .card'));
  private readonly nextCard = $<HTMLElement>('next-card');
  private readonly elixirNum = $<HTMLElement>('elixir-num');
  private readonly elixirFill = $<HTMLElement>('elixir-fill');
  private readonly elixirBox = this.panel.querySelector<HTMLElement>('.elixir')!;
  private readonly timer = $<HTMLElement>('hud-timer');
  private readonly timeBox = this.root.querySelector<HTMLElement>('.hud-time')!;
  private readonly timeLabel = $<HTMLElement>('hud-time-label');
  private readonly x2 = $<HTMLElement>('hud-x2');
  private readonly crownMe = $<HTMLElement>('hud-crown-me');
  private readonly crownEnemy = $<HTMLElement>('hud-crown-enemy');
  private readonly toastEl = $<HTMLElement>('toast');
  private readonly bannerEl = $<HTMLElement>('banner');
  private readonly ovPause = $<HTMLElement>('ov-pause');
  private readonly ovResult = $<HTMLElement>('ov-result');

  constructor(private readonly sound: Sound, private readonly host: BattleHost) {
    this.renderer = new Renderer(this.canvas);
    this.bindInput();
    this.bindButtons();
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => this.layout()) : null;
    if (ro) ro.observe(this.wrap);
    window.addEventListener('resize', () => this.layout());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.autoPause();
    });
    window.addEventListener('pagehide', () => this.autoPause());
  }

  // ───────── 生命週期 ─────────

  start(deck: string[], level: AiLevel, seed?: number): void {
    this.deck = [...deck];
    this.level = level;
    this.seed = seed ?? Math.floor(Math.random() * 2 ** 31);
    const pick = new Rng(this.seed ^ 0x5bd1e995);
    this.game = new Game({ seed: this.seed, decks: [this.deck, [...pick.pick(AI_DECKS)]] });
    this.ai = new AiController(this.game, 1, this.game.rng.fork(), AI_LEVELS[level]);
    this.renderer.reset();
    this.selected = null;
    this.drag = null;
    this.endAt = 0;
    this.resultShown = false;
    this.paused = false;
    this.acc = 0;
    this.stepsRun = 0;
    this.handKey = '';
    this.hudKey = '';
    this.ovPause.hidden = true;
    this.ovResult.hidden = true;
    this.toastEl.hidden = true;
    this.bannerEl.hidden = true;
    this.cards.forEach((c) => c.classList.remove('selected', 'dragging', 'deny'));
    $('share-manual-result').hidden = true;
    this.root.hidden = false;
    this.active = true;
    this.layout();
    this.renderHand();
    this.updateHud();
    cancelAnimationFrame(this.raf);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop(): void {
    this.active = false;
    cancelAnimationFrame(this.raf);
    this.root.hidden = true;
  }

  /** 以方法讀取，避免 TypeScript 對 game.phase 的窄化誤判。 */
  get ended(): boolean {
    return this.game.phase === 'ended';
  }

  get isActive(): boolean {
    return this.active;
  }

  get currentSeed(): number {
    return this.seed;
  }

  private layout(): void {
    if (!this.active) return;
    const w = this.wrap.clientWidth;
    const h = this.wrap.clientHeight;
    if (w <= 0 || h <= 0) return;
    if (w === this.sizeW && h === this.sizeH) return;
    this.sizeW = w;
    this.sizeH = h;
    this.renderer.resize(w, h);
  }

  private frame = (now: number): void => {
    if (!this.active) return;
    this.raf = requestAnimationFrame(this.frame);
    // 單幀最多補 0.1 秒，背景切回或卡頓時不會一次補算大量步數
    const dt = Math.min(0.1, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    const g = this.game;
    if (!this.paused && g.phase !== 'ended') {
      this.acc += dt;
      while (this.acc >= DT) {
        this.simStep();
        this.acc -= DT;
        if (this.ended) {
          this.acc = 0;
          break;
        }
      }
    }
    this.renderer.render(g, this.paused ? 1 : Math.min(1, this.acc / DT), this.paused ? 0 : dt);
    this.updateHud();
    if (this.endAt && now >= this.endAt && !this.resultShown) this.showResult();
  };

  /** 場地格座標 → 視窗座標（自動測試用來瞄準真實滑鼠／觸控輸入）。 */
  screenOf(x: number, y: number): [number, number] {
    const r = this.canvas.getBoundingClientRect();
    const [sx, sy] = this.renderer.toScreen(x, y);
    return [r.left + sx, r.top + sy];
  }

  get effectCount(): number {
    return this.renderer.effectCount;
  }

  /** 推進一個固定步長（AI 先決策，再模擬）。 */
  simStep(): void {
    this.ai.update();
    this.game.step();
    this.stepsRun++;
    this.handleEvents(this.game.drainEvents());
  }

  // ───────── 事件與回饋 ─────────

  private handleEvents(events: GameEvent[]): void {
    if (events.length === 0) return;
    this.renderer.pushEvents(events);
    for (const ev of events) {
      switch (ev.type) {
        case 'deploy':
          this.sound.play(ev.team === 0 ? 'deploy' : 'enemyDeploy');
          break;
        case 'hit':
          if (ev.isTower) this.sound.play('hit');
          break;
        case 'death':
          if (ev.kind !== 'tower') this.sound.play('death');
          break;
        case 'towerDown': {
          this.sound.play('tower');
          const el = ev.team === 1 ? this.crownMe : this.crownEnemy;
          el.parentElement!.classList.remove('pop');
          void el.parentElement!.offsetWidth;
          el.parentElement!.classList.add('pop');
          if (!ev.isKing && !ev.cascade) this.banner(ev.team === 1 ? '+1 皇冠！' : '我方的塔倒了', ev.team === 1 ? '繼續進攻國王塔' : '守住國王塔');
          break;
        }
        case 'spell':
          this.sound.play('spell');
          break;
        case 'doubleElixir':
          this.sound.play('phase');
          this.banner('能量加倍！', '最後 60 秒');
          break;
        case 'phase':
          if (ev.phase === 'overtime') {
            this.sound.play('phase');
            this.banner('延長賽！', '先推倒任一座塔就獲勝');
          }
          break;
        case 'end':
          this.endAt = performance.now() + 1600;
          this.setSelected(null);
          this.drag = null;
          this.renderer.preview = null;
          break;
        default:
          break;
      }
    }
  }

  private banner(text: string, sub = ''): void {
    const el = this.bannerEl;
    el.hidden = true;
    void el.offsetWidth;
    el.innerHTML = sub ? `${text}<small>${sub}</small>` : text;
    el.hidden = false;
    clearTimeout(this.bannerTimer);
    this.bannerTimer = window.setTimeout(() => (el.hidden = true), 1800);
  }

  toast(text: string, info = false): void {
    const el = this.toastEl;
    el.textContent = text;
    el.classList.toggle('info', info);
    el.hidden = false;
    clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => (el.hidden = true), 1300);
  }

  // ───────── HUD ─────────

  private renderHand(): void {
    const p = this.game.players[0];
    const key = `${p.hand.join(',')}|${p.queue[0]}`;
    if (key === this.handKey) return;
    this.handKey = key;
    p.hand.forEach((id, i) => fillCard(this.cards[i], id));
    fillCard(this.nextCard, p.queue[0]);
  }

  private updateHud(): void {
    const g = this.game;
    const p = g.players[0];
    this.renderHand();
    const el = p.elixir;
    this.elixirFill.style.width = `${(el / 10) * 100}%`;
    const whole = Math.floor(el + 1e-6);
    for (let i = 0; i < 4; i++) {
      const card = CARDS[p.hand[i]];
      const c = this.cards[i];
      const short = card.cost > el + 1e-6;
      c.classList.toggle('unaffordable', short);
      const fill = c.lastElementChild as HTMLElement | null;
      if (fill) fill.style.height = short ? `${Math.min(1, el / card.cost) * 100}%` : '0%';
    }
    const ot = g.phase === 'overtime';
    const x2 = g.elixirMultiplier() > 1 && g.phase !== 'ended';
    const key = `${whole}|${fmtTime(g.timeLeft)}|${ot}|${x2}|${p.crowns}|${g.players[1].crowns}`;
    if (key === this.hudKey) return;
    this.hudKey = key;
    this.elixirNum.textContent = String(whole);
    this.timer.textContent = fmtTime(g.timeLeft);
    this.timeLabel.textContent = ot ? '延長賽' : '剩餘時間';
    this.timeBox.classList.toggle('overtime', ot);
    this.timeBox.classList.toggle('urgent', g.timeLeft <= 10 && g.phase !== 'ended');
    this.x2.hidden = !x2;
    this.elixirBox.classList.toggle('x2', x2);
    this.crownMe.textContent = String(p.crowns);
    this.crownEnemy.textContent = String(g.players[1].crowns);
  }

  // ───────── 輸入 ─────────

  private setSelected(i: number | null): void {
    this.selected = i;
    this.cards.forEach((c, k) => c.classList.toggle('selected', k === i));
    this.renderer.showZone = i !== null;
    this.renderer.selectedCard = i !== null ? this.game.players[0].hand[i] : null;
    if (i === null) this.renderer.preview = null;
  }

  private canInteract(): boolean {
    return this.active && !this.paused && this.game.phase !== 'ended';
  }

  /** 螢幕座標 → 場地格座標；不在場地上回傳 null。 */
  private worldAt(clientX: number, clientY: number): [number, number] | null {
    const panelTop = this.panel.getBoundingClientRect().top;
    if (clientY >= panelTop) return null;
    const r = this.canvas.getBoundingClientRect();
    const [wx, wy] = this.renderer.toWorld(clientX - r.left, clientY - r.top);
    if (wx < 0 || wx > ARENA.width || wy < 0 || wy > ARENA.height) return null;
    const snap = (v: number, max: number) => Math.max(0.5, Math.min(max - 0.5, Math.round(v * 2) / 2));
    return [snap(wx, ARENA.width), snap(wy, ARENA.height)];
  }

  private updatePreview(index: number, clientX: number, clientY: number): void {
    const cardId = this.game.players[0].hand[index];
    const pos = this.worldAt(clientX, clientY);
    if (!pos || !cardId) {
      this.renderer.preview = null;
      return;
    }
    this.renderer.preview = { cardId, x: pos[0], y: pos[1], legal: this.game.canDeployAt(0, cardId, pos[0], pos[1]) };
  }

  private tryDeploy(index: number, clientX: number, clientY: number): boolean {
    const pos = this.worldAt(clientX, clientY);
    if (!pos) return false;
    return this.deployAt(index, pos[0], pos[1]);
  }

  /** 玩家在場地格座標 (x, y) 出第 index 張手牌。 */
  deployAt(index: number, x: number, y: number): boolean {
    const cardId = this.game.players[0].hand[index];
    const res = this.game.deploy(0, index, x, y);
    if (res.ok) {
      this.setSelected(null);
      this.renderHand();
      return true;
    }
    this.sound.play('error');
    if (res.reason === 'elixir') {
      this.toast(`能量不足（需要 ${CARDS[cardId].cost}）`);
      const c = this.cards[index];
      c.classList.remove('deny');
      void c.offsetWidth;
      c.classList.add('deny');
    } else if (res.reason === 'zone') {
      this.toast('這裡不能部署');
    }
    return false;
  }

  private bindInput(): void {
    const root = this.root;
    root.addEventListener('pointerdown', (e) => {
      const t = e.target as Element;
      if (t.closest('.overlay, .hud-pause')) return;
      if (!this.canInteract() || this.drag) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const cardEl = t.closest<HTMLElement>('#hand .card');
      if (cardEl) {
        e.preventDefault();
        const index = Number(cardEl.dataset.index);
        this.drag = { pointerId: e.pointerId, index, sx: e.clientX, sy: e.clientY, moved: false, fromArena: false, wasSelected: this.selected === index };
        this.setSelected(index);
        this.capture(e.pointerId);
        return;
      }
      if (t.closest('#arena-wrap')) {
        e.preventDefault();
        if (this.selected === null) {
          this.toast('先點選下方的一張卡牌', true);
          return;
        }
        this.drag = { pointerId: e.pointerId, index: this.selected, sx: e.clientX, sy: e.clientY, moved: true, fromArena: true, wasSelected: true };
        this.updatePreview(this.selected, e.clientX, e.clientY);
        this.capture(e.pointerId);
      }
    });

    root.addEventListener('pointermove', (e) => {
      const d = this.drag;
      if (!d) {
        // 滑鼠懸停時預覽落點
        if (e.pointerType === 'mouse' && this.selected !== null && this.canInteract()) this.updatePreview(this.selected, e.clientX, e.clientY);
        return;
      }
      if (e.pointerId !== d.pointerId) return;
      if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 8) {
        d.moved = true;
        this.cards[d.index].classList.add('dragging');
      }
      if (d.moved) this.updatePreview(d.index, e.clientX, e.clientY);
    });

    const finish = (e: PointerEvent, cancelled: boolean): void => {
      const d = this.drag;
      if (!d || e.pointerId !== d.pointerId) return;
      this.drag = null;
      this.release(e.pointerId);
      this.cards[d.index].classList.remove('dragging');
      if (cancelled || !this.canInteract()) {
        this.renderer.preview = null;
        return;
      }
      if (d.moved) {
        const overArena = this.worldAt(e.clientX, e.clientY) !== null;
        if (overArena) this.tryDeploy(d.index, e.clientX, e.clientY);
        else if (!d.fromArena) {
          this.setSelected(null);
          this.toast('已取消出牌', true);
        }
        if (this.selected === null || e.pointerType !== 'mouse') this.renderer.preview = null;
        return;
      }
      // 單純點一下卡牌：再點一次同一張就取消選取
      if (d.wasSelected) this.setSelected(null);
      else this.sound.play('tap');
    };
    root.addEventListener('pointerup', (e) => finish(e, false));
    root.addEventListener('pointercancel', (e) => finish(e, true));
    root.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse' && !this.drag) this.renderer.preview = null;
    });
    // iOS Safari 的雙指縮放手勢
    root.addEventListener('gesturestart', (e) => e.preventDefault());
    root.addEventListener('contextmenu', (e) => e.preventDefault());

    window.addEventListener('keydown', (e) => {
      if (!this.active) return;
      if (e.key === 'Escape') {
        if (this.selected !== null) this.setSelected(null);
        else if (!this.paused && this.game.phase !== 'ended') this.pause();
        return;
      }
      if (!this.canInteract()) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 4) this.setSelected(this.selected === n - 1 ? null : n - 1);
    });
  }

  private capture(id: number): void {
    try {
      this.root.setPointerCapture(id);
    } catch {
      // 某些瀏覽器在合成事件上不支援 capture，不影響操作
    }
  }

  private release(id: number): void {
    try {
      if (this.root.hasPointerCapture(id)) this.root.releasePointerCapture(id);
    } catch {
      // 忽略
    }
  }

  // ───────── 暫停與結算 ─────────

  private bindButtons(): void {
    $('btn-pause').addEventListener('click', () => this.pause());
    $('btn-resume').addEventListener('click', () => this.resume());
    $('btn-restart').addEventListener('click', () => {
      this.sound.unlock();
      this.start(this.deck, this.level);
    });
    $('btn-quit').addEventListener('click', () => this.host.onQuit());
    $('btn-again').addEventListener('click', () => {
      this.sound.unlock();
      this.start(this.deck, this.level);
    });
    $('btn-result-home').addEventListener('click', () => this.host.onQuit());
    $('btn-result-deck').addEventListener('click', () => this.host.onDeck());
    $('btn-share-result').addEventListener('click', () => void this.shareResult());
  }

  pause(note = ''): void {
    if (!this.active || this.paused || this.game.phase === 'ended') return;
    this.paused = true;
    this.drag = null;
    this.renderer.preview = null;
    this.cards.forEach((c) => c.classList.remove('dragging'));
    $('pause-note').textContent = note;
    $('pause-note').hidden = !note;
    this.ovPause.hidden = false;
  }

  private autoPause(): void {
    if (!this.active) return;
    this.pause('切換畫面時自動暫停，準備好再繼續。');
    this.sound.suspend();
  }

  resume(): void {
    if (!this.paused) return;
    this.sound.unlock();
    this.paused = false;
    this.ovPause.hidden = true;
    this.acc = 0;
    this.last = performance.now();
  }

  private showResult(): void {
    const r = this.game.result;
    if (!r || this.resultShown) return;
    this.resultShown = true;
    const p = this.game.players[0];
    const panel = this.ovResult.querySelector('.panel')!;
    panel.classList.toggle('win', r.winner === 0);
    panel.classList.toggle('lose', r.winner === 1);
    $('result-title').textContent = r.winner === 0 ? '勝利！' : r.winner === 1 ? '落敗' : '平手';
    $('result-crown-me').textContent = String(r.crowns[0]);
    $('result-crown-enemy').textContent = String(r.crowns[1]);
    $('result-reason').textContent = REASON_TEXT[r.reason](r.winner);
    $('result-stats').textContent = `${LEVEL_NAME[this.level]}電腦 · 出牌 ${p.cardsPlayed} 張 · 花費 ${Math.round(p.elixirSpent)} 能量 · 對戰 ${fmtTime(r.time)}`;
    $('btn-share-result').textContent = '分享戰績給朋友';
    $('share-manual-result').hidden = true;
    this.ovResult.hidden = false;
    this.sound.play(r.winner === 0 ? 'win' : 'lose');
    this.host.onResult(r);
  }

  private async shareResult(): Promise<void> {
    const r = this.game.result;
    if (!r) return;
    const [a, b] = r.crowns;
    const lv = LEVEL_NAME[this.level];
    const text =
      r.winner === 0
        ? `我在《皇室戰爭克隆》以 ${a}:${b} 打贏${lv}電腦！三分鐘一局，點開就能玩：`
        : r.winner === 1
          ? `我在《皇室戰爭克隆》以 ${a}:${b} 輸給${lv}電腦了，換你來挑戰：`
          : `我在《皇室戰爭克隆》和${lv}電腦打成平手，你能贏嗎？`;
    const btn = $('btn-share-result');
    const outcome = await shareGame(text);
    if (outcome === 'copied') btn.textContent = '已複製遊戲連結！';
    else if (outcome === 'manual') {
      const box = $('share-manual-result');
      const input = $<HTMLInputElement>('share-input-result');
      input.value = shareUrl();
      box.hidden = false;
      input.focus();
      input.select();
    }
  }
}
