import { Renderer2D } from '../render/renderer2d';
import type { BattleRenderer } from '../render/types';
import { tryCreateRenderer3D } from '../render3d/renderer3d';
import { AI_DECKS, AI_LEVELS, AiController, ARENA, CARDS, DT, Game, MATCH, Rng, type AiLevel, type GameEvent, type MatchResult } from '../sim';
import type { Sound } from './audio';
import { crownSlots, crownSvg, fillCard } from './cardview';
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
  overtime: () => '延長賽中率先推倒塔的一方獲勝',
  tiebreak: () => '延長賽結束：塔同步扣血，最低血量的塔先倒',
  draw: () => '延長賽結束，雙方塔血量相同',
};

/** 表情（原創文字＋系統表情符號）。 */
const EMOTES: { id: string; em: string; text: string }[] = [
  { id: 'good', em: '👍', text: '讚！' },
  { id: 'haha', em: '😆', text: '哈哈' },
  { id: 'wow', em: '😮', text: '哇！' },
  { id: 'thanks', em: '🙏', text: '謝謝' },
  { id: 'grr', em: '😤', text: '可惡' },
  { id: 'luck', em: '🍀', text: '祝好運' },
];

/** 開場：VS 畫面 → 3、2、1 → 開戰。 */
const INTRO_VS = 1.7;
const INTRO_COUNT = 0.62;

export class Battle {
  game!: Game;
  private ai!: AiController;
  private readonly renderer: BattleRenderer;
  private raf = 0;
  private active = false;
  paused = false;
  /** 開場倒數中（模擬暫停、不能出牌）。 */
  intro = 0;
  private introStep = -1;
  private last = 0;
  private acc = 0;
  private selected: number | null = null;
  private drag: Drag | null = null;
  private endAt = 0;
  private resultShown = false;
  private deck: string[] = [];
  private level: AiLevel = 'normal';
  private aiDeckName = '';
  private seed = 0;
  private handKey = '';
  private hudKey = '';
  private toastTimer = 0;
  private bannerTimer = 0;
  private sizeW = 0;
  private sizeH = 0;
  private fullShown = false;
  /** 自動測試用：每個模擬步數的計數（不影響遊戲）。 */
  stepsRun = 0;
  /** 測試用：略過開場動畫。 */
  skipIntro = false;

  private readonly root = $<HTMLElement>('screen-battle');
  private readonly wrap = $<HTMLElement>('arena-wrap');
  private readonly canvas = $<HTMLCanvasElement>('arena');
  private readonly uiCanvas = $<HTMLCanvasElement>('arena-ui');
  private readonly panel = $<HTMLElement>('hand-panel');
  private readonly handEl = $<HTMLElement>('hand');
  private readonly cards = Array.from(document.querySelectorAll<HTMLButtonElement>('#hand .card'));
  private readonly nextCard = $<HTMLElement>('next-card');
  private readonly elixirNum = $<HTMLElement>('elixir-num');
  private readonly elixirFill = $<HTMLElement>('elixir-fill');
  private readonly elixirFull = $<HTMLElement>('elixir-full');
  private readonly elixirBox = this.panel.querySelector<HTMLElement>('.elixir')!;
  private readonly timer = $<HTMLElement>('hud-timer');
  private readonly timeBox = $<HTMLElement>('hud-time-box');
  private readonly timeLabel = $<HTMLElement>('hud-time-label');
  private readonly mult = $<HTMLElement>('hud-mult');
  private readonly multText = $<HTMLElement>('hud-mult-text');
  private readonly crownsMe = $<HTMLElement>('hud-crowns-me');
  private readonly crownsEnemy = $<HTMLElement>('hud-crowns-enemy');
  private readonly nameEnemy = $<HTMLElement>('hud-name-enemy');
  private readonly toastEl = $<HTMLElement>('toast');
  private readonly bannerEl = $<HTMLElement>('banner');
  private readonly countdownEl = $<HTMLElement>('countdown');
  private readonly ovVs = $<HTMLElement>('ov-vs');
  private readonly ovPause = $<HTMLElement>('ov-pause');
  private readonly ovResult = $<HTMLElement>('ov-result');
  private readonly handSlots: (string | null)[] = [null, null, null, null];
  private readonly emotePicker = $<HTMLElement>('emote-picker');
  private readonly emoteMe = $<HTMLElement>('emote-me');
  private readonly emoteEnemy = $<HTMLElement>('emote-enemy');
  private emoteTimers: number[] = [];
  private lastEnemyEmote = -99;
  /** 皇冠飛到資訊列後才亮起：記錄畫面上目前顯示的皇冠數。 */
  private shownCrowns: [number, number] = [0, 0];

  constructor(private readonly sound: Sound, private readonly host: BattleHost) {
    // 優先使用 3D；裝置不支援 WebGL 時退回 2D 畫面（同一套規則與操作）
    const r3 = new URLSearchParams(location.search).get('render') === '2d' ? null : tryCreateRenderer3D(this.canvas, this.uiCanvas);
    this.renderer = r3 ?? new Renderer2D(this.canvas);
    if (!r3) this.uiCanvas.hidden = true;
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
    const aiDeck = pick.pick(AI_DECKS);
    this.aiDeckName = aiDeck.name;
    this.game = new Game({ seed: this.seed, decks: [this.deck, [...aiDeck.cards]] });
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
    this.fullShown = false;
    this.handSlots.fill(null);
    this.ovPause.hidden = true;
    this.ovResult.hidden = true;
    this.toastEl.hidden = true;
    this.bannerEl.hidden = true;
    this.countdownEl.hidden = true;
    this.cards.forEach((c) => c.classList.remove('selected', 'dragging', 'deny', 'dealt'));
    $('share-manual-result').hidden = true;
    const enemyName = `電腦（${LEVEL_NAME[level]}）`;
    this.nameEnemy.textContent = enemyName;
    $('vs-name-enemy').textContent = enemyName;
    $('vs-sub-enemy').textContent = `牌組：${aiDeck.name}`;
    $('vs-sub-me').textContent = `平均 ${(deck.reduce((s, id) => s + CARDS[id].cost, 0) / deck.length).toFixed(1)} 能量`;
    crownSlots(this.crownsMe, 3, 0);
    crownSlots(this.crownsEnemy, 3, 0);
    this.shownCrowns = [0, 0];
    this.emotePicker.hidden = true;
    this.emoteMe.hidden = true;
    this.emoteEnemy.hidden = true;
    for (const t of this.emoteTimers) clearTimeout(t);
    this.emoteTimers = [];
    this.lastEnemyEmote = -99;
    this.root.querySelectorAll('.crown-fly').forEach((el) => el.remove());
    if (!this.skipIntro && Math.random() < 0.5) this.enemyEmote('luck', 2.2);
    this.root.hidden = false;
    this.active = true;
    this.intro = this.skipIntro ? 0 : INTRO_VS + INTRO_COUNT * 4;
    this.sound.stopMusic();
    if (this.skipIntro) this.sound.startMusic();
    this.introStep = -1;
    this.ovVs.hidden = this.skipIntro;
    this.ovVs.classList.remove('out');
    if (!this.skipIntro) {
      // 重新觸發進場動畫
      for (const el of [this.ovVs, ...Array.from(this.ovVs.children)] as HTMLElement[]) {
        el.style.animation = 'none';
        void el.offsetWidth;
        el.style.animation = '';
      }
      this.sound.play('vs');
    }
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
    this.sound.stopMusic();
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

  get rendererKind(): string {
    return this.renderer.kind;
  }

  get effectCount(): number {
    return this.renderer.effectCount;
  }

  /** 自動測試用：目前的部署提示狀態。 */
  debugPreview(): { showZone: boolean; preview: { cardId: string; x: number; y: number; legal: boolean } | null } {
    return { showZone: this.renderer.showZone, preview: this.renderer.preview };
  }

  get gpuStats(): unknown {
    return (this.renderer as { gpuStats?: unknown }).gpuStats ?? null;
  }

  get qualityLevel(): string {
    return (this.renderer as { qualityLevel?: string }).qualityLevel ?? '2d';
  }

  /** 平均每幀毫秒（效能紀錄）。 */
  get frameTime(): number {
    return (this.renderer as { frameTime?: number }).frameTime ?? 0;
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
    if (this.intro > 0 && !this.paused) this.updateIntro(dt);
    // 打擊停頓：大招命中、塔倒下時讓戰鬥停一瞬間（只影響畫面節奏，不影響模擬結果）
    const stopped = (this.renderer as { hitStop?: number }).hitStop ?? 0;
    if (!this.paused && this.intro <= 0 && g.phase !== 'ended' && stopped <= 0) {
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

  private updateIntro(dt: number): void {
    this.intro = Math.max(0, this.intro - dt);
    const elapsed = INTRO_VS + INTRO_COUNT * 4 - this.intro;
    if (elapsed < INTRO_VS - 0.3) return;
    this.ovVs.classList.add('out');
    if (elapsed < INTRO_VS) return;
    this.ovVs.hidden = true;
    const step = Math.min(3, Math.floor((elapsed - INTRO_VS) / INTRO_COUNT));
    if (step !== this.introStep) {
      this.introStep = step;
      const el = this.countdownEl;
      el.hidden = false;
      el.classList.remove('tick', 'go');
      void el.offsetWidth;
      el.textContent = step < 3 ? String(3 - step) : '開戰！';
      el.classList.add('tick');
      if (step === 3) el.classList.add('go');
      this.sound.play(step < 3 ? 'count' : 'go');
    }
    if (this.intro <= 0) {
      this.countdownEl.hidden = true;
      this.last = performance.now();
      this.sound.startMusic();
    }
  }

  /** 場地格座標 → 視窗座標（自動測試用來瞄準真實滑鼠／觸控輸入）。 */
  screenOf(x: number, y: number): [number, number] {
    const r = this.canvas.getBoundingClientRect();
    const [sx, sy] = this.renderer.toScreen(x, y);
    return [r.left + sx, r.top + sy];
  }

  /** 場地格座標＋高度（格）→ 視窗座標；2D 畫面忽略高度。 */
  screenOf3(x: number, y: number, h: number): [number, number] {
    const r = this.canvas.getBoundingClientRect();
    const proj = (this.renderer as { project?: (X: number, Y: number, Z: number) => [number, number] }).project;
    const [sx, sy] = proj ? proj.call(this.renderer, x - ARENA.width / 2, h, y - ARENA.height / 2) : this.renderer.toScreen(x, y);
    return [r.left + sx, r.top + sy];
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
    this.renderer.pushEvents(events, this.game);
    for (const ev of events) {
      switch (ev.type) {
        case 'deploy':
          this.sound.play(ev.team === 0 ? 'deploy' : 'enemyDeploy');
          break;
        case 'spawn':
          if (ev.source === 'card' && CARDS[this.game.get(ev.id)?.cardId ?? '']?.kind === 'troop') {
            const u = this.game.get(ev.id);
            if (u && u.stats.mass >= 18) this.sound.play('thud');
          }
          break;
        case 'attack':
          this.sound.play(attackSound(ev.unit, ev.ranged));
          break;
        case 'hit':
          if (ev.isTower) this.sound.play('towerHit');
          else if (ev.amount >= 250) this.sound.play('heavyHit');
          else this.sound.play('hit');
          break;
        case 'impact':
          this.sound.play(ev.visual === 'ice' ? 'freeze' : ev.visual === 'magic' ? 'magic' : 'boom');
          break;
        case 'death':
          if (ev.kind === 'building') this.sound.play('crumble');
          else if (ev.kind === 'troop' && !ev.kamikaze) this.sound.play('death');
          break;
        case 'towerDown': {
          this.sound.play(ev.isKing ? 'kingDown' : 'tower');
          if (!ev.cascade) this.flyCrowns(ev.team === 1 ? 0 : 1, ev.x, ev.y);
          if (!ev.isKing && !ev.cascade) {
            this.banner(ev.team === 1 ? '拿下一頂皇冠！' : '我方的塔倒了', ev.team === 1 ? '繼續進攻國王塔' : '守住國王塔', ev.team === 1 ? 'gold' : '');
            // 電腦的反應（像真人一樣偶爾發表情）
            this.enemyEmote(ev.team === 1 ? (Math.random() < 0.5 ? 'grr' : 'wow') : Math.random() < 0.5 ? 'haha' : 'good', 0.9);
          }
          break;
        }
        case 'kingActivate':
          this.sound.play('kingWake');
          break;
        case 'spellCast':
          this.sound.play(ev.cardId === 'zap' ? 'zap' : ev.cardId === 'log' ? 'log' : ev.cardId === 'poison' ? 'poison' : 'whoosh');
          break;
        case 'spell':
          if (ev.cardId === 'fireball' || ev.cardId === 'rocket') this.sound.play(ev.cardId === 'rocket' ? 'bigBoom' : 'boom');
          else if (ev.cardId === 'arrows') this.sound.play('arrows');
          else if (ev.cardId === 'goblin_barrel') this.sound.play('crumble');
          break;
        case 'blast':
          this.sound.play(ev.visual === 'bomb' ? 'bigBoom' : 'thud');
          break;
        case 'bombDrop':
          this.sound.play('fuse');
          break;
        case 'charge':
          this.sound.play('charge');
          break;
        case 'stun':
          if (ev.freeze) this.sound.play('freeze');
          break;
        case 'elixirRate':
          this.sound.play('phase');
          this.sound.setMusicIntensity(ev.mult >= 3 ? 2 : 1);
          this.banner(ev.mult === 3 ? '能量三倍！' : '能量加倍！', ev.mult === 3 ? '延長賽最後 60 秒' : this.game.phase === 'overtime' ? '' : '最後 60 秒', 'pink');
          break;
        case 'phase':
          if (ev.phase === 'overtime') {
            this.sound.play('overtime');
            this.sound.setMusicIntensity(1);
            this.banner('延長賽！', '先推倒任一座塔就獲勝', 'gold');
          } else if (ev.phase === 'tiebreak') {
            this.sound.play('overtime');
            this.banner('決勝！', '雙方塔同步扣血，最低的塔先倒', 'gold');
          }
          break;
        case 'end':
          this.sound.stopMusic();
          if (ev.result.winner === 1) this.enemyEmote('haha', 0.6);
          else if (ev.result.winner === 0) this.enemyEmote(Math.random() < 0.5 ? 'thanks' : 'wow', 0.6);
          this.endAt = performance.now() + (ev.result.reason === 'king' ? 2200 : 1700);
          this.setSelected(null);
          this.drag = null;
          this.renderer.preview = null;
          this.banner(ev.result.winner === 0 ? '勝利！' : ev.result.winner === 1 ? '落敗' : '平手', '', ev.result.winner === 0 ? 'gold' : '');
          break;
        default:
          break;
      }
    }
  }

  // ───────── 皇冠飛行與表情 ─────────

  /** 塔倒下時，皇冠從塔的位置飛到上方資訊列的皇冠格，抵達後才亮起。 */
  private flyCrowns(team: 0 | 1, x: number, y: number): void {
    const target = this.game.players[team].crowns;
    const from = this.screenOf3(x, y, 3);
    const rootRect = this.root.getBoundingClientRect();
    const slots = team === 0 ? this.crownsMe : this.crownsEnemy;
    const delayStep = 140;
    for (let n = this.shownCrowns[team] + 1; n <= target; n++) {
      const slot = slots.children[n - 1] as HTMLElement | undefined;
      const el = document.createElement('div');
      el.className = `crown-fly ${team === 0 ? 'me' : 'enemy'}`;
      el.innerHTML = crownSvg();
      el.style.left = `${from[0] - rootRect.left - 20}px`;
      el.style.top = `${from[1] - rootRect.top - 16}px`;
      this.root.appendChild(el);
      const to = slot?.getBoundingClientRect();
      const dx = to ? to.left + to.width / 2 - from[0] : 0;
      const dy = to ? to.top + to.height / 2 - from[1] : -200;
      const idx = n;
      const anim = el.animate(
        [
          { transform: 'translate(0, 0) scale(0.4)', opacity: 0 },
          { transform: 'translate(0, -40px) scale(1.6)', opacity: 1, offset: 0.25 },
          { transform: `translate(${dx}px, ${dy}px) scale(0.45)`, opacity: 1 },
        ],
        { duration: 820, delay: (n - this.shownCrowns[team] - 1) * delayStep, easing: 'cubic-bezier(.45,.05,.55,.95)', fill: 'forwards' },
      );
      const done = () => {
        el.remove();
        if (this.game.players[team].crowns >= idx) {
          crownSlots(slots, 3, Math.max(this.shownCrownCount(team), idx));
          this.sound.play('crown');
        }
      };
      anim.onfinish = done;
      anim.oncancel = done;
    }
    this.shownCrowns[team] = target;
  }

  private shownCrownCount(team: 0 | 1): number {
    const slots = team === 0 ? this.crownsMe : this.crownsEnemy;
    return Array.from(slots.children).filter((c) => c.classList.contains('on')).length;
  }

  private toggleEmotes(): void {
    if (!this.emotePicker.childElementCount) {
      for (const e of EMOTES) {
        const b = document.createElement('button');
        b.type = 'button';
        b.innerHTML = `<span class="em">${e.em}</span>${e.text}`;
        b.addEventListener('click', () => {
          this.emotePicker.hidden = true;
          this.showEmote(this.emoteMe, e.id);
          this.sound.play('tap');
          // 電腦偶爾回應
          if (Math.random() < 0.35) this.enemyEmote(e.id === 'haha' || e.id === 'grr' ? 'haha' : e.id === 'thanks' ? 'thanks' : 'good', 1.2);
        });
        this.emotePicker.appendChild(b);
      }
    }
    this.emotePicker.hidden = !this.emotePicker.hidden;
  }

  private showEmote(el: HTMLElement, id: string): void {
    const e = EMOTES.find((x) => x.id === id) ?? EMOTES[0];
    el.hidden = true;
    void el.offsetWidth;
    el.innerHTML = `<span class="em">${e.em}</span>${e.text}`;
    el.hidden = false;
    this.emoteTimers.push(window.setTimeout(() => (el.hidden = true), 2200));
  }

  /** 電腦發表情：同一場最多每 8 秒一次。 */
  private enemyEmote(id: string, delaySec: number): void {
    const now = performance.now() / 1000;
    if (now - this.lastEnemyEmote < 8) return;
    this.lastEnemyEmote = now;
    this.emoteTimers.push(window.setTimeout(() => {
      if (this.active) this.showEmote(this.emoteEnemy, id);
    }, delaySec * 1000));
  }

  private banner(text: string, sub = '', tone = ''): void {
    const el = this.bannerEl;
    el.hidden = true;
    void el.offsetWidth;
    el.className = `banner ${tone}`;
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
    p.hand.forEach((id, i) => {
      const c = this.cards[i];
      const prev = this.handSlots[i];
      fillCard(c, id ?? undefined);
      c.classList.toggle('empty', !id);
      if (id && id !== prev && prev !== undefined && this.stepsRun > 0) {
        c.classList.remove('dealt');
        void c.offsetWidth;
        c.classList.add('dealt');
      }
      this.handSlots[i] = id;
    });
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
      const id = p.hand[i];
      const c = this.cards[i];
      if (!id) continue;
      const card = CARDS[id];
      const short = card.cost > el + 1e-6;
      c.classList.toggle('unaffordable', short);
      const fill = c.lastElementChild as HTMLElement | null;
      if (fill) fill.style.height = short ? `${Math.min(1, el / card.cost) * 100}%` : '0%';
    }
    const full = el >= MATCH.maxElixir - 1e-6 && g.playing && this.intro <= 0;
    if (full !== this.fullShown) {
      this.fullShown = full;
      this.elixirFull.hidden = !full;
      this.handEl.classList.toggle('full', full);
    }
    const ot = g.phase === 'overtime';
    const mult = g.playing ? g.elixirMultiplier() : 1;
    const key = `${whole}|${fmtTime(g.timeLeft)}|${ot}|${mult}|${g.phase}`;
    if (key === this.hudKey) return;
    this.hudKey = key;
    this.elixirNum.textContent = String(whole);
    this.timer.textContent = fmtTime(g.timeLeft);
    this.timeLabel.textContent = ot ? '延長賽' : g.phase === 'tiebreak' ? '決勝' : '剩餘時間';
    this.timeBox.classList.toggle('overtime', ot || g.phase === 'tiebreak');
    this.timeBox.classList.toggle('urgent', g.timeLeft <= 10 && g.playing);
    this.mult.hidden = mult <= 1;
    this.multText.textContent = `x${mult}`;
    this.elixirBox.classList.toggle('x2', mult > 1);
  }

  // ───────── 輸入 ─────────

  private setSelected(i: number | null): void {
    if (i !== null && !this.game.players[0].hand[i]) i = null;
    this.selected = i;
    this.cards.forEach((c, k) => c.classList.toggle('selected', k === i));
    this.renderer.showZone = i !== null;
    this.renderer.selectedCard = i !== null ? this.game.players[0].hand[i] ?? null : null;
    if (i === null) this.renderer.preview = null;
  }

  private canInteract(): boolean {
    return this.active && !this.paused && this.intro <= 0 && this.game.playing;
  }

  /** 螢幕座標 → 場地格座標；不在場地上回傳 null。 */
  private worldAt(clientX: number, clientY: number): [number, number] | null {
    const panelTop = this.panel.getBoundingClientRect().top;
    if (clientY >= panelTop) return null;
    const r = this.canvas.getBoundingClientRect();
    const [wx, wy] = this.renderer.toWorld(clientX - r.left, clientY - r.top);
    if (wx < 0 || wx > ARENA.width || wy < 0 || wy > ARENA.height) return null;
    return [wx, wy];
  }

  private updatePreview(index: number, clientX: number, clientY: number): void {
    const cardId = this.game.players[0].hand[index];
    const pos = this.worldAt(clientX, clientY);
    if (!pos || !cardId) {
      this.renderer.preview = null;
      return;
    }
    const [sx, sy] = this.game.snap(cardId, pos[0], pos[1]);
    this.renderer.preview = { cardId, x: sx, y: sy, legal: this.game.canDeployAt(0, cardId, sx, sy) };
  }

  private tryDeploy(index: number, clientX: number, clientY: number): boolean {
    const pos = this.worldAt(clientX, clientY);
    if (!pos) return false;
    return this.deployAt(index, pos[0], pos[1]);
  }

  /** 玩家在場地格座標 (x, y) 出第 index 張手牌。 */
  deployAt(index: number, x: number, y: number): boolean {
    const cardId = this.game.players[0].hand[index];
    if (!cardId) return false;
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
      if (t.closest('.overlay, .hud-pause, .vs, .hud-emote, .emote-picker')) return;
      if (!this.emotePicker.hidden) this.emotePicker.hidden = true;
      if (!this.canInteract() || this.drag) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      const cardEl = t.closest<HTMLElement>('#hand .card');
      if (cardEl) {
        e.preventDefault();
        const index = Number(cardEl.dataset.index);
        if (!this.game.players[0].hand[index]) return;
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
    $('btn-emote').addEventListener('click', () => this.toggleEmotes());
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
    this.sound.stopMusic();
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
    if (this.intro <= 0 && this.game.playing) {
      this.sound.startMusic();
      const m = this.game.elixirMultiplier();
      this.sound.setMusicIntensity(m >= 3 ? 2 : m >= 2 ? 1 : 0);
    }
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
    $('result-name-enemy').textContent = `電腦（${LEVEL_NAME[this.level]}）`;
    $('result-row-me').classList.toggle('won', r.winner === 0);
    $('result-row-enemy').classList.toggle('won', r.winner === 1);
    const me = $('result-crowns-me');
    const en = $('result-crowns-enemy');
    crownSlots(me, 3, 0);
    crownSlots(en, 3, 0);
    // 皇冠逐一亮起
    const total = Math.max(r.crowns[0], r.crowns[1]);
    for (let i = 1; i <= total; i++) {
      window.setTimeout(() => {
        if (!this.resultShown) return;
        crownSlots(me, 3, Math.min(i, r.crowns[0]));
        crownSlots(en, 3, Math.min(i, r.crowns[1]));
        this.sound.play('crown');
      }, 350 + i * 380);
    }
    $('result-reason').textContent = REASON_TEXT[r.reason](r.winner);
    $('result-stats').textContent = `${LEVEL_NAME[this.level]}電腦（${this.aiDeckName}）· 出牌 ${p.cardsPlayed} 張 · 花費 ${Math.round(p.elixirSpent)} 能量 · ${fmtTime(r.time)}`;
    $('btn-share-result').textContent = '分享戰績給朋友';
    $('share-manual-result').hidden = true;
    this.ovResult.hidden = false;
    this.sound.play(r.winner === 0 ? 'win' : r.winner === 1 ? 'lose' : 'draw');
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

/** 依單位挑攻擊音效。 */
function attackSound(unit: string, ranged: boolean): string {
  switch (unit) {
    case 'princess':
    case 'archer':
      return 'bow';
    case 'musketeer':
      return 'gun';
    case 'king':
    case 'cannon':
      return 'cannon';
    case 'wizard':
    case 'baby_dragon':
      return 'fire';
    case 'witch':
      return 'magic';
    case 'spear_goblin':
    case 'bomber':
      return 'throw';
    case 'inferno':
      return 'beam';
    case 'giant':
    case 'golem':
    case 'golemite':
    case 'giant_skeleton':
      return 'punch';
    case 'bat':
    case 'gargoyle':
      return 'bite';
    default:
      return ranged ? 'throw' : 'slash';
  }
}
