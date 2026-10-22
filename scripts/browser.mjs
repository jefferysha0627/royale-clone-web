// 啟動測試用 Chromium：優先 CHROMIUM_PATH，其次 Playwright 預設瀏覽器，再找本機快取的其他版本，最後用已安裝的 Google Chrome。
import { existsSync, readdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { chromium } from 'playwright';

function cachedChromium() {
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, join(homedir(), 'Library/Caches/ms-playwright'), join(homedir(), '.cache/ms-playwright')].filter(Boolean);
  for (const root of roots) {
    if (!existsSync(root)) continue;
    const dirs = readdirSync(root).filter((d) => /^chromium(_headless_shell)?-\d+$/.test(d)).sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]));
    for (const d of dirs) {
      const candidates = [
        join(root, d, 'chrome-headless-shell-mac-arm64/chrome-headless-shell'),
        join(root, d, 'chrome-headless-shell-linux64/chrome-headless-shell'),
        join(root, d, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'),
        join(root, d, 'chrome-linux/chrome'),
        join(root, d, 'chrome-linux64/chrome'),
      ];
      const hit = candidates.find((p) => existsSync(p));
      if (hit) return hit;
    }
  }
  return null;
}

export async function launchBrowser(opts = {}) {
  const base = { headless: true, ...opts };
  if (process.env.CHROMIUM_PATH) return chromium.launch({ ...base, executablePath: process.env.CHROMIUM_PATH });
  try {
    return await chromium.launch(base);
  } catch (err) {
    const cached = cachedChromium();
    if (cached) return chromium.launch({ ...base, executablePath: cached });
    try {
      return await chromium.launch({ ...base, channel: 'chrome' });
    } catch {
      throw err;
    }
  }
}
