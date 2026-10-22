// 開發用：開戰後快轉 N 秒（雙方電腦代打）再截圖。node scripts/dev/battle-shot.mjs <輸出前綴> [秒數] [寬x高,...] [seed]
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [prefix = 'battle', secs = '25', sizes = '390x844', seed = '7', extra = ''] = process.argv.slice(2);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5199, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
try {
  for (const size of sizes.split(',')) {
    const [w, h] = size.split('x').map(Number);
    const mobile = w < 700;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto(`http://localhost:5199/?test=1&seed=${seed}${extra}`);
    await page.waitForSelector('#btn-play');
    await page.evaluate(() => window.__btd.skipIntro(true));
    await page.click('#btn-play');
    if (await page.isVisible('#btn-howto-ok')) await page.click('#btn-howto-ok');
    await page.waitForTimeout(800);
    // 快轉到場上部隊夠多的時刻（最多 secs 秒）
    await page.evaluate((s) => {
      const b = window.__btd;
      for (let i = 0; i < Number(s) * 2; i++) {
        b.autoplay(0.5);
        const g = b.game();
        if (g.entities.filter((e) => e.alive && e.kind !== 'tower').length >= 14 || g.phase === 'ended') break;
      }
    }, secs);
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${prefix}-${size}.png` });
    const info = await page.evaluate(() => ({ kind: window.__btd.battle.rendererKind, ents: window.__btd.game().entities.length, fx: window.__btd.battle.effectCount }));
    console.log(size, JSON.stringify(info), errors.length ? `errors: ${errors.slice(0, 5).join(' | ')}` : '');
    await ctx.close();
  }
} finally {
  await browser.close();
  await server.close();
}
