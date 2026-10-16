// ============================================
// 伺服器端排行榜持久化（JSON 檔案）
// 用於多客戶端共享的伺服器排行榜
// ============================================
// 使用 require 避免 Next.js dev mode HMR 問題
const fs = require('node:fs');
const path = require('node:path');

const SERVER_LEADERBOARD_PATH = path.join(process.cwd(), 'data', 'server_leaderboard.json');

export interface ServerLeaderboardEntry {
  id: string;
  name: string;
  gender: string;
  background: string;
  age: number;
  deathType: string;
  deathReason: string;
  endingTitle: string;
  endingEvaluation: string;
  reputation: number;
  gold: number;
  achievements: string[];
  totalChoices: number;
  butterflyEffects: number;
  keyChoices: { age: number; text: string }[];
  timeline: { year: number; era: string; text: string }[];
  timestamp: number;
}

/** 讀取伺服器排行榜 */
export function readServerLeaderboard(): ServerLeaderboardEntry[] {
  try {
    const dir = path.dirname(SERVER_LEADERBOARD_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(SERVER_LEADERBOARD_PATH)) {
      fs.writeFileSync(SERVER_LEADERBOARD_PATH, '[]', 'utf-8');
    }
    const raw = fs.readFileSync(SERVER_LEADERBOARD_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/** 寫入伺服器排行榜 */
export function writeServerLeaderboard(entries: ServerLeaderboardEntry[]): void {
  try {
    const dir = path.dirname(SERVER_LEADERBOARD_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(SERVER_LEADERBOARD_PATH, JSON.stringify(entries, null, 2), 'utf-8');
  } catch (err) {
    console.error('[ServerLeaderboard] Write error:', err);
  }
}

/** 新增並排序 */
export function addServerLeaderboardEntry(entry: ServerLeaderboardEntry): ServerLeaderboardEntry[] {
  const board = readServerLeaderboard();
  board.push(entry);
  // 排序：年齡高→低，同年聲望高→低，同年同聲望時間早→晚
  board.sort((a, b) => {
    if (b.age !== a.age) return b.age - a.age;
    if (b.reputation !== a.reputation) return b.reputation - a.reputation;
    return a.timestamp - b.timestamp;
  });
  const top100 = board.slice(0, 100);
  writeServerLeaderboard(top100);
  return top100;
}

/** 刪除單筆 */
export function deleteServerLeaderboardEntry(id: string): boolean {
  const board = readServerLeaderboard();
  const filtered = board.filter((e) => e.id !== id);
  if (filtered.length === board.length) return false; // 沒找到
  writeServerLeaderboard(filtered);
  return true;
}

/** 清除全部 */
export function clearServerLeaderboard(): void {
  writeServerLeaderboard([]);
}

/** 取得單筆 */
export function getServerLeaderboardEntry(id: string): ServerLeaderboardEntry | null {
  const board = readServerLeaderboard();
  return board.find((e) => e.id === id) ?? null;
}

/** 統計 */
export function getServerLeaderboardStats() {
  const board = readServerLeaderboard();
  if (board.length === 0) return { total: 0, maxAge: 0, avgAge: 0, maxRep: 0 };
  const ages = board.map((e) => e.age);
  return {
    total: board.length,
    maxAge: Math.max(...ages),
    avgAge: Math.round(ages.reduce((s, a) => s + a, 0) / ages.length),
    maxRep: Math.max(...board.map((e) => e.reputation)),
  };
}
