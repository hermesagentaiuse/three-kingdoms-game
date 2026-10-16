// ============================================
// Save Slice — 多存檔系統（最多 5 個槽位）
// ============================================
import type { SaveData, GameState, Player } from '@/types/game';

export const SAVE_SLOT_COUNT = 5;
const SAVE_PREFIX = 'tk_save_';

export interface SaveSlotInfo {
  slotIndex: number;
  version: string;
  timestamp: number;
  dateFormatted: string;
  // 遊戲摘要
  year: number;
  age: number;
  currentEra: string;
  faction: string;
  achievements: string[];
  achievementsSummary: string;
  reputation: number;
  gold: number;
  totalChoices: number;
}

/** 格式化時間戳記為可讀日期 */
function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** 生成成就摘要 */
function generateAchievementsSummary(player: Player): string {
  const achievements = player.achievements || [];
  const skills = player.skills || [];
  const companions = player.companions || [];

  const parts: string[] = [];
  if (achievements.length > 0) {
    parts.push(`成就${achievements.length}項`);
  }
  if (skills.length > 0) {
    parts.push(`技能${skills.length}`);
  }
  if (companions.length > 0) {
    parts.push(`夥伴${companions.length}人`);
  }
  if (player.maxGold > 0) {
    parts.push(` richest ${player.maxGold}金`);
  }
  if (player.maxReputation > 0) {
    parts.push(`聲望${player.maxReputation}`);
  }
  return parts.length > 0 ? parts.join(' · ') : '暫無成就';
}

/** 讀取存檔槽位清單 */
export function loadSaveSlots(): SaveSlotInfo[] {
  const slots: SaveSlotInfo[] = [];
  for (let i = 0; i < SAVE_SLOT_COUNT; i++) {
    try {
      const raw = localStorage.getItem(`${SAVE_PREFIX}${i}`);
      if (!raw) continue;
      const data: SaveData = JSON.parse(raw);
      if (!data.gameState) continue;
      const player = data.gameState.player;

      slots.push({
        slotIndex: i,
        version: data.version || '0.2.0',
        timestamp: data.timestamp,
        dateFormatted: formatTimestamp(data.timestamp),
        year: player.currentYear,
        age: player.age,
        currentEra: player.currentEra,
        faction: player.faction || 'none',
        achievements: player.achievements || [],
        achievementsSummary: generateAchievementsSummary(player),
        reputation: player.resources.reputation,
        gold: player.resources.gold,
        totalChoices: player.totalChoices || 0,
      });
    } catch {
      // 忽略錯誤的存檔
    }
  }
  return slots;
}

/** 讀取特定槽位的存檔 */
export function loadSaveFromSlot(slotIndex: number): SaveData | null {
  try {
    const raw = localStorage.getItem(`${SAVE_PREFIX}${slotIndex}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** 儲存到特定槽位 */
export function saveToSlot(slotIndex: number, gameState: GameState): boolean {
  try {
    if (slotIndex < 0 || slotIndex >= SAVE_SLOT_COUNT) return false;
    const saveData: SaveData = {
      version: '0.3.0',
      timestamp: Date.now(),
      gameState,
    };
    localStorage.setItem(`${SAVE_PREFIX}${slotIndex}`, JSON.stringify(saveData));
    return true;
  } catch {
    return false;
  }
}

/** 刪除特定槽位 */
export function deleteSaveSlot(slotIndex: number): boolean {
  try {
    localStorage.removeItem(`${SAVE_PREFIX}${slotIndex}`);
    return true;
  } catch {
    return false;
  }
}

/** 將所有存檔槽位匯出為 JSON 字串（備份用） */
export function exportAllSaves(): string {
  const allSaves: Record<number, SaveData> = {};
  for (let i = 0; i < SAVE_SLOT_COUNT; i++) {
    try {
      const raw = localStorage.getItem(`${SAVE_PREFIX}${i}`);
      if (raw) {
        allSaves[i] = JSON.parse(raw);
      }
    } catch {
      // ignore
    }
  }
  return JSON.stringify(allSaves);
}

/** 匯入存檔（從 JSON 字串） */
export function importAllSaves(jsonString: string): boolean {
  try {
    const allSaves: Record<number, SaveData> = JSON.parse(jsonString);
    for (const [key, data] of Object.entries(allSaves)) {
      const idx = parseInt(key, 10);
      if (idx >= 0 && idx < SAVE_SLOT_COUNT) {
        localStorage.setItem(`${SAVE_PREFIX}${idx}`, JSON.stringify(data));
      }
    }
    return true;
  } catch {
    return false;
  }
}
