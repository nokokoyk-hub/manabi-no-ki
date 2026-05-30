// ============================================
// 🐕 MameCharacter - キャラクターコンポーネント
// ポーズ切替 + CSSアニメーション + 吹き出しメッセージ
// v0.6.0: petName対応
// v0.6.1: アニメーション大幅強化
//   - 新ポーズ: shake/spin/sparkle/slideUp/wiggle/bow
//   - タップ反応: タップするとぽよんと跳ねる
//   - きらきらパーティクル: sparkleポーズ時
// ============================================

import React, { useState, useCallback } from 'react';

// ポーズ → 画像ファイルのマッピング
const POSE_IMAGES = {
  normal: '/public/images/mame/mame_happy.png',
  run: '/public/images/mame/mame_run.png',
  happy: '/public/images/mame/mame_happy.png',
  question: '/public/images/mame/mame_question.png',
  heart: '/public/images/mame/mame_heart.png',
  sleep: '/public/images/mame/mame_sleep.png',
  // v0.6.1: 新ポーズ（既存画像を使い回し）
  shake: '/public/images/mame/mame_question.png',
  spin: '/public/images/mame/mame_happy.png',
  sparkle: '/public/images/mame/mame_heart.png',
  slideUp: '/public/images/mame/mame_happy.png',
  wiggle: '/public/images/mame/mame_run.png',
  bow: '/public/images/mame/mame_happy.png',
};

// ポーズ → アニメーション名のマッピング
const POSE_ANIMATIONS = {
  normal: 'mame-float 2s ease-in-out infinite',
  run: 'mame-bounce 0.6s ease-in-out infinite',
  happy: 'mame-jump 0.5s ease-out',
  question: 'mame-tilt 1.5s ease-in-out infinite',
  heart: 'mame-pulse 1s ease-in-out infinite',
  sleep: 'mame-breathe 3s ease-in-out infinite',
  // v0.6.1: 新アニメーション
  shake: 'mame-shake 0.6s ease-out',
  spin: 'mame-spin 0.8s ease-out',
  sparkle: 'mame-sparkle 1.5s ease-in-out infinite',
  slideUp: 'mame-slideUp 0.6s ease-out',
  wiggle: 'mame-wiggle 0.8s ease-in-out infinite',
  bow: 'mame-bow 1s ease-in-out',
};

// きらきらパーティクルの生成データ
const SPARKLE_PARTICLES = [
  { tx: '-30px', ty: '-35px', delay: '0s', emoji: '✨' },
  { tx: '28px', ty: '-40px', delay: '0.15s', emoji: '⭐' },
  { tx: '-22px', ty: '20px', delay: '0.3s', emoji: '✨' },
  { tx: '35px', ty: '10px', delay: '0.1s', emoji: '🌟' },
  { tx: '0px', ty: '-45px', delay: '0.25s', emoji: '✨' },
  { tx: '-35px', ty: '5px', delay: '0.2s', emoji: '⭐' },
];

const MameCharacter = ({
  pose = 'normal',
  message = '',
  size = 100,
  petName = 'まめ',
  enableTap = true,
  style = {},
}) => {
  const [isTapped, setIsTapped] = useState(false);

  const imageSrc = POSE_IMAGES[pose] || POSE_IMAGES.normal;
  const animation = isTapped
    ? 'mame-tap 0.5s ease-out'
    : (POSE_ANIMATIONS[pose] || POSE_ANIMATIONS.normal);

  // タップ反応
  const handleTap = useCallback(() => {
    if (!enableTap || isTapped) return;
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 500);
  }, [enableTap, isTapped]);

  const showSparkles = pose === 'sparkle' || pose === 'spin';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      ...style,
    }}>
      {/* 吹き出しメッセージ */}
      {message && (
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: '8px 14px',
          fontSize: 13,
          fontWeight: 700,
          color: '#5D4037',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'relative',
          maxWidth: 200,
          textAlign: 'center',
          animation: 'mame-fadeIn 0.3s ease-out',
          lineHeight: 1.5,
        }}>
          {message}
          <div style={{
            position: 'absolute',
            bottom: -8,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0,
            height: 0,
            borderLeft: '8px solid transparent',
            borderRight: '8px solid transparent',
            borderTop: '8px solid white',
          }} />
        </div>
      )}

      {/* キャラ画像 + きらきら */}
      <div
        onClick={handleTap}
        style={{
          position: 'relative',
          cursor: enableTap ? 'pointer' : 'default',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {/* きらきらパーティクル */}
        {showSparkles && SPARKLE_PARTICLES.map((p, i) => (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              fontSize: size * 0.22,
              '--tx': p.tx,
              '--ty': p.ty,
              animation: `sparkle-particle 1.2s ease-out ${p.delay} infinite`,
              pointerEvents: 'none',
              zIndex: 1,
            }}
          >
            {p.emoji}
          </span>
        ))}

        <img
          src={imageSrc}
          alt={petName}
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            animation,
            filter: showSparkles
              ? 'drop-shadow(0 0 12px rgba(255,215,0,0.5))'
              : 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
            transition: 'filter 0.3s ease',
          }}
        />
      </div>
    </div>
  );
};

export default MameCharacter;
