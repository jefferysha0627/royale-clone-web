// 連續截圖：node scripts/dev/seq.mjs <情境> <輸出前綴> <開始等待毫秒> <張數> <間隔毫秒> [zoom] [x,y]
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';
const [s = 'melee', out = 'seq', wait = '3000', n = '4', gap = '150', zoom = '3'] = process.argv.slice(2);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5199, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
const page = await browser.newPage({ viewport: { width: 700, height: 520 }, deviceScaleFactor: 1 });
await page.goto(`http://localhost:5199/tools/lab.html?s=${s}&zoom=${zoom}`);
await page.waitForTimeout(Number(wait));
for (let i = 0; i < Number(n); i++) {
  await page.screenshot({ path: `${out}-${i}.png` });
  await page.waitForTimeout(Number(gap));
}
await browser.close();
await server.close();
