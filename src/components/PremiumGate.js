// ============================================
// 🔒 PremiumGate - プレミアム機能ロック画面
// まなびの木 - Phase C
// v1.0.0: 新規作成（2026/06/19）
// v1.0.2: 課金ボタン追加（2026/06/25）
//   - 🌟アップグレードボタン追加（Stripe Payment Link）
//   - 全ロック画面から課金導線が開通
//   - user prop追加（client_reference_id用）
// ============================================
// 無料ユーザーが有料機能にアクセスした時に表示
// 子供を悲しませず、保護者に判断を委ねるUI
// → 保護者がその場で課金できるボタンも配置
// ============================================

import React from 'react';
import { COLORS } from '../constants/colors';

const PAYMENT_LINK = 'https://buy.stripe.com/14A4gz3lY3vl2QZ8pt6AM00';

const PremiumGate = ({ onBack, featureName, user }) => {
  const handleUpgrade = () => {
    const url = PAYMENT_LINK + (user?.id ? `?client_reference_id=${user.id}` : '');
    window.open(url, '_blank');
  };

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
        {/* 🌟 アップグレードボタン（保護者向け） */}
        <button onClick={handleUpgrade} style={styles.upgradeBtn}>
          🌟 プレミアムに アップグレード
        </button>
        <button onClick={onBack} style={styles.backBtn}>
          もどる
        </button>
      </div>

      {/* 料金案内 */}
      <div style={styles.priceNote}>
        月額200円（ジュース1ぽんぶん🧃）・いつでも かいやくOK
      </div>

      {/* プレミアムの特典リスト */}
      <div style={styles.benefitBox}>
        <div style={styles.benefitTitle}>プレミアムで できること</div>
        <div style={styles.benefitItem}>✅ ぜん教科の れんしゅうモード</div>
        <div style={styles.benefitItem}>✅ ふくしゅう（にがてを くりかえし）</div>
        <div style={styles.benefitItem}>✅ みまもり（がくしゅう きろく）</div>
        <div style={styles.benefitItem}>✅ レベルせってい</div>
        <div style={styles.benefitItem}>✅ げんそずかん</div>
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
    flexDirection: 'column',
    gap: 12,
    width: '100%',
    maxWidth: 300,
  },
  upgradeBtn: {
    padding: '14px 24px',
    borderRadius: 24,
    border: 'none',
    background: 'linear-gradient(135deg, #FF9800, #FF5722)',
    color: 'white',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 3px 8px rgba(255,87,34,0.3)',
    fontFamily: 'inherit',
  },
  backBtn: {
    padding: '12px 24px',
    borderRadius: 24,
    border: `2px solid ${COLORS.green}`,
    background: 'white',
    color: COLORS.green,
    fontSize: 15,
    fontWeight: 700,
    cursor: 'pointer',
    fontFamily: 'inherit',
  },
  priceNote: {
    marginTop: 20,
    fontSize: 13,
    color: COLORS.textLight,
    textAlign: 'center',
  },
  benefitBox: {
    marginTop: 16,
    background: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
    padding: '16px 20px',
    maxWidth: 300,
    width: '100%',
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  benefitItem: {
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 1.8,
  },
};

export default PremiumGate;
