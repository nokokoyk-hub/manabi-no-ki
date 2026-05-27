// ============================================
// 🌟 StarBurst - 正解時の演出オーバーレイ
// props: show(表示フラグ)
// ============================================

import React from 'react';
import { COLORS } from '../constants/colors';

const StarBurst = ({ show }) => {
  if (!show) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.3)',
      zIndex: 100,
      animation: 'fadeIn 0.3s ease',
    }}>
      <div style={{
        background: 'white', borderRadius: 24, padding: '32px 40px',
        textAlign: 'center', animation: 'popIn 0.4s ease',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
      }}>
        <div style={{ fontSize: 64, marginBottom: 8 }}>🌟</div>
        <div style={{
          fontSize: 28, fontWeight: 800, color: COLORS.orange,
          fontFamily: "'Rounded Mplus 1c', sans-serif",
        }}>
          すごい！せいかい！
        </div>
        <div style={{
          fontSize: 16, color: COLORS.textLight, marginTop: 8,
          fontFamily: "'Rounded Mplus 1c', sans-serif",
        }}>
          きの はっぱが ふえたよ 🌿
        </div>
      </div>
    </div>
  );
};

export default StarBurst;
