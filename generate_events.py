#!/usr/bin/env python3
"""Generate additional events for Three Kingdoms game to reach 100+ events."""

import json
import os

PROJECT = "/opt/data/three-kingdoms-game/src/lib/data/events.ts"

# Read current file
with open(PROJECT, "r") as f:
    content = f.read()

# New events to add
new_random_events = '''
// ============================================
// 董卓亂政事件 (189-192)
// ============================================

export const DONGZHUO_EVENTS: GameEvent[] = [
  {
    id: 'dongzhuo_arrival',
    title: '董卓入洛陽',
    description: '中平六年(189年)，董卓率西涼軍入洛陽，廢少帝立獻帝，專斷朝政。你身在洛陽城中，目睹這一切...',
    era: 'dongzhuo',
    year: 189,
    minAge: 8,
    maxAge: 50,
    type: 'historical',
    rarity: 'common',
    stage: 'young_adult',
    priority: 90,
    butterflyEffects: [
      { type: 'political', target: '漢廷', impact: 'negative', value: 8 },
      { type: 'military', target: '董卓', impact: 'positive', value: 6 },
    ],
    choices: [
      {
        text: '暗中聯絡忠臣，圖謀誅殺董卓',
        description: '加入反董聯盟，力圖匡扶漢室。',
        effects: {
          reputation: 15,
          stats: { cha: 3, int: 2 },
          gold: -20,
          butterflyEffects: [{ type: 'political', target: '反董聯盟', impact: 'positive', value: 5 }],
        },
      },
      {
        text: '投靠董卓，尋求前程',
        description: '攀附權貴，謀求仕途。',
        effects: {
          stats: { str: 2, lck: 2 },
          gold: 30,
          reputation: -10,
          butterflyEffects: [{ type: 'political', target: '董卓', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '遠離洛陽，避禍他鄉',
        description: '天下將亂，不如遠走。',
        effects: {
          stats: { vit: 2, lck: 3 },
          butterflyEffects: [{ type: 'diplomatic', target: '鄉里', impact: 'positive', value: 2 }],
        },
      },
    ],
  },
  {
    id: 'dongzhuo_tyrant',
    title: '董卓暴政',
    description: '董卓殘暴不仁，焚燒洛陽，屠殺百姓。民不聊生，怨聲載道。你目睹百姓流離失所...',
    era: 'dongzhuo',
    year: 190,
    minAge: 10,
    maxAge: 60,
    type: 'random',
    rarity: 'common',
    stage: 'young_adult',
    priority: 70,
    butterflyEffects: [
      { type: 'political', target: '董卓', impact: 'negative', value: 5 },
      { type: 'economic', target: '百姓', impact: 'negative', value: 6 },
    ],
    choices: [
      {
        text: '救濟難民',
        description: '傾盡家財救助流離百姓。',
        effects: {
          reputation: 10,
          gold: -15,
          stats: { cha: 3, vit: 1 },
          butterflyEffects: [{ type: 'cultural', target: '百姓', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '加入討董義軍',
        description: '響應十八路諸侯討伐董卓。',
        effects: {
          stats: { str: 3, exp: 40 },
          reputation: 8,
          gold: -10,
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
    minAge: 8,
    maxAge: 55,
    type: 'historical',
    rarity: 'uncommon',
    stage: 'young_adult',
    priority: 80,
    butterflyEffects: [
      { type: 'cultural', target: '洛陽', impact: 'negative', value: 8 },
      { type: 'political', target: '長安', impact: 'positive', value: 4 },
    ],
    choices: [
      {
        text: '沿路收攬人才',
        description: '遷都路上結交各地義士。',
        effects: {
          stats: { cha: 4 },
          reputation: 5,
          butterflyEffects: [{ type: 'political', target: '人才', impact: 'positive', value: 3 }],
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
          stats: { int: 2 },
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
    minAge: 12,
    maxAge: 45,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'young_adult',
    priority: 75,
    butterflyEffects: [
      { type: 'diplomatic', target: '呂布', impact: 'positive', value: 3 },
      { type: 'political', target: '董卓', impact: 'negative', value: 5 },
    ],
    choices: [
      {
        text: '協助王允，提供情報',
        description: '幫助王允刺探董卓軍情。',
        effects: {
          stats: { int: 4, cha: 2 },
          reputation: 12,
          butterflyEffects: [{ type: 'political', target: '反董', impact: 'positive', value: 6 }],
        },
      },
      {
        text: '暗中向董卓報信',
        description: '向董卓告密，獲取信任。',
        effects: {
          stats: { lck: 2 },
          gold: 25,
          reputation: -15,
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
    year: 191,
    minAge: 14,
    maxAge: 50,
    type: 'diplomatic',
    rarity: 'rare',
    stage: 'early_adult',
    priority: 85,
    butterflyEffects: [
      { type: 'military', target: '呂布', impact: 'positive', value: 5 },
      { type: 'political', target: '各方勢力', impact: 'mixed', value: 4 },
    ],
    choices: [
      {
        text: '收留呂布，結為盟友',
        description: '接纳這位天下猛將，增強軍力。',
        effects: {
          stats: { str: 3, cha: 2 },
          exp: 50,
          butterflyEffects: [{ type: 'military', target: '己方', impact: 'positive', value: 6 }],
        },
        successText: '呂布歸附！軍力大增！',
      },
      {
        text: '禮送呂布前往其他地方',
        description: '避免結怨，將呂布引薦給其他勢力。',
        effects: {
          stats: { cha: 3 },
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
    year: 192,
    minAge: 15,
    maxAge: 35,
    type: 'choice',
    rarity: 'common',
    stage: 'early_adult',
    priority: 60,
    choices: [
      {
        text: '與武勇之士結義',
        description: '尋求武力上的夥伴。',
        effects: {
          stats: { str: 4 },
          companions: [{ id: 'brot1', action: 'join' }],
          butterflyEffects: [{ type: 'military', target: '結義', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '與智謀之士結義',
        description: '尋求智略上的夥伴。',
        effects: {
          stats: { int: 4 },
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
    description: '曹操在陳留散盡家財，拉起第一支義軍。他的野心與才華開始展現...',
    era: 'qunxiong',
    year: 192,
    minAge: 10,
    maxAge: 50,
    type: 'historical',
    rarity: 'uncommon',
    stage: 'young_adult',
    priority: 80,
    butterflyEffects: [
      { type: 'military', target: '曹操', impact: 'positive', value: 5 },
      { type: 'political', target: '各方', impact: 'positive', value: 3 },
    ],
    choices: [
      {
        text: '投奔曹操',
        description: '加入曹操的義軍。',
        effects: {
          stats: { int: 3, str: 2 },
          exp: 40,
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
          stats: { cha: 3 },
          reputation: 5,
          butterflyEffects: [{ type: 'political', target: '其他', impact: 'positive', value: 3 }],
        },
      },
    ],
  },
  {
    id: 'qunxiong_guandu_prep',
    title: '青州兵事件',
    description: '青州黃巾降眾數十萬，曹操欲收編為軍。這將改變北方勢力格局...',
    era: 'qunxiong',
    year: 193,
    minAge: 12,
    maxAge: 45,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    priority: 85,
    butterflyEffects: [
      { type: 'military', target: '曹操', impact: 'positive', value: 7 },
      { type: 'political', target: '青州', impact: 'negative', value: 3 },
    ],
    choices: [
      {
        text: '協助曹操收編',
        description: '幫助曹操安撫青州降眾。',
        effects: {
          stats: { cha: 4, int: 2 },
          reputation: 10,
          exp: 60,
          butterflyEffects: [{ type: 'military', target: '曹操', impact: 'positive', value: 5 }],
        },
      },
      {
        text: '勸阻曹操，擔心黃巾反覆',
        description: '黃巾降眾難信，不如不放。',
        effects: {
          stats: { int: 3 },
          reputation: -5,
          butterflyEffects: [{ type: 'political', target: '曹操', impact: 'negative', value: 3 }],
        },
      },
      {
        text: '趁機自立門戶',
        description: '在混亂中招募自己的軍隊。',
        effects: {
          stats: { str: 3, lck: 2 },
          gold: -30,
          butterflyEffects: [{ type: 'military', target: '自立', impact: 'positive', value: 4 }],
        },
      },
    ],
  },
  {
    id: 'qunxiong_sunce',
    title: '孫策平江東',
    description: '孫策以父喪所得的玉璽為質，向袁術借得兵馬，開始平定江東六郡...',
    era: 'qunxiong',
    year: 194,
    minAge: 12,
    maxAge: 40,
    type: 'historical',
    rarity: 'rare',
    stage: 'young_adult',
    priority: 75,
    butterflyEffects: [
      { type: 'military', target: '孫策', impact: 'positive', value: 6 },
      { type: 'political', target: '江東', impact: 'positive', value: 5 },
    ],
    choices: [
      {
        text: '渡江南下，投奔孫策',
        description: '加入這位小霸王的事業。',
        effects: {
          stats: { str: 4, lck: 2 },
          exp: 50,
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
          butterflyEffects: [{ type: 'cultural', target: '江東', impact: 'positive', value: 3 }],
        },
      },
    ],
  },
  {
    id: 'qunxiong_liubei',
    title: '劉備賣履',
    description: '劉備目前淪落到在涿郡賣草鞋為生。你聽說他要招募義勇軍...',
    era: 'qunxiong',
    year: 194,
    minAge: 10,
    maxAge: 50,
    type: 'random',
    rarity: 'uncommon',
    stage: 'young_adult',
    priority: 65,
    butterflyEffects: [
      { type: 'political', target: '劉備', impact: 'positive', value: 4 },
      { type: 'cultural', target: '仁義', impact: 'positive', value: 3 },
    ],
    choices: [
      {
        text: '慷慨解囊，資助劉備',
        description: '識英雄重英雄，幫助劉備招募義勇軍。',
        effects: {
          stats: { cha: 3, lck: 3 },
          gold: -20,
          reputation: 15,
          butterflyEffects: [{ type: 'political', target: '劉備', impact: 'positive', value: 5 }],
        },
      },
      {
        text: '加入義勇軍',
        description: '跟隨這位中山靖王之後。',
        effects: {
          stats: { cha: 2, int: 2 },
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
    era: 'qunxiong',
    year: 195,
    minAge: 10,
    maxAge: 55,
    type: 'random',
    rarity: 'uncommon',
    stage: 'young_adult',
    priority: 60,
    butterflyEffects: [
      { type: 'cultural', target: '荊州', impact: 'positive', value: 5 },
      { type: 'economic', target: '荊州', impact: 'positive', value: 3 },
    ],
    choices: [
      {
        text: '前往荊州避難',
        description: '在荊州求學問、結交名士。',
        effects: {
          stats: { int: 4, vit: 2 },
          reputation: 8,
          butterflyEffects: [{ type: 'cultural', target: '荊州', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '在荊州經商',
        description: '荊州富庶，商機無限。',
        effects: {
          stats: { lck: 3, cha: 2 },
          gold: 25,
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
    era: 'qunxiong',
    year: 195,
    minAge: 14,
    maxAge: 40,
    type: 'choice',
    rarity: 'rare',
    stage: 'young_adult',
    priority: 80,
    butterflyEffects: [
      { type: 'political', target: '曹操', impact: 'positive', value: 4 },
      { type: 'cultural', target: '人才', impact: 'positive', value: 3 },
    ],
    choices: [
      {
        text: '接受推薦，入曹營',
        description: '成為曹操的謀士。',
        effects: {
          stats: { int: 5, cha: 3 },
          exp: 60,
          reputation: 10,
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
          stats: { cha: 4 },
          reputation: 8,
          butterflyEffects: [{ type: 'political', target: '各方', impact: 'positive', value: 3 }],
        },
      },
    ],
  },
];

// ============================================
// 官渡之戰事件 (196-200)
// ============================================

export const GUANDU_EVENTS: GameEvent[] = [
  {
    id: 'guandu_caos_fresh',
    title: '曹操屯田',
    description: '曹操在許都附近推行屯田制，解決了軍糧問題。這成為他日後勝利的關鍵...',
    era: 'guandu',
    year: 196,
    minAge: 8,
    maxAge: 60,
    type: 'historical',
    rarity: 'uncommon',
    stage: 'young_adult',
    priority: 75,
    butterflyEffects: [
      { type: 'economic', target: '曹操', impact: 'positive', value: 6 },
      { type: 'military', target: '曹操', impact: 'positive', value: 4 },
    ],
    choices: [
      {
        text: '學習屯田制度，推廣到你的領地',
        description: '模仿曹操的屯田政策。',
        effects: {
          stats: { int: 4 },
          gold: 20,
          butterflyEffects: [{ type: 'economic', target: '自身', impact: 'positive', value: 5 }],
        },
      },
      {
        text: '協助曹操推行屯田',
        description: '加入曹操的屯田團隊。',
        effects: {
          stats: { int: 3, cha: 2 },
          exp: 40,
          gold: 15,
          butterflyEffects: [{ type: 'economic', target: '曹操', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '不理會',
        description: '這不是你的事。',
        effects: {
          stats: { vit: 2 },
          butterflyEffects: [{ type: 'economic', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
    ],
  },
  {
    id: 'guandu_emperor',
    title: '曹操迎駕',
    description: '曹操率軍迎漢獻帝入許都，「挾天子以令諸侯」。天下格局從此改變...',
    era: 'guandu',
    year: 196,
    minAge: 10,
    maxAge: 50,
    type: 'historical',
    rarity: 'rare',
    stage: 'young_adult',
    priority: 95,
    butterflyEffects: [
      { type: 'political', target: '曹操', impact: 'positive', value: 8 },
      { type: 'political', target: '漢廷', impact: 'negative', value: 5 },
    ],
    choices: [
      {
        text: '擁護天子，反對曹操',
        description: '曹操挾天子是篡逆之舉。',
        effects: {
          stats: { cha: 4, int: 2 },
          reputation: 15,
          gold: -15,
          butterflyEffects: [{ type: 'political', target: '漢廷', impact: 'positive', value: 6 }],
        },
      },
      {
        text: '順應形勢，擁戴曹操',
        description: '挾天子以令諸侯是明智之舉。',
        effects: {
          stats: { int: 3 },
          gold: 25,
          reputation: -8,
          butterflyEffects: [{ type: 'political', target: '曹操', impact: 'positive', value: 5 }],
        },
      },
      {
        text: '保持中立',
        description: '誰贏就幫誰。',
        effects: {
          stats: { lck: 2, cha: 2 },
          butterflyEffects: [{ type: 'political', target: '各方', impact: 'neutral', value: 1 }],
        },
      },
    ],
  },
  {
    id: 'guandu_zhangliao',
    title: '張遼歸附',
    description: '東郡太守張遼在夏侯惇麾下效力，你的表現吸引了張遼的注意...',
    era: 'guandu',
    year: 197,
    minAge: 14,
    maxAge: 45,
    type: 'choice',
    rarity: 'rare',
    stage: 'early_adult',
    priority: 70,
    butterflyEffects: [
      { type: 'military', target: '張遼', impact: 'positive', value: 5 },
    ],
    choices: [
      {
        text: '與張遼切磋武藝',
        description: '結識這位名將。',
        effects: {
          stats: { str: 4, exp: 30 },
          butterflyEffects: [{ type: 'military', target: '張遼', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '與張遼論兵法',
        description: '以學識折服對方。',
        effects: {
          stats: { int: 4, cha: 2 },
          reputation: 8,
          butterflyEffects: [{ type: 'political', target: '張遼', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '禮讓張遼',
        description: '將機會讓給其他人。',
        effects: {
          stats: { cha: 3 },
          reputation: 5,
          butterflyEffects: [{ type: 'diplomatic', target: '各方', impact: 'positive', value: 2 }],
        },
      },
    ],
  },
  {
    id: 'guandu_huang_gai',
    title: '黃蓋獻計',
    description: '江夏太守黃蓋向孫策獻計火攻，準備擊敗劉勳。你被捲入了這場計謀...',
    era: 'guandu',
    year: 197,
    minAge: 12,
    maxAge: 40,
    type: 'choice',
    rarity: 'uncommon',
    stage: 'early_adult',
    priority: 65,
    butterflyEffects: [
      { type: 'military', target: '孫策', impact: 'positive', value: 4 },
      { type: 'military', target: '劉勳', impact: 'negative', value: 3 },
    ],
    choices: [
      {
        text: '協助實施火攻計',
        description: '成為火攻的執行者。',
        effects: {
          stats: { str: 3, int: 3 },
          exp: 50,
          reputation: 10,
          butterflyEffects: [{ type: 'military', target: '孫策', impact: 'positive', value: 5 }],
        },
      },
      {
        text: '提供情報支持',
        description: '暗中刺探劉勳軍情。',
        effects: {
          stats: { int: 4 },
          reputation: 8,
          butterflyEffects: [{ type: 'political', target: '孫策', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '避免參與',
        description: '火攻風險太大。',
        effects: {
          stats: { vit: 2, lck: 2 },
          butterflyEffects: [{ type: 'diplomatic', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
    ],
  },
  {
    id: 'guandu_bingfa',
    title: '學習兵書',
    description: '你在書中讀到了孫武的《孫子兵法》和吳起的《吳子》。這些兵書將對你產生深遠影響...',
    era: 'guandu',
    year: 198,
    minAge: 10,
    maxAge: 50,
    type: 'scholarly',
    rarity: 'common',
    stage: 'young_adult',
    priority: 50,
    choices: [
      {
        text: '深入研究《孫子兵法》',
        description: '精通孫武的戰略思想。',
        effects: {
          stats: { int: 5, exp: 30 },
          butterflyEffects: [{ type: 'cultural', target: '兵法', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '研讀《吳子》',
        description: '學習吳起的治軍之道。',
        effects: {
          stats: { int: 3, str: 3, exp: 30 },
          butterflyEffects: [{ type: 'military', target: '自身', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '博覽群書',
        description: '不偏廢，廣泛學習。',
        effects: {
          stats: { int: 3, cha: 2, lck: 2, exp: 20 },
          butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'positive', value: 2 }],
        },
      },
    ],
  },
  {
    id: 'guandu_jixu',
    title: '吉平毒藥',
    description: '太醫吉平密謀在曹操的粥中下毒。消息走漏，吉平被曹操處死。你是否參與此計？',
    era: 'guandu',
    year: 198,
    minAge: 12,
    maxAge: 40,
    type: 'choice',
    rarity: 'rare',
    stage: 'early_adult',
    priority: 80,
    butterflyEffects: [
      { type: 'political', target: '曹操', impact: 'negative', value: 5 },
      { type: 'political', target: '漢廷', impact: 'positive', value: 3 },
    ],
    choices: [
      {
        text: '協助吉平下毒',
        description: '參與誅殺董卓般的叛賊曹操。',
        effects: {
          stats: { int: 4, cha: 2 },
          reputation: 10,
          gold: -10,
          butterflyEffects: [{ type: 'political', target: '曹操', impact: 'negative', value: 6 }],
        },
        successText: '曹操中計！天下為之一震！',
        successEffects: { exp: 100, reputation: 20 },
        failureEffects: { vit: -3, reputation: -15 },
        failureText: '計謀敗露，被曹操追捕！',
      },
      {
        text: '勸阻吉平',
        description: '這不是明智之舉。',
        effects: {
          stats: { int: 3, cha: 3 },
          reputation: 5,
          butterflyEffects: [{ type: 'political', target: '各方', impact: 'neutral', value: 1 }],
        },
      },
      {
        text: '事不關己',
        description: '不參與政治暗殺。',
        effects: {
          stats: { lck: 2 },
          butterflyEffects: [{ type: 'political', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
    ],
  },
];

// ============================================
// 赤壁之戰事件 (200-208)
// ============================================

export const CHIBI_EVENTS: GameEvent[] = [
  {
    id: 'chibi_longzhong',
    title: '三顧茅廬',
    description: '劉備三顧茅廬請諸葛亮出山。你作為劉備的追随者，也在場見證了這歷史性的一刻...',
    era: 'chibi',
    year: 207,
    minAge: 10,
    maxAge: 45,
    type: 'historical',
    rarity: 'rare',
    stage: 'early_adult',
    priority: 100,
    butterflyEffects: [
      { type: 'political', target: '諸葛亮', impact: 'positive', value: 8 },
      { type: 'political', target: '劉備', impact: 'positive', value: 6 },
      { type: 'cultural', target: '智略', impact: 'positive', value: 5 },
    ],
    choices: [
      {
        text: '協助劉備安排接待',
        description: '幫助劉備展現誠意。',
        effects: {
          stats: { cha: 4, int: 3 },
          reputation: 15,
          exp: 50,
          butterflyEffects: [{ type: 'political', target: '諸葛亮', impact: 'positive', value: 5 }],
        },
      },
      {
        text: '在旁觀摩諸葛亮的談吐',
        description: '學習這位臥龍的見解。',
        effects: {
          stats: { int: 5, cha: 2 },
          exp: 60,
          butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '不感興趣',
        description: '這種事與你無關。',
        effects: {
          stats: { lck: 1 },
          butterflyEffects: [{ type: 'political', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
    ],
  },
  {
    id: 'chibi_alliance',
    title: '孫劉聯盟',
    description: '諸葛亮單刀赴會，說服孫權與劉備聯手抗曹。你面臨一個重大選擇...',
    era: 'chibi',
    year: 208,
    minAge: 12,
    maxAge: 45,
    type: 'diplomatic',
    rarity: 'rare',
    stage: 'early_adult',
    priority: 95,
    butterflyEffects: [
      { type: 'military', target: '孫劉聯盟', impact: 'positive', value: 7 },
      { type: 'political', target: '曹操', impact: 'negative', value: 5 },
      { type: 'diplomatic', target: '孫權', impact: 'positive', value: 4 },
    ],
    choices: [
      {
        text: '支持聯手抗曹',
        description: '只有聯盟才能對抗曹操。',
        effects: {
          stats: { int: 4, cha: 3 },
          reputation: 15,
          exp: 70,
          butterflyEffects: [{ type: 'military', target: '孫劉聯盟', impact: 'positive', value: 6 }],
        },
      },
      {
        text: '勸孫權投降',
        description: '抵抗必敗，不如早早歸順。',
        effects: {
          stats: { int: 3, lck: -3 },
          reputation: -20,
          gold: 30,
          butterflyEffects: [{ type: 'political', target: '孫權', impact: 'negative', value: 6 }],
        },
      },
      {
        text: '保持沉默',
        description: '不表態，觀察形勢。',
        effects: {
          stats: { lck: 2, vit: 2 },
          butterflyEffects: [{ type: 'diplomatic', target: '各方', impact: 'neutral', value: 1 }],
        },
      },
    ],
  },
  {
    id: 'chibi_fire',
    title: '赤壁火攻',
    description: '赤壁大戰爆發！周瑜的火攻計劃正在執行中。曹軍鐵鎖連環，大火吞噬戰船...',
    era: 'chibi',
    year: 208,
    minAge: 12,
    maxAge: 50,
    type: 'combat',
    rarity: 'legendary',
    stage: 'early_adult',
    priority: 100,
    butterflyEffects: [
      { type: 'military', target: '曹操', impact: 'negative', value: 10 },
      { type: 'political', target: '孫劉聯盟', impact: 'positive', value: 8 },
      { type: 'military', target: '孫權', impact: 'positive', value: 6 },
      { type: 'military', target: '劉備', impact: 'positive', value: 5 },
    ],
    choices: [
      {
        text: '衝入曹軍大營，乘亂劫掠',
        description: '趁火打劫，撈取戰利品。',
        effects: {
          stats: { str: 5, lck: 3 },
          gold: 50,
          exp: 80,
          butterflyEffects: [{ type: 'military', target: '曹操', impact: 'negative', value: 4 }],
        },
        successText: '你大發戰爭財！獲得了大量物資！',
        failureText: '被曹軍殘部圍攻，險象環生！',
      },
      {
        text: '救濟被火燒傷的士兵',
        description: '無論敵我，都是人命。',
        effects: {
          stats: { cha: 5, vit: -1 },
          reputation: 20,
          butterflyEffects: [{ type: 'cultural', target: '仁義', impact: 'positive', value: 5 }],
        },
      },
      {
        text: '遠觀戰況，記錄歷史',
        description: '這是改變歷史的一戰，值得記錄。',
        effects: {
          stats: { int: 4, lck: 2 },
          reputation: 10,
          butterflyEffects: [{ type: 'cultural', target: '歷史', impact: 'positive', value: 4 }],
        },
      },
    ],
  },
  {
    id: 'chibi_zhuge_plan',
    title: '諸葛亮借東風',
    description: '諸葛亮的火攻需要東風才能成功。他建壇借風，奇蹟發生了——東風真的來了！...',
    era: 'chibi',
    year: 208,
    minAge: 12,
    maxAge: 45,
    type: 'choice',
    rarity: 'rare',
    stage: 'early_adult',
    priority: 85,
    butterflyEffects: [
      { type: 'cultural', target: '諸葛亮', impact: 'positive', value: 8 },
      { type: 'military', target: '孫劉聯盟', impact: 'positive', value: 5 },
    ],
    choices: [
      {
        text: '親眼見證借東風',
        description: '被諸葛亮的奇蹟折服。',
        effects: {
          stats: { int: 3, lck: 3, cha: 2 },
          reputation: 8,
          butterflyEffects: [{ type: 'cultural', target: '諸葛亮', impact: 'positive', value: 5 }],
        },
      },
      {
        text: '暗中調查借東風的真相',
        description: '真的能借風嗎？還是另有籌謀？',
        effects: {
          stats: { int: 5 },
          reputation: -5,
          butterflyEffects: [{ type: 'cultural', target: '真相', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '不關心這些',
        description: '與你無關。',
        effects: {
          stats: { vit: 2 },
          butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
    ],
  },
  {
    id: 'chibi_flee',
    title: '華容道',
    description: '曹操從華容道逃跑，關羽放走了他。這是一個改變三國格局的決定...',
    era: 'chibi',
    year: 208,
    minAge: 12,
    maxAge: 45,
    type: 'choice',
    rarity: 'legendary',
    stage: 'early_adult',
    priority: 90,
    butterflyEffects: [
      { type: 'political', target: '曹操', impact: 'positive', value: 6 },
      { type: 'political', target: '關羽', impact: 'positive', value: 4 },
      { type: 'political', target: '劉備', impact: 'mixed', value: 3 },
    ],
    choices: [
      {
        text: '追擊曹操，絕不放過',
        description: '曹操不除，後患無窮。',
        effects: {
          stats: { str: 4, int: 3 },
          exp: 80,
          reputation: 10,
          butterflyEffects: [{ type: 'military', target: '曹操', impact: 'negative', value: 6 }],
        },
        successText: '曹操被擊斃！北方大亂！',
        failureText: '曹軍死戰，你未能追上！',
      },
      {
        text: '理解關羽的決定',
        description: '重義輕利，也是好漢。',
        effects: {
          stats: { cha: 4, int: 3 },
          reputation: 15,
          butterflyEffects: [{ type: 'political', target: '各方', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '批評關羽',
        description: '公事私情混為一談是大忌。',
        effects: {
          stats: { int: 4, cha: -2 },
          reputation: -5,
          butterflyEffects: [{ type: 'political', target: '劉備', impact: 'negative', value: 3 }],
        },
      },
    ],
  },
  {
    id: 'chibi_economy',
    title: '戰後重建',
    description: '赤壁之戰後，各方勢力都需要休養生息。你決定如何在戰後謀生？',
    era: 'chibi',
    year: 209,
    minAge: 10,
    maxAge: 60,
    type: 'random',
    rarity: 'common',
    stage: 'young_adult',
    priority: 50,
    choices: [
      {
        text: '經營農業',
        description: '深耕土地，自給自足。',
        effects: {
          stats: { vit: 3 },
          gold: 15,
          butterflyEffects: [{ type: 'economic', target: '自身', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '經商貿易',
        description: '戰後物資匱乏，商人獲利。',
        effects: {
          stats: { lck: 3, cha: 2 },
          gold: 30,
          butterflyEffects: [{ type: 'economic', target: '各方', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '繼續從軍',
        description: '下一戰即將到來。',
        effects: {
          stats: { str: 3, exp: 30 },
          butterflyEffects: [{ type: 'military', target: '自身', impact: 'positive', value: 3 }],
        },
      },
    ],
  },
];

// ============================================
// 三國鼎立事件 (220-220)
// ============================================

export const SANDAI_EVENTS: GameEvent[] = [
  {
    id: 'sandai_weiguanglin',
    title: '魏國廣陵之變',
    description: '魏國勢力在廣陵擴張，你被徵召參與這次軍事行動...',
    era: 'sandai',
    year: 220,
    minAge: 12,
    maxAge: 45,
    type: 'combat',
    rarity: 'uncommon',
    stage: 'early_adult',
    priority: 70,
    butterflyEffects: [
      { type: 'military', target: '魏國', impact: 'positive', value: 5 },
    ],
    choices: [
      {
        text: '英勇參戰',
        description: '為魏國立功。',
        effects: {
          stats: { str: 4, exp: 40 },
          reputation: 10,
          butterflyEffects: [{ type: 'military', target: '魏國', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '尋找機會脫身',
        description: '不想為魏國賣命。',
        effects: {
          stats: { lck: 3, vit: -1 },
          butterflyEffects: [{ type: 'political', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
      {
        text: '勸阻戰爭',
        description: '戰爭只會帶來苦難。',
        effects: {
          stats: { cha: 3, int: 2 },
          reputation: 5,
          butterflyEffects: [{ type: 'political', target: '各方', impact: 'positive', value: 2 }],
        },
      },
    ],
  },
  {
    id: 'sandai_shu_guozhong',
    title: '諸葛亮治蜀',
    description: '諸葛亮在成都制定嚴明的法度，蜀漢國力蒸蒸日上...',
    era: 'sandai',
    year: 221,
    minAge: 8,
    maxAge: 55,
    type: 'historical',
    rarity: 'uncommon',
    stage: 'young_adult',
    priority: 75,
    butterflyEffects: [
      { type: 'political', target: '蜀漢', impact: 'positive', value: 6 },
      { type: 'economic', target: '蜀漢', impact: 'positive', value: 4 },
      { type: 'cultural', target: '蜀漢', impact: 'positive', value: 3 },
    ],
    choices: [
      {
        text: '學習蜀漢法度',
        description: '推廣到你的生活區域。',
        effects: {
          stats: { int: 4 },
          reputation: 8,
          gold: 10,
          butterflyEffects: [{ type: 'political', target: '自身', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '加入蜀漢政權',
        description: '成為諸葛亮的下属。',
        effects: {
          stats: { int: 3, cha: 3 },
          exp: 50,
          reputation: 12,
          butterflyEffects: [{ type: 'political', target: '蜀漢', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '保持距離',
        description: '不願被卷入政治。',
        effects: {
          stats: { vit: 2, lck: 2 },
          butterflyEffects: [{ type: 'diplomatic', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
    ],
  },
  {
    id: 'sandai_wu_jiangdong',
    title: '孫權建吳',
    description: '孫權在武昌稱帝，建立吳國。江東士族紛紛效忠...',
    era: 'sandai',
    year: 222,
    minAge: 10,
    maxAge: 50,
    type: 'historical',
    rarity: 'uncommon',
    stage: 'young_adult',
    priority: 70,
    butterflyEffects: [
      { type: 'political', target: '吳國', impact: 'positive', value: 6 },
      { type: 'political', target: '江東士族', impact: 'positive', value: 4 },
    ],
    choices: [
      {
        text: '擁護孫權建國',
        description: '成為吳國的臣民。',
        effects: {
          stats: { cha: 3, lck: 2 },
          reputation: 8,
          gold: 15,
          butterflyEffects: [{ type: 'political', target: '吳國', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '觀望三方形勢',
        description: '不急著選邊站。',
        effects: {
          stats: { int: 3, lck: 2 },
          butterflyEffects: [{ type: 'political', target: '各方', impact: 'neutral', value: 1 }],
        },
      },
      {
        text: '支持劉備',
        description: '漢室正統不容質疑。',
        effects: {
          stats: { cha: 4, lck: -2 },
          reputation: 10,
          butterflyEffects: [{ type: 'political', target: '蜀漢', impact: 'positive', value: 4 }],
        },
      },
    ],
  },
  {
    id: 'sandai_north_trade',
    title: '北方貿易',
    description: '魏國控制北方，商路通達。你決定從中謀利...',
    era: 'sandai',
    year: 222,
    minAge: 12,
    maxAge: 55,
    type: 'random',
    rarity: 'common',
    stage: 'young_adult',
    priority: 50,
    choices: [
      {
        text: '投資北方商路',
        description: '與魏國商人合作。',
        effects: {
          stats: { lck: 3, int: 2 },
          gold: 25,
          butterflyEffects: [{ type: 'economic', target: '魏國', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '建立自己的商隊',
        description: '自主經商，不依賴他人。',
        effects: {
          stats: { lck: 4, cha: 2 },
          gold: 15,
          butterflyEffects: [{ type: 'economic', target: '各方', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '經商風險太大',
        description: '還是務實一點。',
        effects: {
          stats: { vit: 2 },
          butterflyEffects: [{ type: 'economic', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
    ],
  },
  {
    id: 'sandai_scholar',
    title: '名士清談',
    description: '三國名士們聚在一起清談玄學，探討人生哲學。你也受邀參加...',
    era: 'sandai',
    year: 223,
    minAge: 14,
    maxAge: 50,
    type: 'scholarly',
    rarity: 'common',
    stage: 'young_adult',
    priority: 45,
    choices: [
      {
        text: '積極參與清談',
        description: '展現你的學識。',
        effects: {
          stats: { int: 4, cha: 3 },
          reputation: 10,
          butterflyEffects: [{ type: 'cultural', target: '清談', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '旁聽學習',
        description: '多聽多學。',
        effects: {
          stats: { int: 3 },
          reputation: 5,
          butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '對清談無感',
        description: '這些虛談無益於國事。',
        effects: {
          stats: { str: 2, vit: 2 },
          butterflyEffects: [{ type: 'political', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
    ],
  },
];

// ============================================
// 三國歸晉事件 (220-280)
// ============================================

export const GUIJIN_EVENTS: GameEvent[] = [
  {
    id: 'guijin_sima_wei',
    title: '司馬懿崛起',
    description: '司馬懿在魏國政壇逐漸崛起，他的兒子司馬師、司馬昭也開始展露頭角...',
    era: 'guijin',
    year: 239,
    minAge: 10,
    maxAge: 50,
    type: 'historical',
    rarity: 'uncommon',
    stage: 'young_adult',
    priority: 80,
    butterflyEffects: [
      { type: 'political', target: '司馬氏', impact: 'positive', value: 7 },
      { type: 'political', target: '曹魏', impact: 'negative', value: 5 },
    ],
    choices: [
      {
        text: '投靠司馬氏',
        description: '這將是未來的統治者。',
        effects: {
          stats: { int: 4, cha: 2 },
          exp: 40,
          reputation: -8,
          butterflyEffects: [{ type: 'political', target: '司馬氏', impact: 'positive', value: 5 }],
        },
      },
      {
        text: '保持距離',
        description: '不急著站隊。',
        effects: {
          stats: { lck: 2, vit: 2 },
          butterflyEffects: [{ type: 'political', target: '各方', impact: 'neutral', value: 1 }],
        },
      },
      {
        text: '支持曹魏',
        description: '反對司馬氏篡權。',
        effects: {
          stats: { cha: 4, lck: -2 },
          reputation: 10,
          gold: -20,
          butterflyEffects: [{ type: 'political', target: '曹魏', impact: 'positive', value: 4 }],
        },
      },
    ],
  },
  {
    id: 'guijin_jiangwei',
    title: '姜維北伐',
    description: '姜維繼承諸葛亮的遺志，持續北伐曹魏。這是最後的爭鬥...',
    era: 'guijin',
    year: 256,
    minAge: 12,
    maxAge: 50,
    type: 'combat',
    rarity: 'rare',
    stage: 'early_adult',
    priority: 85,
    butterflyEffects: [
      { type: 'military', target: '蜀漢', impact: 'negative', value: 5 },
      { type: 'military', target: '曹魏', impact: 'negative', value: 4 },
      { type: 'cultural', target: '忠義', impact: 'positive', value: 4 },
    ],
    choices: [
      {
        text: '加入姜維北伐軍',
        description: '為諸葛亮的遺志而戰。',
        effects: {
          stats: { str: 4, exp: 50 },
          reputation: 12,
          butterflyEffects: [{ type: 'military', target: '蜀漢', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '反對無謂戰爭',
        description: '百姓已經夠苦了。',
        effects: {
          stats: { cha: 3, int: 2 },
          reputation: 8,
          butterflyEffects: [{ type: 'political', target: '各方', impact: 'positive', value: 3 }],
        },
      },
      {
        text: '觀望形勢',
        description: '看看誰能笑到最後。',
        effects: {
          stats: { lck: 2, vit: 2 },
          butterflyEffects: [{ type: 'political', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
    ],
  },
  {
    id: 'guijin_jin_chao',
    title: '司馬炎代魏',
    description: '泰始元年(265年)，司馬炎迫使魏元帝禪讓，建立晉朝。三國時代即將結束...',
    era: 'guijin',
    year: 265,
    minAge: 10,
    maxAge: 55,
    type: 'historical',
    rarity: 'legendary',
    stage: 'young_adult',
    priority: 100,
    butterflyEffects: [
      { type: 'political', target: '晉朝', impact: 'positive', value: 10 },
      { type: 'political', target: '曹魏', impact: 'negative', value: 8 },
      { type: 'political', target: '蜀漢', impact: 'neutral', value: 0 },
    ],
    choices: [
      {
        text: '擁護晉朝',
        description: '順應天命，擁戴新朝。',
        effects: {
          stats: { int: 3, cha: 3 },
          reputation: 5,
          gold: 20,
          butterflyEffects: [{ type: 'political', target: '晉朝', impact: 'positive', value: 6 }],
        },
      },
      {
        text: '反對篡位',
        description: '晉朝是篡逆之朝。',
        effects: {
          stats: { cha: 5, lck: -3 },
          reputation: 15,
          gold: -15,
          butterflyEffects: [{ type: 'political', target: '晉朝', impact: 'negative', value: 5 }],
        },
      },
      {
        text: '避世隱居',
        description: '朝代更迭，不如退隱。',
        effects: {
          stats: { vit: 3, lck: 3 },
          butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'positive', value: 3 }],
        },
      },
    ],
  },
  {
    id: 'guijin_shu_mie',
    title: '蜀漢滅亡',
    description: '景耀六年(263年)，魏國大軍入侵蜀漢，劉禪投降。蜀漢滅亡...',
    era: 'guijin',
    year: 263,
    minAge: 8,
    maxAge: 60,
    type: 'historical',
    rarity: 'rare',
    stage: 'middle',
    priority: 95,
    butterflyEffects: [
      { type: 'political', target: '蜀漢', impact: 'negative', value: 10 },
      { type: 'military', target: '曹魏', impact: 'positive', value: 7 },
    ],
    choices: [
      {
        text: '幫助蜀漢抵抗',
        description: '盡忠報國。',
        effects: {
          stats: { str: 4, cha: 3 },
          exp: 60,
          reputation: 15,
          butterflyEffects: [{ type: 'military', target: '蜀漢', impact: 'positive', value: 5 }],
        },
        successText: '你力挽狂瀾，蜀漢得以延續！',
        successEffects: { butterflyEffects: [{ type: 'political', target: '蜀漢', impact: 'positive', value: 8 }] },
        failureText: '魏軍勢大，蜀漢仍將滅亡...',
      },
      {
        text: '逃離蜀地',
        description: '保住性命要緊。',
        effects: {
          stats: { lck: 3, vit: 2 },
          butterflyEffects: [{ type: 'diplomatic', target: '自身', impact: 'neutral', value: 1 }],
        },
      },
      {
        text: '記錄歷史',
        description: '見證這個時代的落幕。',
        effects: {
          stats: { int: 4, cha: 2 },
          reputation: 8,
          butterflyEffects: [{ type: 'cultural', target: '歷史', impact: 'positive', value: 4 }],
        },
      },
    ],
  },
  {
    id: 'guijin_wu_mie',
    title: '吳國滅亡',
    description: '天紀四年(280年)，晉軍兵臨建業，孫皓出降。三國歸晉，天下一統...',
    era: 'guijin',
    year: 280,
    minAge: 10,
    maxAge: 55,
    type: 'historical',
    rarity: 'legendary',
    stage: 'middle',
    priority: 100,
    butterflyEffects: [
      { type: 'political', target: '晉朝', impact: 'positive', value: 10 },
      { type: 'political', target: '吳國', impact: 'negative', value: 8 },
      { type: 'cultural', target: '三國時代', impact: 'negative', value: 6 },
    ],
    choices: [
      {
        text: '抵抗晉軍',
        description: '寧為玉碎不為瓦全。',
        effects: {
          stats: { str: 5, cha: 3 },
          reputation: 20,
          butterflyEffects: [{ type: 'military', target: '吳國', impact: 'positive', value: 6 }],
        },
        successText: '你奮死抵抗，為吳國贏得了尊嚴！',
        successEffects: { exp: 100, reputation: 30 },
        failureText: '晉軍勢不可擋，你力戰而亡...',
        failureEffects: { alive: false },
      },
      {
        text: '順應天命，歸順晉朝',
        description: '天下大勢分久必合。',
        effects: {
          stats: { int: 3, lck: 2 },
          gold: 30,
          reputation: -5,
          butterflyEffects: [{ type: 'political', target: '晉朝', impact: 'positive', value: 4 }],
        },
      },
      {
        text: '隱居不仕',
        description: '王朝更迭，不如退隱山林。',
        effects: {
          stats: { vit: 3, lck: 3, cha: 2 },
          reputation: 10,
          butterflyEffects: [{ type: 'cultural', target: '隱逸', impact: 'positive', value: 5 }],
        },
      },
    ],
  },
  {
    id: 'guijin_reunion',
    title: '天下一統',
    description: '公元280年，三國終於歸於一統。你站在這個歷史的轉折點，回顧自己的一生...',
    era: 'guijin',
    year: 280,
    minAge: 15,
    maxAge: 80,
    type: 'choice',
    rarity: 'legendary',
    stage: 'elder',
    priority: 100,
    choices: [
      {
        text: '享受太平',
        description: '終於可以安穩度過了。',
        effects: {
          stats: { vit: 3, lck: 3, cha: 2 },
          reputation: 5,
          butterflyEffects: [{ type: 'cultural', target: '太平', impact: 'positive', value: 5 }],
        },
      },
      {
        text: '撰寫回憶錄',
        description: '將這一生記錄下來。',
        effects: {
          stats: { int: 5, cha: 3 },
          reputation: 15,
          butterflyEffects: [{ type: 'cultural', target: '歷史', impact: 'positive', value: 6 }],
        },
      },
      {
        text: '告誡後人',
        description: '希望後人能從三國的教訓中學習。',
        effects: {
          stats: { cha: 5, int: 4 },
          reputation: 20,
          butterflyEffects: [{ type: 'cultural', target: '後世', impact: 'positive', value: 5 }],
        },
      },
    ],
  },
];

// 加入 ALL_EVENTS
ALL_EVENTS.push(...DONGZHUO_EVENTS);
ALL_EVENTS.push(...QUNXIONG_EVENTS);
ALL_EVENTS.push(...GUANDU_EVENTS);
ALL_EVENTS.push(...CHIBI_EVENTS);
ALL_EVENTS.push(...SANDAI_EVENTS);
ALL_EVENTS.push(...GUIJIN_EVENTS);

'''

# Insert new events before the ALL_EVENTS export
insert_marker = "export const ALL_EVENTS: GameEvent[] = ["
insert_pos = content.find(insert_marker)

if insert_pos == -1:
    print("ERROR: Could not find ALL_EVENTS marker")
    exit(1)

new_content = content[:insert_pos] + "\n" + new_random_events + "\n" + content[insert_pos:]

with open(PROJECT, "w") as f:
    f.write(new_content)

# Count events
total = new_content.count("id: '")
print(f"Total events after expansion: {total}")
print("File updated successfully!")
