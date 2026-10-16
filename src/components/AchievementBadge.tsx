'use client';

// ============================================
// AchievementBadge — 成就徽章系統
// 當玩家獲得成就時彈出 toast 通知
// 在角色面板底部顯示已獲得成就
// ============================================

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================
// 成就定義
// ============================================
export interface AchievementDef {
  id: string;
  name: string;
  icon: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'legendary';
}

export const ALL_ACHIEVEMENTS: AchievementDef[] = [
  { id: '兵聖', name: '兵聖', icon: '⚔️', description: '獲得「兵聖」稱號', rarity: 'legendary' },
  { id: '史學家', name: '史學家', icon: '📚', description: '學識淵博，成為一代史學家', rarity: 'rare' },
  { id: '詩人', name: '詩人', icon: '🖊️', description: '才華橫溢，名留詩篇', rarity: 'rare' },
  { id: '巨賈', name: '巨賈', icon: '💎', description: '富甲一方，成為巨賈', rarity: 'rare' },
  { id: '仁政太守', name: '仁政太守', icon: '🏛️', description: '施行仁政，深受百姓愛戴', rarity: 'rare' },
  { id: '萬夫莫敵', name: '萬夫莫敵', icon: '🗡️', description: '武力超群，萬夫莫敵', rarity: 'legendary' },
  { id: '智多星', name: '智多星', icon: '🧠', description: '智謀過人，足智多謀', rarity: 'rare' },
  { id: '桃花緣', name: '桃花緣', icon: '🌸', description: '姻緣深厚，桃花滿天下', rarity: 'uncommon' },
  { id: '長生者', name: '長生者', icon: '🌳', description: '壽至七十以上', rarity: 'uncommon' },
  { id: '忠臣', name: '忠臣', icon: '🏰', description: '忠心耿耿，名垂青史', rarity: 'rare' },
  { id: '流浪者', name: '流浪者', icon: '🎒', description: '一生流浪，四海為家', rarity: 'common' },
  { id: '初出茅廬', name: '初出茅廬', icon: '🌱', description: '開始你的三國之旅', rarity: 'common' },
  { id: '首戰告捷', name: '首戰告捷', icon: '🎯', description: '第一次選擇獲得成功', rarity: 'common' },
  { id: '十選十勝', name: '十選十勝', icon: '🏆', description: '連續十次選擇成功', rarity: 'uncommon' },
  { id: '結交名士', name: '結交名士', icon: '🤝', description: '結交五位歷史名士', rarity: 'uncommon' },
  { id: '富可敵國', name: '富可敵國', icon: '👑', description: '擁有千兩黃金', rarity: 'uncommon' },
  { id: '名垂千古', name: '名垂千古', icon: '⭐', description: '聲望達到極高水準', rarity: 'legendary' },
  { id: '名留青史', name: '名留青史', icon: '📖', description: '死後被史書記載', rarity: 'legendary' },
];

export function getAchievementDef(id: string): AchievementDef | undefined {
  return ALL_ACHIEVEMENTS.find((a) => a.id === id || a.name === id);
}

const RARITY_STYLES: Record<string, { border: string; bg: string; glow: string }> = {
  common: { border: 'border-ink-600', bg: 'bg-ink-900', glow: '' },
  uncommon: { border: 'border-emerald-500/40', bg: 'bg-emerald-950/30', glow: 'shadow-emerald-500/20' },
  rare: { border: 'border-blue-500/40', bg: 'bg-blue-950/30', glow: 'shadow-blue-500/20' },
  legendary: { border: 'border-gold-500/60', bg: 'bg-amber-950/30', glow: 'shadow-gold-500/30' },
};

const RARITY_LABELS: Record<string, string> = {
  common: '普通',
  uncommon: '稀有',
  rare: '珍貴',
  legendary: '傳說',
};

// ============================================
// Toast 通知
// ============================================
interface AchievementToastProps {
  achievement: AchievementDef;
  onClose: () => void;
}

function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const rarityStyle = RARITY_STYLES[achievement.rarity] || RARITY_STYLES.common;

  return (
    <motion.div
      initial={{ opacity: 0, x: 100, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.8 }}
      className={`flex items-center gap-3 p-4 rounded-xl border ${rarityStyle.border} ${rarityStyle.bg} shadow-lg backdrop-blur-sm max-w-xs`}
    >
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="text-3xl flex-shrink-0"
      >
        {achievement.icon}
      </motion.div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gold mb-0.5">🏆 成就解鎖</div>
        <div className="text-ink-100 font-song font-bold text-sm">{achievement.name}</div>
        <div className="text-ink-400 text-xs">{achievement.description}</div>
      </div>
      <button
        onClick={onClose}
        className="text-ink-500 hover:text-ink-300 transition-colors flex-shrink-0"
      >
        ✕
      </button>
    </motion.div>
  );
}

// ============================================
// Toast 容器
// ============================================
interface ToastContainerProps {
  toasts: Array<{ id: number; achievement: AchievementDef }>;
}

function ToastContainer({ toasts }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-3">
      <AnimatePresence>
        {toasts.map((toast) => (
          <AchievementToast
            key={toast.id}
            achievement={toast.achievement}
            onClose={() => {
              toast.id; // trigger re-render for close logic
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// 成就徽章 (單個)
// ============================================
export function AchievementBadgeItem({ achievement, size = 'md' }: { achievement: AchievementDef; size?: 'sm' | 'md' | 'lg' }) {
  const rarityStyle = RARITY_STYLES[achievement.rarity] || RARITY_STYLES.common;
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-base',
    lg: 'w-14 h-14 text-2xl',
  };

  return (
    <motion.div
      whileHover={{ scale: 1.1, y: -2 }}
      className={`relative flex items-center justify-center rounded-xl border ${rarityStyle.border} ${rarityStyle.bg} ${sizeMap[size]} shadow-md cursor-pointer group`}
    >
      <span className="relative z-10">{achievement.icon}</span>

      {/* 懸停提示 */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block z-50">
        <div className={`px-3 py-2 rounded-lg border ${rarityStyle.border} ${rarityStyle.bg} text-xs whitespace-nowrap shadow-xl`}>
          <div className="font-song text-gold font-bold">{achievement.name}</div>
          <div className="text-ink-400">{achievement.description}</div>
          <div className="text-ink-500 text-xs mt-0.5">
            [{RARITY_LABELS[achievement.rarity]}]
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// 已獲得成就面板
// ============================================
export function AchievementsPanel({
  achievements,
  onEarn,
}: {
  achievements: string[];
  onEarn?: (achievement: AchievementDef) => void;
}) {
  const earned = achievements
    .map((id) => getAchievementDef(id))
    .filter((a): a is AchievementDef => a !== undefined);

  const totalAchievements = ALL_ACHIEVEMENTS.length;
  const percent = totalAchievements > 0 ? Math.round((earned.length / totalAchievements) * 100) : 0;

  // 按稀有度分組排序
  const rarityOrder: Record<string, number> = { legendary: 0, rare: 1, uncommon: 2, common: 3 };
  const sorted = [...earned].sort((a, b) => (rarityOrder[a.rarity] ?? 99) - (rarityOrder[b.rarity] ?? 99));

  return (
    <motion.div
      className="event-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 標題 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏆</span>
          <span className="text-gold font-song text-sm">成就徽章</span>
          <span className="text-xs text-ink-500">
            {earned.length}/{totalAchievements}
          </span>
        </div>
        <span className="text-xs text-ink-500">
          {percent}%
        </span>
      </div>

      {/* 進度條 */}
      <div className="stat-bar-container mb-4">
        <div
          className="stat-bar-fill bg-gradient-to-r from-gold-600 to-gold-400 transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      {earned.length === 0 ? (
        <div className="text-ink-500 text-xs italic py-3 text-center">
          尚未獲得任何成就
          <br />
          <span className="text-xs text-ink-600">繼續探索，解鎖更多成就！</span>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {sorted.map((achievement) => (
            <AchievementBadgeItem key={achievement.id} achievement={achievement} size="md" />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ============================================
// 成就管理 Hook（返回 context component）
// ============================================
interface AchievementContextType {
  earned: string[];
  toastQueue: Array<{ id: number; achievement: AchievementDef }>;
  notify: (achievementId: string) => void;
}

const AchievementContext = new Proxy({} as React.Context<AchievementContextType | null>, {
  get: () => null,
});

export function AchievementManager({ children }: { children: React.ReactNode }) {
  const [earned, setEarned] = useState<string[]>([]);
  const [toastQueue, setToastQueue] = useState<Array<{ id: number; achievement: AchievementDef }>>([]);

  const nextId = useCallback((() => {
    let id = 0;
    return () => ++id;
  })(), []);

  const notify = useCallback(
    (achievementId: string) => {
      const def = getAchievementDef(achievementId);
      if (!def || earned.includes(achievementId)) return;

      setEarned((prev) => {
        if (prev.includes(achievementId)) return prev;
        return [...prev, achievementId];
      });

      // 添加 toast
      setToastQueue((prev) => [...prev, { id: nextId(), achievement: def }]);

      // 3 秒後自動移除 toast
      setTimeout(() => {
        setToastQueue((prev) => prev.filter((t) => t.id !== nextId() - 1));
      }, 4000);
    },
    [earned, nextId]
  );

  return (
    <div className="relative">
      {children}
      <div className="fixed top-4 right-4 z-[100] space-y-3">
        <AnimatePresence>
          {toastQueue.map((toast) => (
            <AchievementToast
              key={toast.id}
              achievement={toast.achievement}
              onClose={() => setToastQueue((prev) => prev.filter((t) => t.id !== toast.id))}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
