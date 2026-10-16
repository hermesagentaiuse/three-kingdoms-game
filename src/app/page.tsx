'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <div className="min-h-screen ink-bg flex flex-col items-center justify-center relative overflow-hidden">
      {/* 水墨背景裝飾 */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gold blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-vermilion blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-jade blur-3xl" />
      </div>

      {/* 主內容 */}
      <div className="relative z-10 text-center px-4 max-w-2xl">
        {/* 標題 */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-song text-gold mb-4 tracking-widest">
            三國蝴蝶
          </h1>
          <div className="ancient-line flex items-center gap-4 mb-6">
            <span className="text-gold text-lg">三國歷史文字冒險</span>
          </div>
          <p className="text-ink-300 text-lg md:text-xl font-song leading-relaxed max-w-lg mx-auto">
            穿越時空的蝴蝶，在三國亂世中做出你的選擇。
            <br />
            每一個決定，都會改變歷史的走向。
          </p>
        </motion.div>

        {/* 開始按鈕 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col gap-4 items-center"
        >
          <Link
            href="/create"
            className="gold-border bg-gradient-to-r from-gold-700 via-gold-600 to-gold-700 text-ink-950 font-song text-xl px-12 py-4 rounded-lg hover:from-gold-600 hover:via-gold-500 hover:to-gold-600 transition-all duration-300 gold-pulse"
          >
            開始新遊戲
          </Link>

          {/* 讀取存檔按鈕 */}
          <button
            onClick={() => {
              const save = localStorage.getItem('tk_save');
              if (save) {
                window.location.href = '/game';
              } else {
                alert('沒有找到存檔');
              }
            }}
            className="text-ink-400 hover:text-gold font-song text-lg transition-colors duration-200 border-b border-ink-600 hover:border-gold pb-1"
          >
            讀取存檔
          </button>
        </motion.div>

        {/* 遊戲特色 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          {[
            { icon: '🎭', title: '角色創建', desc: '自定義屬性與出身' },
            { icon: '📜', title: '歷史事件', desc: '親歷三國大事' },
            { icon: '🎲', title: '擲骰判定', desc: '屬性決定命運' },
            { icon: '🏛️', title: '多結局', desc: '改變歷史走向' },
          ].map((feature, i) => (
            <div key={i} className="p-4">
              <div className="text-3xl mb-2">{feature.icon}</div>
              <div className="text-gold font-song text-sm">{feature.title}</div>
              <div className="text-ink-500 text-xs mt-1">{feature.desc}</div>
            </div>
          ))}
        </motion.div>

        {/* 版本資訊 */}
        <div className="mt-12 text-ink-600 text-sm font-song">
          v0.1.0 · 三國蝴蝶 · 文字冒險遊戲
        </div>
      </div>

      {/* 底部裝飾 */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-700 to-transparent opacity-30" />
    </div>
  );
}
