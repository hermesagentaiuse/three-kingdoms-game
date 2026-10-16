import { chromium } from 'playwright';
const BASE = 'https://hermesagentaiuse.github.io/three-kingdoms-game';
const EXE = '/opt/data/.playwright-browsers/chromium-1234/chrome-linux/chrome';

const b = await chromium.launch({ executablePath: EXE, headless: true });
const p = await b.newPage();
p.on('console', m => { if (m.type() === 'error') console.log('CONSOLE:', m.text().slice(0, 200)); });
p.on('pageerror', e => console.log('PAGEERROR:', e.message.slice(0, 300)));

await p.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
const seed = { version: '1.0', timestamp: Date.now(), gameState: {
  player: { name: '驗證員', gender: 'male', background: 'scholar', birthYear: 184,
    stats: { int: 18, str: 14, lck: 14, cha: 14, vit: 18 },
    gold: 50, reputation: 40, intelligence: 20, exp: 200,
    isAlive: true, deathType: 'none', faction: 'wei', companions: [],
    inventory: [], relationships: [], flags: {}, keyChoiceHistory: [], history: [],
    lifeStage: 'adult', age: 30, currentYear: 262, currentEra: 'dingli' },
  isGameOver: false, history: [], flags: {}, currentEvent: null } };
await p.evaluate(s => localStorage.setItem('tk_save_0', s), JSON.stringify(seed));
await p.goto(BASE + '/game/', { waitUntil: 'networkidle' });
await p.waitForTimeout(3000);
console.log('URL:', p.url());
console.log('TEXT:', (await p.evaluate(() => document.body.innerText)).replace(/\s+/g, ' ').slice(0, 250));
await b.close();
