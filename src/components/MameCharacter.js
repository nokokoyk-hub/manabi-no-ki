// ============================================
// 🐕 MameCharacter - まめキャラクターコンポーネント
// ポーズ切替 + CSSアニメーション + 吹き出しメッセージ
// ============================================

import React from 'react';

// ポーズ → 画像ファイルのマッピング
const POSE_IMAGES = {
  normal: '/images/mame/mame_happy.png',     // 通常（バンザイ）
  run: '/images/mame/mame_run.png',           // 走る/ジャンプ
  happy: '/images/mame/mame_happy.png',       // 正解！バンザイ
  question: '/images/mame/mame_question.png', // 問題出題/不正解
  heart: '/images/mame/mame_heart.png',       // ミッション完了
  sleep: '/images/mame/mame_sleep.png',       // おやすみ
};

// ポーズ → アニメーション名のマッピング
const POSE_ANIMATIONS = {
  normal: 'mame-float 2s ease-in-out infinite',
  run: 'mame-bounce 0.6s ease-in-out infinite',
  happy: 'mame-jump 0.5s ease-out',
  question: 'mame-tilt 1.5s ease-in-out infinite',
  heart: 'mame-pulse 1s ease-in-out infinite',
  sleep: 'mame-breathe 3s ease-in-out infinite',
};

const MameCharacter = ({
  pose = 'normal',
  message = '',
  size = 100,
  style = {},
}) => {
  const imageSrc = POSE_IMAGES[pose] || POSE_IMAGES.normal;
  const animation = POSE_ANIMATIONS[pose] || POSE_ANIMATIONS.normal;

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
          {/* 吹き出しのしっぽ */}
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

      {/* まめ画像 */}
      <img
        src={imageSrc}
        alt="まめ"
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          animation,
          filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
        }}
      />
    </div>
  );
};

export default MameCharacter;
