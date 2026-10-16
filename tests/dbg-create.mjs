import { chromium } from 'playwright';
import fs from 'fs';
const BASE = 'https://hermesagentaiuse.github.io/three-kingdoms-game';
const EXE = '/opt/data/.playwright-browsers/chromium-1234/chrome-linux/chrome';

const b = await chromium.launch({ executablePath: EXE, headless: true });
const p = await b.newPage();
await p.goto(BASE + '/create/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
await p.locator('input').first().fill('基準員');
await p.getByText('將門', { exact: false }).first().click();
await p.waitForTimeout(400);
const eraTxt = await p.evaluate(() => document.body.innerText);
if (/誕生年代|年代/.test(eraTxt)) {
  await p.getByText(/184|黃巾/, { exact: false }).first().click().catch(() => {});
  await p.waitForTimeout(300);
}
for (const name of [/開始/, /下一步/, /確認/]) {
  const btn = p.getByText(name).last();
  if (await btn.count()) { await btn.click().catch(() => {}); await p.waitForTimeout(1200); }
  if (p.url().includes('/game')) break;
}
await p.waitForTimeout(1500);
// click 儲存 button
const saveBtn = p.getByText('儲存', { exact: true }).first();
if (await saveBtn.count()) { await saveBtn.click(); await p.waitForTimeout(800); }
const save = await p.evaluate(() => localStorage.getItem('tk_save_0'));
console.log('URL:', p.url(), '| save len:', save && save.length);
if (save) {
  fs.writeFileSync('/tmp/tk_real_save.json', save);
  const o = JSON.parse(save);
  console.log('top keys:', Object.keys(o));
  if (o.gameState) console.log('gs keys:', Object.keys(o.gameState));
  if (o.gameState?.player) console.log('player keys:', Object.keys(o.gameState.player).join(','));
}
await b.close();
