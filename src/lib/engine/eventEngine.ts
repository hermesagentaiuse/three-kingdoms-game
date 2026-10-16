import type { GameEvent, Stats, EventType } from '@/types/game';

// ============================================
// 骰子系統
// ============================================
export type DiceType = 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20';

export interface DiceResult {
  type: DiceType;
  values: number[];
  total: number;
  isCrit?: boolean;
  isFumble?: boolean;
}

export const DICE_FACES: Record<DiceType, number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
};

/**
 * 擲骰子
 * @param type 骰子類型
 * @param count 骰子數量
 * @param bonus 加值
 */
export function rollDice(
  type: DiceType = 'd6',
  count: number = 1,
  bonus: number = 0
): DiceResult {
  const values: number[] = [];
  const faces = DICE_FACES[type];

  for (let i = 0; i < count; i++) {
    values.push(Math.floor(Math.random() * faces) + 1);
  }

  const total = values.reduce((sum, v) => sum + v, 0) + bonus;
  const isCrit = values.every((v) => v === faces);
  const isFumble = values.every((v) => v === 1);

  return { type, values, total, isCrit, isFumble };
}

/**
 * 判定檢定
 * @param stat 屬性
 * @param difficulty 難度
 * @param diceType 骰子類型
 * @param bonus 加值
 */
export function checkStat(
   stat: keyof Stats,
   stats: Stats,
   difficulty: number,
   bonus: number = 0,
   age: number = 18,
   diceType: DiceType = 'd20'
 ): { success: boolean; result: DiceResult; margin: number } {
   let effectiveDifficulty = difficulty;

   // === 年齡合理性檢查：過年輕執行武裝行動難度增加 ===
   // 13歲以下：+5難度（兒童不宜參戰）
   // 14-15歲：+3難度（少年危險）
   // 16-17歲：+1難度（青年尚稚嫩）
   if (age < 13) {
     effectiveDifficulty += 5;
   } else if (age < 16) {
     effectiveDifficulty += 3;
   } else if (age < 18) {
     effectiveDifficulty += 1;
   }

   // 35歲以上：+1難度（中年體能下降）
   if (age > 35) effectiveDifficulty += 1;
   // 50歲以上：+3難度（老年體弱）
   if (age > 50) effectiveDifficulty += 2;
   // 60歲以上：+5難度（暮年力衰）
   if (age > 60) effectiveDifficulty += 2;

   const statValue = stats[stat] + bonus;
   const result = rollDice(diceType, 1, statValue);
   const success = result.total >= effectiveDifficulty;
   const margin = result.total - effectiveDifficulty;

   return { success, result, margin };
 }

/**
 * 根據屬性計算檢定難度
 */
export function getDifficulty(stat: keyof Stats, stats: Stats): number {
  const base = 10;
  const statValue = stats[stat];

  // 屬性越高，越容易通過
  if (statValue >= 25) return base - 5;
  if (statValue >= 20) return base - 3;
  if (statValue >= 15) return base - 1;
  if (statValue <= 5) return base + 5;
  if (statValue <= 8) return base + 3;
  if (statValue <= 10) return base + 1;

  return base;
}

// ============================================
// 事件引擎
// ============================================

/**
 * 生成事件選擇效果
 */
export function applyEventEffects(
  stats: Stats,
  effects: Record<string, number | boolean | string>
): Stats {
  const newStats = { ...stats };

  if (effects.int) newStats.int += Number(effects.int);
  if (effects.str) newStats.str += Number(effects.str);
  if (effects.lck) newStats.lck += Number(effects.lck);
  if (effects.cha) newStats.cha += Number(effects.cha);
  if (effects.vit) newStats.vit += Number(effects.vit);

  // 確保屬性不低於最小值
  for (const key of Object.keys(newStats) as (keyof Stats)[]) {
    newStats[key] = Math.max(1, newStats[key]);
  }

  return newStats;
}

/**
 * 檢查事件需求
 */
export function checkEventRequirements(
  requirements: GameEvent['requirements'],
  stats: Stats,
  year: number,
  flags: Record<string, boolean>
): boolean {
  if (!requirements) return true;

  if (requirements.minInt && stats.int < requirements.minInt) return false;
  if (requirements.minStr && stats.str < requirements.minStr) return false;
  if (requirements.minLck && stats.lck < requirements.minLck) return false;
  if (requirements.minCha && stats.cha < requirements.minCha) return false;
  if (requirements.minVit && stats.vit < requirements.minVit) return false;
  if (requirements.era) return true; // 時代需求在外部處理

  return true;
}

/**
 * 根據機率選擇事件
 */
export function weightedRandomEvent(events: GameEvent[], stats: Stats): GameEvent {
  if (events.length === 0) {
    throw new Error('No events available');
  }

  // 每個事件有基本權重，根據玩家屬性調整
  const weightedEvents = events.map((event) => {
    let weight = event.priority || 1;

    // 根據玩家屬性調整權重
    if (event.type === 'scholarly' && stats.int > 15) weight *= 1.5;
    if (event.type === 'combat' && stats.str > 15) weight *= 1.5;
    if (event.type === 'diplomatic' && stats.cha > 15) weight *= 1.5;
    if (event.type === 'hidden' && stats.lck > 15) weight *= 2;

    return { event, weight };
  });

  const totalWeight = weightedEvents.reduce((sum, e) => sum + e.weight, 0);
  let random = Math.random() * totalWeight;

  for (const { event, weight } of weightedEvents) {
    random -= weight;
    if (random <= 0) return event;
  }

  return weightedEvents[weightedEvents.length - 1].event;
}

/**
 * 生成隨機事件文本
 */
export function generateRandomEventText(
  stats: Stats,
  year: number,
  age: number
): GameEvent {
  const events = generateRandomEvents(stats, year, age);
  if (events.length === 0) {
    return {
      id: 'random_empty',
      title: '平靜的一年',
      description: '這一年風平浪靜，你決定好好休息。',
      era: 'unknown',
      year,
      type: 'random',
      choices: [
        {
          text: '安心休息',
          effects: { stats: { vit: 1 } },
        },
      ],
    };
  }

  return weightedRandomEvent(events, stats);
}

/**
 * 生成隨機事件列表
 */
function generateRandomEvents(stats: Stats, year: number, age: number): GameEvent[] {
  const events: GameEvent[] = [];

  // 根據年齡生成不同事件
  if (age < 10) {
    events.push(
      {
        id: 'child_study',
        title: '启蒙',
        description: '你開始學習讀書識字。',
        era: 'unknown',
        year,
        type: 'scholarly',
        choices: [
          { text: '努力讀書', effects: { stats: { int: 2 }, exp: 10 } },
          { text: '貪玩不學', effects: { stats: { str: 1, lck: 1 } } },
        ],
      },
      {
        id: 'child_play',
        title: '嬉戲',
        description: '你和村裡的孩子們一起玩耍。',
        era: 'unknown',
        year,
        type: 'random',
        choices: [
          { text: '和夥伴們玩耍', effects: { stats: { cha: 1, vit: 1 } } },
          { text: '獨自探索', effects: { stats: { lck: 1, int: 1 } } },
        ],
      }
    );
  } else if (age < 16) {
    events.push(
      {
        id: 'youth_train',
        title: '練武',
        description: '你開始學習武藝。',
        era: 'unknown',
        year,
        type: 'combat',
        choices: [
          { text: '勤練武藝', effects: { stats: { str: 3, vit: 1 } } },
          { text: '研讀兵書', effects: { stats: { int: 2, cha: 1 } } },
        ],
      },
      {
        id: 'youth_learn',
        title: '求學',
        description: '你拜師學習學問。',
        era: 'unknown',
        year,
        type: 'scholarly',
        choices: [
          { text: '刻苦研讀', effects: { stats: { int: 3 } } },
          { text: '廣結善緣', effects: { stats: { cha: 2, lck: 1 } } },
        ],
      }
    );
  } else {
    events.push(
      {
        id: 'adult_career',
        title: '出仕',
        description: '你考慮進入仕途。',
        era: 'unknown',
        year,
        type: 'choice',
        choices: [
          { text: '投效明主', effects: { stats: { cha: 2 }, reputation: 5 } },
          { text: '隱居鄉里', effects: { stats: { lck: 2, vit: 1 } } },
          { text: '經商致富', effects: { stats: { lck: 1 }, gold: 20 } },
        ],
      },
      {
        id: 'adult_battle',
        title: '從軍',
        description: '戰火蔓延，你決定投身軍中。',
        era: 'unknown',
        year,
        type: 'combat',
        choices: [
          { text: '衝鋒陷陣', effects: { stats: { str: 2, lck: -1 }, exp: 20 } },
          { text: '出謀劃策', effects: { stats: { int: 2 }, exp: 15 } },
          { text: '明哲保身', effects: { stats: { lck: 2 } } },
        ],
      }
    );
  }

  return events;
}
