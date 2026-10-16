'use client';

// ============================================
// ButterflyPanel — 蝴蝶效應可視化面板
// 顯示玩家如何影響了三國歷史
// ============================================

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ButterflyEffect } from '@/types/game';

interface ButterflyPanelProps {
  butterflyEffects: ButterflyEffect[];
  maxDisplay?: number; // 最多顯示幾個，超出可展開
}

const TYPE_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
  military: { icon: '⚔️', label: '軍事', color: 'border-red-500/40 bg-red-950/20' },
  political: { icon: '🏛️', label: '政治', color: 'border-amber-500/40 bg-amber-950/20' },
  economic: { icon: '💰', label: '經濟', color: 'border-yellow-500/40 bg-yellow-950/20' },
  cultural: { icon: '📜', label: '文化', color: 'border-blue-500/40 bg-blue-950/20' },
  diplomatic: { icon: '🤝', label: '外交', color: 'border-emerald-500/40 bg-emerald-950/20' },
};

const IMPACT_LABEL: Record<string, { text: string; sign: string; color: string }> = {
  positive: { text: '正面影響', sign: '+', color: 'text-emerald-400' },
  negative: { text: '負面影響', sign: '−', color: 'text-red-400' },
  neutral: { text: '中性影響', sign: '±', color: 'text-ink-400' },
  mixed: { text: '複合影響', sign: '⟷', color: 'text-amber-400' },
};

const VALUE_LABELS: Record<number, string> = {
  1: '🦋 輕微',
  2: '🦋 輕微',
  3: '🦋 輕微',
  4: '🦋🦋 中等',
  5: '🦋🦋 中等',
  6: '🦋🦋 中等',
  7: '🦋🦋🦋 重大',
  8: '🦋🦋🦋 重大',
  9: '🦋🦋🦋 重大',
  10: '🌋 歷史轉折點',
};

export default function ButterflyPanel({ butterflyEffects, maxDisplay = 5 }: ButterflyPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const effects = butterflyEffects || [];
  const displayEffects = expanded ? effects : effects.slice(0, maxDisplay);
  const hasMore = effects.length > maxDisplay;

  if (effects.length === 0) {
    return (
      <div className="event-card">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gold font-song text-sm">🦋 蝴蝶效應記錄</span>
        </div>
        <div className="text-ink-500 text-sm italic py-4 text-center">
          尚未有任何蝴蝶效應發生
          <br />
          <span className="text-xs text-ink-600">你的每一個選擇都在改變歷史...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="event-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* 標題 */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🦋</span>
          <span className="text-gold font-song text-sm">
            蝴蝶效應記錄
            <span className="ml-1 text-xs text-ink-500">({effects.length})</span>
          </span>
        </div>
        {hasMore && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-ink-400 hover:text-gold transition-colors"
          >
            {expanded ? '收起 ▲' : `展開 ▼`}
          </button>
        )}
      </div>

      {/* 效應總覽小計 */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
        {Object.entries(TYPE_CONFIG).map(([type, config]) => {
          const count = effects.filter((e) => e.type === type).length;
          return (
            count > 0 && (
              <div key={type} className="flex items-center gap-1.5 text-ink-400">
                <span>{config.icon}</span>
                <span>{config.label}:</span>
                <span className="text-gold font-song">{count}</span>
              </div>
            )
          );
        })}
      </div>

      {/* 按時間線排列的效應列表 */}
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 custom-scroll">
        <AnimatePresence initial={false}>
          {displayEffects.map((effect, index) => {
            const config = TYPE_CONFIG[effect.type] || TYPE_CONFIG.cultural;
            const impact = IMPACT_LABEL[effect.impact] || IMPACT_LABEL.neutral;

            return (
              <motion.div
                key={`${effect.target}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-start gap-3 p-2.5 rounded-lg border ${config.color} transition-all hover:border-gold/40`}
              >
                {/* 正面/負面標記 */}
                <div className="flex-shrink-0 mt-0.5">
                  <span className={`text-lg font-song font-bold ${impact.color}`}>
                    {impact.sign}
                  </span>
                </div>

                {/* 圖標 */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-ink-900 flex items-center justify-center text-base">
                  {config.icon}
                </div>

                {/* 內容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-ink-200 text-xs font-song truncate">
                      {effect.target}
                    </span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${impact.color} bg-ink-950/40`}>
                      {impact.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-ink-500">
                      影響值: {effect.value}
                    </span>
                    <span className="text-xs text-ink-600">
                      • {VALUE_LABELS[effect.value] || `影響值 ${effect.value}`}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 總結 */}
      <div className="mt-4 pt-3 border-t border-ink-700/50">
        <div className="flex items-center justify-between text-xs text-ink-500">
          <span>📊 歷史影響力總覽</span>
          <span className="text-gold font-song">
            總效應數: {effects.length}
          </span>
        </div>
        {effects.some((e) => e.value >= 7) && (
          <div className="mt-1 text-xs text-amber-400">
            ⚡ 你已產生重大歷史影響！
          </div>
        )}
      </div>
    </motion.div>
  );
}
