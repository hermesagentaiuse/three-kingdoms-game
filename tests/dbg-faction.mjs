import { chromium } from 'playwright';
import fs from 'fs';
const BASE = 'https://hermesagentaiuse.github.io/three-kingdoms-game';
const EXE = '/opt/data/.playwright-browsers/chromium-1234/chrome-linux/chrome';
const real = JSON.parse(fs.readFileSync('/tmp/tk_real_save.json', 'utf8'));

const b = await chromium.launch({ executablePath: EXE, headless: true });
const p = await b.newPage();
const save = JSON.parse(JSON.stringify(real));
Object.assign(save.gameState.player, { faction: 'none', age: 18, currentYear: 197, currentEra: 'qunxiong', birthYear: 179, lifeStage: 'teen' });
save.gameState.isGameOver = false; save.gameState.currentEvent = null; save.gameState.flags = {}; save.gameState.history = [];
save.gameState.player.lifeStageEvents = []; save.gameState.player.totalChoices = 0; save.gameState.player.triggeredEvents = {}; save.gameState.player.triggeredHistoricalEvents = {}; save.gameState.turnCount = 0;
await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await p.evaluate(s => { localStorage.clear(); localStorage.setItem('tk_save_0', s); }, JSON.stringify(save));
await p.goto(BASE + '/game/', { waitUntil: 'networkidle' });
await p.waitForTimeout(4000);

for (let i = 0; i < 6; i++) {
  const txt = (await p.evaluate(() => document.body.innerText)) || '';
  console.log(`--- turn ${i} ---`);
  console.log(txt.replace(/\s+/g, ' ').slice(0, 220));
  const btns = await p.evaluate(() => Array.from(document.querySelectorAll('button')).map(x => x.innerText.trim().slice(0, 30)));
  console.log('btns:', JSON.stringify(btns.slice(0, 15)));
  const skip = p.getByRole('button', { name: /跳過此年/ }).first();
  if (await skip.count() && await skip.isVisible().catch(() => false)) { await skip.click(); }
  else break;
  await p.waitForTimeout(4000);
}
await b.close();
