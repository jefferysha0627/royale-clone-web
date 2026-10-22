// 效能量測：情境實驗室的大量單位場面，在不同 CPU 降速倍率下量測影格時間。
// node scripts/dev/perf.mjs [寬x高] [zoom]
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from '../browser.mjs';
const [size = '390x700', zoom = '1'] = process.argv.slice(2);
const [w, h] = size.split('x').map(Number);
const root = fileURLToPath(new URL('../..', import.meta.url));
const server = await createServer({ root, server: { port: 5199, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
for (const rate of [1, 4, 6]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await page.goto(`http://localhost:5199/tools/lab.html?s=stress&zoom=${zoom}`);
  await page.waitForTimeout(2600);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  const r = await page.evaluate(() => new Promise((res) => {
    const dts = []; let last = performance.now(); const t0 = last;
    const f = (now) => { dts.push(now - last); last = now; if (now - t0 < 4000) requestAnimationFrame(f); else { dts.shift(); const s = [...dts].sort((a, b) => a - b); const avg = dts.reduce((a, b) => a + b, 0) / dts.length; res({ fps: +(1000 / avg).toFixed(1), p95: +s[Math.floor(s.length * 0.95)].toFixed(1), max: +s[s.length - 1].toFixed(1), ents: window.__g.entities.length, fx: window.__r.effectCount }); } };
    requestAnimationFrame(f);
  }));
  console.log(`cpu x${rate}`, JSON.stringify(r));
  await ctx.close();
}
await browser.close();
await server.close();
