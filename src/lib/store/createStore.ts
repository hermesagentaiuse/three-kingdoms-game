import { create } from 'zustand';
import type { Player, Stats, Background, Gender, Companion } from '@/types/game';
import { ERAS } from '@/types/game';

// ============================================
// 角色創建 Store
// ============================================
interface CreateState {
  name: string;
  gender: Gender;
  background: Background;
  birthYear: number;
  stats: Stats;
  maxPoints: number;
  pointsRemaining: number;
  isReady: boolean;

  // 動作
  setName: (name: string) => void;
  setGender: (gender: Gender) => void;
  setBackground: (background: Background) => void;
  setBirthYear: (year: number) => void;
  allocateStat: (stat: keyof Stats, amount: number) => void;
  resetStats: () => void;
  autoGenerate: () => void;
  validate: () => boolean;
  createPlayer: () => Player | null;
}

const INITIAL_STATS: Stats = { int: 10, str: 10, lck: 10, cha: 10, vit: 10 };
const MAX_POINTS = 50;
const MAX_STAT = 30;
const MIN_STAT = 1;

export const useCreateStore = create<CreateState>((set, get) => ({
  name: '',
  gender: 'male',
  background: 'commoner',
  birthYear: 184,
  stats: { ...INITIAL_STATS },
  maxPoints: 50,
  pointsRemaining: 50,
  isReady: false,

  setName: (name) => {
    set({ name });
  },

  setGender: (gender) => {
    set({ gender });
  },

  setBackground: (background) => {
    set({ background });
  },

  setBirthYear: (year) => {
    set({ birthYear: year });
  },

  allocateStat: (stat, amount) => {
    const { stats, maxPoints, pointsRemaining } = get();
    const current = stats[stat];
    const newValue = current + amount;

    if (newValue < MIN_STAT || newValue > MAX_STAT) return;

    if (amount > 0) {
      // 分配屬性點
      if (pointsRemaining <= 0) return;
      const canAllocate = Math.min(amount, pointsRemaining, MAX_STAT - current);
      if (canAllocate <= 0) return;

      const newStats = { ...stats, [stat]: current + canAllocate };
      set({
        stats: newStats,
        pointsRemaining: pointsRemaining - canAllocate,
      });
    } else {
      // 收回屬性點
      const canReclaim = Math.min(Math.abs(amount), current - MIN_STAT);
      if (canReclaim <= 0) return;

      const newStats = { ...stats, [stat]: current - canReclaim };
      set({
        stats: newStats,
        pointsRemaining: pointsRemaining + canReclaim,
      });
    }
  },

  resetStats: () => {
    set({
      stats: { ...INITIAL_STATS },
      pointsRemaining: MAX_POINTS,
    });
  },

  autoGenerate: () => {
    const newStats: Stats = { int: 0, str: 0, lck: 0, cha: 0, vit: 0 };
    let remaining = 50;

    for (const key of Object.keys(newStats) as (keyof Stats)[]) {
      const value = Math.floor(Math.random() * 11) + 5; // 5-15
      newStats[key] = value;
      remaining -= value;
    }

    // 分配剩餘點數
    const statKeys = Object.keys(newStats) as (keyof Stats)[];
    while (remaining > 0) {
      const key = statKeys[Math.floor(Math.random() * 5)];
      if (newStats[key] < MAX_STAT) {
        newStats[key]++;
        remaining--;
      }
    }

    set({ stats: newStats, pointsRemaining: 0 });
  },

  validate: () => {
    const { name } = get();
    if (!name.trim()) return false;
    return true;
  },

  createPlayer: (): Player | null => {
    if (!get().validate()) return null;

    const { name, gender, background, birthYear, stats } = get();

    // 根據出身給予額外加成
    const bonusStats: Partial<Stats> = {};
    switch (background) {
      case 'scholar':
        bonusStats.int = 3;
        break;
      case 'military':
        bonusStats.str = 3;
        break;
      case 'merchant':
        bonusStats.cha = 2;
        bonusStats.lck = 1;
        break;
      case 'poor':
        bonusStats.vit = 2;
        bonusStats.lck = 1;
        break;
    }

    return {
      name,
      gender,
      background,
      birthYear,
      // 套用出身背景加成（累加而非覆蓋）
    stats: { 
      int: stats.int + (bonusStats.int || 0),
      str: stats.str + (bonusStats.str || 0),
      lck: stats.lck + (bonusStats.lck || 0),
      cha: stats.cha + (bonusStats.cha || 0),
      vit: stats.vit + (bonusStats.vit || 0),
    },
      totalExp: 0,
      level: 1,
      skills: [],
      companions: [],
      relationships: {},
      resources: {
        gold: background === 'merchant' ? 30 : background === 'scholar' ? 20 : 10,
        reputation: background === 'scholar' ? 10 : 0,
        intelligence: 0,
        items: [],
      },
      history: [],
      achievements: [],
      isAlive: true,
      currentEra: 'huangjin',
      currentYear: birthYear,
      age: 0,
      // 蝴蝶效應追蹤
      butterflyHistory: [],
      butterflySummary: {},
      // 死亡評價統計
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
      // 已觸發的歷史事件 ID 追蹤
      triggeredHistoricalEvents: [],
      // 已觸發的所有事件 ID 追蹤（防止隨機事件重複）
      triggeredEvents: [],
      // 所屬陣營
      faction: 'none',
      // Flag 系統
      flags: {},
    };
  },
}));
