// ============================================
// 排行榜系統 - 客戶端模組
// 伺服器可用時透過 API 互動；靜態部署（GitHub Pages）自動退回 localStorage
// ============================================

const API_BASE = '/api/leaderboard';

// 靜態部署模式：BUILD 時設定 NEXT_PUBLIC_STATIC=1
export const STATIC_MODE = process.env.NEXT_PUBLIC_STATIC === '1';

export interface LeaderboardEntry {
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
  timeline: { year: number; event: string }[];
  timestamp: number;
}

/** 讀取本地排行榜 */
export function getLocalLeaderboard(): LeaderboardEntry[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem('tk_leaderboard');
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/** 新增本地排行榜紀錄並排序（依 id 去重） */
export function addLocalLeaderboardEntry(entry: LeaderboardEntry): void {
  const board = getLocalLeaderboard();
  if (board.some((e) => e.id === entry.id)) return;
  board.push(entry);
  board.sort((a, b) => {
    if (b.age !== a.age) return b.age - a.age;
    return b.reputation - a.reputation;
  });
  const top100 = board.slice(0, 100);
  localStorage.setItem('tk_leaderboard', JSON.stringify(top100));
}

/** 清除本地排行榜 */
export function clearLocalLeaderboard(): void {
  localStorage.removeItem('tk_leaderboard');
}

/** 取得本地排行榜統計 */
export function getLocalLeaderboardStats() {
  const board = getLocalLeaderboard();
  if (board.length === 0) return { total: 0, maxAge: 0, avgAge: 0, maxRep: 0 };
  const ages = board.map((e) => e.age);
  const maxAge = Math.max(...ages);
  const avgAge = Math.round(ages.reduce((s, a) => s + a, 0) / ages.length);
  const maxRep = Math.max(...board.map((e) => e.reputation));
  return { total: board.length, maxAge, avgAge, maxRep };
}

/** 排序：年齡高→低，同年聲望高→低 */
function sortBoard(board: LeaderboardEntry[]): LeaderboardEntry[] {
  return [...board].sort((a, b) => {
    if (b.age !== a.age) return b.age - a.age;
    if (b.reputation !== a.reputation) return b.reputation - a.reputation;
    return a.timestamp - b.timestamp;
  });
}

/** 從伺服器端取得排行榜（靜態模式退回本地） */
export async function fetchServerLeaderboard(): Promise<{ data: LeaderboardEntry[]; stats: { total: number; maxAge: number; avgAge: number; maxRep: number } }> {
  if (STATIC_MODE) {
    const board = sortBoard(getLocalLeaderboard());
    return { data: board, stats: getLocalLeaderboardStats() };
  }
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('取得排行榜失敗');
  const json = await res.json();
  return {
    data: json.data || [],
    stats: json.stats || { total: 0, maxAge: 0, avgAge: 0, maxRep: 0 },
  };
}

/** 新增到伺服器端排行榜（靜態模式退回本地） */
export async function addServerLeaderboard(entry: LeaderboardEntry): Promise<boolean> {
  if (STATIC_MODE) {
    try {
      addLocalLeaderboardEntry(entry);
      return true;
    } catch {
      return false;
    }
  }
  try {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** 從伺服器端刪除紀錄（靜態模式退回本地） */
export async function deleteServerEntry(id: string): Promise<boolean> {
  if (STATIC_MODE) {
    const board = getLocalLeaderboard();
    const filtered = board.filter((e) => e.id !== id);
    if (filtered.length === board.length) return false;
    localStorage.setItem('tk_leaderboard', JSON.stringify(filtered));
    return true;
  }
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

/** 從伺服器端取得單筆紀錄（靜態模式退回本地） */
export async function fetchServerEntry(id: string): Promise<LeaderboardEntry | null> {
  if (STATIC_MODE) {
    return getLocalLeaderboard().find((e) => e.id === id) ?? null;
  }
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch {
    return null;
  }
}

/** 從伺服器端取得單筆紀錄（向後相容） */
export async function getLeaderboardEntry(id: string): Promise<LeaderboardEntry | null> {
  return fetchServerEntry(id);
}

// === 向後相容 ===
export function getLeaderboard(): LeaderboardEntry[] {
  return getLocalLeaderboard();
}

export function addLeaderboardEntry(entry: LeaderboardEntry): void {
  addLocalLeaderboardEntry(entry);
}

export function getLeaderboardStats() {
  return getLocalLeaderboardStats();
}

export function clearLeaderboard(): void {
  clearLocalLeaderboard();
}
