// 驗證公開網址：node scripts/verify-live.mjs https://xxx/ [--live]
// --live：以真實觸控輸入即時打完一整場（約 3～4 分鐘）；否則真實出牌數次後快轉打完。
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { launchBrowser } from './browser.mjs';

const URL_ = process.argv[2];
const LIVE = process.argv.includes('--live');
if (!URL_ || !URL_.startsWith('https://') || !URL_.endsWith('/')) {
  console.error('用法：node scripts/verify-live.mjs https://網址/ [--live]');
  process.exit(1);
}
const host = new URL(URL_).host;
const outDir = fileURLToPath(new URL(`../../verification/live/${host}/`, import.meta.url));
mkdirSync(outDir, { recursive: true });
const results = { url: URL_, startedAt: new Date().toISOString(), checks: [], errors: [], http: [] };
let failed = 0;
function check(name, ok, detail = '') {
  results.checks.push({ name, ok: !!ok, detail });
  if (!ok) failed++;
  console.log(`${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ───────── HTTP ─────────
async function get(u) {
  const r = await fetch(u, { redirect: 'follow' });
  const body = r.headers.get('content-type')?.includes('text') ? await r.text() : Buffer.from(await r.arrayBuffer());
  results.http.push({ url: u, status: r.status, type: r.headers.get('content-type'), bytes: body.length });
  return { status: r.status, type: r.headers.get('content-type') ?? '', body };
}
const home = await get(URL_);
check('首頁 HTTP 200 text/html', home.status === 200 && home.type.includes('text/html'), `${home.status} ${home.type}`);
const html = String(home.body);
const meta = (prop) => html.match(new RegExp(`<meta[^>]+(?:property|name)="${prop}"[^>]+content="([^"]*)"`))?.[1];
const ogImage = meta('og:image');
const ogUrl = meta('og:url');
const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1];
results.meta = { title: html.match(/<title>([^<]*)<\/title>/)?.[1], ogTitle: meta('og:title'), ogImage, ogUrl, canonical, description: meta('description') };
check('og:image、og:url、canonical 都是此網站的絕對 HTTPS 網址', ogImage === `${URL_}og-image.png` && ogUrl === URL_ && canonical === URL_, JSON.stringify({ ogImage, ogUrl, canonical }));
check('標題與分享資訊使用新名稱並標示非官方', /皇室戰爭克隆/.test(results.meta.title ?? '') && /非官方/.test(results.meta.ogTitle ?? '') && /Supercell/.test(results.meta.description ?? ''), results.meta.title);
const refs = [...html.matchAll(/(?:src|href)="(\.\/[^"]+|assets\/[^"]+|[a-z-]+\.(?:svg|png))"/g)].map((m) => m[1]);
for (const ref of new Set([...refs, 'og-image.png', 'favicon.svg', 'apple-touch-icon.png'])) {
  const u = new URL(ref, URL_).href;
  const r = await get(u);
  const expect = ref.endsWith('.js') ? 'javascript' : ref.endsWith('.css') ? 'text/css' : ref.endsWith('.svg') ? 'image/svg+xml' : 'image/png';
  check(`資源 ${ref} HTTP 200 ${expect}`, r.status === 200 && r.type.includes(expect), `${r.status} ${r.type} ${r.body.length} bytes`);
}
const again = await get(`${URL_}?ref=reload`);
check('帶查詢字串重新整理仍回首頁（不 404）', again.status === 200 && String(again.body).includes('皇室戰爭克隆'));
const missing = await get(`${URL_}this-page-does-not-exist`);
results.notFoundStatus = missing.status;

// ───────── 真實瀏覽器 ─────────
const browser = await launchBrowser();
results.browser = `Chromium ${browser.version()}（headless）`;
async function open(viewport, touch) {
  const ctx = await browser.newContext({ viewport, deviceScaleFactor: touch ? 3 : 1, isMobile: touch, hasTouch: touch });
  const page = await ctx.newPage();
  page.on('console', (m) => m.type() === 'error' && results.errors.push(`console: ${m.text()}`));
  page.on('pageerror', (e) => results.errors.push(`pageerror: ${e.message}`));
  page.on('requestfailed', (r) => results.errors.push(`requestfailed: ${r.url()}`));
  page.on('response', (r) => r.status() >= 400 && results.errors.push(`HTTP ${r.status()} ${r.url()}`));
  return { ctx, page, cdp: touch ? await ctx.newCDPSession(page) : null };
}
const state = (page) =>
  page.evaluate(() => {
    const g = window.__btd.game();
    const p = g.players[0];
    return { elixir: p.elixir, played: p.cardsPlayed, spent: p.elixirSpent, hand: [...p.hand], phase: g.phase, timeLeft: g.timeLeft, entities: g.entities.length, result: g.result };
  });
const cardAt = async (page, i) => {
  const b = await page.locator(`#hand .card[data-index="${i}"]`).boundingBox();
  return [b.x + b.width / 2, b.y + b.height / 2];
};
const cost = (page, i) => page.locator(`#hand .card[data-index="${i}"] .cost b`).textContent().then(Number);
const at = (page, x, y) => page.evaluate(([x, y]) => window.__btd.battle.screenOf(x, y), [x, y]);
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
  await sleep(80);
}

async function playthrough(label, viewport, touch, live) {
  const { ctx, page, cdp } = await open(viewport, touch);
  await page.goto(`${URL_}?test=1`);
  await page.waitForSelector('#screen-home:not([hidden])', { timeout: 15000 });
  const credit = await page.locator('.foot').textContent();
  check(`[${label}] 主畫面載入，頁尾標示非官方粉絲作品`, credit.includes('非官方粉絲作品') && credit.includes('Supercell'), credit.trim());
  const favicon = await page.evaluate(async () => {
    const img = new Image();
    img.src = document.querySelector('link[rel="icon"]').href;
    await img.decode().catch(() => undefined);
    return img.naturalWidth;
  });
  check(`[${label}] favicon 可在頁面中解碼`, favicon > 0, `寬 ${favicon}`);
  await page.screenshot({ path: `${outDir}${label}-home.png` });
  await page.click('#btn-play');
  await page.click('#btn-howto-ok');
  await page.waitForSelector('#screen-battle:not([hidden])');
  await sleep(300);
  const audio = await page.evaluate(() => window.__btd.sound.state);
  check(`[${label}] 點開始後音訊啟用`, audio === 'running', audio);
  let plays = 0;
  const t0 = Date.now();
  let lane = 0;
  while (Date.now() - t0 < (live ? 300000 : 25000)) {
    const s = await state(page);
    if (s.phase === 'ended') break;
    for (let i = 0; i < 4; i++) {
      const c = await cost(page, i);
      if (c > s.elixir) continue;
      const id = s.hand[i];
      const x = lane ? 14.5 : 3.5;
      const target = ['fireball', 'arrows', 'zap'].includes(id) ? [x, 6.5] : id === 'cannon' ? [9, 22] : [x + (lane ? -1 : 1), 20];
      const before = s.played;
      await drag(page, cdp, await cardAt(page, i), await at(page, ...target));
      if ((await state(page)).played === before + 1) plays++;
      lane = 1 - lane;
      break;
    }
    if (plays === 3 && !live) await page.screenshot({ path: `${outDir}${label}-battle.png` });
    await sleep(live ? 900 : 1200);
  }
  if (live) await page.screenshot({ path: `${outDir}${label}-battle.png` });
  if (!live) await page.evaluate(() => window.__btd.autoplay(400));
  await page.waitForSelector('#ov-result:not([hidden])', { timeout: 15000 });
  const s = await state(page);
  await page.screenshot({ path: `${outDir}${label}-result.png` });
  check(`[${label}] 真實${touch ? '觸控' : '滑鼠'}出牌 ${plays} 次並打完一場（${live ? '即時' : '出牌後快轉'}）`, plays >= 3 && s.phase === 'ended', JSON.stringify(s.result));
  await page.click('#btn-again');
  await sleep(300);
  const r = await state(page);
  check(`[${label}] 再玩一場重置`, r.phase === 'regular' && r.entities === 6 && r.played === 0);
  await page.reload();
  await page.waitForSelector('#screen-home:not([hidden])', { timeout: 15000 });
  check(`[${label}] 重新整理後正常回到主畫面`, await page.isVisible('#btn-play'));
  await ctx.close();
  return { plays, result: s.result };
}

results.mobile = await playthrough('mobile-390x844', { width: 390, height: 844 }, true, LIVE);
results.desktop = await playthrough('desktop-1280x800', { width: 1280, height: 800 }, false, false);
check('全程沒有 console error、載入失敗或 4xx/5xx 回應', results.errors.length === 0, results.errors.slice(0, 5).join('；'));
await browser.close();
results.finishedAt = new Date().toISOString();
results.summary = { total: results.checks.length, failed };
writeFileSync(`${outDir}results.json`, JSON.stringify(results, null, 2));
console.log(`\n${results.checks.length - failed}/${results.checks.length} 通過，結果寫入 verification/live/${host}/results.json`);
process.exit(failed ? 1 : 0);
