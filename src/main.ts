import './style.css';
import { AiController, AI_LEVELS, CARD_IDS, CARDS, DEFAULT_PLAYER_DECK, canHitAir, isValidDeck, type AiLevel } from './sim';
import { Sound } from './ui/audio';
import { Battle } from './ui/battle';
import { avgCost, cardTags, fillCard } from './ui/cardview';
import { loadSettings, saveSettings } from './ui/settings';
import { shareGame, shareUrl } from './ui/share';

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

const settings = loadSettings();
const sound = new Sound();
sound.muted = settings.muted;

const params = new URLSearchParams(location.search);
const testMode = params.get('test') === '1';
const fixedSeed = params.has('seed') ? Number(params.get('seed')) : undefined;

const home = $('screen-home');
const deckScreen = $('screen-deck');
const howto = $('ov-howto');

let deckReturn: 'home' | 'battle-result' = 'home';
let draftDeck: string[] = [];
let afterHowto: (() => void) | null = null;

const battle = new Battle(sound, {
  onResult(r) {
    if (r.winner === 0) settings.record.win++;
    else if (r.winner === 1) settings.record.lose++;
    else settings.record.draw++;
    saveSettings(settings);
  },
  onQuit() {
    battle.stop();
    showHome();
  },
  onDeck() {
    battle.stop();
    openDeck('home');
  },
});

// ───────── 主畫面 ─────────

function showHome(): void {
  deckScreen.hidden = true;
  home.hidden = false;
  renderHome();
}

function renderHome(): void {
  const box = $('home-deck-cards');
  box.innerHTML = '';
  for (const id of settings.deck) {
    const el = document.createElement('div');
    el.className = 'card';
    fillCard(el, id);
    box.appendChild(el);
  }
  $('home-avg').textContent = `平均 ${avgCost(settings.deck).toFixed(1)} 能量`;
  const { win, lose, draw } = settings.record;
  $('home-record').textContent = win + lose + draw > 0 ? `本機戰績：${win} 勝 ${lose} 敗${draw ? ` ${draw} 平` : ''}` : '';
  document.querySelectorAll<HTMLButtonElement>('.seg-btn').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.diff === settings.level)));
  renderMute();
}

function renderMute(): void {
  const label = settings.muted ? '音效：關' : '音效：開';
  for (const id of ['btn-mute-home', 'btn-mute-pause']) {
    const b = $(id);
    b.textContent = label;
    b.setAttribute('aria-pressed', String(settings.muted));
  }
}

function toggleMute(): void {
  settings.muted = !settings.muted;
  sound.muted = settings.muted;
  if (!settings.muted) {
    sound.unlock();
    sound.play('tap');
  }
  saveSettings(settings);
  renderMute();
}

function startBattle(): void {
  // 音訊必須在使用者點擊的處理函式內啟用；失敗時維持無聲繼續
  sound.unlock();
  home.hidden = true;
  deckScreen.hidden = true;
  battle.start(settings.deck, settings.level, fixedSeed);
}

function showHowto(then: (() => void) | null): void {
  afterHowto = then;
  howto.hidden = false;
  $('btn-howto-ok').textContent = then ? '知道了，開始！' : '知道了';
}

$('btn-play').addEventListener('click', () => {
  sound.unlock();
  if (!settings.howtoSeen) {
    showHowto(startBattle);
    return;
  }
  startBattle();
});
$('btn-howto').addEventListener('click', () => showHowto(null));
$('btn-howto-ok').addEventListener('click', () => {
  howto.hidden = true;
  settings.howtoSeen = true;
  saveSettings(settings);
  const next = afterHowto;
  afterHowto = null;
  if (next) next();
});
$('btn-deck').addEventListener('click', () => openDeck('home'));
$('btn-mute-home').addEventListener('click', toggleMute);
$('btn-mute-pause').addEventListener('click', toggleMute);
document.querySelectorAll<HTMLButtonElement>('.seg-btn').forEach((b) =>
  b.addEventListener('click', () => {
    settings.level = (b.dataset.diff as AiLevel) ?? 'normal';
    saveSettings(settings);
    renderHome();
  }),
);
$('btn-share-home').addEventListener('click', async () => {
  const btn = $('btn-share-home');
  const outcome = await shareGame('來玩《皇室戰爭克隆》（非官方）：出牌派兵、過橋推塔，三分鐘一局，手機點開就能玩！');
  if (outcome === 'copied') {
    btn.textContent = '已複製遊戲連結！';
    setTimeout(() => (btn.textContent = '分享遊戲連結給朋友'), 2200);
  } else if (outcome === 'manual') {
    const input = $<HTMLInputElement>('share-input-home');
    input.value = shareUrl();
    $('share-manual-home').hidden = false;
    input.focus();
    input.select();
  }
});

// ───────── 牌組編輯 ─────────

function openDeck(ret: 'home' | 'battle-result'): void {
  deckReturn = ret;
  draftDeck = [...settings.deck];
  home.hidden = true;
  deckScreen.hidden = false;
  renderDeck();
}

function renderDeck(): void {
  const grid = $('deck-grid');
  if (!grid.childElementCount) {
    for (const id of CARD_IDS) {
      const c = CARDS[id];
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'tile';
      tile.dataset.card = id;
      const face = document.createElement('span');
      face.className = 'card';
      fillCard(face, id);
      const info = document.createElement('span');
      info.className = 'tile-info';
      info.innerHTML = `<span class="card-name">${c.name}</span><span class="tile-tags">${cardTags(c).join('・')}</span><span class="tile-role">${c.role}</span>`;
      tile.append(face, info);
      tile.addEventListener('click', () => toggleDeckCard(id));
      grid.appendChild(tile);
    }
  }
  grid.querySelectorAll<HTMLElement>('.tile').forEach((t) => {
    const inDeck = draftDeck.includes(t.dataset.card!);
    t.classList.toggle('in', inDeck);
    t.setAttribute('aria-pressed', String(inDeck));
  });
  const n = draftDeck.length;
  const count = $('deck-count');
  count.textContent = `${n}/8`;
  count.classList.toggle('bad', n !== 8);
  $('deck-avg').textContent = n ? `平均 ${avgCost(draftDeck).toFixed(1)} 能量` : '';
  const done = $<HTMLButtonElement>('btn-deck-done');
  done.disabled = n !== 8;
  const hint = $('deck-hint');
  const noAir = n === 8 && !draftDeck.some((id) => canHitAir(CARDS[id]));
  hint.classList.toggle('warn', noAir);
  hint.textContent =
    n < 8 ? `再選 ${8 - n} 張卡牌。` : noAir ? '提醒：這副牌沒有能打飛行單位的卡，容易被蝙蝠和幼龍突破。' : '點卡牌加入或移出牌組，需要剛好 8 張。';
}

function toggleDeckCard(id: string): void {
  const i = draftDeck.indexOf(id);
  if (i >= 0) draftDeck.splice(i, 1);
  else if (draftDeck.length < 8) draftDeck.push(id);
  else {
    const hint = $('deck-hint');
    hint.textContent = '牌組已滿 8 張，先點一張已選的卡移除。';
    hint.classList.add('warn');
    sound.play('error');
    return;
  }
  sound.play('tap');
  renderDeck();
}

$('btn-deck-done').addEventListener('click', () => {
  if (!isValidDeck(draftDeck)) return;
  settings.deck = [...draftDeck];
  saveSettings(settings);
  if (deckReturn === 'battle-result') startBattle();
  else showHome();
});
$('btn-deck-reset').addEventListener('click', () => {
  draftDeck = [...DEFAULT_PLAYER_DECK];
  renderDeck();
});

// ───────── 視窗高度（處理手機瀏覽器工具列伸縮） ─────────

function syncHeight(): void {
  const h = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty('--app-h', `${Math.round(h)}px`);
}
syncHeight();
window.addEventListener('resize', syncHeight);
window.visualViewport?.addEventListener('resize', syncHeight);
window.addEventListener('orientationchange', () => setTimeout(syncHeight, 300));

// ───────── 自動測試掛鉤（只在網址帶 ?test=1 時啟用） ─────────

if (testMode) {
  (window as unknown as Record<string, unknown>).__btd = {
    battle,
    settings,
    sound,
    game: () => battle.game,
    /** 以玩家側 AI 代打並快轉 sec 秒（用於多場穩定性測試）。 */
    autoplay(sec: number): void {
      const g = battle.game;
      const bot = new AiController(g, 0, g.rng.fork(), AI_LEVELS.normal);
      const steps = Math.round(sec * 30);
      for (let i = 0; i < steps && g.phase !== 'ended'; i++) {
        bot.update();
        battle.simStep();
      }
    },
    fastForward(sec: number): void {
      const steps = Math.round(sec * 30);
      for (let i = 0; i < steps && battle.game.phase !== 'ended'; i++) battle.simStep();
    },
  };
}

// ───────── 開機 ─────────

(window as unknown as { __booted?: boolean }).__booted = true;
const bootFill = document.getElementById('boot-fill');
if (bootFill) bootFill.style.width = '100%';
document.getElementById('boot')?.remove();
showHome();
