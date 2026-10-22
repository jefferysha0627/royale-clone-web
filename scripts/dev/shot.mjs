// 開發用截圖：node scripts/dev/shot.mjs <路徑> <輸出檔> [寬] [高] [等待毫秒] [dpr]
// 會自動啟動 Vite 開發伺服器（5199 埠），用 headless Chromium 開啟頁面後截圖。
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [path = '/', out = 'shot.png', w = '900', h = '700', wait = '1500', dpr = '1'] = process.argv.slice(2);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5199, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
try {
  const page = await browser.newPage({ viewport: { width: Number(w), height: Number(h) }, deviceScaleFactor: Number(dpr) });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(`http://localhost:5199${path}`);
  await page.waitForTimeout(Number(wait));
  await page.screenshot({ path: out });
  if (errors.length) console.log('errors:', errors.slice(0, 10).join('\n'));
  console.log('saved', out);
} finally {
  await browser.close();
  await server.close();
}
