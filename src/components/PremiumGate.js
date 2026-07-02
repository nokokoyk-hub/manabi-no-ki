// ============================================
// 🔒 PremiumGate - プレミアム機能ロック画面
// まなびの木 - Phase C
// v1.0.0: 新規作成（2026/06/19）
// v1.0.2: 課金ボタン追加（2026/06/25）
// v1.0.3: 月額/年間プラン選択追加（2026/06/28）
// v1.0.6: TWA判定で課金導線出し分け（2026/07/02）
//         Google Play課金ポリシー対応。TWA時はStripeボタン非表示、
//         ウェブサイト案内文言（リンクなし）のみ表示
// ============================================

import React from 'react';
import { COLORS } from '../constants/colors';
import { isTwa } from '../lib/twaDetect';

const PAYMENT_LINK_MONTHLY = 'https://buy.stripe.com/14A4gz3lY3vl2QZ8pt6AM00';
const PAYMENT_LINK_YEARLY  = 'https://buy.stripe.com/8x214n2hUaXNezHfRV6AM01';

const PremiumGate = ({ onBack, featureName, user, onLogout }) => {
  const openPayment = (url) => {
    const fullUrl = url + (user?.id ? `?client_reference_id=${user.id}` : '');
    window.open(fullUrl, '_blank');
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

      {/* 🌟 プラン選択（月額/年間）: TWA時は非表示・案内文言のみ（Google Play課金ポリシー対応） */}
      {isTwa() ? (
        <div style={styles.twaNotice}>
          <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.greenDark, marginBottom: 8 }}>
            🌐 ごけいやくについて
          </div>
          <div style={{ fontSize: 13, color: COLORS.text, lineHeight: 1.8 }}>
            アプリからは ごけいやくできません。<br />
            ブラウザで <span style={{ fontWeight: 700 }}>manabinoki.net</span> をひらいて、<br />
            おうちのひとと おてつづきしてね。
          </div>
        </div>
      ) : (
        <div style={styles.planCards}>
          {/* 月額プラン */}
          <button onClick={() => openPayment(PAYMENT_LINK_MONTHLY)} style={styles.planCard}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#FF9800' }}>月額プラン</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#333', marginTop: 4 }}>200<span style={{ fontSize: 13 }}>円/月</span></div>
            <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>いつでも かいやくOK</div>
          </button>

          {/* 年間プラン（おトク！） */}
          <button onClick={() => openPayment(PAYMENT_LINK_YEARLY)} style={{ ...styles.planCard, ...styles.planCardYearly }}>
            <div style={styles.otokuBadge}>🉐 おトク！</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#FF5722' }}>年間プラン</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#333', marginTop: 4 }}>2,100<span style={{ fontSize: 13 }}>円/年</span></div>
            <div style={{ fontSize: 11, color: '#FF5722', fontWeight: 700, marginTop: 4 }}>1.5ヶ月ぶん おトク！🧃</div>
          </button>
        </div>
      )}

      {/* もどるボタン */}
      <div style={{ marginTop: 16, width: '100%', maxWidth: 300 }}>
        <button onClick={onBack} style={styles.backBtn}>
          もどる
        </button>
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

      {/* 🔓 ログアウト（みまもりPremiumGate限定・v1.0.2）*/}
      {onLogout && (
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={onLogout}
            style={{
              background: 'none', border: '1px solid #E57373',
              borderRadius: 20, padding: '10px 28px',
              fontSize: 13, color: '#E57373',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            🔓 ログアウト
          </button>
          <div style={{ fontSize: 11, color: '#BDBDBD', marginTop: 6 }}>
            べつの アカウントに きりかえられます
          </div>
        </div>
      )}
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
  planCards: {
    marginTop: 24,
    display: 'flex',
    gap: 10,
    width: '100%',
    maxWidth: 300,
  },
  twaNotice: {
    marginTop: 24,
    background: 'white',
    borderRadius: 16,
    padding: '20px 24px',
    maxWidth: 300,
    width: '100%',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    border: '2px solid #C8E6C9',
  },
  planCard: {
    flex: 1,
    padding: '16px 8px',
    borderRadius: 16,
    border: '2px solid #FFE0B2',
    background: 'white',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textAlign: 'center',
    position: 'relative',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  planCardYearly: {
    border: '2px solid #FF5722',
    background: 'linear-gradient(180deg, #FFF3E0, #FFECB3)',
    boxShadow: '0 3px 12px rgba(255,87,34,0.2)',
  },
  otokuBadge: {
    position: 'absolute',
    top: -10,
    right: -6,
    background: 'linear-gradient(135deg, #FF5722, #FF9800)',
    color: 'white',
    fontSize: 10,
    fontWeight: 900,
    padding: '3px 8px',
    borderRadius: 10,
    boxShadow: '0 2px 6px rgba(255,87,34,0.4)',
  },
  backBtn: {
    width: '100%',
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
