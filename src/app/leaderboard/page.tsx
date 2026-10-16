'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  fetchServerLeaderboard,
  deleteServerEntry,
  STATIC_MODE,
  type LeaderboardEntry,
} from '@/lib/data/leaderboard';
const DEATH_LABELS: Record<string, string> = {
  natural: '壽終正寢',
  combat: '戰死沙場',
  illness: '病逝',
  assassination: '遭暗殺',
  murder: '遭謀殺',
  poisoning: '中毒而亡',
  accident: '意外身亡',
  starvation: '飢餓而死',
  infant: '夭折',
  survived: '善終',
};

function formatAge(age: number): string {
  if (age === 0) return '嬰兒';
  if (age < 10) return `${age}歲`;
  if (age < 30) return `${age}歲`;
  if (age < 50) return `${age}歲（而立之年）`;
  if (age < 60) return `${age}歲（知天命）`;
  return `${age}歲（花甲）`;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState({ total: 0, maxAge: 0, avgAge: 0, maxRep: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, stats: s } = await fetchServerLeaderboard();
      setEntries(data);
      setStats(s);
    } catch (err) {
      console.error('[Leaderboard] Fetch error:', err);
      setError('無法連線到伺服器排行榜');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const handleDelete = async (id: string) => {
    try {
      const ok = await deleteServerEntry(id);
      if (ok) {
        // 刪除成功，重新載入
        fetchLeaderboard();
      } else {
        alert('刪除失敗');
      }
    } catch (err) {
      console.error('[Leaderboard] Delete error:', err);
      alert('刪除失敗');
    } finally {
      setDeleteConfirm(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('確定要清除排行榜所有紀錄嗎？此動作無法復原。')) return;
    try {
      for (const entry of entries) {
        await deleteServerEntry(entry.id);
      }
      fetchLeaderboard();
    } catch (err) {
      console.error('[Leaderboard] Clear error:', err);
      alert('清除失敗');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen ink-bg flex items-center justify-center text-ink-400 font-song">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-5xl mb-4"
        >
          📜
        </motion.div>
        <p className="text-xl">載入排行榜中...</p>
      </div>
    );
  }

  const bgColors: Record<string, string> = {
    scholar: 'from-amber-600 to-amber-800',
    commoner: 'from-stone-500 to-stone-700',
    merchant: 'from-emerald-600 to-emerald-800',
    military: 'from-red-700 to-red-900',
    poor: 'from-slate-500 to-slate-700',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-ink-900 via-ink-800 to-ink-900 text-ink-100 font-song">
      {/* 裝飾頂部 */}
      <div className="relative h-32 bg-gradient-to-b from-gold-900/20 to-transparent">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-700/50 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gold mb-2">🏆 {STATIC_MODE ? '名人堂' : '伺服器排行榜'}</h1>
          <p className="text-ink-400">三國蝴蝶 · 百代之名</p>
        </motion.div>

        {/* 錯誤訊息 */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-center">
            <p>{error}</p>
            <button onClick={fetchLeaderboard} className="mt-2 text-sm underline">
              重新嘗試
            </button>
          </div>
        )}

        {/* 統計 */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-ink-900/50 rounded-lg p-4 text-center border border-ink-700">
              <div className="text-2xl font-bold text-gold">{stats.total}</div>
              <div className="text-xs text-ink-400">共計紀錄</div>
            </div>
            <div className="bg-ink-900/50 rounded-lg p-4 text-center border border-ink-700">
              <div className="text-2xl font-bold text-vermilion">{stats.maxAge}</div>
              <div className="text-xs text-ink-400">最高壽</div>
            </div>
            <div className="bg-ink-900/50 rounded-lg p-4 text-center border border-ink-700">
              <div className="text-2xl font-bold text-sky-400">{stats.avgAge}</div>
              <div className="text-xs text-ink-400">平均壽</div>
            </div>
            <div className="bg-ink-900/50 rounded-lg p-4 text-center border border-ink-700">
              <div className="text-2xl font-bold text-emerald-400">{stats.maxRep}</div>
              <div className="text-xs text-ink-400">最高聲望</div>
            </div>
          </motion.div>
        )}

        {/* 排行榜列表 */}
        {entries.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl text-gold">排名榜單</h2>
              <button
                onClick={handleClearAll}
                className="text-xs text-red-400 hover:text-red-300 border border-red-800/50 px-3 py-1 rounded"
              >
                🗑 清除全部
              </button>
            </div>

            {/* 表頭 */}
            <div className="grid grid-cols-13 gap-1 px-4 py-2 bg-ink-900/60 rounded-t-lg text-xs text-ink-500 uppercase tracking-wider">
              <div className="col-span-1 text-center">排名</div>
              <div className="col-span-3">姓名</div>
              <div className="col-span-2 text-center">壽年</div>
              <div className="col-span-2 text-center">結局</div>
              <div className="col-span-2 text-center">影響力</div>
              <div className="col-span-2 text-center">詳情</div>
              <div className="col-span-1 text-center">刪除</div>
            </div>

            {entries.map((entry, idx) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + idx * 0.05 }}
                className={`grid grid-cols-13 gap-1 px-4 py-3 rounded-lg items-center transition-all
                  ${idx === 0 ? 'bg-gold/10 border border-gold/30' : 'bg-ink-900/40 border border-ink-700/50 hover:bg-ink-900/60'}
                `}
              >
                <div className="col-span-1 text-center">
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                </div>
                <div className="col-span-3">
                  <div className="font-bold text-ink-100">{entry.name}</div>
                  <div className="text-xs text-ink-500">
                    {entry.gender === 'male' ? '男' : '女'} ·{' '}
                    {entry.background === 'scholar' ? '士族' : entry.background === 'commoner' ? '平民' : entry.background === 'merchant' ? '商人' : entry.background === 'military' ? '將門' : '寒門'}
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-sky-300 font-bold">{entry.age}歲</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    entry.deathType === 'natural' || entry.deathType === 'survived'
                      ? 'bg-emerald-900/40 text-emerald-400'
                      : entry.deathType === 'combat'
                      ? 'bg-red-900/40 text-red-400'
                      : 'bg-ink-700 text-ink-300'
                  }`}>
                    {DEATH_LABELS[entry.deathType] || '未知'}
                  </span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="text-gold text-sm">{entry.reputation}</span>
                </div>
                <div className="col-span-2 text-center">
                  <button
                    onClick={() => router.push(`/leaderboard/detail?id=${encodeURIComponent(entry.id)}`)}
                    className="text-vermilion text-sm hover:underline"
                  >
                    查看 →
                  </button>
                </div>
                <div className="col-span-1 text-center">
                  <button
                    onClick={() => setDeleteConfirm(entry.id)}
                    className="text-red-400 text-xs hover:text-red-300"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 text-ink-500"
          >
            <div className="text-6xl mb-4">🏛</div>
            <p className="text-xl mb-2">排行榜尚未有任何紀錄</p>
            <p className="text-sm">開始你的三國之旅，你的名字將流芳百世。</p>
          </motion.div>
        )}

        {/* 刪除確認 */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
            <div className="bg-ink-800 border border-ink-600 rounded-xl p-8 max-w-sm mx-4">
              <h3 className="text-xl text-vermilion mb-4">確認刪除？</h3>
              <p className="text-ink-400 mb-6">此紀錄將被永久刪除，無法復原。</p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700"
                >
                  確認刪除
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 py-2 bg-ink-700 text-ink-300 rounded-lg hover:bg-ink-600"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 返回按鈕 */}
        <div className="text-center mt-10">
          <button
            onClick={() => router.push('/')}
            className="px-8 py-3 rounded-lg border border-ink-600 text-ink-400 hover:border-vermilion hover:text-vermilion transition-all font-song"
          >
            ← 返回首頁
          </button>
        </div>
      </div>
    </div>
  );
}
