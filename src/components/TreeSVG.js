// ============================================
// 🌳 TreeSVG - まなびの木ビジュアル
// props: leaves(成長葉の数), flowers(花0-5), fruits(実0-3)
// ★v1.0.5: BASE_LEAVES追加 - 木が常に緑に茂って見える
//   表示葉 = BASE_LEAVES + leaves（最大10枚）
//   内部カウンター(leaves)が0でも木は5枚の葉で青々と表示
// ============================================

import React from 'react';
import { COLORS } from '../constants/colors';

const BASE_LEAVES = 5; // 常に表示する基本の葉っぱ（木枯らし防止🌳）

const TreeSVG = ({ leaves = 0, flowers = 0, fruits = 0 }) => {
  const displayLeaves = Math.min(BASE_LEAVES + leaves, 10);
  const leafPositions = [
    { x: 150, y: 80, r: 35 },
    { x: 110, y: 110, r: 30 },
    { x: 190, y: 110, r: 30 },
    { x: 130, y: 60, r: 28 },
    { x: 170, y: 60, r: 28 },
    { x: 90, y: 90, r: 25 },
    { x: 210, y: 90, r: 25 },
    { x: 150, y: 45, r: 22 },
    { x: 120, y: 140, r: 22 },
    { x: 180, y: 140, r: 22 },
  ];

  const flowerPositions = [
    { x: 100, y: 75 },
    { x: 195, y: 70 },
    { x: 155, y: 40 },
    { x: 215, y: 105 },
    { x: 85, y: 120 },
  ];

  const fruitPositions = [
    { x: 120, y: 130 },
    { x: 180, y: 125 },
    { x: 145, y: 90 },
  ];

  return (
    <svg viewBox="0 0 300 280" style={{ width: '100%', maxWidth: 280 }}>
      <defs>
        <radialGradient id="skyGlow" cx="50%" cy="30%">
          <stop offset="0%" stopColor="#FFF9C4" stopOpacity="0.5" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id="leafGrad" cx="40%" cy="30%">
          <stop offset="0%" stopColor="#A5D6A7" />
          <stop offset="100%" stopColor="#66BB6A" />
        </radialGradient>
      </defs>

      {/* 太陽の光 */}
      <circle cx="150" cy="90" r="100" fill="url(#skyGlow)" />

      {/* 地面 */}
      <ellipse cx="150" cy="265" rx="120" ry="15" fill="#A5D6A7" opacity="0.4" />

      {/* 幹 */}
      <path
        d="M140 160 Q135 200 130 260 L170 260 Q165 200 160 160 Z"
        fill={COLORS.brown}
        stroke="#6D4C41"
        strokeWidth="1"
      />
      <path d="M145 180 Q148 200 144 230" stroke="#6D4C41" strokeWidth="0.5" fill="none" opacity="0.5" />
      <path d="M155 175 Q153 210 156 240" stroke="#6D4C41" strokeWidth="0.5" fill="none" opacity="0.5" />

      {/* 枝 */}
      <path d="M140 165 Q115 150 95 140" stroke={COLORS.brown} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M160 165 Q185 150 205 140" stroke={COLORS.brown} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M148 155 Q135 130 125 115" stroke={COLORS.brown} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M152 155 Q165 130 175 115" stroke={COLORS.brown} strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* 葉っぱ（★v1.0.5: BASE_LEAVES + 成長分を表示） */}
      {leafPositions.slice(0, displayLeaves).map((leaf, i) => (
        <circle
          key={`leaf-${i}`}
          cx={leaf.x}
          cy={leaf.y}
          r={leaf.r}
          fill="url(#leafGrad)"
          opacity="0.85"
        >
          <animate
            attributeName="r"
            values={`${leaf.r - 1};${leaf.r + 1};${leaf.r - 1}`}
            dur={`${3 + i * 0.3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* 花 */}
      {flowerPositions.slice(0, flowers).map((f, i) => (
        <g key={`flower-${i}`}>
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <circle
              key={angle}
              cx={f.x + Math.cos((angle * Math.PI) / 180) * 6}
              cy={f.y + Math.sin((angle * Math.PI) / 180) * 6}
              r="4"
              fill={i % 2 === 0 ? COLORS.pink : COLORS.orangeLight}
              opacity="0.9"
            />
          ))}
          <circle cx={f.x} cy={f.y} r="3.5" fill={COLORS.star} />
        </g>
      ))}

      {/* 実 */}
      {fruitPositions.slice(0, fruits).map((fr, i) => (
        <g key={`fruit-${i}`}>
          <circle cx={fr.x} cy={fr.y} r="8" fill="#EF5350" opacity="0.9" />
          <circle cx={fr.x - 2} cy={fr.y - 3} r="2" fill="white" opacity="0.4" />
        </g>
      ))}
    </svg>
  );
};

export default TreeSVG;
