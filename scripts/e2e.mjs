// 真實瀏覽器驗證（v2）：以 production build 在 Chromium 中用真的滑鼠／觸控輸入操作。
// 用法：npm run build && npm run e2e            （完整，含一場即時對戰，約 8 分鐘）
//       npm run build && npm run e2e -- --quick （略過即時整場對戰）
//       npm run build && npm run e2e -- --only=6 （只跑第 6 節即時對戰；部分執行的結果另存 e2e-results-only-6.json）
// 結果寫入上一層的 verification/v3/（e2e-results.json、screenshots/）；E2E_OUT=資料夾名 可改。
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { preview } from 'vite';
import { launchBrowser } from './browser.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
// 結果資料夾：v3 分支寫到 verification/v3/（v2.0-rc 的驗證證據留在 verification/v2/，不要覆蓋）；可用 E2E_OUT=v2 指定
const outDir = fileURLToPath(new URL(`../../verification/${process.env.E2E_OUT ?? 'v3'}/`, import.meta.url));
const shotDir = `${outDir}screenshots/`;
mkdirSync(shotDir, { recursive: true });
const QUICK = process.argv.includes('--quick');
const ONLY = process.argv.find((a) => a.startsWith('--only='))?.slice(7).split(',');
const run = (section) => !ONLY || ONLY.includes(section);
const PORT = 4179;
const BASE = `http://localhost:${PORT}/`;

const results = { startedAt: new Date().toISOString(), browser: '', gpu: '', checks: [], viewports: {}, errors: [], notes: [] };
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
const SPELLS = ['fireball', 'arrows', 'zap', 'rocket', 'log', 'poison', 'goblin_barrel'];

const server = await preview({ root, preview: { port: PORT, strictPort: true }, logLevel: 'error' });
const browser = await launchBrowser();
results.browser = `Chromium ${browser.version()}（Playwright 驅動，headless）`;

async function newPage(vp, extra = {}) {
  const ctx = await browser.newContext({ viewport: vp.viewport, deviceScaleFactor: vp.dsf, isMobile: vp.touch, hasTouch: vp.touch, ...extra });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') results.errors.push(`[${vp.name}] console: ${m.text()}`);
  });
  page.on('pageerror', (e) => results.errors.push(`[${vp.name}] pageerror: ${e.message}`));
  page.on('response', (r) => {
    if (r.status() >= 400) results.errors.push(`[${vp.name}] HTTP ${r.status()}: ${r.url()}`);
  });
  page.on('requestfailed', (r) => {
    if (!r.url().startsWith('data:')) results.errors.push(`[${vp.name}] requestfailed: ${r.url()}`);
  });
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
      foes: g.entities.filter((e) => e.team === 1 && e.kind !== 'tower' && e.alive).map((e) => [e.x, e.y]),
      intro: window.__btd.battle.intro,
    };
  });

async function cardBox(page, i) {
  const b = await page.locator(`#hand .card[data-index="${i}"]`).boundingBox();
  return [b.x + b.width / 2, b.y + b.height / 2];
}
const cardCost = (page, i) => page.evaluate((i) => {
  const id = window.__btd.game().players[0].hand[i];
  return id ? Number(document.querySelector(`#hand .card[data-index="${i}"] .cost b`)?.textContent ?? 99) : 99;
}, i);
const screenOf = (page, x, y) => page.evaluate(([x, y]) => window.__btd.battle.screenOf(x, y), [x, y]);

async function drag(page, cdp, from, to, hold = 0) {
  if (cdp) {
    const tp = (x, y) => [{ x, y, id: 1, radiusX: 8, radiusY: 8, force: 1 }];
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: tp(...from) });
    for (let i = 1; i <= 8; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: tp(from[0] + ((to[0] - from[0]) * i) / 8, from[1] + ((to[1] - from[1]) * i) / 8) });
      await sleep(16);
    }
    if (hold) await sleep(hold);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  } else {
    await page.mouse.move(...from);
    await page.mouse.down();
    await page.mouse.move(...to, { steps: 8 });
    if (hold) await sleep(hold);
    await page.mouse.up();
  }
  await sleep(80);
}

async function tap(page, cdp, pt) {
  if (cdp) await page.touchscreen.tap(...pt);
  else await page.mouse.click(...pt);
  await sleep(80);
}

async function waitElixir(page, need, timeout = 20000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const s = await state(page);
    if (s.elixir >= need) return s;
    await sleep(150);
  }
  throw new Error(`等不到 ${need} 點能量`);
}

/** 找一張手上有的牌（可指定只要部隊、或只要法術）。 */
const findHand = (page, want) =>
  page.evaluate(([want, spells]) => window.__btd.game().players[0].hand.findIndex((id) => id && (want === 'any' || (want === 'troop' ? !spells.includes(id) : spells.includes(id)))), [want, SPELLS]);

/** 檢查目前畫面有無水平溢出、文字溢出、太小的按鈕。 */
const layoutAudit = (page) =>
  page.evaluate(() => {
    const W = innerWidth;
    const issues = [];
    for (const el of document.querySelectorAll('#app *')) {
      if (el.closest('[hidden]')) continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      const name = `${el.tagName.toLowerCase()}#${el.id || ''}.${[...el.classList].join('.')}`;
      if (r.right > W + 1 || r.left < -1) issues.push(`超出寬度 ${name} (${Math.round(r.left)}–${Math.round(r.right)})`);
      if ((el.tagName === 'BUTTON' || el.classList.contains('card-name') || el.classList.contains('hud-name')) && el.scrollWidth > el.clientWidth + 1) issues.push(`文字溢出 ${name}`);
      if (el.tagName === 'BUTTON' && (r.width < 43.5 || r.height < 43.5) && !el.closest('.mini-deck, .deck-slots, .deck-grid')) issues.push(`觸控區小於 44px ${name} ${Math.round(r.width)}×${Math.round(r.height)}`);
    }
    return { docOverflowX: document.documentElement.scrollWidth > W, issues };
  });

async function shot(page, name) {
  await page.screenshot({ path: `${shotDir}${name}.png` });
}

/** 量測一段時間內的實際影格間隔（requestAnimationFrame）。 */
const measureFps = (page, ms = 4000) =>
  page.evaluate(
    (ms) =>
      new Promise((res) => {
        const dts = [];
        let last = performance.now();
        const t0 = last;
        const f = (now) => {
          dts.push(now - last);
          last = now;
          if (now - t0 < ms) requestAnimationFrame(f);
          else {
            dts.shift();
            const sorted = [...dts].sort((a, b) => a - b);
            const avg = dts.reduce((s, v) => s + v, 0) / dts.length;
            res({ fps: 1000 / avg, avgMs: avg, p95Ms: sorted[Math.floor(sorted.length * 0.95)], frames: dts.length });
          }
        };
        requestAnimationFrame(f);
      }),
    ms,
  );

// ───────── 1. 各尺寸：首頁、教學、開場、出牌、非法部署、能量不足、取消、暫停、背景切換 ─────────

for (const vp of run('1') ? VIEWPORTS : []) {
  const tag = vp.name;
  const vr = (results.viewports[tag] = {});
  const { ctx, page, cdp } = await newPage(vp);
  await page.goto(`${BASE}?test=1&seed=11`);
  await page.waitForSelector('#screen-home:not([hidden])');
  check(`[${tag}] 開啟後顯示主畫面與對戰按鈕`, await page.isVisible('#btn-play'));
  check(`[${tag}] 載入畫面已移除`, (await page.locator('#boot').count()) === 0);
  await sleep(2500); // 卡圖產生
  const homeAudit = await layoutAudit(page);
  check(`[${tag}] 主畫面無水平溢出／文字溢出／過小按鈕`, !homeAudit.docOverflowX && homeAudit.issues.length === 0, homeAudit.issues.slice(0, 4).join('；'));
  const portraitsReady = await page.$$eval('#home-deck-cards .card-img', (els) => els.length);
  check(`[${tag}] 卡面以 3D 模型渲染成圖（牌組 8 張）`, portraitsReady === 8, `${portraitsReady}/8`);
  await shot(page, `${tag}-01-home`);

  await page.click('#btn-play');
  await page.waitForSelector('#ov-howto:not([hidden])');
  await shot(page, `${tag}-02-howto`);
  await page.click('#btn-howto-ok');
  await page.waitForSelector('#screen-battle:not([hidden])');
  await sleep(500);
  vr.renderer = await page.evaluate(() => window.__btd.battle.rendererKind);
  check(`[${tag}] 使用 3D（WebGL）畫面`, vr.renderer === '3d', vr.renderer);
  const introVisible = await page.isVisible('#ov-vs');
  const sIntro = await state(page);
  await shot(page, `${tag}-03-vs`);
  // 開場倒數期間不能出牌、時間不前進
  const bIdx = await findHand(page, 'troop');
  await page.evaluate(() => (window.__btd.game().players[0].elixir = 10));
  await drag(page, cdp, await cardBox(page, bIdx), await screenOf(page, 9.5, 24.5));
  const sIntro2 = await state(page);
  check(`[${tag}] 開場 VS 與倒數期間模擬暫停、不能出牌`, introVisible && sIntro.intro > 0 && sIntro2.played === 0 && sIntro2.time === 0, `intro ${sIntro.intro.toFixed(2)} 秒`);
  await page.waitForFunction(() => window.__btd.battle.intro <= 0, null, { timeout: 15000 });
  await sleep(300);
  vr.audioState = await page.evaluate(() => window.__btd.sound.state);
  check(`[${tag}] 點開始後音訊已啟用（AudioContext running）`, vr.audioState === 'running', vr.audioState);

  const battleAudit = await layoutAudit(page);
  const panel = await page.locator('#hand-panel').boundingBox();
  const cardB = await page.locator('#hand .card[data-index="0"]').boundingBox();
  vr.card = { w: Math.round(cardB.width), h: Math.round(cardB.height) };
  check(`[${tag}] 對戰畫面手牌與能量條完整在視窗內、無溢出`, panel.y + panel.height <= vp.viewport.height + 0.5 && !battleAudit.docOverflowX && battleAudit.issues.length === 0, `${battleAudit.issues.slice(0, 3).join('；')} 卡牌 ${vr.card.w}×${vr.card.h}`);
  check(`[${tag}] 手牌觸控區至少 44×44`, cardB.width >= 44 && cardB.height >= 44, `${vr.card.w}×${vr.card.h}`);
  // 對方國王塔、己方最後一排都在畫面內（不被上方資訊列或手牌擋住）
  const [, kingTopY] = await screenOf(page, 9, 1);
  // 對方國王塔血條（塔頂上方）不被上方資訊列遮住
  const [, kingBarY] = await page.evaluate(() => window.__btd.battle.screenOf3(9, 3, 4.35));
  const [, lastRowY] = await screenOf(page, 9, 31.5);
  const hudBottom = await page.locator('.hud-players').boundingBox().then((b) => b.y + b.height);
  check(`[${tag}] 場地完整可見：對方國王塔血條不被資訊列遮、己方最後一排在手牌上方`, lastRowY < panel.y - 2 && kingTopY > 0 && hudBottom <= kingBarY - 6, `對方塔血條 y=${Math.round(kingBarY)}、資訊列底 ${Math.round(hudBottom)}、己方後排 y=${Math.round(lastRowY)}、手牌頂 ${Math.round(panel.y)}`);
  await shot(page, `${tag}-04-battle-start`);
  // 第一場的新手教學：開戰後示範把卡牌拖到場上
  const coach0 = await page.evaluate(() => ({ shown: !document.getElementById('coach').hidden, hand: !document.getElementById('coach-hand').hidden, tip: document.getElementById('coach-tip').textContent }));
  check(`[${tag}] 第一場顯示新手教學（手指示範拖曳出牌）`, coach0.shown && coach0.hand && coach0.tip.includes('拖'), coach0.tip);

  // 拖曳中：顯示格線／禁區／半透明預覽
  let idx = await findHand(page, 'troop');
  let cost = await cardCost(page, idx);
  let s0 = await waitElixir(page, cost);
  const from = await cardBox(page, idx);
  const to = await screenOf(page, 9.5, 23.5);
  if (cdp) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from[0], y: from[1], id: 1 }] });
    for (let i = 1; i <= 8; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from[0] + ((to[0] - from[0]) * i) / 8, y: from[1] + ((to[1] - from[1]) * i) / 8, id: 1 }] });
      await sleep(16);
    }
  } else {
    await page.mouse.move(...from);
    await page.mouse.down();
    await page.mouse.move(...to, { steps: 8 });
  }
  await sleep(150);
  const pv = await page.evaluate(() => window.__btd.battle.debugPreview());
  await shot(page, `${tag}-05-drag-preview`);
  if (cdp) await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  else await page.mouse.up();
  await sleep(120);
  let s1 = await state(page);
  check(`[${tag}] 拖曳時顯示部署區格線與落點預覽`, pv.showZone && pv.preview && pv.preview.legal, JSON.stringify(pv));
  check(`[${tag}] 拖曳出牌成功且只扣一次能量`, s1.played === s0.played + 1 && s1.spent === s0.spent + cost, `出牌 ${s0.played}→${s1.played}，花費 ${s0.spent}→${s1.spent}（卡費 ${cost}）`);
  check(`[${tag}] 出牌後該格由下一張補上`, s1.hand[idx] === s0.next, `${s0.hand[idx]} → ${s1.hand[idx]}（下一張 ${s0.next}）`);
  const coach1 = await page.evaluate(() => {
    const tip = document.getElementById('coach-tip');
    const r = tip.getBoundingClientRect();
    return { text: tip.textContent, hand: !document.getElementById('coach-hand').hidden, bottom: r.bottom, panelTop: document.getElementById('hand-panel').getBoundingClientRect().top };
  });
  check(`[${tag}] 出第一張牌後教學換成能量說明，提示不擋住手牌`, coach1.text.includes('能量') && !coach1.hand && coach1.bottom <= coach1.panelTop + 1, coach1.text);

  // 點選卡牌 → 點地面
  await sleep(2200); // 等卡牌循環冷卻
  idx = await findHand(page, 'troop');
  cost = await cardCost(page, idx);
  s0 = await waitElixir(page, cost);
  await tap(page, cdp, await cardBox(page, idx));
  check(`[${tag}] 點選卡牌後顯示選取狀態`, (await page.locator(`#hand .card[data-index="${idx}"].selected`).count()) === 1);
  await tap(page, cdp, await screenOf(page, 5.5, 27.5));
  s1 = await state(page);
  check(`[${tag}] 點卡再點地面出牌成功`, s1.played === s0.played + 1 && s1.spent === s0.spent + cost, `花費 ${s0.spent}→${s1.spent}`);

  // 非法位置
  await sleep(2200);
  idx = await findHand(page, 'troop');
  cost = await cardCost(page, idx);
  s0 = await waitElixir(page, cost);
  await drag(page, cdp, await cardBox(page, idx), await screenOf(page, 9.5, 8.5));
  s1 = await state(page);
  const toast1 = await page.locator('#toast').textContent();
  check(`[${tag}] 部隊放到對方半場被拒絕，不扣能量不換牌`, s1.played === s0.played && s1.spent === s0.spent && s1.hand[idx] === s0.hand[idx] && toast1.includes('不能部署'), toast1);
  await shot(page, `${tag}-06-illegal-zone`);
  await tap(page, cdp, await cardBox(page, idx)); // 取消選取

  // 能量不足（以測試掛鉤把能量歸零，再用真實輸入嘗試）
  await page.evaluate(() => (window.__btd.game().players[0].elixir = 0));
  s0 = await state(page);
  idx = await findHand(page, 'any');
  await drag(page, cdp, await cardBox(page, idx), await screenOf(page, 9.5, 24.5));
  s1 = await state(page);
  const toast2 = await page.locator('#toast').textContent();
  check(`[${tag}] 能量不足不能出牌且有提示`, s1.played === s0.played && s1.spent === s0.spent && toast2.includes('能量不足'), toast2);
  await tap(page, cdp, await cardBox(page, idx));

  // 拖回手牌區取消
  await page.evaluate(() => (window.__btd.game().players[0].elixir = 10));
  s0 = await state(page);
  idx = await findHand(page, 'any');
  const c2 = await cardBox(page, idx);
  await drag(page, cdp, c2, [c2[0] + 30, c2[1] - 4]);
  s1 = await state(page);
  check(`[${tag}] 拖曳後放回手牌區即取消，不出牌`, s1.played === s0.played && (await page.locator('#hand .card.selected').count()) === 0);

  // 暫停
  await page.click('#btn-pause');
  await page.waitForSelector('#ov-pause:not([hidden])');
  const tPaused = (await state(page)).time;
  await sleep(700);
  check(`[${tag}] 暫停時對戰時間不前進`, Math.abs((await state(page)).time - tPaused) < 1e-9);
  await shot(page, `${tag}-07-pause`);
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

  // 推進到交戰，量測 FPS
  await page.evaluate(() => {
    const b = window.__btd;
    for (let i = 0; i < 120; i++) {
      b.autoplay(0.5);
      const g = b.game();
      if (g.entities.filter((e) => e.alive && e.kind !== 'tower').length >= 10 || g.phase === 'ended') break;
    }
  });
  await sleep(800);
  await shot(page, `${tag}-08-battle-mid`);
  vr.fps = await measureFps(page, 3000);
  vr.entities = (await state(page)).entities;
  check(`[${tag}] 交戰中維持 ≥ 30 FPS（本機 GPU，headless）`, vr.fps.fps >= 30, `${vr.fps.fps.toFixed(1)} FPS、p95 ${vr.fps.p95Ms.toFixed(1)} ms、實體 ${vr.entities}`);
  await ctx.close();
}

// ───────── 2. 桌面：快轉打完多場、結算、再戰、分享 ─────────
if (run('2')) {
  const vp = VIEWPORTS[0];
  const { ctx, page } = await newPage(vp, { permissions: ['clipboard-read', 'clipboard-write'] });
  await page.goto(`${BASE}?test=1&seed=21`);
  await page.evaluate(() => window.__btd.skipIntro(true));
  await page.click('#btn-play');
  await page.click('#btn-howto-ok');
  await page.waitForSelector('#screen-battle:not([hidden])');
  const domCounts = [];
  const gpuCounts = [];
  const matchLog = [];
  const trophyLog = [];
  for (let m = 0; m < 4; m++) {
    if (m === 1) {
      const coachAgain = await page.evaluate(() => ({ hidden: document.getElementById('coach').hidden, done: window.__btd.settings.coachDone }));
      check('[desktop] 打完第一場後新手教學不再出現（含「再戰一場」）', coachAgain.hidden && coachAgain.done, JSON.stringify(coachAgain));
    }
    await page.evaluate(() => window.__btd.autoplay(600));
    await page.waitForSelector('#ov-result:not([hidden])', { timeout: 10000 });
    await sleep(1800); // 皇冠逐一亮起
    const s = await state(page);
    const title = await page.locator('#result-title').textContent();
    const crownsUi = [await page.locator('#result-crowns-me .crown-i.on').count(), await page.locator('#result-crowns-enemy .crown-i.on').count()];
    const winnerRow = (await page.locator('#result-row-me.won').count()) ? 0 : (await page.locator('#result-row-enemy.won').count()) ? 1 : null;
    matchLog.push({ title, reason: s.result.reason, crowns: s.result.crowns, time: Math.round(s.result.time) });
    check(
      `[desktop] 第 ${m + 1} 場打完並顯示結算（${title} ${crownsUi.join(':')}，${s.result.reason}）`,
      s.phase === 'ended' && crownsUi[0] === s.result.crowns[0] && crownsUi[1] === s.result.crowns[1] && winnerRow === s.result.winner,
    );
    // 獎盃：贏了加、輸了扣（不低於 0）、平手不變；結算顯示增減與新的總數
    const trophyText = (await page.locator('#result-trophies').textContent()) ?? '';
    const shownTotal = Number(/獎盃 (\d+)/.exec(trophyText)?.[1] ?? NaN);
    const savedTotal = await page.evaluate(() => window.__btd.settings.trophies);
    const signOk = s.result.winner === 0 ? /\+\d+/.test(trophyText) : s.result.winner === 1 ? /-\d+|±0/.test(trophyText) : /±0/.test(trophyText);
    trophyLog.push(trophyText.replace(/\s+/g, ' '));
    check(`[desktop] 第 ${m + 1} 場結算顯示獎盃增減並存到本機`, (await page.isVisible('#result-trophies')) && signOk && shownTotal === savedTotal, trophyText);
    const before = await page.evaluate(() => window.__btd.game().towers(0).map((t) => t.hp).join(','));
    await page.evaluate(() => window.__btd.fastForward(5));
    await sleep(200);
    const after = await page.evaluate(() => window.__btd.game().towers(0).map((t) => t.hp).join(','));
    check(`[desktop] 第 ${m + 1} 場結束後不再有傷害`, before === after);
    if (m === 0) {
      await shot(page, `${vp.name}-09-result`);
      await page.click('#btn-share-result');
      await sleep(400);
      const btnText = await page.locator('#btn-share-result').textContent();
      const clip = await page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
      check('[desktop] 結算「分享戰績」在無原生分享時改為複製連結', btnText.includes('已複製') && clip === BASE, `按鈕「${btnText}」，剪貼簿「${clip}」`);
    }
    domCounts.push(await page.evaluate(() => document.getElementsByTagName('*').length));
    gpuCounts.push(await page.evaluate(() => window.__btd.battle.gpuStats));
    await page.click('#btn-again');
    await sleep(500);
    const r = await state(page);
    const effects = await page.evaluate(() => window.__btd.battle.effectCount);
    check(
      `[desktop] 第 ${m + 1} 場後「再戰一場」完全重置`,
      r.phase === 'regular' && r.timeLeft > 179 && Math.abs(r.elixir - 5) < 0.4 && r.troops === 0 && r.entities === 6 && r.crowns.join() === '0,0' && r.played === 0 && (await page.isHidden('#ov-result')) && effects < 40,
      `剩餘 ${r.timeLeft.toFixed(1)} 秒、能量 ${r.elixir.toFixed(2)}、實體 ${r.entities}、特效 ${effects}`,
    );
  }
  results.matches = matchLog;
  results.domCountsAcrossMatches = domCounts;
  results.gpuAcrossMatches = gpuCounts;
  check(
    '[desktop] 連續多場 GPU 幾何／貼圖數沒有持續增加',
    // 單位模型與投射物的共用幾何會隨「出現過的種類」增加（有上限、不算洩漏），所以比較 geometries − shared
    // 每個存活單位有一張骨架貼圖（結算時場上單位數不同），所以比較 textures − boneTextures
    gpuCounts.length > 2 &&
      gpuCounts[gpuCounts.length - 1].textures - gpuCounts[gpuCounts.length - 1].boneTextures <= gpuCounts[1].textures - gpuCounts[1].boneTextures + 2 &&
      gpuCounts[gpuCounts.length - 1].geometries - gpuCounts[gpuCounts.length - 1].shared <= gpuCounts[1].geometries - gpuCounts[1].shared + 4,
    gpuCounts.map((g) => `${g.geometries}g(共用 ${g.shared})/${g.textures}t(骨架 ${g.boneTextures})`).join(' → '),
  );
  check('[desktop] 連續多場 DOM 節點數沒有持續增加', domCounts[domCounts.length - 1] - domCounts[0] <= 5 && Math.max(...domCounts) - Math.min(...domCounts) <= 8, domCounts.join(' → '));
  const mem = await page.evaluate(() => {
    const g = window.__btd;
    return { jsHeapMB: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null, effects: g.battle.effectCount };
  });
  results.memory = mem;

  const simMs = await page.evaluate(() => {
    const t0 = performance.now();
    window.__btd.autoplay(60);
    return (performance.now() - t0) / 1800;
  });
  results.performance = { simMsPerStep: Number(simMs.toFixed(3)) };

  await page.click('#btn-pause').catch(() => undefined);
  if (await page.isVisible('#ov-pause')) await page.click('#btn-quit');
  else {
    await page.evaluate(() => window.__btd.autoplay(600));
    await page.waitForSelector('#ov-result:not([hidden])');
    await page.click('#btn-result-home');
  }
  await page.waitForSelector('#screen-home:not([hidden])');
  check('[desktop] 可離開對戰回主畫面，戰績有記錄', ((await page.locator('#home-record').textContent()) ?? '').includes('勝'));
  const homeTrophies = Number(await page.locator('#home-trophies').textContent());
  const savedTrophies = await page.evaluate(() => window.__btd.settings.trophies);
  const arenaName = await page.locator('#home-arena').textContent();
  results.trophies = { log: trophyLog, home: homeTrophies, arena: arenaName };
  check('[desktop] 主畫面顯示目前獎盃與競技場', homeTrophies === savedTrophies && !!arenaName, `獎盃 ${homeTrophies}，${arenaName}`);
  // 個人資料與對戰紀錄：每打完一場就多一筆（雙方各 8 張牌、皇冠、獎盃增減）
  await page.click('#btn-profile');
  await page.waitForSelector('#ov-profile:not([hidden])');
  await sleep(300);
  const prof = await page.evaluate(() => {
    const s = window.__btd.settings;
    const items = [...document.querySelectorAll('#profile-log .log-item')];
    return {
      items: items.length,
      decks: items.map((li) => li.querySelectorAll('.log-deck .card').length),
      deltas: items.map((li) => li.querySelector('.log-delta').textContent),
      saved: s.log.map((e) => e.d),
      best: s.bestTrophies,
      trophies: s.trophies,
      wins: s.record.win,
      stats: document.getElementById('profile-stats').textContent,
    };
  });
  check(
    '[desktop] 個人資料顯示最高獎盃與戰績，對戰紀錄每場一筆且有雙方牌組與獎盃增減',
    prof.items === Math.min(10, prof.saved.length) && prof.saved.length >= 4 && prof.decks.every((n) => n === 16) && prof.best >= prof.trophies &&
      prof.stats.includes(`勝場${prof.wins}`) && prof.deltas.every((d, i) => d === (prof.saved[i] > 0 ? `+${prof.saved[i]}` : prof.saved[i] < 0 ? String(prof.saved[i]) : '±0')),
    `${prof.items} 筆（${prof.deltas.join(' ')}），最高 ${prof.best}`,
  );
  await shot(page, `${vp.name}-19-profile`);
  await page.click('#btn-profile-close');
  check('[desktop] 個人資料可關閉', await page.isHidden('#ov-profile'));
  await ctx.close();
}

// ───────── 3. 分享備援與牌組編輯 ─────────
if (run('3')) {
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
  await shot(page, `${vp.name}-10-share-manual`);

  await page.click('#btn-deck');
  await page.waitForSelector('#screen-deck:not([hidden])');
  await sleep(1500);
  await shot(page, `${vp.name}-11-deck`);
  const deckAudit = await layoutAudit(page);
  check('[360x640] 牌組編輯畫面無溢出', !deckAudit.docOverflowX && deckAudit.issues.length === 0, deckAudit.issues.slice(0, 3).join('；'));
  // 移出一張 → 7/8 不能完成 → 加入一張 → 8/8
  await page.click('#deck-slots .card[data-card="giant"]');
  await page.waitForSelector('#ov-card:not([hidden])');
  const statsText = await page.locator('#info-stats').textContent();
  check('[360x640] 卡牌資訊顯示 11 級數值（巨人生命值 4091）', statsText.includes('4091'), statsText.slice(0, 60));
  await shot(page, `${vp.name}-12-card-info`);
  await page.click('#btn-info-use');
  const c7 = await page.locator('#deck-count').textContent();
  const disabled = await page.isDisabled('#btn-deck-done');
  await page.click('.tile[data-card="golem"]');
  await page.click('#btn-info-use');
  const c8 = await page.locator('#deck-count').textContent();
  check('[360x640] 牌組少於 8 張不能完成，補滿才能完成', c7 === '7/8' && disabled && c8 === '8/8' && !(await page.isDisabled('#btn-deck-done')));
  // 牌組已滿時「使用」→ 點牌組中的卡替換
  await page.click('.tile[data-card="wolf_rider"]');
  await page.click('#btn-info-use');
  const swapHint = await page.locator('#deck-hint').textContent();
  // 替換模式下牌組卡會持續搖晃（刻意的提示動畫），Playwright 的「穩定」判定永遠等不到，所以強制點擊
  await page.click('#deck-slots .card[data-card="knight"]', { force: true });
  const deckNow = await page.$$eval('#deck-slots .card', (els) => els.map((e) => e.dataset.card));
  check('[360x640] 牌組已滿時可選卡替換', swapHint.includes('換成') && deckNow.includes('wolf_rider') && !deckNow.includes('knight') && deckNow.length === 8, deckNow.join(','));
  await page.click('#btn-deck-done');
  await page.reload();
  await page.waitForSelector('#screen-home:not([hidden])');
  const deckIds = await page.$$eval('#home-deck-cards .card', (els) => els.map((e) => e.dataset.card));
  check('[360x640] 牌組儲存在本機，重新整理後保留', deckIds.includes('golem') && deckIds.includes('wolf_rider') && !deckIds.includes('giant'), deckIds.join(','));
  // 牌組欄位：換到第 2 組並完成 → 主畫面改用第 2 組；主畫面的小分頁可切回第 1 組；重新整理後保留
  const homeDeck = () => page.$$eval('#home-deck-cards .card', (els) => els.map((e) => e.dataset.card));
  await page.click('#btn-deck');
  await page.waitForSelector('#screen-deck:not([hidden])');
  await page.click('#deck-tabs .slot-tab[data-slot="1"]');
  const deck2 = await page.$$eval('#deck-slots .card', (els) => els.map((e) => e.dataset.card));
  await page.click('#btn-deck-done');
  await page.waitForSelector('#screen-home:not([hidden])');
  const home2 = await homeDeck();
  const tab2 = await page.getAttribute('#home-deck-tabs .slot-tab[data-slot="1"]', 'aria-selected');
  check('[360x640] 牌組欄位：換到第 2 組並按完成，主畫面改用第 2 組', deck2.length === 8 && deck2.join() === home2.join() && !deck2.includes('golem') && tab2 === 'true', home2.join(','));
  await page.click('#home-deck-tabs .slot-tab[data-slot="0"]');
  const home1 = await homeDeck();
  await page.reload();
  await page.waitForSelector('#screen-home:not([hidden])');
  const homeAfter = await homeDeck();
  check('[360x640] 主畫面的牌組分頁可切回第 1 組，重新整理後保留', home1.includes('golem') && homeAfter.join() === home1.join(), homeAfter.join(','));
  await ctx.close();
}

// ───────── 3d. 獎盃之路與新競技場解鎖（獎盃 295 → 贏一場跨過 300 門檻） ─────────
if (run('3')) {
  const vp = VIEWPORTS[2];
  const { ctx, page } = await newPage(vp);
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('bridge-tower-duel.v1', JSON.stringify({ trophies: 295, howtoSeen: true }));
      sessionStorage.setItem('seeded', '1');
    }
  });
  await page.goto(`${BASE}?test=1&seed=5`);
  await page.waitForSelector('#screen-home:not([hidden])');
  const heroSrc = async () => page.evaluate(() => (document.getElementById('hero-img').hidden ? '' : document.getElementById('hero-img').src));
  await page.waitForFunction(() => !document.getElementById('hero-img').hidden && document.getElementById('hero-img').src.startsWith('data:image/png'), null, { timeout: 15000 }).catch(() => undefined);
  const hero0 = await heroSrc();
  check('[390x844] 主畫面插圖是目前競技場的 3D 小場景', hero0.startsWith('data:image/png') && (await page.locator('#home-arena').textContent()) === '綠野競技場', `${Math.round(hero0.length / 1024)} KB`);
  await page.click('#btn-road');
  await page.waitForSelector('#ov-road:not([hidden])');
  await page.waitForFunction(() => [...document.querySelectorAll('#road-list img')].every((i) => !i.hidden), null, { timeout: 15000 }).catch(() => undefined);
  const road = await page.evaluate(() => ({
    items: [...document.querySelectorAll('#road-list .road-item')].map((li) => ({ name: li.querySelector('b').textContent, cls: li.className })),
    arts: [...document.querySelectorAll('#road-list img')].filter((i) => !i.hidden && i.naturalWidth > 0).length,
    count: document.getElementById('road-count').textContent,
  }));
  const cur = road.items.find((i) => i.cls.includes('current'));
  check(
    '[390x844] 獎盃之路列出 6 座競技場（由高到低）、目前所在與未解鎖狀態、每座都有場景圖',
    road.items.length === 6 && road.items[5].name === '綠野競技場' && cur?.name === '綠野競技場' && road.items.filter((i) => i.cls.includes('locked')).length === 5 && road.arts === 6 && road.count === '295',
    road.items.map((i) => `${i.name}${i.cls.includes('current') ? '（目前）' : i.cls.includes('locked') ? '（未解鎖）' : ''}`).join('、'),
  );
  const roadAudit = await layoutAudit(page);
  check('[390x844] 獎盃之路畫面無溢出', !roadAudit.docOverflowX && roadAudit.issues.length === 0, roadAudit.issues.slice(0, 3).join('；'));
  await shot(page, `${vp.name}-17-trophy-road`);
  await page.click('#btn-road-close');
  check('[390x844] 獎盃之路可關閉', await page.isHidden('#ov-road'));
  // 開一場，用測試掛鉤把電腦的塔血量設成 1 讓這場必勝（只為了測「跨過門檻 → 解鎖畫面」的流程）
  await page.evaluate(() => window.__btd.skipIntro(true));
  await page.click('#btn-play');
  await page.waitForSelector('#screen-battle:not([hidden])');
  await page.evaluate(() => {
    for (const t of window.__btd.game().towers(1)) t.hp = 1;
    window.__btd.autoplay(600);
  });
  await page.waitForSelector('#ov-result:not([hidden])', { timeout: 10000 });
  const resTrophy = (await page.locator('#result-trophies').textContent()) ?? '';
  check('[390x844] 跨過 300 獎盃時結算寫出解鎖新競技場', resTrophy.includes('解鎖新競技場「石橋要塞」'), resTrophy.replace(/\s+/g, ' '));
  await page.click('#btn-result-home');
  await page.waitForSelector('#ov-unlock:not([hidden])', { timeout: 5000 }).catch(() => undefined);
  await page.waitForFunction(() => !document.getElementById('unlock-img').hidden && document.getElementById('unlock-img').naturalWidth > 0, null, { timeout: 15000 }).catch(() => undefined);
  await sleep(1100); // 進場動畫
  const unlock = await page.evaluate(() => ({ shown: !document.getElementById('ov-unlock').hidden, name: document.getElementById('unlock-name').textContent, img: !document.getElementById('unlock-img').hidden }));
  check('[390x844] 回主畫面時播放新競技場解鎖畫面（名稱與場景圖）', unlock.shown && unlock.name === '石橋要塞' && unlock.img, JSON.stringify(unlock));
  await shot(page, `${vp.name}-18-arena-unlock`);
  await page.click('#btn-unlock-ok');
  await page.waitForFunction((h0) => !document.getElementById('hero-img').hidden && document.getElementById('hero-img').src !== h0, hero0, { timeout: 15000 }).catch(() => undefined);
  const hero1 = await heroSrc();
  check(
    '[390x844] 關閉後主畫面換成新競技場（名稱與插圖都換）',
    (await page.isHidden('#ov-unlock')) && (await page.locator('#home-arena').textContent()) === '石橋要塞' && hero1.startsWith('data:image/png') && hero1 !== hero0,
  );
  await page.click('#btn-play');
  await page.waitForSelector('#screen-battle:not([hidden])');
  const vsArena = await page.locator('#vs-arena').textContent();
  const theme = await page.evaluate(() => window.__btd.battle.arenaTheme);
  check('[390x844] 下一場在新競技場開打', vsArena === '石橋要塞' && theme === 1, `${vsArena}，場地配色 ${theme}`);
  await ctx.close();
}

// ───────── 3a. 手機橫拿：提示轉直向並暫停，轉回後可繼續 ─────────
if (run('3')) {
  const vp = { name: 'mobile-844x390-landscape', viewport: { width: 844, height: 390 }, touch: true, dsf: 2 };
  const { ctx, page, cdp } = await newPage(vp);
  await page.goto(`${BASE}?test=1&seed=12`);
  await page.evaluate(() => window.__btd.skipIntro(true));
  await page.click('#btn-play');
  if (await page.isVisible('#btn-howto-ok')) await page.click('#btn-howto-ok');
  await page.waitForSelector('#screen-battle:not([hidden])');
  await sleep(600);
  const hintShown = await page.isVisible('#rotate-hint');
  const t0 = (await state(page)).timeLeft;
  await sleep(1200);
  const t1 = (await state(page)).timeLeft;
  await shot(page, `${vp.name}-01-rotate-hint`);
  await page.setViewportSize({ width: 390, height: 844 });
  await sleep(700);
  const hintGone = await page.isHidden('#rotate-hint');
  await tap(page, cdp, await page.locator('#btn-resume').boundingBox().then((b) => [b.x + b.width / 2, b.y + b.height / 2]));
  await sleep(1200);
  const t2 = (await state(page)).timeLeft;
  check('[844x390] 手機橫拿時提示轉直向並暫停，轉回直向後按繼續可接著玩', hintShown && Math.abs(t1 - t0) < 0.01 && hintGone && t2 < t1 - 0.5, `提示 ${hintShown}→${!hintGone}，暫停中時間 ${t0.toFixed(2)}→${t1.toFixed(2)}，繼續後 ${t2.toFixed(2)}`);
  await ctx.close();
}

// ───────── 3a-2. 返回鍵：對戰中第一次只暫停，再按一次回主畫面；主畫面按返回正常離開；多場後瀏覽紀錄不會累積 ─────────
if (run('3')) {
  const vp = VIEWPORTS[2];
  const { ctx, page } = await newPage(vp);
  // 先開一個別的頁面，模擬從 IG／Threads 點連結進來（返回要能回到那裡）。
  // 用 about:blank：直接打開 favicon.svg 這種非網頁檔，Chromium 會自動去要 /favicon.ico 而產生無關的 404
  await page.goto('about:blank');
  await page.goto(`${BASE}?test=1&seed=13`);
  await page.waitForSelector('#screen-home:not([hidden])');
  const len0 = await page.evaluate(() => history.length);
  await page.evaluate(() => window.__btd.skipIntro(true));
  await page.click('#btn-play');
  if (await page.isVisible('#btn-howto-ok')) await page.click('#btn-howto-ok');
  await page.waitForSelector('#screen-battle:not([hidden])');
  await sleep(800);
  const url0 = page.url();
  await page.evaluate(() => history.back());
  await sleep(600);
  const paused1 = await page.isVisible('#ov-pause');
  const inBattle1 = await page.isVisible('#screen-battle');
  await page.evaluate(() => history.back());
  await sleep(600);
  const home2 = await page.isVisible('#screen-home');
  const url2 = page.url();
  check('[390x844] 返回鍵：對戰中第一次只暫停，再按一次回主畫面，不會離開網頁', paused1 && inBattle1 && home2 && url2 === url0, `第一次：暫停 ${paused1}、仍在對戰 ${inBattle1}；第二次：主畫面 ${home2}；網址不變 ${url2 === url0}`);
  // 連續幾場：用介面離開（回主畫面）、再戰一場、結算後按返回，瀏覽紀錄都不能越堆越長
  const lens = [];
  for (let m = 0; m < 3; m++) {
    await page.click('#btn-play');
    await page.waitForSelector('#screen-battle:not([hidden])');
    await page.evaluate(() => window.__btd.autoplay(600));
    await page.waitForSelector('#ov-result:not([hidden])');
    await sleep(500);
    if (m === 0) {
      await page.click('#btn-again');
      await sleep(400);
      await page.evaluate(() => window.__btd.autoplay(600));
      await page.waitForSelector('#ov-result:not([hidden])');
      await sleep(500);
    }
    if (m === 1) await page.evaluate(() => history.back());
    else await page.click('#btn-result-home');
    await page.waitForSelector('#screen-home:not([hidden])');
    await sleep(400);
    lens.push(await page.evaluate(() => history.length));
  }
  check('[390x844] 多場之後瀏覽紀錄不會累積（每場最多一筆）', lens.every((n) => n <= len0 + 1), `開始 ${len0}，各場後 ${lens.join(' / ')}`);
  // 主畫面按返回：不攔截，正常回到前一個頁面（會換頁，所以不用 evaluate，交給瀏覽器的返回）
  await page.goBack({ waitUntil: 'commit' }).catch(() => null);
  const left = await page.waitForURL((u) => u.href === 'about:blank', { timeout: 5000 }).then(() => true).catch(() => false);
  check('[390x844] 主畫面按返回會正常離開遊戲頁（回到前一頁）', left, page.url());
  await ctx.close();
}

// ───────── 3b. 沒有 Web Audio 時仍可開戰；3c. 2D 備援畫面 ─────────
for (const variant of run('3') ? ['noaudio', 'render2d'] : []) {
  const vp = VIEWPORTS[3];
  const { ctx, page, cdp } = await newPage(vp);
  if (variant === 'noaudio') {
    await page.addInitScript(() => {
      Object.defineProperty(window, 'AudioContext', { configurable: true, value: undefined });
      Object.defineProperty(window, 'webkitAudioContext', { configurable: true, value: undefined });
    });
  }
  await page.goto(`${BASE}?test=1&seed=3${variant === 'render2d' ? '&render=2d' : ''}`);
  await page.evaluate(() => window.__btd.skipIntro(true));
  await page.click('#btn-play');
  await page.click('#btn-howto-ok');
  await page.waitForSelector('#screen-battle:not([hidden])');
  const idx = await findHand(page, 'troop');
  const cost = await cardCost(page, idx);
  const s0 = await waitElixir(page, cost);
  await drag(page, cdp, await cardBox(page, idx), await screenOf(page, 9.5, 24.5));
  const s1 = await state(page);
  if (variant === 'noaudio') {
    const audio = await page.evaluate(() => window.__btd.sound.state);
    check('[430x932] 沒有 Web Audio 時仍可開戰與出牌（無聲繼續）', audio === 'unavailable' && s1.played === s0.played + 1, `音訊狀態 ${audio}`);
  } else {
    const kind = await page.evaluate(() => window.__btd.battle.rendererKind);
    await sleep(600);
    await shot(page, 'mobile-430x932-13-fallback-2d');
    check('[430x932] WebGL 不可用時的 2D 備援畫面可出牌', kind === '2d' && s1.played === s0.played + 1, kind);
  }
  await ctx.close();
}

// ───────── 4. 載入：模擬 4 Mbps／150 ms、冷快取 ─────────
if (run('4')) {
  const vp = VIEWPORTS[2];
  const { ctx, page } = await newPage(vp);
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 4e6 / 8, uploadThroughput: 1e6 / 8 });
  let bytes = 0;
  const reqs = [];
  cdp.on('Network.loadingFinished', (e) => (bytes += e.encodedDataLength));
  cdp.on('Network.responseReceived', (e) => {
    if (!e.response.url.startsWith('data:')) reqs.push(`${e.response.status} ${e.response.mimeType} ${new URL(e.response.url).pathname}`);
  });
  const t0 = Date.now();
  await page.goto(BASE);
  await page.waitForSelector('#screen-home:not([hidden])');
  const ms = Date.now() - t0;
  await sleep(800);
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

// ───────── 4b. 主程式載入失敗：顯示提示與重新載入 ─────────
if (run('4')) {
  const ctx = await browser.newContext({ viewport: VIEWPORTS[1].viewport, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.route('**/assets/*.js', (route) => route.abort());
  await page.goto(BASE);
  await page.waitForSelector('#boot-retry:not([hidden])', { timeout: 20000 });
  const msg = await page.locator('#boot-msg').textContent();
  await shot(page, 'mobile-360x640-14-load-failed');
  await page.unroute('**/assets/*.js');
  await page.click('#boot-retry');
  await page.waitForSelector('#screen-home:not([hidden])', { timeout: 8000 });
  check('[load] 主程式載入失敗時顯示提示與重新載入按鈕，重試後可進入', msg.includes('載入失敗') && (await page.isVisible('#btn-play')), msg);
  await ctx.close();
}

// ───────── 5. CPU 降速 4 倍（近似中階手機的 JS 負擔）下的 FPS ─────────
if (run('5')) {
  const vp = VIEWPORTS[2];
  const { ctx, page } = await newPage(vp);
  const cdp = await ctx.newCDPSession(page);
  await page.goto(`${BASE}?test=1&seed=8`);
  await page.evaluate(() => window.__btd.skipIntro(true));
  await page.click('#btn-play');
  await page.click('#btn-howto-ok');
  await page.waitForSelector('#screen-battle:not([hidden])');
  await page.evaluate(() => {
    const b = window.__btd;
    b.autoplay(20);
    // 雙方各放一隊骷髏大軍、哥布林與幼龍在河邊交戰，做出大量單位同時混戰的畫面
    const g = b.game();
    const put = (team, card, x, y) => {
      const p = g.players[team];
      p.hand[0] = card;
      p.elixir = 10;
      g.deploy(team, 0, x, y);
    };
    for (const [card, x] of [['skeleton_army', 4.5], ['goblins', 13.5], ['baby_dragon', 9.5], ['skeleton_army', 13.5]]) {
      put(0, card, x, 18.5);
      put(1, card, x, 13.5);
    }
    b.autoplay(1.2);
  });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await sleep(1500);
  const f = await measureFps(page, 4000);
  const ents = (await state(page)).entities;
  const quality = await page.evaluate(() => window.__btd.battle.qualityLevel);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
  results.cpuThrottled = { rate: 4, ...f, entities: ents, quality };
  check('[390x844] CPU 降速 4 倍、大量單位交戰時仍 ≥ 30 FPS', f.fps >= 30, `${f.fps.toFixed(1)} FPS、p95 ${f.p95Ms.toFixed(1)} ms、實體 ${ents}、畫質 ${quality}`);
  await ctx.close();
}

// ───────── 6. 即時打完一整場（390×844 觸控，全部用真實觸控輸入出牌） ─────────
if (!QUICK && run('6')) {
  const vp = VIEWPORTS[2];
  const { ctx, page, cdp } = await newPage(vp);
  await page.goto(`${BASE}?test=1&seed=5`);
  await page.click('#btn-play');
  await page.click('#btn-howto-ok');
  await page.waitForSelector('#screen-battle:not([hidden])');
  await page.waitForFunction(() => window.__btd.battle.intro <= 0, null, { timeout: 15000 });
  const t0 = Date.now();
  let plays = 0;
  let lane = 0;
  const shotsAt = new Set([30, 125, 185, 245]);
  const fpsSamples = [];
  while (Date.now() - t0 < 420000) {
    const s = await state(page);
    if (s.phase === 'ended') break;
    const elapsed = 180 - s.timeLeft + (s.phase === 'overtime' ? 180 : 0);
    for (const t of [...shotsAt]) {
      if (elapsed >= t) {
        shotsAt.delete(t);
        await shot(page, `${vp.name}-15-live-${t}s`);
        fpsSamples.push(await measureFps(page, 1500));
      }
    }
    // 敵方部隊過河時先防守：在被攻擊那一路的側塔前放部隊或建築
    const threat = s.foes.filter(([, y]) => y > 15.5);
    if (threat.length && s.elixir >= 3) {
      const tx = threat.reduce((sum, [x]) => sum + x, 0) / threat.length < 9 ? 3.5 : 14.5;
      let best = -1;
      let bestCost = 99;
      for (let i = 0; i < 4; i++) {
        const id = s.hand[i];
        const c = await cardCost(page, i);
        if (id && !SPELLS.includes(id) && c <= s.elixir && Math.abs(c - 4) < Math.abs(bestCost - 4)) {
          best = i;
          bestCost = c;
        }
      }
      if (best >= 0) {
        const id = s.hand[best];
        const target = ['cannon', 'inferno', 'tombstone'].includes(id) ? [tx < 9 ? 6 : 12, 22] : [tx + (tx < 9 ? 1 : -1), 22.5];
        const before = s.played;
        await drag(page, cdp, await cardBox(page, best), await screenOf(page, ...target));
        if ((await state(page)).played === before + 1) plays++;
        await sleep(600);
        continue;
      }
    }
    if (s.elixir >= 7) {
      // 出能負擔、費用最高的卡；法術丟對方側塔附近，建築放中央，坦克放後方，其他放橋前
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
        const target = SPELLS.includes(id)
          ? id === 'log' ? [x, 18.5] : [x, 7.5]
          : ['cannon', 'inferno', 'tombstone'].includes(id) ? [9, 21] : ['golem', 'giant'].includes(id) ? [x, 30.5] : [x + (lane === 0 ? 1 : -1), 19.5];
        const before = s.played;
        await drag(page, cdp, await cardBox(page, best), await screenOf(page, ...target));
        if ((await state(page)).played === before + 1) plays++;
        lane = 1 - lane;
      }
    }
    await sleep(600);
  }
  const s = await state(page);
  await page.waitForSelector('#ov-result:not([hidden])', { timeout: 10000 });
  await sleep(1800);
  await shot(page, `${vp.name}-16-live-result`);
  results.liveMatch = { realSeconds: Math.round((Date.now() - t0) / 1000), touchDeploys: plays, result: s.result, fps: fpsSamples };
  check('[390x844] 以真實觸控輸入即時打完一整場並顯示結算', s.phase === 'ended' && plays >= 8, `觸控出牌 ${plays} 次，${Math.round((Date.now() - t0) / 1000)} 秒，結果 ${JSON.stringify(s.result)}`);
  const minFps = Math.min(...fpsSamples.map((f) => f.fps));
  check('[390x844] 即時對戰各時段 FPS ≥ 30（本機 GPU）', fpsSamples.length > 0 && minFps >= 30, fpsSamples.map((f) => f.fps.toFixed(0)).join(' / '));
  await tap(page, cdp, await page.locator('#btn-again').boundingBox().then((b) => [b.x + b.width / 2, b.y + b.height / 2]));
  await sleep(600);
  const r = await state(page);
  check('[390x844] 結算後點「再戰一場」開新局（重新開場倒數）', r.phase === 'regular' && r.entities === 6 && r.played === 0 && r.intro > 0);
  await ctx.close();
}

check('全程沒有 console error／pageerror／載入失敗', results.errors.length === 0, results.errors.slice(0, 5).join('；'));
results.finishedAt = new Date().toISOString();
results.summary = { total: results.checks.length, failed: failures };
// 快速版與單節重跑另存檔名，不覆蓋完整 e2e 的結果
const outName = ONLY ? `e2e-results-only-${ONLY.join('-')}.json` : QUICK ? 'e2e-results-quick.json' : 'e2e-results.json';
writeFileSync(`${outDir}${outName}`, JSON.stringify(results, null, 2));
console.log(`\n${results.checks.length - failures}/${results.checks.length} 通過，結果寫入 ${outDir}${outName}`);
await browser.close();
await new Promise((r) => server.httpServer.close(r));
process.exit(failures ? 1 : 0);
