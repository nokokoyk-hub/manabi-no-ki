// ============================================
// 💼 TokushohoScreen - 特定商取引法に基づく表記
// まなびの木 v0.9.9
// 新規作成: 2026/06/18
// ============================================
// ※ 保護者向けページのため通常の日本語表記
// ============================================

import React from 'react';

const TokushohoScreen = ({ onBack }) => {
  return (
    <div style={styles.container}>
      {/* ヘッダー */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← もどる
        </button>
        <h1 style={styles.headerTitle}>💼 特定商取引法に基づく表記</h1>
      </div>

      {/* 本文 */}
      <div style={styles.content}>
        <div style={styles.table}>
          <div style={styles.row}>
            <div style={styles.label}>販売事業者</div>
            <div style={styles.value}>NON WORKS</div>
          </div>
          <div style={styles.row}>
            <div style={styles.label}>運営責任者</div>
            <div style={styles.value}>請求があった場合は遅滞なく開示いたします</div>
          </div>
          <div style={styles.row}>
            <div style={styles.label}>所在地</div>
            <div style={styles.value}>
              〒150-0043<br />
              東京都渋谷区道玄坂1丁目10番8号<br />
              渋谷道玄坂東急ビル2F-C
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.label}>連絡先</div>
            <div style={styles.value}>
              メール: manabinokiinfo@gmail.com<br />
              <span style={{ fontSize: 12, color: '#999' }}>
                ※ お問い合わせはメールにてお願いいたします
              </span>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.label}>電話番号</div>
            <div style={styles.value}>請求があった場合は遅滞なく開示いたします</div>
          </div>
          <div style={styles.row}>
            <div style={styles.label}>販売価格</div>
            <div style={styles.value}>
              プレミアムプラン: 月額200円（税込）<br />
              <span style={{ fontSize: 12, color: '#999' }}>
                ※ 無料プラン（機能制限あり）もご利用いただけます
              </span>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.label}>支払方法</div>
            <div style={styles.value}>クレジットカード（Stripe経由）</div>
          </div>
          <div style={styles.row}>
            <div style={styles.label}>支払時期</div>
            <div style={styles.value}>プラン申込時に初回決済。以降毎月自動更新。</div>
          </div>
          <div style={styles.row}>
            <div style={styles.label}>サービス提供時期</div>
            <div style={styles.value}>決済完了後、直ちにご利用いただけます</div>
          </div>
          <div style={styles.row}>
            <div style={styles.label}>返品・キャンセル</div>
            <div style={styles.value}>
              デジタルコンテンツの性質上、お支払い後の返金はいたしかねます。<br />
              解約はいつでも可能です。解約後も当該決済期間の終了までサービスをご利用いただけます。
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.label}>動作環境</div>
            <div style={styles.value}>
              Chrome / Safari / Edge 等の主要ブラウザ<br />
              スマートフォン / タブレット / PC 対応<br />
              <span style={{ fontSize: 12, color: '#999' }}>
                ※ インターネット接続環境が必要です
              </span>
            </div>
          </div>
          <div style={styles.row}>
            <div style={styles.label}>特記事項</div>
            <div style={styles.value}>
              新規登録から5日間は無料トライアル（全機能開放）をご利用いただけます。トライアル終了後、自動課金は発生しません。
            </div>
          </div>
        </div>

        {/* 施行日 */}
        <p style={styles.effectiveDate}>
          制定日: 2026年6月18日
        </p>
      </div>
    </div>
  );
};

// ============================================
// スタイル定義
// ============================================
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #E3F2FD 0%, #F1F8E9 40%, #FFFFFF 100%)',
    fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
  },
  header: {
    position: 'sticky',
    top: 0,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(8px)',
    padding: '12px 16px',
    borderBottom: '1px solid #E0E0E0',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  backButton: {
    background: 'none',
    border: '1px solid #E0E0E0',
    borderRadius: 12,
    padding: '6px 14px',
    fontSize: 14,
    fontWeight: 600,
    color: '#666',
    cursor: 'pointer',
    fontFamily: "'Rounded Mplus 1c', sans-serif",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: '#2E7D32',
    margin: 0,
  },
  content: {
    padding: '20px 20px 60px',
    maxWidth: 640,
    margin: '0 auto',
  },
  table: {
    background: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  row: {
    display: 'flex',
    borderBottom: '1px solid #F0F0F0',
  },
  label: {
    width: 120,
    minWidth: 120,
    padding: '14px 14px',
    fontSize: 13,
    fontWeight: 700,
    color: '#2E7D32',
    background: '#F1F8E9',
    lineHeight: 1.6,
    flexShrink: 0,
  },
  value: {
    flex: 1,
    padding: '14px 14px',
    fontSize: 14,
    color: '#444',
    lineHeight: 1.7,
  },
  effectiveDate: {
    textAlign: 'center',
    fontSize: 13,
    color: '#999',
    marginTop: 24,
  },
};

export default TokushohoScreen;
