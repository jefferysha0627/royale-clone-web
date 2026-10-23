// 開發用：把指定卡牌的卡面圖存成 PNG（檢查角色臉部等細節）。node scripts/dev/card-art.mjs <輸出前綴> <卡牌,卡牌,...>
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [prefix = 'card', list = 'knight,musketeer,archers,giant'] = process.argv.slice(2);
const ids = list.split(',');
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5192, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  await page.goto('http://localhost:5192/?test=1');
  await page.waitForSelector('#btn-play');
  await page.waitForFunction((ids) => ids.every((id) => window.__btd.portraits.get(id)), ids, { timeout: 30000 });
  const urls = await page.evaluate((ids) => ids.map((id) => window.__btd.portraits.get(id)), ids);
  urls.forEach((u, i) => writeFileSync(`${prefix}-${ids[i]}.jpg`, Buffer.from(u.split(',')[1], 'base64')));
  console.log('ok', ids.join(','));
} finally {
  await browser.close();
  await server.close();
}
