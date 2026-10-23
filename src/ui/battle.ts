import { Renderer2D } from '../render/renderer2d';
import type { BattleRenderer } from '../render/types';
import { portraits } from '../render3d/portraits';
import { tryCreateRenderer3D } from '../render3d/renderer3d';
import { AI_DECKS, AI_LEVELS, AiController, ARENA, applyReplayStep, CARDS, DT, encodeReplay, Game, MATCH, newReplayGame, Rng, type AiLevel, type GameEvent, type GameMode, type MatchResult, type Replay } from '../sim';
import type { Sound } from './audio';
import { crownSlots, crownSvg, fillCard } from './cardview';
import { modeInfo } from './modes';
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

const REASON_TEXT: Record<MatchResult['reason'], (winner: 0 | 1 | null, sudden: boolean) => string> = {
  king: (w) => (w === 0 ? '你推倒了對方的國王塔！' : '我方國王塔被推倒了'),
  time: () => '時間到，皇冠較多的一方獲勝',
  overtime: (_, sd) => (sd ? '驟死對決：率先推倒塔的一方獲勝' : '延長賽中率先推倒塔的一方獲勝'),
  tiebreak: (_, sd) => `${sd ? '時間到' : '延長賽結束'}：塔同步扣血，最低血量的塔先倒`,
  draw: (_, sd) => `${sd ? '時間到' : '延長賽結束'}，雙方塔血量相同`,
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
  /** 這場的模式（活動對戰，或一般對戰 'normal'）。 */
  mode: GameMode = 'normal';
  private aiDeckName = '';
  private aiDeckCards: string[] = [];
  /** 這場玩家每張卡出了幾次（寫進對戰紀錄與「最常出的卡」）。 */
  private plays: Record<string, number> = {};
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
  /** 這場顯示新手教學提示（第一場）。 */
  coach = false;
  /** 正在播放的重播（null = 一般對戰）。 */
  private replay: Replay | null = null;
  private replayCursor = 0;
  /** 重播速度（1、2、4 倍）。 */
  replaySpeed = 1;
  /** 'friend' = 朋友分享的重播（藍方顯示「朋友」）。 */
  private replayOwner: 'me' | 'friend' = 'me';
  /** 教學進度：1 示範拖曳出牌、2 說明能量、3 等電腦的部隊過河、4 提醒防守、5 結束。 */
  private coachStep = 0;
  private coachT = 0;
  private readonly coachEl = $<HTMLElement>('coach');
  private readonly coachHand = $<HTMLElement>('coach-hand');
  private readonly coachRing = $<HTMLElement>('coach-ring');
  private readonly coachTip = $<HTMLElement>('coach-tip');

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
    window.addEventListener('resize', () => {
      this.layout();
      // 舊版 Safari 的 MediaQueryList 沒有 change 事件，轉向時靠 resize 補檢查
      this.checkOrientation();
    });
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') this.autoPause();
    });
    // 手機橫拿：手牌會擋住大半場地，暫停並提示轉回直向
    this.landscape = typeof window.matchMedia === 'function' ? window.matchMedia('(orientation: landscape) and (max-height: 520px) and (pointer: coarse)') : null;
    this.landscape?.addEventListener?.('change', () => this.checkOrientation());
    window.addEventListener('pagehide', () => this.autoPause());
  }

  // ───────── 生命週期 ─────────

  /** 目前競技場的配色編號、名稱與玩家獎盃（主畫面依獎盃設定）。 */
  arenaTheme = 0;
  arenaName = '';
  playerTrophies = 0;

  start(deck: string[], level: AiLevel, seed?: number, mode: GameMode = 'normal'): void {
    this.replay = null;
    this.mode = mode;
    this.seed = seed ?? Math.floor(Math.random() * 2 ** 31);
    const pick = new Rng(this.seed ^ 0x5bd1e995);
    const aiDeck = pick.pick(AI_DECKS);
    const game = new Game({ seed: this.seed, decks: [[...deck], [...aiDeck.cards]], mode });
    this.ai = new AiController(game, 1, game.rng.fork(), AI_LEVELS[level]);
    this.begin(game, deck, level, aiDeck.name, aiDeck.cards);
  }

  /** 播放對戰重播：不放電腦對手，雙方都照紀錄出牌（模擬是確定性的，結果會和當時一模一樣）。 */
  startReplay(rep: Replay, owner: 'me' | 'friend' = 'me'): void {
    this.replay = rep;
    this.replayCursor = 0;
    this.replaySpeed = 1;
    this.replayOwner = owner;
    this.mode = rep.mode ?? 'normal';
    this.seed = rep.seed;
    this.arenaTheme = rep.arena;
    this.begin(newReplayGame(rep), rep.decks[0], rep.lvl, rep.foe, rep.decks[1]);
  }

  /** 剛打完（或正在打）的這場的重播資料；重播模式下回傳 null。 */
  replayData(): Replay | null {
    if (this.replay) return null;
    const rep: Replay = { seed: this.seed, decks: [[...this.deck], [...this.aiDeckCards]], actions: [...this.game.actions], foe: this.aiDeckName, lvl: this.level, arena: this.arenaTheme };
    if (this.mode !== 'normal') rep.mode = this.mode;
    return rep;
  }

  get isReplay(): boolean {
    return !!this.replay;
  }

  private begin(game: Game, deck: string[], level: AiLevel, aiDeckName: string, aiDeckCards: string[]): void {
    this.deck = [...deck];
    this.level = level;
    this.renderer.setArenaTheme?.(this.arenaTheme);
    this.aiDeckName = aiDeckName;
    this.aiDeckCards = [...aiDeckCards];
    this.plays = {};
    this.game = game;
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
    $('vs-sub-enemy').textContent = `牌組：${aiDeckName}`;
    const replaying = !!this.replay;
    $('hud-name-me').textContent = replaying && this.replayOwner === 'friend' ? '朋友' : '你';
    $('replay-bar').hidden = !replaying;
    $('btn-replay-speed').textContent = '1×';
    $('btn-emote').hidden = replaying;
    $('vs-sub-me').textContent = `獎盃 ${this.playerTrophies}・平均 ${(deck.reduce((s, id) => s + CARDS[id].cost, 0) / deck.length).toFixed(1)} 能量`;
    const ev = modeInfo(this.mode);
    $('vs-arena').textContent = ev ? `${ev.name}・${this.arenaName}` : this.arenaName;
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
    if (!this.skipIntro && !replaying && Math.random() < 0.5) this.enemyEmote('luck', 2.2);
    this.root.hidden = false;
    this.active = true;
    this.coachStep = this.coach && !replaying ? 1 : 0;
    this.coachT = 0;
    this.coachEl.hidden = true;
    // 重播不播開場 VS 與倒數，直接開始
    const noIntro = this.skipIntro || replaying;
    this.intro = noIntro ? 0 : INTRO_VS + INTRO_COUNT * 4;
    this.sound.stopMusic();
    if (noIntro) {
      this.startMusic();
      this.modeBanner();
    }
    this.introStep = -1;
    this.ovVs.hidden = noIntro;
    this.ovVs.classList.remove('out');
    if (!noIntro) {
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
    this.checkOrientation();
    cancelAnimationFrame(this.raf);
    this.last = performance.now();
    this.raf = requestAnimationFrame(this.frame);
  }

  stop(): void {
    this.active = false;
    cancelAnimationFrame(this.raf);
    this.root.hidden = true;
    $('rotate-hint').hidden = true;
    this.sound.stopMusic();
  }

  private landscape: MediaQueryList | null = null;

  /** 對戰進行中且沒有暫停（返回鍵第一次按下時先暫停用）。 */
  get running(): boolean {
    return this.active && !this.paused && this.game.phase !== 'ended';
  }

  /** 對戰中手機橫拿時顯示提示並暫停；轉回直向後提示消失，由玩家按「繼續」。 */
  private checkOrientation(): void {
    const sideways = !!this.landscape?.matches && this.active;
    $('rotate-hint').hidden = !sideways;
    if (sideways) this.pause('手機橫拿時畫面太小，轉回直向後再繼續。');
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
      this.acc += dt * (this.replay ? this.replaySpeed : 1);
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
    this.updateCoach(dt);
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
      this.startMusic();
      this.modeBanner();
    }
  }

  // ───────── 第一場的新手教學提示（仿新手訓練營：手指示範拖曳出牌，之後提示能量與防守） ─────────

  private setCoachStep(step: number): void {
    this.coachStep = step;
    this.coachT = 0;
  }

  private coachTipAt(text: string, y: number): void {
    if (this.coachTip.textContent !== text) {
      this.coachTip.textContent = text;
      this.coachTip.style.animation = 'none';
      void this.coachTip.offsetWidth;
      this.coachTip.style.animation = '';
    }
    const h = this.coachTip.offsetHeight || 48;
    this.coachTip.style.top = `${Math.max(8, Math.min(window.innerHeight - h - 8, y - h))}px`;
  }

  private placeRing(x: number, y: number): void {
    this.coachRing.hidden = false;
    this.coachRing.style.left = `${x}px`;
    this.coachRing.style.top = `${y}px`;
  }

  private updateCoach(dt: number): void {
    const g = this.game;
    const live = this.coachStep > 0 && this.coachStep < 5 && this.intro <= 0 && !this.paused && g.playing && !this.resultShown;
    this.coachT += live ? dt : 0;
    // 第 3 步是「等電腦的部隊過河」，期間不顯示
    if (live && this.coachStep === 3) {
      const foe = g.entities.find((e) => e.alive && e.team === 1 && e.kind === 'troop' && e.y > ARENA.riverBottom);
      if (foe) this.setCoachStep(4);
    }
    const show = live && this.coachStep !== 3;
    this.coachEl.hidden = !show;
    if (!show) return;
    this.coachHand.hidden = this.coachStep !== 1;
    this.coachRing.hidden = true;
    if (this.coachStep === 1) {
      // 手指從手上第一張出得起的牌，拖到己方國王塔前方
      const p = g.players[0];
      let i = this.handSlots.findIndex((id) => !!id && CARDS[id].cost <= p.elixir);
      if (i < 0) i = 0;
      const cr = this.cards[i].getBoundingClientRect();
      const [tx, ty] = this.screenOf(9, 23);
      const st = this.coachHand.style;
      st.setProperty('--x0', `${Math.round(cr.left + cr.width / 2)}px`);
      st.setProperty('--y0', `${Math.round(cr.top + cr.height * 0.42)}px`);
      st.setProperty('--x1', `${Math.round(tx)}px`);
      st.setProperty('--y1', `${Math.round(ty)}px`);
      this.placeRing(tx, ty);
      this.coachTipAt('按住一張卡，拖到自己這半邊放開，就能派兵', ty - 46);
      if (this.coachT > 30) this.setCoachStep(2);
    } else if (this.coachStep === 2) {
      // 提示放在手牌上方，不擋住卡牌
      this.coachTipAt('出牌會花下方紫色能量條的能量，能量會自己慢慢回滿', this.panel.getBoundingClientRect().top - 12);
      if (this.coachT > 4.5) this.setCoachStep(3);
    } else if (this.coachStep === 4) {
      const foe = g.entities.find((e) => e.alive && e.team === 1 && e.kind === 'troop' && e.y > ARENA.riverBottom - 2);
      if (foe) {
        const [fx, fy] = this.screenOf(foe.x, foe.y);
        this.placeRing(fx, fy);
        this.coachTipAt('電腦的部隊過河了！在它前面出兵把它擋下來', fy - 40);
      } else {
        this.coachTipAt('電腦的部隊過河了！在它前面出兵把它擋下來', window.innerHeight * 0.4);
      }
      if (this.coachT > 4.5) this.setCoachStep(5);
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

  /** 這場的對手與出牌統計（結算時寫進對戰紀錄）。 */
  matchInfo(): { foe: string; foeCards: string[]; level: AiLevel; deck: string[]; plays: Record<string, number>; mode: GameMode } {
    return { foe: this.aiDeckName, foeCards: [...this.aiDeckCards], level: this.level, deck: [...this.deck], plays: { ...this.plays }, mode: this.mode };
  }

  /** 推進一個固定步長（AI 先決策，再模擬）。 */
  simStep(): void {
    if (this.replay) this.replayCursor = applyReplayStep(this.game, this.replay.actions, this.replayCursor);
    else this.ai.update();
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
          if (ev.team === 0) this.plays[ev.cardId] = (this.plays[ev.cardId] ?? 0) + 1;
          if (ev.team === 0 && this.coachStep === 1) this.setCoachStep(2);
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
          this.sound.play(ev.visual === 'ice' ? 'freeze' : ev.visual === 'magic' ? 'magic' : ev.visual === 'volt' ? 'bigBoom' : ev.visual === 'flame-arrow' ? 'fire' : 'boom');
          break;
        case 'death':
          if (ev.kind === 'building') this.sound.play('crumble');
          else if (ev.kind === 'troop' && !ev.kamikaze) this.sound.play('death');
          break;
        case 'towerDown': {
          this.sound.play(ev.isKing ? 'kingDown' : 'tower');
          if (!ev.cascade) this.flyCrowns(ev.team === 1 ? 0 : 1, ev.x, ev.y);
          if (!ev.isKing && !ev.cascade) {
            // 塔倒下的回饋是皇冠飛到上方的皇冠格（不另外跳大字橫幅，避免擋住戰場）
            // 電腦的反應（像真人一樣偶爾發表情）
            this.enemyEmote(ev.team === 1 ? (Math.random() < 0.5 ? 'grr' : 'wow') : Math.random() < 0.5 ? 'haha' : 'good', 0.9);
          }
          break;
        }
        case 'kingActivate':
          this.sound.play('kingWake');
          break;
        case 'spellCast':
          this.sound.play(
            ev.cardId === 'zap' ? 'zap' : ev.cardId === 'log' ? 'log' : ev.cardId === 'poison' ? 'poison' : ev.cardId === 'rage' ? 'rage' : ev.cardId === 'freeze' ? 'freeze' : ev.cardId === 'lightning' ? 'thunder' : ev.cardId === 'graveyard' ? 'magic' : 'whoosh',
          );
          break;
        case 'strike':
          this.sound.play('zap');
          break;
        case 'emerge':
          this.sound.play('dig');
          break;
        case 'elixir':
          if (ev.team === 0) this.sound.play('elixir');
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
        case 'deployHit':
          this.sound.play(ev.visual === 'zap' ? 'zap' : ev.visual === 'frost' ? 'freeze' : 'bigBoom');
          break;
        case 'leap':
          this.sound.play('whoosh');
          break;
        case 'land':
          this.sound.play('bigBoom');
          break;
        case 'stun':
          if (ev.freeze) this.sound.play('freeze');
          break;
        case 'elixirRate':
          this.sound.play('phase');
          this.sound.setMusicIntensity(ev.mult >= 3 ? 2 : 1);
          // 雙倍能量模式進延長賽時同時變 3 倍：由延長賽的橫幅一起說明
          if (this.mode === 'double') break;
          this.banner(ev.mult === 3 ? '能量三倍！' : '能量加倍！', ev.mult === 3 ? (this.mode === 'sudden' ? '最後 60 秒' : '延長賽最後 60 秒') : this.game.phase === 'overtime' ? '' : '最後 60 秒', 'pink');
          break;
        case 'phase':
          if (ev.phase === 'overtime') {
            this.sound.play('overtime');
            this.sound.setMusicIntensity(1);
            this.banner('延長賽！', this.mode === 'double' ? '能量三倍・先推倒任一座塔就獲勝' : '先推倒任一座塔就獲勝', 'gold');
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

  /** 表情圖示：有 3D 指揮官表情貼圖就用貼圖，否則用系統表情符號。 */
  private emoteIcon(id: string, team: 0 | 1): string {
    const e = EMOTES.find((x) => x.id === id) ?? EMOTES[0];
    const url = portraits.emote(e.id, team);
    return url ? `<img class="em-img" src="${url}" alt="" draggable="false" />` : `<span class="em">${e.em}</span>`;
  }

  private toggleEmotes(): void {
    // 表情貼圖在背景產生；開啟時補上已經做好的貼圖
    if (this.emotePicker.childElementCount && !this.emotePicker.querySelector('.em-img') && portraits.emote('good', 0)) this.emotePicker.innerHTML = '';
    if (!this.emotePicker.childElementCount) {
      for (const e of EMOTES) {
        const b = document.createElement('button');
        b.type = 'button';
        b.innerHTML = `${this.emoteIcon(e.id, 0)}${e.text}`;
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
    el.innerHTML = `${this.emoteIcon(e.id, el === this.emoteEnemy ? 1 : 0)}${e.text}`;
    el.hidden = false;
    this.emoteTimers.push(window.setTimeout(() => (el.hidden = true), 2200));
  }

  /** 電腦發表情：同一場最多每 8 秒一次。 */
  private enemyEmote(id: string, delaySec: number): void {
    if (this.replay) return;
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
    this.timeLabel.textContent = ot ? (this.mode === 'sudden' ? '驟死' : '延長賽') : g.phase === 'tiebreak' ? '決勝' : '剩餘時間';
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
    return this.active && !this.paused && this.intro <= 0 && this.game.playing && !this.replay;
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
    if (this.replay) return false;
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
      this.again();
    });
    $('btn-quit').addEventListener('click', () => this.host.onQuit());
    $('btn-again').addEventListener('click', () => {
      this.sound.unlock();
      this.again();
    });
    $('btn-replay-speed').addEventListener('click', () => {
      this.replaySpeed = this.replaySpeed >= 4 ? 1 : this.replaySpeed * 2;
      $('btn-replay-speed').textContent = `${this.replaySpeed}×`;
      this.sound.play('tap');
    });
    $('btn-replay-exit').addEventListener('click', () => this.host.onQuit());
    $('btn-result-replay').addEventListener('click', () => {
      const rep = this.replayData();
      if (!rep) return;
      this.sound.unlock();
      this.startReplay(rep, 'me');
    });
    $('btn-result-home').addEventListener('click', () => this.host.onQuit());
    $('btn-result-deck').addEventListener('click', () => this.host.onDeck());
    $('btn-share-result').addEventListener('click', () => void this.shareResult());
  }

  /** 「再戰一場」：一般對戰重新開打；重播模式下從頭再看一次。 */
  private again(): void {
    if (this.replay) this.startReplay(this.replay, this.replayOwner);
    else this.start(this.deck, this.level, undefined, this.mode);
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
    if (this.intro <= 0 && this.game.playing) this.startMusic();
  }

  /** 活動對戰開打時用橫幅提醒規則。 */
  private modeBanner(): void {
    const ev = modeInfo(this.mode);
    if (ev) this.banner(`${ev.name}！`, ev.rule, this.mode === 'sudden' ? 'gold' : 'pink');
  }

  /** 背景音樂的節奏跟著能量倍率（開場就加倍的活動模式也一樣）。 */
  private startMusic(): void {
    this.sound.startMusic();
    const m = this.game.elixirMultiplier();
    this.sound.setMusicIntensity(m >= 3 ? 2 : m >= 2 ? 1 : 0);
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
    $('result-reason').textContent = REASON_TEXT[r.reason](r.winner, this.mode === 'sudden');
    const who = this.replay && this.replayOwner === 'friend' ? '朋友' : '你';
    const ev = modeInfo(this.mode);
    $('result-stats').textContent =
      `${ev ? `${ev.name}・` : ''}對手：${LEVEL_NAME[this.level]}電腦（${this.aiDeckName}）\n${who}出牌 ${p.cardsPlayed} 張、花費 ${Math.round(p.elixirSpent)} 能量・對戰 ${fmtTime(r.time)}`;
    $('btn-share-result').textContent = '分享戰績給朋友';
    $('share-manual-result').hidden = true;
    // 重播：不計獎盃與戰績，按鈕改成「再看一次」
    const replaying = !!this.replay;
    $('btn-again').textContent = replaying ? '再看一次' : '再戰一場';
    $('btn-result-deck').hidden = replaying;
    $('btn-share-result').hidden = replaying;
    $('btn-result-replay').hidden = replaying;
    if (replaying) $('result-trophies').hidden = true;
    $('result-name-me').textContent = who;
    this.ovResult.hidden = false;
    this.sound.play(r.winner === 0 ? 'win' : r.winner === 1 ? 'lose' : 'draw');
    if (!replaying) this.host.onResult(r);
  }

  private async shareResult(): Promise<void> {
    const r = this.game.result;
    if (!r) return;
    const [a, b] = r.crowns;
    const lv = LEVEL_NAME[this.level];
    const ev = modeInfo(this.mode);
    const where = ev ? `《皇室戰爭克隆》的「${ev.name}」活動` : '《皇室戰爭克隆》';
    const text =
      r.winner === 0
        ? `我在${where}以 ${a}:${b} 打贏${lv}電腦！三分鐘一局，點開就能玩：`
        : r.winner === 1
          ? `我在${where}以 ${a}:${b} 輸給${lv}電腦了，換你來挑戰：`
          : `我在${where}和${lv}電腦打成平手，你能贏嗎？`;
    const btn = $('btn-share-result');
    // 分享的連結附上這場的重播：朋友點開可以先看你怎麼打，再自己玩
    const rep = this.replayData();
    const url = rep ? `${shareUrl()}?replay=${encodeReplay(rep)}` : shareUrl();
    const outcome = await shareGame(`${text}`, url);
    if (outcome === 'copied') btn.textContent = '已複製戰績與重播連結！';
    else if (outcome === 'manual') {
      const box = $('share-manual-result');
      const input = $<HTMLInputElement>('share-input-result');
      input.value = url;
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
    case 'ranger':
      return 'bow';
    case 'storm_mage':
      return 'zap';
    case 'volt_cart':
      return 'thunder';
    case 'frost_mage':
      return 'magic';
    case 'axe_thrower':
      return 'whoosh';
    case 'inferno_drake':
      return 'beam';
    case 'hammer_knight':
    case 'heavy_warrior':
      return 'heavyHit';
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
