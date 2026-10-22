// 開發用：指定獎盃數，截主畫面、VS 開場與對戰畫面（檢查各競技場配色）。node scripts/dev/arena-shot.mjs <輸出前綴> <獎盃,獎盃,...> [寬x高]
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [prefix = 'arena', list = '0,750', size = '390x844'] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5196, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
try {
  for (const trophies of list.split(',').map(Number)) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await ctx.addInitScript((t) => localStorage.setItem('bridge-tower-duel.v1', JSON.stringify({ trophies: t, howtoSeen: true })), trophies);
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('http://localhost:5196/?test=1&seed=4');
    await page.waitForSelector('#btn-play');
    await page.waitForTimeout(2500);
    await page.screenshot({ path: `${prefix}-${trophies}-home.png` });
    await page.click('#btn-play');
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${prefix}-${trophies}-vs.png` });
    await page.evaluate(() => window.__btd.skipIntro(true));
    await page.waitForTimeout(4500);
    await page.evaluate(() => window.__btd.autoplay(30));
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${prefix}-${trophies}-battle.png` });
    console.log(trophies, errors.length ? errors.join(' | ') : 'ok');
    await ctx.close();
  }
} finally {
  await browser.close();
  await server.close();
}
