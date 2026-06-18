// ============================================
// 🤖 RobotCharacter - ロボットくんコンポーネント
// まなびの木 v0.9.9
// 新規作成: 2026/06/18
// ============================================
// ポーズ: wave（通常・手振り）/ cheer（ガッツポーズ・正解時）
// タップでぽよん + CSSアニメーションで軽量に動かす
// ============================================

import React, { useState, useCallback } from 'react';

const ROBOT_IMAGES = {
  wave:  '/public/images/robot/robot_wave.png',
  cheer: '/public/images/robot/robot_cheer.png',
};

const ROBOT_ANIMATIONS = {
  wave:  'robot-float 2.5s ease-in-out infinite',
  cheer: 'robot-bounce 0.5s ease-out',
};

const RobotCharacter = ({ pose = 'wave', size = 80, robotName = 'ロボットくん' }) => {
  const [isTapped, setIsTapped] = useState(false);

  const imageSrc = ROBOT_IMAGES[pose] || ROBOT_IMAGES.wave;
  const animation = isTapped
    ? 'robot-tap 0.5s ease-out'
    : (ROBOT_ANIMATIONS[pose] || ROBOT_ANIMATIONS.wave);

  const handleTap = useCallback(() => {
    if (isTapped) return;
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 500);
  }, [isTapped]);

  return (
    <div
      onClick={handleTap}
      style={{ position: 'relative', width: size, height: size, cursor: 'pointer' }}
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
      `}</style>
    </div>
  );
};

export default RobotCharacter;
