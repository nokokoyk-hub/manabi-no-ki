// ============================================
// 🤖 RobotCharacter - ロボットくんコンポーネント
// まなびの木 v0.9.9 → v1.0.2 フルポーズ拡張
// v0.9.9: 新規作成（wave/cheer 2ポーズ）
// v1.0.2: 全18ポーズ対応（2026/06/26）
//         AuthScreen登場・出題キャラ交代対応
// ============================================
// MameCharacter.js と同じポーズ名に対応
// → LearningScreen等で同じpose名で切り替え可能
// ============================================

import React, { useState, useCallback } from 'react';

const FALLBACK_IMAGE = '/public/images/robot/robot_wave.png';

// ポーズ → 画像ファイルのマッピング（全18枚実在確認済み）
const POSE_IMAGES = {
  // --- 既存3枚 ---
  wave:      '/public/images/robot/robot_wave.png',
  cheer:     '/public/images/robot/robot_cheer.png',
  // --- 新規15枚（v1.0.2） ---
  happy:     '/public/images/robot/robot_happy.png',
  sad:       '/public/images/robot/robot_sad.png',
  question:  '/public/images/robot/robot_question.png',
  jump:      '/public/images/robot/robot_jump.png',
  medal:     '/public/images/robot/robot_medal.png',
  cry_happy: '/public/images/robot/robot_cry_happy.png',
  dash:      '/public/images/robot/robot_dash.png',
  touched:   '/public/images/robot/robot_touched.png',
  flag:      '/public/images/robot/robot_flag.png',
  heart:     '/public/images/robot/robot_heart.png',
  sleep:     '/public/images/robot/robot_sleep.png',
  eat:       '/public/images/robot/robot_eat.png',
  relax:     '/public/images/robot/robot_relax.png',
  sparkle:   '/public/images/robot/robot_sparkle.png',
  bow:       '/public/images/robot/robot_bow.png',
  // --- エイリアス（MameCharacterと同じpose名で使えるように） ---
  normal:    '/public/images/robot/robot_happy.png',
  run:       '/public/images/robot/robot_dash.png',
  shake:     '/public/images/robot/robot_sad.png',
  spin:      '/public/images/robot/robot_jump.png',
  slideUp:   '/public/images/robot/robot_dash.png',
  wiggle:    '/public/images/robot/robot_cheer.png',
};

// ポーズ → アニメーション名のマッピング
const POSE_ANIMATIONS = {
  // --- 基本ポーズ ---
  wave:      'robot-float 2.5s ease-in-out infinite',
  cheer:     'robot-bounce 0.5s ease-out',
  happy:     'robot-bounce 0.5s ease-out',
  sad:       'robot-shake 0.6s ease-out',
  question:  'robot-tilt 1.5s ease-in-out infinite',
  jump:      'robot-spin 0.8s ease-out',
  medal:     'robot-bounce 0.6s ease-out',
  cry_happy: 'robot-pulse 1.2s ease-in-out infinite',
  dash:      'robot-dash 0.5s ease-in-out infinite',
  touched:   'robot-pulse 1.5s ease-in-out infinite',
  flag:      'robot-wiggle 1s ease-in-out infinite',
  heart:     'robot-pulse 1s ease-in-out infinite',
  sleep:     'robot-breathe 3s ease-in-out infinite',
  eat:       'robot-breathe 2s ease-in-out infinite',
  relax:     'robot-breathe 3s ease-in-out infinite',
  sparkle:   'robot-sparkle 1.5s ease-in-out infinite',
  bow:       'robot-bow 1s ease-in-out',
  // --- エイリアス ---
  normal:    'robot-float 2.5s ease-in-out infinite',
  run:       'robot-dash 0.5s ease-in-out infinite',
  shake:     'robot-shake 0.6s ease-out',
  spin:      'robot-spin 0.8s ease-out',
  slideUp:   'robot-slideUp 0.6s ease-out',
  wiggle:    'robot-wiggle 0.8s ease-in-out infinite',
};

// きらきらパーティクル（medal/sparkle時）
const SPARKLE_PARTICLES = [
  { tx: '-30px', ty: '-35px', delay: '0s', emoji: '⚡' },
  { tx: '28px', ty: '-40px', delay: '0.15s', emoji: '✨' },
  { tx: '-22px', ty: '20px', delay: '0.3s', emoji: '⚡' },
  { tx: '35px', ty: '10px', delay: '0.1s', emoji: '🌟' },
  { tx: '0px', ty: '-45px', delay: '0.25s', emoji: '✨' },
  { tx: '-35px', ty: '5px', delay: '0.2s', emoji: '⚡' },
];

const RobotCharacter = ({
  pose = 'wave',
  message = '',
  size = 80,
  robotName = 'ロボットくん',
  enableTap = true,
  messagePosition = 'top',
  style = {},
}) => {
  const [isTapped, setIsTapped] = useState(false);

  const imageSrc = POSE_IMAGES[pose] || FALLBACK_IMAGE;
  const animation = isTapped
    ? 'robot-tap 0.5s ease-out'
    : (POSE_ANIMATIONS[pose] || POSE_ANIMATIONS.wave);

  const handleTap = useCallback(() => {
    if (!enableTap || isTapped) return;
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 500);
  }, [enableTap, isTapped]);

  const showSparkles = pose === 'sparkle' || pose === 'medal';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        ...style,
      }}
    >
      {/* 吹き出しメッセージ（上部配置） */}
      {message && messagePosition === 'top' && (
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: '8px 14px',
          fontSize: 13,
          fontWeight: 700,
          color: '#37474F',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: 200,
          textAlign: 'center',
          lineHeight: 1.5,
          position: 'relative',
          whiteSpace: 'pre-wrap',
          flexShrink: 0,
        }}>
          {message}
          <div style={{
            position: 'absolute',
            bottom: -7,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderTop: '7px solid white',
          }} />
        </div>
      )}

      {/* ロボちゃん本体 */}
      <div
        onClick={handleTap}
        style={{
          position: 'relative',
          width: size,
          height: size,
          cursor: enableTap ? 'pointer' : 'default',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        <img
          src={imageSrc}
          alt={robotName}
          style={{
            width: size,
            height: size,
            objectFit: 'contain',
            animation: animation,
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}
        />

        {/* きらきらパーティクル */}
        {showSparkles && (
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            {SPARKLE_PARTICLES.map((p, i) => (
              <span key={i} style={{
                position: 'absolute',
                top: '50%', left: '50%',
                fontSize: size * 0.2,
                animation: `robot-particle 1.5s ease-out infinite`,
                animationDelay: p.delay,
                '--tx': p.tx, '--ty': p.ty,
                opacity: 0,
              }}>
                {p.emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 吹き出しメッセージ（下部配置） */}
      {message && messagePosition === 'bottom' && (
        <div style={{
          background: 'white',
          borderRadius: 16,
          padding: '8px 14px',
          fontSize: 13,
          fontWeight: 700,
          color: '#37474F',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          maxWidth: 200,
          textAlign: 'center',
          lineHeight: 1.5,
          position: 'relative',
          whiteSpace: 'pre-wrap',
          flexShrink: 0,
        }}>
          <div style={{
            position: 'absolute',
            top: -7,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '7px solid transparent',
            borderRight: '7px solid transparent',
            borderBottom: '7px solid white',
          }} />
          {message}
        </div>
      )}

      {/* CSSアニメーション定義 */}
      <style>{`
        @keyframes robot-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes robot-bounce {
          0% { transform: scale(1); }
          30% { transform: scale(1.15); }
          60% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes robot-tap {
          0% { transform: scale(1); }
          20% { transform: scale(0.85); }
          40% { transform: scale(1.15); }
          60% { transform: scale(0.95); }
          80% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        @keyframes robot-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-5px); }
          40% { transform: translateX(5px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
        }
        @keyframes robot-tilt {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-8deg); }
          75% { transform: rotate(8deg); }
        }
        @keyframes robot-spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes robot-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes robot-dash {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        @keyframes robot-wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes robot-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        @keyframes robot-sparkle {
          0%, 100% { transform: scale(1); filter: brightness(1); }
          50% { transform: scale(1.05); filter: brightness(1.15); }
        }
        @keyframes robot-bow {
          0% { transform: rotate(0deg); }
          40% { transform: rotate(15deg); }
          70% { transform: rotate(15deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes robot-slideUp {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes robot-particle {
          0% { transform: translate(0, 0) scale(0); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translate(var(--tx), var(--ty)) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default RobotCharacter;
