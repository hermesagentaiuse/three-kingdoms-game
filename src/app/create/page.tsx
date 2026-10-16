'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCreateStore } from '@/lib/store/createStore';
import { useGameStore } from '@/lib/store/gameStore';
import type { Player } from '@/types/game';

export default function CreatePage() {
  const router = useRouter();
  const {
    name,
    gender,
    background,
    birthYear,
    stats,
    setName,
    setGender,
    setBackground,
    setBirthYear,
    autoGenerate,
    validate,
    createPlayer,
  } = useCreateStore();

  const startGame = useGameStore((s) => s.startNewGame);

  const [error, setError] = useState('');

  const statKeys = ['int', 'str', 'lck', 'cha', 'vit'] as const;
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

  const backgrounds = [
    { id: 'scholar', name: '士族', desc: '出身書香門第，智力+3' },
    { id: 'commoner', name: '平民', desc: '普通百姓，無加成' },
    { id: 'merchant', name: '商人', desc: '富商之後，魅力+2 運氣+1' },
    { id: 'military', name: '將門', desc: '將門之後，武力+3' },
    { id: 'poor', name: '寒門', desc: '貧寒之家，體力+2 運氣+1' },
  ];

  const eras = [
    { year: 184, name: '黃巾之亂', desc: '天下大亂，群雄並起' },
    { year: 189, name: '董卓亂政', desc: '董卓專權，天下分裂' },
    { year: 196, name: '群雄割據', desc: '曹操挾天子以令諸侯' },
    { year: 200, name: '官渡之戰', desc: '曹操統一北方' },
    { year: 208, name: '赤壁之戰', desc: '三國鼎立格局形成' },
    { year: 220, name: '三國鼎立', desc: '魏蜀吳三國鼎立' },
  ];

  const handleStart = () => {
    console.log('handleStart called');
    console.log('name:', name);
    const isValid = validate();
    console.log('validate:', isValid);
    if (!isValid) {
      if (!name.trim()) setError('請輸入角色名稱');
      else setError('請完成所有設定');
      return;
    }

    const player = createPlayer();
    console.log('player:', player);
    if (player) {
      // 將玩家資料存入 sessionStorage，遊戲頁面載入時會讀取
      sessionStorage.setItem('tk_player', JSON.stringify(player));
      console.log('player saved to sessionStorage, navigating to /game');
      router.push('/game');
    } else {
      console.log('createPlayer returned null');
    }
  };

  return (
    <div className="min-h-screen ink-bg font-song">
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-700 to-transparent" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gold mb-2">
            角色創建
          </h1>
          <p className="text-ink-400">塑造你在三國時代的身份</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 左側：基本設定 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* 姓名 */}
            <div className="event-card">
              <h3 className="text-gold font-song text-lg mb-3">姓名</h3>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="請輸入角色名稱"
                className="w-full bg-ink-950/50 border border-ink-700 rounded-lg px-4 py-2 text-ink-100 font-song focus:border-gold focus:outline-none transition-colors"
                maxLength={20}
              />
            </div>

            {/* 性別 */}
            <div className="event-card">
              <h3 className="text-gold font-song text-lg mb-3">性別</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => setGender('male')}
                  className={`flex-1 py-2 rounded-lg border transition-all ${
                    gender === 'male'
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-ink-700 text-ink-400 hover:border-ink-600'
                  }`}
                >
                  男
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`flex-1 py-2 rounded-lg border transition-all ${
                    gender === 'female'
                      ? 'border-gold bg-gold/10 text-gold'
                      : 'border-ink-700 text-ink-400 hover:border-ink-600'
                  }`}
                >
                  女
                </button>
              </div>
            </div>

            {/* 出身 */}
            <div className="event-card">
              <h3 className="text-gold font-song text-lg mb-3">出身</h3>
              <div className="space-y-2">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => setBackground(bg.id as typeof background)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      background === bg.id
                        ? 'border-gold bg-gold/10'
                        : 'border-ink-700 hover:border-ink-600'
                    }`}
                  >
                    <div className="text-ink-100 font-song">{bg.name}</div>
                    <div className="text-ink-500 text-sm">{bg.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 出生時代 */}
            <div className="event-card">
              <h3 className="text-gold font-song text-lg mb-3">出生時代</h3>
              <div className="space-y-2">
                {eras.map((era) => (
                  <button
                    key={era.year}
                    onClick={() => setBirthYear(era.year)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      birthYear === era.year
                        ? 'border-gold bg-gold/10'
                        : 'border-ink-700 hover:border-ink-600'
                    }`}
                  >
                    <div className="text-ink-100 font-song">{era.name} ({era.year}年)</div>
                    <div className="text-ink-500 text-sm">{era.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* 右側：屬性顯示 + 隨機生成 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="event-card">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gold font-song text-lg">初始屬性</h3>
                <div className="text-ink-500 text-xs">已自動隨機生成</div>
              </div>

              <div className="space-y-3">
                {statKeys.map((stat) => (
                  <div key={stat}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-ink-300 text-sm">
                        {statIcons[stat]} {statNames[stat]}
                      </span>
                      <span className="text-gold font-song text-base">{stats[stat]}</span>
                    </div>
                    <div className="stat-bar-container mb-2">
                      <div
                        className={`stat-bar-fill bg-gradient-to-r ${statColors[stat]}`}
                        style={{ width: `${(stats[stat] / 30) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={autoGenerate}
                className="w-full mt-4 py-3 rounded-lg bg-gradient-to-r from-gold-600 to-gold-500 text-ink-950 font-song font-bold hover:from-gold-500 hover:to-gold-400 transition-all text-sm"
              >
                🎲 重新生成
              </button>
            </div>

            <div className="event-card">
              <h3 className="text-gold font-song text-sm mb-3">屬性總覽</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {statKeys.map((stat) => (
                  <div key={stat} className="flex justify-between">
                    <span className="text-ink-400">{statIcons[stat]} {statNames[stat]}</span>
                    <span className="text-ink-100 font-song">{stats[stat]}</span>
                  </div>
                ))}
                <div className="col-span-2 flex justify-between border-t border-ink-700 pt-2 mt-1">
                  <span className="text-ink-400">總和</span>
                  <span className="text-gold font-song">
                    {Object.values(stats).reduce((a, b) => a + b, 0)} / 50
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={handleStart}
              disabled={!validate()}
              className={`w-full py-3 rounded-lg font-song text-lg transition-all ${
                validate()
                  ? 'bg-gradient-to-r from-gold-700 via-gold-600 to-gold-700 text-ink-950 hover:from-gold-600 hover:via-gold-500 hover:to-gold-600 gold-pulse'
                  : 'bg-ink-800 text-ink-500 cursor-not-allowed'
              }`}
            >
              {validate() ? '開始遊戲' : '請完成所有設定'}
            </button>

            {error && (
              <div className="text-vermilion-500 text-sm text-center">{error}</div>
            )}

            <button
              onClick={() => router.push('/')}
              className="w-full text-ink-500 hover:text-ink-400 text-sm transition-colors"
            >
              ← 返回首頁
            </button>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-700 to-transparent opacity-30" />
    </div>
  );
}
