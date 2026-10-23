// 開發用：把六座競技場的小場景圖（主畫面插圖、獎盃之路縮圖）存成 PNG。node scripts/dev/arts-shot.mjs <輸出前綴>
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [prefix = 'art'] = process.argv.slice(2);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5198, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  await page.goto('http://localhost:5198/?test=1');
  await page.waitForSelector('#btn-play');
  const all = [0, 1, 2, 3, 4, 5];
  await page.evaluate((all) => window.__btd.portraits.requestArt(all), all);
  await page.waitForFunction((all) => all.every((i) => window.__btd.portraits.arenaArt(i)), all, { timeout: 30000 });
  const urls = await page.evaluate((all) => all.map((i) => window.__btd.portraits.arenaArt(i)), all);
  urls.forEach((u, i) => writeFileSync(`${prefix}-${i}.png`, Buffer.from(u.split(',')[1], 'base64')));
  console.log('ok', urls.map((u) => `${Math.round(u.length / 1024)}KB`).join(' '));
} finally {
  await browser.close();
  await server.close();
}
