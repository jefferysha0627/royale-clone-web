// 開發用：牌組畫面捲到最下面截圖（看卡牌收藏的最後幾張）。node scripts/dev/deck-bottom.mjs <輸出檔> [寬x高]
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [out = 'deck-bottom.png', size = '390x844'] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5195, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
try {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto('http://localhost:5195/?test=1');
  await page.waitForSelector('#btn-deck');
  await page.waitForTimeout(5000);
  await page.click('#btn-deck');
  await page.waitForTimeout(800);
  await page.evaluate(() => {
    const el = document.getElementById('screen-deck');
    el?.scrollTo(0, el.scrollHeight);
    window.scrollTo(0, document.body.scrollHeight);
    document.querySelectorAll('.deck-grid, .collection').forEach((g) => g.lastElementChild?.scrollIntoView());
  });
  await page.waitForTimeout(600);
  await page.screenshot({ path: out });
  console.log('saved', out);
} finally {
  await browser.close();
  await server.close();
}
