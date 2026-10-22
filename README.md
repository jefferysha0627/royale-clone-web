# 皇室戰爭克隆（非官方）

直向手機優先的即時推塔對戰網頁遊戲。純前端、單人對電腦，可放在任何靜態網站主機。以《皇室戰爭》核心玩法為參考的非官方克隆，與 Supercell 無關；素材全部自製，不含官方圖片或音效。

## 需求

- Node.js 24（已在 24.16.0 驗證）、npm 11
- 自動瀏覽器測試需要 Chromium：預設用 Playwright 的瀏覽器；沒有時 `scripts/browser.mjs` 會改用本機快取的其他版本或已安裝的 Google Chrome，也可用 `CHROMIUM_PATH=/path/to/chrome` 指定

## 安裝與啟動

```bash
npm install
npm run dev        # 開發伺服器，手機可用區網 IP 連入
```

## 指令

| 指令 | 用途 |
| --- | --- |
| `npm run build` | 型別檢查 + production build，輸出到 `dist/` |
| `npm run preview` | 在 4173 埠預覽 `dist/` |
| `npm test` | 核心規則自動測試（vitest，21 項） |
| `npm run sim -- 30 1` | 無畫面電腦對電腦批次模擬（場數、起始 seed） |
| `npm run e2e` | 先 `npm run build`。用真實瀏覽器操作桌面與 360×640、390×844、430×932，含一場即時打完的對戰（約 5 分鐘）；加 `-- --quick` 略過即時整場。截圖與結果寫入上一層的 `verification/`（工作資料夾，不在此 repo） |
| `npm run assets` | 用遊戲自己的渲染器重新產生 `public/og-image.png`（1200×630）與 `public/apple-touch-icon.png` |
| `npm run check` | 型別檢查 + 測試 + build |

## 操作

- 把下方卡牌**拖到**己方半場放開即出兵；或**先點卡牌再點地面**。拖回手牌區可取消。
- 選取卡牌時，紅色區域代表不能部署。法術可以丟到任何地方。
- 桌面：滑鼠同上，選卡後移動滑鼠可預覽落點；鍵盤 `1`～`4` 選卡、`Esc` 取消選取或暫停。
- 左上角暫停，可繼續、靜音、重新開始或離開。切到背景會自動暫停，回來點「繼續」。

## 規則（自訂的實作選擇，不是原作數據）

- 3 分鐘一局，最後 60 秒能量加倍。推倒側塔得 1 皇冠，推倒國王塔直接獲勝。
- 時間到皇冠多者勝；平手進入 60 秒延長賽，先拿皇冠者勝；仍平手比較雙方血量比例最低的塔。
- 電腦難度：簡單／普通／困難，全部遵守同一套能量與部署規則。

## 程式結構

```text
src/
  sim/        戰鬥模擬（與畫面無關，可在 Node 執行）
    config.ts   場地、時間、能量、塔等所有規則參數
    cards.ts    13 張卡牌數值與預設牌組
    game.ts     固定步長模擬：部署、索敵、移動繞障、投射物、勝負
    ai.ts       電腦對手（三種難度）
    rng.ts      可指定 seed 的亂數
  render/     Canvas 2D 渲染（只讀模擬狀態）
  art/        自製 SVG 圖示，卡面與場上單位共用
  ui/         對戰控制（輸入、HUD、暫停、結算）、音效、分享、設定儲存
tests/        核心規則測試
scripts/      模擬、e2e、素材產生、瀏覽器啟動
tools/        分享圖產生頁（只在開發伺服器使用，不進 build）
public/       favicon、apple-touch-icon、og-image
```

網址參數：`?seed=123` 固定對戰亂數（重現問題用）；`?test=1` 開啟自動測試掛鉤 `window.__btd`（一般玩家不需要）。

## 部署

正式網址：

- Cloudflare Pages：https://royale-clone-web.pages.dev/
- GitHub Pages：https://jefferysha0627.github.io/royale-clone-web/

產物是純靜態檔案，只有一個 `index.html`、資源都用相對路徑，子路徑（GitHub Pages 的 `/royale-clone-web/`）也能用，重新整理不會 404。兩個網站的分享預覽絕對網址不同，所以部署腳本會各自用正確的 `SITE_URL` 建置到 `dist-cf/`、`dist-gh/`，並在建置前先跑型別檢查與測試。

```bash
# Cloudflare Pages（免費方案、classic Pages 專案 royale-clone-web；需先 npx wrangler login）
CLOUDFLARE_ACCOUNT_ID=<你的帳號 ID> npm run deploy:cf

# GitHub Pages（需先 gh auth login；建置結果提交到 gh-pages 分支，一般 push 不強制覆蓋）
npm run deploy:gh

# 部署後驗證公開網址（HTTP、meta、資源、真實瀏覽器打完一場、重新整理）
npm run verify:live -- https://royale-clone-web.pages.dev/
npm run verify:live -- https://jefferysha0627.github.io/royale-clone-web/
```

- 帳號 ID 可用 `npx wrangler whoami` 查詢；不要把 token 寫進檔案或貼到任何地方。
- GitHub Pages 設定：Settings → Pages → Source 選 `gh-pages` 分支、`/ (root)`。
- 其他靜態主機：`SITE_URL=https://你的網址/ npm run build` 後上傳 `dist/`。沒設 `SITE_URL` 時會移除 canonical／og:url，社群平台抓不到預覽圖。

## 分享文案（可自行貼到 IG／Threads）

> 做了一個手機點開就能玩的推塔小遊戲《皇室戰爭克隆》🏰（非官方粉絲作品） 出牌派兵、過橋推倒對方的塔，三分鐘一局。目前是單人對電腦（還不能跟朋友即時對戰），免安裝、免登入，來挑戰困難電腦看看！👉 （貼上正式網址）
