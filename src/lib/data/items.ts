// ============================================
// 物品數據系統 (三國蝴蝶遊戲)
// ============================================

import type { Item } from '@/types/game';

// ============================================
// 武器 (5 種)
// ============================================

const WEAPONS: Item[] = [
  {
    id: 'weapon_qinggang',
    name: '青釭劍',
    description: '曹操寶劍，鋒利無比，削鐵如泥。劍身帶有青龍紋，出鞘時寒光閃閃。',
    type: 'weapon',
    effects: { str: 3, combatBonus: 3 },
    goldValue: 50,
  },
  {
    id: 'weapon_yuemao',
    name: '丈八蛇矛',
    description: '張飛專用長矛，長丈八，矛頭如蛇蜿蜒，力大者方可使用，單挑極強。',
    type: 'weapon',
    effects: { str: 2, singleCombatBonus: 2 },
    goldValue: 40,
  },
  {
    id: 'weapon_shuanggu',
    name: '雙股劍',
    description: '劉備專用雙劍，小巧便於雙手使用，暗藏機鋒，兼備武力與魅力。',
    type: 'weapon',
    effects: { str: 1, cha: 1 },
    goldValue: 30,
  },
  {
    id: 'weapon_qinglong',
    name: '青龍偃月刀',
    description: '關羽專用大刀，重八十二斤，刀身如半月，氣勢磅礴，威力無匹。',
    type: 'weapon',
    effects: { str: 4, vit: -1 },
    goldValue: 80,
  },
  {
    id: 'weapon_fenghuo',
    name: '方天畫戟',
    description: '呂布專用畫戟，戟身繪有火焰紋，威震天下，但使用者需得天眷顧。',
    type: 'weapon',
    effects: { str: 3, lck: -1 },
    goldValue: 70,
  },
];

// ============================================
// 防具 (3 種)
// ============================================

const ARMORS: Item[] = [
  {
    id: 'armor_heavy',
    name: '重鎧',
    description: '精鋼打造的重型鎧甲，防禦力極強，能抵禦重擊，行動稍顯笨拙。',
    type: 'armor',
    effects: { vit: 2, defenseBonus: 2 },
    goldValue: 40,
  },
  {
    id: 'armor_light',
    name: '輕甲',
    description: '輕便的皮甲，適合敏捷型將領，行動靈活且提升體力。',
    type: 'armor',
    effects: { vit: 1, speedBonus: 1 },
    goldValue: 25,
  },
  {
    id: 'armor_leather',
    name: '皮甲',
    description: '基本防具，由鞣製皮革製成，價格實惠，適合新手將領。',
    type: 'armor',
    effects: { vit: 1 },
    goldValue: 15,
  },
];

// ============================================
// 藥品 (3 種)
// ============================================

const MEDICINES: Item[] = [
  {
    id: 'medicine_huato',
    name: '華佗清心散',
    description: '華佗特製藥散，清心明目，服用後體力大幅提升，一次性使用。',
    type: 'medicine',
    effects: { vitRecovery: 3 },
    goldValue: 20,
    consumable: true,
  },
  {
    id: 'medicine_jinchuang',
    name: '金瘡藥',
    description: '治療戰傷的良藥，可在戰鬥中恢復體力，常見療傷聖品。',
    type: 'medicine',
    effects: { combatVitRecovery: 1 },
    goldValue: 10,
    consumable: true,
  },
  {
    id: 'medicine_changsheng',
    name: '長生藥',
    description: '傳說中的長生不老藥，服用後可增加一年壽命。極為稀有，得之不易。',
    type: 'medicine',
    effects: { lifespanBonus: 1 },
    goldValue: 200,
    rarity: 'rare',
    consumable: true,
  },
];

// ============================================
// 古籍 (2 種)
// ============================================

const BOOKS: Item[] = [
  {
    id: 'book_sunzi',
    name: '孫子兵法',
    description: '孫武所著的兵法經典，學習後可大幅提升學問事件的成功率。',
    type: 'book',
    effects: { scholarlyBonus: 3 },
    goldValue: 60,
  },
  {
    id: 'book_wujing',
    name: '孟德新書',
    description: '曹操所注兵法，當世兵家奉為圭臬，研習後可大幅提升戰鬥事件的成功率。',
    type: 'book',
    effects: { combatBonus: 3 },
    goldValue: 60,
  },
];

// ============================================
// 名馬 (3 種) — 演義三大名騎
// ============================================

const HORSES: Item[] = [
  {
    id: 'horse_chitu',
    name: '赤兔馬',
    description: '日行千里，夜行八百，渾身火炭紅。先賜董卓，後歸呂布，關公斬顏良誅文醜皆仗此馬。「人中呂布，馬中赤兔」。',
    type: 'horse',
    effects: { str: 1, speedBonus: 4, singleCombatBonus: 3 },
    goldValue: 150,
    rarity: 'legendary',
  },
  {
    id: 'horse_dilu',
    name: '的盧馬',
    description: '額有白點，相馬者蒯越斷言「的盧剋主」。然劉備躍馬檀溪，一躍三丈，生死關頭反救其主。',
    type: 'horse',
    effects: { speedBonus: 3, lck: 2 },
    goldValue: 100,
    rarity: 'rare',
  },
  {
    id: 'horse_jueying',
    name: '絕影',
    description: '曹操的座騎，「絕影」之意為奔走如影不可及。宛城之變，此馬身中三箭、目損一睛仍奮蹄救主，讓曹操得以逃脫。',
    type: 'horse',
    effects: { speedBonus: 3, vitRecovery: 1 },
    goldValue: 100,
    rarity: 'rare',
  },
];

// ============================================
// 奢侈品 (2 種)
// ============================================

const TREASURES: Item[] = [
  {
    id: 'treasure_jade',
    name: '美玉',
    description: '溫潤如玉的寶石，贈送他人可大幅提升關係，社交利器。',
    type: 'treasure',
    effects: { giftBonus: 5 },
    goldValue: 50,
  },
  {
    id: 'treasure_painting',
    name: '書畫',
    description: '名家書畫作品，展示品味與才華，可提升詩書技能加成。',
    type: 'treasure',
    effects: { poetryBonus: 3 },
    goldValue: 30,
  },
];

// ============================================
// 全部物品列表 (15 種)
// ============================================

export const ALL_ITEMS: Item[] = [
  ...WEAPONS,
  ...ARMORS,
  ...MEDICINES,
  ...BOOKS,
  ...HORSES,
  ...TREASURES,
];

// 按類別分組
export const WEAPON_ITEMS: Item[] = WEAPONS;
export const ARMOR_ITEMS: Item[] = ARMORS;
export const MEDICINE_ITEMS: Item[] = MEDICINES;
export const BOOK_ITEMS: Item[] = BOOKS;
export const TREASURE_ITEMS: Item[] = TREASURES;

// ============================================
// 物品查找
// ============================================

export function getItemById(id: string): Item | undefined {
  return ALL_ITEMS.find(item => item.id === id);
}

export function getItemsByType(type: string): Item[] {
  return ALL_ITEMS.filter(item => item.type === type);
}

// ============================================
// 隨機物品獲取
// ============================================

export function getRandomCommonItem(): Item | null {
  const commonItems = ALL_ITEMS.filter(item => item.rarity !== 'rare' && item.rarity !== 'legendary');
  if (commonItems.length === 0) return null;
  const index = Math.floor(Math.random() * commonItems.length);
  return commonItems[index];
}

export function getRandomRareItem(): Item | null {
  const rareItems = ALL_ITEMS.filter(item => item.rarity === 'rare');
  if (rareItems.length === 0) return null;
  const index = Math.floor(Math.random() * rareItems.length);
  return rareItems[index];
}

// ============================================
// 購買物品
// ============================================

export function buyItem(itemId: string, gold: number): { success: boolean; item?: Item } {
  const item = getItemById(itemId);
  if (!item) {
    return { success: false };
  }
  if (gold < item.goldValue) {
    return { success: false };
  }
  return {
    success: true,
    item: { ...item },
  };
}
