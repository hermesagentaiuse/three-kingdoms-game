# DevOps 看板 — 三國蝴蝶專案

## 職責
- 建置流程管理
- 部署管道
- 效能監控
- 環境管理
- CI/CD

## 環境
- **開發環境**: localhost:3013
- **建置工具**: Next.js Static Export
- **當前環境**: Linux (Debian 13 aarch64)

## 待辦任務

| ID | 任務 | 優先級 | 狀態 | 備註 |
|----|------|--------|------|------|
| DO-1 | 設定 CI/CD pipeline | 🔴 高 | 📋 | GitHub Actions / Vercel |
| DO-2 | 效能優化建置 | 🔴 高 | 📋 | 程式碼分割/圖片優化 |
| DO-3 | 部署到 Vercel | 🟡 中 | 📋 | 免費方案即可 |
| DO-4 | PWA Service Worker | 🟡 中 | 📋 | 離線支援 |
| DO-5 | 建置產物壓縮 | 🟢 低 | 📋 | gzip/brotli |
| DO-6 | 環境變數管理 | 🟢 低 | 📋 | .env.example |

## 效能基準
- 建置時間: <60 秒
- 首屏載入: <2 秒
- Lighthouse 效能分數: >90

## 建置檢查清單
- [ ] `npx next build` 成功 (exit 0)
- [ ] 無 TypeScript 錯誤
- [ ] 無警告訊息
- [ ] 靜態產物 <5MB 總大小
- [ ] Lighthouse 測試通過
