// ============================================
// 🎊 GrowthEffect - 成長演出の粒子コンポーネント
// まなびの木 v1.0.5
// 新規作成: 2026/07/01（スレッド30）
// ============================================
// 木のエリアに絵文字パーティクルを舞わせる。
// keyframes は index.css の growth-particle を使用。
// 設定は constants/growthEffects.js で一元管理。
// ============================================

import React, { useMemo } from 'react';

const GrowthEffect = ({ particles, count = 8 }) => {
  // 粒子の位置・タイミングをランダム生成（マウント時に1回だけ）
  const items = useMemo(() => {
    if (!particles || particles.length === 0) return [];
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: particles[i % particles.length],
      left: 10 + Math.random() * 80,          // 横位置 10〜90%
      delay: Math.random() * 0.8,              // 開始ずらし 0〜0.8s
      duration: 1.2 + Math.random() * 0.8,     // 舞う長さ 1.2〜2.0s
      size: 16 + Math.random() * 14,           // サイズ 16〜30px
      tx: (Math.random() - 0.5) * 60,          // 横に流れる量
    }));
  }, [particles, count]);

  if (items.length === 0) return null;

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none',
      overflow: 'visible',
      zIndex: 4,
    }}>
      {items.map(p => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            bottom: '30%',
            fontSize: p.size,
            '--gx': `${p.tx}px`,
            animation: `growth-particle ${p.duration}s ease-out ${p.delay}s forwards`,
            opacity: 0,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
};

export default GrowthEffect;
