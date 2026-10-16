// ============================================
// Game Store — 主入口，匯出合併後的 store
// ============================================
import { create } from 'zustand';
import type { Player, GameState, SaveData, GameEvent } from '@/types/game';
import { ERAS } from '@/types/game';
import { ALL_EVENTS, RANDOM_EVENTS } from '@/lib/data/events';
import { getLifeStageTitle as _getLifeStageTitle } from './slices/eventSlice';
import { clampStat, applyStatChange, getCompanionBonus, checkSkillUnlock } from './slices/playerSlice';
import { checkDeath, getLifeStage, getFilteredEvents, applyChoiceEffects, generateRandomEvent } from './slices/eventSlice';
import { generateFactionChoiceEvent } from '@/lib/data/factionEvents';
import { saveToSlot, loadSaveFromSlot, loadSaveSlots, deleteSaveSlot } from './slices/saveSlice';
import { SAVE_SLOT_COUNT } from './slices/saveSlice';
import { createUISlice, type ResultType } from './slices/uiSlice';

// ============================================
// Store 介面定義
// 保持與現有 UI 元件的 API 相容性
// ============================================
interface GameStore {
  // 遊戲狀態
  gameState: GameState | null;
  isGameOver: boolean;
  currentEvent: GameEvent | null;
  history: GameEvent[];
  turnCount: number;
  flags: Record<string, boolean>;

  // UI 狀態
  resultMessage: string | null;
  resultType: ResultType | null;
  showResult: boolean;
  changeLog: string[] | null;

  // 動作
  startNewGame: (player: Player) => void;
  loadGame: (saveData: SaveData) => void;
  nextTurn: () => void;
  makeChoice: (choiceIndex: number) => void;
  confirmResult: () => void;
  generateEvent: () => GameEvent | null;
  togglePause: () => void;

  // 存檔系統（多槽位）
  saveGame: (slotIndex?: number) => boolean;
  saveToSlot: (slotIndex: number) => boolean;
  loadSave: (slotIndex: number) => SaveData | null;
  loadSaveFromSlot: (slotIndex: number) => SaveData | null;
  loadSaveSlots: () => import('./slices/saveSlice').SaveSlotInfo[];
  deleteSave: (slotIndex?: number) => void;
  clearAllSaves: () => void;
  initFromSave: (saveData: SaveData) => void;

  // Flag 系統
  setFlag: (flag: string, value: boolean) => void;
  hasFlag: (flag: string) => boolean;

  // 工具
  resetGame: () => void;
  getLifeStageTitle: (stage: string) => string;
}

// 初始遊戲狀態
const initialState: GameState = {
  player: {
    name: '',
    gender: 'male',
    background: 'commoner',
    birthYear: 184,
    age: 0,
    currentEra: 'huangjin',
    currentYear: 184,
    stats: { int: 10, str: 10, lck: 10, cha: 10, vit: 10 },
    totalExp: 0,
    level: 1,
    skills: [],
    companions: [],
    relationships: {},
    resources: { gold: 10, reputation: 0, intelligence: 0, items: [] },
    history: [],
    achievements: [],
    isAlive: true,
    butterflyHistory: [],
    butterflySummary: {},
    deathType: '',
    lifeStageEvents: [],
    totalChoices: 0,
    totalVictories: 0,
    totalDefeats: 0,
    rareEventCount: 0,
    marriageCount: 0,
    maxReputation: 0,
    maxGold: 0,
    keyChoiceHistory: [],
    triggeredHistoricalEvents: [],
    triggeredEvents: [],
    faction: 'none',
    flags: {},
  },
  currentEvent: null,
  availableEvents: [],
  history: [],
  isGameOver: false,
  isPaused: false,
  turnCount: 0,
  flags: {},
};

/** 取得人生階段標題 */
export function getLifeStageTitle(stage: string): string {
  return _getLifeStageTitle(stage);
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  isGameOver: false,
  currentEvent: null,
  history: [],
  turnCount: 0,
  flags: {},
  resultMessage: null,
  resultType: null,
  showResult: false,
  changeLog: null,

  // === 開始新遊戲 ===
  startNewGame: (player: Player) => {
    const newState: GameState = {
      ...initialState,
      player,
    };
    set({
      gameState: newState,
      isGameOver: false,
      currentEvent: null,
      history: [],
      turnCount: 0,
      flags: {},
      resultMessage: null,
      resultType: null,
      showResult: false,
      changeLog: null,
    });
    const event = get().generateEvent();
    set({ currentEvent: event });
  },

  // === 讀取存檔 ===
  loadGame: (saveData: SaveData) => {
    const newState = saveData.gameState;
    if (!newState) return;

    set({
      gameState: newState,
      history: newState.history || [],
      isGameOver: newState.isGameOver,
      turnCount: newState.turnCount || 0,
      currentEvent: newState.currentEvent,
      resultMessage: null,
      resultType: null,
      showResult: false,
      changeLog: null,
    });
  },

  // === 進入下一年 ===
  nextTurn: () => {
    const state = get().gameState;
    if (!state) return;

    const newPlayer = { ...state.player };
    newPlayer.currentYear += 1;
    newPlayer.age += 1;

    // === 歷史終結：280 年西晉滅吳，天下歸一，遊戲落幕 ===
    if (newPlayer.currentYear > 280) {
      newPlayer.isAlive = false;
      newPlayer.deathType = 'natural';
      newPlayer.deathReason = '太康元年，吳主孫皓出降，三國歸晉，天下統一。你見證了整個時代的落幕，安然終老於盛世。';
      set({
        gameState: { ...state, player: newPlayer, isGameOver: true },
        isGameOver: true,
        currentEvent: null,
        resultMessage: null,
        resultType: null,
        showResult: false,
        changeLog: null,
      });
      return;
    }

    // 檢查死亡
    const deathInfo = checkDeath(newPlayer);

    const newState: GameState = {
      ...state,
      player: newPlayer,
      isGameOver: deathInfo.isDead,
    };

    const event = get().generateEvent();
    newState.currentEvent = event;

    set({
      gameState: newState,
      currentEvent: event,
      isGameOver: deathInfo.isDead,
      resultMessage: null,
      resultType: null,
      showResult: false,
      changeLog: null,
    });
  },

  // === 選擇事件選項 ===
  makeChoice: (choiceIndex: number) => {
    const state = get().gameState;
    const event = get().currentEvent;
    if (!state || !event) return;

    const choice = event.choices[choiceIndex];
    if (!choice) return;

    // 記錄選擇歷史
    let newPlayer = { ...state.player };
    newPlayer.history.push({
      year: newPlayer.currentYear,
      era: newPlayer.currentEra,
      eventId: event.id,
      choiceIndex,
      choiceText: choice.text,
      effects: choice.effects as Record<string, number | boolean | string>,
    });

    const newEventHistory = [...state.history, event];

    // 使用重構後的 applyChoiceEffects 套用效果
    const result = applyChoiceEffects(newPlayer, choice as unknown as Parameters<typeof applyChoiceEffects>[1], true);

    newPlayer = result.player;
    const isDead = result.deathCheck.isDead;
    if (isDead) {
      newPlayer.isAlive = false;
      newPlayer.deathType = result.deathCheck.deathCategory;
      newPlayer.deathReason = result.deathCheck.deathReason || newPlayer.deathReason;
    }

    // 如果 flag 已套用，更新 store 中的 flags
    let newFlags = { ...get().flags };
    if (result.flagApplied) {
      newFlags = { ...newFlags, ...result.flagApplied };
    }

    const newState: GameState = {
      ...state,
      player: newPlayer,
      flags: newFlags,
      history: newEventHistory,
      currentEvent: null,
      isGameOver: newPlayer.isAlive === false || isDead,
    };

    set({
      gameState: newState,
      history: newEventHistory,
      flags: newFlags,
      currentEvent: null,
      resultMessage: result.resultMsg,
      resultType: result.resultType,
      showResult: true,
      changeLog: result.changeLog.length > 0 ? result.changeLog : null,
      isGameOver: newState.isGameOver,
    });
  },

  // === 確認結果，進入下一年 ===
  confirmResult: () => {
    const state = get().gameState;
    if (!state) return;

    const newPlayer = { ...state.player };
    newPlayer.currentYear += 1;
    newPlayer.age += 1;

    const death = checkDeath(newPlayer);
    const newIsDead = death.isDead;

    if (newIsDead) {
      newPlayer.isAlive = false;
      newPlayer.deathReason = death.deathReason;
    }

    const newState: GameState = {
      ...state,
      player: newPlayer,
      isGameOver: newIsDead,
    };

    set({
      gameState: newState,
      currentEvent: newIsDead ? null : get().generateEvent(),
      showResult: false,
      resultMessage: null,
      resultType: null,
      isGameOver: newIsDead,
    });
  },

  // === 生成事件 ===
  generateEvent: (): GameEvent | null => {
    const state = get().gameState;
    if (!state) return null;

    const player = state.player;
    const year = state.player.currentYear;
    const age = state.player.age;

    // === 一、先檢查是否需要「選擇歸宿」事件 ===
    // 玩家沒有陣營時，優先顯示「選擇歸宿」事件
    if (!player.faction || player.faction === 'none') {
      const factionEvent = generateFactionChoiceEvent(year, age, player.faction || 'none', player.companions, player.history);
      if (factionEvent) return factionEvent;
    }

    let eraEvents = getFilteredEvents(year, age, player);

    if (eraEvents.length === 0) {
      return generateRandomEvent(player, year, age);
    }

    // === 嚴格年份排序：優先選擇年份最接近且 ≥ 當前年份的事件 ===
    // 歷史事件不能在實際歷史年份之前出現
    eraEvents.sort((a, b) => {
      const aYear = a.year || 0;
      const bYear = b.year || 0;
      // 優先排序：未觸發的歷史事件優先，且年份不能早於當前
      const aEligible = aYear >= year ? 0 : 1;
      const bEligible = bYear >= year ? 0 : 1;
      if (aEligible !== bEligible) return aEligible - bEligible;
      // 年代相近者優先
      const diffA = aYear - year;
      const diffB = bYear - year;
      if (diffA !== diffB) return diffA - diffB;
      return aYear - bYear;
    });

    // 只從符合年份條件的事件中選擇（不能太早觸發，最多提前 1 年）
    const eligibleEvents = eraEvents.filter((e) => {
      const eYear = e.year || 0;
      // 不能太早（最多提前 1 年）
      if (eYear < year - 1) return false;
      // 不能太晚（最多延後 3 年）
      if (eYear > year + 3) return false;
      return true;
    });
    const pool = eligibleEvents.length > 0 ? eligibleEvents : eraEvents;

    // === 避免連續重複 ===
    const lastEventId = state.history.length > 0 ? state.history[state.history.length - 1].id : null;
    let filteredPool = pool;
    if (pool.length > 1 && lastEventId) {
      const others = pool.filter((e) => e.id !== lastEventId);
      filteredPool = others.length > 0 ? others : pool;
    }

    const randomIndex = Math.floor(Math.random() * filteredPool.length);
    const selectedEvent = { ...filteredPool[randomIndex], year };

    // === 追蹤已觸發事件（所有類型）===
    const eventId = selectedEvent.id;
    if (!player.triggeredEvents.includes(eventId)) {
      const updatedPlayer = {
        ...player,
        triggeredHistoricalEvents: selectedEvent.type === 'historical'
          ? [...player.triggeredHistoricalEvents, eventId]
          : player.triggeredHistoricalEvents,
        triggeredEvents: [...player.triggeredEvents, eventId],
      };
      set((s) => ({
        gameState: { ...s.gameState!, player: updatedPlayer },
      }));
    }

    return selectedEvent;
  },

  // === 暫停/繼續 ===
  togglePause: () => {
    const state = get().gameState;
    if (state) {
      set({ gameState: { ...state, isPaused: !state.isPaused } });
    }
  },

  // === 存檔（預設存到第 0 槽） ===
  saveGame: (slotIndex: number = 0): boolean => {
    const state = get().gameState;
    if (!state) return false;
    return saveToSlot(slotIndex, state);
  },

  saveToSlot: (slotIndex: number): boolean => {
    const state = get().gameState;
    if (!state) return false;
    return saveToSlot(slotIndex, state);
  },

  // === 讀檔 ===
  loadSave: (slotIndex: number): SaveData | null => {
    return loadSaveFromSlot(slotIndex);
  },

  loadSaveFromSlot: (slotIndex: number): SaveData | null => {
    return loadSaveFromSlot(slotIndex);
  },

  // === 載入存檔槽位清單 ===
  loadSaveSlots: () => loadSaveSlots(),

  // === 刪除存檔（預設刪第 0 槽） ===
  deleteSave: (slotIndex: number = 0) => {
    deleteSaveSlot(slotIndex);
  },

  // === 從本地存檔初始化遊戲（用於頁面重新載入） ===
  initFromSave: (saveData: SaveData) => {
    if (saveData.gameState) {
      set({
        gameState: saveData.gameState,
        isGameOver: saveData.gameState.isGameOver || false,
        currentEvent: saveData.gameState.currentEvent || null,
        history: saveData.gameState.history || [],
        flags: saveData.gameState.flags || {},
        showResult: false,
        changeLog: null,
        resultMessage: '',
        resultType: 'neutral' as ResultType,
      });
    }
  },

  // === 清除所有存檔 ===
  clearAllSaves: () => {
    for (let i = 0; i < SAVE_SLOT_COUNT; i++) {
      deleteSaveSlot(i);
    }
  },

  // === Flag 系統 ===
  setFlag: (flag: string, value: boolean) => {
    set((state) => ({
      flags: { ...state.flags, [flag]: value },
    }));
  },

  hasFlag: (flag: string): boolean => {
    return get().flags[flag] === true;
  },

  // === 重置遊戲 ===
  resetGame: () => {
    set({
      gameState: null,
      isGameOver: false,
      currentEvent: null,
      history: [],
      turnCount: 0,
      flags: {},
      resultMessage: null,
      resultType: null,
      showResult: false,
      changeLog: null,
    });
    get().clearAllSaves();
  },

  // === 工具函式 ===
  getLifeStageTitle,
}));
