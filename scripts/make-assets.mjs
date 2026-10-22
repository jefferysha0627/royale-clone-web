// 產生 public/og-image.png（1200×630）與 public/apple-touch-icon.png（180×180）。用法：npm run assets
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import { launchBrowser } from './browser.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const server = await createServer({ root, server: { port: 5198, strictPort: true }, logLevel: 'error' });
await server.listen();
const browser = await launchBrowser();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 }, deviceScaleFactor: 1 });
  await page.goto('http://localhost:5198/tools/og.html');
  await page.waitForFunction(() => window.__ogReady === true);
  await page.waitForFunction(() => document.getElementById('icon').complete);
  await page.locator('#og').screenshot({ path: `${root}public/og-image.png` });

  const icon = await browser.newPage({ viewport: { width: 180, height: 180 }, deviceScaleFactor: 1 });
  await icon.setContent('<html><body style="margin:0;background:#16212c"></body></html>');
  await icon.goto('http://localhost:5198/favicon.svg');
  await icon.screenshot({ path: `${root}public/apple-touch-icon.png`, clip: { x: 0, y: 0, width: 180, height: 180 } });
  console.log('寫入 public/og-image.png、public/apple-touch-icon.png');
} finally {
  await browser.close();
  await server.close();
}
