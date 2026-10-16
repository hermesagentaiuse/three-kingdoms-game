// ============================================
// 三國蝴蝶 - TypeScript 型別定義
// ============================================

// ============================================
// 屬性系統
// ============================================
export interface Stats {
  int: number;    // 智力
  str: number;    // 武力
  lck: number;    // 運氣
  cha: number;    // 魅力
  vit: number;    // 體力
}

export type Background = 'scholar' | 'commoner' | 'merchant' | 'military' | 'poor';
export type Gender = 'male' | 'female';

// ============================================
// 蝴蝶效應系統 (GDD §3.4)
// ============================================
export type ButterflyType = 'military' | 'political' | 'economic' | 'cultural' | 'diplomatic';
export type ButterflyImpact = 'positive' | 'negative' | 'neutral' | 'mixed';

export interface ButterflyEffect {
  type: ButterflyType;
  target: string;
  impact: ButterflyImpact;
  value: number; // 1-3: 輕微, 4-6: 中等, 7-9: 重大, 10: 歷史轉折點
}

// ============================================
// 人生階段 (GDD §3.3 年齡系統)
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

// ============================================
// 稀有度
// ============================================
export type Rarity = 'common' | 'uncommon' | 'rare' | 'legendary';

// ============================================
// 玩家角色 (GDD §5.2 死亡評價支援欄位)
// ============================================
export interface Player {
  name: string;
  gender: Gender;
  background: Background;
  birthYear: number;
  age: number;
  stats: Stats;
  totalExp: number;
  level: number;
  skills: string[];
  companions: Companion[];
  relationships: Record<string, number>; // characterId -> relationship value (-100 to +100)
  resources: Resources;
  history: ChoiceRecord[];
  achievements: string[];
  isAlive: boolean;
  deathReason?: string; // 死因（死亡時使用）
  currentEra: string;
  currentYear: number;

  // 蝴蝶效應追蹤 (GDD §3.4)
  butterflyHistory: ButterflyEffect[];
  butterflySummary: Record<string, number>; // target -> total value

  // 死亡評價統計 (GDD §5.2)
  deathType: string;
  lifeStageEvents: string[]; // 每個階段觸發的事件標題
  totalChoices: number;
  totalVictories: number;
  totalDefeats: number;
  rareEventCount: number;
  marriageCount: number; // 姻緣次數
  keyChoiceHistory: { age: number; text: string; tag: string }[]; // 關鍵選擇追蹤，用於生成關聯死因
  maxReputation: number; // 聲望峰值
  maxGold: number; // 財富峰值

  // 已觸發的歷史事件 ID 追蹤（防止重複觸發）
  triggeredHistoricalEvents: string[];

  // 已觸發的所有事件 ID 追蹤（防止隨機事件重複）
  triggeredEvents: string[];

  // 所屬陣營（'none' / 'wei' / 'shu' / 'wu' / 'independent'）
  faction: string;

  // Flag 系統（用於追蹤各種遊戲狀態）
  flags: Record<string, boolean>;
}

// ============================================
// 夥伴系統
// ============================================
export interface Companion {
  id: string;
  name: string;
  isHistorical: boolean;
  stats: Stats;
  loyalty: number; // 0-100
  skills: string[];
  alive: boolean;
  deathYear?: number;
}

// ============================================
// 資源系統
// ============================================
export interface Resources {
  gold: number;
  reputation: number;
  intelligence: number; // 情報值
  items: Item[];
}

// ============================================
// 物品系統
// ============================================

// 物品效果 — 支援所有屬性加成與特殊加成
export interface ItemEffects extends Partial<Stats> {
  // 特殊加成（超出基本屬性）
  combatBonus?: number;        // 戰鬥加成
  defenseBonus?: number;       // 防禦加成
  speedBonus?: number;         // 速度加成
  vitRecovery?: number;        // 體力恢復量（藥品）
  combatVitRecovery?: number;  // 戰鬥體力恢復
  lifespanBonus?: number;      // 壽命加成
  scholarlyBonus?: number;     // 學問加成
  giftBonus?: number;          // 贈送加成
  poetryBonus?: number;        // 詩書加成
  singleCombatBonus?: number;  // 單挑加成
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'weapon' | 'armor' | 'medicine' | 'book' | 'treasure' | 'key' | 'horse';
  effects?: ItemEffects;
  goldValue: number;
  rarity?: Rarity;
  consumable?: boolean;
}

// ============================================
// 選擇記錄
// ============================================
export interface ChoiceRecord {
  year: number;
  era: string;
  eventId: string;
  choiceIndex: number;
  choiceText: string;
  effects: Record<string, number | boolean | string>;
}

// ============================================
// 事件系統 (GDD §3.3 事件觸發條件)
// ============================================
export type EventType =
  | 'historical'
  | 'random'
  | 'choice'
  | 'faction'
  | 'hidden'
  | 'combat'
  | 'diplomatic'
  | 'scholarly';
export type EventOutcome = 'success' | 'failure' | 'partial' | 'neutral';

export interface EventRequirements {
  minInt?: number;
  minStr?: number;
  minLck?: number;
  minCha?: number;
  minVit?: number;
  minGold?: number;
  minReputation?: number;
  hasCompanion?: string;
  hasItem?: string;
  minRelationship?: Record<string, number>;
  era?: string;
  yearRange?: [number, number];
  /** 需要加入的 faction（'shu'='劉備','wei'='曹操','wu'='孫權'） */
  factionRequired?: string[];
}

export interface EventChoice {
  text: string;
  description?: string;
  effects: EventEffects;
  requirements?: EventRequirements;
  hidden?: boolean; // 需要特定條件才顯示
  difficulty?: number; // 檢定難度（選此選項時需要達到的檢定）
  statCheck?: keyof Stats; // 檢定使用的屬性（int/str/lck/cha/vit）
  successText?: string; // 成功時的描述
  failureText?: string; // 失敗時的描述
  successEffects?: EventEffects; // 成功時的額外效果
  failureEffects?: EventEffects; // 失敗時的額外效果
}

export interface EventEffects {
  stats?: Partial<Stats>;
  exp?: number;
  gold?: number;
  reputation?: number;
  intelligence?: number;
  relationships?: Record<string, number>;
  items?: { id: string; quantity?: number; action: 'add' | 'remove' };
  companions?: { id: string; action: 'join' | 'leave' | 'die' }[];
  achievements?: string[];
  alive?: boolean;
  nextEra?: string;
  nextYear?: number;
  flag?: string; // 設定標誌
  flags?: Record<string, boolean>;
  butterflyEffects?: ButterflyEffect[]; // 選擇觸發的蝴蝶效應
  faction?: string; // 加入陣營（wei/shu/wu/independent/none）
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  era: string;
  year: number;
  minAge?: number; // 最小年齡 (GDD §3.3)
  maxAge?: number; // 最大年齡 (GDD §3.3)
  type: EventType;
  rarity?: Rarity; // 稀有度 (GDD §3.4)
  stage?: LifeStage; // 人生階段 (GDD §3.3)
  requirements?: EventRequirements;
  choices: EventChoice[];
  effects?: EventEffects; // 直接效果（無選擇時）
  outcome?: EventOutcome;
  nextEvents?: Record<number, string[]>; // choiceIndex → next event IDs
  hidden?: boolean;
  priority?: number; // 優先級，越高越先觸發
  tags?: string[]; // 標籤，用於分類
  butterflyEffects?: ButterflyEffect[]; // 事件附帶的蝴蝶效應標籤 (GDD §3.4)
}

// ============================================
// 歷史人物
// ============================================
export interface HistoricalCharacter {
  id: string;
  name: string;
  era: string;
  faction: string; // 魏/蜀/吳/其他
  birthYear: number;
  deathYear?: number;
  stats: Stats;
  description: string;
  title: string;
  relationships: Record<string, number>;
  alive: boolean;
}

// ============================================
// 結局系統 (GDD §5.2 死亡評價)
// ============================================
export type EndingRoute =
  | 'historical'
  | 'hero'
  | 'hermit'
  | 'usurper'
  | 'tragic'
  | 'hidden'
  | 'legendary';

export interface EndingRequirements {
  minReputation?: number;
  minGold?: number;
  minRelationship?: Record<string, number>;
  maxRelationship?: Record<string, number>;
  hasAchievement?: string;
  hasFlag?: string;
  minYearsPlayed?: number;
  maxYearsPlayed?: number;
  minStats?: Partial<Stats>;
  maxStats?: Partial<Stats>;
  specificChoices?: string[]; // 必須做過這些選擇
}

export interface EvaluationDimension {
  label: string;
  score: number; // 0-10 normalized
  description?: string;
}

export interface EvaluationResult {
  dimensions: EvaluationDimension[];
  totalScore: number; // 0-10 average
  grade: 'S' | 'A' | 'B' | 'C' | 'D';
  gradeName: string;
  narrative: string[];
  achievements: string[];
}

export interface Ending {
  id: string;
  title: string;
  description: string;
  route: EndingRoute;
  requirements: EndingRequirements;
  biography: string; // 生平總結
  evaluation: {
    overall: number; // 總評 0-100
    historicalImpact: number; // 歷史影響力
    personalAchievement: number; // 個人成就
    relationships: number; // 人際關係
    wealth: number; // 財富
    legacy: number; // 遺產/流傳
  };
}

// ============================================
// 技能系統
// ============================================
export interface Skill {
  id: string;
  name: string;
  description: string;
  requirement: string; // 觸發條件描述
  minStat?: keyof Stats;
  minStatValue?: number;
  effects: string[];
  icon?: string;
}

// ============================================
// 遊戲狀態
// ============================================
export interface GameState {
  player: Player;
  currentEvent: GameEvent | null;
  availableEvents: GameEvent[];
  history: GameEvent[];
  isGameOver: boolean;
  isPaused: boolean;
  turnCount: number;
  flags: Record<string, boolean>;
}

// ============================================
// 遊戲存檔
// ============================================
export interface SaveData {
  version: string;
  timestamp: number;
  gameState: GameState;
}

// ============================================
// 時間軸
// ============================================
export interface Era {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  description: string;
  majorEvents: string[];
  factions: string[];
}

export const ERAS: Era[] = [
  {
    id: 'huangjin',
    name: '黃巾之亂',
    startYear: 184,
    endYear: 188,
    description: '黃巾起義，天下大亂，群雄並起',
    majorEvents: ['黃巾之亂', '董卓入洛陽', '諸侯討董'],
    factions: ['漢廷', '黃巾軍', '董卓'],
  },
  {
    id: 'dongzhuo',
    name: '董卓亂政',
    startYear: 189,
    endYear: 195,
    description: '董卓專權，焚燒洛陽，天下分裂',
    majorEvents: ['董卓焚洛陽', '長安之亂', '袁術稱帝'],
    factions: ['董卓', '袁紹', '曹操', '孫堅'],
  },
  {
    id: 'qunxiong',
    name: '群雄割據',
    startYear: 196,
    endYear: 199,
    description: '曹操挾天子以令諸侯，群雄逐鹿中原',
    majorEvents: ['曹操迎獻帝', '徐州之戰', '下邳之戰'],
    factions: ['曹操', '袁紹', '呂布', '劉備', '孫策'],
  },
  {
    id: 'guandu',
    name: '官渡之戰',
    startYear: 200,
    endYear: 207,
    description: '官渡之戰，曹操統一北方',
    majorEvents: ['官渡之戰', '曹操平北方', '劉備投劉表'],
    factions: ['曹操', '袁紹', '劉備', '孫權'],
  },
  {
    id: 'chibi',
    name: '赤壁之戰',
    startYear: 208,
    endYear: 219,
    description: '赤壁之戰，三國鼎立格局形成',
    majorEvents: ['赤壁之戰', '劉備取荊州', '關羽北伐', '呂蒙襲荊州'],
    factions: ['曹操', '孫權', '劉備'],
  },
  {
    id: 'dingli',
    name: '三國鼎立',
    startYear: 220,
    endYear: 280,
    description: '魏蜀吳三國鼎立，最終歸晉',
    majorEvents: ['曹丕稱帝', '劉備稱帝', '諸葛亮北伐', '魏滅蜀', '司馬炎代魏', '三國歸晉'],
    factions: ['魏', '蜀', '吳'],
  },
];
