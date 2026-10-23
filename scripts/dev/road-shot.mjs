// 開發用：主畫面（指定獎盃數）、獎盃之路與新競技場解鎖畫面截圖。node scripts/dev/road-shot.mjs <輸出前綴> [獎盃] [寬x高]
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [prefix = 'road', trophies = '820', size = '390x844'] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5197, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
try {
  const mobile = w < 700;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
  await ctx.addInitScript((t) => localStorage.setItem('bridge-tower-duel.v1', JSON.stringify({ trophies: t, howtoSeen: true })), Number(trophies));
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://localhost:5197/?test=1');
  await page.waitForSelector('#btn-play');
  await page.waitForTimeout(3500);
  await page.screenshot({ path: `${prefix}-home.png` });
  await page.click('#btn-road');
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${prefix}-road.png` });
  await page.click('#btn-road-close');
  await page.evaluate(() => window.__btd.showUnlock(3));
  await page.waitForTimeout(2200);
  await page.screenshot({ path: `${prefix}-unlock.png` });
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  console.log('ok');
} finally {
  await browser.close();
  await server.close();
}
