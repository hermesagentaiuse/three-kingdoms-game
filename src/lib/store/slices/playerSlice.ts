// ============================================
// Player Slice — 玩家狀態（屬性、資源、技能、夥伴）
// ============================================
import type { Player, Stats, Companion, GameState, Item, ButterflyEffect } from '@/types/game';
import { SKILLS } from '@/lib/data/characters';
import { ALL_ITEMS } from '@/lib/data/items';
import { rollDice, checkStat } from '@/lib/engine/eventEngine';

export const MIN_STAT = 1;
export const MAX_STAT = 30;

/** 限制數值在有效範圍內 */
export function clampStat(value: number): number {
  return Math.max(MIN_STAT, Math.min(MAX_STAT, value));
}

/** 安全修改屬性，自動夾緊 */
export function applyStatChange(player: Player, stat: keyof Stats, amount: number): Player {
  const newPlayer = { ...player };
  newPlayer.stats = { ...newPlayer.stats };
  newPlayer.stats[stat] = clampStat(newPlayer.stats[stat] + amount);
  return newPlayer;
}

/** 應用同伴 statCheck 加成 */
export function getCompanionBonus(player: Player): number {
  if (!player.companions || player.companions.length === 0) return 0;
  // 每個同伴提供 +1~+3 的檢定加成（取決於忠誠度和屬性平均）
  const totalBonus = player.companions
    .filter((c) => c.alive)
    .reduce((sum, c) => {
      const avgStat = (c.stats.int + c.stats.str + c.stats.int + c.stats.cha + c.stats.vit) / 5;
      const loyaltyBonus = c.loyalty / 50; // 0-2
      const statBonus = avgStat >= 20 ? 2 : avgStat >= 15 ? 1.5 : avgStat >= 10 ? 1 : 0.5;
      return sum + Math.min(3, Math.floor(loyaltyBonus * statBonus));
    }, 0);
  return Math.min(totalBonus, 6); // 最高 +6
}

/** 套用物品效果 */
export function applyItemEffects(player: Player, itemId: string): { player: Player; changeLog: string[] } {
  const item = player.resources.items.find((i) => i.id === itemId);
  if (!item || item.consumable === false) {
    return { player, changeLog: [`物品 "${item?.name || itemId}" 不可使用。`] };
  }

  const changeLog: string[] = [];
  let newPlayer = { ...player };

  if (item.effects) {
    // 屬性加成
    if (item.effects.int) {
      newPlayer = applyStatChange(newPlayer, 'int', item.effects.int);
      changeLog.push(`智力 ${item.effects.int > 0 ? '+' : ''}${item.effects.int}`);
    }
    if (item.effects.str) {
      newPlayer = applyStatChange(newPlayer, 'str', item.effects.str);
      changeLog.push(`武力 ${item.effects.str > 0 ? '+' : ''}${item.effects.str}`);
    }
    if (item.effects.lck) {
      newPlayer = applyStatChange(newPlayer, 'lck', item.effects.lck);
      changeLog.push(`運氣 ${item.effects.lck > 0 ? '+' : ''}${item.effects.lck}`);
    }
    if (item.effects.cha) {
      newPlayer = applyStatChange(newPlayer, 'cha', item.effects.cha);
      changeLog.push(`魅力 ${item.effects.cha > 0 ? '+' : ''}${item.effects.cha}`);
    }
    if (item.effects.vit) {
      newPlayer = applyStatChange(newPlayer, 'vit', item.effects.vit);
      changeLog.push(`體力 ${item.effects.vit > 0 ? '+' : ''}${item.effects.vit}`);
    }
    // 特殊加成 — 暫時作為經驗值或額外獎勵
    if (item.effects.vitRecovery && item.consumable) {
      changeLog.push(`體力恢復 ${item.effects.vitRecovery}`);
    }
    if (item.effects.lifespanBonus && item.consumable) {
      changeLog.push(`壽命延長 ${item.effects.lifespanBonus}歲`);
    }
    // 消耗物品後從庫存移除
    newPlayer.resources = { ...newPlayer.resources };
    newPlayer.resources.items = newPlayer.resources.items.filter((i) => i.id !== itemId);
  }

  return { player: newPlayer, changeLog };
}

/** 套用物品效果到事件效果系統 */
export function applyEffectsToPlayer(player: Player, effects: Record<string, unknown>): {
  player: Player;
  changeLog: string[];
} {
  const changeLog: string[] = [];
  let newPlayer = { ...player } as Player;

  // === 屬性效果 ===
  const statsEffect = (effects.stats as Record<string, number>) || {};
  for (const [statKey, amount] of Object.entries(statsEffect)) {
    if (typeof amount === 'number' && amount !== 0) {
      newPlayer = applyStatChange(newPlayer, statKey as keyof Stats, amount);
    }
  }

  // === 資源效果 ===
  if (effects.gold && typeof effects.gold === 'number') {
    newPlayer.resources = { ...newPlayer.resources };
    newPlayer.resources.gold = clampStat(Math.max(0, newPlayer.resources.gold + effects.gold));
  }
  if (effects.reputation && typeof effects.reputation === 'number') {
    newPlayer.resources = { ...newPlayer.resources };
    newPlayer.resources.reputation = clampStat(
      Math.max(-100, Math.min(100, newPlayer.resources.reputation + effects.reputation as number))
    );
  }
  if (effects.intelligence && typeof effects.intelligence === 'number') {
    newPlayer.resources = { ...newPlayer.resources };
    newPlayer.resources.intelligence = Math.max(0, newPlayer.resources.intelligence + effects.intelligence as number);
  }

  // === 物品效果 ===
  if (effects.items && typeof effects.items === 'object') {
    const itemEffect = effects.items as { action?: string; id?: string; quantity?: number };
    if (itemEffect.action === 'add' && itemEffect.id) {
      const known = ALL_ITEMS.find((it) => it.id === itemEffect.id);
      const newItem: Item = known ?? {
        id: itemEffect.id,
        name: itemEffect.id,
        description: '',
        type: 'key',
        goldValue: 0,
      };
      newPlayer.resources = { ...newPlayer.resources, items: [...newPlayer.resources.items, newItem] };
      changeLog.push(`獲得物品：${newItem.name}`);
    }
    if (itemEffect.action === 'remove' && itemEffect.id) {
      newPlayer.resources = { ...newPlayer.resources };
      newPlayer.resources.items = newPlayer.resources.items.filter((i) => i.id !== itemEffect.id);
      changeLog.push(`失去物品：${itemEffect.id}`);
    }
  }

  // === 夥伴效果 ===
  if (effects.companions) {
    const companionsEffect = effects.companions as { action: string; id?: string }[];
    for (const c of companionsEffect) {
      if (c.action === 'join') {
        changeLog.push('新同伴加入');
        if (c.id) {
          const companionMap: Record<string, Partial<Companion>> = {
            caocao: { id: 'caocao', name: '曹操', isHistorical: true, stats: { int: 25, str: 20, lck: 15, cha: 22, vit: 18 }, loyalty: 50, skills: ['politics', 'strategy'], alive: true },
            liubei: { id: 'liubei', name: '劉備', isHistorical: true, stats: { int: 12, str: 15, lck: 20, cha: 25, vit: 14 }, loyalty: 50, skills: ['charisma', 'diplomacy'], alive: true },
            sunce: { id: 'sunce', name: '孫策', isHistorical: true, stats: { int: 14, str: 25, lck: 15, cha: 20, vit: 20 }, loyalty: 50, skills: ['combat', 'cavalry'], alive: true },
            sunquan: { id: 'sunquan', name: '孫權', isHistorical: true, stats: { int: 18, str: 12, lck: 15, cha: 18, vit: 14 }, loyalty: 50, skills: ['politics', 'strategy'], alive: true },
            liubiao: { id: 'liubiao', name: '劉表', isHistorical: true, stats: { int: 16, str: 8, lck: 10, cha: 14, vit: 12 }, loyalty: 50, skills: ['literature'], alive: true },
            yangxiu: { id: 'yangxiu', name: '楊脩', isHistorical: true, stats: { int: 24, str: 6, lck: 12, cha: 20, vit: 10 }, loyalty: 50, skills: ['literature', 'politics'], alive: true },
            xun_yu: { id: 'xun_yu', name: '荀彧', isHistorical: true, stats: { int: 26, str: 5, lck: 10, cha: 20, vit: 10 }, loyalty: 50, skills: ['strategy', 'politics'], alive: true },
            guojia: { id: 'guojia', name: '郭嘉', isHistorical: true, stats: { int: 25, str: 6, lck: 18, cha: 16, vit: 8 }, loyalty: 50, skills: ['strategy', 'divination'], alive: true },
          };
          const compData = companionMap[c.id];
          if (compData) {
            const newComp: Companion = { ...compData } as Companion;
            newPlayer.companions = [...newPlayer.companions, newComp];
          }
          // === 更新陣營 ===
          const factionMap: Record<string, string> = {
            caocao: 'wei', liubei: 'shu', sunce: 'wu', sunquan: 'wu', liubiao: 'wu',
            yangxiu: 'wei', xun_yu: 'wei', guojia: 'wei',
          };
          if (factionMap[c.id]) {
            newPlayer.faction = factionMap[c.id];
            changeLog.push(`加入 ${c.id} 陣營`);
          }
        }
      }
      if (c.action === 'leave') {
        changeLog.push('同伴離去');
        const removeId = c.id;
        newPlayer.companions = newPlayer.companions.filter((comp) => comp.id !== removeId);
      }
      if (c.action === 'die') {
        changeLog.push('同伴陣亡');
        const removeId = c.id;
        newPlayer.companions = newPlayer.companions.filter((comp) => comp.id !== removeId);
      }
    }
  }

  // === 關係效果 ===
  if (effects.relationships) {
    newPlayer.relationships = { ...newPlayer.relationships, ...(effects.relationships as Record<string, number>) };
  }

  // === 經驗值 ===
  if (effects.exp && typeof effects.exp === 'number') {
    newPlayer.totalExp = (newPlayer.totalExp || 0) + effects.exp as number;
    changeLog.push(`經驗值 ${effects.exp > 0 ? '+' : ''}${effects.exp}`);
  }

  // === 成就 ===
  if (effects.achievements && Array.isArray(effects.achievements)) {
    const existing = newPlayer.achievements || [];
    for (const ach of effects.achievements as string[]) {
      if (!existing.includes(ach)) {
        newPlayer.achievements = [...existing, ach];
        changeLog.push(`獲得成就：${ach}`);
      }
    }
  }

  // === 陣營效果 ===
  if (effects.faction && typeof effects.faction === 'string') {
    newPlayer.faction = effects.faction as string;
    const factionNames: Record<string, string> = {
      wei: '魏', shu: '蜀', wu: '吳', independent: '獨立', none: '無',
    };
    changeLog.push(`加入陣營：${factionNames[effects.faction] || effects.faction}`);
  }

  // === 蝴蝶效應追蹤 ===
  if (effects.butterflyEffects && Array.isArray(effects.butterflyEffects)) {
    const existingHistory = newPlayer.butterflyHistory || [];
    for (const be of effects.butterflyEffects as ButterflyEffect[]) {
      existingHistory.push(be);
      changeLog.push(`蝴蝶效應：${be.target} (${be.impact}) ${be.value > 0 ? '+' : ''}${be.value}`);
    }
    newPlayer.butterflyHistory = existingHistory;

    // === 聚合 butterflySummary（target → total value） ===
    const summary = { ...newPlayer.butterflySummary };
    for (const be of effects.butterflyEffects as ButterflyEffect[]) {
      const { target, value } = be;
      summary[target] = (summary[target] || 0) + value;
    }
    newPlayer.butterflySummary = summary;
  }

  return { player: newPlayer, changeLog };
}

/** 檢查技能解鎖 */
export function checkSkillUnlock(player: Player): string[] {
  const newSkills = [...player.skills];
  const unlocked: string[] = [];
  for (const skill of SKILLS) {
    if (!newSkills.includes(skill.id) && checkSkillRequirement(skill, player.stats)) {
      newSkills.push(skill.id);
      unlocked.push(skill.name);
    }
  }
  if (unlocked.length > 0) {
    // 返回新玩家（技能更新）和通知
  }
  return unlocked;
}

function checkSkillRequirement(skill: import('@/types/game').Skill, stats: Stats): boolean {
  if (skill.minStat && skill.minStatValue) {
    return stats[skill.minStat] >= skill.minStatValue;
  }
  return false;
}
