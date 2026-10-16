# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e/basic.spec.ts >> 三國蝴蝶 E2E 測試 >> 結束一局遊戲不應該產生重複排行榜紀錄
- Location: tests/e2e/basic.spec.ts:96:7

# Error details

```
Error: browserType.launch: Executable doesn't exist at /opt/hermes/.playwright/chromium_headless_shell-1228/chrome-linux/headless_shell
╔════════════════════════════════════════════════════════════╗
║ Looks like Playwright was just installed or updated.       ║
║ Please run the following command to download new browsers: ║
║                                                            ║
║     npx playwright install                                 ║
║                                                            ║
║ <3 Playwright Team                                         ║
╚════════════════════════════════════════════════════════════╝
```