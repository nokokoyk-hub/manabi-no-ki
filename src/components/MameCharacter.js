// ============================================
// 🐕 MameCharacter - キャラクターコンポーネント
// ポーズ切替 + CSSアニメーション + 吹き出しメッセージ
// v0.6.0: petName対応
// v0.6.1: アニメーション大幅強化
// v0.6.4: 実在画像のみ参照 + fallback追加
// v0.7.0: 新画像10枚追加！全15ポーズ対応
// ============================================

import React, { useState, useCallback } from 'react';

const FALLBACK_IMAGE = '/public/images/mame/mame_happy.png';

// ポーズ → 画像ファイルのマッピング（全15枚実在確認済み）
const POSE_IMAGES = {
  // --- 既存5枚 ---
  normal:    '/public/images/mame/mame_happy.png',
  happy:     '/public/images/mame/mame_happy.png',
  run:       '/public/images/mame/mame_run.png',
  question:  '/public/images/mame/mame_question.png',
  heart:     '/public/images/mame/mame_heart.png',
  sleep:     '/public/images/mame/mame_sleep.png',
  // --- 新規10枚（v0.7.0） ---
  cheer:     '/public/images/mame/mame_cheer.png',
  flag:      '/public/images/mame/mame_flag.png',
  cry_happy: '/public/images/mame/mame_cry_happy.png',
  touched:   '/public/images/mame/mame_touched.png',
  medal:     '/public/images/mame/mame_medal.png',
  jump:      '/public/images/mame/mame_jump.png',
  eat:       '/public/images/mame/mame_eat.png',
  sad:       '/public/images/mame/mame_sad.png',
  relax:     '/public/images/mame/mame_relax.png',
  dash:      '/public/images/mame/mame_dash.png',
  // --- アニメ専用ポーズ（既存画像にアニメーションを組み合わせ）---
  shake:     '/public/images/mame/mame_sad.png',
  spin:      '/public/images/mame/mame_jump.png',
  sparkle:   '/public/images/mame/mame_medal.png',
  slideUp:   '/public/images/mame/mame_dash.png',
  wiggle:    '/public/images/mame/mame_cheer.png',
  bow:       '/public/images/mame/mame_touched.png',
};

// ポーズ → アニメーション名のマッピング
const POSE_ANIMATIONS = {
  // --- 既存 ---
  normal:    'mame-float 2s ease-in-out infinite',
  happy:     'mame-jump 0.5s ease-out',
  run:       'mame-bounce 0.6s ease-in-out infinite',
  question:  'mame-tilt 1.5s ease-in-out infinite',
  heart:     'mame-pulse 1s ease-in-out infinite',
  sleep:     'mame-breathe 3s ease-in-out infinite',
  // --- 新画像用 ---
  cheer:     'mame-wiggle 0.8s ease-in-out infinite',
  flag:      'mame-wiggle 1s ease-in-out infinite',
  cry_happy: 'mame-pulse 1.2s ease-in-out infinite',
  touched:   'mame-pulse 1.5s ease-in-out infinite',
  medal:     'mame-jump 0.6s ease-out',
  jump:      'mame-spin 0.8s ease-out',
  eat:       'mame-breathe 2s ease-in-out infinite',
  sad:       'mame-shake 0.6s ease-out',
  relax:     'mame-breathe 3s ease-in-out infinite',
  dash:      'mame-bounce 0.5s ease-in-out infinite',
  // --- アニメ専用ポーズ ---
  shake:     'mame-shake 0.6s ease-out',
  spin:      'mame-spin 0.8s ease-out',
  sparkle:   'mame-sparkle 1.5s ease-in-out infinite',
  slideUp:   'mame-slideUp 0.6s ease-out',
  wiggle:    'mame-wiggle 0.8s ease-in-out infinite',
  bow:       'mame-bow 1s ease-in-out',
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

  const imageSrc = POSE_IMAGES[pose] || FALLBACK_IMAGE;
  const animation = isTapped
    ? 'mame-tap 0.5s ease-out'
    : (POSE_ANIMATIONS[pose] || POSE_ANIMATIONS.normal);

  const handleTap = useCallback(() => {
    if (!enableTap || isTapped) return;
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 500);
  }, [enableTap, isTapped]);

  const showSparkles = pose === 'sparkle' || pose === 'medal';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 8,
      ...style,
    }}>
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

      <div
        onClick={handleTap}
        style={{
          position: 'relative',
          cursor: enableTap ? 'pointer' : 'default',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
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
          onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
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
