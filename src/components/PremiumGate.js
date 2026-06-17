// ============================================
// 🔒 PremiumGate - プレミアム機能ロック画面
// まなびの木 - Phase C
// v1.0.0: 新規作成（2026/06/19）
// ============================================
// 無料ユーザーが有料機能にアクセスした時に表示
// 子供を悲しませず、保護者に判断を委ねるUI
// ============================================

import React from 'react';
import { COLORS } from '../constants/colors';

const PremiumGate = ({ onBack, featureName }) => {
  return (
    <div style={styles.container}>
      {/* もどるボタン */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← もどる
        </button>
      </div>

      {/* ロックアイコン */}
      <div style={styles.lockIcon}>🔒</div>

      <div style={styles.title}>プレミアム きのう</div>

      <div style={styles.message}>
        <div style={styles.featureName}>{featureName || 'この きのう'}</div>
        <div style={{ marginTop: 12 }}>
          を つかうには
        </div>
        <div style={{ marginTop: 4 }}>
          おうちのひとに
        </div>
        <div style={{ marginTop: 4, fontSize: 17, fontWeight: 700 }}>
          そうだんしてね 🌳
        </div>
      </div>

      {/* アクションボタン */}
      <div style={styles.actions}>
        <button onClick={onBack} style={styles.backBtn}>
          もどる
        </button>
      </div>

      {/* 料金案内（小さく） */}
      <div style={styles.priceNote}>
        プレミアム: つき 200えん（ジュース1ぽんぶん🧃）
      </div>
    </div>
  );
};

// --- スタイル ---
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: `linear-gradient(180deg, ${COLORS.bg} 0%, #FFF3E0 100%)`,
    padding: 20,
    fontFamily: "'Rounded Mplus 1c', 'Kosugi Maru', sans-serif",
  },
  header: {
    position: 'absolute',
    top: 16,
    left: 16,
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: 16,
    color: COLORS.textLight,
    cursor: 'pointer',
    padding: '8px 12px',
  },
  lockIcon: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: COLORS.orange,
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 1.6,
    background: COLORS.white,
    borderRadius: 16,
    padding: '24px 32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    maxWidth: 300,
  },
  featureName: {
    fontSize: 18,
    fontWeight: 700,
    color: COLORS.greenDark,
  },
  actions: {
    marginTop: 24,
    display: 'flex',
    gap: 12,
  },
  backBtn: {
    padding: '12px 32px',
    borderRadius: 24,
    border: 'none',
    background: COLORS.green,
    color: 'white',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  priceNote: {
    marginTop: 32,
    fontSize: 12,
    color: COLORS.textLight,
  },
};

export default PremiumGate;
