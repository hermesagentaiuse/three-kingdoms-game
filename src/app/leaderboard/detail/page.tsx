'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { getLeaderboardEntry, LeaderboardEntry } from '@/lib/data/leaderboard';

const DEATH_LABELS: Record<string, string> = {
  natural: '🕯 壽終正寢',
  combat: '⚔ 戰死沙場',
  illness: '🤒 病逝',
  assassination: '🗡 遭暗殺',
  murder: '💀 遭謀殺',
  poisoning: '☠ 中毒而亡',
  accident: '💥 意外身亡',
  starvation: '🍂 飢餓而死',
  infant: '👶 夭折',
  survived: '✨ 善終',
};

export default function LeaderboardDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink-900 flex items-center justify-center"><div className="text-gold text-xl">載入中...</div></div>}>
      <LeaderboardDetailContent />
    </Suspense>
  );
}

function LeaderboardDetailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get('id') as string;
  const [entry, setEntry] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getLeaderboardEntry(id).then((data) => {
        setEntry(data);
        setLoading(false);
      }).catch(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-gold text-xl">載入中...</div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📜</div>
          <p className="text-xl text-ink-400 mb-4">此紀錄已不存在</p>
          <button onClick={() => router.push('/leaderboard')} className="text-vermilion hover:underline">
            返回排行榜
          </button>
        </div>
      </div>
    );
  }

  const bgLabel =
    entry.background === 'scholar'
      ? '士族'
      : entry.background === 'commoner'
      ? '平民'
      : entry.background === 'merchant'
      ? '商人'
      : entry.background === 'military'
      ? '將門'
      : '寒門';

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900 text-ink-100 font-song">
      <div className="relative h-24 bg-gradient-to-b from-gold-900/20 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-700/50 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 返回按鈕 */}
        <button
          onClick={() => router.back()}
          className="text-ink-400 hover:text-gold mb-6 flex items-center gap-2 transition-colors"
        >
          ← 返回排行榜
        </button>

        {/* 玩家基本資料 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-ink-900/60 border border-ink-700/50 rounded-xl p-6 mb-6"
        >
          <div className="flex flex-wrap items-start gap-6">
            <div className="flex-1 min-w-[200px]">
              <h1 className="text-3xl font-bold text-gold mb-1">{entry.name}</h1>
              <p className="text-ink-400 text-sm">
                {entry.gender === 'male' ? '男' : '女'} · {bgLabel}
              </p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <span className="px-3 py-1 bg-sky-900/40 text-sky-400 rounded text-sm">
                {entry.age}歲
              </span>
              <span className="px-3 py-1 bg-gold-900/40 text-gold rounded text-sm">
                聲望 {entry.reputation}
              </span>
              <span className="px-3 py-1 bg-emerald-900/40 text-emerald-400 rounded text-sm">
                {DEATH_LABELS[entry.deathType] || entry.deathType}
              </span>
            </div>
          </div>
        </motion.div>

        {/* 死因/結局 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-ink-900/60 border border-ink-700/50 rounded-xl p-6 mb-6"
        >
          <h2 className="text-lg text-gold mb-3">結局</h2>
          <p className="text-xl text-ink-100 font-bold mb-2">{entry.endingTitle}</p>
          <p className="text-ink-300 leading-relaxed">{entry.deathReason || '無記載'}</p>
        </motion.div>

        {/* AI評價 */}
        {entry.endingEvaluation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-ink-900/60 border border-ink-700/50 rounded-xl p-6 mb-6"
          >
            <h2 className="text-lg text-gold mb-3">📖 歷史評價</h2>
            <p className="text-ink-300 leading-relaxed whitespace-pre-wrap">{entry.endingEvaluation}</p>
          </motion.div>
        )}

        {/* 統計 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          <div className="bg-ink-900/40 border border-ink-700/30 rounded-lg p-3 text-center">
            <div className="text-gold text-lg font-bold">{entry.reputation}</div>
            <div className="text-xs text-ink-500">聲望</div>
          </div>
          <div className="bg-ink-900/40 border border-ink-700/30 rounded-lg p-3 text-center">
            <div className="text-emerald-400 text-lg font-bold">{entry.gold}</div>
            <div className="text-xs text-ink-500">金銀</div>
          </div>
          <div className="bg-ink-900/40 border border-ink-700/30 rounded-lg p-3 text-center">
            <div className="text-sky-400 text-lg font-bold">{entry.totalChoices}</div>
            <div className="text-xs text-ink-500">選擇數</div>
          </div>
          <div className="bg-ink-900/40 border border-ink-700/30 rounded-lg p-3 text-center">
            <div className="text-vermilion text-lg font-bold">{entry.achievements.length}</div>
            <div className="text-xs text-ink-500">成就</div>
          </div>
        </motion.div>

        {/* 成就 */}
        {entry.achievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-ink-900/60 border border-ink-700/50 rounded-xl p-6 mb-6"
          >
            <h2 className="text-lg text-gold mb-3">🏆 成就徽章</h2>
            <div className="flex flex-wrap gap-2">
              {entry.achievements.map((a) => (
                <span key={a} className="px-3 py-1 bg-gold-900/30 text-gold rounded text-sm border border-gold/20">
                  {a}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* 關鍵選擇 */}
        {entry.keyChoices.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-ink-900/60 border border-ink-700/50 rounded-xl p-6 mb-6"
          >
            <h2 className="text-lg text-gold mb-3">🔑 關鍵選擇</h2>
            <div className="space-y-2">
              {entry.keyChoices.map((kc, idx) => (
                <div key={idx} className="flex gap-3 items-start py-2 border-b border-ink-800 last:border-0">
                  <span className="text-xs text-ink-500 w-16 shrink-0">{kc.age}歲</span>
                  <span className="text-ink-300 text-sm">{kc.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 時間軸 */}
        {entry.timeline.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-ink-900/60 border border-ink-700/50 rounded-xl p-6 mb-6"
          >
            <h2 className="text-lg text-gold mb-3">📅 人生時間軸</h2>
            <div className="space-y-2">
              {entry.timeline.map((t, idx) => (
                <div key={idx} className="flex gap-3 items-start py-2 border-b border-ink-800 last:border-0">
                  <span className="text-xs text-ink-500 w-20 shrink-0">{t.year}年</span>
                  <span className="text-ink-300 text-sm">{t.event}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 返回 */}
        <div className="text-center pb-10">
          <button
            onClick={() => router.push('/leaderboard')}
            className="px-8 py-3 rounded-lg border border-ink-600 text-ink-400 hover:border-vermilion hover:text-vermilion transition-all font-song"
          >
            ← 返回排行榜
          </button>
        </div>
      </div>
    </div>
  );
}
