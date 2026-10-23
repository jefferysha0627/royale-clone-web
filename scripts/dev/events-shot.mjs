// 開發用：活動對戰清單、三倍能量開場與對戰中、驟死對決 HUD、活動結算畫面截圖。node scripts/dev/events-shot.mjs <輸出前綴> [寬x高]
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [prefix = 'events', size = '390x844'] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5198, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
try {
  const mobile = w < 700;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
  await ctx.addInitScript(() => localStorage.setItem('bridge-tower-duel.v1', JSON.stringify({ trophies: 420, howtoSeen: true, coachDone: true })));
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://localhost:5198/?test=1');
  await page.waitForSelector('#btn-play');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${prefix}-home.png` });
  await page.click('#btn-events');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${prefix}-list.png` });
  await page.click('.ev-go[data-mode="triple"]');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${prefix}-vs.png` });
  await page.waitForTimeout(3300);
  await page.screenshot({ path: `${prefix}-start.png` });
  const t0 = await page.evaluate(() => window.__btd.game().players[0].elixir);
  await page.evaluate(() => window.__btd.autoplay(25));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${prefix}-triple.png` });
  const info = await page.evaluate(() => {
    const g = window.__btd.game();
    return { mode: g.mode, mult: g.elixirMultiplier(), badge: document.getElementById('hud-mult')?.textContent ?? '', played: g.players[0].cardsPlayed };
  });
  console.log('triple', JSON.stringify({ startElixir: t0, ...info }));
  await page.evaluate(() => window.__btd.autoplay(400));
  await page.waitForSelector('#ov-result:not([hidden])', { timeout: 15000 });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${prefix}-result.png` });
  const res = await page.evaluate(() => ({
    trophies: document.getElementById('result-trophies')?.innerText ?? '',
    stats: document.getElementById('result-stats')?.innerText ?? '',
    saved: window.__btd.settings.trophies,
    log0: window.__btd.settings.log[0]?.m,
  }));
  console.log('result', JSON.stringify(res));
  // 驟死對決
  await page.click('#btn-result-home').catch(() => page.evaluate(() => window.__btd.battle.stop()));
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    window.__btd.skipIntro(true);
  });
  await page.click('#btn-events');
  await page.click('.ev-go[data-mode="sudden"]');
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${prefix}-sudden.png` });
  const sd = await page.evaluate(() => ({ label: document.getElementById('hud-time-label')?.textContent ?? '', phase: window.__btd.game().phase }));
  console.log('sudden', JSON.stringify(sd));
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  console.log('ok');
} finally {
  await browser.close();
  await server.close();
}
