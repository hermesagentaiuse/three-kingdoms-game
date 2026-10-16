'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/store/gameStore';
import { rollDice } from '@/lib/engine/eventEngine';
import { ERAS } from '@/types/game';
import { SKILLS } from '@/lib/data/characters';
import type { Player } from '@/types/game';
import ButterflyPanel from '@/components/ButterflyPanel';
import { AchievementsPanel, getAchievementDef, ALL_ACHIEVEMENTS } from '@/components/AchievementBadge';
import LifeStageProgressBar, { getCurrentStage, getStageProgress } from '@/components/LifeStageProgressBar';

export default function GamePage() {
  const router = useRouter();
  const {
    gameState,
    currentEvent,
    history,
    isGameOver,
    turnCount,
    flags,
    makeChoice,
    nextTurn,
    resultMessage,
    resultType,
    showResult,
    changeLog,
    confirmResult,
    saveGame,
    loadSave,
    deleteSave,
    resetGame,
    togglePause,
  } = useGameStore();

  const [showStats, setShowStats] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [diceResult, setDiceResult] = useState<{ result: ReturnType<typeof rollDice>; stat: string } | null>(null);
  const [isDiceRolling, setIsDiceRolling] = useState(false);
  const [diceRollValue, setDiceRollValue] = useState(1);
  const [diceModifier, setDiceModifier] = useState(0);
  const [showFinalDice, setShowFinalDice] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  const [displayedText, setDisplayedText] = useState('');
  const [mounted, setMounted] = useState(false);
  const diceIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 防止 hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // 遊戲初始化：從 localStorage + sessionStorage 讀取玩家資料並初始化 store
  useEffect(() => {
    if (!mounted) return;
    try {
      let saved = localStorage.getItem('tk_save_0');
      if (!saved) saved = sessionStorage.getItem('tk_player');
      if (saved) {
        // 嘗試從 localStorage 讀取完整 gameState，或從 sessionStorage 讀取 Player
        let player: Player | null = null;
        try {
          const parsed = JSON.parse(saved);
          if (parsed.gameState?.player) {
            // localStorage 格式：完整 gameState
            useGameStore.getState().initFromSave(parsed);
          } else {
            // sessionStorage 格式：只有 Player
            player = parsed as Player;
            useGameStore.getState().startNewGame(player);
          }
        } catch {
          player = JSON.parse(saved) as Player;
          useGameStore.getState().startNewGame(player);
        }
        if (sessionStorage.getItem('tk_player')) {
          sessionStorage.removeItem('tk_player');
        }
      } else {
        console.log('No player data found, redirecting');
        router.push('/create');
      }
    } catch (e) {
      console.error('Failed to load player data:', e);
      router.push('/create');
    }
  }, [mounted, router]);

  // 遊戲結束時自動跳轉到結局頁
  useEffect(() => {
    if (isGameOver && mounted && gameState?.player) {
      // 將完整玩家資料寫入 localStorage + sessionStorage，供結局面讀取
      localStorage.setItem('tk_player_ending', JSON.stringify(gameState.player));
      sessionStorage.setItem('tk_player', JSON.stringify(gameState.player));
      console.log('[GAME] Player saved for ending:', gameState.player.name, 'age:', gameState.player.age);
      const timer = setTimeout(() => {
        router.push('/ending');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isGameOver, mounted, router, gameState]);

  // 打字機效果
  useEffect(() => {
    if (!currentEvent || !mounted) { setIsTyping(false); return; }

    setIsTyping(true);
    setDisplayedText('');
    const text = currentEvent.description || '';
    let i = 0;

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayedText(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 8);

    return () => clearInterval(interval);
  }, [currentEvent?.id, mounted]);

  // 自動儲存
  useEffect(() => {
    if (gameState && !isGameOver && mounted) {
      const timer = setTimeout(() => saveGame(), 30000);
      return () => clearTimeout(timer);
    }
  }, [gameState, isGameOver, saveGame, mounted]);

  // 骰子動畫 — 數字快速跳動
  const startDiceAnimation = useCallback(() => {
    setIsDiceRolling(true);
    let tick = 0;
    diceIntervalRef.current = setInterval(() => {
      setDiceRollValue(Math.floor(Math.random() * 20) + 1);
      tick++;
      if (tick >= 12) { // ~0.6秒後停止
        if (diceIntervalRef.current) clearInterval(diceIntervalRef.current);
        diceIntervalRef.current = null;
      }
    }, 50);
  }, []);

  // 清理骰子動畫
  useEffect(() => {
    return () => {
      if (diceIntervalRef.current) clearInterval(diceIntervalRef.current);
    };
  }, []);

  if (!gameState) {
    return (
      <div className="min-h-screen ink-bg flex items-center justify-center">
        <div className="text-ink-400 font-song text-lg">載入中...</div>
      </div>
    );
  }

  const player = gameState.player;
  const era = ERAS.find((e) => player.currentYear >= e.startYear && player.currentYear <= e.endYear);

  const statNames: Record<string, string> = {
    int: '智力',
    str: '武力',
    lck: '運氣',
    cha: '魅力',
    vit: '體力',
  };

  const statIcons: Record<string, string> = {
    int: '🧠',
    str: '⚔️',
    lck: '🎲',
    cha: '✨',
    vit: '❤️',
  };

  const statColors: Record<string, string> = {
    int: 'from-blue-500 to-blue-400',
    str: 'from-red-500 to-red-400',
    lck: 'from-yellow-500 to-yellow-400',
    cha: 'from-emerald-500 to-emerald-400',
    vit: 'from-amber-600 to-amber-500',
  };

  const handleChoice = (index: number) => {
    if (isTyping) return;

    const choice = currentEvent?.choices[index];
    if (!choice) return;

    // 檢查需求屬性
    if (choice.requirements) {
      const { minInt, minStr, minLck, minCha } = choice.requirements;
      if (minInt && player.stats.int < minInt) {
        startDiceAnimation();
        setDiceModifier(0);
        setShowFinalDice(false);
        const result = rollDice('d20');
        setDiceResult({ result, stat: 'int' });
        setTimeout(() => {
          setShowFinalDice(true);
          makeChoice(index);
          setDiceResult(null);
          setIsDiceRolling(false);
        }, 1000);
        return;
      }
      if (minStr && player.stats.str < minStr) {
        startDiceAnimation();
        setDiceModifier(0);
        setShowFinalDice(false);
        const result = rollDice('d20');
        setDiceResult({ result, stat: 'str' });
        setTimeout(() => {
          setShowFinalDice(true);
          makeChoice(index);
          setDiceResult(null);
          setIsDiceRolling(false);
        }, 1000);
        return;
      }
    }

    // 新檢定系統：statCheck + difficulty
    if (choice.statCheck && choice.difficulty !== undefined) {
      startDiceAnimation();
      const statValue = player.stats[choice.statCheck] || 0;
      setDiceModifier(statValue);
      setShowFinalDice(false);
      const result = rollDice('d20', 1, statValue);
      const isSuccess = result.total >= choice.difficulty;
      setDiceResult({ result, stat: choice.statCheck });

      setTimeout(() => {
        setShowFinalDice(true);
        setDiceResult(null);
        setIsDiceRolling(false);
        // 讓 makeChoice 在 store 內部處理所有邏輯
        // 這裡直接呼叫，store 會顯示結果畫面
        makeChoice(index);
      }, 1500);
      return;
    }

    // 一般選擇（無檢定）
    makeChoice(index);
  };

  return (
    <div className="min-h-screen ink-bg font-song">
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-700 to-transparent" />

      {/* 頂部狀態欄 */}
      <div className="sticky top-0 z-50 bg-ink-950/90 backdrop-blur-sm border-b border-ink-700">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="text-gold font-song text-sm">
              {player.name} · {era?.name || '未知時代'}
            </span>
            <span className="text-ink-500 text-sm">
              {player.currentYear}年 · {player.age}歲
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-3 py-1 rounded border border-ink-600 text-ink-400 hover:border-gold hover:text-gold text-sm transition-colors"
            >
              角色狀態
            </button>
            <button
              onClick={() => saveGame(0)}
              className="px-3 py-1 rounded border border-ink-600 text-ink-400 hover:border-gold hover:text-gold text-sm transition-colors"
            >
              儲存
            </button>
            <button
              onClick={() => router.push('/leaderboard')}
              className="px-3 py-1 rounded border border-ink-600 text-ink-400 hover:border-emerald hover:text-emerald text-sm transition-colors"
            >
              🏆 排行榜
            </button>
            <button
              onClick={() => {
                resetGame();
                sessionStorage.removeItem('tk_player');
                router.push('/');
              }}
              className="px-3 py-1 rounded border border-ink-600 text-ink-400 hover:border-vermilion hover:text-vermilion text-sm transition-colors"
            >
              結束遊戲
            </button>
          </div>
        </div>
      </div>

      {/* 生命階段進度條 */}
      <LifeStageProgressBar age={player.age} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* 左側：角色狀態面板 */}
          <div className="lg:col-span-1 space-y-4">
            {/* 角色資訊 */}
            <div className="event-card">
              <h3 className="text-gold font-song text-lg mb-3">{player.name}</h3>
              <div className="text-ink-400 text-sm mb-3">
                {player.gender === 'male' ? '男' : '女'} · {player.background === 'scholar' ? '士族' : player.background === 'commoner' ? '平民' : player.background === 'merchant' ? '商人' : player.background === 'military' ? '將門' : '寒門'}
              </div>

              {/* 屬性條 */}
              <div className="space-y-3">
                {(Object.keys(player.stats) as (keyof typeof player.stats)[]).map((stat) => (
                  <div key={stat}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-ink-300 text-xs">
                        {statIcons[stat]} {statNames[stat]}
                      </span>
                      <span className="text-ink-100 text-xs font-song">{player.stats[stat]}</span>
                    </div>
                    <div className="stat-bar-container">
                      <div
                        className={`stat-bar-fill bg-gradient-to-r ${statColors[stat]}`}
                        style={{ width: `${(player.stats[stat] / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 資源 */}
            <div className="event-card">
              <h3 className="text-gold font-song text-sm mb-2">資源</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-400">金銀</span>
                  <span className="text-gold font-song">{player.resources.gold}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">聲望</span>
                  <span className="text-gold font-song">{player.resources.reputation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">情報</span>
                  <span className="text-gold font-song">{player.resources.intelligence}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-400">經驗</span>
                  <span className="text-gold font-song">{player.totalExp}</span>
                </div>
              </div>
            </div>

            {/* 技能 */}
            {player.skills.length > 0 && (
              <div className="event-card">
                <h3 className="text-gold font-song text-sm mb-2">技能</h3>
                <div className="flex flex-wrap gap-1">
                  {player.skills.map((skill) => (
                    <span key={skill} className="px-2 py-1 rounded bg-gold/10 text-gold text-xs border border-gold/30">
                      {SKILLS.find((s) => s.id === skill)?.name || skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 夥伴 */}
            {player.companions.length > 0 && (
              <div className="event-card">
                <h3 className="text-gold font-song text-sm mb-2">夥伴</h3>
                <div className="space-y-1">
                  {player.companions.map((comp) => (
                    <div key={comp.id} className="text-sm text-ink-300">
                      {comp.name} · 忠誠度 {comp.loyalty}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 蝴蝶效應面板 */}
            <ButterflyPanel
              butterflyEffects={player.butterflyHistory || []}
              maxDisplay={5}
            />

            {/* 成就徽章 */}
            <AchievementsPanel achievements={player.achievements || []} />
          </div>

          {/* 右側：事件主畫面 */}
          <div className="lg:col-span-2">
            {/* 結果畫面：顯示選擇結果（在最外層，不受 currentEvent 影響） */}
            {showResult && resultMessage && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`event-card p-6 border-2 ${
                  resultType === 'success' || resultType === 'partial'
                    ? 'bg-green-950/30 border-green-600/50'
                    : 'bg-red-950/30 border-red-600/50'
                }`}
              >
                <div className={`text-xl font-song mb-3 ${
                  resultType === 'success' || resultType === 'partial' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {resultType === 'success' || resultType === 'partial' ? '✅ 成功！' : '❌ 失敗！'}
                </div>
                <div className="text-ink-100 leading-relaxed whitespace-pre-line mb-3">
                  {resultMessage}
                </div>
                {changeLog && changeLog.length > 0 && (
                  <div className="bg-ink-950/50 rounded-lg p-3 mb-4 border border-ink-700/30">
                    <div className="text-gold text-sm font-song mb-1">📊 獲得與變化</div>
                    <div className="text-ink-200 text-sm space-y-1">
                      {changeLog.map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-gold text-xs">▸</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <button
                  onClick={confirmResult}
                  className="w-full py-3 rounded-lg border border-gold/50 text-gold hover:bg-gold/10 transition-all font-song text-lg"
                >
                  ✅ 確認結果，進入下一年 ({player.age + 1}歲)
                </button>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {currentEvent && !showResult ? (
                <motion.div
                  key={currentEvent.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* 事件標題 */}
                  <div className="event-card mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 rounded bg-gold/20 text-gold text-xs border border-gold/30">
                        {currentEvent.type === 'historical' ? '歷史事件' :
                         currentEvent.type === 'combat' ? '戰鬥' :
                         currentEvent.type === 'scholarly' ? '學問' :
                         currentEvent.type === 'diplomatic' ? '外交' :
                         currentEvent.type === 'hidden' ? '隱藏事件' : '隨機事件'}
                      </span>
                      <span className="text-ink-500 text-xs">
                        {currentEvent.year}年
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gold font-song mb-3">
                      {currentEvent.title}
                    </h2>
                    <p className={`text-ink-200 leading-relaxed ${isTyping ? 'typewriter' : ''}`}>
                      {displayedText}
                      {isTyping && <span className="animate-pulse">▌</span>}
                    </p>
                  </div>

                  {/* 結果畫面：顯示選擇結果 */}
                  {showResult && resultMessage && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`mt-4 p-6 rounded-lg border-2 text-center ${
                        resultType === 'success' || resultType === 'partial'
                          ? 'bg-green-950/30 border-green-600/50'
                          : 'bg-red-950/30 border-red-600/50'
                      }`}
                    >
                      <div className={`text-xl font-song mb-3 ${
                        resultType === 'success' || resultType === 'partial' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {resultType === 'success' || resultType === 'partial' ? '✅ 成功！' : '❌ 失敗！'}
                      </div>
                      <div className="text-ink-100 leading-relaxed whitespace-pre-line mb-3">
                        {resultMessage}
                      </div>
                      {changeLog && changeLog.length > 0 && (
                        <div className="bg-ink-950/50 rounded-lg p-3 mb-4 border border-ink-700/30 text-left">
                          <div className="text-gold text-sm font-song mb-1">📊 獲得與變化</div>
                          <div className="text-ink-200 text-sm space-y-1">
                            {changeLog.map((item, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className="text-gold text-xs">▸</span>
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <button
                        onClick={confirmResult}
                        className="mt-5 w-full py-3 rounded-lg border border-gold/50 text-gold hover:bg-gold/10 transition-all font-song text-lg"
                      >
                        ✅ 確認結果，進入下一年 ({player.age + 1}歲)
                      </button>
                    </motion.div>
                  )}

                  {/* 選擇按鈕 */}
                  {!isTyping && currentEvent && !showResult && currentEvent.choices.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-ink-400 text-sm mb-2">你的選擇：</h3>
                      {currentEvent.choices.map((choice, index) => {
                        const isLocked = choice.requirements && (
                          (choice.requirements.minInt && player.stats.int < choice.requirements.minInt!) ||
                          (choice.requirements.minStr && player.stats.str < choice.requirements.minStr!) ||
                          (choice.requirements.minLck && player.stats.lck < choice.requirements.minLck!) ||
                          (choice.requirements.minCha && player.stats.cha < choice.requirements.minCha!)
                        ) as boolean;

                        return (
                          <button
                            key={index}
                            onClick={() => handleChoice(index)}
                            disabled={isLocked}
                            className={`choice-btn w-full ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-gold font-song flex-shrink-0">
                                [{String.fromCharCode(65 + index)}]
                              </span>
                              <div>
                                <div className="text-ink-100 font-song">
                                  {choice.text}
                                  {isLocked && ' 🔒'}
                                </div>
                                {choice.description && (
                                  <div className="text-ink-500 text-sm mt-1">
                                    {choice.description}
                                  </div>
                                )}
                                {isLocked && choice.requirements && (
                                  <div className="text-vermilion-500 text-xs mt-1">
                                    需要：
                                    {choice.requirements.minInt && `智力${choice.requirements.minInt} `}
                                    {choice.requirements.minStr && `武力${choice.requirements.minStr} `}
                                    {choice.requirements.minLck && `運氣${choice.requirements.minLck} `}
                                    {choice.requirements.minCha && `魅力${choice.requirements.minCha}`}
                                  </div>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* 下一年按鈕：只在尚未有事件時顯示（跳過此年） */}
                  {!currentEvent && !isTyping && !showResult && !isGameOver && (
                    <button
                      onClick={nextTurn}
                      className="mt-6 w-full py-3 rounded-lg border border-gold/50 text-gold hover:bg-gold/10 transition-all font-song text-lg"
                    >
                      ⏳ 跳過此年 → 進入下一年 ({player.age + 1}歲)
                    </button>
                  )}

                  {/* 骰子結果顯示 — 3D 滾動動畫 */}
                  {diceResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, rotateX: 90 }}
                      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className={`mt-4 p-5 rounded-xl border text-center ${
                        diceResult.result.isCrit
                          ? 'border-gold/60 bg-gradient-to-br from-amber-950/50 to-gold-900/30 shadow-lg shadow-gold/20'
                          : diceResult.result.isFumble
                          ? 'border-vermilion/60 bg-gradient-to-br from-red-950/50 to-vermilion-900/30 shadow-lg shadow-red/20'
                          : 'bg-ink-950/50 border border-gold/30'
                      }`}
                    >
                      {/* 檢定類型 */}
                      <div className="text-gold font-song mb-2 text-sm">
                        正在進行 {statNames[diceResult.stat]} 檢定...
                      </div>

                      {/* 3D 滾動骰子 */}
                      <div className="flex items-center justify-center gap-4 my-3">
                        {/* 骰子 3D */}
                        <motion.div
                          animate={showFinalDice
                            ? { rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1 }
                            : {
                                rotateX: [0, 180, 360],
                                rotateY: [0, -180, -360],
                                rotateZ: [0, 90, 180, 270, 360],
                                scale: [0.9, 1.2, 0.95, 1.1, 1],
                              }
                          }
                          transition={
                            !showFinalDice
                              ? {
                                  duration: 0.6,
                                  times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                                  ease: 'easeInOut',
                                }
                              : { type: 'spring', stiffness: 300, damping: 20 }
                          }
                          className={`relative w-20 h-20 rounded-xl flex items-center justify-center text-4xl font-song font-bold border-2 ${
                            diceResult?.result.isCrit
                              ? 'border-gold bg-gradient-to-br from-amber-700 to-amber-900 text-gold-light shadow-lg shadow-gold/30'
                              : diceResult?.result.isFumble
                              ? 'border-red-500 bg-gradient-to-br from-red-800 to-red-950 text-red-200 shadow-lg shadow-red/30'
                              : 'border-ink-600 bg-gradient-to-br from-ink-700 to-ink-800 text-ink-100'
                          }`}
                          style={{ perspective: '400px' }}
                        >
                          <span className="relative z-10">
                            {!showFinalDice
                              ? diceRollValue
                              : diceResult?.result.total}
                          </span>

                          {/* 大成功金色光芒 */}
                          {diceResult.result.isCrit && (
                            <>
                              <motion.div
                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute inset-0 rounded-xl bg-gold/20 blur-md"
                              />
                              {[0, 1, 2, 3].map((i) => (
                                <motion.span
                                  key={i}
                                  className="absolute text-gold text-xs"
                                  initial={{ opacity: 0 }}
                                  animate={{
                                    opacity: [0, 1, 0],
                                    x: [0, (i % 2 === 0 ? 1 : -1) * 30],
                                    y: [(i < 2 ? -1 : 1) * 20],
                                  }}
                                  transition={{
                                    repeat: Infinity,
                                    duration: 1.2,
                                    delay: i * 0.2,
                                  }}
                                  style={{
                                    top: i < 2 ? '10%' : 'auto',
                                    bottom: i >= 2 ? '10%' : 'auto',
                                    left: i % 2 === 0 ? '5%' : 'auto',
                                    right: i % 2 !== 0 ? '5%' : 'auto',
                                  }}
                                >
                                  ✦
                                </motion.span>
                              ))}
                            </>
                          )}

                          {/* 大失敗紅色震動 */}
                          {diceResult.result.isFumble && (
                            <motion.div
                              animate={{ x: [-3, 3, -3, 3, 0] }}
                              transition={{ repeat: Infinity, duration: 0.4 }}
                              className="absolute inset-0 rounded-xl bg-red-500/20 blur-sm"
                            />
                          )}
                        </motion.div>

                        {/* 檢定細節 */}
                        <div className="text-left text-sm space-y-1">
                          <div className="text-ink-400">
                            {statNames[diceResult.stat]} 檢定
                          </div>
                          <div className="text-ink-500 text-xs">
                            d20 + 屬性加值
                          </div>
                          <div className="text-ink-300 text-xs">
                            總計: {diceResult.result.total}
                            {diceResult.result.isCrit && (
                              <span className="text-gold ml-1 font-bold">
                                (大成功！)
                              </span>
                            )}
                            {diceResult.result.isFumble && (
                              <span className="text-red-400 ml-1 font-bold">
                                (大失敗！)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="event-card text-center py-12"
                >
                  <div className="text-4xl mb-4">🎲</div>
                  <div className="text-ink-400 font-song">
                    正在生成下一個事件...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 遊戲結束遮罩 */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/90 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center px-8 py-12 max-w-lg"
          >
            <div className="text-6xl mb-6">💀</div>
            <h2 className="text-3xl font-bold text-gold font-song mb-4">
              {player.name} 的一生結束了
            </h2>
            <p className="text-ink-300 mb-2 font-song">
              {player.age}歲 · {player.currentYear}年
            </p>
            <p className="text-ink-400 text-sm mb-6">
              {player.deathReason || (player.age >= 70 ? '壽終正寢' : player.stats.vit <= 0 ? '體力耗盡' : '意外身亡')}
            </p>
            <div className="text-ink-500 text-sm mb-8">
              即將前往結局評價...
            </div>
            <div className="text-2xl animate-pulse">📜</div>
          </motion.div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-700 to-transparent opacity-30" />
    </div>
  );
}
