// ============================================
// ⏰ ClockSVG - アナログ時計ビジュアル
// props: hour(0-12), minute(0-59)
// 時計の読み方学習用に大きくわかりやすく表示
// ============================================

import React from 'react';
import { COLORS } from '../constants/colors';

const ClockSVG = ({ hour = 3, minute = 0 }) => {
  const cx = 120;
  const cy = 120;
  const radius = 100;

  // 分針の角度（12時が0度、時計回り）
  const minuteAngle = (minute / 60) * 360 - 90;
  // 時針の角度（分も考慮）
  const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30 - 90;

  // 角度からx,y座標を計算
  const getPoint = (angle, length) => ({
    x: cx + length * Math.cos((angle * Math.PI) / 180),
    y: cy + length * Math.sin((angle * Math.PI) / 180),
  });

  const hourEnd = getPoint(hourAngle, 55);
  const minuteEnd = getPoint(minuteAngle, 78);

  // 文字盤の数字
  const numbers = [];
  for (let i = 1; i <= 12; i++) {
    const angle = (i / 12) * 360 - 90;
    const pos = getPoint(angle, 78);
    numbers.push({ num: i, x: pos.x, y: pos.y });
  }

  // 分の目盛り
  const ticks = [];
  for (let i = 0; i < 60; i++) {
    const angle = (i / 60) * 360 - 90;
    const isHour = i % 5 === 0;
    const outerR = radius - 4;
    const innerR = isHour ? radius - 14 : radius - 9;
    const start = getPoint(angle, innerR);
    const end = getPoint(angle, outerR);
    ticks.push({ start, end, isHour });
  }

  return (
    <svg viewBox="0 0 240 240" style={{ width: '100%', maxWidth: 200, margin: '0 auto', display: 'block' }}>
      {/* 時計の影 */}
      <circle cx={cx + 2} cy={cy + 2} r={radius + 6} fill="rgba(0,0,0,0.08)" />

      {/* 時計の外枠 */}
      <circle cx={cx} cy={cy} r={radius + 6} fill="#5D4037" />
      <circle cx={cx} cy={cy} r={radius + 2} fill="#795548" />

      {/* 文字盤 */}
      <circle cx={cx} cy={cy} r={radius} fill="white" />

      {/* 目盛り */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.start.x} y1={t.start.y}
          x2={t.end.x} y2={t.end.y}
          stroke={t.isHour ? '#4E342E' : '#BCAAA4'}
          strokeWidth={t.isHour ? 2.5 : 1}
          strokeLinecap="round"
        />
      ))}

      {/* 数字 */}
      {numbers.map((n) => (
        <text
          key={n.num}
          x={n.x}
          y={n.y}
          textAnchor="middle"
          dominantBaseline="central"
          style={{
            fontSize: n.num === 12 || n.num === 3 || n.num === 6 || n.num === 9 ? 18 : 15,
            fontWeight: 800,
            fontFamily: "'Rounded Mplus 1c', sans-serif",
            fill: n.num === 12 ? COLORS.incorrect : COLORS.text,
          }}
        >
          {n.num}
        </text>
      ))}

      {/* 時針（短い・太い・青） */}
      <line
        x1={cx} y1={cy}
        x2={hourEnd.x} y2={hourEnd.y}
        stroke={COLORS.blue}
        strokeWidth={6}
        strokeLinecap="round"
      />

      {/* 分針（長い・やや細い・オレンジ） */}
      <line
        x1={cx} y1={cy}
        x2={minuteEnd.x} y2={minuteEnd.y}
        stroke={COLORS.orange}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* 中心の丸 */}
      <circle cx={cx} cy={cy} r="6" fill={COLORS.text} />
      <circle cx={cx} cy={cy} r="3" fill="white" />

      {/* 針の色の凡例 */}
      <g transform="translate(10, 225)">
        <line x1="0" y1="0" x2="14" y2="0" stroke={COLORS.blue} strokeWidth="4" strokeLinecap="round" />
        <text x="18" y="1" style={{ fontSize: 10, fill: COLORS.textLight, fontFamily: "'Rounded Mplus 1c', sans-serif" }} dominantBaseline="central">
          じ
        </text>
        <line x1="38" y1="0" x2="52" y2="0" stroke={COLORS.orange} strokeWidth="3" strokeLinecap="round" />
        <text x="56" y="1" style={{ fontSize: 10, fill: COLORS.textLight, fontFamily: "'Rounded Mplus 1c', sans-serif" }} dominantBaseline="central">
          ふん
        </text>
      </g>
    </svg>
  );
};

export default ClockSVG;
