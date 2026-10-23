// 開發用：結算畫面截圖（指定尺寸），並檢查按鈕是否溢出。node scripts/dev/result-shot.mjs <輸出前綴> [寬x高]
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [prefix = 'result', size = '360x640'] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5189, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
try {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => localStorage.setItem('bridge-tower-duel.v1', JSON.stringify({ howtoSeen: true, coachDone: true })));
  const page = await ctx.newPage();
  await page.goto('http://localhost:5189/?test=1&seed=8');
  await page.waitForSelector('#btn-play');
  await page.evaluate(() => window.__btd.skipIntro(true));
  await page.click('#btn-play');
  await page.evaluate(() => window.__btd.autoplay(600));
  await page.waitForSelector('#ov-result:not([hidden])');
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${prefix}-${size}.png` });
  const audit = await page.evaluate(() => [...document.querySelectorAll('#ov-result button')].map((b) => ({ id: b.id, w: Math.round(b.getBoundingClientRect().width), h: Math.round(b.getBoundingClientRect().height), overflow: b.scrollWidth > b.clientWidth + 1 })));
  console.log(JSON.stringify(audit));
} finally {
  await browser.close();
  await server.close();
}
