#!/usr/bin/env python3
"""Add more events to reach 100+"""
import re

path = "/opt/data/three-kingdoms-game/src/lib/data/events.ts"
with open(path, "r") as f:
    content = f.read()

# More events to add - these will be inserted before the ALL_EVENTS export
more_events = r'''
// ============================================
// 更多黃巾之亂事件
// ============================================
export const HUANGJIN_MORE_EVENTS: GameEvent[] = [
  {
    id: 'huangjin_zhao_yun',
    title: '趙雲初現',
    description: '常山趙子龍率領義勇軍來投，他的武勇和忠誠令人欽佩...',
    era: 'huangjin',
    year: 184,
    minAge: 12,
    maxAge: 40,
    type: 'historical',
    rarity: 'uncommon',
    stage: 'early_adult',
    priority: 70,
    butterflyEffects: [
      { type: 'military', target: '趙雲', impact: 'positive', value: 5 },
    ],
    choices: [
      { text: '結識趙雲', description: '與趙子龍交好。', effects: { stats: { str: 3, cha: 2 }, butterflyEffects: [{ type: 'military', target: '趙雲', impact: 'positive', value: 4 }] } },
      { text: '觀望', description: '不急著結交。', effects: { stats: { vit: 2 }, butterflyEffects: [{ type: 'diplomatic', target: '自身', impact: 'neutral', value: 1 }] } },
      { text: '推薦給其他勢力', description: '趙雲是人才。', effects: { stats: { cha: 3, int: 2 }, reputation: 5, butterflyEffects: [{ type: 'political', target: '各方', impact: 'positive', value: 3 }] } },
    ],
  },
  {
    id: 'huangjin_pingling',
    title: '平定黃巾',
    description: '朝廷派兵平定黃巾之亂，各地戰火四起...',
    era: 'huangjin',
    year: 185,
    minAge: 8,
    maxAge: 55,
    type: 'combat',
    rarity: 'common',
    stage: 'child',
    priority: 60,
    butterflyEffects: [
      { type: 'military', target: '黃巾', impact: 'negative', value: 5 },
    ],
    choices: [
      { text: '協助官府平亂', description: '幫助官府鎮壓黃巾。', effects: { stats: { str: 3, exp: 30 }, reputation: -5, butterflyEffects: [{ type: 'military', target: '官府', impact: 'positive', value: 4 }] } },
      { text: '保持中立', description: '不參與任何一方。', effects: { stats: { vit: 2, lck: 2 }, butterflyEffects: [{ type: 'political', target: '自身', impact: 'neutral', value: 1 }] } },
      { text: '救助黃巾百姓', description: '黃巾多是被迫為賊。', effects: { stats: { cha: 3 }, reputation: 10, gold: -10, butterflyEffects: [{ type: 'cultural', target: '百姓', impact: 'positive', value: 4 }] } },
    ],
  },
  {
    id: 'huangjin_famine',
    title: '大饑荒',
    description: '連年旱災，糧食匱乏，饑民遍野...',
    era: 'huangjin',
    year: 185,
    minAge: 5,
    maxAge: 60,
    type: 'random',
    rarity: 'common',
    stage: 'child',
    priority: 50,
    choices: [
      { text: '開倉賑濟', description: '用你的糧食救濟百姓。', effects: { stats: { cha: 3, vit: -1 }, reputation: 15, gold: -20, butterflyEffects: [{ type: 'economic', target: '百姓', impact: 'positive', value: 5 }] } },
      { text: '遷徙避荒', description: '帶家人離開災區。', effects: { stats: { vit: 2, lck: 3 }, gold: -5, butterflyEffects: [{ type: 'economic', target: '家族', impact: 'positive', value: 3 }] } },
      { text: '閉門不出', description: '自保為主。', effects: { stats: { vit: 1 }, butterflyEffects: [{ type: 'economic', target: '自身', impact: 'neutral', value: 1 }] } },
    ],
  },
  {
    id: 'huangjin_military',
    title: '募兵從軍',
    description: '朝廷下令募兵平亂，各地豪強紛紛響應...',
    era: 'huangjin',
    year: 184,
    minAge: 14,
    maxAge: 40,
    type: 'combat',
    rarity: 'common',
    stage: 'early_adult',
    priority: 65,
    butterflyEffects: [
      { type: 'military', target: '朝廷', impact: 'positive', value: 4 },
    ],
    choices: [
      { text: '加入官軍', description: '成為朝廷的军官。', effects: { stats: { str: 4, exp: 40 }, butterflyEffects: [{ type: 'military', target: '官軍', impact: 'positive', value: 4 }] } },
      { text: '加入義勇軍', description: '自願保衛家鄉。', effects: { stats: { str: 3, cha: 2, exp: 30 }, reputation: 8, butterflyEffects: [{ type: 'political', target: '家鄉', impact: 'positive', value: 4 }] } },
      { text: '拒絕從軍', description: '不願為官賣命。', effects: { stats: { lck: 2 }, butterflyEffects: [{ type: 'political', target: '自身', impact: 'neutral', value: 1 }] } },
    ],
  },
  {
    id: 'huangjin_scholar',
    title: '書院求學',
    description: '戰亂中仍有書院開學，你決定去求學明理...',
    era: 'huangjin',
    year: 185,
    minAge: 10,
    maxAge: 25,
    type: 'scholarly',
    rarity: 'common',
    stage: 'child',
    priority: 40,
    choices: [
      { text: '專研儒家經典', description: '以經術入仕。', effects: { stats: { int: 5 }, butterflyEffects: [{ type: 'cultural', target: '儒學', impact: 'positive', value: 3 }] } },
      { text: '學習兵法', description: '以武術報國。', effects: { stats: { int: 2, str: 3 }, butterflyEffects: [{ type: 'military', target: '自身', impact: 'positive', value: 3 }] } },
      { text: '雜學旁收', description: '不專一學。', effects: { stats: { int: 2, cha: 2, lck: 2 }, butterflyEffects: [{ type: 'cultural', target: '自身', impact: 'positive', value: 2 }] } },
    ],
  },
  {
    id: 'huangjin_bandit',
    title: '山賊襲擊',
    description: '戰亂導致山賊四起，你的村莊遭到襲擊...',
    era: 'huangjin',
    year: 186,
    minAge: 8,
    maxAge: 50,
    type: 'combat',
    rarity: 'common',
    stage: 'child',
    priority: 55,
    choices: [
      { text: '反抗山賊', description: '組織村民抵抗。', effects: { stats: { str: 4, vit: -1 }, reputation: 10, butterflyEffects: [{ type: 'military', target: '山賊', impact: 'negative', value: 5 }] } },
      { text: '獻出財物', description: '破財免災。', effects: { stats: { lck: -2 }, gold: -15, butterflyEffects: [{ type: 'economic', target: '村莊', impact: 'negative', value: 3 }] } },
      { text: '逃離村莊', description: '活命要緊。', effects: { stats: { vit: -1, lck: 2 }, butterflyEffects: [{ type: 'diplomatic', target: '自身', impact: 'neutral', value: 1 }] } },
    ],
  },
  {
    id: 'huangjin_escape',
    title: '戰火逃離',
    description: '戰火逼近你的家園，你必須逃離...',
    era: 'huangjin',
    year: 186,
    minAge: 8,
    maxAge: 50,
    type: 'random',
    rarity: 'common',
    stage: 'child',
    priority: 60,
    butterflyEffects: [
      { type: 'diplomatic', target: '家鄉', impact: 'negative', value: 3 },
    ],
    choices: [
      { text: '投奔親友', description: '尋找避難之所。', effects: { stats: { cha: 3 }, reputation: 5, butterflyEffects: [{ type: 'diplomatic', target: '親友', impact: 'positive', value: 3 }] } },
      { text: '孤身遠行', description: '自力更生。', effects: { stats: { lck: 3, vit: -1 }, butterflyEffects: [{ type: 'diplomatic', target: '自身', impact: 'neutral', value: 1 }] } },
      { text: '留在故鄉', description: '故土難離。', effects: { stats: { vit: 2, lck: -2 }, butterflyEffects: [{ type: 'cultural', target: '家鄉', impact: 'positive', value: 2 }] } },
    ],
  },
];

// 合併到原有陣列
const ORIGINAL_HUANGJIN = content.match(/export const HUANGJIN_EVENTS: GameEvent\[\] = \[[\s\S]*?\n\];/);
if (ORIGINAL_HUANGJIN) {
  // Add more events to HUANGJIN_EVENTS
  const insert_marker = "];\n\n// ============================================";
  const insert_pos = content.indexOf(insert_marker);
  if (insert_pos > 0) {
    // Replace all occurrences of the original HUANGJIN_EVENTS closing
    const new_huangjin = '\n  ...HUANGJIN_MORE_EVENTS,\n';
    content = content.replace(/HUANGJIN_EVENTS,\s*\n/, 'HUANGJIN_EVENTS,\n  ...HUANGJIN_MORE_EVENTS,\n  ');
  }
}

// Actually, let me just add to ALL_EVENTS directly
content = content.replace(
  /export const ALL_EVENTS: GameEvent\[\] = \[\s*\n\s*\.\.\.HUANGJIN_EVENTS,/,
  `export const ALL_EVENTS: GameEvent[] = [\n  ...HUANGJIN_EVENTS,\n  ...HUANGJIN_MORE_EVENTS,`
);

with open(path, "w") as f:
    f.write(content)

print("Done! Adding more events...")
