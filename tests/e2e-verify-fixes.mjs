// 驗證修復：後期事件、陣營歸宿、280 終局（用真實存檔格式改造）
import { chromium } from 'playwright';
import fs from 'fs';
const BASE = 'https://hermesagentaiuse.github.io/three-kingdoms-game';
const EXE = '/opt/data/.playwright-browsers/chromium-1234/chrome-linux/chrome';

const real = JSON.parse(fs.readFileSync('/tmp/tk_real_save.json', 'utf8'));

const browser = await chromium.launch({ executablePath: EXE, headless: true });

async function playAndScan(mut, expectRe, maxTurns) {
  const save = JSON.parse(JSON.stringify(real));
  Object.assign(save.gameState.player, mut);
  save.gameState.isGameOver = false;
  save.gameState.currentEvent = null;
  save.gameState.flags = {};
  save.gameState.history = [];
  save.gameState.turnCount = 0;
  Object.assign(save.gameState.player, { lifeStageEvents: [], totalChoices: 0, triggeredEvents: {}, triggeredHistoricalEvents: {} });
  const page = await browser.newPage();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(([s]) => { localStorage.clear(); localStorage.setItem('tk_save_0', s); }, [JSON.stringify(save)]);
  await page.goto(BASE + '/game/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  let collected = '';
  let hit = null;
  for (let i = 0; i < maxTurns; i++) {
    const txt = (await page.evaluate(() => document.body.innerText)) || '';
    collected += '\n' + txt;
    const m = collected.match(expectRe);
    if (m) { hit = m[0]; break; }
    // priority: confirm result -> skip year -> choice -> generic
    let clicked = false;
    for (const re of [/確認結果/, /跳過此年/, /^\s*[A-F][\s.、]/, /跳過|繼續|確定/]) {
      const btn = page.getByRole('button', { name: re }).first();
      if (await btn.count() && await btn.isVisible().catch(() => false)) {
        await btn.click().catch(() => {}); clicked = true; break;
      }
    }
    if (!clicked) {
      // random choice button among visible
      const btns = await page.evaluate(() => Array.from(document.querySelectorAll('button')).map((x, i) => ({ i, t: x.innerText.trim() })).filter(x => x.t.length > 4 && x.t.length < 200));
      if (btns.length) {
        const pick = btns[Math.floor(Math.random() * btns.length)];
        await page.evaluate((idx) => document.querySelectorAll('button')[idx]?.click(), pick.i).catch(() => {});
      }
    }
    await page.waitForTimeout(250);
  }
  await page.close();
  return hit;
}

const cases = [
  ['18歲無陣營→選擇歸宿事件', { faction: 'none', age: 18, currentYear: 197, currentEra: 'qunxiong', birthYear: 179, lifeStage: 'adult' }, /選擇你的歸宿/, 10],
  ['262年→三國後期歷史事件', { age: 30, currentYear: 262, currentEra: 'dingli', birthYear: 232, lifeStage: 'adult' }, /三國歸晉|鄧艾偷渡陰平|司馬昭之心|姜維|樂不思蜀/, 12],
  ['279年→280天下歸晉終局', { age: 60, currentYear: 279, currentEra: 'dingli', birthYear: 219, lifeStage: 'adult' }, /三國歸晉，天下統一|安然終老|結局/, 8],
];

let all = true;
for (const [name, mut, re, turns] of cases) {
  const hit = await playAndScan(mut, re, turns);
  console.log(`${hit ? 'PASS' : 'FAIL'} | ${name} | match=${hit}`);
  if (!hit) all = false;
}
await browser.close();
console.log(all ? '\n== ALL PASS ==' : '\n== SOME FAIL ==');
process.exit(all ? 0 : 1);
