// ============================================
// 三國蝴蝶 - 全面 API 測試套件（v4 - 最終版）
// 修復：每個測試先清理所有殘留紀錄
// ============================================

const BASE_URL = process.env.BASE_URL || 'http://localhost:3012';
const results = [];
let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (!condition) {
    failCount++;
    results.push({ test: message, pass: false });
    console.log(`  ❌ FAIL: ${message}`);
    return false;
  }
  passCount++;
  results.push({ test: message, pass: true });
  return true;
}

function assertNumber(value, message) {
  assert(typeof value === 'number' && !isNaN(value), message);
}

function assertNonNegativeInt(value, message) {
  assert(Number.isInteger(value) && value >= 0, message);
}

function assertString(value, message) {
  assert(typeof value === 'string', message);
}

function assertArray(value, message) {
  assert(Array.isArray(value), message);
}

function assertNonNull(value, message) {
  assert(value !== null && value !== undefined, message);
}

async function apiCall(method, path, body = null) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);
  
  const res = await fetch(url, options);
  const text = await res.text();
  
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }
  
  return { status: res.status, data };
}

function findEntry(data, id) {
  return data?.data?.find(d => d.id === id) || null;
}

function createTestEntry(prefix, age = 25, reputation = 50) {
  const ts = Date.now();
  const rnd = Math.random().toString(36).slice(2, 8);
  return {
    id: `${prefix}_test_${ts}_${rnd}`,
    name: `${prefix}_test`,
    gender: 'male',
    background: 'scholar',
    age,
    deathType: 'natural',
    deathReason: '',
    endingTitle: '順應天命',
    endingEvaluation: `測試評價 ${prefix}`,
    reputation,
    gold: 200,
    achievements: [],
    totalChoices: 10,
    butterflyEffects: 3,
    keyChoices: [],
    timeline: [],
    timestamp: Date.now(),
  };
}

// 測試開始前清理所有殘留 test 紀錄（檢查 ID 和 name 欄位）
async function ensureCleanState() {
  const { data } = await apiCall('GET', '/api/leaderboard');
  const testEntries = data.data.filter(d => d.id.includes('_test_') || d.name.endsWith('_test'));
  for (const entry of testEntries) {
    await apiCall('DELETE', `/api/leaderboard/${entry.id}`);
  }
}

// ============================================
// 測試套件
// ============================================

async function test1_api_endpoint_exists() {
  console.log('\n📋 測試 1: API 端點可用性');
  await ensureCleanState();
  
  const { status: getStatus } = await apiCall('GET', '/api/leaderboard');
  assert(getStatus === 200, 'GET /api/leaderboard 回傳 200');
  
  const entry = createTestEntry('endpoint');
  const { status: postStatus } = await apiCall('POST', '/api/leaderboard', entry);
  assert(postStatus === 200, 'POST /api/leaderboard 回傳 200');
  
  const { status: getEntryStatus } = await apiCall('GET', `/api/leaderboard/${entry.id}`);
  assert(getEntryStatus === 200, 'GET /api/leaderboard/:id 回傳 200');
  
  const { status: deleteStatus } = await apiCall('DELETE', `/api/leaderboard/${entry.id}`);
  assert(deleteStatus === 200, 'DELETE /api/leaderboard/:id 回傳 200');
}

async function test2_get_leaderboard_response_structure() {
  console.log('\n📋 測試 2: GET /api/leaderboard 回傳結構');
  await ensureCleanState();
  
  const { data } = await apiCall('GET', '/api/leaderboard');
  
  assert(data !== null, '回傳 data 不為 null');
  assert(data.success === true, 'data.success === true');
  assertArray(data.data, 'data.data 是陣列');
  assertNonNull(data.stats, 'data.stats 不為 null');
  
  assertNonNegativeInt(data.stats.total, 'data.stats.total 是非負整數');
  assertNonNegativeInt(data.stats.maxAge, 'data.stats.maxAge 是非負整數');
  assertNonNegativeInt(data.stats.avgAge, 'data.stats.avgAge 是非負整數');
  assertNonNegativeInt(data.stats.maxRep, 'data.stats.maxRep 是非負整數');
}

async function test3_post_creates_entry() {
  console.log('\n📋 測試 3: POST /api/leaderboard 建立紀錄');
  await ensureCleanState();
  
  const entry = createTestEntry('create');
  const { data } = await apiCall('POST', '/api/leaderboard', entry);
  
  assert(data.success === true, '回傳 success=true');
  assertArray(data.data, 'data.data 是陣列');
  
  const newEntry = findEntry(data, entry.id);
  assert(newEntry !== null, `找到剛建立的紀錄 (id: ${entry.id})`);
  assert(newEntry.id === entry.id, 'id 正確');
  assert(newEntry.name === entry.name, 'name 正確');
  assert(newEntry.gender === entry.gender, 'gender 正確');
  assert(newEntry.background === entry.background, 'background 正確');
  assertNonNegativeInt(newEntry.age, 'age 是數字');
  assert(newEntry.age === entry.age, `age=${entry.age} 正確`);
  assertString(newEntry.deathType, 'deathType 是字串');
  assertString(newEntry.deathReason, 'deathReason 是字串');
  assertString(newEntry.endingTitle, 'endingTitle 是字串');
  assertString(newEntry.endingEvaluation, 'endingEvaluation 是字串');
  assertNonNegativeInt(newEntry.reputation, 'reputation 是數字');
  assertNonNegativeInt(newEntry.gold, 'gold 是數字');
  assertArray(newEntry.achievements, 'achievements 是陣列');
  assertNonNegativeInt(newEntry.totalChoices, 'totalChoices 是數字');
  assertNonNegativeInt(newEntry.butterflyEffects, 'butterflyEffects 是數字');
  assertArray(newEntry.keyChoices, 'keyChoices 是陣列');
  assertArray(newEntry.timeline, 'timeline 是陣列');
  assertNonNegativeInt(newEntry.timestamp, 'timestamp 是數字');
}

async function test4_get_entry_by_id() {
  console.log('\n📋 測試 4: GET /api/leaderboard/:id');
  await ensureCleanState();
  
  const entry = createTestEntry('get');
  await apiCall('POST', '/api/leaderboard', entry);
  
  const { data } = await apiCall('GET', `/api/leaderboard/${entry.id}`);
  
  assert(data.success === true, 'success=true');
  assertNonNull(data.data, 'data.data 不為 null');
  assert(data.data.id === entry.id, '回傳的 id 正確');
  assert(data.data.name === entry.name, '回傳的 name 正確');
  assert(data.data.age === entry.age, '回傳的 age 正確');
  
  const { status: notFoundStatus, data: notFound } = await apiCall('GET', '/api/leaderboard/nonexistent_12345');
  assert(notFoundStatus === 200 || notFoundStatus === 404, `不存在 id 回傳 ${notFoundStatus || 'null'}（200 或 404 均可）`);
  if (notFound && notFound.success !== undefined) assert(notFound.success === false, '不存在 id success=false');
}

async function test5_delete_entry() {
  console.log('\n📋 測試 5: DELETE /api/leaderboard/:id');
  await ensureCleanState();
  
  const entry = createTestEntry('delete');
  await apiCall('POST', '/api/leaderboard', entry);
  
  const { data: getBefore } = await apiCall('GET', `/api/leaderboard/${entry.id}`);
  assert(getBefore.data !== null, '刪除前紀錄存在');
  
  const { data } = await apiCall('DELETE', `/api/leaderboard/${entry.id}`);
  assert(data.success === true, '回傳 success=true');
  assert(data.message === '刪除成功', '回傳訊息為「刪除成功」');
  
  const { data: getAfter } = await apiCall('GET', `/api/leaderboard/${entry.id}`);
  const isDeleted = getAfter.data === null || getAfter.data === undefined || (getAfter.data && getAfter.data.success === false);
  assert(isDeleted, '刪除後紀錄不存在');
}

async function test6_delete_nonexistent() {
  console.log('\n📋 測試 6: DELETE 不存在的紀錄');
  
  const { data } = await apiCall('DELETE', '/api/leaderboard/nonexistent_12345');
  assert(data.success === false, '回傳 success=false');
  assert(data.message === '找不到該紀錄', '回傳訊息為「找不到該紀錄」');
}

async function test7_stats_accuracy() {
  console.log('\n📋 測試 7: 統計數據正確性');
  // 清理所有殘留紀錄（不只在於 _test_ pattern）
  const { data: before } = await apiCall('GET', '/api/leaderboard');
  for (const entry of before.data) {
    await apiCall('DELETE', `/api/leaderboard/${entry.id}`);
  }
  
  const entries = [
    createTestEntry('stats_1', 20, 30),
    createTestEntry('stats_2', 40, 80),
    createTestEntry('stats_3', 30, 50),
  ];
  
  for (const entry of entries) {
    await apiCall('POST', '/api/leaderboard', entry);
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { data } = await apiCall('GET', '/api/leaderboard');
  const stats = data.stats;
  
  assert(stats.total === 3, `total=3 (actual: ${stats.total})`);
  assert(stats.maxAge === 40, `maxAge=40 (actual: ${stats.maxAge})`);
  assert(stats.avgAge === 30, `avgAge=30 (actual: ${stats.avgAge})`);
  assert(stats.maxRep === 80, `maxRep=80 (actual: ${stats.maxRep})`);
}

async function test8_sorting() {
  console.log('\n📋 測試 8: 排序規則驗證');
  // 清理所有殘留紀錄
  const { data: before } = await apiCall('GET', '/api/leaderboard');
  for (const entry of before.data) {
    await apiCall('DELETE', `/api/leaderboard/${entry.id}`);
  }
  
  const entries = [
    createTestEntry('sort_1', 25, 50),
    createTestEntry('sort_2', 40, 30),
    createTestEntry('sort_3', 25, 80),
  ];
  
  for (const entry of entries) {
    await apiCall('POST', '/api/leaderboard', entry);
  }
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { data } = await apiCall('GET', '/api/leaderboard');
  const sortEntries = data.data.filter(d => d.id.startsWith('sort_'));
  // 排序應該是：sort_2 (age=40) → sort_3 (age=25, rep=80) → sort_1 (age=25, rep=50)
  assert(sortEntries[0].id.includes('sort_2'), '最高年齡排第一');
  assert(sortEntries[1].id.includes('sort_3'), '同年齡高聲望排第二');
  assert(sortEntries[2].id.includes('sort_1'), '同年齡低聲望排第三');
}

async function test9_minimal_data() {
  console.log('\n📋 測試 9: POST 最小資料');
  await ensureCleanState();
  
  const ts = Date.now();
  const rnd = Math.random().toString(36).slice(2, 8);
  const entry = {
    id: `minimal_test_${ts}_${rnd}`,
    name: '最小',
    gender: 'male',
    background: 'commoner',
    age: 0,
    deathType: 'survived',
    deathReason: '',
    endingTitle: '未知',
    endingEvaluation: '',
    reputation: 0,
    gold: 0,
    achievements: [],
    totalChoices: 0,
    butterflyEffects: 0,
    keyChoices: [],
    timeline: [],
    timestamp: Date.now(),
  };
  
  const { data } = await apiCall('POST', '/api/leaderboard', entry);
  assert(data.success === true, '最小資料也能建立');
  
  const found = findEntry(data, entry.id);
  assert(found !== null, '找到最小資料紀錄');
  assert(found.age === 0, '年齡 0 可儲存');
  assert(found.reputation === 0, '聲望 0 可儲存');
}

async function test10_empty_array_fields() {
  console.log('\n📋 測試 10: POST 空陣列欄位');
  await ensureCleanState();
  
  const entry = createTestEntry('empty_array');
  entry.achievements = [];
  entry.keyChoices = [];
  entry.timeline = [];
  
  const { data } = await apiCall('POST', '/api/leaderboard', entry);
  assert(data.success === true, '空陣列欄位可建立');
  
  const found = findEntry(data, entry.id);
  assert(Array.isArray(found.achievements), 'achievements 保持為陣列');
  assert(Array.isArray(found.keyChoices), 'keyChoices 保持為陣列');
  assert(Array.isArray(found.timeline), 'timeline 保持為陣列');
}

async function test11_complex_data() {
  console.log('\n📋 測試 11: POST 含 keyChoices 和 timeline');
  await ensureCleanState();
  
  const entry = {
    ...createTestEntry('complex', 25, 60),
    keyChoices: [
      { age: 15, text: '選擇投效曹操' },
      { age: 20, text: '參加官渡之戰' },
    ],
    timeline: [
      { year: 200, event: '出生於洛陽' },
      { year: 205, event: '加入曹操軍' },
    ],
  };
  
  const { data } = await apiCall('POST', '/api/leaderboard', entry);
  assert(data.success === true, '複雜資料可建立');
  
  const found = findEntry(data, entry.id);
  assert(found.keyChoices.length === 2, 'keyChoices 有 2 筆');
  assert(found.keyChoices[0].text === '選擇投效曹操', 'keyChoices[0] 正確');
  assert(found.timeline.length === 2, 'timeline 有 2 筆');
  assert(found.timeline[0].year === 200, 'timeline[0].year 正確');
}

async function test12_special_characters() {
  console.log('\n📋 測試 12: POST 特殊字元');
  await ensureCleanState();
  
  const entry = {
    ...createTestEntry('special', 30, 70),
    name: '測試「特殊」&<字符> & 中文名',
    deathReason: '中毒&溺水⚔️🗡️',
    endingTitle: '特殊結局「終章」',
  };
  
  const { data } = await apiCall('POST', '/api/leaderboard', entry);
  assert(data.success === true, '特殊字元可儲存');
  
  const found = findEntry(data, entry.id);
  assert(found.name.includes('特殊'), 'name 包含特殊字元');
  assert(found.deathReason.includes('中毒'), 'deathReason 包含特殊字元');
}

async function test13_large_data() {
  console.log('\n📋 測試 13: POST 大量資料');
  await ensureCleanState();
  
  const keyChoices = Array.from({ length: 50 }, (_, i) => ({
    age: i + 1,
    text: `選擇 ${i + 1}`,
  }));
  
  const timeline = Array.from({ length: 50 }, (_, i) => ({
    year: 184 + i,
    event: `事件 ${i + 1}`,
  }));
  
  const entry = {
    ...createTestEntry('large', 50, 100),
    keyChoices,
    timeline,
  };
  
  const { data } = await apiCall('POST', '/api/leaderboard', entry);
  assert(data.success === true, '大量資料可儲存');
  
  const found = findEntry(data, entry.id);
  assert(found.keyChoices.length === 50, 'keyChoices 有 50 筆');
  assert(found.timeline.length === 50, 'timeline 有 50 筆');
}

async function test14_id_uniqueness() {
  console.log('\n📋 測試 14: POST id 唯一性');
  await ensureCleanState();
  
  const entry = createTestEntry('uniqueness');
  
  const { data: data1 } = await apiCall('POST', '/api/leaderboard', entry);
  assert(data1.success === true, '第一次寫入成功');
  
  const { data: data2 } = await apiCall('POST', '/api/leaderboard', { ...entry, timestamp: Date.now() });
  assert(data2.success === true, '第二次寫入也成功（API 層允許）');
}

async function test15_timestamp_format() {
  console.log('\n📋 測試 15: POST timestamp 格式');
  await ensureCleanState();
  
  const entry = createTestEntry('timestamp');
  
  const { data } = await apiCall('POST', '/api/leaderboard', entry);
  
  const found = findEntry(data, entry.id);
  assert(typeof found.timestamp === 'number', 'timestamp 是數字');
  assert(found.timestamp > 0, 'timestamp 是正數');
}

async function test16_invalid_age() {
  console.log('\n📋 測試 16: POST 異常年齡值');
  await ensureCleanState();
  
  const negAge = { ...createTestEntry('negative'), age: -5 };
  const { data: negData } = await apiCall('POST', '/api/leaderboard', negAge);
  assert(negData.success === true, '負數年齡仍可儲存（API 不驗證）');
  
  const zeroAge = { ...createTestEntry('zero'), age: 0 };
  const { data: zeroData } = await apiCall('POST', '/api/leaderboard', zeroAge);
  assert(zeroData.success === true, '年齡 0 可儲存');
}

async function test17_concurrent_posts() {
  console.log('\n📋 測試 17: 同時 POST 多個紀錄');
  await ensureCleanState();
  
  const entries = Array.from({ length: 5 }, (_, i) =>
    createTestEntry(`concurrent_${i}`, 20 + i, 30 + i * 10)
  );
  
  const responses = await Promise.all(
    entries.map(entry => apiCall('POST', '/api/leaderboard', entry))
  );
  
  const allSuccess = responses.every(r => r.data.success === true);
  assert(allSuccess, '所有 POST 都成功');
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const { data } = await apiCall('GET', '/api/leaderboard');
  const foundEntries = entries.filter(e => findEntry(data, e.id) !== null);
  assert(foundEntries.length === 5, `5 筆紀錄都成功寫入 (found: ${foundEntries.length})`);
}

// ============================================
// 執行所有測試
// ============================================

async function runAllTests() {
  console.log(`\n🚀 全面 API 測試套件 v4 (BASE_URL: ${BASE_URL})`);
  console.log('═'.repeat(70));
  console.log('涵蓋範圍：端點可用性、CRUD、結構、排序、統計、邊緣情況、併發\n');
  
  const startTime = Date.now();
  
  try {
    await test1_api_endpoint_exists();
    await test2_get_leaderboard_response_structure();
    await test3_post_creates_entry();
    await test4_get_entry_by_id();
    await test5_delete_entry();
    await test6_delete_nonexistent();
    await test7_stats_accuracy();
    await test8_sorting();
    await test9_minimal_data();
    await test10_empty_array_fields();
    await test11_complex_data();
    await test12_special_characters();
    await test13_large_data();
    await test14_id_uniqueness();
    await test15_timestamp_format();
    await test16_invalid_age();
    await test17_concurrent_posts();
  } catch (err) {
    console.log(`\n❌ 測試執行錯誤: ${err.message}`);
    console.log(err.stack);
  }
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  
  console.log('\n' + '═'.repeat(70));
  console.log(`📊 測試結果: ✅ ${passCount} 通過 / ❌ ${failCount} 失敗 / 總計 ${passCount + failCount}`);
  console.log(`⏱️  耗時: ${elapsed}s`);
  console.log('═'.repeat(70));
  
  if (failCount > 0) {
    console.log('\n❌ 有測試失敗！');
    process.exit(1);
  } else {
    console.log('\n✅ 全部測試通過！');
    process.exit(0);
  }
}

runAllTests();
