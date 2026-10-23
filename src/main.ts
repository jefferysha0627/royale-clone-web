import './style.css';
import { AiController, AI_LEVELS, CARD_IDS, CARDS, Rng, UNITS, canHitAir, decodeReplay, encodeReplay, isValidDeck, runReplay, type AiLevel, type CardDef, type Replay } from './sim';
import { Sound } from './ui/audio';
import { Battle } from './ui/battle';
import { avgCost, cardTags, fillCard, rarityName, refreshPortraits } from './ui/cardview';
import { profileRows, recordBattle, renderBattleLog } from './ui/profile';
import { ARENAS, arenaIndex, arenaOf, arenaProgress, trophyDelta } from './ui/progress';
import { DECK_PRESETS, DECK_SLOTS, loadSettings, saveSettings, useSlot } from './ui/settings';
import { shareGame, shareUrl } from './ui/share';
import { ARENA_THEMES, themeIndex } from './render3d/arena';
import { portraits } from './render3d/portraits';

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
const cardSheet = $('ov-card');

let deckReturn: 'home' | 'battle-result' = 'home';
/** 牌組畫面裡三個欄位的草稿（按「完成」才存）；draftDeck 指向目前欄位那一副。 */
let draftDecks: string[][] = [];
let draftSlot = 0;
let draftDeck: string[] = [];
let afterHowto: (() => void) | null = null;
/** 牌組已滿時選了「使用」：等玩家點一張牌組內的卡來替換。 */
let swapIn: string | null = null;
let infoCard: string | null = null;
/** 這場打完升到的新競技場（回主畫面時播解鎖畫面）。 */
let pendingUnlock: number | null = null;

const battle = new Battle(sound, {
  onResult(r) {
    // 打完第一場就不再顯示新手教學（包含直接按「再戰一場」）
    settings.coachDone = true;
    battle.coach = false;
    if (r.winner === 0) settings.record.win++;
    else if (r.winner === 1) settings.record.lose++;
    else settings.record.draw++;
    const before = settings.trophies;
    const delta = trophyDelta(settings.level, r.winner, r.crowns[0], before);
    settings.trophies = Math.max(0, before + delta);
    const rep = battle.replayData();
    recordBattle(settings, r, battle.matchInfo(), settings.trophies - before, Date.now(), rep ? encodeReplay(rep) : undefined);
    saveSettings(settings);
    showTrophyResult(delta, before, settings.trophies);
    // 升到新競技場：回主畫面時播放解鎖畫面（先準備好場景圖）
    if (arenaIndex(settings.trophies) > arenaIndex(before)) {
      pendingUnlock = arenaIndex(settings.trophies);
      portraits.requestArt([ARENAS[pendingUnlock].theme]);
    }
    syncArena();
  },
  onQuit() {
    dropBattleEntry();
    battle.stop();
    showHome();
  },
  onDeck() {
    dropBattleEntry();
    battle.stop();
    openDeck('home');
  },
});

// ───────── 返回鍵（Android 返回鍵、iOS 側滑返回、IG／Threads 內建瀏覽器的返回） ─────────
// 對戰時在瀏覽紀錄放一筆；第一次按返回只暫停（不會直接離開網頁），暫停中或結算時再按返回才回主畫面。
let battleEntry = false;
let ignorePop = false;

function pushBattleEntry(): void {
  if (battleEntry) return;
  try {
    history.pushState({ btd: 'battle' }, '');
    battleEntry = true;
  } catch {
    // 不能寫瀏覽紀錄時照常遊玩
  }
}

function dropBattleEntry(): void {
  if (!battleEntry) return;
  battleEntry = false;
  ignorePop = true;
  history.back();
}

window.addEventListener('popstate', () => {
  if (ignorePop) {
    ignorePop = false;
    return;
  }
  battleEntry = false;
  if (!battle.isActive) return;
  if (battle.running) {
    battle.pause('按了返回：先暫停對戰。再按一次返回會回到主畫面。');
    pushBattleEntry();
  } else {
    battle.stop();
    showHome();
  }
});

// ───────── 獎盃 ─────────

const TROPHY_SVG = $('home-trophies').previousElementSibling?.outerHTML ?? '';

/** 把目前獎盃對應的競技場交給對戰畫面（下一場生效，含「再戰一場」）。 */
function syncArena(): void {
  const arena = arenaOf(settings.trophies);
  battle.arenaTheme = arena.theme;
  battle.arenaName = arena.name;
  battle.playerTrophies = settings.trophies;
}

function showTrophyResult(delta: number, before: number, after: number): void {
  const el = $('result-trophies');
  const promoted = arenaIndex(after) > arenaIndex(before);
  const sign = delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : '±0';
  el.innerHTML = `${TROPHY_SVG}${sign}<small>獎盃 ${after}${promoted ? `・解鎖新競技場「${arenaOf(after).name}」！` : ''}</small>`;
  el.classList.toggle('down', delta < 0);
  el.hidden = false;
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
}

// ───────── 主畫面 ─────────

function showHome(): void {
  deckScreen.hidden = true;
  home.hidden = false;
  renderHome();
  if (pendingUnlock !== null) {
    const i = pendingUnlock;
    pendingUnlock = null;
    showUnlock(i);
  }
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
  renderSlotTabs($('home-deck-tabs'), settings.slot, (i) => {
    useSlot(settings, i);
    saveSettings(settings);
    sound.play('tap');
    renderHome();
  });
  const { win, lose, draw } = settings.record;
  $('home-record').textContent = win + lose + draw > 0 ? `本機戰績 ${win} 勝 ${lose} 敗${draw ? ` ${draw} 平` : ''}` : '還沒有戰績';
  $('home-trophies').textContent = String(settings.trophies);
  const arena = arenaOf(settings.trophies);
  const prog = arenaProgress(settings.trophies);
  $('home-arena').textContent = arena.name;
  $('home-arena-fill').style.width = `${Math.round(prog.frac * 100)}%`;
  $('home-arena-next').textContent = prog.next ? `再 ${prog.need} 座獎盃解鎖「${prog.next.name}」` : '已到達最高競技場';
  document.querySelectorAll<HTMLButtonElement>('.seg-btn').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.diff === settings.level)));
  renderMute();
  // 主畫面插圖是目前競技場的小場景（換競技場時跟著換）
  const art = portraits.arenaArt(arena.theme);
  if (art === undefined) portraits.requestArt([arena.theme]);
  const img = $<HTMLImageElement>('hero-img');
  if (art) {
    if (img.src !== art) img.src = art;
    img.hidden = false;
    $('hero-fallback').hidden = true;
  }
}

// ───────── 獎盃之路與新競技場 ─────────

const LOCK_SVG = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 8V6a4 4 0 1 1 8 0v2h1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1zm2 0h4V6a2 2 0 1 0-4 0z" /></svg>';
const roadOv = $('ov-road');
const unlockOv = $('ov-unlock');

/** 競技場圖還沒產生好時，先用該場地的草地配色當底。 */
function arenaBg(theme: number): string {
  const pal = ARENA_THEMES[themeIndex(theme)];
  return `radial-gradient(ellipse 46% 40% at 50% 54%, ${pal.grassA} 0 70%, ${pal.outside} 72%, transparent 100%)`;
}

function openRoad(): void {
  const list = $('road-list');
  list.innerHTML = '';
  const t = settings.trophies;
  const cur = arenaIndex(t);
  const prog = arenaProgress(t);
  portraits.requestArt(ARENAS.map((a) => a.theme));
  // 由高到低排（往上爬），目前所在的競技場捲到畫面中間
  for (let i = ARENAS.length - 1; i >= 0; i--) {
    const a = ARENAS[i];
    const li = document.createElement('li');
    li.className = `road-item ${i === cur ? 'current' : i < cur ? 'done' : 'locked'}`;
    li.dataset.arena = String(i);
    const art = document.createElement('div');
    art.className = 'road-art';
    art.style.background = arenaBg(a.theme);
    const img = document.createElement('img');
    img.alt = '';
    img.dataset.theme = String(a.theme);
    img.hidden = true;
    art.appendChild(img);
    if (i > cur) art.insertAdjacentHTML('beforeend', `<span class="road-lock">${LOCK_SVG}</span>`);
    const info = document.createElement('div');
    info.className = 'road-info';
    // 「目前所在」與距離下一座分兩行，避免窄螢幕把最後一個字擠到下一行
    const status =
      i === cur ? (prog.next ? `目前所在<br>再 ${prog.need} 座獎盃升級` : '目前所在<br>已是最高競技場') : i < cur ? '已解鎖' : `還差 ${a.min - t} 座獎盃`;
    info.innerHTML = `<b>${a.name}</b><span class="road-min">${TROPHY_SVG}${a.min}</span><small>${status}</small>`;
    li.append(art, info);
    list.appendChild(li);
  }
  fillRoadArt();
  $('road-count').textContent = String(t);
  roadOv.hidden = false;
  list.querySelector<HTMLElement>('.road-item.current')?.scrollIntoView({ block: 'center' });
  sound.play('tap');
}

function fillRoadArt(): void {
  roadOv.querySelectorAll<HTMLImageElement>('img[data-theme]').forEach((img) => {
    const url = portraits.arenaArt(Number(img.dataset.theme));
    if (!url) return;
    if (img.src !== url) img.src = url;
    img.hidden = false;
  });
}

function showUnlock(i: number): void {
  const a = ARENAS[i];
  $('unlock-name').textContent = a.name;
  $('unlock-note').textContent = `獎盃達到 ${a.min}，接下來的對戰都在這裡進行。`;
  const img = $<HTMLImageElement>('unlock-img');
  img.dataset.theme = String(a.theme);
  img.removeAttribute('src');
  img.hidden = true;
  $('ov-unlock').querySelector<HTMLElement>('.unlock-art')!.style.background = arenaBg(a.theme);
  portraits.requestArt([a.theme]);
  fillUnlockArt();
  unlockOv.hidden = false;
  sound.play('unlockArena');
}

function fillUnlockArt(): void {
  const img = $<HTMLImageElement>('unlock-img');
  const url = portraits.arenaArt(Number(img.dataset.theme));
  if (!url) return;
  if (img.src !== url) img.src = url;
  img.hidden = false;
  img.parentElement!.style.background = '';
}

// ───────── 個人資料與對戰紀錄 ─────────

const profileOv = $('ov-profile');

function openProfile(): void {
  $('profile-trophies').textContent = String(settings.trophies);
  $('profile-arena').textContent = arenaOf(settings.trophies).name;
  $('profile-stats').innerHTML = profileRows(settings)
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join('');
  renderBattleLog($('profile-log'), settings.log, 10, Date.now(), (rep) => {
    profileOv.hidden = true;
    watchReplay(rep, 'me');
  });
  profileOv.hidden = false;
  profileOv.querySelector('.profile-scroll')!.scrollTop = 0;
  sound.play('tap');
}

$('btn-profile').addEventListener('click', openProfile);

// ───────── 對戰重播（自己的紀錄，或朋友分享的連結） ─────────

function watchReplay(s: string | Replay, owner: 'me' | 'friend'): boolean {
  const rep = typeof s === 'string' ? decodeReplay(s) : s;
  if (!rep) return false;
  sound.unlock();
  home.hidden = true;
  deckScreen.hidden = true;
  battle.arenaName = ARENAS.find((a) => a.theme === rep.arena)?.name ?? '';
  battle.startReplay(rep, owner);
  pushBattleEntry();
  return true;
}

const LEVEL_TEXT: Record<AiLevel, string> = { easy: '簡單', normal: '普通', hard: '困難' };
let invited: Replay | null = null;

/** 網址帶 ?replay=：先在主畫面問要不要看朋友分享的重播（結果先用無畫面模擬算出來）。 */
function offerSharedReplay(): void {
  const s = params.get('replay');
  if (!s) return;
  // 不留在網址上，重新整理不會一直跳出來
  try {
    history.replaceState(history.state, '', location.pathname);
  } catch {
    // 忽略
  }
  const rep = decodeReplay(s);
  const ov = $('ov-replay-invite');
  if (!rep) {
    $('replay-invite-title').textContent = '這個重播無法播放';
    $('replay-invite-info').textContent = '可能來自不同版本的遊戲。直接開始玩吧！';
    $('replay-invite-decks').innerHTML = '';
    $<HTMLButtonElement>('btn-replay-watch').hidden = true;
    ov.hidden = false;
    return;
  }
  invited = rep;
  const r = runReplay(rep).result;
  const outcome = !r ? '' : r.winner === 0 ? `朋友 ${r.crowns[0]}:${r.crowns[1]} 獲勝` : r.winner === 1 ? `朋友 ${r.crowns[0]}:${r.crowns[1]} 落敗` : `雙方 ${r.crowns[0]}:${r.crowns[1]} 平手`;
  $('replay-invite-info').textContent = `對手：${LEVEL_TEXT[rep.lvl]}電腦（${rep.foe}）${outcome ? `・${outcome}` : ''}`;
  const decks = $('replay-invite-decks');
  decks.innerHTML = '';
  rep.decks.forEach((d, i) => {
    const label = document.createElement('small');
    label.textContent = i === 0 ? '朋友的牌組' : '電腦的牌組';
    const row = document.createElement('div');
    row.className = 'mini-deck';
    for (const id of d) {
      const el = document.createElement('div');
      el.className = 'card';
      fillCard(el, id);
      row.appendChild(el);
    }
    decks.append(label, row);
  });
  ov.hidden = false;
}

$('btn-replay-watch').addEventListener('click', () => {
  $('ov-replay-invite').hidden = true;
  if (invited) watchReplay(invited, 'friend');
});
$('btn-replay-skip').addEventListener('click', () => {
  $('ov-replay-invite').hidden = true;
  sound.play('tap');
});
$('btn-profile-close').addEventListener('click', () => {
  profileOv.hidden = true;
});
profileOv.addEventListener('click', (e) => {
  if (e.target === profileOv) profileOv.hidden = true;
});

$('btn-road').addEventListener('click', openRoad);
$('btn-road-close').addEventListener('click', () => {
  roadOv.hidden = true;
});
roadOv.addEventListener('click', (e) => {
  if (e.target === roadOv) roadOv.hidden = true;
});
$('btn-unlock-ok').addEventListener('click', () => {
  unlockOv.hidden = true;
  sound.play('tap');
});

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
  syncArena();
  battle.coach = !settings.coachDone;
  battle.start(settings.deck, settings.level, fixedSeed);
  pushBattleEntry();
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
    sound.unlock();
    sound.play('tap');
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

/** 牌組欄位分頁（主畫面與牌組畫面共用）。 */
function renderSlotTabs(box: HTMLElement, active: number, onPick: (i: number) => void): void {
  if (box.childElementCount !== DECK_SLOTS) {
    box.innerHTML = '';
    for (let i = 0; i < DECK_SLOTS; i++) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'slot-tab';
      b.setAttribute('role', 'tab');
      b.dataset.slot = String(i);
      b.innerHTML = box.classList.contains('mini') ? `<span>${i + 1}</span>` : `<span>牌組 ${i + 1}</span>`;
      b.setAttribute('aria-label', `牌組 ${i + 1}`);
      b.addEventListener('click', () => onPick(Number(b.dataset.slot)));
      box.appendChild(b);
    }
  }
  box.querySelectorAll<HTMLButtonElement>('.slot-tab').forEach((b, i) => {
    b.setAttribute('aria-selected', String(i === active));
    b.classList.toggle('active', i === active);
  });
}

function openDeck(ret: 'home' | 'battle-result'): void {
  deckReturn = ret;
  draftDecks = settings.decks.map((d) => [...d]);
  draftSlot = settings.slot;
  draftDeck = draftDecks[draftSlot];
  swapIn = null;
  home.hidden = true;
  deckScreen.hidden = false;
  renderDeck();
}

function pickDraftSlot(i: number): void {
  if (i === draftSlot) return;
  // 目前這副還沒補滿 8 張時不能換欄位（避免留下不完整的牌組）
  if (draftDeck.length !== 8) {
    const hint = $('deck-hint');
    hint.textContent = '先把這副牌補滿 8 張，才能換到其他牌組。';
    hint.classList.add('warn');
    sound.play('error');
    return;
  }
  draftSlot = i;
  draftDeck = draftDecks[i];
  swapIn = null;
  sound.play('tap');
  renderDeck();
}

function renderDeck(): void {
  renderSlotTabs($('deck-tabs'), draftSlot, pickDraftSlot);
  const slots = $('deck-slots');
  slots.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const id = draftDeck[i];
    if (!id) {
      const e = document.createElement('div');
      e.className = 'slot-empty';
      slots.appendChild(e);
      continue;
    }
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'card';
    fillCard(b, id);
    b.addEventListener('click', () => onDeckSlot(id));
    slots.appendChild(b);
  }
  slots.classList.toggle('swap', swapIn !== null);

  const grid = $('deck-grid');
  if (!grid.childElementCount) {
    const order = [...CARD_IDS].sort((a, b) => CARDS[a].cost - CARDS[b].cost || a.localeCompare(b));
    for (const id of order) {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'tile';
      tile.dataset.card = id;
      const face = document.createElement('span');
      face.className = 'card';
      fillCard(face, id);
      const lvl = document.createElement('span');
      lvl.className = 'tile-lvl';
      lvl.textContent = `${rarityName(CARDS[id].rarity)}・11 級`;
      tile.append(face, lvl);
      tile.addEventListener('click', () => openInfo(id));
      grid.appendChild(tile);
    }
    $('collection-note').textContent = `${CARD_IDS.length} 張・全部 11 級`;
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
  $('deck-avg-num').textContent = n ? avgCost(draftDeck).toFixed(1) : '0';
  $('deck-avg').textContent = '平均能量';
  const done = $<HTMLButtonElement>('btn-deck-done');
  done.disabled = n !== 8;
  const hint = $('deck-hint');
  const noAir = n === 8 && !draftDeck.some((id) => canHitAir(CARDS[id]));
  hint.classList.toggle('warn', noAir || swapIn !== null);
  hint.textContent =
    swapIn !== null
      ? `點上方牌組中的一張卡，換成「${CARDS[swapIn].name}」。`
      : n < 8
        ? `再選 ${8 - n} 張卡牌。點卡牌看數值，再按「使用」。`
        : noAir
          ? '提醒：這副牌沒有能打飛行單位的卡，容易被蝙蝠和幼龍突破。'
          : '點卡牌看詳細數值，再選「使用」或「移出」。';
}

function onDeckSlot(id: string): void {
  if (swapIn) {
    const i = draftDeck.indexOf(id);
    if (i >= 0) draftDeck[i] = swapIn;
    swapIn = null;
    sound.play('tap');
    renderDeck();
    return;
  }
  openInfo(id);
}

function openInfo(id: string): void {
  infoCard = id;
  swapIn = null;
  const c = CARDS[id];
  fillCard($('info-card'), id);
  $('info-name').textContent = c.name;
  $('info-meta').textContent = `${rarityName(c.rarity)}・${c.cost} 能量・${cardTags(c).join('・')}`;
  $('info-role').textContent = c.role;
  const dl = $('info-stats');
  dl.innerHTML = statRows(c)
    .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`)
    .join('');
  const inDeck = draftDeck.includes(id);
  const use = $('btn-info-use');
  use.textContent = inDeck ? '移出牌組' : '使用';
  use.classList.toggle('primary', !inDeck);
  cardSheet.hidden = false;
  sound.play('tap');
}

const speedName = (v: number): string => (v >= 2 ? '極快' : v >= 1.5 ? '快' : v >= 1 ? '中等' : '慢');

/** 卡牌資訊畫面的數值列（11 級，依公開資料校準）。 */
function statRows(c: CardDef): [string, string][] {
  if (c.kind === 'spell') {
    const s = c.spell!;
    const rows: [string, string][] = [];
    if (s.spawn) rows.push(['召喚', `${UNITS[s.spawn.unit].name} ×${s.spawn.count}`]);
    if (s.damage > 0) {
      const waves = s.waves ?? 1;
      rows.push([s.kind === 'area' ? '每秒傷害' : '傷害', waves > 1 ? `${s.damage} ×${waves}` : String(s.damage)]);
      rows.push(['對塔傷害', String(Math.round(s.damage * s.towerPct) * waves * (s.kind === 'area' ? s.duration! : 1))]);
    }
    rows.push(['範圍', s.kind === 'roll' ? `寬 ${(s.radius * 2).toFixed(1)}・長 ${s.rollRange} 格` : `半徑 ${s.radius} 格`]);
    if (s.stun) rows.push([s.freeze ? '冰凍' : '暈眩', `${s.stun} 秒`]);
    if (s.bolts) rows.push(['劈擊', `範圍內血量最高的 ${s.bolts} 個目標，每個 1 道`]);
    if (s.pull) rows.push(['拉力', `把敵方部隊拉向中心（每秒 ${s.pull} 格）`]);
    if (s.graveyard) rows.push(['召喚', `${UNITS[s.graveyard.unit].name} ×${s.graveyard.count}（${s.graveyard.delay} 秒後每 ${s.graveyard.interval} 秒一隻）`]);
    if (s.rage) rows.push(['加速', `移動與攻擊 +${Math.round((s.rage.mul - 1) * 100)}%，離開後再 ${s.rage.linger} 秒`]);
    if (s.duration) rows.push(['持續', `${s.duration} 秒`]);
    if (s.slow) rows.push(['緩速', `${Math.round(s.slow * 100)}%`]);
    if (s.pushback) rows.push(['擊退', `${s.pushback} 格`]);
    rows.push(['目標', s.rage ? '己方部隊與建築' : s.hitsAir ? '空中與地面' : '只打地面']);
    return rows;
  }
  const u = UNITS[c.unit!].stats;
  const rows: [string, string][] = [['生命值', String(u.hp)]];
  if (u.ramp) rows.push(['傷害', u.ramp.damages.join(' → ')]);
  else if (u.damage > 0) rows.push([u.splash || u.projectile?.splash ? '範圍傷害' : '傷害', String(u.damage)]);
  if (u.damage > 0 && !u.kamikaze) rows.push(['攻擊間隔', `${u.hitSpeed} 秒`]);
  if (u.damage > 0) rows.push(['射程', u.range >= 2 ? `${u.range} 格${u.minRange ? `（${u.minRange} 格內打不到）` : ''}` : `近戰（${u.range}）`]);
  if (u.speed > 0) rows.push(['移動速度', speedName(u.speed)]);
  if (u.damage > 0 || u.ramp) rows.push(['目標', u.targets === 'buildings' ? '只打建築' : u.targets === 'ground' ? '地面' : '空中與地面']);
  rows.push(['部署時間', `${u.deployTime} 秒`]);
  if ((c.count ?? 1) > 1) rows.push(['數量', `×${c.count}`]);
  if (u.lifetime) rows.push(['存在時間', `${u.lifetime} 秒`]);
  if (u.charge) rows.push(['衝鋒傷害', String(u.charge.damage)]);
  if (u.deathDamage) rows.push(['死亡傷害', String(u.deathDamage.damage)]);
  if (u.spawner) rows.push(['召喚', `${UNITS[u.spawner.unit].name} ×${u.spawner.count}／${u.spawner.pause} 秒`]);
  if (u.deathSpawn) rows.push(['死亡時', `${UNITS[u.deathSpawn.unit].name} ×${u.deathSpawn.count}`]);
  if (u.projectile?.freeze) rows.push(['冰凍', `${u.projectile.freeze} 秒`]);
  if (u.jumpsRiver) rows.push(['特性', '可跳過河']);
  if (u.kamikaze && !u.projectile) rows.push(['特性', '撞到建築就解體']);
  if (u.towerMul !== undefined) rows.push(['對塔傷害', String(Math.round(u.damage * u.towerMul))]);
  if (u.tunnelSpeed) rows.push(['特性', '可部署到場上任何地方（從地底鑽過去）']);
  if (u.elixirGen) rows.push(['產生能量', `每 ${u.elixirGen.interval} 秒 +${u.elixirGen.amount}，倒下時 +${u.elixirGen.onDeath}`]);
  return rows;
}

$('btn-info-close').addEventListener('click', () => {
  cardSheet.hidden = true;
});
cardSheet.addEventListener('click', (e) => {
  if (e.target === cardSheet) cardSheet.hidden = true;
});
$('btn-info-use').addEventListener('click', () => {
  const id = infoCard;
  cardSheet.hidden = true;
  if (!id) return;
  const i = draftDeck.indexOf(id);
  if (i >= 0) draftDeck.splice(i, 1);
  else if (draftDeck.length < 8) draftDeck.push(id);
  else swapIn = id; // 牌組已滿：進入替換模式
  sound.play('tap');
  renderDeck();
});

$('btn-deck-done').addEventListener('click', () => {
  if (!draftDecks.every((d) => isValidDeck(d))) return;
  // 存下三個欄位，並改用目前選的那一副
  settings.decks = draftDecks.map((d) => [...d]);
  useSlot(settings, draftSlot);
  saveSettings(settings);
  swapIn = null;
  if (deckReturn === 'battle-result') startBattle();
  else showHome();
});
$('btn-deck-reset').addEventListener('click', () => {
  draftDecks[draftSlot] = [...DECK_PRESETS[draftSlot]];
  draftDeck = draftDecks[draftSlot];
  swapIn = null;
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
    portraits,
    game: () => battle.game,
    /** 以玩家側 AI 代打並快轉 sec 秒（用於多場穩定性測試）。 */
    autoplay(sec: number): void {
      const g = battle.game;
      // 代打用獨立的亂數（不動遊戲主亂數，這場的重播才會和實際對戰一致）
      const bot = new AiController(g, 0, new Rng(1234 + g.tick), AI_LEVELS.normal);
      const steps = Math.round(sec * 30);
      for (let i = 0; i < steps && g.phase !== 'ended'; i++) {
        bot.update();
        battle.simStep();
      }
    },
    /** 直接顯示新競技場解鎖畫面（截圖用）。 */
    showUnlock(i: number): void {
      showUnlock(i);
    },
    /** 略過開場動畫（自動測試用）。 */
    skipIntro(on = true): void {
      battle.skipIntro = on;
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
offerSharedReplay();
// 卡面圖在背景分批產生：先做目前牌組，再做主畫面插圖與其他卡
portraits.onUpdate(() => {
  refreshPortraits();
  if (!home.hidden) renderHome();
  if (!roadOv.hidden) fillRoadArt();
  if (!profileOv.hidden) refreshPortraits(profileOv);
  if (!$('ov-replay-invite').hidden) refreshPortraits($('ov-replay-invite'));
  if (!unlockOv.hidden) fillUnlockArt();
});
portraits.start(settings.deck);
