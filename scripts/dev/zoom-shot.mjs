// 開發用：雙方電腦代打一段時間後，把鏡頭拉近到交戰最密集的地方截圖（檢查角色細節）。
// node scripts/dev/zoom-shot.mjs <輸出前綴> [秒數] [倍率] [seed] [獎盃]
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [prefix = 'zoom', secs = '40', zoom = '2.6', seed = '9', trophies = '0'] = process.argv.slice(2);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5193, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ctx.addInitScript((t) => localStorage.setItem('bridge-tower-duel.v1', JSON.stringify({ trophies: t, howtoSeen: true })), Number(trophies));
  const page = await ctx.newPage();
  await page.goto(`http://localhost:5193/?test=1&seed=${seed}`);
  await page.waitForSelector('#btn-play');
  await page.evaluate(() => window.__btd.skipIntro(true));
  await page.click('#btn-play');
  await page.waitForTimeout(800);
  const spot = await page.evaluate((s) => {
    const b = window.__btd;
    let best = null;
    for (let i = 0; i < Number(s) * 2; i++) {
      b.autoplay(0.5);
      const ents = b.game().entities.filter((e) => e.alive && e.kind === 'troop');
      if (ents.length >= 6) {
        // 找周圍 3 格內單位最多的點
        for (const e of ents) {
          const n = ents.filter((o) => Math.hypot(o.x - e.x, o.y - e.y) < 3).length;
          if (!best || n > best.n) best = { n, x: e.x, y: e.y };
        }
        if (best.n >= 6) break;
      }
    }
    return best;
  }, secs);
  await page.waitForTimeout(400);
  if (spot) await page.evaluate(([x, y, z]) => window.__btd.battle.renderer.debugView(x, y, z), [spot.x, spot.y, Number(zoom)]);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${prefix}.png` });
  console.log(JSON.stringify(spot));
} finally {
  await browser.close();
  await server.close();
}
