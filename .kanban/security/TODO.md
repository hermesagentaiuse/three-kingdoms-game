# 資安看板 — 三國蝴蝶專案

## 職責
- 輸入驗證
- XSS/CSRF 防護
- 資料完整性檢查
- 客戶端資料安全
- 存檔資料安全

## 風險評估

### 高風險
- **存檔資料偽造**: 客戶端存檔可被篡改
- **XSS 透過事件文本注入**: 事件描述含 HTML/JS
- **本地儲存濫用**: sessionStorage/localStorage 被濫用

### 中風險
- **跨站請求偽造**: 未來若有伺服器端功能
- **CSP 不足**: 缺少內容安全政策

### 低風險
- **資訊洩漏**: 事件資料包含開發者註解

## 待辦任務

| ID | 任務 | 優先級 | 狀態 | 備註 |
|----|------|--------|------|------|
| SEC-1 | 檢查事件文本 XSS 防護 | 🔴 高 | 📋 | 所有事件文本應使用 textContent |
| SEC-2 | 檢查存檔資料驗證 | 🔴 高 | 📋 | 讀檔時驗證資料結構 |
| SEC-3 | CSP meta tag 設定 | 🟡 中 | 📋 | 限制 script/style 來源 |
| SEC-4 | sessionStorage 安全性檢查 | 🟡 中 | 📋 | HTTP-only cookie 替代方案評估 |
| SEC-5 | 依賴套件安全性掃描 | 🟢 低 | 📋 | npm audit |

## 安全檢查清單
- [ ] 所有動態內容使用 textContent (非 dangerouslySetInnerHTML)
- [ ] 存檔資料有結構驗證 (Zod schema)
- [ ] 無 console.log 暴露敏感資料
- [ ] CSP 已設定
- [ ] 無未驗證的輸入進入 DOM
- [ ] npm audit 無高風險漏洞

## 審查記錄
- SEC-AUDIT-1: 核心框架資安審查 - 待執行
