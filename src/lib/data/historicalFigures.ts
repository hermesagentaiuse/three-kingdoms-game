import type { GameEvent } from '@/types/game';

// ============================================
// 三國歷史人物資料庫
// 基於《三國志》正史記載
// ============================================
export type HistoricalFaction = 'none' | 'han' | 'cao_cao' | 'liu_bei' | 'sun_quan' | 'yuan_shao' | 'dong_zhuo' | 'luan_bu' | 'liu_biao' | 'ma_teng' | 'gongsun_zhang' | 'yang_xu' | 'zhang_liao_pre' | 'zu_lang' | 'independent';

export interface HistoricalPerson {
  id: string;
  name: string;
  title: string; // 歷史稱號
  faction: HistoricalFaction;
  joinYear: number;  // 最早可相遇年份（正史）
  leaveYear?: number; // 離開/死亡年份（可相遇的截止年份）
  recruitDifficulty: number; // 招募難度（10-20）
  requiredStats: {
    int?: number;
    str?: number;
    cha?: number;
    lck?: number;
    vit?: number;
  };
  requiredReputation: number; // 最低聲望
  requiredFaction?: string; // 必須已投靠的陣營
  location: string; // 正史中相遇的地點
  eventText: string; // 相遇事件描述
  recruitmentSuccessText: string;
  recruitmentFailureText: string;
  historicalNotes: string; // 正史記載備註
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
  // 特殊條件
  requiresFlag?: string; // 需要特定 flag 才出現
  mustBeAtWar?: boolean; // 必須處於戰爭狀態
  mustBePeacetime?: boolean; // 必須處於和平時期
  oneTimeOnly?: boolean; // 一次性的相遇
  recruitAfterYear?: number; // 必須在指定年份之後才出現
  recruitBeforeYear?: number; // 必須在指定年份之前才出現
}

export const HISTORICAL_PEOPLE: HistoricalPerson[] = [
  // ============================================
  // 曹操陣營
  // ============================================
  {
    id: 'guo_jia',
    name: '郭嘉',
    title: '鬼才',
    faction: 'cao_cao',
    joinYear: 198,
    leaveYear: 207,
    recruitDifficulty: 14,
    requiredStats: { int: 16, cha: 14 },
    requiredReputation: 20,
    location: '許都',
    eventText: '建安三年，汝南名士郭嘉聞你才華，派人捎來書信邀你前往許都一敘。',
    recruitmentSuccessText: '郭嘉賞識你的才幹，引你為同道中人！',
    recruitmentFailureText: '郭嘉覺得你還不夠格，婉言謝絕了。',
    historicalNotes: '郭嘉字奉孝，潁川陰平人。曹操嘆「使孤成大業者，必此人也」，可惜207年病逝，年38。',
    rarity: 'rare',
    recruitAfterYear: 198,
  },
  {
    id: 'xun_yu',
    name: '荀彧',
    title: '王佐之才',
    faction: 'cao_cao',
    joinYear: 192,
    leaveYear: 212,
    recruitDifficulty: 15,
    requiredStats: { int: 18, cha: 15 },
    requiredReputation: 25,
    location: '許都',
    eventText: '建安初年，荀彧在許都主持朝政。他聽說有個有志之士慕名而來……',
    recruitmentSuccessText: '荀彧以國家大義相託，你深感責任重大！',
    recruitmentFailureText: '荀彧認為時機尚未成熟，勸你再等多一段時間。',
    historicalNotes: '荀彧字文若，潁川潁陰人。曹操稱「吾之子房」，是曹操最重要的謀士。後因反對曹操進爵魏公，憂鬱而終。',
    rarity: 'rare',
    requiresFlag: 'in_xuchang',
  },
  {
    id: 'zhang_liao',
    name: '張遼',
    title: '五子良將',
    faction: 'cao_cao',
    joinYear: 198,
    leaveYear: 222,
    recruitDifficulty: 13,
    requiredStats: { str: 16, cha: 10 },
    requiredReputation: 15,
    requiredFaction: 'wei',
    location: '下邳',
    eventText: '建安三年，曹操圍呂布於下邳。張遼隨呂布抗戰多年，如今城破……',
    recruitmentSuccessText: '張遼見曹操寬大，又感你誠意，願意歸附！',
    recruitmentFailureText: '張遼心懷呂布舊恩，暫時無法接受新主。',
    historicalNotes: '張遼字文遠，雁門馬邑人。本為呂布部將，下邳之戰後歸降曹操。白狼山斬蹋頓，逍遙津八百破孫權，威震江東。',
    rarity: 'legendary',
    requiresFlag: 'lu_bu_defeated',
    recruitAfterYear: 198,
  },
  {
    id: 'xiahou_dun',
    name: '夏侯惇',
    title: '鷹揚將軍',
    faction: 'cao_cao',
    joinYear: 184,
    leaveYear: 220,
    recruitDifficulty: 10,
    requiredStats: { str: 18 },
    requiredReputation: 5,
    location: '譙縣',
    eventText: '黃巾之亂爆發，夏侯惇是曹操的同族親信。他正招募勇士……',
    recruitmentSuccessText: '夏侯惇看你武藝不凡，收入帳下！',
    recruitmentFailureText: '夏侯惇覺得你還不能獨當一面。',
    historicalNotes: '夏侯惇字元讓，沛國譙人。曹操族兄弟，一生跟隨曹操南征北戰，失明一目仍忠心耿耿。',
    rarity: 'common',
  },
  {
    id: 'caoren',
    name: '曹仁',
    title: '古之召虎',
    faction: 'cao_cao',
    joinYear: 184,
    leaveYear: 223,
    recruitDifficulty: 11,
    requiredStats: { str: 17, vit: 15 },
    requiredReputation: 10,
    location: '譙縣',
    eventText: '曹仁是曹操的堂弟，與夏侯惇同為曹操最倚重的宗室將領。',
    recruitmentSuccessText: '曹仁賞識你的勇武，錄你為偏將！',
    recruitmentFailureText: '曹仁認為你还需磨練。',
    historicalNotes: '曹仁字子孝，沛國譙人。曹操堂弟，圍樊城威震荊襄，被孙权譽為「古之召虎」。',
    rarity: 'uncommon',
  },
  {
    id: 'sima_yi',
    name: '司馬懿',
    title: '冢虎',
    faction: 'cao_cao',
    joinYear: 208,
    leaveYear: 251,
    recruitDifficulty: 17,
    requiredStats: { int: 20, cha: 16 },
    requiredReputation: 30,
    location: '鄴城',
    eventText: '建安十三年，曹操徵辟司馬懿為文學掾。司馬懿出身河內名門……',
    recruitmentSuccessText: '司馬懿見你見解不凡，引為知己！',
    recruitmentFailureText: '司馬懿高深莫測，你未能贏得他的青睞。',
    historicalNotes: '司馬懿字仲達，河內溫人。出身河內頂級門閥，曹操時為謀臣，其子司馬師、司馬昭終篡魏建晉。',
    rarity: 'legendary',
    requiresFlag: 'in_xuchang',
    recruitAfterYear: 208,
  },
  {
    id: 'liu_bei_wei_period',
    name: '劉備',
    title: '左將軍',
    faction: 'cao_cao',
    joinYear: 199,
    leaveYear: 200,
    recruitDifficulty: 12,
    requiredStats: { cha: 14 },
    requiredReputation: 20,
    location: '許都',
    eventText: '建安四年，劉備暫時投靠曹操，在許都種菜隱居。有人說他胸有大志……',
    recruitmentSuccessText: '劉備以仁義名聞天下，你得以結識這位未來皇叔！',
    recruitmentFailureText: '劉備此時自身難保，無法收留你。',
    historicalNotes: '此為劉備短暫寄居曹操麾下的時期（199-200年）。後劉備藉口截擊袁術脫離曹操。',
    rarity: 'rare',
    recruitAfterYear: 199,
    recruitBeforeYear: 201,
  },

  // ============================================
  // 劉備陣營
  // ============================================
  {
    id: 'zhuge_liang',
    name: '諸葛亮',
    title: '臥龍',
    faction: 'liu_bei',
    joinYear: 207,
    leaveYear: 234,
    recruitDifficulty: 18,
    requiredStats: { int: 20, cha: 18, lck: 15 },
    requiredReputation: 30,
    location: '隆中',
    eventText: '建安十二年，徐庶推薦諸葛亮給你。你決定親赴隆中拜訪……',
    recruitmentSuccessText: '三顧茅廬，諸葛亮被你的誠意感動，出山相助！',
    recruitmentFailureText: '諸葛亮覺得時機未到，或你不夠誠心。',
    historicalNotes: '諸葛亮字孔明，琅琊陽都人。三顧茅廬出山，獻「隆中对」，輔佐劉備建立蜀漢。234年五丈原病逝，年54。',
    rarity: 'legendary',
    requiresFlag: 'know_liu_bei',
    recruitAfterYear: 207,
  },
  {
    id: 'guan_yu',
    name: '關羽',
    title: '美鬚公',
    faction: 'liu_bei',
    joinYear: 184,
    leaveYear: 220,
    recruitDifficulty: 10,
    requiredStats: { str: 20, cha: 12 },
    requiredReputation: 10,
    location: '涿郡',
    eventText: '黃巾之亂時，關羽與劉備、張飛在涿郡結義。他們正在招募義勇軍……',
    recruitmentSuccessText: '關羽見你忠義，引你為兄弟的同道！',
    recruitmentFailureText: '關羽不喜無義之人。',
    historicalNotes: '關羽字雲長，河東解良人。與劉備張飛「恩若兄弟」，後世尊為「武聖」。220年被孫權部將斬殺。',
    rarity: 'legendary',
  },
  {
    id: 'zhang_fei',
    name: '張飛',
    title: '燕人張翼德',
    faction: 'liu_bei',
    joinYear: 184,
    leaveYear: 221,
    recruitDifficulty: 10,
    requiredStats: { str: 20 },
    requiredReputation: 5,
    location: '涿郡',
    eventText: '張飛是個屠戶出身，卻有萬夫不當之勇。他正在招募義勇軍……',
    recruitmentSuccessText: '張飛見你豪爽，引你為志同道合之人！',
    recruitmentFailureText: '張飛覺得你不够豪氣。',
    historicalNotes: '張飛字翼德，涿郡人。與劉備關羽結義，長坂坡斷後喝退曹軍。221年被部將范彊、張達所殺。',
    rarity: 'legendary',
  },
  {
    id: 'zhao_yun',
    name: '趙雲',
    title: '常山趙子龍',
    faction: 'liu_bei',
    joinYear: 198,
    leaveYear: 229,
    recruitDifficulty: 12,
    requiredStats: { str: 18, vit: 16, cha: 14 },
    requiredReputation: 15,
    location: '長山',
    eventText: '趙雲本是公孫瓚部將，見公孫瓚不足與謀，正在尋找明主……',
    recruitmentSuccessText: '趙雲見你氣度不凡，決定追隨！',
    recruitmentFailureText: '趙雲對你還不夠信任。',
    historicalNotes: '趙雲字子龍，常山真定人。原為公孫瓚部將，後投劉備。長坂坡七進七出救阿斗，蜀漢五虎上将之一。',
    rarity: 'rare',
    recruitAfterYear: 198,
  },
  {
    id: 'zhou_yu',
    name: '周瑜',
    title: '美周郎',
    faction: 'liu_bei', // 可短暫相遇（赤壁之戰）
    joinYear: 208,
    leaveYear: 210,
    recruitDifficulty: 15,
    requiredStats: { int: 18, cha: 18, str: 14 },
    requiredReputation: 25,
    location: '赤壁',
    eventText: '建安十三年，赤壁之戰前夕。孫權的都督周瑜正在招募英才……',
    recruitmentSuccessText: '周瑜見你懂兵略，錄你為軍中參謀！',
    recruitmentFailureText: '周瑜認為你不夠格入他法眼。',
    historicalNotes: '周瑜字公瑾，廬江舒人。赤壁之戰大破曹操，與諸葛亮沒有真正過招（那是小說）。210年病逝，年36。',
    rarity: 'legendary',
    requiresFlag: 'allied_with_sun',
    recruitAfterYear: 208,
    recruitBeforeYear: 211,
  },

  // ============================================
  // 孫權陣營
  // ============================================
  {
    id: 'sun_ce',
    name: '孫策',
    title: '小霸王',
    faction: 'sun_quan',
    joinYear: 195,
    leaveYear: 200,
    recruitDifficulty: 12,
    requiredStats: { str: 16, cha: 14 },
    requiredReputation: 10,
    location: '江東',
    eventText: '孫策以父孫堅遺基，掃蕩江東六郡。他英氣勃發，有「小霸王」之稱……',
    recruitmentSuccessText: '孫策豪傑之士，引你為同僚！',
    recruitmentFailureText: '孫策忙於征戰，暫無法收留你。',
    historicalNotes: '孫策字伯符，孫堅長子。195年起兵掃蕩江東，200年被許貢門客刺殺，年25。臨終前以弟孫權代。',
    rarity: 'rare',
    recruitAfterYear: 195,
    recruitBeforeYear: 201,
  },
  {
    id: 'sun_qian',
    name: '孫權',
    title: '吳大帝',
    faction: 'sun_quan',
    joinYear: 200,
    leaveYear: 252,
    recruitDifficulty: 13,
    requiredStats: { cha: 16, int: 14 },
    requiredReputation: 20,
    location: '會稽',
    eventText: '孫權繼承兄長孫策之位，廣納賢才。他善於用人，知人善任……',
    recruitmentSuccessText: '孫權愛才，錄你為麾下謀士！',
    recruitmentFailureText: '孫權認為你還需磨練。',
    historicalNotes: '孫權字仲謀，孫堅次子。229年稱帝建吳，在位長達數十年。',
    rarity: 'legendary',
    requiresFlag: 'sun_ce_dead',
    recruitAfterYear: 200,
  },
  {
    id: 'lu_xun',
    name: '陸遜',
    title: '白衣秀士',
    faction: 'sun_quan',
    joinYear: 208,
    leaveYear: 245,
    recruitDifficulty: 14,
    requiredStats: { int: 18, cha: 16 },
    requiredReputation: 20,
    location: '吳郡',
    eventText: '陸遜出身吳郡陸氏，年輕時便才名遠播。他現在孫權帳下謀劃軍機……',
    recruitmentSuccessText: '陸遜見你談吐不凡，引為同僚！',
    recruitmentFailureText: '陸遜對你還有所保留。',
    historicalNotes: '陸遜字伯言，吳郡吳人。夷陵之戰以火攻大敗劉備，是吳國最重要的將領之一。',
    rarity: 'rare',
    requiresFlag: 'in_wu',
    recruitAfterYear: 208,
  },

  // ============================================
  // 袁紹陣營
  // ============================================
  {
    id: 'tuan_wei',
    name: '田豐',
    title: '河北謀主',
    faction: 'yuan_shao',
    joinYear: 190,
    leaveYear: 200,
    recruitDifficulty: 13,
    requiredStats: { int: 17, cha: 14 },
    requiredReputation: 20,
    location: '鄴城',
    eventText: '田豐是袁紹最重要的謀士，他剛直敢言，屢諫袁紹……',
    recruitmentSuccessText: '田豐引你為志同道合之士！',
    recruitmentFailureText: '田豐認為袁紹不足與謀。',
    historicalNotes: '田豐字元皓，鉅鹿人。袁紹的「河北謀主」，官渡之戰前力勸袁紹不打，不被採納，後被袁紹杀害。',
    rarity: 'rare',
    recruitAfterYear: 190,
    recruitBeforeYear: 201,
  },
  {
    id: 'guo_tu',
    name: '郭圖',
    title: '袁紹謀臣',
    faction: 'yuan_shao',
    joinYear: 190,
    leaveYear: 200,
    recruitDifficulty: 11,
    requiredStats: { int: 14, cha: 12 },
    requiredReputation: 15,
    location: '鄴城',
    eventText: '郭圖是袁帳下謀士，為人陰險，喜進讒言……',
    recruitmentSuccessText: '郭圖見你善於權謀，引你為同道！',
    recruitmentFailureText: '郭圖對你不夠信任。',
    historicalNotes: '郭圖字公則，袁紹謀臣。官渡之戰進讒言導致袁紹失敗，田豐因此被杀。',
    rarity: 'uncommon',
    recruitAfterYear: 190,
    recruitBeforeYear: 201,
  },

  // ============================================
  // 獨立/游擊路線
  // ============================================
  {
    id: 'cui_yuan',
    name: '崔瑗後人',
    title: '書法名門',
    faction: 'independent',
    joinYear: 190,
    leaveYear: 220,
    recruitDifficulty: 8,
    requiredStats: { int: 12 },
    requiredReputation: 5,
    location: '各地',
    eventText: '你旅途中遇到一個書法世家子弟，他想找你切磋筆法……',
    recruitmentSuccessText: '你們成了莫逆之交，他傳授你書法心得！',
    recruitmentFailureText: '你們各自散去。',
    historicalNotes: '崔瑗是東漢著名書法家，其子崔寔著《四民月令》。這裡代表各種文人雅士。',
    rarity: 'common',
  },
  {
    id: 'merchant_navigator',
    name: '西域商人',
    title: '胡商首領',
    faction: 'independent',
    joinYear: 190,
    leaveYear: 220,
    recruitDifficulty: 8,
    requiredStats: { lck: 12 },
    requiredReputation: 5,
    location: '洛陽',
    eventText: '一位西域商人看中你的眼光，邀請你一起做生意……',
    recruitmentSuccessText: '你跟著胡商賺了第一桶金！',
    recruitmentFailureText: '你婉拒了胡商的好意。',
    historicalNotes: '三國時期絲綢之路依然繁忙，西域商人活躍於洛陽等地。',
    rarity: 'common',
  },
];

// ============================================
// 歷史人物相遇事件模板
// ============================================
export function generateRecruitmentEvent(
  person: HistoricalPerson,
  currentYear: number,
  playerFaction: string,
  hasFlag: (flag: string) => boolean
): { event: GameEvent; available: boolean } {
  const canMeet = canMeetHistoricalPerson(person, currentYear, playerFaction, hasFlag);

  if (!canMeet.available) {
    return { event: null as any, available: false };
  }

  const event: GameEvent = {
    id: `recruit_${person.id}_${person.joinYear}`,
    title: `拜訪${person.name}（${person.title}）`,
    description: `${person.eventText}`,
    era: getEraForYear(currentYear),
    year: currentYear,
    type: 'historical',
    rarity: person.rarity,
    minAge: 16,
    maxAge: 60,
    stage: 'young_adult',
    priority: person.rarity === 'legendary' ? 200 : 100,
    requirements: {
      minReputation: person.requiredReputation,
    },
    choices: [
      {
        text: `拜訪${person.name}，毛遂自薦`,
        description: '你決定親自登門拜訪，表達投效之意。',
        statCheck: person.requiredStats.cha ? 'cha' : 'int',
        difficulty: person.recruitDifficulty,
        effects: {
          flag: `met_${person.id}`,
          reputation: 5,
          gold: -5,
        },
        successText: person.recruitmentSuccessText,
        failureText: person.recruitmentFailureText,
        successEffects: {
          companions: [{ id: person.id, action: 'join' }],
          exp: 50,
          butterflyEffects: [
            { type: 'diplomatic', target: person.faction, impact: 'positive', value: 5 },
          ],
        },
        failureEffects: {
          reputation: -3,
          gold: -10,
        },
      },
      {
        text: '先觀察再決定',
        description: '你不急於行動，先了解此人背景。',
        effects: {
          stats: { int: 2, lck: 1 },
          reputation: 3,
        },
      },
      {
        text: '不感興趣',
        description: '你覺得此人不足為懼，轉而尋找其他機會。',
        effects: {
          stats: { vit: 1 },
        },
      },
    ],
  };

  return { event, available: true };
}

// ============================================
// 判斷是否可以遇到此歷史人物
// ============================================
function canMeetHistoricalPerson(
  person: HistoricalPerson,
  currentYear: number,
  playerFaction: string,
  hasFlag: (flag: string) => boolean
): { available: boolean; reason?: string } {
  // 檢查年份範圍
  if (currentYear < person.joinYear) {
    return { available: false, reason: `此人最早${person.joinYear}年才出現` };
  }
  if (person.leaveYear && currentYear > person.leaveYear) {
    return { available: false, reason: `此人${person.leaveYear}年已${person.leaveYear ? '離世/離開' : '離開'}` };
  }
  if (person.recruitAfterYear && currentYear < person.recruitAfterYear) {
    return { available: false, reason: `需${person.recruitAfterYear}年後才可相遇` };
  }
  if (person.recruitBeforeYear && currentYear > person.recruitBeforeYear) {
    return { available: false, reason: `需${person.recruitBeforeYear}年前才可相遇` };
  }

  // 檢查特殊 flag
  if (person.requiresFlag && !hasFlag(person.requiresFlag)) {
    return { available: false, reason: `需要滿足特定條件（${person.requiresFlag}）` };
  }

  // 檢查陣營限制
  if (person.requiredFaction && person.requiredFaction !== playerFaction) {
    return { available: false, reason: `需已投靠${getFactionName(person.requiredFaction)}` };
  }

  return { available: true };
}

function getEraForYear(year: number): string {
  // 必須與 ERAS 定義（types/game.ts）一致，否則事件過濾會永远不匹配
  if (year <= 188) return 'huangjin';
  if (year <= 195) return 'dongzhuo';
  if (year <= 199) return 'qunxiong';
  if (year <= 207) return 'guandu';
  if (year <= 219) return 'chibi';
  return 'dingli';
}

function getFactionName(faction: string): string {
  const names: Record<string, string> = {
    none: '獨立',
    han: '漢廷',
    wei: '曹操',
    shu: '劉備',
    wu: '孫權',
    independent: '獨立',
    yuan_shao: '袁紹',
    dong_zhuo: '董卓',
    luan_bu: '呂布',
    liu_biao: '劉表',
    ma_teng: '馬騰',
    gongsun_zhang: '公孫瓚',
    yang_xu: '楊阜',
    zhang_liao_pre: '張遼(呂布麾下)',
    zu_lang: '祖郎',
  };
  return names[faction] || faction;
}
