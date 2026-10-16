// E2E 測試：靜態版三國遊戲完整遊玩流程
// 用法：node tests/e2e-static-playthrough.mjs
import { chromium } from 'playwright';

const BASE = 'http://localhost:8792/three-kingdoms-game';
const EXE = '/opt/data/.playwright-browsers/chromium-1234/chrome-linux/chrome';

const results = [];
function ok(name, cond, detail = '') {
  results.push({ name, pass: !!cond, detail: String(detail).slice(0, 160) });
  console.log(`${cond ? 'PASS' : 'FAIL'} | ${name}${detail ? ' | ' + String(detail).slice(0, 140) : ''}`);
}

const browser = await chromium.launch({ executablePath: EXE, headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('CONSOLE: ' + m.text().slice(0, 200)); });

// 1. 首頁
await page.goto(BASE + '/', { waitUntil: 'networkidle' });
ok('首頁載入', (await page.textContent('body')).includes('三國'));

// 2. 創角
await page.goto(BASE + '/create/', { waitUntil: 'networkidle' });
await page.fill('input', '公測員');
await page.getByRole('button', { name: /^男$/ }).click();
await page.getByRole('button', { name: /將門/ }).first().click();
await page.getByRole('button', { name: /黃巾之亂/ }).first().click();
await page.getByRole('button', { name: /開始遊戲/ }).first().click();

// 3. 遊戲頁 → 自動遊玩
await page.waitForURL('**/game/**', { timeout: 10000 }).catch(() => {});
ok('進入遊戲頁', page.url().includes('/game'), page.url());
const bodyTxt = (await page.textContent('body')) || '';
ok('遊戲狀態列顯示', /歲/.test(bodyTxt) && /體力/.test(bodyTxt));

const clickedLog = [];
let ended = false;
for (let i = 0; i < 700; i++) {
  const txt = (await page.textContent('body')) || '';
  if (/結局|一生落幕|死後|蓋棺/.test(txt) && !page.url().includes('/game/')) { ended = true; break; }
  if (page.url().includes('/ending')) { ended = true; break; }
  // 優先確認下一年
  const confirm = page.getByRole('button', { name: /確認結果，進入下一年/ }).first();
  if (await confirm.count() && await confirm.isVisible().catch(() => false)) {
    await confirm.click().catch(() => {});
    await page.waitForTimeout(120);
    continue;
  }
  // 事件選項
  const choices = await page.getByRole('button', { name: /^\[?\s*[A-F]\]?/ }).all();
  if (choices.length) {
    const pick = choices[Math.floor(Math.random() * choices.length)];
    const label = (await pick.textContent() || '').trim().slice(0, 30);
    clickedLog.push(label);
    await pick.click().catch(() => {});
    await page.waitForTimeout(120);
    continue;
  }
  const other = page.getByRole('button', { name: /跳過|繼續|確定/ }).first();
  if (await other.count() && await other.isVisible().catch(() => false)) {
    await other.click().catch(() => {});
    await page.waitForTimeout(120);
    continue;
  }
  await page.waitForTimeout(300);
}
ok('完整遊玩到結局', ended, 'clicks=' + clickedLog.length + ' url=' + page.url());

// 4. 結局頁
const endingTxt = (await page.textContent('body')) || '';
ok('結局頁內容', /結局|一生|評|名/.test(endingTxt), endingTxt.slice(0, 80));

// 5. 存入排行榜
const saveBtn = page.getByRole('button', { name: /存入|排行榜|留名/ }).first();
if (await saveBtn.count()) {
  await saveBtn.click().catch(() => {});
  await page.waitForTimeout(800);
}

// 6. 排行榜（靜態模式 = localStorage 名人堂）
await page.goto(BASE + '/leaderboard/', { waitUntil: 'networkidle' });
const lbTxt = (await page.textContent('body')) || '';
ok('排行榜載入（靜態名人堂）', !/無法取得|失敗/.test(lbTxt) && /名|排行榜|名人堂/.test(lbTxt), lbTxt.slice(0, 100));

// 7. JS 錯誤檢查
ok('無致命 JS 錯誤', errors.filter((e) => e.startsWith('PAGEERROR')).length === 0, errors.slice(0, 3).join(' || '));

await browser.close();
const failed = results.filter((r) => !r.pass);
console.log(`\n== ${results.length - failed.length}/${results.length} passed ==`);
process.exit(failed.length ? 1 : 0);
