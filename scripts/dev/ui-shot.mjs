// 開發用：主畫面、牌組、卡牌資訊截圖。node scripts/dev/ui-shot.mjs <輸出前綴> [寬x高]
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [prefix = 'ui', size = '390x844'] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5199, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
try {
  const mobile = w < 700;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://localhost:5199/?test=1');
  await page.waitForSelector('#btn-play');
  await page.waitForTimeout(4500);
  await page.screenshot({ path: `${prefix}-home.png` });
  await page.click('#btn-deck');
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${prefix}-deck.png` });
  await page.click('.tile[data-card="lancer"]');
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${prefix}-info.png` });
  if (errors.length) console.log('errors:', errors.slice(0, 5).join(' | '));
  console.log('ok');
} finally {
  await browser.close();
  await server.close();
}
