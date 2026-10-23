// 開發用：打幾場（雙方電腦代打）後打開個人資料與對戰紀錄截圖。node scripts/dev/profile-shot.mjs <輸出前綴> [場數] [寬x高]
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [prefix = 'profile', games = '3', size = '390x844'] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5195, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
try {
  const mobile = w < 700;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
  await ctx.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('bridge-tower-duel.v1', JSON.stringify({ howtoSeen: true }));
      sessionStorage.setItem('seeded', '1');
    }
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('http://localhost:5195/?test=1');
  await page.waitForSelector('#btn-play');
  await page.evaluate(() => window.__btd.skipIntro(true));
  for (let i = 0; i < Number(games); i++) {
    await page.click('#btn-play');
    await page.waitForSelector('#screen-battle:not([hidden])');
    await page.evaluate(() => window.__btd.autoplay(600));
    await page.waitForSelector('#ov-result:not([hidden])');
    await page.click('#btn-result-home');
    await page.waitForSelector('#screen-home:not([hidden])');
    if (await page.isVisible('#ov-unlock')) await page.click('#btn-unlock-ok');
  }
  await page.waitForTimeout(2500);
  await page.click('#btn-profile');
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${prefix}-profile.png` });
  console.log(errors.length ? errors.join(' | ') : 'ok');
} finally {
  await browser.close();
  await server.close();
}
