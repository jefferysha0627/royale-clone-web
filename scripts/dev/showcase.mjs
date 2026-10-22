// 展示截圖：開場 VS、倒數、拖曳預覽（格線、禁區、半透明單位、射程圈）、交戰、結算。
// node scripts/dev/showcase.mjs [寬x高,...]
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const sizes = (process.argv[2] ?? '390x844').split(',');
const root = fileURLToPath(new URL('../..', import.meta.url));
const out = fileURLToPath(new URL('../../../verification/v2/screens/', import.meta.url));
const server = await createServer({ root, server: { port: 5199, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  for (const size of sizes) {
    const [w, h] = size.split('x').map(Number);
    const mobile = w < 700;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: mobile, hasTouch: mobile });
    const page = await ctx.newPage();
    const errors = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    page.on('pageerror', (e) => errors.push(e.message));
    await page.goto('http://localhost:5199/?test=1&seed=21');
    await page.waitForSelector('#btn-play');
    await sleep(2500);
    await page.click('#btn-play');
    if (await page.isVisible('#btn-howto-ok')) {
      await page.screenshot({ path: `${out}${size}-howto.png` });
      await page.click('#btn-howto-ok');
    }
    await sleep(700);
    await page.screenshot({ path: `${out}${size}-vs.png` });
    await sleep(1500);
    await page.screenshot({ path: `${out}${size}-countdown.png` });
    await sleep(2200);
    // 拖曳一張部隊卡停在場上（不放開），截圖預覽
    const idx = await page.evaluate(() => window.__btd.game().players[0].hand.findIndex((id) => id && !['fireball', 'zap', 'arrows', 'log', 'poison', 'rocket'].includes(id)));
    await page.evaluate(() => (window.__btd.game().players[0].elixir = 10));
    const card = await page.locator(`#hand .card[data-index="${idx}"]`).boundingBox();
    const target = await page.evaluate(() => window.__btd.battle.screenOf(9.5, 21.5));
    await page.mouse.move(card.x + card.width / 2, card.y + card.height / 2);
    await page.mouse.down();
    await page.mouse.move(target[0], target[1], { steps: 10 });
    await sleep(300);
    await page.screenshot({ path: `${out}${size}-drag-preview.png` });
    await page.mouse.up();
    await sleep(900);
    await page.screenshot({ path: `${out}${size}-deployed.png` });
    // 快轉到交戰
    await page.evaluate(() => {
      const b = window.__btd;
      for (let i = 0; i < 160; i++) {
        b.autoplay(0.5);
        const g = b.game();
        if (g.entities.filter((e) => e.alive && e.kind !== 'tower').length >= 10 || g.phase === 'ended') break;
      }
    });
    await sleep(1400);
    await page.screenshot({ path: `${out}${size}-fight.png` });
    // 快轉到結束
    await page.evaluate(() => window.__btd.autoplay(400));
    await sleep(4500);
    await page.screenshot({ path: `${out}${size}-result.png` });
    console.log(size, errors.length ? `errors: ${errors.slice(0, 5).join(' | ')}` : 'no console errors');
    await ctx.close();
  }
} finally {
  await browser.close();
  await server.close();
}
