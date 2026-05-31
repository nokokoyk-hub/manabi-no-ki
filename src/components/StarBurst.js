// ============================================
// 🌟 StarBurst - 正解時の軽量トースト演出
// props: show(表示フラグ)
// v0.6.2: まめの吹き出しを隠さないよう上部トースト化
// ============================================

import React from 'react';
import { COLORS } from '../constants/colors';

const StarBurst = ({ show }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', top: 72, left: 0, right: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 80,
      pointerEvents: 'none',
      animation: 'fadeIn 0.2s ease',
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.96)',
        borderRadius: 999,
        padding: '10px 18px',
        textAlign: 'center',
        animation: 'popIn 0.35s ease',
        boxShadow: '0 8px 24px rgba(255, 152, 0, 0.22)',
        border: `2px solid ${COLORS.star}`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span style={{ fontSize: 24, lineHeight: 1 }}>🌟</span>
        <span style={{
          fontSize: 18, fontWeight: 800, color: COLORS.orange,
          fontFamily: "'Rounded Mplus 1c', sans-serif",
          whiteSpace: 'nowrap',
        }}>
          せいかい！
        </span>
        <span style={{ fontSize: 20, lineHeight: 1 }}>🌿</span>
      </div>
    </div>
  );
};

export default StarBurst;
