// 直接測試事件引擎邏輯：陣營歸宿 + 後期歷史事件
import fs from 'fs';
import path from 'path';

// 用 esbuild-less 方式：直接 read + 簡化。改用 tsx via npx? 沒有 tsx。
// 改為：用 Next 的 build 產物不行，直接 import .ts 用 node --experimental-strip-types (Node 26 支援)
const { ALL_WARLORDS, generateFactionChoiceEvent } = await import('../src/lib/data/factionEvents.ts');
const { ALL_EVENTS } = await import('../src/lib/data/events.ts');
const { ERAS } = await import('../src/types/game.ts');

let fail = 0;

// 1. ERAS 完整性：所有 event 的 era 必須存在
const eraIds = new Set(ERAS.map(e => e.id));
const badEra = ALL_EVENTS.filter(e => !eraIds.has(e.era));
console.log(`${badEra.length === 0 ? 'PASS' : 'FAIL'} | 所有事件 era 合法 | bad=${badEra.map(e=>e.id+':'+e.era).slice(0,5)}`);
if (badEra.length) fail++;

// 2. 事件年份落在 era 範圍內
const eraMap = Object.fromEntries(ERAS.map(e => [e.id, e]));
const badYear = ALL_EVENTS.filter(e => {
  const era = eraMap[e.era];
  return era && (e.year < era.startYear || e.year > era.endYear);
});
console.log(`${badYear.length === 0 ? 'PASS' : 'FAIL'} | 事件年份在時代範圍內 | bad=${badYear.slice(0,5).map(e=>e.id+':'+e.year).join(',')}`);
if (badYear.length) fail++;

// 3. 陣營歸宿事件：18歲無陣營197年應產生
const ev = generateFactionChoiceEvent(197, 18, 'none', [], []);
console.log(`${ev && ev.title === '選擇你的歸宿' ? 'PASS' : 'FAIL'} | 18歲無陣營產生歸宿事件 | ${ev && ev.title}`);
if (!ev) fail++;

// 4. 有陣營時不再產生
const ev2 = generateFactionChoiceEvent(197, 18, 'wei', [], []);
console.log(`${ev2 === null ? 'PASS' : 'FAIL'} | 已有陣營不重複產生 | ${ev2 ? 'FAIL' : 'null'}`);
if (ev2) fail++;

// 5. 262-280 dingli 時代有足夠歷史事件
const lateEvents = ALL_EVENTS.filter(e => e.era === 'dingli' && e.year >= 250);
console.log(`${lateEvents.length >= 3 ? 'PASS' : 'FAIL'} | 250-280後期事件數=${lateEvents.length} | ${lateEvents.slice(0,4).map(e=>e.title).join(',')}`);
if (lateEvents.length < 3) fail++;

// 6. 關鍵史實事件存在且年代正確（三國演義）
const keyChecks = [
  ['chibi', 208, '赤壁'],
  ['guandu', 200, '官渡'],
];
for (const [idRe, yearRe] of []) {}
const musts = [
  [/赤壁/, 208], [/官渡/, 200], [/三顧茅廬/, 207], [/空城計/, 228],
];
for (const [re, wantYear] of musts) {
  const found = ALL_EVENTS.find(e => re.test(e.title));
  const ok = found && Math.abs(found.year - wantYear) <= 1;
  console.log(`${ok ? 'PASS' : 'FAIL'} | ${re} 年份=${found ? found.year : '不存在'}（應≈${wantYear}）`);
  if (!ok) fail++;
}

// 7. 歸晉事件
const juan = ALL_EVENTS.find(e => /歸晉|滅吳|孫皓/.test(e.title + e.description));
console.log(`${juan && juan.year >= 263 && juan.year <= 280 ? 'PASS' : 'FAIL'} | 三國歸晉事件 year=${juan && juan.year}`);
if (!juan) fail++;

console.log(fail === 0 ? '\n== ALL PASS ==' : `\n== ${fail} FAIL ==`);
process.exit(fail ? 1 : 0);
