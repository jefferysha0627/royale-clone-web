# 皇室戰爭克隆（非官方）

直向手機優先的即時推塔對戰網頁遊戲，單人對電腦，可放在任何靜態網站主機。以《皇室戰爭》核心玩法為參考的非官方作品，與 Supercell 無關。**角色、塔、場地、卡圖、音效與音樂全部為原創**：3D 模型由程式建模（Three.js），音效以 WebAudio 即時合成，不含任何官方圖片、模型、字型或音效。

v2：規則與 34 張卡的數值依公開資料校準到 11 級（來源與近似值見上層 `EVIDENCE.md`），畫面改為 3D、版面依原作結構重建。

## 需求

- Node.js 24（已在 24.16.0 驗證）、npm 11
- 瀏覽器需支援 WebGL 2（iOS 15+、近年的 Android Chrome、桌面瀏覽器）；不支援時自動改用 2D 畫面，規則與操作相同
- 自動瀏覽器測試需要 Chromium：預設用 Playwright 的瀏覽器；沒有時 `scripts/browser.mjs` 會改用本機快取的其他版本或已安裝的 Google Chrome，也可用 `CHROMIUM_PATH=/path/to/chrome` 指定

## 安裝與啟動

```bash
npm install
npm run dev        # 開發伺服器，手機可用區網 IP 連入
```

## 指令

| 指令 | 用途 |
| --- | --- |
| `npm run build` | 型別檢查 + production build，輸出到 `dist/`（gzip 後約 210 KB） |
| `npm run preview` | 在 4173 埠預覽 `dist/` |
| `npm test` | 規則與電腦對手的自動測試（vitest） |
| `npm run sim -- 30 1 normal hard --swap --quiet` | 無畫面電腦對電腦批次模擬（場數、起始 seed、雙方難度；`--swap` 交換座位）；`scripts/dev/deckmatrix.ts` 牌組矩陣、`scripts/dev/novice.ts` 新手腳本對各難度 |
| `npm run e2e` | 先 `npm run build`。用真實瀏覽器操作桌面與 360×640、390×844、430×932，含一場以觸控即時打完的對戰（約 8 分鐘）；加 `-- --quick` 略過即時整場。結果寫入上一層 `verification/v2/` |
| `npm run assets` | 用遊戲自己的 3D 渲染器重新產生 `public/og-image.png`（1200×630）與 `public/apple-touch-icon.png` |
| `npm run check` | 型別檢查 + 測試 + build |

開發用頁面（只在 `npm run dev` 時可開，不進正式 build）：

- `/tools/models.html?state=idle|walk|attack&only=knight,giant` — 以遊戲鏡頭角度檢視所有原創模型與動畫。
- `/tools/lab.html?s=melee|ranged|tank|golem|spells|rocket|log|barrel|gs|air|riders|spawners|towers|stress&zoom=2.4` — 情境實驗室：用 Game API 擺陣，以正式渲染器近距離檢視戰鬥與特效。
- `scripts/dev/`：截圖、連續影格、效能量測等開發腳本。

## 操作

- 把下方卡牌**拖到**己方半場放開即出兵；或**先點卡牌再點地面**。拖回手牌區可取消。
- 拖曳或選卡時：地面顯示格線，紅色斜紋為不能部署的區域，落點出現半透明的單位預覽；遠程部隊與建築會顯示射程圈，法術顯示範圍。
- 剛出完牌時，新卡要等 2 秒（能量加倍時 1 秒）才補進手牌。能量滿了會提示「能量已滿」。
- 桌面：滑鼠同上，選卡後移動滑鼠可預覽落點；鍵盤 `1`～`4` 選卡、`Esc` 取消選取或暫停。
- 左上角暫停（可繼續、靜音、重新開始、離開）；左下角表情。切到背景會自動暫停。
- 對戰中按返回鍵（或 iOS 側滑返回）先暫停，再按一次回主畫面；主畫面按返回會正常離開。手機橫拿時會暫停並提示轉回直向。

## 規則摘要（依公開資料，細節見 EVIDENCE.md）

- 3 分鐘一局，剩 1 分鐘能量加倍。推倒側塔得 1 皇冠並開放該路的前進部署區；推倒國王塔直接 3 皇冠獲勝。國王塔受傷或側塔倒下才會醒來（約 4 秒後開火）。
- 時間到皇冠多者勝；平手進入 2 分鐘驟死延長賽（最後 1 分鐘三倍能量），先推倒任一座塔者勝；仍平手則所有部隊消失、塔同步扣血，最低血量的塔先倒的一方落敗。
- 電腦難度：簡單（新手對手）／普通／困難，全部遵守同一套能量、手牌與部署規則，只透過與玩家相同的出牌介面行動，也只看得到公開資訊。第一次開啟預設簡單，選過的難度會記在本機。

## 程式結構

```text
src/
  sim/          戰鬥模擬（與畫面無關，可在 Node 執行）
    config.ts     場地、時間、能量、塔等規則參數（註明來源）
    cards.ts      34 張卡與單位的 11 級數值
    game.ts       固定步長模擬：部署、索敵、移動繞障、投射物、法術、特殊機制、勝負
    ai.ts、ai/    電腦對手
    rng.ts        可指定 seed 的亂數
  render3d/     Three.js 3D 畫面（只讀模擬狀態）
    renderer3d.ts 主渲染器：鏡頭、實體同步、投射物、法術、事件特效、打擊停頓、自動畫質
    models/       原創程式建模（人形、生物、坐騎、建築、塔）
    kit.ts        把簡單幾何組成一個剛性骨架網格（每個單位一次繪製）
    anim.ts       程式動畫（走路、出手、受擊、部署、死亡）
    arena.ts      場地、河道、橋、裝飾
    effects.ts    粒子、光環、焦痕、閃電
    overlay.ts    2D 介面層（血條、等級徽章、塔血量、部署倒數、飄字）
    zone.ts       部署格線、禁區與預覽
    portraits.ts  用 3D 模型即時渲染卡圖與主畫面插圖
  render/       2D 備援渲染器（WebGL 不可用時）
  ui/           對戰流程與輸入（開場、HUD、暫停、結算、表情）、音效與音樂、分享、設定儲存
tests/          規則與電腦對手測試
scripts/        模擬、e2e、素材產生、部署、公開網址驗證、開發工具
tools/          開發用頁面（模型展示、情境實驗室、分享圖產生）
public/         favicon、apple-touch-icon、og-image
```

網址參數：`?seed=123` 固定對戰亂數；`?render=2d` 強制使用 2D 畫面；`?test=1` 開啟自動測試掛鉤 `window.__btd`（一般玩家不需要）。

## 部署

正式網址（目前仍是 v1；v2 尚未部署）：

- Cloudflare Pages：https://royale-clone-web.pages.dev/
- GitHub Pages：https://jefferysha0627.github.io/royale-clone-web/

產物是純靜態檔案，資源都用相對路徑，子路徑也能用，重新整理不會 404。兩個網站的分享預覽絕對網址不同，所以部署腳本會各自用正確的 `SITE_URL` 建置到 `dist-cf/`、`dist-gh/`，並在建置前先跑型別檢查與測試。

```bash
# Cloudflare Pages（免費方案、classic Pages 專案 royale-clone-web；需先 npx wrangler login）
CLOUDFLARE_ACCOUNT_ID=<你的帳號 ID> npm run deploy:cf

# GitHub Pages（需先 gh auth login；建置結果提交到 gh-pages 分支，一般 push 不強制覆蓋）
npm run deploy:gh

# 部署後驗證公開網址（HTTP、meta、資源、真實瀏覽器出牌打完、3D 畫面、重新整理）
npm run verify:live -- https://royale-clone-web.pages.dev/ --live
npm run verify:live -- https://jefferysha0627.github.io/royale-clone-web/
```

- 帳號 ID 可用 `npx wrangler whoami` 查詢；不要把 token 寫進檔案或貼到任何地方。
- GitHub Pages 設定：Settings → Pages → Source 選 `gh-pages` 分支、`/ (root)`。
- 其他靜態主機：`SITE_URL=https://你的網址/ npm run build` 後上傳 `dist/`。沒設 `SITE_URL` 時會移除 canonical／og:url，社群平台抓不到預覽圖。
- `verify:live` 也接受 `http://localhost:<埠>/`，只用來檢查腳本本身（會略過絕對網址檢查）。

## 分享文案（可自行貼到 IG／Threads）

> 做了一個手機點開就能玩的推塔小遊戲《皇室戰爭克隆》🏰（非官方粉絲作品，角色全部原創 3D）出牌派兵、過橋推倒對方的塔，三分鐘一局，34 張卡可以自己組牌組。目前是單人對電腦（還不能跟朋友即時對戰），免安裝、免登入，來挑戰困難電腦看看！👉 （貼上正式網址）
