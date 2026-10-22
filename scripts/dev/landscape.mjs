// 開發用：手機橫向（844×390）開戰截圖，檢查橫向時版面是否還能玩。
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const out = process.argv[2] ?? 'landscape.png';
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5197, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
try {
  const ctx = await browser.newContext({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto('http://localhost:5197/?test=1&seed=3');
  await page.waitForSelector('#btn-play');
  await page.screenshot({ path: out.replace('.png', '-home.png') });
  await page.evaluate(() => window.__btd.skipIntro(true));
  await page.click('#btn-play');
  if (await page.isVisible('#btn-howto-ok')) await page.click('#btn-howto-ok');
  await page.waitForTimeout(1200);
  await page.evaluate(() => window.__btd.autoplay(25));
  await page.waitForTimeout(800);
  await page.screenshot({ path: out });
  console.log('saved', out);
} finally {
  await browser.close();
  await server.close();
}
