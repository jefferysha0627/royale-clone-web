// 開發用：打一場（代打）→ 對戰紀錄的「重播」→ 快轉到結束，比對結果；再用分享連結開啟朋友重播。node scripts/dev/replay-shot.mjs <輸出前綴>
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';

const [prefix = 'replay'] = process.argv.slice(2);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5190, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
try {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    if (!sessionStorage.getItem('seeded')) {
      localStorage.setItem('bridge-tower-duel.v1', JSON.stringify({ howtoSeen: true, coachDone: true }));
      sessionStorage.setItem('seeded', '1');
    }
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('http://localhost:5190/?test=1&seed=31');
  await page.waitForSelector('#btn-play');
  await page.evaluate(() => window.__btd.skipIntro(true));
  await page.click('#btn-play');
  await page.waitForSelector('#screen-battle:not([hidden])');
  await page.evaluate(() => window.__btd.autoplay(600));
  await page.waitForSelector('#ov-result:not([hidden])');
  const live = await page.evaluate(() => ({ result: window.__btd.game().result, hash: window.__btd.game().stateHash(), rep: window.__btd.settings.log[0].rep }));
  await page.click('#btn-result-home');
  await page.waitForSelector('#screen-home:not([hidden])');
  await page.click('#btn-profile');
  await page.waitForSelector('#ov-profile:not([hidden])');
  await page.click('#profile-log .log-replay');
  await page.waitForSelector('#screen-battle:not([hidden])');
  await sleep(1500);
  await page.screenshot({ path: `${prefix}-1-replay.png` });
  const bar = await page.isVisible('#replay-bar');
  await page.click('#btn-replay-speed');
  const speed = await page.locator('#btn-replay-speed').textContent();
  await page.evaluate(() => window.__btd.fastForward(600));
  await page.waitForSelector('#ov-result:not([hidden])');
  await sleep(1200);
  await page.screenshot({ path: `${prefix}-2-replay-result.png` });
  const replayed = await page.evaluate(() => ({ result: window.__btd.game().result, again: document.getElementById('btn-again').textContent, trophiesHidden: document.getElementById('result-trophies').hidden, logLen: window.__btd.settings.log.length }));
  await page.click('#btn-result-home');
  // 朋友分享的連結
  const page2 = await ctx.newPage();
  page2.on('pageerror', (e) => errors.push(e.message));
  await page2.goto(`http://localhost:5190/?test=1&replay=${live.rep}`);
  await page2.waitForSelector('#ov-replay-invite:not([hidden])');
  await sleep(1500);
  await page2.screenshot({ path: `${prefix}-3-invite.png` });
  const info = await page2.locator('#replay-invite-info').textContent();
  const urlAfter = await page2.evaluate(() => location.search);
  await page2.click('#btn-replay-watch');
  await sleep(1200);
  const friendName = await page2.locator('#hud-name-me').textContent();
  await page2.screenshot({ path: `${prefix}-4-friend.png` });
  console.log(JSON.stringify({ live: live.result, replayed: replayed.result, same: JSON.stringify(live.result) === JSON.stringify(replayed.result), bar, speed, again: replayed.again, trophiesHidden: replayed.trophiesHidden, logLen: replayed.logLen, repLen: live.rep.length, info, urlAfter, friendName, errors }));
} finally {
  await browser.close();
  await server.close();
}
