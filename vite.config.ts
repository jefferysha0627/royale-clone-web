import type { Plugin } from 'vite';
import { defineConfig } from 'vitest/config';

// 社群預覽需要絕對 HTTPS 網址：build 時以 SITE_URL 環境變數注入（例如 SITE_URL=https://example.pages.dev/ npm run build）。
function siteUrl(): Plugin {
  return {
    name: 'site-url',
    transformIndexHtml(html) {
      let url = process.env.SITE_URL ?? '';
      if (url && !url.endsWith('/')) url += '/';
      if (url) return html.replaceAll('__SITE_URL__', url);
      // 尚無正式網址：移除 canonical 與 og:url，圖片退回相對路徑（社群平台需要設定 SITE_URL 後重新 build 才能抓到預覽圖）
      return html
        .split('\n')
        .filter((line) => !(line.includes('data-site-url') && line.includes('__SITE_URL__')))
        .join('\n')
        .replaceAll('__SITE_URL__', '');
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [siteUrl()],
  build: { target: 'es2020', assetsInlineLimit: 0 },
  test: { include: ['tests/**/*.test.ts'] },
});
