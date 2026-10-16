import { GameEvent } from '@/types/game';

// ============================================
// 黃巾起義事件 (184)
// ============================================
export const HJ_EVENTS: GameEvent[] = [
  {
    id: 'huangjin_start',
    title: '黃巾起義',
    description: '中平元年，黃巾賊起，天下大亂。張角以「天公將軍」之名，聚眾百萬，烽火連天。你身處這個動盪的時代，必須做出自己的選擇。',
    era: 'huangjin',
    year: 184,
    minAge: 16,
    maxAge: 40,
    type: 'historical',
    rarity: 'rare',
    stage: 'teen',
    priority: 100,
    butterflyEffects: [
      { type: 'military', target: '漢廷', impact: 'negative', value: 5 },
      { type: 'political', target: '董卓', impact: 'positive', value: 4 },
    ],
    choices: [
      {
        text: '加入官軍，平定黃巾',
        description: '響應朝廷號召，加入官軍平叛。',
        effects: {
          reputation: 10,
          stats: { str: 2 },
          exp: 30,
          butterflyEffects: [
            { type: 'military', target: '漢廷', impact: 'positive', value: 3 },
          ],
        },
      },
      {
        text: '加入黃巾軍',
        description: '同情百姓苦難，加入黃巾軍。',
        effects: {
          stats: { lck: -5, cha: -3 },
          gold: 10,
          butterflyEffects: [
            { type: 'political', target: '黃巾', impact: 'positive', value: 6 },
          ],
        },
      },
      {
        text: '隱居鄉里，明哲保身',
        description: '不問政事，守護家園。',
        effects: {
          stats: { vit: 2, lck: 3 },
          butterflyEffects: [
            { type: 'cultural', target: '鄉里', impact: 'positive', value: 2 },
          ],
        },
      },
    ],
  },
  {
    id: 'huangjin_battle1',
    title: '青州戰役',
    description: '黃巾軍攻陷青州，刺史焦觸戰死。青州百姓流離失所，你決定...',
    era: 'huangjin',
    year: 184,
    minAge: 18,
    maxAge: 45,
    type: 'choice',
    rarity: 'common',
    stage: 'young_adult',
    choices: [
      {
        text: '率領鄉勇抵抗',
        description: '組織當地百姓抵抗黃巾軍。',
        statCheck: 'str',
        difficulty: 12,
        effects: {
          stats: { str: 3, vit: -1 },
          reputation: 5,
          butterflyEffects: [
            { type: 'military', target: '青州', impact: 'positive', value: 4 },
          ],
        },
        successText: '【率領鄉勇】成功擊退黃巾！士氣大振！',
        successEffects: { reputation: 5, exp: 15 },
        failureText: '【率領鄉勇】武力不足，鄉勇潰散！你被迫撤退，受傷頗重...',
        failureEffects: { stats: { vit: -3 }, reputation: -5 },
      },
      {
        text: '帶領百姓避難',
        description: '帶領鄉親逃離戰火。',
        effects: {
          stats: { cha: 3, lck: 2 },
          gold: -5,
          butterflyEffects: [
            { type: 'diplomatic', target: '青州', impact: 'positive', value: 3 },
          ],
        },
      },
      {
        text: '趁亂劫掠',
        description: '天下大亂，趁機撈一票。',
        effects: {
          stats: { lck: -3 },
          gold: 20,
          reputation: -10,
          butterflyEffects: [
            { type: 'political', target: '青州', impact: 'negative', value: 4 },
          ],
        },
      },
    ],
  },
  {
    id: 'huangjin_liu_guan_zhang',
    title: '桃園結義',
    description: '你在涿郡遇見劉備、關羽、張飛三人，他們正在招募義勇軍平定黃巾。',
    era: 'huangjin',
    year: 184,
    minAge: 16,
    maxAge: 35,
    type: 'choice',
    rarity: 'rare',
    stage: 'teen',
    choices: [
      {
        text: '加入他們，共圖大業',
        description: '三人的仁義之名名震天下。',
        effects: {
          stats: { cha: 5, str: 3 },
          reputation: 15,
          companions: [{ id: 'liubei', action: 'join' }],
          exp: 50,
          butterflyEffects: [
            { type: 'diplomatic', target: '蜀', impact: 'positive', value: 5 },
          ],
        },
      },
      {
        text: '向他效忠',
        description: '認定他是明主，願為其效力。',
        effects: {
          stats: { lck: 3, int: 2 },
          reputation: 8,
          companions: [{ id: 'liubei', action: 'join' }],
          exp: 30,
          butterflyEffects: [
            { type: 'political', target: '蜀', impact: 'positive', value: 4 },
          ],
        },
      },
      {
        text: '保持距離',
        description: '不與任何人結盟，保持獨立。',
        effects: {
          stats: { vit: 2, lck: 2 },
          butterflyEffects: [
            { type: 'diplomatic', target: '蜀', impact: 'negative', value: 2 },
          ],
        },
      },
    ],
  },
];

// ============================================
// 董卓暴政事件 (189-192)
// ============================================
export const DONGZHUO_EVENTS: GameEvent[] = [
  {
    id: 'dongzhuo_tyrant',
    title: '董卓暴政',
    description: '董卓殘暴不仁，焚燒洛陽，屠殺百姓。民不聊生，怨聲載道。你目睹百姓流離失所...',
    era: 'dongzhuo',
    year: 190,
    minAge: 14,
    maxAge: 45,
    type: 'choice',
    rarity: 'rare',
    stage: 'teen',
    choices: [
      {
        text: '招募義勇，拯救百姓',
        description: '挺身而出，拯救蒼生。',
        effects: {
          stats: { cha: 3, vit: 1 },
          reputation: 20,
          exp: 40,
          butterflyEffects: [{ type: 'cultural', target: '百姓', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '加入討董義軍',
        description: '響應十八路諸侯討伐董卓。',
        effects: {
          stats: { str: 4, int: 2 },
          reputation: 15,
          gold: -10,
          exp: 50,
          butterflyEffects: [{ type: 'military', target: '董卓', impact: 'negative', value: 4 }],
        },
      },
      {
        text: '明哲保身',
        description: '不涉紛爭，守護家園。',
        effects: {
          stats: { vit: 2 },
          butterflyEffects: [{ type: 'economic', target: '家園', impact: 'positive', value: 2 }],
        },
      },
    ],
  },
  {
    id: 'dongzhuo_chenming',
    title: '長安建都',
    description: '董卓強行遷都長安，焚燒洛陽二百餘里。你被迫隨遷都隊伍離開故鄉...',
    era: 'dongzhuo',
    year: 190,
    minAge: 12,
    maxAge: 50,
    type: 'choice',
    rarity: 'common',
    stage: 'teen',
    choices: [
      {
        text: '沿途救助災民',
        description: '雖然艱難，但仍幫助需要幫助的人。',
        effects: {
          stats: { cha: 4, vit: -2 },
          reputation: 10,
          exp: 30,
          butterflyEffects: [{ type: 'cultural', target: '災民', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '趁亂逃離',
        description: '趁遷都混亂，悄悄逃回故鄉。',
        effects: {
          stats: { lck: 3, vit: -1 },
          butterflyEffects: [{ type: 'diplomatic', target: '洛陽', impact: 'positive', value: 2 }],
        },
      },
      {
        text: '服從遷都',
        description: '順應形勢，前往長安。',
        effects: {
          stats: { vit: 1 },
          gold: -5,
          butterflyEffects: [{ type: 'political', target: '董卓', impact: 'positive', value: 2 }],
        },
      },
    ],
  },
  {
    id: 'dongzhuo_wangyun',
    title: '王允佈局',
    description: '司徒王允設下連環計，欲用貂蟬離間董卓與呂布。消息傳入你的耳中...',
    era: 'dongzhuo',
    year: 191,
    minAge: 16,
    maxAge: 40,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '協助王允',
        description: '幫助王允完成刺殺董卓的計劃。',
        effects: {
          stats: { int: 4, cha: 3 },
          reputation: 12,
          exp: 60,
          butterflyEffects: [{ type: 'political', target: '反董', impact: 'positive', value: 6 }],
        },
      },
      {
        text: '暗中向董卓報信',
        description: '向董卓告密，獲取信任。',
        effects: {
          stats: { lck: -3 },
          reputation: -15,
          gold: 20,
          butterflyEffects: [{ type: 'political', target: '董卓', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '置身事外',
        description: '不參與權力鬥爭。',
        effects: {
          stats: { vit: 2, lck: 2 },
          butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'positive', value: 2 }],
        },
      },
    ],
  },
  {
    id: 'dongzhuo_lvbu',
    title: '呂布歸附',
    description: '呂布因與董卓不和，率領部曲投奔你所在的勢力。你該如何處置這位天下猛將？',
    era: 'dongzhuo',
    year: 192,
    minAge: 18,
    maxAge: 40,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '收留呂布，共同進退',
        description: '呂布雖然反覆無常，但武力天下無雙。',
        effects: {
          stats: { str: 3, lck: 2 },
          reputation: 10,
          exp: 50,
          gold: 30,
          companions: [{ id: 'lvbu', action: 'join' }],
          butterflyEffects: [{ type: 'military', target: '己方', impact: 'positive', value: 6 }],
        },
        successText: '呂布歸附！軍力大增！',
      },
      {
        text: '禮送呂布前往其他地方',
        description: '避免結怨，將呂布引薦給其他勢力。',
        effects: {
          stats: { cha: 4, int: 2 },
          reputation: 5,
          butterflyEffects: [{ type: 'diplomatic', target: '各方', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '婉拒呂布',
        description: '呂布反覆無常，不如不招惹。',
        effects: {
          stats: { int: 2, vit: 1 },
          butterflyEffects: [{ type: 'political', target: '各方', impact: 'neutral', value: 1 }],
        },
      },
    ],
  },
  {
    id: 'dongzhuo_jieda',
    title: '結義兄弟',
    description: '在亂世中，你與志同道合的夥伴結為異姓兄弟，誓言同生共死。',
    era: 'dongzhuo',
    year: 191,
    minAge: 16,
    maxAge: 35,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'young_adult',
    choices: [
      {
        text: '與武勇之士結義',
        description: '尋找能並肩作戰的勇士。',
        effects: {
          stats: { str: 4, vit: 2 },
          reputation: 8,
          exp: 30,
          companions: [{ id: 'brot1', action: 'join' }],
          butterflyEffects: [{ type: 'military', target: '結義', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '與智謀之士結義',
        description: '尋求智略上的夥伴。',
        effects: {
          stats: { int: 4, cha: 2 },
          reputation: 10,
          exp: 40,
          companions: [{ id: 'brot2', action: 'join' }],
          butterflyEffects: [{ type: 'political', target: '結義', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '不結義，獨自行動',
        description: '孤身一人更靈活。',
        effects: {
          stats: { lck: 2, vit: 2 },
          butterflyEffects: [{ type: 'diplomatic', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
    ],
  },
];

// ============================================
// 群雄割據事件 (192-196)
// ============================================
export const QUNXIONG_EVENTS: GameEvent[] = [
  {
    id: 'qunxiong_caocao',
    title: '曹操起兵',
    description: '曹操在陳留散盡家財，招募義勇，起兵討伐董卓。你聽說他要招募人才...',
    era: 'dongzhuo',
    year: 192,
    minAge: 16,
    maxAge: 40,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '投奔曹操',
        description: '曹操雖非名門出身，但才略過人。',
        effects: {
          stats: { int: 3, str: 2 },
          reputation: 8,
          exp: 40,
          gold: 10,
          companions: [{ id: 'caocao', action: 'join' }],
          butterflyEffects: [{ type: 'military', target: '曹操', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '保持距離，觀望形勢',
        description: '不急著站隊，觀察曹操的發展。',
        effects: {
          stats: { int: 2, lck: 2 },
          butterflyEffects: [{ type: 'diplomatic', target: '各方', impact: 'neutral', value: 1 }],
        },
      },
      {
        text: '加入其他勢力',
        description: '選擇其他更有潛力的主公。',
        effects: {
          stats: { lck: -2 },
          reputation: 5,
          exp: 30,
          butterflyEffects: [{ type: 'political', target: '其他', impact: 'positive', value: 3 }],
        },
      },
    ],
  },
  {
    id: 'qunxiong_guandu_prep',
    title: '青州兵事件',
    description: '青州黃巾降眾數十萬，曹操欲收編為軍。這將改變北方勢力格局...',
    era: 'dongzhuo',
    year: 192,
    minAge: 16,
    maxAge: 45,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '支持曹操收編',
        description: '黃巾降眾可以成為強大的兵力。',
        effects: {
          stats: { str: 3, int: 2 },
          reputation: 10,
          exp: 60,
          gold: 15,
          butterflyEffects: [{ type: 'military', target: '曹操', impact: 'positive', value: 5 }],
        },
      },
      {
        text: '勸阻曹操，擔心黃巾反覆',
        description: '黃巾降眾難信，不如不放。',
        effects: {
          stats: { int: 3, vit: 2 },
          reputation: -5,
          exp: 20,
          butterflyEffects: [{ type: 'political', target: '曹操', impact: 'negative', value: 3 }],
        },
      },
      {
        text: '趁機自立門戶',
        description: '在混亂中招募自己的軍隊。',
        effects: {
          stats: { str: 4, lck: -3 },
          reputation: -10,
          gold: -30,
          exp: 40,
          companions: [{ id: 'army1', action: 'join' }],
          butterflyEffects: [{ type: 'military', target: '自立', impact: 'positive', value: 4 }],
        },
      },
    ],
  },
  {
    id: 'qunxiong_sunce',
    title: '孫策平江東',
    description: '孫策以父喪所得的玉璽為質，向袁術借得兵馬，開始平定江東六郡...',
    era: 'dongzhuo',
    year: 195,
    minAge: 16,
    maxAge: 40,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'young_adult',
    choices: [
      {
        text: '投奔孫策',
        description: '小霸王英武過人，前途不可限量。',
        effects: {
          stats: { str: 3, int: 2 },
          reputation: 12,
          exp: 50,
          gold: 20,
          butterflyEffects: [{ type: 'military', target: '孫策', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '留在北方，觀望形勢',
        description: '北方才是天下重心。',
        effects: {
          stats: { int: 2 },
          butterflyEffects: [{ type: 'political', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
      {
        text: '南下探險',
        description: '去看看富庶的江南。',
        effects: {
          stats: { lck: 3, cha: 2 },
          gold: -10,
          exp: 30,
          butterflyEffects: [{ type: 'cultural', target: '江東', impact: 'positive', value: 3 }],
        },
      },
    ],
  },
  {
    id: 'qunxiong_liubei',
    title: '劉備賣履',
    description: '劉備目前淪落到在涿郡賣草鞋為生。你聽說他要招募義勇軍...',
    era: 'dongzhuo',
    year: 194,
    minAge: 16,
    maxAge: 35,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'young_adult',
    choices: [
      {
        text: '投資劉備',
        description: '英雄不拘小節，他日必成大器。',
        effects: {
          stats: { cha: 5, lck: 3 },
          reputation: 15,
          gold: -15,
          exp: 40,
          butterflyEffects: [{ type: 'political', target: '劉備', impact: 'positive', value: 5 }],
        },
      },
      {
        text: '加入義勇軍',
        description: '跟隨這位中山靖王之後。',
        effects: {
          stats: { str: 3, vit: 2 },
          reputation: 8,
          exp: 30,
          butterflyEffects: [{ type: 'political', target: '劉備', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '無視',
        description: '賣草鞋的人能成什麼氣候？',
        effects: {
          stats: { lck: -2 },
          butterflyEffects: [{ type: 'political', target: '劉備', impact: 'negative', value: 1 }],
        },
      },
    ],
  },
  {
    id: 'qunxiong_liu_biao',
    title: '劉表據荊州',
    description: '荊州牧劉表治理有方，荊州成為乱世中的一方樂土。許多士人名士避難至此...',
    era: 'dongzhuo',
    year: 193,
    minAge: 14,
    maxAge: 50,
    type: 'choice',
    rarity: 'common',
    stage: 'teen',
    choices: [
      {
        text: '定居荊州',
        description: '學習劉表的治理之道。',
        effects: {
          stats: { int: 4, cha: 2 },
          reputation: 10,
          gold: 5,
          exp: 50,
          butterflyEffects: [{ type: 'cultural', target: '荊州', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '在荊州經商',
        description: '荊州富庶，商機無限。',
        effects: {
          stats: { lck: 3, int: 3 },
          gold: 25,
          reputation: 5,
          butterflyEffects: [{ type: 'economic', target: '荊州', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '不感兴趣，繼續前行',
        description: '荊州雖好，但不是你的目標。',
        effects: {
          stats: { str: 2, lck: 1 },
          butterflyEffects: [{ type: 'diplomatic', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
    ],
  },
  {
    id: 'qunxiong_xun_yu',
    title: '荀彧薦才',
    description: '曹操麾下謀士荀彧推薦你為治中從事。這將是你進入曹操幕府的最佳機會...',
    era: 'dongzhuo',
    year: 194,
    minAge: 18,
    maxAge: 35,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '接受推薦，效力曹操',
        description: '荀彧是曹操的首席謀士，推薦意味不同。',
        effects: {
          stats: { int: 4, cha: 3 },
          reputation: 15,
          exp: 60,
          gold: 20,
          butterflyEffects: [{ type: 'political', target: '曹操', impact: 'positive', value: 5 }],
        },
      },
      {
        text: '推辭，保持獨立',
        description: '不願依附他人。',
        effects: {
          stats: { lck: 2, vit: 2 },
          butterflyEffects: [{ type: 'political', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
      {
        text: '推薦其他人選',
        description: '推薦其他人才給荀彧。',
        effects: {
          stats: { cha: 3, int: 2 },
          reputation: 8,
          exp: 20,
          butterflyEffects: [{ type: 'political', target: '各方', impact: 'positive', value: 3 }],
        },
      },
    ],
  },
];

// ============================================
// 官渡之戰事件 (200-207)
// ============================================
export const GUANDU_EVENTS: GameEvent[] = [
  {
    id: 'guandu_tuntian',
    title: '曹操屯田',
    description: '曹操在許都推行屯田制，解決軍糧問題。這將深刻影響北方局勢...',
    era: 'guandu',
    year: 200,
    minAge: 16,
    maxAge: 50,
    type: 'choice',
    rarity: 'common',
    stage: 'young_adult',
    choices: [
      {
        text: '加入屯田團隊',
        description: '學習先進的農耕技術。',
        effects: { stats: { int: 3, vit: 2 }, gold: 20, exp: 30, butterflyEffects: [{ type: 'economic', target: '自身', impact: 'positive', value: 5 }] },
      },
      {
        text: '協助曹操推行屯田',
        description: '加入曹操的屯田團隊。',
        effects: { stats: { int: 3, cha: 2 }, reputation: 8, gold: 15, exp: 40, butterflyEffects: [{ type: 'economic', target: '曹操', impact: 'positive', value: 4 }] },
      },
      {
        text: '不理會',
        description: '這不是你的事。',
        effects: { stats: { vit: 2 }, butterflyEffects: [{ type: 'economic', target: '自身', impact: 'neutral', value: 1 }] },
      },
    ],
  },
  {
    id: 'guandu_emperor',
    title: '曹操迎駕',
    description: '曹操率軍迎漢獻帝入許都，「挾天子以令諸侯」。天下格局從此改變...',
    era: 'qunxiong',
    year: 196,
    minAge: 16,
    maxAge: 40,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '堅決反對',
        description: '這是篡逆之行！',
        effects: { stats: { cha: 4, int: 2 }, reputation: 10, gold: -15, exp: 30, butterflyEffects: [{ type: 'political', target: '漢廷', impact: 'positive', value: 6 }] },
      },
      {
        text: '順應形勢，擁戴曹操',
        description: '挾天子以令諸侯是明智之舉。',
        effects: { stats: { int: 3, lck: 2 }, reputation: -8, gold: 10, exp: 40, butterflyEffects: [{ type: 'political', target: '曹操', impact: 'positive', value: 5 }] },
      },
      {
        text: '保持中立',
        description: '誰贏就幫誰。',
        effects: { stats: { lck: 2, cha: 2 }, butterflyEffects: [{ type: 'political', target: '各方', impact: 'neutral', value: 1 }] },
      },
    ],
  },
  {
    id: 'guandu_zhangliao',
    title: '張遼歸附',
    description: '東郡太守張遼在夏侯惇麾下效力，你的表現吸引了張遼的注意...',
    era: 'guandu',
    year: 201,
    minAge: 18,
    maxAge: 40,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'young_adult',
    choices: [
      {
        text: '與張遼論武',
        description: '以武藝折服對方。',
        effects: { stats: { str: 4, vit: 2 }, reputation: 10, exp: 30, butterflyEffects: [{ type: 'military', target: '張遼', impact: 'positive', value: 4 }] },
      },
      {
        text: '與張遼論兵法',
        description: '以學識折服對方。',
        effects: { stats: { int: 4, cha: 2 }, reputation: 8, exp: 40, butterflyEffects: [{ type: 'political', target: '張遼', impact: 'positive', value: 4 }] },
      },
      {
        text: '禮讓張遼',
        description: '將機會讓給其他人。',
        effects: { stats: { cha: 3, lck: 2 }, reputation: 5, butterflyEffects: [{ type: 'diplomatic', target: '各方', impact: 'positive', value: 2 }] },
      },
    ],
  },
  {
    id: 'guandu_bingfa',
    title: '學習兵書',
    description: '你在書中讀到了孫武的《孫子兵法》和吳起的《吳子》。這些兵書將對你產生深遠影響...',
    era: 'guandu',
    year: 202,
    minAge: 12,
    maxAge: 45,
    type: 'choice',
    rarity: 'common',
    stage: 'teen',
    choices: [
      {
        text: '研讀《孫子兵法》',
        description: '學習孫武的戰略思想。',
        effects: { stats: { int: 4, cha: 2 }, exp: 30, butterflyEffects: [{ type: 'military', target: '自身', impact: 'positive', value: 3 }] },
      },
      {
        text: '研讀《吳子》',
        description: '學習吳起的治軍之道。',
        effects: { stats: { str: 2, int: 4 }, exp: 30, butterflyEffects: [{ type: 'military', target: '自身', impact: 'positive', value: 3 }] },
      },
      {
        text: '博覽群書',
        description: '不偏廢，廣泛學習。',
        effects: { stats: { int: 3, lck: 1 }, exp: 20, butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'positive', value: 2 }] },
      },
    ],
  },
  {
    id: 'guandu_jixu',
    title: '吉平毒藥',
    description: '太醫吉平密謀在曹操的粥中下毒。消息走漏，吉平被曹操處死。你是否參與此計？',
    era: 'guandu',
    year: 200,
    minAge: 16,
    maxAge: 35,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '協助下毒',
        description: '這是報國的好機會！',
        effects: { stats: { int: 5, cha: 3 }, gold: -10, exp: 80, butterflyEffects: [{ type: 'political', target: '曹操', impact: 'negative', value: 6 }] },
        successText: '曹操中計！天下為之一震！',
        successEffects: { exp: 100, reputation: 20 },
        failureEffects: { stats: { vit: -3 }, reputation: -15 },
        failureText: '計謀敗露，被曹操追捕！',
      },
      {
        text: '勸阻吉平',
        description: '這不是明智之舉。',
        effects: { stats: { int: 3, lck: 2 }, reputation: 5, butterflyEffects: [{ type: 'political', target: '各方', impact: 'neutral', value: 1 }] },
      },
      {
        text: '事不關己',
        description: '不參與政治暗殺。',
        effects: { stats: { lck: 2 }, butterflyEffects: [{ type: 'political', target: '自身', impact: 'neutral', value: 1 }] },
      },
    ],
  },
  {
    id: 'guandu_battle',
    title: '官渡決戰',
    description: '建安五年，曹操與袁紹決戰於官渡。袁軍七十萬（號稱），曹軍兵少糧缺。許攸獻策奇襲烏巢糧倉，曹操親率精騎夜襲，火燒袁軍糧草，袁軍大潰！',
    era: 'guandu',
    year: 200,
    minAge: 16,
    maxAge: 50,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '隨軍奇襲烏巢',
        description: '與曹操共賭此戰，奇襲糧倉！',
        effects: { stats: { str: 5, lck: 2 }, reputation: 15, exp: 70, butterflyEffects: [{ type: 'military', target: '袁紹', impact: 'negative', value: 7 }] },
        statCheck: 'str',
        difficulty: 13,
        successText: '【奇襲烏巢】火起烏巢，袁軍七十萬不戰自亂！你陣前斬將，名震中原！',
        successEffects: { reputation: 20, exp: 50 },
        failureText: '【奇襲烏巢】袁軍救兵已至，你陷於重圍，身被數創，突圍而出...',
        failureEffects: { stats: { vit: -5 }, reputation: -5 },
      },
      {
        text: '死守大營',
        description: '前線兇險，穩守為上。',
        effects: { stats: { vit: 3, int: 1 }, reputation: 3, exp: 25, butterflyEffects: [{ type: 'military', target: '曹操', impact: 'neutral', value: 1 }] },
      },
      {
        text: '暗中投靠袁紹',
        description: '袁本初四世三公，兵多將廣，似乎更可信。',
        effects: { stats: { lck: -2 }, gold: 30, reputation: -8, exp: 20, butterflyEffects: [{ type: 'political', target: '袁紹', impact: 'positive', value: 4 }] },
      }
    ],
  },
  {
    id: 'guandu_guo_jia',
    title: '郭嘉遺計',
    description: '郭嘉病重。這位曹操最倚重的鬼才謀士，臨終留下平定遼東之計：「公遠征遼東，袁尚兄弟性命懸於一線，不可逼急，急則併力拒守，緩則相圖。」',
    era: 'guandu',
    year: 207,
    minAge: 16,
    maxAge: 50,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '探望郭嘉，聆教益',
        description: '鬼才臨終之言，字字千金。',
        effects: { stats: { int: 5 }, exp: 60, reputation: 5, butterflyEffects: [{ type: 'cultural', target: '郭嘉', impact: 'positive', value: 5 }] },
      },
      {
        text: '將遺計轉呈曹操',
        description: '讓奇計不被埋沒。',
        effects: { stats: { cha: 2, int: 2 }, reputation: 10, exp: 40, butterflyEffects: [{ type: 'political', target: '曹操', impact: 'positive', value: 4 }] },
      },
      {
        text: '明哲保身',
        description: '卷入繼承之爭恐有滅門之禍。',
        effects: { stats: { lck: 2, vit: 1 }, exp: 10, butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'neutral', value: 1 }] },
      }
    ],
  },
  {
    id: 'guandu_threervisit',
    title: '三顧茅廬',
    description: '玄德三顧隆中，方見臥龍。諸葛亮隆中對：「先取荊州，後取益州，外結孫權，內修政理，則霸業可成，漢室可興。」',
    era: 'guandu',
    year: 207,
    minAge: 16,
    maxAge: 50,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '隨玄德三顧茅廬',
        description: '求賢若渴，千古佳話。',
        effects: { stats: { cha: 4, int: 2 }, reputation: 10, exp: 60, butterflyEffects: [{ type: 'political', target: '劉備', impact: 'positive', value: 6 }] },
      },
      {
        text: '往隆中一睹諸葛風采',
        description: '臥龍、鳳雛，得一可安天下。',
        effects: { stats: { int: 4, lck: 1 }, exp: 50, butterflyEffects: [{ type: 'cultural', target: '諸葛亮', impact: 'positive', value: 4 }] },
      },
      {
        text: '笑諸葛種地為生',
        description: '不過村野书生。',
        effects: { stats: { lck: -1 }, reputation: -3, exp: 5, butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'negative', value: 2 }] },
      }
    ],
  },
];

// ============================================
// 赤壁之戰事件 (208-209)
// ============================================
export const CHIBI_EVENTS: GameEvent[] = [
  {
    id: 'chibi_liubei_flee',
    title: '劉備長坂坡',
    description: '劉備在長坂坡被曹操大軍追擊，情況危急。你正巧在附近...',
    era: 'chibi',
    year: 208,
    minAge: 16,
    maxAge: 40,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '幫助劉備突围',
        description: '仁義之士，當出手相救。',
        effects: { stats: { str: 4, vit: 3 }, reputation: 15, exp: 50, butterflyEffects: [{ type: 'political', target: '諸葛亮', impact: 'positive', value: 5 }] },
      },
      {
        text: '在旁觀摩諸葛亮的談吐',
        description: '學習這位臥龍的見解。',
        effects: { stats: { int: 4, cha: 2 }, reputation: 8, exp: 60, butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'positive', value: 4 }] },
      },
      {
        text: '不感興趣',
        description: '這種事與你無關。',
        effects: { stats: { lck: 1 }, butterflyEffects: [{ type: 'political', target: '自身', impact: 'neutral', value: 1 }] },
      },
    ],
  },
  {
    id: 'chibi_alliance',
    title: '孫劉聯盟',
    description: '諸葛亮只身過江，舌戰群儒，說服孫權與劉備聯手抗曹。你面臨一個重大選擇...',
    era: 'chibi',
    year: 208,
    minAge: 16,
    maxAge: 35,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '全力支持孫劉聯盟',
        description: '只有聯手才能對抗曹操。',
        effects: { stats: { int: 4, cha: 3 }, reputation: 12, exp: 70, butterflyEffects: [{ type: 'military', target: '孫劉聯盟', impact: 'positive', value: 6 }] },
      },
      {
        text: '勸孫權投降',
        description: '抵抗必敗，不如早早歸順。',
        effects: { stats: { lck: -3 }, reputation: -10, gold: 30, exp: 20, butterflyEffects: [{ type: 'political', target: '孫權', impact: 'negative', value: 6 }] },
      },
      {
        text: '保持沉默',
        description: '不表態，觀察形勢。',
        effects: { stats: { lck: 2, vit: 2 }, butterflyEffects: [{ type: 'diplomatic', target: '各方', impact: 'neutral', value: 1 }] },
      },
    ],
  },
  {
    id: 'chibi_fire',
    title: '赤壁火攻',
    description: '赤壁大戰爆發！周瑜的火攻計劃正在執行中。曹軍鐵鎖連環，大火吞噬戰船...',
    era: 'chibi',
    year: 208,
    minAge: 16,
    maxAge: 40,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '奮力殺敵',
        description: '趁亂建功！',
        statCheck: 'str',
        difficulty: 14,
        effects: { stats: { str: 5, vit: -2 }, reputation: 15, exp: 60, butterflyEffects: [{ type: 'military', target: '曹操', impact: 'negative', value: 5 }] },
        successText: '【奮力殺敵】你殺入敵陣，斬敵將首級！戰功卓著！',
        successEffects: { reputation: 10, exp: 30 },
        failureText: '【奮力殺敵】你被敵軍包圍，險些喪命！勉強逃出火海...',
        failureEffects: { stats: { vit: -5 }, reputation: -10, exp: 0 },
      },
      {
        text: '趁火打劫',
        description: '曹軍混亂，撈一票再說！',
        effects: { stats: { lck: 4 }, gold: 40, butterflyEffects: [{ type: 'military', target: '曹操', impact: 'negative', value: 2 }] },
        successText: '你大發戰爭財！獲得了大量物資！',
        failureText: '被曹軍殘部圍攻，險象環生！',
      },
      {
        text: '救濟被火燒傷的士兵',
        description: '無論敵我，都是人命。',
        effects: { stats: { cha: 4, int: 2 }, reputation: 20, exp: 40, butterflyEffects: [{ type: 'cultural', target: '仁義', impact: 'positive', value: 5 }] },
      },
    ],
  },
  {
    id: 'chibi_zhuge_plan',
    title: '諸葛亮借東風',
    description: '周瑜的火攻之計需借東風方能成功。諸葛亮於南屏山築七星壇借風，奇蹟發生了——東風真的來了！',
    era: 'chibi',
    year: 208,
    minAge: 14,
    maxAge: 45,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    requirements: { factionRequired: ['shu', 'wu'] },
    choices: [
      {
        text: '協助諸葛亮',
        description: '這位少年英才令人佩服。',
        effects: { stats: { int: 4, lck: 2 }, reputation: 8, exp: 60, butterflyEffects: [{ type: 'cultural', target: '諸葛亮', impact: 'positive', value: 5 }] },
      },
      {
        text: '暗中調查借東風的真相',
        description: '真的能借風嗎？還是另有籌謀？',
        effects: { stats: { int: 5, cha: 2 }, reputation: -5, exp: 50, butterflyEffects: [{ type: 'cultural', target: '真相', impact: 'positive', value: 3 }] },
      },
      {
        text: '不關心這些',
        description: '與你無關。',
        effects: { stats: { vit: 2 }, butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'neutral', value: 1 }] },
      },
    ],
  },
  {
    id: 'chibi_flee',
    title: '華容道',
    description: '曹操從華容道逃跑，關羽放走了他。這是一個改變三國格局的決定...',
    era: 'chibi',
    year: 208,
    minAge: 18,
    maxAge: 40,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '追擊曹操',
        description: '這是消滅曹操的最好機會！',
        statCheck: 'str',
        difficulty: 16,
        effects: { stats: { str: 4, vit: 3 }, reputation: 10, exp: 80, butterflyEffects: [{ type: 'military', target: '曹操', impact: 'negative', value: 6 }] },
        successText: '【追擊曹操】你成功擊潰曹軍主力！曹操被你斬殺！北方大亂！',
        successEffects: { reputation: 20, exp: 50 },
        failureText: '【追擊曹操】你被曹軍死士包圍，險些喪命！最終撤離...',
        failureEffects: { stats: { vit: -5 }, reputation: -5, exp: 0 },
      },
      {
        text: '理解關羽的決定',
        description: '重義輕利，也是好漢。',
        effects: { stats: { cha: 3, int: 2 }, reputation: 15, exp: 50, butterflyEffects: [{ type: 'political', target: '各方', impact: 'positive', value: 4 }] },
      },
      {
        text: '批評關羽',
        description: '公事私情混為一談是大忌。',
        effects: { stats: { int: 3, lck: -2 }, reputation: -5, butterflyEffects: [{ type: 'political', target: '劉備', impact: 'negative', value: 3 }] },
      },
    ],
  },
  {
    id: 'chibi_economy',
    title: '戰後重建',
    description: '赤壁之戰後，各方勢力都需要休養生息。你決定如何在戰後謀生？',
    era: 'chibi',
    year: 209,
    minAge: 16,
    maxAge: 50,
    type: 'choice',
    rarity: 'common',
    stage: 'young_adult',
    choices: [
      {
        text: '從商',
        description: '戰後物資匱乏，商人獲利。',
        effects: { stats: { int: 3, cha: 2 }, gold: 30, exp: 20, butterflyEffects: [{ type: 'economic', target: '自身', impact: 'positive', value: 3 }] },
      },
      {
        text: '經商貿易',
        description: '戰後物資匱乏，商人獲利。',
        effects: { stats: { lck: 3, int: 3 }, gold: 30, reputation: 5, butterflyEffects: [{ type: 'economic', target: '各方', impact: 'positive', value: 3 }] },
      },
      {
        text: '繼續從軍',
        description: '下一戰即將到來。',
        effects: { stats: { str: 3, vit: 2 }, exp: 30, butterflyEffects: [{ type: 'military', target: '自身', impact: 'positive', value: 3 }] },
      },
    ],
  },
  {
    id: 'chibi_flood',
    title: '水淹七軍',
    description: '建安二十四年，關羽北伐襄樊，秋雨連綿，漢水暴漲。關羽乘船攻之，于禁七軍盡沒，龐德抬棺死戰被斬，威震華夏，曹操議徙許都以避其鋒！',
    era: 'chibi',
    year: 219,
    minAge: 16,
    maxAge: 50,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '於關羽帳下效力',
        description: '關雲長威震華夏，此乃建功良機！',
        effects: { stats: { str: 4, cha: 2 }, reputation: 12, exp: 60, butterflyEffects: [{ type: 'military', target: '關羽', impact: 'positive', value: 6 }] },
        statCheck: 'str',
        difficulty: 13,
        successText: '【水淹七軍】你乘船奮擊，生擒敵將，威名大振！',
        successEffects: { reputation: 15, exp: 40 },
        failureText: '【水淹七軍】洪水洶湧，你落水抱木而逃，狼狽不堪...',
        failureEffects: { stats: { vit: -4 }, reputation: -5 },
      },
      {
        text: '勸關羽提防東吳',
        description: '呂蒙白衣渡江，荊州恐有後顧之憂！',
        effects: { stats: { int: 4 }, reputation: 5, exp: 50, butterflyEffects: [{ type: 'diplomatic', target: '關羽', impact: 'positive', value: 4 }] },
      },
      {
        text: '袖手旁觀',
        description: '神仙打架，凡人遭殃。',
        effects: { stats: { lck: 1 }, exp: 10, butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'neutral', value: 1 }] },
      }
    ],
  },
];

// ============================================
// 三國鼎立事件 (220-223)
// ============================================
export const SANDAI_EVENTS: GameEvent[] = [
  {
    id: 'sandai_wei_found',
    title: '曹丕稱帝',
    description: '延康元年(220年)，曹丕迫使漢獻帝禪讓，建立魏國。三國時代正式開始...',
    era: 'dingli',
    year: 220,
    minAge: 16,
    maxAge: 40,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '效力魏國',
        description: '魏國實力最強，前途可期。',
        effects: { stats: { str: 3, int: 2 }, reputation: 8, exp: 40, gold: 15, butterflyEffects: [{ type: 'military', target: '魏國', impact: 'positive', value: 4 }] },
      },
      {
        text: '尋找機會脫身',
        description: '不想為魏國賣命。',
        effects: { stats: { lck: 3, vit: -1 }, butterflyEffects: [{ type: 'political', target: '自身', impact: 'neutral', value: 1 }] },
      },
      {
        text: '勸阻戰爭',
        description: '戰爭只會帶來苦難。',
        effects: { stats: { cha: 4, int: 3 }, reputation: 5, butterflyEffects: [{ type: 'political', target: '各方', impact: 'positive', value: 2 }] },
      },
    ],
  },
  {
    id: 'sandai_shu_guozhong',
    title: '諸葛亮治蜀',
    description: '諸葛亮在成都制定嚴明的法度，蜀漢國力蒸蒸日上...',
    era: 'dingli',
    year: 221,
    minAge: 16,
    maxAge: 40,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'young_adult',
    choices: [
      {
        text: '學習諸葛亮的治國之道',
        description: '這位年輕的丞相令人敬佩。',
        effects: { stats: { int: 5, cha: 2 }, reputation: 12, exp: 50, butterflyEffects: [{ type: 'political', target: '自身', impact: 'positive', value: 4 }] },
      },
      {
        text: '加入蜀漢政權',
        description: '成為諸葛亮的下属。',
        effects: { stats: { int: 3, cha: 3 }, reputation: 12, gold: 10, exp: 40, butterflyEffects: [{ type: 'political', target: '蜀漢', impact: 'positive', value: 4 }] },
      },
      {
        text: '保持距離',
        description: '不願被卷入政治。',
        effects: { stats: { vit: 2, lck: 2 }, butterflyEffects: [{ type: 'diplomatic', target: '自身', impact: 'neutral', value: 1 }] },
      },
    ],
  },
  {
    id: 'sandai_wu_jiangdong',
    title: '孫權建吳',
    description: '孫權在武昌稱帝，建立吳國。江東士族紛紛效忠...',
    era: 'dingli',
    year: 229,
    minAge: 16,
    maxAge: 35,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'young_adult',
    choices: [
      {
        text: '支持孫權稱帝',
        description: '孫權英明，值得效忠。',
        effects: { stats: { cha: 3, int: 2 }, reputation: 10, gold: 15, exp: 30, butterflyEffects: [{ type: 'political', target: '吳國', impact: 'positive', value: 4 }] },
      },
      {
        text: '觀望三方形勢',
        description: '不急著選邊站。',
        effects: { stats: { int: 3, lck: 2 }, butterflyEffects: [{ type: 'political', target: '各方', impact: 'neutral', value: 1 }] },
      },
      {
        text: '支持劉備',
        description: '漢室正統不容質疑。',
        effects: { stats: { cha: 4, int: 2 }, reputation: 10, exp: 30, butterflyEffects: [{ type: 'political', target: '蜀漢', impact: 'positive', value: 4 }] },
      },
    ],
  },
  {
    id: 'sandai_north_trade',
    title: '北方貿易',
    description: '魏國控制北方，商路通達。你決定從中謀利...',
    era: 'dingli',
    year: 221,
    minAge: 14,
    maxAge: 50,
    type: 'choice',
    rarity: 'common',
    stage: 'young_adult',
    choices: [
      {
        text: '投資絲綢之路',
        description: '西域商路利潤豐厚。',
        effects: { stats: { int: 3, lck: 2 }, gold: 35, exp: 20, butterflyEffects: [{ type: 'economic', target: '魏國', impact: 'positive', value: 3 }] },
      },
      {
        text: '建立自己的商隊',
        description: '自主經商，不依賴他人。',
        effects: { stats: { str: 3, int: 2 }, gold: 20, reputation: 5, exp: 30, butterflyEffects: [{ type: 'economic', target: '各方', impact: 'positive', value: 3 }] },
      },
      {
        text: '經商風險太大',
        description: '還是務實一點。',
        effects: { stats: { vit: 2 }, butterflyEffects: [{ type: 'economic', target: '自身', impact: 'neutral', value: 1 }] },
      },
    ],
  },
  {
    id: 'sandai_scholar',
    title: '名士清談',
    description: '三國名士們聚在一起清談玄學，探討人生哲學。你也受邀參加...',
    era: 'dingli',
    year: 223,
    minAge: 14,
    maxAge: 50,
    type: 'choice',
    rarity: 'common',
    stage: 'young_adult',
    choices: [
      {
        text: '參與清談',
        description: '展現你的學識。',
        effects: { stats: { int: 4, cha: 3 }, reputation: 10, exp: 40, butterflyEffects: [{ type: 'cultural', target: '清談', impact: 'positive', value: 4 }] },
      },
      {
        text: '旁聽學習',
        description: '多聽多學。',
        effects: { stats: { int: 3, cha: 2 }, reputation: 5, exp: 30, butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'positive', value: 3 }] },
      },
      {
        text: '對清談無感',
        description: '這些虛談無益於國事。',
        effects: { stats: { str: 2, vit: 2 }, butterflyEffects: [{ type: 'political', target: '自身', impact: 'neutral', value: 1 }] },
      },
    ],
  },
  {
    id: 'sandai_kongcheng',
    title: '空城計',
    description: '馬謖失街亭，司馬懿大軍十五萬兵臨西城。城中僅二千五百老弱，諸葛亮卻開城門，於城樓撫琴，笑容自若。司馬懿疑有伏兵，引軍退去！',
    era: 'dingli',
    year: 228,
    minAge: 16,
    maxAge: 50,
    type: 'choice',
    rarity: 'rare',
    stage: 'middle',
    choices: [
      {
        text: '城頭陪丞相撫琴',
        description: '千載難逢，與丞相共守此城！',
        effects: { stats: { cha: 3, lck: 2 }, reputation: 10, exp: 50, butterflyEffects: [{ type: 'military', target: '司馬懿', impact: 'negative', value: 4 }] },
        statCheck: 'cha',
        difficulty: 14,
        successText: '【琴音不動】你的琴聲絲毫未亂，魏軍疑心更重，悄然退去！',
        successEffects: { reputation: 12, exp: 30 },
        failureText: '【琴音動搖】你指下微顫，幸而司馬懿多疑退兵，驚出一身冷汗...',
        failureEffects: { stats: { vit: -2, lck: -1 } },
      },
      {
        text: '率老弱虛張聲勢',
        description: '多舉一面旗，多燃一堆火。',
        effects: { stats: { int: 3 }, exp: 35, butterflyEffects: [{ type: 'military', target: '西城', impact: 'positive', value: 3 }] },
      },
      {
        text: '勸丞相棄城',
        description: '留得青山在，不怕沒柴燒。',
        effects: { stats: { vit: 2 }, reputation: -5, exp: 15, butterflyEffects: [{ type: 'military', target: '西城', impact: 'negative', value: 3 }] },
      }
    ],
  },
  {
    id: 'sandai_yi_ling',
    title: '火燒連營',
    description: '章武元年，劉備為報關羽之仇，親率七十萬大軍伐吳。陸遜火烧連營七百裡，蜀軍舟船器械萬萬計，一時皆毀，劉備僅以身免，退入白帝城！',
    era: 'dingli',
    year: 222,
    minAge: 16,
    maxAge: 50,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '隨軍東征',
        description: '從征伐吳，建功立業！',
        effects: { stats: { str: 3, vit: -2 }, reputation: 5, exp: 40, butterflyEffects: [{ type: 'military', target: '蜀漢', impact: 'negative', value: 5 }] },
        statCheck: 'lck',
        difficulty: 14,
        successText: '【突圍】火海之中你護著傷兵殺出重圍，存活下來！',
        successEffects: { reputation: 10, exp: 40 },
        failureText: '【火海】連營火起，你被困火中，重傷逃出生天...',
        failureEffects: { stats: { vit: -6 }, reputation: -5 },
      },
      {
        text: '苦諫伐吳不可',
        description: '趙雲皆諫：國賊是曹操不是孫權！',
        effects: { stats: { int: 3, cha: 2 }, reputation: 8, exp: 45, butterflyEffects: [{ type: 'political', target: '劉備', impact: 'positive', value: 4 }] },
      },
      {
        text: '稱病不出',
        description: '此戰凶多吉少，避之。',
        effects: { stats: { vit: 2, lck: 2 }, exp: 10, butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'neutral', value: 1 }] },
      }
    ],
  },
  {
    id: 'sandai_qiqin',
    title: '七擒孟獲',
    description: '南中叛亂，諸葛亮親征。洞主孟獲勇猛善戰，丞相欲收其心，七次生擒、七次縱釋。至第七次，孟獲垂淚曰：「丞相天威，南人不復反矣！」',
    era: 'dingli',
    year: 225,
    minAge: 16,
    maxAge: 50,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    choices: [
      {
        text: '從征南中',
        description: '攻心為上，軍旅奇聞，千載難逢！',
        effects: { stats: { int: 4, vit: -2 }, reputation: 8, exp: 55, butterflyEffects: [{ type: 'military', target: '孟獲', impact: 'positive', value: 5 }] },
      },
      {
        text: '獻攻心之策',
        description: '「夫用兵之道，攻心為上，攻城為下。」',
        effects: { stats: { int: 5 }, reputation: 12, exp: 60, butterflyEffects: [{ type: 'cultural', target: '諸葛亮', impact: 'positive', value: 5 }] },
      },
      {
        text: '南人反叛，棄之可也',
        description: '不毛之地，何足掛齒。',
        effects: { stats: { lck: 1 }, reputation: -3, exp: 10, butterflyEffects: [{ type: 'diplomatic', target: '南中', impact: 'negative', value: 3 }] },
      }
    ],
  },
];

// ============================================
// 三國歸晉事件 (220-280)
// ============================================
export const GUIJIN_EVENTS: GameEvent[] = [
  {
    id: 'guijin_simashi',
    title: '司馬氏專權',
    description: '高貴鄉公曹髦不甘受司馬氏操控，準備親征。你該如何選擇？',
    era: 'dingli',
    year: 260,
    minAge: 16,
    maxAge: 45,
    type: 'choice',
    rarity: 'rare',
    stage: 'early_adult',
    choices: [
      {
        text: '支持司馬氏',
        description: '司馬氏實力強大，順應時代。',
        effects: { stats: { int: 3, lck: -2 }, reputation: -8, gold: 20, exp: 40, butterflyEffects: [{ type: 'political', target: '司馬氏', impact: 'positive', value: 5 }] },
      },
      {
        text: '保持距離',
        description: '不急著站隊。',
        effects: { stats: { lck: 2, vit: 2 }, butterflyEffects: [{ type: 'political', target: '各方', impact: 'neutral', value: 1 }] },
      },
      {
        text: '支持曹魏',
        description: '反對司馬氏篡權。',
        effects: { stats: { cha: 4, str: 3 }, reputation: 5, gold: -20, exp: 30, butterflyEffects: [{ type: 'political', target: '曹魏', impact: 'positive', value: 4 }] },
      },
    ],
  },
  {
    id: 'guijin_jiangwei',
    title: '姜維北伐',
    description: '姜維繼承諸葛亮的遺志，持續北伐曹魏。這是最後的爭鬥...',
    era: 'dingli',
    year: 258,
    minAge: 16,
    maxAge: 40,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'young_adult',
    choices: [
      {
        text: '支持北伐',
        description: '繼承諸葛亮遺志！',
        effects: { stats: { str: 4, cha: 2 }, reputation: 12, exp: 50, butterflyEffects: [{ type: 'military', target: '蜀漢', impact: 'positive', value: 4 }] },
      },
      {
        text: '反對無謂戰爭',
        description: '百姓已經夠苦了。',
        effects: { stats: { cha: 3, int: 3 }, reputation: 8, butterflyEffects: [{ type: 'political', target: '各方', impact: 'positive', value: 3 }] },
      },
      {
        text: '觀望形勢',
        description: '看看誰能笑到最後。',
        effects: { stats: { lck: 2, vit: 2 }, butterflyEffects: [{ type: 'political', target: '自身', impact: 'neutral', value: 1 }] },
      },
    ],
  },
  {
    id: 'guijin_jin_chao',
    title: '司馬炎代魏',
    description: '泰始元年(265年)，司馬炎迫使魏元帝禪讓，建立晉朝。三國時代即將結束...',
    era: 'dingli',
    year: 265,
    minAge: 16,
    maxAge: 45,
    type: 'choice',
    rarity: 'rare',
    stage: 'early_adult',
    choices: [
      {
        text: '擁護新朝',
        description: '順應天命，擁戴新君。',
        effects: { stats: { int: 3, lck: 2 }, reputation: 5, gold: 20, exp: 40, butterflyEffects: [{ type: 'political', target: '晉朝', impact: 'positive', value: 6 }] },
      },
      {
        text: '反對篡位',
        description: '晉朝是篡逆之朝。',
        effects: { stats: { cha: 4, str: 2 }, reputation: 8, gold: -15, exp: 20, butterflyEffects: [{ type: 'political', target: '晉朝', impact: 'negative', value: 5 }] },
      },
      {
        text: '避世隱居',
        description: '朝代更迭，不如退隱。',
        effects: { stats: { vit: 3, lck: 3 }, butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'positive', value: 3 }] },
      },
    ],
  },
  {
    id: 'guijin_shu_mie',
    title: '蜀漢滅亡',
    description: '景耀六年(263年)，魏國大軍入侵蜀漢，劉禪投降。蜀漢滅亡...',
    era: 'dingli',
    year: 263,
    minAge: 16,
    maxAge: 45,
    type: 'choice',
    rarity: 'rare',
    stage: 'early_adult',
    choices: [
      {
        text: '奮力抵抗',
        description: '為蜀漢效死！',
        effects: { stats: { str: 5, vit: -2 }, reputation: 15, exp: 60, butterflyEffects: [{ type: 'military', target: '蜀漢', impact: 'positive', value: 5 }] },
        successText: '你力挽狂瀾，蜀漢得以延續！',
        successEffects: { butterflyEffects: [{ type: 'political', target: '蜀漢', impact: 'positive', value: 8 }] },
        failureText: '魏軍勢大，蜀漢仍將滅亡...',
      },
      {
        text: '逃離蜀地',
        description: '保住性命要緊。',
        effects: { stats: { lck: 3, vit: 2 }, butterflyEffects: [{ type: 'diplomatic', target: '自身', impact: 'neutral', value: 1 }] },
      },
      {
        text: '記錄歷史',
        description: '見證這個時代的落幕。',
        effects: { stats: { int: 4, cha: 2 }, reputation: 8, exp: 30, butterflyEffects: [{ type: 'cultural', target: '歷史', impact: 'positive', value: 4 }] },
      },
    ],
  },
  {
    id: 'guijin_wu_mie',
    title: '吳國滅亡',
    description: '天紀四年(280年)，晉軍兵臨建業，孫皓出降。三國歸晉，天下一統...',
    era: 'dingli',
    year: 280,
    minAge: 16,
    maxAge: 45,
    type: 'choice',
    rarity: 'rare',
    stage: 'early_adult',
    choices: [
      {
        text: '奮死抵抗',
        description: '為吳國效死！',
        effects: { stats: { str: 5, vit: -3 }, reputation: 20, exp: 80, butterflyEffects: [{ type: 'military', target: '吳國', impact: 'positive', value: 6 }] },
        successText: '你奮死抵抗，為吳國贏得了尊嚴！',
        successEffects: { exp: 100, reputation: 30 },
        failureText: '晉軍勢不可擋，你力戰而亡...',
        failureEffects: { alive: false },
      },
      {
        text: '順應天命，歸順晉朝',
        description: '天下大勢分久必合。',
        effects: { stats: { int: 3, lck: 2 }, reputation: -5, gold: 15, exp: 30, butterflyEffects: [{ type: 'political', target: '晉朝', impact: 'positive', value: 4 }] },
      },
      {
        text: '隱居不仕',
        description: '王朝更迭，不如退隱山林。',
        effects: { stats: { vit: 3, lck: 3 }, reputation: 10, butterflyEffects: [{ type: 'cultural', target: '隱逸', impact: 'positive', value: 5 }] },
      },
    ],
  },
  {
    id: 'guijin_reunion',
    title: '天下一統',
    description: '公元280年，三國終於歸於一統。你站在這個歷史的轉折點，回顧自己的一生...',
    era: 'dingli',
    year: 280,
    minAge: 50,
    maxAge: 80,
    type: 'choice',
    rarity: 'rare',
    stage: 'elder',
    choices: [
      {
        text: '撰寫史書',
        description: '記錄這個時代的輝煌。',
        effects: { stats: { int: 5, cha: 3 }, reputation: 10, exp: 50, butterflyEffects: [{ type: 'cultural', target: '史書', impact: 'positive', value: 5 }] },
      },
      {
        text: '撰寫回憶錄',
        description: '將這一生記錄下來。',
        effects: { stats: { int: 4, cha: 2 }, reputation: 15, exp: 60, butterflyEffects: [{ type: 'cultural', target: '歷史', impact: 'positive', value: 6 }] },
      },
      {
        text: '告誡後人',
        description: '希望後人能從三國的教訓中學習。',
        effects: { stats: { cha: 5, int: 3 }, reputation: 20, butterflyEffects: [{ type: 'cultural', target: '後世', impact: 'positive', value: 5 }] },
      },
    ],
  },
];


// ============================================
// 隨機事件 (184-280, 全時代)
// ============================================
export const RANDOM_EVENTS: GameEvent[] = [
  {
    id: 'random_bandit',
    title: '山賊出沒',
    description: '你外出時發現一群山賊正在搶劫商隊。',
    era: 'any',
    year: 185,
    minAge: 14,
    maxAge: 50,
    type: 'choice',
    rarity: 'common',
    stage: 'teen',
    priority: 50,
    choices: [
      {
        text: '率領隨從攻擊山賊',
        description: '路見不平，拔刀相助。',
        statCheck: 'str',
        difficulty: 10,
        effects: { stats: { str: 4, vit: -1 }, reputation: 10, exp: 20, butterflyEffects: [{ type: 'military', target: '山賊', impact: 'negative', value: 3 }] },
        successText: '【擊退山賊】你率領隨從大破山賊！商民感激涕零！',
        successEffects: { reputation: 5, exp: 15 },
        failureText: '【擊退山賊】山賊人數眾多了你！你率領隨從狼狽逃離，部分隨從陣亡...',
        failureEffects: { stats: { vit: -3 }, reputation: -5, exp: 0 },
      },
      {
        text: '談判',
        description: '嘗試與山賊談判。',
        effects: { stats: { cha: 3, int: 2 }, reputation: 5, butterflyEffects: [{ type: 'diplomatic', target: '山賊', impact: 'positive', value: 2 }] },
      },
      {
        text: '逃跑',
        description: '趁機逃跑。',
        effects: { stats: { lck: -1, vit: -1 }, butterflyEffects: [{ type: 'diplomatic', target: '自身', impact: 'neutral', value: 1 }] },
      },
    ],
  },
  {
    id: 'random_famine',
    title: '饑荒',
    description: '連年戰亂，加上天災，當地爆發了嚴重的饑荒。',
    era: 'any',
    year: 190,
    minAge: 12,
    maxAge: 50,
    type: 'choice',
    rarity: 'common',
    stage: 'teen',
    priority: 45,
    choices: [
      {
        text: '賑濟災民',
        description: '拿出錢糧幫助災民。',
        effects: { stats: { cha: 3, lck: 2 }, reputation: 10, gold: -20, butterflyEffects: [{ type: 'economic', target: '災區', impact: 'positive', value: 4 }] },
      },
      {
        text: '趁機囤積糧食',
        description: '糧食短缺，價格上漲，這是賺錢的好機會。',
        effects: { stats: { lck: 3 }, gold: 30, reputation: -5, butterflyEffects: [{ type: 'economic', target: '災區', impact: 'negative', value: 3 }] },
      },
      {
        text: '遷徙他處',
        description: '帶家人遷徙到糧食充足的地區。',
        effects: { stats: { vit: 2, lck: 1 }, gold: -10, butterflyEffects: [{ type: 'political', target: '遷徙地', impact: 'positive', value: 2 }] },
      },
    ],
  },
  {
    id: 'random_market',
    title: '市集交易',
    description: '你在市集上遇見各種商人，他們帶來了各地的貨物。',
    era: 'any',
    year: 186,
    minAge: 10,
    maxAge: 55,
    type: 'choice',
    rarity: 'common',
    stage: 'child',
    priority: 35,
    choices: [
      {
        text: '購買珍奇物品',
        description: '用金幣換取奇珍。',
        effects: { stats: { lck: 2 }, gold: -15, butterflyEffects: [{ type: 'economic', target: '市集', impact: 'positive', value: 2 }] },
      },
      {
        text: '購買書籍',
        description: '投資學問。',
        effects: { stats: { int: 3, lck: 1 }, gold: -10, butterflyEffects: [{ type: 'cultural', target: '市集', impact: 'positive', value: 3 }] },
      },
      {
        text: '購買土地',
        description: '投資房地產。',
        effects: { stats: { int: 2, lck: 2 }, gold: -50, butterflyEffects: [{ type: 'economic', target: '市集', impact: 'positive', value: 2 }] },
      },
    ],
  },
  {
    id: 'random_huato',
    title: '華佗行醫',
    description: '你遇見了神醫華佗，他正在為百姓治病。',
    era: 'any',
    year: 195,
    minAge: 10,
    maxAge: 50,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'child',
    priority: 55,
    choices: [
      {
        text: '請華佗診病',
        description: '請華佗給你把把脈。',
        effects: { stats: { vit: 3, int: 1 }, gold: -5, butterflyEffects: [{ type: 'cultural', target: '華佗', impact: 'positive', value: 2 }] },
      },
      {
        text: '學習醫術',
        description: '向華佗學習醫術。',
        effects: { stats: { int: 4, vit: -1 }, exp: 30, butterflyEffects: [{ type: 'cultural', target: '華佗', impact: 'positive', value: 4 }] },
      },
      {
        text: '贈送禮物',
        description: '贈送禮物給華佗，結交這位名医。',
        effects: { stats: { cha: 3, lck: 2 }, gold: -10, reputation: 5, butterflyEffects: [{ type: 'diplomatic', target: '華佗', impact: 'positive', value: 5 }] },
      },
    ],
  },
  {
    id: 'random_teaching',
    title: '拜師求學',
    description: '你遇見了一位學識淵博的學者，他願意收你為徒。',
    era: 'any',
    year: 190,
    minAge: 10,
    maxAge: 25,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'child',
    priority: 60,
    choices: [
      {
        text: '正式拜師',
        description: '跟隨老師學習學問。',
        effects: { stats: { int: 5, cha: 2 }, exp: 40, reputation: 8, butterflyEffects: [{ type: 'cultural', target: '學術界', impact: 'positive', value: 3 }] },
      },
      {
        text: '旁聽課程',
        description: '旁聽老師的課程，不正式拜師。',
        effects: { stats: { int: 3, cha: 2 }, exp: 20, butterflyEffects: [{ type: 'cultural', target: '學術界', impact: 'positive', value: 1 }] },
      },
      {
        text: '拒絕邀請',
        description: '你有自己的道路，不需要拜師。',
        effects: { stats: { lck: 1, str: 1 }, butterflyEffects: [{ type: 'diplomatic', target: '自身', impact: 'neutral', value: 1 }] },
      },
    ],
  },
  {
    id: 'random_marriage',
    title: '姻緣機遇',
    description: '在一個宴會上，你遇見了一位佳人/俊才。',
    era: 'any',
    year: 195,
    minAge: 16,
    maxAge: 35,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'young_adult',
    priority: 50,
    choices: [
      {
        text: '展開追求',
        description: '勇敢追愛。',
        effects: { stats: { cha: 4, lck: 2 }, reputation: 5, exp: 20, butterflyEffects: [{ type: 'diplomatic', target: '姻緣', impact: 'positive', value: 4 }] },
      },
      {
        text: '保持距離',
        description: '專注於事業，暫不考慮感情。',
        effects: { stats: { int: 2, str: 2 }, butterflyEffects: [{ type: 'diplomatic', target: '自身', impact: 'neutral', value: 1 }] },
      },
      {
        text: '結為朋友',
        description: '先做朋友，慢慢發展。',
        effects: { stats: { cha: 3, int: 2 }, reputation: 5, butterflyEffects: [{ type: 'diplomatic', target: '姻緣', impact: 'positive', value: 2 }] },
      },
    ],
  },
];

// ============================================
// 人生階段事件
// ============================================
export const LIFE_STAGE_EVENTS: GameEvent[] = [
  // === 嬰兒時期 (0-3 歲) ===
  {
    id: 'baby_cry',
    title: '啼哭',
    description: '你哇哇大哭，父母聞聲趕來。',
    era: 'any',
    year: 184,
    type: 'random',
    minAge: 0,
    maxAge: 3,
    rarity: 'common',
    stage: 'infant',
    choices: [
      {
        text: '繼續大哭',
        effects: { stats: { vit: 1, cha: 1 } },
      },
      {
        text: '安靜下來',
        effects: { stats: { vit: 2 } },
      },
    ],
  },
  {
    id: 'first_words',
    title: '第一句話',
    description: '你學會說話了！你第一個叫出的是「父親」還是「母親」？',
    era: 'any',
    year: 186,
    type: 'choice',
    minAge: 1,
    maxAge: 3,
    rarity: 'rare',
    stage: 'infant',
    choices: [
      {
        text: '叫父親',
        description: '你朝著父親的方向咿呀學語。',
        effects: { stats: { cha: 3, int: 1 }, reputation: 5, butterflyEffects: [{ type: 'cultural', target: '家庭', impact: 'positive', value: 3 }] },
      },
      {
        text: '叫母親',
        description: '你緊緊抱住母親，喊出了人生第一句話。',
        effects: { stats: { cha: 4, vit: 1 }, reputation: 5, butterflyEffects: [{ type: 'cultural', target: '家庭', impact: 'positive', value: 3 }] },
      },
      {
        text: '叫英雄',
        description: '你望著窗外的戰亂，模糊地喊出一個聽不懂的詞。',
        effects: { stats: { int: 2, cha: 2 }, butterflyEffects: [{ type: 'cultural', target: '命運', impact: 'positive', value: 5 }] },
      },
    ],
  },
  {
    id: 'sickness_child',
    title: '幼時疾病',
    description: '你染上了一场重病，生死未卜。',
    era: 'any',
    year: 185,
    type: 'choice',
    minAge: 0,
    maxAge: 5,
    rarity: 'uncommon',
    stage: 'infant',
    choices: [
      {
        text: '堅持下去',
        description: '你憑著頑強的意志力熬過了難關。',
        effects: { stats: { vit: 1 } },
        statCheck: 'vit',
        difficulty: 12,
        successText: '【頑強意志】你挺過來了！身體雖然虛弱，但意志更加堅定。',
        successEffects: { stats: { vit: 3 }, reputation: 5, butterflyEffects: [{ type: 'cultural', target: '生命', impact: 'positive', value: 5 }] },
        failureText: '【病魔纏身】你昏迷了三天三夜，父母哭紅了雙眼。',
        failureEffects: { stats: { vit: -3 }, butterflyEffects: [{ type: 'cultural', target: '健康', impact: 'negative', value: 3 }] },
      },
      {
        text: '依靠藥物',
        description: '父母請來了村裡最有名的醫師。',
        effects: { stats: { vit: 2 }, gold: -5, butterflyEffects: [{ type: 'cultural', target: '醫療', impact: 'positive', value: 2 }] },
      },
    ],
  },
  // === 孩童時期 (4-8 歲) ===
  {
    id: 'childhood_1',
    title: '童年趣事',
    description: '你是一個孩童，正在經歷你的童年時光。',
    era: 'any',
    year: 184,
    minAge: 4,
    maxAge: 8,
    type: 'choice',
    rarity: 'common',
    stage: 'child',
    priority: 10,
    choices: [
      {
        text: '與同伴玩耍',
        description: '和小夥伴們一起遊戲。',
        effects: { stats: { cha: 2, vit: 1 }, butterflyEffects: [{ type: 'cultural', target: '童年', impact: 'positive', value: 1 }] },
      },
      {
        text: '獨自探索',
        description: '獨自探索周圍的世界。',
        effects: { stats: { lck: 1, int: 1 }, butterflyEffects: [{ type: 'cultural', target: '童年', impact: 'positive', value: 1 }] },
      },
      {
        text: '幫助家務',
        description: '幫助父母做家務。',
        effects: { stats: { vit: 2, cha: 1 }, reputation: 5, butterflyEffects: [{ type: 'cultural', target: '家庭', impact: 'positive', value: 2 }] },
      },
    ],
  },
  {
    id: 'childhood_2',
    title: '村外冒險',
    description: '你偷偷溜出村莊，前往附近的山林探險。',
    era: 'any',
    year: 186,
    type: 'choice',
    minAge: 5,
    maxAge: 9,
    rarity: 'uncommon',
    stage: 'child',
    choices: [
      {
        text: '深入山林',
        description: '你決定走得更遠，看看山的那邊是什麼。',
        effects: { stats: { lck: 1 } },
        statCheck: 'lck',
        difficulty: 10,
        successText: '【山林奇遇】你發現了一個野生蜂巢！還遇到了一隻受傷的小鹿。',
        successEffects: { stats: { lck: 3, int: 2 }, gold: 15, butterflyEffects: [{ type: 'cultural', target: '山林', impact: 'positive', value: 4 }] },
        failureText: '【迷路驚魂】你迷失了方向，在天黑前終於找到了回家的路。',
        failureEffects: { stats: { vit: -2, lck: -1 }, butterflyEffects: [{ type: 'cultural', target: '山林', impact: 'negative', value: 2 }] },
      },
      {
        text: '在村口附近探索',
        description: '安全第一，只在村莊附近走走。',
        effects: { stats: { vit: 2, cha: 1 }, reputation: 3, butterflyEffects: [{ type: 'cultural', target: '村莊', impact: 'positive', value: 2 }] },
      },
    ],
  },
  {
    id: 'childhood_3',
    title: '模仿武將',
    description: '你看著村中來過的兵士，想模仿他們的武藝。',
    era: 'any',
    year: 185,
    type: 'choice',
    minAge: 4,
    maxAge: 8,
    rarity: 'common',
    stage: 'child',
    choices: [
      {
        text: '用竹竿當劍',
        description: '你砍了一根竹竿，模仿武將揮劍。',
        effects: { stats: { str: 2, vit: 2 }, butterflyEffects: [{ type: 'military', target: '武藝種子', impact: 'positive', value: 2 }] },
      },
      {
        text: '觀察兵士操練',
        description: '你坐在路邊，仔細觀看兵士們的動作。',
        effects: { stats: { int: 2, str: 1 }, butterflyEffects: [{ type: 'military', target: '戰術種子', impact: 'positive', value: 2 }] },
      },
      {
        text: '跑去跟兵士聊天',
        description: '你鼓起勇氣走向他們，詢問他們的故事。',
        effects: { stats: { cha: 3, int: 1 }, reputation: 3, butterflyEffects: [{ type: 'cultural', target: '兵士', impact: 'positive', value: 3 }] },
      },
    ],
  },
  {
    id: 'childhood_4',
    title: '讀書識字',
    description: '家中有人識字，你開始跟隨學習。',
    era: 'any',
    year: 187,
    type: 'choice',
    minAge: 5,
    maxAge: 9,
    rarity: 'common',
    stage: 'child',
    choices: [
      {
        text: '專注識字',
        description: '你認真地學習每一個字。',
        effects: { stats: { int: 4 }, exp: 15, butterflyEffects: [{ type: 'cultural', target: '學識', impact: 'positive', value: 3 }] },
      },
      {
        text: '偷看武藝書籍',
        description: '識字之外，你更想看兵書。',
        effects: { stats: { int: 2, str: 2 }, exp: 20, butterflyEffects: [{ type: 'military', target: '兵法種子', impact: 'positive', value: 3 }] },
      },
      {
        text: '偷偷跑去玩',
        description: '你覺得讀書太無聊了。',
        effects: { stats: { cha: 2, vit: 2 }, butterflyEffects: [{ type: 'cultural', target: '自由', impact: 'neutral', value: 1 }] },
      },
    ],
  },
  {
    id: 'childhood_5',
    title: '戰亂逃難',
    description: '聽說附近有戰事，村民們開始逃難。你也跟著父母踏上了流離失所的道路。',
    era: 'huangjin',
    year: 184,
    type: 'choice',
    minAge: 3,
    maxAge: 11,
    rarity: 'uncommon',
    stage: 'child',
    choices: [
      {
        text: '緊抓父母不放手',
        description: '你害怕被人群衝散。',
        effects: { stats: { vit: 2, cha: 1 }, reputation: 3, butterflyEffects: [{ type: 'cultural', target: '家庭', impact: 'positive', value: 4 }] },
      },
      {
        text: '在逃難路上觀察',
        description: '你注意到許多以前沒看過的事物。',
        effects: { stats: { int: 3, lck: 1 }, butterflyEffects: [{ type: 'cultural', target: '天下', impact: 'positive', value: 3 }] },
      },
      {
        text: '幫助其他逃難的孩童',
        description: '你牽起了一個迷路小妹妹的手。',
        effects: { stats: { cha: 4, int: 1 }, reputation: 8, butterflyEffects: [{ type: 'cultural', target: '仁義種子', impact: 'positive', value: 5 }] },
      },
    ],
  },
  {
    id: 'childhood_6',
    title: '遇到流浪武士',
    description: '一個衣衫襤褸的武士在村中歇腳，他看起來經歷過許多戰鬥。',
    era: 'huangjin',
    year: 188,
    type: 'choice',
    minAge: 6,
    maxAge: 11,
    rarity: 'rare',
    stage: 'child',
    choices: [
      {
        text: '請求武士教導武藝',
        description: '你想學習真正的武藝。',
        effects: { stats: { cha: 1 } },
        statCheck: 'cha',
        difficulty: 10,
        successText: '【武士賞識】武士被你打動，答應教你最基本的拳法。',
        successEffects: { stats: { str: 4, vit: 2 }, companions: [{ id: '流浪武士', action: 'join' }], butterflyEffects: [{ type: 'military', target: '師資', impact: 'positive', value: 5 }] },
        failureText: '【婉拒】武士說你不夠資質，但你沒有放棄。',
        failureEffects: { stats: { str: 1 }, butterflyEffects: [{ type: 'military', target: '心志', impact: 'positive', value: 2 }] },
      },
      {
        text: '問他戰場的故事',
        description: '你想聽聽戰爭的真實面貌。',
        effects: { stats: { int: 3, cha: 1 }, exp: 25, butterflyEffects: [{ type: 'cultural', target: '戰史', impact: 'positive', value: 4 }] },
      },
      {
        text: '送他食物和水',
        description: '武士看起來很飢渴，你把自己份的拿出來。',
        effects: { stats: { cha: 3, vit: 1 }, reputation: 10, butterflyEffects: [{ type: 'cultural', target: '仁義', impact: 'positive', value: 5 }] },
      },
    ],
  },
  {
    id: 'childhood_7',
    title: '黃巾之亂的陰影',
    description: '黃巾賊的騷擾越來越頻繁，村中開始戒備。',
    era: 'huangjin',
    year: 184,
    type: 'choice',
    minAge: 7,
    maxAge: 11,
    rarity: 'uncommon',
    stage: 'preteen',
    choices: [
      {
        text: '躲在家裡',
        description: '你聽從父母的指示，待在家中。',
        effects: { stats: { vit: 1 }, butterflyEffects: [{ type: 'cultural', target: '恐懼', impact: 'negative', value: 2 }] },
      },
      {
        text: '協助村民防禦',
        description: '你幫忙搬運物資，為村莊防禦出力。',
        effects: { stats: { str: 2, vit: 2 }, reputation: 5, butterflyEffects: [{ type: 'military', target: '村莊', impact: 'positive', value: 3 }] },
      },
      {
        text: '偷偷觀察黃巾賊',
        description: '你好奇黃巾賊到底是什麼樣的人。',
        effects: { stats: { int: 2, lck: -1 }, butterflyEffects: [{ type: 'cultural', target: '亂世', impact: 'positive', value: 4 }] },
      },
    ],
  },
  // === 少年時期 (12-17 歲) ===
  {
    id: 'youth_1',
    title: '少年立志',
    description: '你已經是一個少年，開始思考自己的人生方向。',
    era: 'any',
    year: 186,
    minAge: 12,
    maxAge: 17,
    type: 'choice',
    rarity: 'common',
    stage: 'teen',
    priority: 15,
    choices: [
      {
        text: '立志習武',
        description: '想要成為一名武将。',
        effects: { stats: { str: 4, vit: 2 }, exp: 20, butterflyEffects: [{ type: 'military', target: '少年', impact: 'positive', value: 3 }] },
      },
      {
        text: '立志從政',
        description: '想要進入仕途，治理國家。',
        effects: { stats: { int: 4, cha: 2 }, exp: 20, butterflyEffects: [{ type: 'political', target: '少年', impact: 'positive', value: 3 }] },
      },
      {
        text: '立志經商',
        description: '想要積累財富，經商致富。',
        effects: { stats: { lck: 3, int: 2 }, exp: 20, butterflyEffects: [{ type: 'economic', target: '少年', impact: 'positive', value: 2 }] },
      },
    ],
  },
  {
    id: 'adult_1',
    title: '成年立業',
    description: '你已經成年，需要選擇自己的職業道路。',
    era: 'any',
    year: 190,
    minAge: 18,
    maxAge: 35,
    type: 'choice',
    rarity: 'common',
    stage: 'young_adult',
    priority: 10,
    choices: [
      {
        text: '從軍',
        description: '投身軍旅，建功立業。',
        effects: { stats: { str: 4, vit: 3 }, exp: 40, butterflyEffects: [{ type: 'military', target: '軍旅', impact: 'positive', value: 4 }] },
      },
      {
        text: '從政',
        description: '進入仕途，報效國家。',
        effects: { stats: { int: 4, cha: 3 }, exp: 40, butterflyEffects: [{ type: 'political', target: '勢力', impact: 'positive', value: 4 }] },
      },
      {
        text: '隱居鄉里',
        description: '不問政事，隱居鄉里。',
        effects: { stats: { vit: 3, lck: 2 }, exp: 10, butterflyEffects: [{ type: 'cultural', target: '鄉里', impact: 'positive', value: 2 }] },
      },
    ],
  },
  {
    id: 'middle_1',
    title: '中年危機',
    description: '你已經中年，面臨人生轉折點。',
    era: 'any',
    year: 210,
    minAge: 36,
    maxAge: 55,
    type: 'choice',
    rarity: 'common',
    stage: 'early_adult',
    priority: 10,
    choices: [
      {
        text: '繼續進取',
        description: '趁還有精力，再拼一把。',
        effects: { stats: { str: 3, int: 3 }, exp: 50, butterflyEffects: [{ type: 'political', target: '中年', impact: 'positive', value: 3 }] },
      },
      {
        text: '功成身退',
        description: '功成身退，享樂晚年。',
        effects: { stats: { lck: 3, cha: 3 }, exp: 20, gold: 20, butterflyEffects: [{ type: 'economic', target: '晚年', impact: 'positive', value: 3 }] },
      },
      {
        text: '培養後輩',
        description: '將經驗傳承給下一代。',
        effects: { stats: { int: 4, cha: 4 }, exp: 30, butterflyEffects: [{ type: 'cultural', target: '後輩', impact: 'positive', value: 4 }] },
      },
    ],
  },
  {
    id: 'old_1',
    title: '晚年反思',
    description: '你已經年老，開始反思自己的一生。',
    era: 'any',
    year: 240,
    minAge: 56,
    maxAge: 75,
    type: 'choice',
    rarity: 'common',
    stage: 'elder',
    priority: 10,
    choices: [
      {
        text: '撰寫回憶錄',
        description: '將一生經歷記錄下來。',
        effects: { stats: { int: 5, cha: 3 }, reputation: 10, exp: 40, butterflyEffects: [{ type: 'cultural', target: '史書', impact: 'positive', value: 4 }] },
      },
      {
        text: '環遊天下',
        description: '趁還能走動，去看看外面的世界。',
        effects: { stats: { vit: 3, cha: 2 }, exp: 30, butterflyEffects: [{ type: 'cultural', target: '天下', impact: 'positive', value: 3 }] },
      },
      {
        text: '安享晚年',
        description: '在家安享晚年，享受天倫之樂。',
        effects: { stats: { vit: 3, lck: 3 }, butterflyEffects: [{ type: 'cultural', target: '家庭', impact: 'positive', value: 2 }] },
      },
    ],
  },
  // ============================================
  // middle 人生階段事件 (36-50歲) — 壯年時期，一生最精華的階段
  // ============================================
  {
    id: 'middle_001',
    title: '受命出征',
    description: '你已年近四十，正是血氣方剛之時。主公下令出征，你被任命為參軍。這是一個建功立業的好機會，但你必須慎重考慮戰術。',
    era: 'guandu',
    year: 200,
    minAge: 36,
    maxAge: 45,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'middle',
    priority: 20,
    butterflyEffects: [
      { type: 'military', target: '中原', impact: 'mixed', value: 4 },
    ],
    choices: [
      {
        text: '主張速戰速決',
        description: '趁敵軍未穩，全力出擊。',
        effects: {
          stats: { str: 4, int: 2 },
          exp: 40,
          reputation: 5,
          butterflyEffects: [
            { type: 'military', target: '戰局', impact: 'positive', value: 3 },
          ],
        },
      },
      {
        text: '主張穩紮穩打',
        description: '先固守要地，再圖進攻。',
        effects: {
          stats: { int: 4, vit: 2 },
          exp: 30,
          reputation: 3,
          gold: 50,
          butterflyEffects: [
            { type: 'political', target: '朝堂', impact: 'positive', value: 2 },
          ],
        },
      },
      {
        text: '建議暫不出兵',
        description: '時機未到，應耐心等待。',
        effects: {
          stats: { int: 3, cha: 2, lck: 2 },
          exp: 20,
          butterflyEffects: [
            { type: 'diplomatic', target: '敵國', impact: 'positive', value: 3 },
          ],
        },
      },
    ],
  },
  {
    id: 'middle_002',
    title: '朝堂論政',
    description: '你已身居高位，被召入朝堂參與政事決策。朝中各方勢力角力，你需要選擇自己的立場。',
    era: 'dingli',
    year: 220,
    minAge: 38,
    maxAge: 50,
    type: 'choice',
    rarity: 'rare',
    stage: 'middle',
    priority: 25,
    butterflyEffects: [
      { type: 'political', target: '朝堂', impact: 'positive', value: 5 },
    ],
    choices: [
      {
        text: '擁護新君',
        description: '支持新登基的君主，鞏固新政權。',
        effects: {
          stats: { cha: 3, int: 2 },
          reputation: 10,
          exp: 35,
          butterflyEffects: [
            { type: 'political', target: '政權', impact: 'positive', value: 4 },
          ],
        },
      },
      {
        text: '保持中立',
        description: '不偏不倚，觀察形勢。',
        effects: {
          stats: { lck: 3, int: 2 },
          reputation: 5,
          exp: 25,
          butterflyEffects: [
            { type: 'political', target: '朝堂', impact: 'neutral', value: 2 },
          ],
        },
      },
      {
        text: '直言進諫',
        description: '冒犯權貴，直言不諱。',
        effects: {
          stats: { cha: 2, str: 3 },
          reputation: 15,
          exp: 50,
          butterflyEffects: [
            { type: 'political', target: '權貴', impact: 'negative', value: 5 },
          ],
        },
      },
    ],
  },
  {
    id: 'middle_003',
    title: '續弦再婚',
    description: '你的結髮妻子因病去世，你已中年，需要決定是否續弦。這段婚姻關係將影響你的家族與事業。',
    era: 'any',
    year: 210,
    minAge: 36,
    maxAge: 50,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'middle',
    priority: 15,
    butterflyEffects: [
      { type: 'cultural', target: '家族', impact: 'mixed', value: 3 },
    ],
    choices: [
      {
        text: '迎娶名門閨秀',
        description: '選擇門當戶對的世家之女。',
        effects: {
          stats: { cha: 5, int: 3 },
          gold: 100,
          reputation: 10,
          companions: [{ id: 'wife_noble', action: 'join' }],
          butterflyEffects: [
            { type: 'political', target: '世家', impact: 'positive', value: 4 },
          ],
        },
      },
      {
        text: '續娶青梅竹馬',
        description: '選擇兒時伴侶，感情深厚。',
        effects: {
          stats: { cha: 3, lck: 3, vit: 5 },
          reputation: 5,
          butterflyEffects: [
            { type: 'cultural', target: '家庭', impact: 'positive', value: 5 },
          ],
        },
      },
      {
        text: '暫不續弦',
        description: '專心事業，暫不考虑婚姻。',
        effects: {
          stats: { int: 4, str: 3 },
          exp: 40,
          gold: 20,
          butterflyEffects: [
            { type: 'economic', target: '事業', impact: 'positive', value: 3 },
          ],
        },
      },
    ],
  },
  {
    id: 'middle_004',
    title: '平定叛亂',
    description: '地方爆發叛亂，你被派去平定。這是一場艱苦的任務，需要你運用智慧和武力。',
    era: 'dingli',
    year: 230,
    minAge: 38,
    maxAge: 48,
    type: 'choice',
    rarity: 'rare',
    stage: 'middle',
    priority: 30,
    butterflyEffects: [
      { type: 'military', target: '地方', impact: 'positive', value: 5 },
    ],
    choices: [
      {
        text: '武力鎮壓',
        description: '以強大的軍力鎮壓叛亂。',
        effects: {
          stats: { str: 5, vit: -2 },
          reputation: 10,
          exp: 60,
          gold: -50,
          butterflyEffects: [
            { type: 'military', target: '叛軍', impact: 'negative', value: 6 },
          ],
        },
        statCheck: 'str',
        difficulty: 15,
        successText: '你以強大的軍力迅速平定了叛亂，威震四方。',
        failureText: '你的軍隊遭受頑強抵抗，最終以慘勝告終。',
        successEffects: { gold: 100, reputation: 5 },
        failureEffects: { stats: { vit: -3, lck: -2 } },
      },
      {
        text: '招安撫慰',
        description: '以仁義感動叛軍，招他們歸順。',
        effects: {
          stats: { cha: 5, int: 3 },
          reputation: 15,
          exp: 40,
          butterflyEffects: [
            { type: 'diplomatic', target: '叛軍', impact: 'positive', value: 5 },
          ],
        },
        statCheck: 'cha',
        difficulty: 14,
        successText: '你的仁義感動了叛軍首領，他們決定歸順。',
        failureText: '叛軍不為所動，繼續抵抗。',
        successEffects: { gold: 50, companions: [{ action: 'join', id: 'former_rebel' }] },
        failureEffects: { stats: { lck: -2, vit: -1 } },
      },
      {
        text: '圍而不攻',
        description: '包圍叛軍，斷其糧道。',
        effects: {
          stats: { int: 4, vit: -1 },
          exp: 30,
          gold: 30,
          butterflyEffects: [
            { type: 'economic', target: '地區', impact: 'positive', value: 3 },
          ],
        },
        statCheck: 'int',
        difficulty: 12,
        successText: '你的計謀奏效，叛軍糧盡自潰。',
        failureText: '叛軍突破了包圍，戰事延長。',
        successEffects: { reputation: 5, exp: 20 },
        failureEffects: { stats: { vit: -3, lck: -1 } },
      },
    ],
  },
  {
    id: 'middle_005',
    title: '治理地方',
    description: '你被任命為太守，負責治理一個邊遠地區。這裡民生凋敝，你需要制定政策來發展經濟。',
    era: 'dingli',
    year: 235,
    minAge: 36,
    maxAge: 48,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'middle',
    priority: 15,
    butterflyEffects: [
      { type: 'economic', target: '地方', impact: 'positive', value: 4 },
    ],
    choices: [
      {
        text: '興修水利',
        description: '投資基礎建設，改善農業生產。',
        effects: {
          stats: { int: 5, vit: 2 },
          gold: -80,
          reputation: 10,
          exp: 45,
          butterflyEffects: [
            { type: 'economic', target: '農業', impact: 'positive', value: 5 },
          ],
        },
        statCheck: 'int',
        difficulty: 13,
        successText: '水利工程順利完工，糧食產量大增，百姓感恩戴德。',
        failureText: '工程中途出現問題，浪費了大量資金。',
        successEffects: { gold: 100, reputation: 5 },
        failureEffects: { gold: -50, stats: { lck: -2 } },
      },
      {
        text: '減輕賦稅',
        description: '減輕百姓負擔，恢復民生。',
        effects: {
          stats: { cha: 4, int: 2 },
          reputation: 15,
          gold: -30,
          exp: 35,
          butterflyEffects: [
            { type: 'economic', target: '民生', impact: 'positive', value: 4 },
          ],
        },
      },
      {
        text: '加強軍備',
        description: '訓練民兵，鞏固邊防。',
        effects: {
          stats: { str: 4, int: 3 },
          reputation: 8,
          gold: -60,
          exp: 40,
          butterflyEffects: [
            { type: 'military', target: '邊防', impact: 'positive', value: 4 },
          ],
        },
      },
    ],
  },
  {
    id: 'middle_006',
    title: '結交名士',
    description: '你聽說有一位隱居高士出山，決定親自前往拜訪。結交名士可以提升你的聲望和人脈。',
    era: 'any',
    year: 225,
    minAge: 36,
    maxAge: 50,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'middle',
    priority: 10,
    butterflyEffects: [
      { type: 'cultural', target: '名士圈', impact: 'positive', value: 3 },
    ],
    choices: [
      {
        text: '攜禮誠心拜訪',
        description: '帶上厚禮，誠心求教。',
        effects: {
          stats: { cha: 4, int: 3 },
          reputation: 8,
          exp: 30,
          companions: [{ action: 'join', id: 'famous_scholar' }],
          butterflyEffects: [
            { type: 'cultural', target: '學術圈', impact: 'positive', value: 4 },
          ],
        },
      },
      {
        text: '以文會友',
        description: '以詩文書法結交，不以利誘。',
        effects: {
          stats: { int: 5, cha: 3 },
          reputation: 12,
          exp: 35,
          butterflyEffects: [
            { type: 'cultural', target: '文壇', impact: 'positive', value: 5 },
          ],
        },
      },
      {
        text: '派人邀請',
        description: '派使者邀請名士出山。',
        effects: {
          stats: { int: 2, lck: 2 },
          exp: 20,
          gold: -20,
          butterflyEffects: [
            { type: 'diplomatic', target: '名士', impact: 'neutral', value: 2 },
          ],
        },
      },
    ],
  },
  {
    id: 'middle_007',
    title: '家族繼承',
    description: '你的子嗣已長成，需要決定將家業傳承給誰。這關係到家族的未來。',
    era: 'any',
    year: 230,
    minAge: 40,
    maxAge: 50,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'middle',
    priority: 12,
    butterflyEffects: [
      { type: 'cultural', target: '家族', impact: 'positive', value: 4 },
    ],
    choices: [
      {
        text: '傳給長子',
        description: '遵循長子繼承的传统。',
        effects: {
          stats: { cha: 2, int: 3 },
          reputation: 5,
          exp: 25,
          butterflyEffects: [
            { type: 'cultural', target: '家族傳統', impact: 'positive', value: 3 },
          ],
        },
      },
      {
        text: '傳給最有才華的子女',
        description: '不問長幼，只看能力。',
        effects: {
          stats: { int: 4, cha: 2 },
          reputation: 8,
          exp: 35,
          butterflyEffects: [
            { type: 'political', target: '家族勢力', impact: 'positive', value: 4 },
          ],
        },
      },
      {
        text: '分家產',
        description: '將家產平均分給所有子女。',
        effects: {
          stats: { lck: 3, cha: 3 },
          gold: -50,
          reputation: 3,
          exp: 20,
          butterflyEffects: [
            { type: 'economic', target: '分家', impact: 'mixed', value: 3 },
          ],
        },
      },
    ],
  },
  {
    id: 'middle_008',
    title: '商貿經略',
    description: '你發現一條新的商路，決定投資經商。這可能帶來巨大的財富，但也承擔風險。',
    era: 'dingli',
    year: 240,
    minAge: 38,
    maxAge: 48,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'middle',
    priority: 10,
    butterflyEffects: [
      { type: 'economic', target: '商路', impact: 'positive', value: 3 },
    ],
    choices: [
      {
        text: '大舉投資',
        description: '傾盡家財投資商隊。',
        effects: {
          stats: { lck: 5, int: 3 },
          gold: -200,
          exp: 30,
          butterflyEffects: [
            { type: 'economic', target: '商業', impact: 'positive', value: 5 },
          ],
        },
        statCheck: 'lck',
        difficulty: 14,
        successText: '你的眼光獨到，商隊帶回豐厚的利潤，成為一代巨賈。',
        failureText: '商路遭匪徒劫掠，損失慘重。',
        successEffects: { gold: 500, reputation: 10 },
        failureEffects: { gold: -150, stats: { lck: -5, vit: -2 } },
      },
      {
        text: '小量嘗試',
        description: '少量投資，風險可控。',
        effects: {
          stats: { int: 3, lck: 2 },
          gold: 50,
          exp: 20,
          butterflyEffects: [
            { type: 'economic', target: '商業', impact: 'positive', value: 2 },
          ],
        },
      },
      {
        text: '與大商賈合作',
        description: '聯合其他商人共同經營。',
        effects: {
          stats: { cha: 4, int: 3 },
          reputation: 5,
          gold: 80,
          exp: 25,
          companions: [{ action: 'join', id: 'business_partner' }],
          butterflyEffects: [
            { type: 'economic', target: '商界', impact: 'positive', value: 4 },
          ],
        },
      },
    ],
  },
  {
    id: 'middle_009',
    title: '隱居避禍',
    description: '朝中政治鬥爭日益激烈，你感到危險逼近。是繼續留任還是隱居避禍？',
    era: 'dingli',
    year: 250,
    minAge: 40,
    maxAge: 50,
    type: 'choice',
    rarity: 'rare',
    stage: 'middle',
    priority: 20,
    butterflyEffects: [
      { type: 'political', target: '朝堂', impact: 'negative', value: 3 },
    ],
    choices: [
      {
        text: '辭官隱居',
        description: '明哲保身，遠離政治漩渦。',
        effects: {
          stats: { lck: 5, vit: 3 },
          reputation: -5,
          exp: 20,
          butterflyEffects: [
            { type: 'cultural', target: '隱士圈', impact: 'positive', value: 3 },
          ],
        },
      },
      {
        text: '尋求靠山',
        description: '找尋勢力強大的靠山保護自己。',
        effects: {
          stats: { cha: 4, int: 3 },
          reputation: 5,
          exp: 30,
          companions: [{ action: 'join', id: 'powerful_patron' }],
          butterflyEffects: [
            { type: 'political', target: '權鬥', impact: 'mixed', value: 4 },
          ],
        },
      },
      {
        text: '正面對抗',
        description: '不畏權貴，繼續堅守立場。',
        effects: {
          stats: { str: 5, cha: 3 },
          reputation: 15,
          exp: 50,
          butterflyEffects: [
            { type: 'political', target: '政敵', impact: 'negative', value: 6 },
          ],
        },
        statCheck: 'str',
        difficulty: 16,
        successText: '你成功擊退了政敵，聲望達到頂峰。',
        failureText: '你被政敵打壓，失去一切。',
        successEffects: { gold: 100, reputation: 10 },
        failureEffects: { gold: -100, stats: { lck: -5, vit: -5 } },
      },
    ],
  },
  {
    id: 'middle_010',
    title: '投筆從戎',
    description: '你本是文官，但邊境戰事吃緊，你決定放下筆桿，拿起刀槍。',
    era: 'dingli',
    year: 245,
    minAge: 38,
    maxAge: 48,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'middle',
    priority: 18,
    butterflyEffects: [
      { type: 'military', target: '邊境', impact: 'positive', value: 4 },
    ],
    choices: [
      {
        text: '自願領兵',
        description: '主動請纓，帶領軍隊出征。',
        effects: {
          stats: { str: 5, int: 3 },
          exp: 50,
          reputation: 10,
          butterflyEffects: [
            { type: 'military', target: '軍中', impact: 'positive', value: 4 },
          ],
        },
      },
      {
        text: '推薦良將',
        description: '推薦有能力的人去領兵。',
        effects: {
          stats: { int: 4, cha: 2 },
          exp: 30,
          reputation: 5,
          companions: [{ action: 'join', id: 'recommended_general' }],
          butterflyEffects: [
            { type: 'military', target: '將領', impact: 'positive', value: 3 },
          ],
        },
      },
      {
        text: '後勤支援',
        description: '留在後方負責糧草供應。',
        effects: {
          stats: { int: 3, vit: 3 },
          exp: 25,
          gold: 30,
          butterflyEffects: [
            { type: 'economic', target: '後勤', impact: 'positive', value: 3 },
          ],
        },
      },
    ],
  },
  {
    id: 'middle_011',
    title: '外交出使',
    description: '你被選為使者，前往鄰國進行外交談判。這是一個展現你智慧和口才的機會。',
    era: 'dingli',
    year: 255,
    minAge: 36,
    maxAge: 48,
    type: 'choice',
    rarity: 'rare',
    stage: 'middle',
    priority: 22,
    butterflyEffects: [
      { type: 'diplomatic', target: '鄰國', impact: 'positive', value: 5 },
    ],
    choices: [
      {
        text: '慷慨陳詞',
        description: '以理服人，展現大國風範。',
        effects: {
          stats: { cha: 5, int: 4 },
          reputation: 15,
          exp: 45,
          butterflyEffects: [
            { type: 'diplomatic', target: '外交', impact: 'positive', value: 5 },
          ],
        },
        statCheck: 'cha',
        difficulty: 15,
        successText: '你的辯才無礙，鄰國首領被感動，兩國達成友好協議。',
        failureText: '談判破裂，兩國關係緊張。',
        successEffects: { gold: 200, reputation: 10 },
        failureEffects: { reputation: -10, stats: { lck: -3 } },
      },
      {
        text: '以利益誘惑',
        description: '用金錢和土地交換和平。',
        effects: {
          stats: { int: 3, lck: 2 },
          gold: -100,
          exp: 30,
          reputation: 5,
          butterflyEffects: [
            { type: 'economic', target: '外交', impact: 'positive', value: 3 },
          ],
        },
      },
      {
        text: '以威懾服人',
        description: '展示軍事實力，迫使對方屈服。',
        effects: {
          stats: { str: 4, cha: 3 },
          exp: 35,
          reputation: 8,
          butterflyEffects: [
            { type: 'military', target: '鄰國', impact: 'negative', value: 4 },
          ],
        },
      },
    ],
  },
  {
    id: 'middle_012',
    title: '著書立說',
    description: '你已中年，希望留下一些思想遺產。決定撰寫一部著作，流傳後世。',
    era: 'any',
    year: 240,
    minAge: 40,
    maxAge: 50,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'middle',
    priority: 8,
    butterflyEffects: [
      { type: 'cultural', target: '學術', impact: 'positive', value: 5 },
    ],
    choices: [
      {
        text: '撰寫兵法',
        description: '將軍事經驗總結成書。',
        effects: {
          stats: { int: 6, str: 2 },
          exp: 40,
          reputation: 10,
          achievements: ['兵聖'],
          butterflyEffects: [
            { type: 'cultural', target: '軍事學術', impact: 'positive', value: 5 },
          ],
        },
      },
      {
        text: '撰寫史書',
        description: '記錄時代大事，流芳百世。',
        effects: {
          stats: { int: 7, cha: 2 },
          exp: 45,
          reputation: 15,
          achievements: ['史學家'],
          butterflyEffects: [
            { type: 'cultural', target: '史學', impact: 'positive', value: 6 },
          ],
        },
      },
      {
        text: '撰寫詩文集',
        description: '將一生感觸化為詩文。',
        effects: {
          stats: { cha: 6, int: 4 },
          exp: 35,
          reputation: 8,
          achievements: ['詩人'],
          butterflyEffects: [
            { type: 'cultural', target: '文學', impact: 'positive', value: 4 },
          ],
        },
      },
    ],
  },
  {
    id: 'death_natural',
    title: '壽終正寢',
    description: '你走完了漫長的一生，在親人的陪伴下安詳離世。',
    era: 'any',
    year: 280,
    minAge: 60,
    maxAge: 100,
    type: 'choice',
    rarity: 'rare',
    stage: 'elder',
    priority: 0,
    choices: [
      {
        text: '安然離世',
        description: '無憾而終，安息於大地。',
        effects: {},
      },
    ],
  },
];

// ============================================
// 匯出所有事件
// ============================================
export const ERA_EVENTS: GameEvent[] = [
  ...HJ_EVENTS,
  ...DONGZHUO_EVENTS,
  ...QUNXIONG_EVENTS,
  ...GUANDU_EVENTS,
  ...CHIBI_EVENTS,
  ...SANDAI_EVENTS,
  ...GUIJIN_EVENTS,
];

// ============================================
// 死亡關聯生活事件 — 這些事件產生 flag/tag，用於 death linked 死因
// ============================================
export const DEATH_LINKED_LIFE_EVENTS: GameEvent[] = [
  // ---- 醫療相關 ----
  {
    id: 'life_take_dangerous_medicine',
    title: '游方醫師獻藥',
    description: '一位游方醫師看到你面色不佳，獻上他自研的「靈丹妙藥」，聲稱可以延年益壽。',
    era: 'any', year: 190, type: 'random', rarity: 'uncommon',
    minAge: 16, maxAge: 50,
    choices: [
      { text: '服用靈丹', effects: { stats: { vit: 3 }, flag: 'took_medicine' } },
      { text: '拒絕，找正規醫師', effects: { stats: { vit: 1 }, reputation: 2 } },
      { text: '讓醫師幫你診斷後再說', effects: { stats: { int: 1 }, reputation: 1 } },
    ],
  },
  {
    id: 'life_neglected_health',
    title: '勞累過度',
    description: '你最近工作過勞，身體開始發出警告。有人勸你休息，但你...',
    era: 'any', year: 190, type: 'random', rarity: 'common',
    minAge: 18, maxAge: 55,
    choices: [
      { text: '繼續加班，不顧身體', effects: { stats: { vit: -4, int: 2 }, reputation: 5 } },
      { text: '休息數日', effects: { stats: { vit: 2 }, exp: 10 } },
    ],
  },
  {
    id: 'life_refused_medicine',
    title: '良醫勸藥',
    description: '城中良醫診斷出你有隱疾，開出藥方勸你服藥調理。你...',
    era: 'any', year: 190, type: 'random', rarity: 'uncommon',
    minAge: 20, maxAge: 60,
    choices: [
      { text: '服藥調理', effects: { stats: { vit: 2 } } },
      { text: '自認身體硬朗，不需要藥', effects: { stats: { lck: -1 } } },
    ],
  },
  {
    id: 'life_drank_heavily',
    title: '宴席豪飲',
    description: '赴宴時主人極盡熱情，不斷勸酒。你...',
    era: 'any', year: 190, type: 'random', rarity: 'common',
    minAge: 16, maxAge: 50,
    choices: [
      { text: '盡情暢飲', effects: { stats: { vit: -2, lck: 1 }, gold: -5 } },
      { text: '淺酌即止', effects: { stats: { vit: 0 }, reputation: 1 } },
    ],
  },
  {
    id: 'life_ate_bad_food',
    title: '饑荒食物',
    description: '連年歉收，你找到了食物但看起來不太新鮮。',
    era: 'any', year: 190, type: 'random', rarity: 'uncommon',
    minAge: 10, maxAge: 45,
    choices: [
      { text: '吃了再說', effects: { stats: { vit: -3 } } },
      { text: '寧可不吃', effects: { stats: { vit: -1, lck: 1 } } },
    ],
  },
  // ---- 武術相關 ----
  {
    id: 'life_trained_martial',
    title: '武師求學',
    description: '當地一位退役武師開館授徒，邀請你入館學習。',
    era: 'any', year: 190, type: 'random', rarity: 'common',
    minAge: 14, maxAge: 30,
    choices: [
      { text: '刻苦練武', effects: { stats: { str: 3, vit: -1 }, flag: 'trained_martial' } },
      { text: '偶爾練練', effects: { stats: { str: 1, vit: 1 } } },
      { text: '不感興趣', effects: { reputation: 1 } },
    ],
  },
  {
    id: 'life_practiced_horsemanship',
    title: '騎術訓練',
    description: '鄰村有一位騎術高手，願意教你騎馬技巧。',
    era: 'any', year: 190, type: 'random', rarity: 'uncommon',
    minAge: 12, maxAge: 35,
    choices: [
      { text: '認真學習騎術', effects: { stats: { str: 2, vit: 1 }, flag: 'practiced_horsemanship' } },
      { text: '日常騎馬即可', effects: { stats: { vit: 1 } } },
    ],
  },
  {
    id: 'life_hunted_alone',
    title: '上山狩獵',
    description: '你獨自一人進入深山狩獵，希望能抓到野味。',
    era: 'any', year: 190, type: 'random', rarity: 'uncommon',
    minAge: 14, maxAge: 40,
    choices: [
      { text: '深入山林狩獵', effects: { stats: { str: 2, vit: -1 }, flag: 'hunted_alone', gold: 5 } },
      { text: '在郊外狩獵', effects: { stats: { str: 1 }, gold: 2 } },
      { text: '不去狩獵', effects: { stats: { vit: 1 } } },
    ],
  },
  {
    id: 'life_ignored_training',
    title: '武藝修煉',
    description: '身邊的人都去練習武藝，你...',
    era: 'any', year: 190, type: 'random', rarity: 'common',
    minAge: 14, maxAge: 30,
    choices: [
      { text: '每天練習', effects: { stats: { str: 2, vit: 1 } } },
      { text: '練武無用，讀書要緊', effects: { stats: { int: 2 }, flag: 'ignored_training' } },
    ],
  },
  // ---- 財富相關 ----
  {
    id: 'life_hoarded_wealth',
    title: '積蓄財富',
    description: '你赚了不少錢，決定...',
    era: 'any', year: 190, type: 'random', rarity: 'common',
    minAge: 20, maxAge: 55,
    choices: [
      { text: '全部藏起來', effects: { gold: 50, reputation: -3, flag: 'hoarded_wealth' } },
      { text: '投資生意', effects: { gold: -20, reputation: 3 } },
      { text: '周濟窮人', effects: { gold: -30, reputation: 10 } },
    ],
  },
  {
    id: 'life_gambled',
    title: '賭坊偶遇',
    description: '路過賭坊，有人邀請你賭兩把。',
    era: 'any', year: 190, type: 'random', rarity: 'common',
    minAge: 16, maxAge: 45,
    choices: [
      { text: '大賭一場', effects: { gold: -50, stats: { vit: -1 }, flag: 'gambled', reputation: -5 } },
      { text: '小玩一下', effects: { gold: -10 } },
      { text: '轉身離開', effects: { stats: { lck: 1 } } },
    ],
  },
  {
    id: 'life_spent_all',
    title: '揮金如土',
    description: '你突然發了一筆財，決定...',
    era: 'any', year: 190, type: 'random', rarity: 'common',
    minAge: 18, maxAge: 45,
    choices: [
      { text: '大擺宴席', effects: { gold: -40, reputation: 5, flag: 'spent_all' } },
      { text: '存起來', effects: { gold: 40 } },
    ],
  },
  // ---- 社交/政治相關 ----
  {
    id: 'life_trusted_strangers',
    title: '結交新朋友',
    description: '一位陌生人稱自己是你的遠房親戚，向你求助。',
    era: 'any', year: 190, type: 'random', rarity: 'uncommon',
    minAge: 18, maxAge: 50,
    choices: [
      { text: '慷慨相助', effects: { gold: -20, reputation: 3, flag: 'trusted_strangers' } },
      { text: '保持距離', effects: { stats: { lck: 1 } } },
    ],
  },
  {
    id: 'life_offended_powerful',
    title: '直言諫阻',
    description: '你在宴席上對權貴說了不當的話，對方...',
    era: 'any', year: 190, type: 'random', rarity: 'uncommon',
    minAge: 18, maxAge: 50,
    choices: [
      { text: '堅持己見', effects: { reputation: 5, flag: 'offended_powerful' } },
      { text: '道歉求和', effects: { reputation: -3 } },
    ],
  },
  {
    id: 'life_betrayed_trust',
    title: '利益衝突',
    description: '你的朋友和你在利益上發生了衝突，你選擇...',
    era: 'any', year: 190, type: 'random', rarity: 'uncommon',
    minAge: 20, maxAge: 55,
    choices: [
      { text: '出賣朋友換取利益', effects: { gold: 30, reputation: -10, flag: 'betrayed_trust' } },
      { text: '與朋友共享', effects: { gold: 10, reputation: 5 } },
    ],
  },
  // ---- 學習相關 ----
  {
    id: 'life_studied_medicine',
    title: '醫藥研究',
    description: '你對醫藥產生了興趣，開始研究草藥和煉丹術。',
    era: 'any', year: 190, type: 'random', rarity: 'uncommon',
    minAge: 18, maxAge: 50,
    choices: [
      { text: '深入研究丹藥', effects: { stats: { int: 3 }, flag: 'studied_medicine' } },
      { text: '只看基礎醫書', effects: { stats: { int: 1 } } },
    ],
  },
  {
    id: 'life_studied_secret_martial',
    title: '武學秘訣',
    description: '你得到一本失傳的武學秘籍，決定修煉。',
    era: 'any', year: 190, type: 'random', rarity: 'rare',
    minAge: 16, maxAge: 40,
    choices: [
      { text: '日夜苦練', effects: { stats: { str: 4, vit: -2 }, flag: 'studied_secret_martial' } },
      { text: '淺嘗即止', effects: { stats: { str: 2 } } },
    ],
  },
  // ---- 冒險相關 ----
  {
    id: 'life_explored_ruins',
    title: '古蹟探險',
    description: '附近發現了一處古代遺址，有人組織探險隊。',
    era: 'any', year: 190, type: 'random', rarity: 'uncommon',
    minAge: 16, maxAge: 40,
    choices: [
      { text: '加入探險', effects: { stats: { str: 1, vit: -1 }, gold: 10, flag: 'explored_ruins' } },
      { text: '留在家中', effects: { stats: { vit: 1 } } },
    ],
  },
  {
    id: 'life_explored_forest',
    title: '叢林探險',
    description: '南方叢林傳說中有珍稀藥材，你決定...',
    era: 'any', year: 190, type: 'random', rarity: 'uncommon',
    minAge: 16, maxAge: 45,
    choices: [
      { text: '深入叢林', effects: { stats: { vit: -2, str: 1 }, gold: 15, flag: 'explored_forest' } },
      { text: '在邊際探索', effects: { stats: { vit: -1 }, gold: 5 } },
    ],
  },
  {
    id: 'life_reckless_behavior',
    title: '逞強冒險',
    description: '有人挑戰你跳過一條河，你...',
    era: 'any', year: 190, type: 'random', rarity: 'common',
    minAge: 14, maxAge: 35,
    choices: [
      { text: '逞強一跳', effects: { stats: { str: 1, vit: -2 }, flag: 'reckless_behavior' } },
      { text: '找橋繞路', effects: { exp: 5 } },
    ],
  },
  // ---- 情感相關 ----
  {
    id: 'life_romantic_affair',
    title: '情竦初開',
    description: '你認識了一位異性，彼此產生好感。',
    era: 'any', year: 190, type: 'random', rarity: 'uncommon',
    minAge: 18, maxAge: 45,
    choices: [
      { text: '私定終身', effects: { reputation: -5, stats: { cha: 2 }, flag: 'romantic_affair' } },
      { text: '含蓄交往', effects: { stats: { cha: 1 } } },
    ],
  },
  // ---- 性格相關 ----
  {
    id: 'life_arrogant',
    title: '恃才傲物',
    description: '你在某方面有特長，因此...',
    era: 'any', year: 190, type: 'random', rarity: 'common',
    minAge: 18, maxAge: 50,
    choices: [
      { text: '更加驕傲', effects: { stats: { int: 1, cha: -2 }, flag: 'arrogant' } },
      { text: '謙虛待人', effects: { stats: { cha: 2 }, reputation: 3 } },
    ],
  },
  {
    id: 'life_traveled_dangerous',
    title: '遠行遊歷',
    description: '你決定前往危險的地帶遊歷。',
    era: 'any', year: 190, type: 'random', rarity: 'uncommon',
    minAge: 18, maxAge: 50,
    choices: [
      { text: '冒險遠行', effects: { stats: { vit: -1, str: 1 }, gold: 10, flag: 'traveled_dangerous' } },
      { text: '在本地活動', effects: { stats: { vit: 1 } } },
    ],
  },
];

export const ALL_EVENTS: GameEvent[] = [
  ...ERA_EVENTS,
  ...RANDOM_EVENTS,
  ...LIFE_STAGE_EVENTS,
  ...DEATH_LINKED_LIFE_EVENTS,
];
