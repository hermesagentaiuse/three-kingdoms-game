// ============================================
// Event Slice — 事件系統（生成、篩選、選擇）
// ============================================
import type { Player, GameEvent, GameState, Stats, Background } from '@/types/game';
import { ERAS } from '@/types/game';
import { ALL_EVENTS, RANDOM_EVENTS } from '@/lib/data/events';
import { rollDice } from '@/lib/engine/eventEngine';
import { HISTORICAL_PEOPLE, generateRecruitmentEvent, type HistoricalPerson } from '@/lib/data/historicalFigures';
import {
  clampStat,
  applyStatChange,
  getCompanionBonus,
  applyEffectsToPlayer,
  checkSkillUnlock,
  MIN_STAT,
  MAX_STAT,
} from './playerSlice';

// ============================================
// 死亡判定系統（強化版 — 選擇關聯）
// ============================================
export type DeathCategory =
  | 'combat'
  | 'illness'
  | 'starvation'
  | 'assassination'
  | 'murder'
  | 'poisoning'
  | 'accident'
  | 'natural'
  | 'infant'
  | 'choice_linked'
  | 'suicide'
  | 'disaster'
  | 'exhaustion'
  | 'accident_child'
  | 'unknown';

export interface DeathInfo {
  isDead: boolean;
  deathReason: string;
  deathCategory: DeathCategory;
}

// 基礎死亡訊息（無特定選擇時使用）
import { DEATH_MESSAGES, CHOICE_DEATHS } from '@/lib/data/deathMessages';

const CHOICE_MAP: Record<string, string[]> = {
  // 醫療相關
  took_medicine: ['took_dangerous_medicine', 'took_dangerous_medicine', 'took_dangerous_medicine', 'refused_medicine'],
  took_dangerous_herb: ['took_dangerous_medicine', 'took_dangerous_medicine'],
  refused_treatment: ['refused_medicine'],
  neglected_health: ['neglected_health'],
  drank_heavily: ['drank_alcohol_heavily'],
  ate_bad_food: ['ate_contaminated_food'],

  // 武術相關
  trained_martial: ['trained_martial_arts', 'trained_martial_arts', 'trained_martial_arts', 'practiced_horsemanship'],
  practiced_horsemanship: ['practiced_horsemanship', 'practiced_horsemanship'],
  competed_in_martial: ['participated_competition'],
  hunted_alone: ['went_hunting_alone'],
  skipped_training: ['ignored_safety_training'],

  // 財富相關
  hoarded_wealth: ['hoarded_gold', 'hoarded_gold'],
  spent_all: ['spent_all_gold', 'gambled_away'],
  gambled: ['spent_all_gold', 'gambled_away', 'gambled_away'],
  risky_trading: ['invested_in_risky_trading'],
  ignored_savings: ['ignored_saving'],

  // 社交相關
  trusted_strangers: ['trusted_strangers'],
  betrayed_others: ['betrayed_trust'],
  interfered_politics: ['interfered_in_politics'],
  offended_powerful: ['offended_powerful_people'],
  refused_recruitment: ['refused_official_recruitment'],
  joined_rebellion: ['joined_rebellion'],

  // 學習相關
  studied_medicine: ['studied_medicine'],
  collected_antiques: ['studied_artifact_collecting'],
  read_forbidden: ['read_forbidden_books'],
  studied_secret_martial: ['studied_martial_secret'],

  // 冒險相關
  explored_ruins: ['explored_ancient_reins'],
  explored_forest: ['explored_forbidden_forest'],
  crossed_warzone: ['crossed_war_zone'],
  reckless_behavior: ['was_reckless'],
  traveled_dangerous: ['traveled_to_dangerous_places'],

  // 情感相關
  romantic_affair: ['had_romantic_affair'],
  abandoned_family: ['abandoned_family'],
  late_child: ['had_child_too_late'],

  // 性格
  arrogant: ['was_arrogant'],
  drunk_fell: ['drunk_and_fell'],

  // 特殊
  fire_danger: ['fire_breakout'],
  flood_danger: ['flood_drowning'],
  earthquake_danger: ['earthquake'],
  despair: ['suicide_despair'],
};

/**
 * 根據玩家選擇歷史生成具體死因
 * 優先使用 choice-linked 死因，找不到時fallback到基礎死因
 */
function generateContextualDeath(deathCategory: DeathCategory, player: Player): string {
  const tags = new Set<string>();
  const choices = player.keyChoiceHistory || [];
  for (const choice of choices) {
    if (choice.tag) tags.add(choice.tag.toLowerCase());
  }

  // 檢查每個標籤對應的死亡選項
  for (const [key, deathOptions] of Object.entries(CHOICE_MAP)) {
    if (tags.has(key)) {
      const relevantDeaths = CHOICE_DEATHS[key];
      if (relevantDeaths && relevantDeaths.length > 0) {
        return relevantDeaths[Math.floor(Math.random() * relevantDeaths.length)];
      }
    }
  }

  // 沒有匹配的choice-linked死因 → 使用基礎死因
  const baseMessages = DEATH_MESSAGES[deathCategory];
  if (baseMessages && baseMessages.length > 0) {
    return baseMessages[Math.floor(Math.random() * baseMessages.length)];
  }

  return '無故離世，死因不明。';
}

function generateDeathResult(isDead: boolean, category: DeathCategory, player: Player): DeathInfo {
  if (!isDead) return { isDead: false, deathReason: '', deathCategory: 'unknown' };
  return {
    isDead: true,
    deathReason: generateContextualDeath(category, player),
    deathCategory: category,
  };
}

export function checkDeath(player: Player): DeathInfo {
  const background = player.background || 'commoner';
  const stats = player.stats;
  const age = player.age;
  const vit = stats.vit;
  const lck = stats.lck;
  const cha = stats.cha;
  const str = stats.str;
  const int_ = stats.int;

  // === 體力歸零 → 死亡 ===
  if (vit <= 1) {
    return generateDeathResult(true, 'combat', player);
  }

  // === 嬰兒死亡率 (0歲) — 降低為 3% ===
  if (age < 1) {
    let infantDeathChance = 0.03;
    if (background === 'scholar') infantDeathChance *= 0.7;
    if (background === 'merchant') infantDeathChance *= 0.75;
    if (background === 'poor') infantDeathChance *= 1.2;
    if (background === 'military') infantDeathChance *= 1.1;
    if (Math.random() < infantDeathChance) {
      return generateDeathResult(true, 'infant', player);
    }
    return { isDead: false, deathReason: '', deathCategory: 'unknown' };
  }

  // === 幼年死亡率 (<5歲) — 每次選擇 0.5%，不檢查其他死亡類型 ===
  if (age < 5) {
    let childDeathChance = 0.005;
    if (background === 'scholar') childDeathChance *= 0.6;
    if (background === 'merchant') childDeathChance *= 0.7;
    if (background === 'poor') childDeathChance *= 1.2;
    if (Math.random() < childDeathChance) {
      return generateDeathResult(true, 'accident_child', player);
    }
    return { isDead: false, deathReason: '', deathCategory: 'unknown' };
  }

  // === 自然死亡 ===
  if (age >= 75 && Math.random() < 0.40) {
    return generateDeathResult(true, 'natural', player);
  }
  if (age >= 65 && Math.random() < 0.20) {
    return generateDeathResult(true, 'natural', player);
  }
  if (age >= 55 && vit <= 5 && Math.random() < 0.10) {
    return generateDeathResult(true, 'natural', player);
  }

  const vitMultiplier = vit >= 20 ? 0.5 : vit >= 15 ? 0.7 : vit >= 10 ? 1.0 : 1.4;
  const childSafety = age < 10 ? 0.5 : age < 15 ? 0.7 : 1.0;

  // === 病逝 ===
  let illnessChance = 0.002 * (75 - age) * vitMultiplier * childSafety;
  if (int_ < 5) illnessChance *= 1.5;
  if (background === 'poor') illnessChance *= 1.5;
  if (age > 40) illnessChance *= (age - 40) / 30;
  if (age > 55) illnessChance *= 1.5;
  if (Math.random() < illnessChance) {
    return generateDeathResult(true, 'illness', player);
  }

  // === 過勞而死 (30歲以上) ===
  if (age >= 30) {
    let exhaustionChance = 0.001 * vitMultiplier;
    if (background === 'scholar') exhaustionChance *= 3.0;
    if (int_ >= 20 && age > 40) exhaustionChance *= 1.5;
    if (vit <= 5) exhaustionChance *= 2.0;
    if (Math.random() < exhaustionChance) {
      return generateDeathResult(true, 'exhaustion', player);
    }
  }

  // === 戰死 (15-55歲) ===
  if (age >= 15 && age <= 55) {
    let combatChance = 0.001 * vitMultiplier;
    if (str >= 20) combatChance *= 1.5;
    if (str >= 25) combatChance *= 1.3;
    if (background === 'military') combatChance *= 2.5;
    if (player.faction !== 'none') combatChance *= 1.5;
    if (player.companions.length > 0) combatChance *= 1.2;
    if (Math.random() < combatChance) {
      return generateDeathResult(true, 'combat', player);
    }
  }

  // === 暗殺 (18歲以上) ===
  if (age >= 18 && cha >= 18) {
    let assassinationChance = 0.001 * (cha - 15) * 0.5;
    if (cha >= 25) assassinationChance *= 2.0;
    if (cha >= 28) assassinationChance *= 1.5;
    if (player.faction !== 'none') assassinationChance *= 1.5;
    if (lck < 5) assassinationChance *= 2.0;
    if (lck >= 25) assassinationChance *= 0.3;
    if (Math.random() < assassinationChance) {
      return generateDeathResult(true, 'assassination', player);
    }
  }

  // === 謀殺 (20歲以上) ===
  if (age >= 20) {
    let murderChance = 0.0005;
    if (player.resources.reputation >= 30) murderChance *= 1.5;
    if (player.faction !== 'none') murderChance *= 1.3;
    if (player.companions.length > 0) murderChance *= 1.2;
    if (Math.random() < murderChance) {
      return generateDeathResult(true, 'murder', player);
    }
  }

  // === 毒殺 (15歲以上) ===
  if (age >= 15) {
    let poisonChance = 0.0005 * vitMultiplier;
    if (cha >= 20) poisonChance *= 1.3;
    if (lck < 5) poisonChance *= 2.0;
    if (Math.random() < poisonChance) {
      return generateDeathResult(true, 'poisoning', player);
    }
  }

  // === 商人綁票/搶劫 (15歲以上) ===
  if (background === 'merchant' && age >= 15) {
    let merchantDeathChance = 0.003 * vitMultiplier;
    if (player.resources.gold > 200) merchantDeathChance *= 2.0;
    if (player.resources.gold > 500) merchantDeathChance *= 1.5;
    if (lck < 5) merchantDeathChance *= 2.0;
    if (Math.random() < merchantDeathChance) {
      return generateDeathResult(true, 'murder', player);
    }
  }

  // === 餓死 (10歲以上) ===
  if (age >= 10) {
    let starvationChance = 0.0005 * vitMultiplier;
    if (player.resources.gold <= 0 && background !== 'scholar') starvationChance *= 3.0;
    if (background === 'poor') starvationChance *= 2.0;
    if (lck < 5) starvationChance *= 2.0;
    if (Math.random() < starvationChance) {
      return generateDeathResult(true, 'starvation', player);
    }
  }

  // === 意外死亡 (10歲以上) ===
  if (age >= 10) {
    const accidentChance = lck < 5 ? 0.04 : lck < 10 ? 0.02 : 0.01;
    if (Math.random() < accidentChance) {
      return generateDeathResult(true, 'accident', player);
    }
  }

  return { isDead: false, deathReason: '', deathCategory: 'unknown' };
}

// ============================================
// 人生階段工具函式
// ============================================
export type LifeStage =
  | 'infant'
  | 'child'
  | 'preteen'
  | 'teen'
  | 'young_adult'
  | 'early_adult'
  | 'middle'
  | 'elder';

export function getLifeStage(age: number): LifeStage {
  if (age <= 3) return 'infant';
  if (age <= 7) return 'child';
  if (age <= 12) return 'preteen';
  if (age <= 18) return 'teen';
  if (age <= 25) return 'young_adult';
  if (age <= 35) return 'early_adult';
  if (age <= 50) return 'middle';
  return 'elder';
}

export function getLifeStageTitle(stage: string): string {
  const titles: Record<string, string> = {
    infant: '嬰兒期',
    child: '童年',
    preteen: '少年',
    teen: '青少年',
    young_adult: '青年',
    early_adult: '壯年',
    middle: '中年',
    elder: '老年',
  };
  return titles[stage] || '未知';
}

// ============================================
// 陣營專屬事件池（投效後觸發）
// ============================================
const FACTION_EVENT_POOL: Record<string, GameEvent[]> = {
  wei: [
    {
      id: 'wei_cao_cao_recruit',
      title: '曹丞相徵召',
      description: '曹操發布招募令，尋求天下英才。他聞名你勇武有謀，邀請你加入他的麾下。',
      era: 'any',
      year: 190,
      type: 'faction',
      minAge: 16,
      maxAge: 40,
      choices: [
        { text: '欣然接受，入主許昌', effects: { stats: { int: 2, cha: 1 }, reputation: 5, flag: 'served_cao_cao' } },
        { text: '先觀望，再決定', effects: { stats: { lck: 1 }, reputation: 2 } },
      ],
    },
    {
      id: 'wei_guanzhong_campaign',
      title: '關中征戰',
      description: '曹操派你參與關中戰役，對抗馬騰、韓遂。',
      era: 'any',
      year: 200,
      type: 'faction',
      minAge: 18,
      maxAge: 50,
      choices: [
        { text: '率領前鋒突擊', effects: { stats: { str: 3, vit: -1 }, reputation: 8 }, difficulty: 15, statCheck: 'str' },
        { text: '採取圍攻策略', effects: { stats: { int: 2 }, reputation: 5 }, difficulty: 13, statCheck: 'int' },
        { text: '建議聯和', effects: { stats: { cha: 2 }, reputation: 3 }, difficulty: 12, statCheck: 'cha' },
      ],
    },
    {
      id: 'wei_xu_hu_policy',
      title: '屯田政策',
      description: '曹操推行屯田制，需要有能力的人來管理。這是一個穩定聲望的好機會。',
      era: 'any',
      year: 196,
      type: 'faction',
      minAge: 20,
      maxAge: 55,
      choices: [
        { text: '積極推行屯田', effects: { gold: 20, reputation: 5, flag: 'implemented_tuntian' } },
        { text: '建議改良農具', effects: { gold: 10, stats: { int: 2 }, reputation: 3 } },
      ],
    },
  ],
  shu: [
    {
      id: 'shu_liu_bei_recruit',
      title: '劉皇叔邀請',
      description: '劉備以仁義聞名，他親自來訪，邀請你共圖大業。',
      era: 'any',
      year: 195,
      type: 'faction',
      minAge: 16,
      maxAge: 40,
      choices: [
        { text: '誓死跟隨主公', effects: { reputation: 10, flag: 'sworn_to_liu_bei', stats: { cha: 3 } } },
        { text: '考慮再說', effects: { stats: { int: 1 } }, difficulty: 10, statCheck: 'int' },
      ],
    },
    {
      id: 'shu_yizhou_conquest',
      title: '益州征戰',
      description: '劉備準備征伐益州，需要你出謀劃策或領兵作戰。',
      era: 'any',
      year: 211,
      type: 'faction',
      minAge: 20,
      maxAge: 50,
      choices: [
        { text: '願為先鋒', effects: { stats: { str: 2, vit: 1 }, reputation: 8 }, difficulty: 16, statCheck: 'str' },
        { text: '獻上妙計', effects: { stats: { int: 3 }, reputation: 6 }, difficulty: 14, statCheck: 'int' },
        { text: '留守後方', effects: { gold: 5, reputation: 2, stats: { vit: 2 } } },
      ],
    },
    {
      id: 'shu_shu_han_deng',
      title: '蜀漢稱帝',
      description: '劉備準備稱帝，需要大臣們的支持。',
      era: 'any',
      year: 221,
      type: 'faction',
      minAge: 25,
      maxAge: 60,
      choices: [
        { text: '上書勸進', effects: { reputation: 15, flag: 'supported_dengji', stats: { cha: 3 } } },
        { text: '委婉勸阻', effects: { reputation: 5, stats: { int: 2 } } },
      ],
    },
  ],
  wu: [
    {
      id: 'wu_sun_ce_recruit',
      title: '小霸王招募',
      description: '孫策以其勇猛聞名，他需要你這樣的猛將一同打江山。',
      era: 'any',
      year: 195,
      type: 'faction',
      minAge: 16,
      maxAge: 35,
      choices: [
        { text: '隨孫策征戰', effects: { stats: { str: 2, vit: 1 }, reputation: 8, flag: 'served_sun_ce' } },
        { text: '推薦給周瑜', effects: { stats: { cha: 2 }, reputation: 5 } },
      ],
    },
    {
      id: 'wu_chibi_battle',
      title: '赤壁之戰',
      description: '曹操大軍壓境，孫劉聯軍即將決戰。',
      era: 'any',
      year: 208,
      type: 'faction',
      minAge: 18,
      maxAge: 45,
      choices: [
        { text: '率軍迎戰', effects: { stats: { str: 3, vit: -1 }, reputation: 15 }, difficulty: 18, statCheck: 'str' },
        { text: '火攻計策', effects: { stats: { int: 3 }, reputation: 12 }, difficulty: 16, statCheck: 'int' },
        { text: '防守待變', effects: { stats: { vit: 2 }, reputation: 5 } },
      ],
    },
    {
      id: 'wu_jingzhou_dispute',
      title: '荊州之爭',
      description: '劉備借荊州不還，孫權決定出兵。',
      era: 'any',
      year: 219,
      type: 'faction',
      minAge: 20,
      maxAge: 50,
      choices: [
        { text: '全力攻取', effects: { stats: { str: 2, int: 1 }, reputation: 10 } },
        { text: '外交交涉', effects: { stats: { cha: 3 }, reputation: 5 }, difficulty: 15, statCheck: 'cha' },
      ],
    },
  ],
  independent: [
    {
      id: 'ind_pirate_coast',
      title: '沿海據點',
      description: '你選擇在沿海建立自己的勢力，訓練水軍、發展貿易。',
      era: 'any',
      year: 190,
      type: 'faction',
      minAge: 20,
      maxAge: 50,
      choices: [
        { text: '發展海上貿易', effects: { gold: 30, stats: { lck: 2 } }, difficulty: 12, statCheck: 'lck' },
        { text: '訓練水軍', effects: { stats: { str: 2, vit: 2 }, reputation: 5 } },
      ],
    },
    {
      id: 'ind_mountain_fortress',
      title: '山中築寨',
      description: '你在深山建造堡壘，招募流民，建立自己的領地。',
      era: 'any',
      year: 190,
      type: 'faction',
      minAge: 20,
      maxAge: 55,
      choices: [
        { text: '擴建堡壘', effects: { gold: -10, stats: { vit: 3 }, reputation: 5 } },
        { text: '招兵買馬', effects: { stats: { str: 2, lck: 1 }, reputation: 3 }, difficulty: 14, statCheck: 'str' },
      ],
    },
  ],
};

// ============================================
// 事件篩選
// ============================================
export function getFilteredEvents(year: number, age: number, player: Player): GameEvent[] {
  const events: GameEvent[] = [];
  const stage = getLifeStage(age);
  const triggeredEvents = player.triggeredHistoricalEvents || [];
  const playerFaction = player.faction || 'none';

  // === 陣營專屬事件（優先於歷史事件）===
  if (playerFaction !== 'none' && FACTION_EVENT_POOL[playerFaction]) {
    for (const event of FACTION_EVENT_POOL[playerFaction]) {
      // === 防重複 ===
      if ((player.triggeredEvents || []).includes(event.id)) continue;

      // === 時代檢查 ===
      if (event.era !== 'any' && event.era !== 'unknown') {
        const currentEra = getEraById(year);
        if (!currentEra || event.era !== currentEra?.id) continue;
        if (event.year !== undefined) {
          if (!(year >= event.year - 2 && year <= event.year + 2)) continue;
        }
      } else if (event.era === 'any' && event.year !== undefined) {
        if (!(year >= event.year - 3 && year <= event.year + 3)) continue;
      }

      // 年齡檢查
      if (event.minAge !== undefined && age < event.minAge) continue;
      if (event.maxAge !== undefined && age > event.maxAge) continue;

      events.push(event);
    }
  }

  for (const event of ALL_EVENTS) {
    // === 歷史事件防重複 ===
    if (event.type === 'historical' && triggeredEvents.includes(event.id)) {
      continue;
    }

    // === 時代檢查（嚴格年份範圍）===
    // 有明確年代的事件：必須同時滿足時代正確 且 年份在 ±2 年內
    if (event.era !== 'any' && event.era !== 'unknown') {
      const currentEra = getEraById(year);
      // 必須時代正確 且 年份在 ±2 年內（AND 而非 OR）
      if (!currentEra || event.era !== currentEra?.id) {
        continue;
      }
      if (event.year !== undefined) {
        if (!(year >= event.year - 2 && year <= event.year + 2)) {
          continue;
        }
      }
    }
    // 通用事件（era='any'）：當前年份必須在事件年份 ±3 年內
    else if (event.era === 'any' && event.year !== undefined) {
      if (!(year >= event.year - 3 && year <= event.year + 3)) {
        continue;
      }
    }

    // === 陣營檢查 ===
    if (event.requirements?.factionRequired) {
      const reqFactions = event.requirements.factionRequired;
      if (!reqFactions.includes(playerFaction)) {
        continue;
      }
    }

    // 年齡檢查
    if (event.minAge !== undefined && age < event.minAge) continue;
    if (event.maxAge !== undefined && age > event.maxAge) continue;

    // 人生階段檢查
    if (event.stage && event.stage !== stage) continue;

    events.push(event);
  }

  // === 動態生成歷史人物招募事件（僅在青年期及以上才出現）===
  if (age >= 18) {
    for (const person of HISTORICAL_PEOPLE) {
      // 檢查是否已招募此人
      const hasCompanion = player.companions.some((c) => c.id === person.id);
      if (hasCompanion) continue;

      // 檢查是否已錯過此人的相遇
      const hasMetFlag = player.flags[`met_${person.id}`] === true;
      const hasMetHistory = player.history.some(
        (h) => h.eventId === `recruit_${person.id}_${person.joinYear}`
      );
      if (hasMetFlag || hasMetHistory) continue;

      // 檢查相遇條件
      const result = generateRecruitmentEvent(person, year, playerFaction, (flag) => player.flags[flag] === true);
      if (result.available && result.event) {
        // 加入年份彈性範圍（±1年）
        const eventYear = person.joinYear;
        if (year >= eventYear - 1 && year <= eventYear + 3) {
          events.push(result.event);
        }
      }
    }
  }

  return events;
}

function getEraById(year: number) {
  for (const era of ERAS) {
    if (year >= era.startYear && year <= era.endYear) return era;
  }
  return null;
}

// ============================================
// 效果套用（整合伙伴加成、物品、flag系統）
// ============================================
export function applyChoiceEffects(
  player: Player,
  choice: {
    effects?: Record<string, unknown>;
    successEffects?: Record<string, unknown>;
    failureEffects?: Record<string, unknown>;
    statCheck?: keyof Stats;
    difficulty?: number;
    text: string;
    description?: string;
    successText?: string;
    failureText?: string;
  },
  isStatCheck: boolean = false
): {
  player: Player;
  resultMsg: string;
  resultType: 'success' | 'failure' | 'partial' | 'neutral';
  changeLog: string[];
  deathCheck: DeathInfo;
  newSkills: string[];
  unlockedSkills: string[];
  flagApplied?: Record<string, boolean>;
} {
  const oldStats = { ...player.stats };
  let newPlayer = { ...player };
  const changeLog: string[] = [];
  const statNames: Record<string, string> = { int: '智力', str: '武力', lck: '運氣', cha: '魅力', vit: '體力' };

  let success = true;
  let resultType: 'success' | 'failure' | 'partial' | 'neutral' = 'success';
  let resultMsg = '';
  let effects: Record<string, unknown> = { ...(choice.effects || {}) };

  // === 檢定系統 ===
  if (isStatCheck && choice.statCheck && choice.difficulty !== undefined) {
    const statKey = choice.statCheck as keyof Stats;
    const statValue = newPlayer.stats[statKey] || 0;

    // === 同伴加成 ===
    const companionBonus = getCompanionBonus(newPlayer);
    const effectiveStatValue = statValue + companionBonus;

    // === 年齡合理性修正 ===
    const age = newPlayer.age;
    let effectiveDifficulty = choice.difficulty;
    if (age < 13) effectiveDifficulty += 5;
    else if (age < 16) effectiveDifficulty += 3;
    else if (age < 18) effectiveDifficulty += 1;
    else if (age > 35) effectiveDifficulty += 1;
    else if (age > 50) effectiveDifficulty += 2;
    else if (age > 60) effectiveDifficulty += 2;

    const diceResult = rollDice('d20', 1, effectiveStatValue);

    if (diceResult.total >= effectiveDifficulty) {
      success = true;
      resultMsg = choice.successText || `【${effectiveStatValue} ${String(statKey)}】檢定通過！(${diceResult.total}/${effectiveDifficulty}) — ${choice.text}`;
      resultType = diceResult.total >= effectiveDifficulty + 10 ? 'success' : 'partial';

      if (choice.successEffects) {
        effects = { ...effects, ...choice.successEffects };
      }
    } else {
      success = false;
      resultMsg = choice.failureText || `【${statValue} ${String(statKey)}】檢定失敗！(${diceResult.total}/${effectiveDifficulty}) — 你未能成功。`;
      resultType = 'failure';

      if (choice.failureEffects) {
        const failurePenalty: Partial<Stats> = { vit: -1, lck: -1 };
        const failureEffectsRecord = choice.failureEffects as Record<string, unknown>;
        effects = {
          ...failureEffectsRecord,
          stats: { ...(failureEffectsRecord.stats as Partial<Stats> || {}), ...failurePenalty },
        };
      } else {
        const reducedEffects: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(choice.effects || {})) {
          if (key === 'stats' && typeof value === 'object' && value !== null) {
            reducedEffects[key] = {};
            for (const [sKey, sVal] of Object.entries(value as Record<string, number>)) {
              (reducedEffects[key] as Record<string, number>)[sKey] = Math.floor(sVal * 0.05);
            }
          } else if (typeof value === 'number') {
            reducedEffects[key] = Math.floor(value * 0.05);
          } else if (typeof value === 'object' && value !== null) {
            reducedEffects[key] = value;
          }
        }
        const baseEffects = choice.effects || {};
        effects = {
          ...reducedEffects,
          gold: ((reducedEffects.gold as number) || 0) - Math.floor(((baseEffects.gold as number) || 0) * 0.15),
          reputation: ((reducedEffects.reputation as number) || 0) - 5,
          stats: {
            ...(reducedEffects.stats ? (reducedEffects.stats as Record<string, number>) : {}),
            vit: -2,
            lck: -1,
          },
        };
      }
    }
  } else {
    resultMsg = `${choice.text} — ${choice.description || '你做出了選擇。'}`;
  }

  // 套用效果（含物品、夥伴加成、flag）
  const { player: updatedPlayer, changeLog: effectLog } = applyEffectsToPlayer(newPlayer, effects as Record<string, unknown>);
  newPlayer = updatedPlayer;
  changeLog.push(...effectLog);

  // === 設定 flag ===
  let flagApplied: Record<string, boolean> | undefined;
  if (effects.flag) {
    flagApplied = { [effects.flag as string]: true };
  }
  if (effects.flags && typeof effects.flags === 'object') {
    flagApplied = { ...flagApplied, ...effects.flags };
  }

  // === 檢查技能解鎖 ===
  const unlockedSkills = checkSkillUnlock(newPlayer);

  // === 更新成就統計 ===
  newPlayer.totalChoices = (newPlayer.totalChoices || 0) + 1;
  if (resultType === 'success' || resultType === 'partial') {
    newPlayer.totalVictories = (newPlayer.totalVictories || 0) + 1;
  } else if (resultType === 'failure') {
    newPlayer.totalDefeats = (newPlayer.totalDefeats || 0) + 1;
  }

  // 更新聲望/財富峰值
  newPlayer.maxReputation = Math.max(newPlayer.maxReputation || 0, newPlayer.resources.reputation);
  newPlayer.maxGold = Math.max(newPlayer.maxGold || 0, newPlayer.resources.gold);

  // 更新生命階段事件追蹤
  newPlayer.lifeStageEvents = [...(newPlayer.lifeStageEvents || []), choice.text.slice(0, 50)];

  // === 追蹤關鍵選擇（用於生成關聯死因） ===
  const keyTags: string[] = [];
  // 從 effects.flag / effects.flags 提取關鍵選擇標記
  if (effects.flag) {
    keyTags.push(String(effects.flag));
  }
  if (effects.flags && typeof effects.flags === 'object') {
    for (const [tag] of Object.entries(effects.flags as Record<string, boolean>)) {
      keyTags.push(tag);
    }
  }
  // 檢測大量體力消耗（可能導致後續病死）
  const effectsStats = effects.stats as Record<string, unknown> | undefined;
  if (effectsStats && typeof effectsStats === 'object') {
    const vitChange = effectsStats.vit as number | undefined;
    if (typeof vitChange === 'number' && vitChange <= -3) {
      keyTags.push('neglectedHealth'); // 忽視健康
    }
  }
  if (keyTags.length > 0 && player.age >= 5) { // 5 歲以下不追蹤
    const newHistory = [...(player.keyChoiceHistory || []), ...keyTags.map((tag) => ({
      age: newPlayer.age,
      text: choice.text.slice(0, 40),
      tag,
    }))];
    // 最多保留最近 30 筆關鍵選擇
    newPlayer.keyChoiceHistory = newHistory.slice(-30);
  }

  // === 體力歸零立刻死亡 ===
  const deathCheck = checkDeath(newPlayer);

  // === 根據年齡調整 deathReason ===
  if (deathCheck.isDead) {
    newPlayer.deathReason = deathCheck.deathReason;
    newPlayer.deathType = deathCheck.deathCategory;
  }

  return {
    player: newPlayer,
    resultMsg,
    resultType,
    changeLog,
    deathCheck,
    newSkills: newPlayer.skills,
    unlockedSkills,
    flagApplied,
  };
}

// ============================================
// 隨機事件模板（含進度追蹤，防止無限重複）
// ============================================
const RANDOM_EVENT_POOL: Record<string, GameEvent[]> = {
  infant: [
    {
      id: 'baby_cry',
      title: '啼哭',
      description: '你哇哇大哭，父母聞聲趕來。',
      era: 'any',
      year: 184,
      type: 'random',
      minAge: 0, maxAge: 3,
      choices: [
        { text: '繼續大哭', effects: { stats: { vit: 1, cha: 1 } } },
        { text: '安靜下來', effects: { stats: { vit: 2 } } },
      ],
    },
    {
      id: 'baby_feeding',
      title: '餵食',
      description: '母親正在餵你吃奶，溫暖的感覺包圍著你。',
      era: 'any',
      year: 184,
      type: 'random',
      minAge: 0, maxAge: 2,
      choices: [
        { text: '開心喝奶', effects: { stats: { vit: 2, lck: 1 } } },
        { text: '撒嬌', effects: { stats: { cha: 2, vit: 1 } } },
      ],
    },
  ],
  child: [
    {
      id: 'child_play',
      title: '嬉戲',
      description: '你和村裡的孩子們一起玩耍。',
      era: 'any',
      year: 184,
      type: 'random',
      minAge: 3, maxAge: 7,
      choices: [
        { text: '和夥伴們玩耍', effects: { stats: { cha: 2, vit: 1 } } },
        { text: '獨自探索', effects: { stats: { lck: 2, int: 1 } } },
      ],
    },
    {
      id: 'child_listen',
      title: '聽大人聊天',
      description: '你躲在柱子後面偷聽大人們談論時局。',
      era: 'any',
      year: 184,
      type: 'random',
      minAge: 4, maxAge: 7,
      choices: [
        { text: '仔細聽', effects: { stats: { int: 2 } } },
        { text: '聽不懂繼續玩', effects: { stats: { vit: 1, lck: 1 } } },
      ],
    },
    {
      id: 'child_trouble',
      title: '闖禍',
      description: '你不小心的弄壞了鄰居的東西。',
      era: 'any',
      year: 184,
      type: 'random',
      minAge: 5, maxAge: 7,
      choices: [
        { text: '主動承認', effects: { stats: { cha: 2 }, reputation: 3 } },
        { text: '撒腿就跑', effects: { stats: { vit: 2, lck: -1 } } },
      ],
    },
  ],
  preteen: [
    {
      id: '启蒙',
      title: '啟蒙',
      description: '你開始學習讀書識字。',
      era: 'any',
      year: 184,
      type: 'scholarly',
      minAge: 8, maxAge: 12,
      choices: [
        { text: '努力讀書', effects: { stats: { int: 3 } }, difficulty: 10, statCheck: 'int', successText: '你勤奮好學，學識大增！', failureText: '你坐不住，學得不進去。' },
        { text: '貪玩不學', effects: { stats: { str: 1, lck: 1 } } },
      ],
    },
    {
      id: 'preteen_hobby',
      title: '培養興趣',
      description: '你開始對某件事產生了興趣。',
      era: 'any',
      year: 184,
      type: 'random',
      minAge: 8, maxAge: 12,
      choices: [
        { text: '習字練畫', effects: { stats: { int: 2, cha: 1 } } },
        { text: '騎馬射箭', effects: { stats: { str: 2, vit: 1 } } },
        { text: '幫家裡做事', effects: { stats: { vit: 2, lck: 1 } } },
      ],
    },
  ],
  teen: [
    {
      id: 'teen_train',
      title: '練武',
      description: '你開始學習武藝。',
      era: 'any',
      year: 184,
      type: 'combat',
      minAge: 13, maxAge: 18,
      choices: [
        { text: '勤練武藝', effects: { stats: { str: 4, vit: 1 } }, difficulty: 14, statCheck: 'str', successText: '你武藝大進！', failureText: '你力不從心，受傷了。', failureEffects: { stats: { vit: -1 } } },
        { text: '研讀兵書', effects: { stats: { int: 3, cha: 1 } }, difficulty: 12, statCheck: 'int' },
      ],
    },
    {
      id: 'teen_learn',
      title: '求學',
      description: '你拜師學習學問。',
      era: 'any',
      year: 184,
      type: 'scholarly',
      minAge: 13, maxAge: 18,
      choices: [
        { text: '刻苦研讀', effects: { stats: { int: 4 } }, difficulty: 14, statCheck: 'int', successText: '你學識淵博，名聲遠播！', failureText: '你讀不懂那些深奧的經典。' },
        { text: '廣結善緣', effects: { stats: { cha: 3, lck: 1 } } },
      ],
    },
    {
      id: 'teen_travel',
      title: '遊歷四方',
      description: '你想出遠門見識世界。',
      era: 'any',
      year: 184,
      type: 'random',
      minAge: 15, maxAge: 18,
      choices: [
        { text: '拜訪名師', effects: { stats: { int: 3, cha: 2 }, reputation: 5 } },
        { text: '遊山玩水', effects: { stats: { lck: 2, vit: 2 } } },
        { text: '留在老家', effects: { stats: { vit: 1, lck: 1 } } },
      ],
    },
    {
      id: 'teen_martial',
      title: '比武切磋',
      description: '地方上有武者舉辦比武大會，你決定...',
      era: 'any',
      year: 184,
      type: 'combat',
      minAge: 14, maxAge: 18,
      choices: [
        { text: '上場切磋', effects: { stats: { str: 3, vit: -1 } }, difficulty: 13, statCheck: 'str', successText: '你擊敗對手，贏得聲譽！', failureText: '你敗下陣來，但獲得了尊重。' },
        { text: '在旁加油', effects: { stats: { cha: 2, lck: 1 } } },
        { text: '下注賭博', effects: { gold: -10, stats: { lck: -1 } } },
      ],
    },
  ],
  young_adult: [
    {
      id: 'young_career',
      title: '初出茅廬',
      description: '你已成年，開始尋找自己的道路。',
      era: 'any',
      year: 184,
      type: 'choice',
      minAge: 19, maxAge: 25,
      choices: [
        { text: '投效明主', effects: { stats: { cha: 3 }, reputation: 10, flags: { joinedFaction: true } }, difficulty: 12, statCheck: 'cha', successText: '你成功加入了英明的主公麾下！接下來將進入該陣營的專屬事件線。', failureText: '你的才華未被發掘，暫時懷才不遇。', failureEffects: { reputation: -5 } },
        { text: '隱居鄉里', effects: { stats: { lck: 2, vit: 1 } } },
        { text: '經商致富', effects: { stats: { lck: 2 }, gold: 30 }, difficulty: 10, statCheck: 'lck' },
      ],
    },
    {
      id: 'young_love',
      title: '情竇初開',
      description: '你遇到了令你心動的人。',
      era: 'any',
      year: 184,
      type: 'choice',
      minAge: 19, maxAge: 25,
      choices: [
        { text: '勇敢表白', effects: { stats: { cha: 2, lck: 1 } }, difficulty: 15, statCheck: 'cha', successText: '你們心意相通，終成眷屬！', failureText: '對方婉拒了你，但你們仍是好友。' },
        { text: '默默守護', effects: { stats: { cha: 1 } } },
      ],
    },
    {
      id: 'young_merchant',
      title: '經商機會',
      description: '你聽說有一個賺錢的好機會...',
      era: 'any',
      year: 184,
      type: 'choice',
      minAge: 18, maxAge: 25,
      choices: [
        { text: '投資貿易', effects: { gold: 20 }, difficulty: 10, statCheck: 'lck', successText: '賺得盆滿缽滿！', failureText: '虧了本錢，但學到了教訓。' },
        { text: '保守理財', effects: { gold: 5 } },
        { text: '揮霍享受', effects: { gold: -15, stats: { cha: 2, lck: 1 } } },
      ],
    },
  ],
  early_adult: [
    {
      id: 'early_battle',
      title: '從軍征戰',
      description: '戰火蔓延，你決定投身軍中建功立業。',
      era: 'any',
      year: 184,
      type: 'combat',
      minAge: 26, maxAge: 35,
      choices: [
        { text: '衝鋒陷陣', effects: { stats: { str: 3, lck: -1 }, exp: 20 }, difficulty: 14, statCheck: 'str', successText: '你英勇殺敵，立下戰功！', failureText: '你傷重倒下，險些陣亡。', failureEffects: { stats: { vit: -3, str: -1 } } },
        { text: '出謀劃策', effects: { stats: { int: 3 }, exp: 15 }, difficulty: 12, statCheck: 'int' },
        { text: '明哲保身', effects: { stats: { lck: 2, vit: 1 } } },
      ],
    },
    {
      id: 'early_politics',
      title: '政治角逐',
      description: '你開始涉足政壇，結交各方勢力。',
      era: 'any',
      year: 184,
      type: 'diplomatic',
      minAge: 26, maxAge: 35,
      choices: [
        { text: '結交豪強', effects: { stats: { cha: 3, int: 2 }, reputation: 15 }, difficulty: 14, statCheck: 'cha', successText: '你獲得地方豪強的信任！', failureText: '豪強看輕了你。', failureEffects: { reputation: -3 } },
        { text: '深耕地方', effects: { stats: { int: 2, vit: 2 }, gold: 20 } },
      ],
    },
  ],
  middle: [
    {
      id: 'middle_crisis',
      title: '中年轉折',
      description: '你已步入中年，面臨人生的重要抉擇。',
      era: 'any',
      year: 184,
      type: 'choice',
      minAge: 36, maxAge: 50,
      choices: [
        { text: '繼續奮鬥', effects: { stats: { str: 2, int: 2 }, reputation: 15 }, difficulty: 16, statCheck: 'int', successText: '你的堅持得到回報，聲望大增！', failureText: '你力不從心，身體開始吃不消。', failureEffects: { stats: { vit: -3 } } },
        { text: '功成身退', effects: { stats: { vit: 3, lck: 2 }, gold: 30 } },
        { text: '培養後輩', effects: { stats: { cha: 3 }, reputation: 20 } },
      ],
    },
  ],
  elder: [
    {
      id: 'elder_legacy',
      title: '晚年反思',
      description: '你已年老，開始思考自己的一生。',
      era: 'any',
      year: 184,
      type: 'random',
      minAge: 51,
      choices: [
        { text: '撰寫回憶錄', effects: { stats: { int: 3 }, reputation: 25 } },
        { text: '環遊天下', effects: { stats: { lck: 2, cha: 2 }, gold: -10 } },
        { text: '安享晚年', effects: { stats: { vit: 3, lck: 3 } } },
      ],
    },
  ],
};

// 預設事件（當所有模板事件都觸發過時使用）
const GENERIC_EVENTS: GameEvent[] = [
  {
    id: 'generic_rest',
    title: '休養生息',
    description: '這年頭還是保命要緊，你決定好好休息。',
    era: 'any',
    year: 184,
    type: 'random',
    choices: [
      { text: '好好休息', effects: { stats: { vit: 2, lck: 1 } } },
      { text: '讀書充電', effects: { stats: { int: 1 } } },
    ],
  },
  {
    id: 'generic_travel',
    title: '遊歷四方',
    description: '你決定出去走走，見識見識外面的世界。',
    era: 'any',
    year: 184,
    type: 'random',
    choices: [
      { text: '往北走', effects: { stats: { vit: 1, lck: 1 } } },
      { text: '往南走', effects: { stats: { vit: 1, lck: 1 } } },
    ],
  },
  {
    id: 'generic_trade',
    title: '經商賺錢',
    description: '錢不是萬事無能，你打算做些買賣。',
    era: 'any',
    year: 184,
    type: 'random',
    choices: [
      { text: '做糧食生意', effects: { gold: 15, stats: { lck: 1 } } },
      { text: '做布匹買賣', effects: { gold: 10, stats: { cha: 1 } } },
    ],
  },
];

export function generateRandomEvent(player: Player, year: number, age: number): GameEvent | null {
  const stage = getLifeStage(age);

  const stageEvents = RANDOM_EVENT_POOL[stage] || RANDOM_EVENT_POOL.early_adult;
  // === 使用 triggeredEvents 追蹤所有類型的事件 ===
  const seenEvents = player.triggeredEvents || [];

  // === 篩選出尚未觸發且年齡符合的事件 ===
  const availableEvents = stageEvents.filter((e) => {
    if (seenEvents.includes(e.id)) return false;
    if (e.minAge !== undefined && age < e.minAge) return false;
    if (e.maxAge !== undefined && age > e.maxAge) return false;
    return true;
  });

  // 如果當前階段所有事件都已觸發，退回到通用事件池
  if (availableEvents.length === 0) {
    // 嘗試上一個階段的事件
    const prevStageEvents = getPreviousStageEvents(stage, age);
    if (prevStageEvents.length > 0) {
      const prevAvailable = prevStageEvents.filter((e) => {
        if (seenEvents.includes(e.id)) return false;
        if (e.minAge !== undefined && age < e.minAge) return false;
        if (e.maxAge !== undefined && age > e.maxAge) return false;
        return true;
      });
      if (prevAvailable.length > 0) {
        return { ...prevAvailable[Math.floor(Math.random() * prevAvailable.length)], year };
      }
    }
    // 最後退回通用事件
    return { ...GENERIC_EVENTS[Math.floor(Math.random() * GENERIC_EVENTS.length)], year };
  }

  return { ...availableEvents[Math.floor(Math.random() * availableEvents.length)], year };
}

function getPreviousStageEvents(currentStage: string, age: number): GameEvent[] {
  const stageOrder: string[] = ['infant', 'child', 'preteen', 'teen', 'young_adult', 'early_adult', 'middle', 'elder'];
  const idx = stageOrder.indexOf(currentStage);
  if (idx <= 0) return [];
  return RANDOM_EVENT_POOL[stageOrder[idx - 1]] || [];
}
