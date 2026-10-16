// ============================================
// 投效陣營事件系統
// 基於正史記載的諸侯活動時間與地點
// ============================================
import type { GameEvent, Stats, EventEffects } from '@/types/game';

export interface Warlord {
  id: string;
  name: string;
  title: string;
  factionKey: string;
  location: string;
  activeStart: number; // 最早可投效年份
  activeEnd: number;   // 最晚可投效年份
  recruitDifficulty: number; // 招募難度
  requiredStats: Record<string, number>;
  minReputation: number;
  description: string;
  successText: string;
  failureText: string;
  historicalNotes: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  // 特殊條件
  requiresFlag?: string;
  notCompatibleWith?: string; // 不能同時投效的另一陣營
}

// ============================================
// 所有可投效的陣營（按正史活動時間）
// ============================================
export const ALL_WARLORDS: Warlord[] = [
  // ============================================
  // 早期（184-192）- 黃巾之亂到董卓專權
  // ============================================
  {
    id: 'han_government',
    name: '漢廷官軍',
    title: '朝廷',
    factionKey: 'wei', // 投效漢廷 = 投效曹操陣營（曹操代表朝廷）
    location: '各地',
    activeStart: 184,
    activeEnd: 196,
    recruitDifficulty: 8,
    requiredStats: { str: 10 },
    minReputation: 0,
    description: '黃巾起義，朝廷徵召義勇。這是進入軍中建功立業的第一條路。',
    successText: '你被編入官軍，成為平定黃巾的義勇軍一員！',
    failureText: '你的武藝不足以入官軍之眼。',
    historicalNotes: '黃巾之亂時，朝廷徵召各地義勇。曹操、劉備、孫堅等都曾被編入官軍系統。',
    rarity: 'common',
  },
  {
    id: 'dong_zhuo',
    name: '董卓',
    title: '太師',
    factionKey: 'dong_zhuo',
    location: '洛陽 / 長安',
    activeStart: 189,
    activeEnd: 192,
    recruitDifficulty: 10,
    requiredStats: { str: 12 },
    minReputation: 0,
    description: '董卓掌控朝政，殘暴專橫。他正在招募勇士……',
    successText: '董卓收你為部將，但你心中明白……此人必敗。',
    failureText: '董卓嫌棄你的出身。',
    historicalNotes: '董卓189年掌控洛陽，192年被王允和呂布所殺。以殘暴著稱，焚燒洛陽遷都長安。',
    rarity: 'uncommon',
  },
  {
    id: 'luan_bu',
    name: '呂布',
    title: '飛將',
    factionKey: 'luan_bu',
    location: '徐州 / 下邳',
    activeStart: 192,
    activeEnd: 198,
    recruitDifficulty: 12,
    requiredStats: { str: 14 },
    minReputation: 5,
    description: '呂布武勇冠世，但反覆無常。他正在招募猛將……',
    successText: '呂布見你武藝不凡，收下你為偏將！',
    failureText: '呂布身邊猛將如雲，你看不到你的機會。',
    historicalNotes: '呂布字奉先，五原九原人。原為丁原部將，殺丁原投董卓，又殺董卓投袁紹，後佔徐州。198年被曹操擒殺。號稱「飛將」，武力三國第一。',
    rarity: 'rare',
  },
  {
    id: 'yuan_shao',
    name: '袁紹',
    title: '冀州牧',
    factionKey: 'yuan_shao',
    location: '鄴城 / 冀州',
    activeStart: 190,
    activeEnd: 200,
    recruitDifficulty: 12,
    requiredStats: { cha: 12 },
    minReputation: 10,
    description: '袁紹出身汝南袁氏「四世三公」，門生故吏遍天下。他正在廣納賢才……',
    successText: '袁紹愛才，錄你為麾下謀士！',
    failureText: '袁紹帳下名士眾多，你只是其中之一。',
    historicalNotes: '袁紹字本初，汝南汝陽人。出身名門，官渡之戰前實力最強，但優柔寡斷、不能用人。200年官渡大敗於曹操。',
    rarity: 'rare',
  },
  {
    id: 'liu_biao',
    name: '劉表',
    title: '荊州牧',
    factionKey: 'liu_biao',
    location: '襄陽 / 荊州',
    activeStart: 190,
    activeEnd: 208,
    recruitDifficulty: 10,
    requiredStats: { int: 10 },
    minReputation: 5,
    description: '劉表據有荊州九郡，文教昌盛。他正在招募學者與謀士……',
    successText: '劉表見你才學出眾，引為賓客！',
    failureText: '劉表身邊文人眾多，你暫時未獲重用。',
    historicalNotes: '劉表字景升，魯國豐人。漢室宗親，據荊州二十年，好文學、招學者。但保守無為，不問天下大勢。208年病死。',
    rarity: 'uncommon',
  },
  {
    id: 'sun_jian',
    name: '孫堅',
    title: '破虜將軍',
    factionKey: 'sun_quan', // 投效孫堅 = 投效孫家
    location: '長沙',
    activeStart: 184,
    activeEnd: 191,
    recruitDifficulty: 10,
    requiredStats: { str: 12, vit: 12 },
    minReputation: 5,
    description: '孫堅是平定黃巾的主力將領，作戰勇猛，號稱「孫郎之父」……',
    successText: '孫堅見你勇敢，錄為帳下都尉！',
    failureText: '孫堅帳下猛將如雨，你未被注意到。',
    historicalNotes: '孫堅字文臺，吳郡富春人。討伐黃巾、董卓的功勳將領，191年在與劉表部黃祖戰鬥中陣亡。孫策、孫權之父。',
    rarity: 'rare',
    notCompatibleWith: 'sun_ce',
  },
  {
    id: 'sun_ce',
    name: '孫策',
    title: '小霸王',
    factionKey: 'sun_quan',
    location: '江東 / 會稽',
    activeStart: 195,
    activeEnd: 200,
    recruitDifficulty: 12,
    requiredStats: { str: 14, cha: 12 },
    minReputation: 10,
    description: '孫策繼承父親基業，以少壯之氣掃蕩江東。他英氣勃發，有「小霸王」之稱……',
    successText: '孫策豪傑之士，引你為同僚！',
    failureText: '孫策忙於征戰，暫無法收留你。',
    historicalNotes: '孫策字伯符，孫堅長子。195年起兵掃蕩江東六郡，所向無敵。200年被許貢門客刺殺，年僅25。臨終以弟孫權代。',
    rarity: 'rare',
    notCompatibleWith: 'sun_jian',
  },
  {
    id: 'gongsun_zhang',
    name: '公孫瓚',
    title: '薊北冠軍',
    factionKey: 'independent',
    location: '薊城 / 遼西',
    activeStart: 188,
    activeEnd: 199,
    recruitDifficulty: 11,
    requiredStats: { str: 14 },
    minReputation: 5,
    description: '公孫瓚據有幽州，擅長騎兵作戰。他正在招募武將……',
    successText: '公孫瓚見你武藝過人，錄為騎兵將領！',
    failureText: '公孫瓚嫌棄你的背景不夠好。',
    historicalNotes: '公孫瓚字伯珪，遼西令支人。據幽州多年，以騎兵聞名。後被袁紹圍困於易京，兵敗自殺。',
    rarity: 'uncommon',
  },
  {
    id: 'ma_teng',
    name: '馬騰',
    title: '涼州刺史',
    factionKey: 'independent',
    location: '長安 / 涼州',
    activeStart: 190,
    activeEnd: 212,
    recruitDifficulty: 12,
    requiredStats: { str: 14 },
    minReputation: 5,
    description: '馬騰據有涼州，率領西涼鐵騎。他正在招募武勇之士……',
    successText: '馬騰見你勇猛，邀你加入西涼軍！',
    failureText: '馬騰嫌棄你不夠粗獷。',
    historicalNotes: '馬騰字巨進，扶風人。據涼州多年，其子馬超後成為蜀漢五虎將之一。212年入朝被曹操所殺。',
    rarity: 'uncommon',
  },

  // ============================================
  // 中期（196-208）- 曹操崛起期
  // ============================================
  {
    id: 'cao_cao',
    name: '曹操',
    title: '丞相',
    factionKey: 'wei',
    location: '許都',
    activeStart: 196,
    activeEnd: 220,
    recruitDifficulty: 13,
    requiredStats: { int: 12, cha: 10 },
    minReputation: 15,
    description: '曹操挾天子以令諸侯，雄才大略。他愛才如命，正在招募英才……',
    successText: '曹操賞識你的才華，錄你為帳下謀士/將領！',
    failureText: '曹操帳下人才濟濟，你暫時未被注意到。',
    historicalNotes: '曹操字孟德，沛國譙人。196年迎漢獻帝於許都，「挾天子以令諸侯」。官渡之戰大敗袁紹，統一北方。後封魏王。220年病死，其子曹丕篡漢建魏。',
    rarity: 'legendary',
  },
  {
    id: 'liu_bei_post_184',
    name: '劉備',
    title: '左將軍',
    factionKey: 'shu',
    location: '各地',
    activeStart: 184,
    activeEnd: 223,
    recruitDifficulty: 14,
    requiredStats: { cha: 14 },
    minReputation: 10,
    description: '劉備以仁義聞名天下，雖屢屢失敗但百折不撓。他正在招募義勇……',
    successText: '劉備以仁義相待，引你為心腹！',
    failureText: '劉備此時自身難保，無力收留你。',
    historicalNotes: '劉備字玄德，涿郡涿人。漢室宗親，一生颠沛流離但仍堅守仁義。先投曹操、袁紹、劉表，後取荊益二州建立蜀漢。221年稱帝，223年白帝城病逝。',
    rarity: 'legendary',
  },
  {
    id: 'yuan_shu',
    name: '袁術',
    title: '仲氏',
    factionKey: 'independent',
    location: '壽春 / 淮南',
    activeStart: 190,
    activeEnd: 199,
    recruitDifficulty: 11,
    requiredStats: { str: 10 },
    minReputation: 0,
    description: '袁術出身汝南袁氏，與袁紹同為四世三公之後。他據有淮南……',
    successText: '袁術收你為部將，但你心中清楚……',
    failureText: '袁術嫌棄你的出身。',
    historicalNotes: '袁術字公路，袁紹之弟。據淮南稱帝，但荒淫無道，眾叛親離。199年兵敗病死。',
    rarity: 'uncommon',
  },

  // ============================================
  // 後期（208-220）- 三國鼎立期
  // ============================================
  {
    id: 'sun_quan',
    name: '孫權',
    title: '吳大帝',
    factionKey: 'wu',
    location: '建業 / 吳郡',
    activeStart: 200,
    activeEnd: 252,
    recruitDifficulty: 13,
    requiredStats: { cha: 14, int: 12 },
    minReputation: 20,
    description: '孫權繼承兄長孫策之業，善於用人。他正在招募謀士將領……',
    successText: '孫權愛才，錄你為麾下謀臣！',
    failureText: '孫權認為你還需磨練。',
    historicalNotes: '孫權字仲謀，孫堅次子。200年繼位，208年赤壁之戰大破曹操，229年稱帝建吳。在位數十年，善於平衡各方勢力。',
    rarity: 'legendary',
    requiresFlag: 'sun_ce_dead',
  },
  {
    id: 'liu_bei_shu',
    name: '劉備',
    title: '蜀漢昭烈帝',
    factionKey: 'shu',
    location: '成都 / 荊州',
    activeStart: 211,
    activeEnd: 223,
    recruitDifficulty: 15,
    requiredStats: { cha: 16, int: 12 },
    minReputation: 30,
    description: '劉備已據有荊益二州，建立蜀漢政權。他正在招募將領……',
    successText: '劉備以皇叔之尊，引你為心腹！',
    failureText: '劉備身邊已有眾多名士，你暫時未獲重用。',
    historicalNotes: '此為劉備建立蜀漢後的時期。諸葛亮、黃忠、魏延、馬超等已在帳下。',
    rarity: 'legendary',
    notCompatibleWith: 'liu_bei_post_184',
  },
];

// ============================================
// 生成「選擇投效誰」事件
// ============================================
export function generateFactionChoiceEvent(
  year: number,
  age: number,
  playerFaction: string,
  companions: { id: string }[],
  history: { eventId: string; choiceText: string }[]
): GameEvent | null {
  // 只有16歲以上才能投效
  if (age < 16) return null;

  // 已經有陣營了就不能再選
  if (playerFaction && playerFaction !== 'none') return null;

  // 篩選出當前年份可投效的陣營
  const availableWarlords = ALL_WARLORDS.filter((w) => {
    // 檢查年份
    if (year < w.activeStart - 1 || year > w.activeEnd + 2) return false;

    // 檢查是否已錯過（此人已被招募）
    const hasCompanion = companions.some((c) => {
      if (w.factionKey === 'wei') return ['guo_jia', 'xun_yu', 'zhang_liao', 'xiahou_dun', 'caoren', 'sima_yi', 'liu_bei_wei_period'].includes(c.id);
      if (w.factionKey === 'shu') return ['zhuge_liang', 'guan_yu', 'zhang_fei', 'zhao_yun'].includes(c.id);
      if (w.factionKey === 'wu') return ['sun_ce', 'sun_qian', 'lu_xun', 'zhou_yu'].includes(c.id);
      return false;
    });
    if (hasCompanion) return false;

    // 檢查互斥條件
    if (w.notCompatibleWith) {
      const wasRecruited = history.some((h) => h.eventId && h.eventId.includes(w.notCompatibleWith!));
      if (wasRecruited) return false;
    }

    // 檢查特殊 flag
    if (w.requiresFlag === 'sun_ce_dead') {
      const metSunCe = history.some((h) => h.eventId.includes('sun_ce'));
      const currentYear = year;
      if (metSunCe && currentYear <= 200) return false; // 孫策死後才可投孫權
    }

    return true;
  });

  if (availableWarlords.length === 0) return null;

  // 生成選項
  const choices: { text: string; description: string; statCheck?: keyof Stats; difficulty?: number; effects: EventEffects; successText?: string; failureText?: string; successEffects?: EventEffects; failureEffects?: EventEffects }[] = availableWarlords.map((w) => ({
    text: `投效${w.name}（${w.title}）— 位於${w.location}`,
    description: w.description,
    statCheck: w.requiredStats.str ? 'str' : w.requiredStats.cha ? 'cha' : 'int',
    difficulty: w.recruitDifficulty,
    effects: {
      faction: w.factionKey,
      reputation: 10,
      gold: -5,
      flag: `joined_${w.factionKey}`,
    },
    successText: w.successText,
    failureText: w.failureText,
    successEffects: {
      companions: getCompanionsForFaction(w.factionKey, year),
    },
    failureEffects: {
      reputation: -5,
      gold: -10,
    },
  }));

  // 最後一個選項：繼續獨立
  choices.push({
    text: '繼續獨立，不投靠任何一方',
    description: '天下大亂，保持獨立可能是最安全的選擇。',
    effects: {
      stats: { lck: 2, vit: 1 },
      reputation: 3,
    },
  });

  return {
    id: `faction_choice_${year}`,
    title: '選擇你的歸宿',
    description: `建安${toChineseEraYear(year)}年（公元${year}年），天下大亂，群雄並起。你必須做出人生的重大抉擇——投靠哪位諸侯？`,
    era: getEraForYear(year),
    year: year,
    type: 'historical',
    rarity: 'rare',
    minAge: 16,
    maxAge: 50,
    stage: 'young_adult',
    priority: 300, // 高優先級
    requirements: {},
    choices,
  };
}

// ============================================
// 根據陣營返回可招募的同伴
// ============================================
function getCompanionsForFaction(factionKey: string, year: number): { id: string; action: 'join' }[] {
  const companions: { id: string; action: 'join' }[] = [];

  if (factionKey === 'wei') {
    // 曹操陣營：隨機出現1-2位曹操手下
    const possibleWei = ['xiahou_dun', 'caoren'];
    if (year >= 198) possibleWei.push('guo_jia', 'zhang_liao');
    if (year >= 192) possibleWei.push('xun_yu');
    if (year >= 198) possibleWei.push('sima_yi');

    const count = Math.floor(Math.random() * 2) + 1; // 1-2位
    const shuffled = possibleWei.sort(() => Math.random() - 0.5);
    for (let i = 0; i < count && i < shuffled.length; i++) {
      companions.push({ id: shuffled[i], action: 'join' });
    }
  } else if (factionKey === 'shu') {
    const possibleShu = ['guan_yu', 'zhang_fei'];
    if (year >= 198) possibleShu.push('zhao_yun');
    if (year >= 207) possibleShu.push('zhuge_liang');

    const count = Math.floor(Math.random() * 2) + 1;
    const shuffled = possibleShu.sort(() => Math.random() - 0.5);
    for (let i = 0; i < count && i < shuffled.length; i++) {
      companions.push({ id: shuffled[i], action: 'join' });
    }
  } else if (factionKey === 'wu') {
    const possibleWu = [];
    if (year >= 195 && year < 201) possibleWu.push('sun_ce');
    if (year >= 200) possibleWu.push('sun_qian', 'lu_xun');
    if (year >= 208 && year <= 210) possibleWu.push('zhou_yu');

    const count = Math.floor(Math.random() * 2) + 1;
    const shuffled = possibleWu.sort(() => Math.random() - 0.5);
    for (let i = 0; i < count && i < shuffled.length; i++) {
      companions.push({ id: shuffled[i], action: 'join' });
    }
  }

  return companions;
}

// ============================================
// 工具函式
// ============================================
function toChineseEraYear(year: number): string {
  // 簡化的年號轉換（僅供展示用）
  if (year <= 189) return `中平${year - 183}年`;
  if (year <= 193) return `初平${year - 189}年`;
  if (year <= 195) return `興平${year - 193}年`;
  if (year <= 220) return `建安${year - 195}年`;
  if (year <= 226) return `黃初${year - 219}年`;
  if (year <= 239) return `青龍${year - 232}年`;
  if (year <= 264) return `景元${year - 259}年`;
  return `${year}年`;
}

function getEraForYear(year: number): string {
  // 必須與 ERAS 定義（types/game.ts）一致，否則事件過濾（event.era === era.id）會永远不匹配
  if (year <= 188) return 'huangjin';
  if (year <= 195) return 'dongzhuo';
  if (year <= 199) return 'qunxiong';
  if (year <= 207) return 'guandu';
  if (year <= 219) return 'chibi';
  return 'dingli';
}
