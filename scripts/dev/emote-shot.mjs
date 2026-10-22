// 開發用：開戰後打開表情選單、自己發一個表情並讓電腦回一個，截圖檢查表情貼圖。node scripts/dev/emote-shot.mjs <輸出檔>
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [out = 'emote.png'] = process.argv.slice(2);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5194, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => localStorage.setItem('bridge-tower-duel.v1', JSON.stringify({ howtoSeen: true })));
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://localhost:5194/?test=1&seed=5');
  await page.waitForSelector('#btn-play');
  await page.waitForTimeout(6000);
  await page.evaluate(() => window.__btd.skipIntro(true));
  await page.click('#btn-play');
  await page.waitForTimeout(1500);
  await page.click('#btn-emote');
  await page.waitForTimeout(400);
  await page.screenshot({ path: out.replace('.png', '-picker.png') });
  await page.click('#emote-picker button:nth-child(2)');
  await page.evaluate(() => window.__btd.battle.enemyEmote?.('wow', 0));
  await page.waitForTimeout(500);
  await page.screenshot({ path: out });
  console.log('saved', out, errors.join(' | '));
} finally {
  await browser.close();
  await server.close();
}
