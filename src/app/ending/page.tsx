'use client';

// ============================================
// EndingPage — 結局頁面（完整版）
// 顯示生平年表、最終屬性統計、
// 蝴蝶效應總結、歷史評價
// ============================================

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { addLeaderboardEntry, addServerLeaderboard, type LeaderboardEntry } from '@/lib/data/leaderboard';
import { ENDINGS, type Ending } from '@/lib/data/endings';
import { HISTORICAL_CHARACTERS } from '@/lib/data/characters';
import type { Player, ButterflyEffect, ChoiceRecord } from '@/types/game';
import { getAchievementDef, ALL_ACHIEVEMENTS } from '@/components/AchievementBadge';

// ============================================
// 歷史評價生成（嚴格模式：根據實際行為評分）
// ============================================
function generateHistoricalEvaluation(player: Player, ending: Ending): string {
  const { stats, resources, achievements, butterflyHistory, history } = player;
  const parts: string[] = [];
  const age = player.age;
  const birthYear = player.birthYear || 184;

  // 過濾出 5 歲以上的選擇
  const adultHistory = history.filter((h) => (h.year - birthYear) >= 5);

  // === 核心原則：只因為「做過的事」而讚美，不因「天生屬性」而誇大 ===
  const hasSignificantDeeds = butterflyHistory.length >= 3 || adultHistory.length >= 10 || achievements.length >= 3;

  // === 屬性評價（有成就才提，否則只說天生條件） ===
  // 智力
  if (stats.int >= 20) {
    parts.push(hasSignificantDeeds
      ? '天資聰穎，更難得的是善用其才，屢出良策。'
      : '天生聰穎，但一生未曾展現所長。'
    );
  } else if (stats.int >= 15) {
    parts.push(hasSignificantDeeds
      ? '才思敏捷，屢有建樹。'
      : '天資不錯，然未見其用武之地。'
    );
  } else if (stats.int < 5) {
    parts.push('天資平平，行事多憑直覺。');
  } else {
    parts.push('智力中等，不顯山不露水。');
  }

  // 武力
  if (stats.str >= 20) {
    parts.push(hasSignificantDeeds
      ? '勇冠三軍，實至名歸。'
      : '身強體壯，但未曾上陣殺敵。'
    );
  } else if (stats.str >= 15) {
    parts.push(hasSignificantDeeds
      ? '膂力過人，屢建戰功。'
      : '體格健壯，卻鮮少出手。'
    );
  } else if (stats.str < 5) {
    parts.push('體格文弱，不諳武藝。');
  } else {
    parts.push('體格普通。');
  }

  // 魅力
  if (stats.cha >= 20) {
    parts.push(hasSignificantDeeds
      ? '魅力非凡，眾望所歸。'
      : '天生麗質，但一生寂寂無聞。'
    );
  } else if (stats.cha < 5) {
    parts.push('貌不驚人，罕為人所注意。');
  } else {
    parts.push('相貌端正，不失為一普通人物。');
  }

  // === 資源評價（嚴格門檻） ===
  if (resources.gold >= 500 && hasSignificantDeeds) {
    parts.push(`家財萬貫，黃金${resources.gold}兩。`);
  } else if (resources.gold >= 500 && !hasSignificantDeeds) {
    parts.push(`家中殷實，留有黃金${resources.gold}兩。`);
  } else if (resources.gold >= 100) {
    parts.push('家境尚可。');
  }

  if (resources.reputation >= 100 && hasSignificantDeeds) {
    parts.push('名滿天下，遐邇聞達。');
  } else if (resources.reputation >= 50 && hasSignificantDeeds) {
    parts.push('聲望不俗，一隅聞名。');
  } else if (resources.reputation >= 50 && !hasSignificantDeeds) {
    parts.push('早年頗有名聲，然終其一生未再攀升。');
  } else if (resources.reputation >= 20) {
    parts.push('稍有聲望。');
  }

  // === 蝴蝶效應評價（核心指標） ===
  if (butterflyHistory.length >= 10) {
    parts.push('一生左右局勢，左右逢源，可謂蝴蝶效應之化身。');
  } else if (butterflyHistory.length >= 5) {
    parts.push('其選擇次次關鍵，深刻影響歷史走向。');
  } else if (butterflyHistory.length >= 3) {
    const targets = Object.keys(player.butterflySummary || {});
    parts.push(targets.length > 0
      ? `其於${targets.join('、')}等方面留下印記，雖微末卻有其價值。`
      : '一生中做了幾次有意義的決定。'
    );
  } else if (butterflyHistory.length >= 1) {
    parts.push('一生偶有選擇，影響有限。');
  }

  // === 成人經歷評價 ===
  if (adultHistory.length >= 50) {
    parts.push('經歷無數風雨，閱歷極其豐富。');
  } else if (adultHistory.length >= 20) {
    parts.push('一生經歷坎坷，閱歷尚豐。');
  } else if (adultHistory.length >= 10) {
    parts.push('人生選擇不算少，每步皆有其意義。');
  } else if (adultHistory.length > 0) {
    parts.push('經歷尚淺，人生旅程才剛起步。');
  }

  // === 成就評價 ===
  if (achievements.length >= 5) {
    parts.push('成就斐然，可謂一戰成名。');
  } else if (achievements.length >= 1) {
    parts.push(`得${achievements.length}則成就，亦算點綴人生。`);
  }

  // === 夭折/短命特殊評價 ===
  if (player.age < 5 && butterflyHistory.length === 0 && adultHistory.length === 0) {
    parts.push('襁褓之中的生命，未及展現便已消逝。');
  } else if (player.age < 15 && butterflyHistory.length === 0 && adultHistory.length === 0) {
    parts.push('年華早逝，壮志未展，一生如白駒過隙。');
  }

  // === 終極兜底：一生平凡的普通人 ===
  if (parts.length === 0 || (butterflyHistory.length === 0 && adultHistory.length === 0 && achievements.length === 0)) {
    parts.length = 0; // 清空
    parts.push('一生平凡，如塵埃落入大河，無人注意，無人紀念。');
    if (age >= 15) {
      parts.push('然能平安度日，亦是一種福氣。');
    }
  }

  return parts.join(' ');
}

// ============================================
// 動態計算評價數值（根據實際表現）
// ============================================
function calculateDynamicStats(player: Player): Record<string, number> {
  const butterflyHistory = player.butterflyHistory || [];
  const butterflySummary = player.butterflySummary || {};
  const achievements = player.achievements || [];
  const history = player.history || [];
  const age = player.age;
  const birthYear = player.birthYear || 184;

  // 過濾出 5 歲以上的選擇
  const adultHistory = history.filter((h) => (h.year - birthYear) >= 5);

  // === 基礎分數計算 ===

  // 歷史影響力 (0-100)：基於蝴蝶效應
  let historicalImpact = 0;
  const totalButterflyValue = Object.values(butterflySummary).reduce((a, b) => a + Math.abs(b), 0);
  historicalImpact = Math.min(100, Math.floor(
    butterflyHistory.length * 5 +           // 每次選擇 +5
    totalButterflyValue * 3 +                // 蝴蝶效應總值
    (player.stats.int >= 20 ? 10 : player.stats.int >= 15 ? 5 : 0) +  // 智力加成
    (achievements.filter(a => a.startsWith('hist_') || a.startsWith('impact_')).length * 10) // 成就加成
  ));
  if (age < 5) historicalImpact = Math.min(historicalImpact, 5); // 夭折大幅限制
  if (age < 15) historicalImpact = Math.min(historicalImpact, 15); // 短命大幅限制

  // 個人成就 (0-100)：基於成就、成人選擇次數、技能
  let personalAchievement = 0;
  personalAchievement = Math.min(100, Math.floor(
    achievements.length * 8 +              // 每個成就 +8
    Math.min(adultHistory.length * 2, 40) + // 成人選擇次數加成（上限40）
    player.skills.length * 3 +             // 每個技能 +3
    (player.resources.reputation >= 50 ? 10 : player.resources.reputation >= 20 ? 5 : 0) // 聲望加成
  ));
  if (age < 5) personalAchievement = Math.min(personalAchievement, 5);
  if (age < 15) personalAchievement = Math.min(personalAchievement, 15);

  // 人際關係 (0-100)：基於關係值
  let relationships = 0;
  const relValues = Object.values(player.relationships);
  if (relValues.length > 0) {
    const avgRel = relValues.reduce((a, b) => a + Math.abs(b), 0) / relValues.length;
    const totalRel = relValues.reduce((a, b) => a + b, 0);
    relationships = Math.min(100, Math.floor(avgRel * 2 + Math.abs(totalRel) * 0.5));
  }
  if (age < 5) relationships = Math.min(relationships, 5);
  if (age < 15) relationships = Math.min(relationships, 20);

  // 財富 (0-100)：基於當前和金銀峰值
  let wealth = 0;
  wealth = Math.min(100, Math.floor(
    Math.min(player.resources.gold, 500) / 5 +     // 當前金銀
    Math.min((player as any).maxGold || player.resources.gold, 500) / 10  // 峰值
  ));
  if (age < 5) wealth = Math.min(wealth, 3);
  if (age < 15) wealth = Math.min(wealth, 10);

  // 流傳 (0-100)：基於聲望、蝴蝶效應、壽命
  let legacy = 0;
  legacy = Math.min(100, Math.floor(
    player.resources.reputation * 0.5 +           // 聲望
    butterflyHistory.length * 4 +                 // 蝴蝶效應
    Math.min(age * 1, 20)                          // 壽命加成
  ));
  if (age < 5) legacy = Math.min(legacy, 2);
  if (age < 15) legacy = Math.min(legacy, 8);

  // 總評 = 各維度平均（加權）
  const overall = Math.floor(
    historicalImpact * 0.3 +
    personalAchievement * 0.25 +
    relationships * 0.15 +
    wealth * 0.1 +
    legacy * 0.2
  );

  return {
    overall: Math.min(100, Math.max(0, overall)),
    historicalImpact: Math.min(100, Math.max(0, historicalImpact)),
    personalAchievement: Math.min(100, Math.max(0, personalAchievement)),
    relationships: Math.min(100, Math.max(0, relationships)),
    wealth: Math.min(100, Math.max(0, wealth)),
    legacy: Math.min(100, Math.max(0, legacy)),
  };
}

// ============================================
// 生平年表
// ============================================
function buildTimeline(player: Player): Array<{ year: number; era: string; text: string; icon: string }> {
  const timeline: Array<{ year: number; era: string; text: string; icon: string }> = [];
  const birthYear = player.birthYear || 184;

  // 從選擇歷史中生成年表（過濾 3 歲以下事件）
  for (const choice of player.history) {
    const choiceAge = choice.year - birthYear;
    if (choiceAge < 3) continue; // 3 歲以下不顯示在年表中
    timeline.push({
      year: choice.year,
      era: choice.era,
      text: choice.choiceText.slice(0, 40),
      icon: choice.effects?.reputation
        ? '⭐'
        : choice.effects?.gold
        ? '💰'
        : choice.effects?.stats
        ? '📊'
        : '📝',
    });
  }

  // 按年份排序
  timeline.sort((a, b) => a.year - b.year);

  // 限制顯示數量（取最近的重要事件）
  const MAX_DISPLAY = 20;
  if (timeline.length > MAX_DISPLAY) {
    // 保留首尾和關鍵點
    const keys = new Set<number>();
    keys.add(0);
    keys.add(timeline.length - 1);
    for (let i = Math.floor(timeline.length / 2) - 1; i >= 0; i--) {
      keys.add(i);
    }
    return timeline.filter((_, i) => keys.has(i));
  }

  return timeline;
}

/** 給排行榜用的簡易時間軸 */
function buildTimelineForLeaderboard(player: Player): Array<{ year: number; event: string }> {
  const birthYear = player.birthYear || 184;
  const result: Array<{ year: number; event: string }> = [];
  for (const choice of player.history) {
    const age = choice.year - birthYear;
    result.push({ year: age, event: choice.choiceText.slice(0, 50) });
  }
  return result;
}

// ============================================
// 主組件
// ============================================
export default function EndingPage() {
  const router = useRouter();
  const { gameState, resetGame } = useGameStore();
  const [calculatedEnding, setCalculatedEnding] = useState<Ending | null>(null);
  const [dynamicStats, setDynamicStats] = useState<Record<string, number>>({});
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [timeline, setTimeline] = useState<
    Array<{ year: number; era: string; text: string; icon: string }>
  >([]);
  const [evaluation, setEvaluation] = useState('');
  const hasSubmittedRef = useRef(false);

  useEffect(() => {
    console.log('[END] useEffect triggered');
    let player: Player | null = null;

    try {
      let saved = localStorage.getItem('tk_player_ending');
      if (!saved) saved = sessionStorage.getItem('tk_player');
      console.log('[END] localStorage:', saved ? 'found' : 'empty');
      if (saved) {
        player = JSON.parse(saved);
        sessionStorage.removeItem('tk_player');
      }
    } catch (e) {
      console.error('[END] sessionStorage error:', e);
    }

    if (!player) {
      // 沒有玩家資料時顯示提示，而不是重定向到首頁
      setHasLoaded(true);
      setCurrentPlayer(null);
      setCalculatedEnding(null);
      setEvaluation('請從遊戲開始，結束後自動顯示評價');
      setTimeline([]);
      setDynamicStats({});
      return;
    }

    // === 夭折/短命優先判斷 ===
    let bestEnding: Ending | null = null;
    if (player.age <= 5) {
      bestEnding = ENDINGS.find((e) => e.id === 'ending_infant') || ENDINGS[0];
    } else if (player.age <= 15) {
      bestEnding = ENDINGS.find((e) => e.id === 'ending_short_life') || ENDINGS[0];
    } else {
      // === 正常結局選擇 ===
      let bestScore = 0;
      let bestEndingId = '';

      for (const ending of ENDINGS) {
        if (ending.id === 'ending_infant' || ending.id === 'ending_short_life') continue;
        let score = 0;
        let meets = true;

        if (ending.requirements.minReputation && player.resources.reputation < ending.requirements.minReputation!) meets = false;
        if (ending.requirements.minGold && player.resources.gold < ending.requirements.minGold!) meets = false;
        if (ending.requirements.minYearsPlayed && player.age < ending.requirements.minYearsPlayed!) meets = false;
        if (ending.requirements.maxYearsPlayed && player.age > ending.requirements.maxYearsPlayed!) meets = false;

        if (ending.requirements.minStats) {
          for (const [stat, value] of Object.entries(ending.requirements.minStats!)) {
            if (player.stats[stat as keyof typeof player.stats] < value!) meets = false;
          }
        }

        if (meets) {
          score = ending.evaluation.overall;
          if (player.resources.reputation >= (ending.requirements.minReputation || 0) * 1.5) score += 5;
          if (player.age >= (ending.requirements.minYearsPlayed || 0) * 1.2) score += 5;
        }

        if (meets && score > bestScore) {
          bestScore = score;
          bestEndingId = ending.id;
        }
      }

      bestEnding = ENDINGS.find((e) => e.id === bestEndingId) || ENDINGS[0];
    }

    setCalculatedEnding(bestEnding);

    // === 動態計算評價數值 ===
    const dynamicStats = calculateDynamicStats(player);

    setTimeline(buildTimeline(player));
    setEvaluation(generateHistoricalEvaluation(player, bestEnding));
    setDynamicStats(dynamicStats);
    setCurrentPlayer(player);

    // === 自動存入排行榜（含防重複提交 + 伺服器等效） ===
    // 使用 ref 防 StrictMode 雙重提交
    if (!hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      const keyChoices = (player.keyChoiceHistory || []).slice(0, 20);
      const timelineForLeaderboard = buildTimelineForLeaderboard(player);
      const entry: LeaderboardEntry = {
        id: `entry_${player.name}_${player.age}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        name: player.name,
        gender: player.gender,
        background: player.background,
        age: player.age,
        deathType: player.deathType || 'survived',
        deathReason: player.deathReason || '',
        endingTitle: bestEnding?.title || '未定',
        endingEvaluation: generateHistoricalEvaluation(player, bestEnding),
        reputation: player.resources.reputation,
        gold: player.resources.gold,
        achievements: player.achievements,
        totalChoices: player.history.length,
        butterflyEffects: player.butterflyHistory.length,
        keyChoices,
        timeline: timelineForLeaderboard,
        timestamp: Date.now(),
      };
      // 寫入本地排行榜
      addLeaderboardEntry(entry);
      // 同時寫入伺服器排行榜（異步，不阻塞頁面）
      addServerLeaderboard(entry).then((ok) => {
        if (ok) console.log('[ENDING] Server leaderboard updated');
        else console.warn('[ENDING] Server leaderboard write failed (offline?)');
      }).catch((err) => {
        console.warn('[ENDING] Server leaderboard write error:', err);
      });
    }
  }, [router]);

  // === 預渲染保護：放在所有 rendering* 變數之前 ===
  if (!currentPlayer && !hasLoaded) {
    return (
      <div className="min-h-screen ink-bg flex items-center justify-center">
        <div className="text-ink-400 font-song text-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-5xl mb-4"
          >
            📜
          </motion.div>
          計算結局中...
        </div>
      </div>
    );
  }

  if (!currentPlayer && hasLoaded) {
    return (
      <div className="min-h-screen ink-bg flex items-center justify-center">
        <div className="text-ink-400 font-song text-lg text-center">
          <div className="text-5xl mb-4">📜</div>
          <p>請從遊戲開始，結束後自動顯示評價</p>
        </div>
      </div>
    );
  }

  // === 使用 useEffect 設定的 state 變數 ===
  const renderingEnding = calculatedEnding;
  const renderingPlayer = currentPlayer;
  const renderingDynamicStats = dynamicStats;
  const renderingEvaluation = evaluation;
  const renderingTimeline = timeline;

  // 評價數值
  const stats = renderingDynamicStats && Object.keys(renderingDynamicStats).length > 0
    ? renderingDynamicStats
    : (renderingEnding?.evaluation || {});


  const statLabels: Record<string, string> = {
    overall: '總評',
    historicalImpact: '歷史影響力',
    personalAchievement: '個人成就',
    relationships: '人際關係',
    wealth: '財富',
    legacy: '流傳',
  };

  const routeNames: Record<string, string> = {
    historical: '順應天命',
    hero: '一代名臣',
    hermit: '隱世高人',
    usurper: '篡位者',
    tragic: '壯志未酬',
    hidden: '蝴蝶效應',
    legendary: '三國奇人',
  };

  // 蝴蝶效應總結
  const butterflySummary = renderingPlayer?.butterflySummary || {};
  const butterflyHistory = renderingPlayer?.butterflyHistory || [];

  // 獲取成就定義
  const earnedAchievements = renderingPlayer?.achievements
    .map((id) => getAchievementDef(id))
    .filter((a): a is NonNullable<typeof a> => a !== undefined) || [];

  const rarityColors: Record<string, string> = {
    common: 'text-ink-300 border-ink-600 bg-ink-900/40',
    uncommon: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/30',
    rare: 'text-blue-300 border-blue-500/40 bg-blue-950/30',
    legendary: 'text-gold border-gold/50 bg-amber-950/30',
  };

  // 死亡原因 — 優先使用 DEATH_MESSAGES 生成的具體死因，fallback 給合理推論
  const rp = renderingPlayer || {} as Player;
  const deathText = renderingPlayer?.deathReason || (
    rp.age >= 70
    ? '壽終正寢'
    : rp.stats.vit <= 0
    ? '體力耗盡，油盡燈枯。'
    : rp.deathType === 'combat'
    ? '戰死沙場，為國捐軀。'
    : rp.deathType === 'illness'
    ? '病重不治，藥石罔效。'
    : rp.deathType === 'assassination'
    ? '遭人暗算，遇刺身亡。'
    : rp.deathType === 'accident'
    ? '不幸意外，慘遭不測。'
    : '無疾而終，死因不明。'
  );

  return (
    <div className="min-h-screen ink-bg font-song">
      {/* 頂部裝飾線 */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-700 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 py-8 lg:py-12">
        {/* 結局標題 */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="text-7xl mb-4"
          >
            📜
          </motion.div>
          <h1 className="text-5xl font-bold text-gold mb-2 font-song">
            {renderingEnding?.title || '結局未定'}
          </h1>
          <div className="text-ink-400 text-lg mb-3">
            {(renderingEnding?.route ? routeNames[renderingEnding.route] : undefined) || renderingEnding?.route || '未知結局'}
          </div>
          <div className="ancient-line flex items-center gap-4 justify-center">
            <span className="text-ink-500 text-sm">
              {renderingPlayer?.name} · {renderingPlayer?.age}歲 · {renderingPlayer?.currentYear}年
            </span>
          </div>
        </motion.div>

        {/* 結局敘事 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="event-card mb-8 border-l-4 border-l-gold"
        >
          <h2 className="text-gold font-song text-xl mb-4 flex items-center gap-2">
            <span>📖</span> 結局敘事
          </h2>
          <p className="text-ink-200 leading-relaxed text-sm">{renderingEnding?.description}</p>
        </motion.div>

        {/* 生平年表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="event-card mb-8"
        >
          <h2 className="text-gold font-song text-xl mb-4 flex items-center gap-2">
            <span>🕐</span> 生平年表
          </h2>

          {renderingTimeline.length === 0 ? (
            <p className="text-ink-500 italic text-sm">尚無重大事件記錄</p>
          ) : (
            <div className="relative">
              {/* 中心時間線 */}
              <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-gold/40 via-gold/20 to-transparent" />

              <div className="space-y-3 overflow-y-auto max-h-80 pr-2 custom-scroll">
                {renderingTimeline.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-3 pl-8 relative"
                  >
                    {/* 時間線節點 */}
                    <div className="absolute left-1.5 top-2 w-3 h-3 rounded-full bg-gold/60 border border-gold/80" />

                    <span className="text-lg flex-shrink-0">{event.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gold font-song text-sm font-bold">
                          {event.year}年 ({event.era})
                        </span>
                      </div>
                      <div className="text-ink-200 text-sm">{event.text}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* 最終屬性統計 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="event-card"
          >
            <h2 className="text-gold font-song text-xl mb-4 flex items-center gap-2">
              <span>📊</span> 最終屬性
            </h2>
            <div className="space-y-3">
              {(Object.entries(renderingPlayer?.stats || {}) as [string, number][]).map(([stat, value]) => {
                const labels: Record<string, string> = { int: '智力', str: '武力', lck: '運氣', cha: '魅力', vit: '體力' };
                const icons: Record<string, string> = { int: '🧠', str: '⚔️', lck: '🎲', cha: '✨', vit: '❤️' };
                return (
                  <div key={stat}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-ink-300 text-xs">{icons[stat]} {labels[stat]}</span>
                      <span className="text-gold font-song text-sm">{value}</span>
                    </div>
                    <div className="stat-bar-container">
                      <div
                        className="stat-bar-fill bg-gradient-to-r from-gold-600 to-gold-400"
                        style={{ width: `${(value / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 資源統計 */}
            <div className="mt-4 pt-4 border-t border-ink-700/50 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-ink-400">金銀</span>
                <span className="text-gold font-song">{renderingPlayer?.resources.gold}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">聲望</span>
                <span className="text-gold font-song">{renderingPlayer?.resources.reputation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">情報</span>
                <span className="text-gold font-song">{renderingPlayer?.resources.intelligence}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">經驗值</span>
                <span className="text-gold font-song">{renderingPlayer?.totalExp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">技能數</span>
                <span className="text-gold font-song">{renderingPlayer?.skills.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">夥伴數</span>
                <span className="text-gold font-song">{renderingPlayer?.companions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">選擇次數</span>
                <span className="text-gold font-song">{renderingPlayer?.history.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">勝率</span>
                <span className="text-gold font-song">
                  {rp.totalChoices > 0
                    ? Math.round(((rp.totalVictories || 0) / rp.totalChoices) * 100)
                    : 0}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-400">死亡原因</span>
                <span className="text-ink-200">{deathText}</span>
              </div>
            </div>
          </motion.div>

          {/* 蝴蝶效應總結 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="event-card"
          >
            <h2 className="text-gold font-song text-xl mb-4 flex items-center gap-2">
              <span>🦋</span> 蝴蝶效應總結
            </h2>

            {butterflyHistory.length === 0 ? (
              <div className="text-ink-500 italic text-sm py-6 text-center">
                你的一生並未對歷史產生明顯影響...
                <br />
                <span className="text-xs">你的選擇或許改變了別人，卻未能改變天下大局。</span>
              </div>
            ) : (
              <>
                {/* 各類型統計 */}
                <div className="grid grid-cols-5 gap-2 mb-4 text-center text-xs">
                  {[
                    { type: 'military', icon: '⚔️', label: '軍事' },
                    { type: 'political', icon: '🏛️', label: '政治' },
                    { type: 'economic', icon: '💰', label: '經濟' },
                    { type: 'cultural', icon: '📜', label: '文化' },
                    { type: 'diplomatic', icon: '🤝', label: '外交' },
                  ].map(({ type, icon, label }) => {
                    const count = butterflyHistory.filter((e) => e.type === type).length;
                    const totalValue = butterflyHistory
                      .filter((e) => e.type === type)
                      .reduce((sum, e) => sum + e.value, 0);
                    return (
                      <div key={type} className="bg-ink-900/50 rounded-lg p-2 border border-ink-700/50">
                        <div className="text-lg">{icon}</div>
                        <div className="text-ink-400">{label}</div>
                        <div className="text-gold font-song">{count} 次</div>
                        {totalValue > 0 && (
                          <div className="text-ink-500 text-xs">影響值 {totalValue}</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* 總影響值 */}
                <div className="bg-ink-900/50 rounded-lg p-3 border border-gold/20 mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-ink-400 text-sm">歷史總影響值</span>
                    <span className="text-2xl font-bold text-gold font-song">
                      {butterflyHistory.reduce((s, e) => s + e.value, 0)}
                    </span>
                  </div>
                </div>

                {/* 重大效應列表 */}
                {butterflyHistory.some((e) => e.value >= 7) && (
                  <div className="mt-3">
                    <div className="text-amber-400 text-xs mb-2 font-song">⚡ 重大歷史影響：</div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto text-xs custom-scroll">
                      {butterflyHistory
                        .filter((e) => e.value >= 7)
                        .map((effect, i) => (
                          <div key={i} className="flex items-center gap-2 text-ink-300 bg-amber-950/20 rounded px-2 py-1">
                            <span className="text-amber-400">
                              {effect.value >= 10 ? '🌋' : '🦋🦋🦋'}
                            </span>
                            <span className="truncate">{effect.target}</span>
                            <span className="text-amber-400 flex-shrink-0">{effect.value}</span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* 你改變了什麼 */}
                <div className="mt-4 pt-3 border-t border-ink-700/50">
                  <div className="text-ink-400 text-xs">
                    你以 <span className="text-gold">{butterflyHistory.length}</span> 次選擇，
                    在這段歷史中留下了不可磨滅的印記。
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* 評價數值 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="event-card mb-8 border-t-4 border-t-gold"
        >
          <h2 className="text-gold font-song text-xl mb-6 flex items-center gap-2">
            <span>⚖️</span> 評價數值
          </h2>
          <div className="space-y-4">
            {(Object.entries(stats) as [string, number][]).map(([stat, value]) => {
              if (stat === 'overall') return null;
              return (
                <div key={stat}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-ink-300 text-sm">{statLabels[stat]}</span>
                    <span className="text-gold font-song">{value}/100</span>
                  </div>
                  <div className="stat-bar-container">
                    <div
                      className="stat-bar-fill bg-gradient-to-r from-gold-600 to-gold-400"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 總評 */}
          <div className="mt-6 p-6 rounded-xl bg-gradient-to-br from-ink-950/80 to-ink-900/60 border border-gold/30 text-center">
            <div className="text-ink-400 text-sm mb-1">總評</div>
            <div className="text-5xl font-bold text-gold font-song">
              {stats.overall}
              <span className="text-lg text-ink-400">/100</span>
            </div>
            <div className="mt-2 text-ink-300 text-sm italic max-w-md mx-auto leading-relaxed">
              {renderingEvaluation}
            </div>
          </div>
        </motion.div>

        {/* 歷史評價（AI 式總結） */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="event-card mb-8 bg-gradient-to-br from-amber-950/20 to-ink-900/40 border-l-4 border-l-amber-500"
        >
          <h2 className="text-gold font-song text-xl mb-4 flex items-center gap-2">
            <span>📜</span> 史書評價
          </h2>
          <p className="text-ink-200 leading-relaxed text-sm italic">
            「{renderingPlayer?.name || '未知人物'}，{renderingPlayer?.background === 'scholar' ? '士族' : renderingPlayer?.background === 'merchant' ? '商人' : renderingPlayer?.background === 'military' ? '將門' : renderingPlayer?.background === 'poor' ? '寒門' : '平民'}出身，
            {renderingPlayer?.age || 0}歲而終。其一生歷經{((renderingPlayer?.currentYear || 0) - (renderingPlayer?.birthYear || 0))}年，
            經{(renderingPlayer?.history || []).length}次選擇，
            留下{butterflyHistory.length}則蝴蝶效應。
            史載：「{renderingEvaluation}」
          </p>
        </motion.div>

        {/* 成就總覽 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="event-card mb-8"
        >
          <h2 className="text-gold font-song text-xl mb-4 flex items-center gap-2">
            <span>🏆</span> 成就總覽
          </h2>
          <div className="flex flex-wrap gap-2">
            {earnedAchievements.length === 0 ? (
              <p className="text-ink-500 text-sm italic">未獲得任何成就</p>
            ) : (
              earnedAchievements.map((achievement) => {
                const rarityStyle = rarityColors[achievement.rarity] || rarityColors.common;
                return (
                  <motion.div
                    key={achievement.id}
                    whileHover={{ scale: 1.05 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${rarityStyle} text-sm`}
                  >
                    <span className="text-lg">{achievement.icon}</span>
                    <div>
                      <div className="font-song text-sm">{achievement.name}</div>
                      <div className="text-ink-500 text-xs">{achievement.description}</div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* 人際關係 */}
        {renderingPlayer && Object.keys(renderingPlayer.relationships).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="event-card mb-8"
          >
            <h2 className="text-gold font-song text-xl mb-4 flex items-center gap-2">
              <span>🤝</span> 人際關係
            </h2>
            <div className="space-y-2">
              {Object.entries(renderingPlayer!.relationships)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([charId, value]) => {
                  const char = HISTORICAL_CHARACTERS.find((c) => c.id === charId);
                  return (
                    <div key={charId} className="flex justify-between items-center">
                      <span className="text-ink-300 text-sm">{char?.name || charId}</span>
                      <span className={`font-song ${value >= 0 ? 'text-jade-500' : 'text-vermilion-500'}`}>
                        {value >= 0 ? '+' : ''}{value}
                      </span>
                    </div>
                  );
                })}
            </div>
          </motion.div>
        )}

        {/* 結局總結 - 生平總結 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="event-card mb-8"
        >
          <h2 className="text-gold font-song text-xl mb-4 flex items-center gap-2">
            <span>📚</span> 生平總結
          </h2>
          <p className="text-ink-200 leading-relaxed italic text-sm">
            {renderingEnding?.biography}
          </p>
        </motion.div>

        {/* 按鈕 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => {
              resetGame();
              sessionStorage.removeItem('tk_player');
              router.push('/create');
            }}
            className="px-8 py-3 rounded-lg border border-gold text-gold hover:bg-gold/10 transition-all font-song text-base"
          >
            🔄 重新開始
          </button>
          <button
            onClick={() => router.push('/leaderboard')}
            className="px-8 py-3 rounded-lg border border-emerald-600 text-emerald-400 hover:bg-emerald-900/20 transition-all font-song text-base"
          >
            🏆 排行榜
          </button>
          <button
            onClick={() => {
              resetGame();
              router.push('/');
            }}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-gold-700 via-gold-600 to-gold-700 text-ink-950 hover:from-gold-600 hover:via-gold-500 hover:to-gold-600 transition-all font-song text-base"
          >
            🏠 返回首頁
          </button>
        </motion.div>
      </div>

      {/* 底部裝飾線 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-700 to-transparent opacity-30" />
    </div>
  );
}
