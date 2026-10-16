# 後端開發看板 — 三國蝴蝶

## 當前階段: M1 核心框架重構

### ✅ 已完成
- [x] 型別系統更新 (`game.ts`) — ButterflyEffect, LifeStage, Rarity 等完整定義
- [x] 事件系統基礎結構 (`events.ts`) — butterflyEffects 標籤已實作
- [x] 骰子判定系統 (`eventEngine.ts`) — rollDice (d4/d6/d8/d10/d12/d20), isCrit, isFumble
- [x] 初始狀態欄位補齊 (`createStore.ts`, `gameStore.ts`) — butterflyHistory, evaluation stats
- [x] 事件篩選邏輯 — 時代/年齡/稀有度/人生階段
- [x] 死亡評價系統 — 12 維度正規化 (0-10 分), S/A/B/C/D 等級
- [x] 評價矩陣 — 屬性組合生成結局敘述
- [x] 物品系統介面 — Item 類型定義完整 (weapon/armor/medicine/book/treasure/key)
- [x] 存檔/載入系統 — saveGame, loadGame 功能已實作
- [x] 連敗保護修正 — 漸進式保護 (非強制正面)
- [x] 人生重新定位系統 — 每 10 年可重新分配屬性
- [x] M1-8: 實作 15 種物品數據 (5 武器 + 3 防具 + 3 藥品 + 2 古籍 + 2 奢侈品)

### 📋 進行中
- [ ] M1-7: 擴展事件資料庫至 100+ 事件 (目前約 30 個)

### 📋 待開發
- [ ] M1-9: 主動技能系統 (LCK ≥ 18 解鎖「天機」預知)
- [ ] M1-10: 屬性閾值系統 (STR/VIT/CHA 的額外解鎖效果)

---

## 待辦任務
| ID | 任務 | 狀態 |
|----|------|------|
| M1-7 | 擴展事件資料庫至 100+ | 📋 |
| M1-8 | 實作 15 種物品數據 | ✅ 完成 |
| M1-8a | 修復死亡原因保存 (makeChoice 存 deathReason) | ✅ 完成 2025-06-20 |
| M1-9 | 主動技能系統 | 📋 |
| M1-10 | 屬性閾值系統 | 📋 |
