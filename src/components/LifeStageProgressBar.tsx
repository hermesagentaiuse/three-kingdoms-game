'use client';

// ============================================
// LifeStageProgressBar — 生命階段進度條
// 顯示當前生命階段的進度和資訊
// ============================================

import { motion } from 'framer-motion';

// ============================================
// 人生階段定義
// ============================================
export interface LifeStageInfo {
  id: string;
  label: string;
  minAge: number;
  maxAge: number;
  color: string;
  gradient: string;
  emoji: string;
}

export const LIFE_STAGES: LifeStageInfo[] = [
  { id: 'infant', label: '嬰兒期', minAge: 0, maxAge: 3, color: 'text-pink-400', gradient: 'from-pink-600 to-pink-400', emoji: '👶' },
  { id: 'child', label: '童年', minAge: 4, maxAge: 7, color: 'text-yellow-400', gradient: 'from-yellow-600 to-yellow-400', emoji: '🧒' },
  { id: 'preteen', label: '少年', minAge: 8, maxAge: 12, color: 'text-green-400', gradient: 'from-green-600 to-green-400', emoji: '👦' },
  { id: 'teen', label: '青少年', minAge: 13, maxAge: 18, color: 'text-blue-400', gradient: 'from-blue-600 to-blue-400', emoji: '🧑' },
  { id: 'young_adult', label: '青年', minAge: 19, maxAge: 25, color: 'text-emerald-400', gradient: 'from-emerald-600 to-emerald-400', emoji: '🙋' },
  { id: 'early_adult', label: '壯年', minAge: 26, maxAge: 35, color: 'text-cyan-400', gradient: 'from-cyan-600 to-cyan-400', emoji: '💪' },
  { id: 'middle', label: '中年', minAge: 36, maxAge: 50, color: 'text-gold-500', gradient: 'from-amber-600 to-amber-400', emoji: '👨' },
  { id: 'elder', label: '老年', minAge: 51, maxAge: 99, color: 'text-rose-400', gradient: 'from-rose-600 to-rose-400', emoji: '🧓' },
];

export function getCurrentStage(age: number): LifeStageInfo {
  for (const stage of LIFE_STAGES) {
    if (age >= stage.minAge && age <= stage.maxAge) return stage;
  }
  return LIFE_STAGES[LIFE_STAGES.length - 1];
}

export function getStageProgress(age: number): number {
  const stage = getCurrentStage(age);
  if (stage.maxAge === stage.minAge) return 100;
  return Math.min(100, Math.round(((age - stage.minAge) / (stage.maxAge - stage.minAge)) * 100));
}

// ============================================
// 生命階段進度條
// ============================================
export default function LifeStageProgressBar({ age }: { age: number }) {
  const currentStage = getCurrentStage(age);
  const progress = getStageProgress(age);
  const remainingYears = currentStage.maxAge - age;

  return (
    <motion.div
      className="px-4 py-2 bg-ink-950/60 border-b border-ink-800/50"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto">
        {/* 整體結構: ├──────▓▓▓▓▓▓──────┤ stage (min-max) */}
        <div className="flex items-center gap-2 text-xs">
          {/* 左標記 */}
          <span className="text-ink-600 flex-shrink-0">├</span>

          {/* 進度條 */}
          <div className="flex-1 h-3 bg-ink-800/80 rounded-full overflow-hidden relative">
            {/* 背景漸層 */}
            <div className={`absolute inset-0 bg-gradient-to-r ${currentStage.gradient} opacity-20 rounded-full`} />

            {/* 進度填充 */}
            <motion.div
              className={`absolute inset-y-0 left-0 bg-gradient-to-r ${currentStage.gradient} rounded-full`}
              style={{ width: `${progress}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />

            {/* 紋理覆蓋 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-px">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-full rounded-full transition-colors ${
                      i * 5 < progress
                        ? `bg-gradient-to-t ${currentStage.gradient} opacity-70`
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* 右標記 */}
          <span className="text-ink-600 flex-shrink-0">┤</span>
        </div>

        {/* 標籤行 */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentStage.emoji}</span>
            <span className={`${currentStage.color} font-song text-xs`}>
              {currentStage.label}
            </span>
            <span className="text-ink-600 text-xs">
              ({currentStage.minAge}–{currentStage.maxAge}歲)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {remainingYears > 0 && (
              <span className="text-ink-500 text-xs">
                剩餘 {remainingYears} 年
              </span>
            )}
            {progress >= 100 && (
              <span className="text-ink-400 text-xs italic">
                已到階段極限
              </span>
            )}
            <span className="text-gold font-song text-xs">
              現在 {age} 歲
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// 迷你版本：顯示所有階段的小點
// ============================================
export function LifeStageDots({ age }: { age: number }) {
  const currentStage = getCurrentStage(age);

  return (
    <div className="flex items-center gap-1">
      {LIFE_STAGES.map((stage) => {
        const isActive = stage.id === currentStage.id;
        const isCompleted = age > stage.maxAge;

        return (
          <motion.div
            key={stage.id}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              isActive
                ? `bg-gradient-to-r ${stage.gradient} scale-125 shadow-sm`
                : isCompleted
                ? `${stage.gradient.split(' ')[0].replace('from-', 'bg-')} opacity-40`
                : 'bg-ink-700 opacity-30'
            }`}
            title={`${stage.label} (${stage.minAge}–${stage.maxAge}歲)`}
          />
        );
      })}
    </div>
  );
}
