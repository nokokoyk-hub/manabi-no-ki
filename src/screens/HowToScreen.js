// ============================================
// 📱 HowToScreen - つかいかたガイド
// まなびの木 v1.0.2
// 新規作成: 2026/06/25
// ============================================
// ※ 保護者向けページのため通常の日本語表記
// ※ 認証前からアクセス可能（TermsScreenと同じ方式）
// ============================================

import React from 'react';

const HowToScreen = ({ onBack }) => {
  return (
    <div style={styles.container}>
      {/* ヘッダー */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← もどる
        </button>
        <h1 style={styles.headerTitle}>📱 つかいかたガイド</h1>
      </div>

      {/* 本文 */}
      <div style={styles.content}>

        {/* イントロ */}
        <div style={styles.introBox}>
          <p style={styles.introEmoji}>🌳</p>
          <h2 style={styles.introTitle}>まなびの木へようこそ！</h2>
          <p style={styles.introText}>
            まなびの木は、お子さまが楽しく学べるウェブアプリです。
            スマートフォンのホーム画面に追加すると、
            アプリのようにワンタップで起動できます。
          </p>
          <p style={styles.introNote}>
            📖 以下の手順で、かんたんに始められます
          </p>
        </div>

        {/* ===== STEP 1 ===== */}
        <div style={styles.stepCard}>
          <div style={styles.stepBadge}>STEP 1</div>
          <h3 style={styles.stepTitle}>🔍 manabinoki.net にアクセス</h3>
          <div style={styles.stepBody}>
            <p>
              スマートフォンのブラウザ（Safari または Chrome）で
              以下のURLにアクセスしてください。
            </p>
            <div style={styles.urlBox}>
              <span style={styles.urlText}>https://manabinoki.net</span>
            </div>
            <div style={styles.tipBox}>
              <p style={styles.tipTitle}>💡 ポイント</p>
              <p style={styles.tipText}>
                Yahoo検索やGoogleで「まなびの木」と検索してもOKです。
                LINEやInstagramなどアプリ内のブラウザでは正しく動作しないことがあるため、
                <strong>SafariまたはChromeで直接アクセス</strong>してください。
              </p>
            </div>
          </div>
        </div>

        {/* ===== STEP 2 ===== */}
        <div style={styles.stepCard}>
          <div style={styles.stepBadge}>STEP 2</div>
          <h3 style={styles.stepTitle}>👤 アカウントをつくる</h3>
          <div style={styles.stepBody}>
            <p>
              ログイン画面が表示されたら、
              お好きな方法でアカウントを作成してください。
            </p>

            <div style={styles.methodCard}>
              <p style={styles.methodBadge}>⭐ おすすめ</p>
              <h4 style={styles.methodTitle}>Googleアカウントでログイン</h4>
              <p style={styles.methodText}>
                「Google で ログイン」ボタンをタップするだけ！
                パスワードの入力も不要で、いちばんかんたんです。
              </p>
            </div>

            <div style={styles.methodCard2}>
              <h4 style={styles.methodTitle}>メールアドレスでログイン</h4>
              <p style={styles.methodText}>
                メールアドレスを入力すると、8桁の確認コードが届きます。
                届いたコードを入力するだけでログインできます。
                パスワードは不要です。
              </p>
            </div>

            <div style={styles.tipBox}>
              <p style={styles.tipTitle}>💡 ポイント</p>
              <p style={styles.tipText}>
                はじめてログインするだけで自動的にアカウントが作成されます。
                別途ユーザー登録する必要はありません。
              </p>
            </div>
          </div>
        </div>

        {/* ===== STEP 3 ===== */}
        <div style={styles.stepCard}>
          <div style={{...styles.stepBadge, background: '#E65100'}}>STEP 3</div>
          <h3 style={styles.stepTitle}>📲 ホーム画面にアプリを追加する</h3>
          <p style={styles.stepImportant}>
            ⬇️ これが一番大事なステップです！
          </p>
          <div style={styles.stepBody}>
            <p>
              ホーム画面に追加すると、アプリストアからダウンロードしたアプリのように
              アイコンをタップするだけで起動できるようになります。
            </p>

            {/* iPhone */}
            <div style={styles.deviceSection}>
              <h4 style={styles.deviceTitle}>🍎 iPhone（Safari）の場合</h4>
              <div style={styles.stepsInner}>
                <div style={styles.miniStep}>
                  <span style={styles.miniStepNum}>①</span>
                  <p>画面下部の <strong>共有ボタン</strong>（□に↑のアイコン）をタップ</p>
                </div>
                <div style={styles.miniStep}>
                  <span style={styles.miniStepNum}>②</span>
                  <p>メニューを下にスクロールして <strong>「ホーム画面に追加」</strong> をタップ</p>
                </div>
                <div style={styles.miniStep}>
                  <span style={styles.miniStepNum}>③</span>
                  <p>右上の <strong>「追加」</strong> をタップ</p>
                </div>
              </div>
              <div style={styles.cautionBox}>
                <p style={styles.cautionText}>
                  ⚠️ <strong>Safariでのみ</strong>追加できます。
                  Chrome等の他のブラウザでは「ホーム画面に追加」が表示されません。
                </p>
              </div>
            </div>

            {/* Android */}
            <div style={styles.deviceSection}>
              <h4 style={styles.deviceTitle}>🤖 Android（Chrome）の場合</h4>
              <div style={styles.stepsInner}>
                <div style={styles.miniStep}>
                  <span style={styles.miniStepNum}>①</span>
                  <p>画面上部に表示される <strong>「ホーム画面に追加」バナー</strong> をタップ</p>
                </div>
                <div style={styles.miniStep}>
                  <span style={styles.miniStepNum}>②</span>
                  <p>バナーが出ない場合は、右上の <strong>︙（メニュー）</strong> →  <strong>「ホーム画面に追加」</strong></p>
                </div>
                <div style={styles.miniStep}>
                  <span style={styles.miniStepNum}>③</span>
                  <p><strong>「追加」または「インストール」</strong> をタップ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ===== STEP 4 ===== */}
        <div style={styles.stepCard}>
          <div style={{...styles.stepBadge, background: '#2E7D32'}}>STEP 4</div>
          <h3 style={styles.stepTitle}>🎉 アプリを起動しよう！</h3>
          <div style={styles.stepBody}>
            <p>
              ホーム画面にロボットくんのアイコンが追加されます。
              タップするとまなびの木がアプリとして起動します！
            </p>
            <div style={styles.completeBox}>
              <p style={styles.completeEmoji}>🌳🤖✨</p>
              <p style={styles.completeText}>
                これで準備完了！<br />
                お子さまと一緒に、まなびの木で楽しく学びましょう。
              </p>
            </div>
          </div>
        </div>

        {/* ===== 料金プラン ===== */}
        <h2 style={styles.sectionTitle}>💰 料金プランについて</h2>
        <div style={styles.sectionBody}>
          <div style={styles.planTable}>
            <div style={styles.planRow}>
              <div style={styles.planHeader}>プラン</div>
              <div style={styles.planHeader}>料金</div>
              <div style={styles.planHeader}>内容</div>
            </div>
            <div style={styles.planRow}>
              <div style={styles.planCell}><strong>トライアル</strong></div>
              <div style={styles.planCell}>無料（5日間）</div>
              <div style={styles.planCell}>全機能が使えます</div>
            </div>
            <div style={styles.planRow}>
              <div style={styles.planCell}>無料プラン</div>
              <div style={styles.planCell}>0円</div>
              <div style={styles.planCell}>ミッション1日1回</div>
            </div>
            <div style={styles.planRow}>
              <div style={{...styles.planCell, color: '#E65100', fontWeight: 700}}>プレミアム</div>
              <div style={styles.planCell}><strong>月額200円</strong></div>
              <div style={styles.planCell}>全機能フル開放</div>
            </div>
          </div>
          <p style={styles.planNote}>
            ※ トライアル期間終了後は自動的に無料プランに移行します。自動課金はされません。<br />
            ※ プレミアムへのアップグレードは、アプリ内「みまもり」画面（保護者用）から行えます。
          </p>
        </div>

        {/* ===== よくある質問 ===== */}
        <h2 style={styles.sectionTitle}>❓ よくある質問</h2>
        <div style={styles.sectionBody}>
          <div style={styles.faqItem}>
            <p style={styles.faqQ}>Q. ログインできません</p>
            <p style={styles.faqA}>
              LINEやInstagram等のアプリ内ブラウザではGoogleログインが使えないことがあります。
              SafariまたはChromeで直接 manabinoki.net にアクセスしてお試しください。
              Googleログインが使えない場合は「メールでログイン」をお試しください。
            </p>
          </div>
          <div style={styles.faqItem}>
            <p style={styles.faqQ}>Q. ホーム画面に追加できません</p>
            <p style={styles.faqA}>
              iPhoneの場合はSafariで開いてください（Chromeでは追加できません）。
              Androidの場合はChromeで開いてください。
            </p>
          </div>
          <div style={styles.faqItem}>
            <p style={styles.faqQ}>Q. 別のスマホやタブレットでも使えますか？</p>
            <p style={styles.faqA}>
              はい！同じアカウントでログインすれば、学習データは自動的に同期されます。
              家ではタブレット、外出先ではスマホ、といった使い分けも可能です。
            </p>
          </div>
          <div style={styles.faqItem}>
            <p style={styles.faqQ}>Q. 解約はできますか？</p>
            <p style={styles.faqA}>
              「みまもり」画面（保護者用）から、いつでも解約できます。
              解約後もお支払い済みの期間中はご利用いただけます。
            </p>
          </div>
        </div>

        {/* お問い合わせ */}
        <div style={styles.contactBox}>
          <h3 style={styles.contactTitle}>お問い合わせ</h3>
          <p style={styles.contactText}>NON WORKS</p>
          <p style={styles.contactText}>メール: manabinokiinfo@gmail.com</p>
        </div>
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
    background: '#FFFFFF',
    fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
  },
  header: {
    position: 'sticky',
    top: 0,
    background: '#FFFFFF',
    borderBottom: '1px solid #E0E0E0',
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    zIndex: 10,
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: 16,
    color: '#43A047',
    cursor: 'pointer',
    fontWeight: 600,
    fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    padding: '4px 8px',
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

  // --- イントロ ---
  introBox: {
    background: 'linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)',
    borderRadius: 20,
    padding: '28px 24px',
    textAlign: 'center',
    marginBottom: 28,
    border: '1px solid #C8E6C9',
  },
  introEmoji: {
    fontSize: 48,
    margin: '0 0 8px 0',
  },
  introTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: '#2E7D32',
    margin: '0 0 12px 0',
  },
  introText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 1.8,
    margin: '0 0 12px 0',
  },
  introNote: {
    fontSize: 14,
    color: '#666',
    margin: 0,
    fontWeight: 600,
  },

  // --- ステップカード ---
  stepCard: {
    background: '#FAFAFA',
    borderRadius: 16,
    padding: '20px 20px 24px',
    marginBottom: 20,
    border: '1px solid #E8E8E8',
  },
  stepBadge: {
    display: 'inline-block',
    background: '#43A047',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 800,
    padding: '4px 12px',
    borderRadius: 20,
    marginBottom: 8,
    letterSpacing: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: '#333',
    margin: '0 0 4px 0',
  },
  stepImportant: {
    fontSize: 14,
    fontWeight: 700,
    color: '#E65100',
    margin: '4px 0 8px 0',
  },
  stepBody: {
    fontSize: 14,
    color: '#555',
    lineHeight: 1.8,
  },

  // --- URLボックス ---
  urlBox: {
    background: '#FFFFFF',
    border: '2px solid #43A047',
    borderRadius: 12,
    padding: '12px 16px',
    textAlign: 'center',
    margin: '12px 0',
  },
  urlText: {
    fontSize: 16,
    fontWeight: 800,
    color: '#2E7D32',
    fontFamily: "'Courier New', monospace",
    letterSpacing: 1,
  },

  // --- ヒント ---
  tipBox: {
    background: '#FFF8E1',
    borderRadius: 12,
    padding: '12px 16px',
    marginTop: 12,
    border: '1px solid #FFE082',
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: '#F57F17',
    margin: '0 0 4px 0',
  },
  tipText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 1.7,
    margin: 0,
  },

  // --- ログイン方法 ---
  methodCard: {
    background: '#E8F5E9',
    borderRadius: 12,
    padding: '14px 16px',
    margin: '12px 0 8px',
    border: '1px solid #A5D6A7',
  },
  methodCard2: {
    background: '#FFFFFF',
    borderRadius: 12,
    padding: '14px 16px',
    margin: '8px 0 12px',
    border: '1px solid #E0E0E0',
  },
  methodBadge: {
    fontSize: 12,
    fontWeight: 700,
    color: '#F57F17',
    margin: '0 0 4px 0',
  },
  methodTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#333',
    margin: '0 0 6px 0',
  },
  methodText: {
    fontSize: 13,
    color: '#555',
    lineHeight: 1.7,
    margin: 0,
  },

  // --- デバイス別手順 ---
  deviceSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTop: '1px solid #E0E0E0',
  },
  deviceTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#333',
    margin: '0 0 12px 0',
  },
  stepsInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  miniStep: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
  },
  miniStepNum: {
    flexShrink: 0,
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: '#43A047',
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cautionBox: {
    background: '#FFF3E0',
    borderRadius: 10,
    padding: '10px 14px',
    marginTop: 12,
    border: '1px solid #FFB74D',
  },
  cautionText: {
    fontSize: 13,
    color: '#E65100',
    lineHeight: 1.6,
    margin: 0,
  },

  // --- 完了ボックス ---
  completeBox: {
    background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
    borderRadius: 16,
    padding: '24px 20px',
    textAlign: 'center',
    marginTop: 16,
  },
  completeEmoji: {
    fontSize: 36,
    margin: '0 0 8px 0',
  },
  completeText: {
    fontSize: 15,
    fontWeight: 700,
    color: '#2E7D32',
    lineHeight: 1.8,
    margin: 0,
  },

  // --- セクション（料金・FAQ）---
  sectionTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: '#2E7D32',
    marginTop: 32,
    marginBottom: 12,
    paddingBottom: 6,
    borderBottom: '2px solid #C8E6C9',
  },
  sectionBody: {
    fontSize: 14,
    color: '#444',
    lineHeight: 1.8,
  },

  // --- 料金テーブル ---
  planTable: {
    borderRadius: 12,
    overflow: 'hidden',
    border: '1px solid #E0E0E0',
    marginBottom: 12,
  },
  planRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1.5fr',
    borderBottom: '1px solid #E0E0E0',
  },
  planHeader: {
    background: '#E8F5E9',
    padding: '10px 12px',
    fontSize: 13,
    fontWeight: 700,
    color: '#2E7D32',
    textAlign: 'center',
  },
  planCell: {
    padding: '10px 12px',
    fontSize: 13,
    color: '#444',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  planNote: {
    fontSize: 12,
    color: '#999',
    lineHeight: 1.7,
  },

  // --- FAQ ---
  faqItem: {
    background: '#FAFAFA',
    borderRadius: 12,
    padding: '14px 16px',
    marginBottom: 10,
    border: '1px solid #E8E8E8',
  },
  faqQ: {
    fontSize: 14,
    fontWeight: 700,
    color: '#333',
    margin: '0 0 6px 0',
  },
  faqA: {
    fontSize: 13,
    color: '#666',
    lineHeight: 1.7,
    margin: 0,
  },

  // --- お問い合わせ ---
  contactBox: {
    background: '#E8F5E9',
    borderRadius: 16,
    padding: '16px 20px',
    marginTop: 32,
    textAlign: 'center',
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#2E7D32',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#555',
    margin: '4px 0',
  },
};

export default HowToScreen;
