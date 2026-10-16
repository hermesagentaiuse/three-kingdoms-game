# 三國蝴蝶 — 專案看板

## 專案概況
- **專案名稱**: 三國蝴蝶 (Three Kingdoms Butterfly)
- **技術棧**: Next.js 14 + TypeScript + Tailwind CSS v4 + Zustand
- **專案路徑**: `/opt/data/three-kingdoms-game/`
|- **團隊**: PM, Game Designer, Backend, Frontend, QA, Security, DevOps, Product, Brand, Market
|- **當前階段**: M1 - 核心框架重構
|- **GDD 版本**: v1.1 (已通過遊戲企劃審查，評分 5.5→8.5/10)
|- **審查報告**: `.kanban/game-designer/GDD_REVIEW.md`

## 團隊架構

| 角色 | 職責 | 看板 |
|------|------|------|
| 🎮 遊戲企劃 | 機制設計、事件劇情、平衡性 | `/.kanban/game-designer/TODO.md` |
| PM | 任務分配、進度追蹤 | `/.kanban/pm/TODO.md` |
| Backend | 遊戲邏輯、事件系統 | `/.kanban/backend/TODO.md` |
| Frontend | UI、動畫、響應式 | `/.kanban/frontend/TODO.md` |
| QA | 測試、邊界、相容性 | `/.kanban/qa/TODO.md` |
| Security | XSS、資料驗證 | `/.kanban/security/TODO.md` |
| DevOps | CI/CD、部署 | `/.kanban/devops/TODO.md` |
| Product | 功能規格、版本規劃 | `/.kanban/product/TODO.md` |
| Brand | 視覺、文案、音效 | `/.kanban/brand/TODO.md` |
| Market | 競品分析、推廣 | `/.kanban/market/TODO.md` |

## 里程碑狀態

### M0: 遊戲設計文檔 (GDD) ✅ 完成
- [x] 遊戲企劃產出完整 GDD
- [x] 遊戲企劃審查 GDD (評分 5.5/10，已修復 6 個嚴重問題)
- [x] 各角色依 GDD 更新任務

### M1: 核心框架重構 🔄 進行中
- [ ] 根據 GDD 重構事件系統 (butterflyEffects, save system)
- [ ] 根據 GDD 重構死亡評價系統 (12 維度正規化)
- [ ] 根據 GDD 重構技能系統 (被動+主動)
- [ ] 根據 GDD 重構屬性成長系統
- [ ] 增加物品/裝備系統
- [ ] QA 測試

### M1: 核心框架 (已完成 70%)
- [x] Next.js 專案初始化
- [x] 角色創建頁面
- [x] 遊戲主頁面
- [x] Zustand 狀態管理
- [x] 事件系統基礎架構
- [x] 屬性與等級系統
- [x] 歷史事件篩選
- [x] 隨機事件系統
- [x] 存檔/讀檔功能
- [x] 死亡判定系統
- [x] 事件年齡過濾
- [ ] ~~技能系統~~ → 等 GDD 更新
- [ ] ~~companion 系統~~ → 等 GDD 更新
- [ ] ~~聲望/情報/金銀資源~~ → 等 GDD 更新
- [ ] ~~成就系統~~ → 等 GDD 更新
- [ ] ~~結束評價系統~~ → 等 GDD 更新

### M2: 內容豐富 (等 M0 完成後啟動)
- [ ] 依 GDD 擴充事件庫 (180+ 事件)
- [ ] 擴充人生階段事件
- [ ] 增加更多出身背景
- [ ] 增加更多歷史人物關係網
- [ ] 增加技能樹系統 (依 GDD 設計)
- [ ] 增加戰役模擬系統
- [ ] 增加外交系統

### M3: UI/UX 優化 (等 M1 完成後啟動)
- [ ] 事件卡片動畫效果
- [ ] 屬性條視覺化
- [ ] 歷史時間軸顯示
- [ ] 角色狀態浮動面板
- [ ] 音效與背景音樂
- [ ] 響應式設計優化

### M4: 測試與部署 (等 M3 完成後啟動)
- [ ] 單元測試
- [ ] 端到端測試
- [ ] 效能優化
- [ ] PWA 支援
- [ ] 部署到 Vercel

---

## 工作流程

```
M0: 遊戲企劃產出 GDD → PM 審核 → 各角色更新看板
  ↓
M1: 核心框架開發 → 各角色依 GDD 實作 → QA 測試
  ↓
M2: 內容豐富 → 事件/劇情/技能/戰役 → QA 測試
  ↓
M3: UI/UX 優化 → 動畫/音效/響應式 → Brand 審查
  ↓
M4: 測試部署 → 整合測試 → DevOps 部署
```

---

## 待辦任務 (To Do) — M1 階段

| ID | 任務 | 指派 | 狀態 |
|----|------|------|------|
| 1 | 重構事件系統 (butterflyEffects) | backend | 📋 |
| 2 | 重構死亡評價系統 (12維度) | backend | 📋 |
| 3 | 重構技能系統 | backend | 📋 |
| 4 | 蝴蝶效應追蹤器 UI | frontend | 📋 |
| 5 | 存檔系統 | frontend | 📋 |
| 6 | 物品/裝備系統 | backend | 📋 |
| 7 | QA 測試計畫 | qa | 📋 |
| 8 | 修復死亡原因明確化 | backend+frontend | ✅ 2025-06-20 |

---

## 進行中 (In Progress)

| ID | 任務 | 指派 | 狀態 |
|----|------|------|------|
| M1-1 | 事件系統重構 | backend | 🔄 |
| M1-2 | 死亡評價重構 | backend | 🔄 |

---

## 已完成 (Done)

| ID | 任務 | 完成時間 |
|----|------|----------|
| M1-0 | 核心框架原型 (無 GDD 版本) | 2026-06-18 |
