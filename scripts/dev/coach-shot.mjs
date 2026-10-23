// 開發用：第一場的新手教學提示截圖（示範拖曳、能量說明、提醒防守）。node scripts/dev/coach-shot.mjs <輸出前綴> [寬x高]
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [prefix = 'coach', size = '390x844'] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5191, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: w < 700, hasTouch: w < 700 });
  await ctx.addInitScript(() => localStorage.setItem('bridge-tower-duel.v1', JSON.stringify({ howtoSeen: true })));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://localhost:5191/?test=1&seed=3');
  await page.waitForSelector('#btn-play');
  await page.evaluate(() => window.__btd.skipIntro(true));
  await page.click('#btn-play');
  await sleep(1300);
  await page.screenshot({ path: `${prefix}-1-drag.png` });
  const tip1 = await page.locator('#coach-tip').textContent();
  // 用測試掛鉤直接出一張牌（等同拖曳成功）
  await page.evaluate(() => {
    const g = window.__btd.game();
    g.players[0].elixir = 10;
    const id = g.players[0].hand.find((c) => c);
    g.deploy(0, g.players[0].hand.indexOf(id), 9, 24);
  });
  await sleep(700);
  await page.screenshot({ path: `${prefix}-2-elixir.png` });
  const tip2 = await page.locator('#coach-tip').textContent();
  // 等電腦的部隊過河
  let tip3 = '';
  for (let i = 0; i < 80; i++) {
    await page.evaluate(() => window.__btd.fastForward(0.5));
    await sleep(60);
    tip3 = (await page.isVisible('#coach')) ? await page.locator('#coach-tip').textContent() : '';
    if (tip3.includes('過河')) break;
  }
  await sleep(500);
  await page.screenshot({ path: `${prefix}-3-defend.png` });
  console.log(JSON.stringify({ tip1, tip2, tip3, errors }));
} finally {
  await browser.close();
  await server.close();
}
