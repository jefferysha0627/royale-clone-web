# 獨立 Cloud 工作階段交接

準備日期：2026-10-23，Asia/Taipei。

## 用途與計費範圍

使用者希望把《皇室戰爭》遊戲開發從原本 Projects／Mac Remote Control 改為**專案以外的獨立 Cloud 工作階段**。

2026-10-23 帳號畫面顯示：雲端工作階段促銷點數剩 US$99／US$100，台灣時間 2026-11-05 15:59 到期。這是當時的顯示值，不是永久固定的預算或每個工作階段的獨立額度。

官方規則：https://support.claude.com/en/articles/17152539-cloud-sessions-bonus-credit-promotion

- 符合資格的獨立 Cloud 工作階段會自動先用促銷點數。
- Projects、Routines、Remote Control、Chat／Cowork 不適用。
- 點數用完或到期會自動回到訂閱用量。提示詞不能設定平台的硬性停扣規則。
- 舊 Project 已暫停，額度重設後自動繼續已關閉。
- 本輪採有明確終點的小任務，不無限續跑、不額外建立代理或工作階段，不啟用額外付費。

## 程式位置與版本

- Repo：`https://github.com/jefferysha0627/royale-clone-web`，既有公開 repo。
- 要接續的開發分支：`v3`，不是 `main` 或 `gh-pages`。
- 本次遷移前的本機 HEAD：`9529d2d`，包含活動模式、重播與 51 張卡的進度。
- 本次 checkpoint 包含原本未提交的第四批 8 張新卡與這份交接，共 59 張卡。不要退回已上線的 47 張卡版本。
- 原有發布紀錄記載公開版本是 v3.1-rc。準備遷移時遠端 main 已有其他更新，因此本次不重設、合併或推送 main，也不假設本機 main 與遠端相同。
- 只將遊戲 repo 的程式、自製素材、測試與交接送到開發分支。上層的官方截圖、安裝包、憑證與驗證影像不在此 repo。

## 既有遊戲

手機直向優先的單人對電腦推塔遊戲，Vite、TypeScript、Three.js，無 WebGL 時有 2D 備援。已有卡組、手牌、能量、過橋索敵、塔與勝負、難度、原創程式模型、音效、獎盃競技場、新手教學、戰鬥紀錄、重播與活動模式。

正式網址（本輪禁止部署／變更）：

- https://royale-clone-web.pages.dev/
- https://jefferysha0627.github.io/royale-clone-web/

最新待接續內容：

- 8 張新卡：重裝武士、長弓遊俠、灼焰飛龍、寒霜術士、風暴術士、雷能砲車、巨錘騎士、回旋斧手。
- 規則新增：減速、出場範圍效果、多目標、命中暈眩、蓄力／後座、跳躍、回旋投射物。
- 模型與動畫、投射物與粒子、狀態色、卡圖及電腦對手支援已寫入。
- 主要位置：`src/sim/cards.ts`、`src/sim/game.ts`、`src/sim/ai/clash.ts`、`src/render3d/models/batch4.ts`、`src/render3d/renderer3d.ts`、`tests/rules.test.ts`。

## 已驗證與未驗證

遷移前在 Mac 執行：

```sh
npm run check
git diff --check
```

結果：TypeScript 通過，5 個 test files、76 個 tests 全過，Vite production build 通過，git diff 空白檢查通過。build 有單一 chunk 大於 500 kB 的提示，gzip JS 約 251 kB。

尚未對第四批新卡重跑完整瀏覽器 e2e 或完整視覺檢查。先前版本的 e2e 數字不代表這批程式已通過。iOS／Android 真機及 IG／Threads 內建瀏覽器仍未完成實測。

## 第一個 Cloud 回合：有明確終點

1. 確認目前是獨立 Cloud、repo 是上述遊戲、分支以 v3 的 checkpoint 為基礎，沒有回到 Mac／Remote Control。
2. 讀 CLAUDE.md、這份交接與 package.json，確認第四批 8 張卡及對應模型存在。
3. 安裝既有鎖檔依賴後執行 `npm run check`。
4. 如果全部通過，嘗試一次 `node scripts/e2e.mjs --quick`；若環境缺瀏覽器或 GPU，清楚記錄，可使用既有專案支援的瀏覽器／2D 備援，不修改測試去偽造通過。
5. 若發現與這批卡直接相關的明確阻斷問題，只修第一個可重現問題並做對應驗證；不要擴充新功能或再加卡牌。
6. 寫下結果、修改、未驗證項目及下一步，完成本回合後停止等待使用者。

先完成接手與單輪驗證，不在這一回合追求燒完點數。不要建立無限循環、排程或額外 session。

## Cloud 回合紀錄（2026-10-23）

環境：獨立 Cloud 容器，Linux、Node v22.22.0、npm 10.9.4、Chromium（Playwright 1.64.1，headless）。沒有 GPU，WebGL 跑在 SwiftShader 軟體算圖上，4 核心。看不到點數餘額，無法確認是否只用了促銷點數。

### 第 1 回合：只驗證
- HEAD `450dc95`，59 張卡，`src/render3d/models/batch4.ts` 存在。
- `npm ci` 後 `npm run check`：TypeScript 通過、5 個測試檔 76 項全過（和遷移前一樣）、build 通過（chunk 大於 500 kB 的提示一樣，gzip JS 約 251 kB）。
- `node scripts/e2e.mjs --quick` 跑到 580 秒上限被中斷：111 項通過、16 項失敗。

### 第 2 回合：調查 e2e 失敗
- **結論：沒有找到遊戲錯誤。** 430×932 的出牌失敗是軟體算圖造成的時序連鎖：單一 CDP 觸控事件要 1–8 秒才處理完，「開場倒數不能出牌」的測試拖曳因此拖到倒數結束後才按下、放開，遊戲照規則真的出了牌（地獄塔落在 (10, 24)）。後續拖曳的落點 (9.5, 23.5) 被這座建築擋住，遊戲正確回「這裡不能部署」，卡牌維持選取；之後的點卡測試又把它取消選取，所以點地面也失敗。新手教學那項失敗也是因為已經出過牌。
- 用插入事件紀錄的診斷重現：倒數中按下的觸控會被拒絕（`canInteract`），預覽與部署規則一致，沒有不同步。
- 修改：`scripts/e2e.mjs` 的開場檢查改成先用測試掛鉤把倒數拉長到 60 秒，拖完再還原原本剩餘秒數，並多檢查放開時倒數仍大於 0。檢查內容不變（倒數中不能出牌、時間不前進），只是不再受算圖速度影響。遊戲程式沒有改。
- 修改後完整跑完 `--quick`：**152/158 通過**，沒有 console error／pageerror／載入失敗。各尺寸的開場、教學、拖曳出牌、點卡出牌都通過。
- 仍失敗的 6 項都是幀率相關，判斷為環境限制：
  - 四個尺寸「交戰中 ≥ 30 FPS」：實測 8–9 FPS。
  - 「CPU 降速 4 倍仍 ≥ 30 FPS」：1.0 FPS。
  - 「844×390 橫拿提示」：提示出現、消失和暫停都正確。按繼續後時間有前進，但 1.2 秒內只前進 0.3 秒，門檻是 0.5 秒。另外驗證連續 6 秒都穩定前進，是低幀率加上每幀最多補 0.1 秒的設計造成的。
- 尚未驗證：有 GPU 的實機或瀏覽器上的 FPS、第四批 8 張卡的實際畫面與動畫、iOS／Android 真機、IG／Threads 內建瀏覽器。

### 下一步建議
1. 在有 GPU 的環境（例如 Mac）跑 `npm run build && node scripts/e2e.mjs --quick`，確認 FPS 與橫拿那項。
2. 要用 Cloud 做 e2e 時，把 FPS 類失敗視為環境限制，不要調低門檻來讓它通過。

## 其他開發指令與限制

```sh
npm run dev
npm run build
npm test
node scripts/e2e.mjs --quick
npm run sim -- 100 1 hard normal --swap --quiet
```

- Node 24／npm 11 為原本驗證環境；Cloud 以現有相容版本為準，先報版本，不任意升級套件。
- 瀏覽器腳本可能將驗證結果寫到 repo 上層 `verification/`，那是本地產物，不代表存在舊 Mac 的歷史證據。
- `scripts/dev/jsc-check.ts` 使用 macOS JavaScriptCore，Linux Cloud 不一定能跑，這不等於遊戲出錯。
- README.md 仍有早期 v1／v2 描述；最新進度以目前程式與本交接為準。
- 不部署、不合併、不碰 main／gh-pages、不推送任何憑證或官方素材，不在社群代發文。
