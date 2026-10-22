// 真實瀏覽器驗證：以 production build 在 Chromium 中用真的滑鼠／觸控輸入操作。
// 用法：npm run build && npm run e2e            （完整，含一場即時對戰，約 5 分鐘）
//       npm run build && npm run e2e -- --quick （略過即時整場對戰）
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { launchBrowser } from './browser.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const outDir = fileURLToPath(new URL('../../verification/', import.meta.url));
const shotDir = `${outDir}screenshots/`;
mkdirSync(shotDir, { recursive: true });
const QUICK = process.argv.includes('--quick');
const PORT = 4179;
const BASE = `http://localhost:${PORT}/`;

const results = { startedAt: new Date().toISOString(), browser: '', checks: [], viewports: {}, errors: [], notes: [] };
let failures = 0;
function check(name, ok, detail = '') {
  results.checks.push({ name, ok: !!ok, detail });
  if (!ok) failures++;
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VIEWPORTS = [
  { name: 'desktop-1280x800', viewport: { width: 1280, height: 800 }, touch: false, dsf: 1 },
  { name: 'mobile-360x640', viewport: { width: 360, height: 640 }, touch: true, dsf: 2 },
  { name: 'mobile-390x844', viewport: { width: 390, height: 844 }, touch: true, dsf: 3 },
  { name: 'mobile-430x932', viewport: { width: 430, height: 932 }, touch: true, dsf: 3 },
];

const server = await preview({ root, preview: { port: PORT, strictPort: true }, logLevel: 'error' });
const browser = await launchBrowser();
results.browser = `Chromium ${browser.version()}（Playwright 驅動，headless）`;

async function newPage(vp, extra = {}) {
  const ctx = await browser.newContext({
    viewport: vp.viewport,
    deviceScaleFactor: vp.dsf,
    isMobile: vp.touch,
    hasTouch: vp.touch,
    ...extra,
  });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') results.errors.push(`[${vp.name}] console: ${m.text()}`);
  });
  page.on('pageerror', (e) => results.errors.push(`[${vp.name}] pageerror: ${e.message}`));
  page.on('requestfailed', (r) => results.errors.push(`[${vp.name}] requestfailed: ${r.url()}`));
  const cdp = vp.touch ? await ctx.newCDPSession(page) : null;
  return { ctx, page, cdp };
}

const state = (page) =>
  page.evaluate(() => {
    const g = window.__btd.game();
    const p = g.players[0];
    return {
      elixir: p.elixir, hand: [...p.hand], next: p.queue[0], played: p.cardsPlayed, spent: p.elixirSpent,
      time: g.time, timeLeft: g.timeLeft, phase: g.phase, crowns: [p.crowns, g.players[1].crowns],
      troops: g.entities.filter((e) => e.kind !== 'tower').length, entities: g.entities.length, result: g.result,
    };
  });

async function cardBox(page, i) {
  const b = await page.locator(`#hand .card[data-index="${i}"]`).boundingBox();
  return [b.x + b.width / 2, b.y + b.height / 2];
}
const cardCost = (page, i) => page.locator(`#hand .card[data-index="${i}"] .cost b`).textContent().then(Number);
const screenOf = (page, x, y) => page.evaluate(([x, y]) => window.__btd.battle.screenOf(x, y), [x, y]);

async function drag(page, cdp, from, to) {
  if (cdp) {
    const tp = (x, y) => [{ x, y, id: 1, radiusX: 8, radiusY: 8, force: 1 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(...from) });
    for (let i = 1; i <= 8; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp(from[0] + ((to[0] - from[0]) * i) / 8, from[1] + ((to[1] - from[1]) * i) / 8) });
      await sleep(16);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await page.mouse.move(...from);
    await page.mouse.down();
    await page.mouse.move(...to, { steps: 8 });
    await page.mouse.up();
  }
  await sleep(60);
}

async function tap(page, cdp, pt) {
  if (cdp) await page.touchscreen.tap(...pt);
  else await page.mouse.click(...pt);
  await sleep(60);
}

async function waitElixir(page, need, timeout = 15000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const s = await state(page);
    if (s.elixir >= need) return s;
    await sleep(150);
  }
  throw new Error(`等不到 ${need} 點能量`);
}

/** 檢查目前畫面有無水平溢出、文字溢出、太小的按鈕。 */
const layoutAudit = (page) =>
  page.evaluate(() => {
    const W = innerWidth;
    const H = innerHeight;
    const issues = [];
    for (const el of document.querySelectorAll('#app *')) {
      if (el.closest('[hidden]')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const name = `${el.tagName.toLowerCase()}#${el.id || ''}.${[...el.classList].join('.')}`;
      if (r.right > W + 1 || r.left < -1) issues.push(`超出寬度 ${name} (${Math.round(r.left)}–${Math.round(r.right)})`);
      if ((el.tagName === 'BUTTON' || el.classList.contains('card-name')) && el.scrollWidth > el.clientWidth + 1) issues.push(`文字溢出 ${name}`);
      if (el.tagName === 'BUTTON' && (r.width < 43.5 || r.height < 43.5) && !el.closest('.mini-deck')) issues.push(`觸控區小於 44px ${name} ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    return { docOverflowX: document.documentElement.scrollWidth > W, issues, W, H };
  });

async function shot(page, name) {
  await page.screenshot({ path: `${shotDir}${name}.png` });
}

// ───────── 1. 各尺寸：首頁、教學、出牌、非法部署、能量不足、取消、暫停、背景切換 ─────────

for (const vp of VIEWPORTS) {
  const tag = vp.name;
  const vr = (results.viewports[tag] = {});
  const { ctx, page, cdp } = await newPage(vp);
  await page.goto(`${BASE}?test=1&seed=11`);
  await page.waitForSelector('#screen-home:not([hidden])');
  check(`[${tag}] 開啟後顯示主畫面與開始按鈕`, await page.isVisible('#btn-play'));
  check(`[${tag}] 載入畫面已移除`, (await page.locator('#boot').count()) === 0);
  const homeAudit = await layoutAudit(page);
  vr.homeAudit = homeAudit;
  check(`[${tag}] 主畫面無水平溢出／文字溢出／過小按鈕`, !homeAudit.docOverflowX && homeAudit.issues.length === 0, homeAudit.issues.slice(0, 4).join('；'));
  await shot(page, `${tag}-01-home`);

  await page.click('#btn-play');
  await page.waitForSelector('#ov-howto:not([hidden])');
  check(`[${tag}] 第一次開戰先顯示簡短玩法`, true);
  await shot(page, `${tag}-02-howto`);
  await page.click('#btn-howto-ok');
  await page.waitForSelector('#screen-battle:not([hidden])');
  await sleep(400);
  vr.audioState = await page.evaluate(() => window.__btd.sound.state);
  check(`[${tag}] 點開始後音訊已啟用（AudioContext running）`, vr.audioState === 'running', vr.audioState);

  const battleAudit = await layoutAudit(page);
  vr.battleAudit = battleAudit;
  const panel = await page.locator('#hand-panel').boundingBox();
  const cardB = await page.locator('#hand .card[data-index="0"]').boundingBox();
  vr.card = { w: Math.round(cardB.width), h: Math.round(cardB.height) };
  check(`[${tag}] 對戰畫面手牌與能量條完整在視窗內`, panel.y + panel.height <= vp.viewport.height + 0.5 && !battleAudit.docOverflowX && battleAudit.issues.length === 0, `${battleAudit.issues.slice(0, 3).join('；')} 卡牌 ${vr.card.w}×${vr.card.h}`);
  check(`[${tag}] 手牌觸控區至少 44×44`, cardB.width >= 44 && cardB.height >= 44, `${vr.card.w}×${vr.card.h}`);
  await shot(page, `${tag}-03-battle-start`);

  // 拖曳出牌
  let s0 = await state(page);
  let cost = await cardCost(page, 0);
  s0 = await waitElixir(page, cost);
  const from = await cardBox(page, 0);
  const to = await screenOf(page, 9, 24);
  await drag(page, cdp, from, to);
  let s1 = await state(page);
  check(`[${tag}] 拖曳出牌成功且只扣一次能量`, s1.played === s0.played + 1 && s1.spent === s0.spent + cost, `出牌 ${s0.played}→${s1.played}，花費 ${s0.spent}→${s1.spent}（卡費 ${cost}）`);
  check(`[${tag}] 出牌後手牌由下一張補上`, s1.hand[0] === s0.next, `${s0.hand[0]} → ${s1.hand[0]}（下一張 ${s0.next}）`);

  // 點選卡牌 → 點地面
  cost = await cardCost(page, 1);
  s0 = await waitElixir(page, cost);
  await tap(page, cdp, await cardBox(page, 1));
  check(`[${tag}] 點選卡牌後顯示選取狀態`, await page.locator('#hand .card[data-index="1"].selected').count() === 1);
  await sleep(150);
  await shot(page, `${tag}-04-card-selected-zone`);
  await tap(page, cdp, await screenOf(page, 5, 27.5));
  s1 = await state(page);
  check(`[${tag}] 點卡再點地面出牌成功`, s1.played === s0.played + 1 && s1.spent === s0.spent + cost, `花費 ${s0.spent}→${s1.spent}`);

  // 非法位置
  const pick = (await state(page)).hand.findIndex((id) => !['fireball', 'arrows', 'zap'].includes(id));
  cost = await cardCost(page, pick);
  s0 = await waitElixir(page, cost);
  await drag(page, cdp, await cardBox(page, pick), await screenOf(page, 9, 8));
  s1 = await state(page);
  const toast1 = await page.locator('#toast').textContent();
  check(`[${tag}] 部隊放到對方半場被拒絕，不扣能量不換牌`, s1.played === s0.played && s1.spent === s0.spent && s1.hand[pick] === s0.hand[pick] && toast1.includes('不能部署'), toast1);
  await shot(page, `${tag}-05-illegal-zone`);
  await tap(page, cdp, await cardBox(page, pick)); // 取消選取

  // 能量不足（以測試掛鉤把能量歸零，再用真實輸入嘗試）
  await page.evaluate(() => (window.__btd.game().players[0].elixir = 0));
  s0 = await state(page);
  await drag(page, cdp, await cardBox(page, 0), await screenOf(page, 9, 24));
  s1 = await state(page);
  const toast2 = await page.locator('#toast').textContent();
  check(`[${tag}] 能量不足不能出牌且有提示`, s1.played === s0.played && s1.spent === s0.spent && toast2.includes('能量不足'), toast2);
  await tap(page, cdp, await cardBox(page, 0));

  // 拖回手牌區取消
  await page.evaluate(() => (window.__btd.game().players[0].elixir = 10));
  s0 = await state(page);
  const c2 = await cardBox(page, 2);
  await drag(page, cdp, c2, [c2[0] + 30, c2[1] - 4]);
  s1 = await state(page);
  check(`[${tag}] 拖曳後放回手牌區即取消，不出牌`, s1.played === s0.played && (await page.locator('#hand .card.selected').count()) === 0);

  // 暫停
  await page.click('#btn-pause');
  await page.waitForSelector('#ov-pause:not([hidden])');
  const tPaused = (await state(page)).time;
  await sleep(700);
  check(`[${tag}] 暫停時對戰時間不前進`, Math.abs((await state(page)).time - tPaused) < 1e-9);
  await shot(page, `${tag}-06-pause`);
  await page.click('#btn-resume');
  await sleep(500);
  check(`[${tag}] 繼續後時間恢復前進`, (await state(page)).time > tPaused);

  // 背景切換（以覆寫 visibilityState 模擬）
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const tHidden = (await state(page)).time;
  await sleep(1500);
  await page.evaluate(() => {
    Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  const sBack = await state(page);
  const pauseShown = await page.isVisible('#ov-pause');
  check(`[${tag}] 切到背景自動暫停，回來不補算時間、需點繼續`, pauseShown && Math.abs(sBack.time - tHidden) < 1e-9, `背景 1.5 秒期間對戰時間變化 ${(sBack.time - tHidden).toFixed(3)} 秒`);
  await page.click('#btn-resume');

  // 靜音切換
  await page.click('#btn-pause');
  await page.click('#btn-mute-pause');
  const muted = await page.evaluate(() => window.__btd.sound.muted);
  await page.click('#btn-mute-pause');
  check(`[${tag}] 暫停選單可切換靜音`, muted === true && (await page.evaluate(() => window.__btd.sound.muted)) === false);
  await page.click('#btn-resume');

  // 推進一段時間看戰況
  await page.evaluate(() => window.__btd.autoplay(40));
  await sleep(700);
  await shot(page, `${tag}-07-battle-mid`);
  await ctx.close();
}

// ───────── 2. 桌面：快轉打完多場、結算、再玩、分享 ─────────
{
  const vp = VIEWPORTS[0];
  const { ctx, page } = await newPage(vp, { permissions: ['clipboard-read', 'clipboard-write'] });
  await page.goto(`${BASE}?test=1&seed=21`);
  await page.click('#btn-play');
  await page.click('#btn-howto-ok');
  await page.waitForSelector('#screen-battle:not([hidden])');
  const domCounts = [];
  const matchLog = [];
  for (let m = 0; m < 4; m++) {
    await page.evaluate(() => window.__btd.autoplay(400));
    await page.waitForSelector('#ov-result:not([hidden])', { timeout: 8000 });
    const s = await state(page);
    const title = await page.locator('#result-title').textContent();
    const crownsUi = [await page.locator('#result-crown-me').textContent(), await page.locator('#result-crown-enemy').textContent()].map(Number);
    matchLog.push({ title, reason: s.result.reason, crowns: s.result.crowns, time: Math.round(s.result.time) });
    check(`[desktop] 第 ${m + 1} 場打完並顯示結算（${title} ${crownsUi.join(':')}）`, s.phase === 'ended' && crownsUi[0] === s.result.crowns[0] && crownsUi[1] === s.result.crowns[1]);
    // 結算後再推進，不應重複結算或繼續扣血
    const before = await page.evaluate(() => window.__btd.game().towers(0).map((t) => t.hp).join(','));
    await page.evaluate(() => window.__btd.fastForward(5));
    await sleep(300);
    const after = await page.evaluate(() => window.__btd.game().towers(0).map((t) => t.hp).join(','));
    check(`[desktop] 第 ${m + 1} 場結束後不再有傷害`, before === after);
    if (m === 0) {
      await shot(page, `${vp.name}-08-result`);
      await page.click('#btn-share-result');
      await sleep(400);
      const btnText = await page.locator('#btn-share-result').textContent();
      const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
      check('[desktop] 結算「分享戰績」在無原生分享時改為複製連結', btnText.includes('已複製') && clip === BASE, `按鈕「${btnText}」，剪貼簿「${clip}」`);
    }
    domCounts.push(await page.evaluate(() => document.getElementsByTagName('*').length));
    await page.click('#btn-again');
    await sleep(300);
    const r = await state(page);
    const effects = await page.evaluate(() => window.__btd.battle.effectCount);
    check(
      `[desktop] 第 ${m + 1} 場後「再玩一場」完全重置`,
      r.phase === 'regular' && r.timeLeft > 179 && Math.abs(r.elixir - 5) < 0.4 && r.troops === 0 && r.entities === 6 && r.crowns.join() === '0,0' && r.played === 0 && (await page.isHidden('#ov-result')) && effects < 5,
      `剩餘 ${r.timeLeft.toFixed(1)} 秒、能量 ${r.elixir.toFixed(2)}、實體 ${r.entities}、特效 ${effects}`,
    );
  }
  results.matches = matchLog;
  results.domCountsAcrossMatches = domCounts;
  check('[desktop] 連續多場 DOM 節點數沒有持續增加', domCounts[domCounts.length - 1] - domCounts[0] <= 5 && Math.max(...domCounts) - Math.min(...domCounts) <= 8, domCounts.join(' → '));

  // FPS 與模擬耗時（桌面 headless，僅供參考，不代表手機）
  const fps = await page.evaluate(
    () =>
      new Promise((res) => {
        let n = 0;
        const t0 = performance.now();
        const f = () => {
          n++;
          if (performance.now() - t0 < 3000) requestAnimationFrame(f);
          else res(n / ((performance.now() - t0) / 1000));
        };
        requestAnimationFrame(f);
      }),
  );
  const simMs = await page.evaluate(() => {
    const t0 = performance.now();
    window.__btd.autoplay(60);
    return (performance.now() - t0) / 1800;
  });
  results.performance = { headlessDesktopFps: Math.round(fps), simMsPerStep: Number(simMs.toFixed(3)) };
  check('[desktop] 對戰中 requestAnimationFrame 維持 ≥ 30 FPS（headless 桌面）', fps >= 30, `${fps.toFixed(1)} FPS；每模擬步 ${simMs.toFixed(3)} ms`);

  // 離開對戰回主畫面
  await page.click('#btn-pause').catch(() => undefined);
  if (await page.isVisible('#ov-pause')) await page.click('#btn-quit');
  else {
    await page.evaluate(() => window.__btd.autoplay(400));
    await page.waitForSelector('#ov-result:not([hidden])');
    await page.click('#btn-result-home');
  }
  await page.waitForSelector('#screen-home:not([hidden])');
  check('[desktop] 可離開對戰回主畫面，戰績有記錄', ((await page.locator('#home-record').textContent()) ?? '').includes('勝'));
  await ctx.close();
}

// ───────── 3. 分享備援：剪貼簿被拒時顯示可手動複製的網址 ─────────
{
  const vp = VIEWPORTS[1];
  const { ctx, page } = await newPage(vp);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('denied')) } });
  });
  await page.goto(`${BASE}?test=1`);
  await page.click('#btn-share-home');
  await page.waitForSelector('#share-manual-home:not([hidden])');
  const val = await page.inputValue('#share-input-home');
  const selected = await page.evaluate(() => {
    const el = document.getElementById('share-input-home');
    return el.selectionEnd - el.selectionStart;
  });
  check('[360x640] 無原生分享且剪貼簿被拒時，顯示已選取的網址供手動複製', val === BASE && selected === val.length, val);
  await shot(page, `${vp.name}-09-share-manual`);

  // 牌組編輯
  await page.click('#btn-deck');
  await page.waitForSelector('#screen-deck:not([hidden])');
  await shot(page, `${vp.name}-10-deck`);
  const deckAudit = await layoutAudit(page);
  check('[360x640] 牌組編輯畫面無溢出', !deckAudit.docOverflowX && deckAudit.issues.length === 0, deckAudit.issues.slice(0, 3).join('；'));
  await page.click('.tile[data-card="golem"]');
  const c7 = await page.locator('#deck-count').textContent();
  const disabled = await page.isDisabled('#btn-deck-done');
  await page.click('.tile[data-card="musketeer"]');
  const c8 = await page.locator('#deck-count').textContent();
  check('[360x640] 牌組少於 8 張不能完成，補滿才能完成', c7 === '7/8' && disabled && c8 === '8/8' && !(await page.isDisabled('#btn-deck-done')));
  await page.click('#btn-deck-done');
  await page.reload();
  await page.waitForSelector('#screen-home:not([hidden])');
  const deckIds = await page.$$eval('#home-deck-cards .card', (els) => els.map((e) => e.dataset.card));
  check('[360x640] 牌組儲存在本機，重新整理後保留', deckIds.includes('musketeer') && !deckIds.includes('golem'), deckIds.join(','));
  await ctx.close();
}

// ───────── 3b. 瀏覽器沒有 Web Audio（或被封鎖）時仍可開戰 ─────────
{
  const vp = VIEWPORTS[3];
  const { ctx, page, cdp } = await newPage(vp);
  await page.addInitScript(() => {
    Object.defineProperty(window, 'AudioContext', { configurable: true, value: undefined });
    Object.defineProperty(window, 'webkitAudioContext', { configurable: true, value: undefined });
  });
  await page.goto(`${BASE}?test=1&seed=3`);
  await page.click('#btn-play');
  await page.click('#btn-howto-ok');
  await page.waitForSelector('#screen-battle:not([hidden])');
  const cost = await cardCost(page, 0);
  const s0 = await waitElixir(page, cost);
  await drag(page, cdp, await cardBox(page, 0), await screenOf(page, 9, 24));
  const s1 = await state(page);
  const audio = await page.evaluate(() => window.__btd.sound.state);
  check('[430x932] 沒有 Web Audio 時仍可開戰與出牌（無聲繼續）', audio === 'unavailable' && s1.played === s0.played + 1, `音訊狀態 ${audio}`);
  await ctx.close();
}

// ───────── 4. 載入：模擬 4 Mbps／150 ms、冷快取 ─────────
{
  const vp = VIEWPORTS[2];
  const { ctx, page } = await newPage(vp);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 4e6 / 8, uploadThroughput: 1e6 / 8 });
  let bytes = 0;
  const reqs = [];
  cdp.on('Network.loadingFinished', (e) => (bytes += e.encodedDataLength));
  cdp.on('Network.responseReceived', (e) => reqs.push(`${e.response.status} ${e.response.mimeType} ${new URL(e.response.url).pathname}`));
  const t0 = Date.now();
  await page.goto(BASE);
  await page.waitForSelector('#screen-home:not([hidden])');
  const ms = Date.now() - t0;
  await sleep(500);
  results.load = { simulated: '4 Mbps 下載、150 ms 延遲、停用快取（Chrome DevTools 網路模擬）', msToStartScreen: ms, transferredBytes: bytes, requests: reqs };
  check('[load] 模擬 4 Mbps／150 ms 冷快取 5 秒內可操作開始畫面', ms < 5000, `${ms} ms，傳輸 ${(bytes / 1024).toFixed(1)} KB`);
  check('[load] 首輪必要資源 < 5 MB', bytes < 5 * 1024 * 1024, `${(bytes / 1024).toFixed(1)} KB`);
  const meta = await page.evaluate(() => ({
    title: document.title,
    desc: document.querySelector('meta[name="description"]')?.content,
    ogImage: document.querySelector('meta[property="og:image"]')?.content,
    ogTitle: document.querySelector('meta[property="og:title"]')?.content,
  }));
  results.meta = meta;
  for (const p of ['og-image.png', 'favicon.svg', 'apple-touch-icon.png']) {
    const r = await page.request.get(`${BASE}${p}`);
    check(`[assets] ${p} HTTP ${r.status()} ${r.headers()['content-type']}`, r.status() === 200);
  }
  await ctx.close();
}

// ───────── 4b. 主程式載入失敗：顯示提示與重新載入，恢復網路後可正常進入 ─────────
{
  const ctx = await browser.newContext({ viewport: VIEWPORTS[1].viewport, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.route('**/assets/*.js', (route) => route.abort());
  await page.goto(BASE);
  await page.waitForSelector('#boot-retry:not([hidden])', { timeout: 5000 });
  const msg = await page.locator('#boot-msg').textContent();
  await shot(page, 'mobile-360x640-13-load-failed');
  await page.unroute('**/assets/*.js');
  await page.click('#boot-retry');
  await page.waitForSelector('#screen-home:not([hidden])', { timeout: 5000 });
  check('[load] 主程式載入失敗時顯示提示與重新載入按鈕，重試後可進入', msg.includes('載入失敗') && (await page.isVisible('#btn-play')), msg);
  await ctx.close();
}

// ───────── 5. 即時打完一整場（390×844 觸控，全部用真實觸控輸入出牌） ─────────
if (!QUICK) {
  const vp = VIEWPORTS[2];
  const { ctx, page, cdp } = await newPage(vp);
  await page.goto(`${BASE}?test=1&seed=5`);
  await page.click('#btn-play');
  await page.click('#btn-howto-ok');
  await page.waitForSelector('#screen-battle:not([hidden])');
  const t0 = Date.now();
  let plays = 0;
  let lane = 0;
  const shotsAt = new Set([30, 125, 185]);
  while (Date.now() - t0 < 300000) {
    const s = await state(page);
    if (s.phase === 'ended') break;
    const elapsed = 180 - s.timeLeft + (s.phase === 'overtime' ? 180 : 0);
    for (const t of [...shotsAt]) {
      if (elapsed >= t) {
        shotsAt.delete(t);
        await shot(page, `${vp.name}-11-live-${t}s`);
      }
    }
    if (s.elixir >= 6.5) {
      // 出能負擔、費用最高的卡；法術丟對方側塔，部隊放在橋前
      let best = -1;
      let bestCost = -1;
      for (let i = 0; i < 4; i++) {
        const c = await cardCost(page, i);
        if (c <= s.elixir && c > bestCost) {
          best = i;
          bestCost = c;
        }
      }
      if (best >= 0) {
        const id = s.hand[best];
        const x = lane === 0 ? 3.5 : 14.5;
        const target = ['fireball', 'arrows', 'zap'].includes(id) ? [x, 6.5] : id === 'cannon' ? [9, 22] : id === 'golem' ? [x, 30] : [x + (lane === 0 ? 1 : -1), 19.5];
        const before = s.played;
        await drag(page, cdp, await cardBox(page, best), await screenOf(page, ...target));
        if ((await state(page)).played === before + 1) plays++;
        lane = 1 - lane;
      }
    }
    await sleep(700);
  }
  const s = await state(page);
  await page.waitForSelector('#ov-result:not([hidden])', { timeout: 10000 });
  await shot(page, `${vp.name}-12-live-result`);
  results.liveMatch = { realSeconds: Math.round((Date.now() - t0) / 1000), touchDeploys: plays, result: s.result };
  check('[390x844] 以真實觸控輸入即時打完一整場並顯示結算', s.phase === 'ended' && plays >= 8, `觸控出牌 ${plays} 次，${Math.round((Date.now() - t0) / 1000)} 秒，結果 ${JSON.stringify(s.result)}`);
  await tap(page, cdp, await page.locator('#btn-again').boundingBox().then((b) => [b.x + b.width / 2, b.y + b.height / 2]));
  await sleep(400);
  const r = await state(page);
  check('[390x844] 結算後點「再玩一場」開新局', r.phase === 'regular' && r.entities === 6 && r.played === 0);
  await ctx.close();
}

check('全程沒有 console error／pageerror／載入失敗', results.errors.length === 0, results.errors.slice(0, 5).join('；'));
results.finishedAt = new Date().toISOString();
results.summary = { total: results.checks.length, failed: failures };
writeFileSync(`${outDir}e2e-results.json`, JSON.stringify(results, null, 2));
console.log(`\n${results.checks.length - failures}/${results.checks.length} 通過，結果寫入 verification/e2e-results.json`);
await browser.close();
await new Promise((r) => server.httpServer.close(r));
process.exit(failures ? 1 : 0);
