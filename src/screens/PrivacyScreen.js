// ============================================
// 🔒 PrivacyScreen - プライバシーポリシー
// まなびの木 v0.9.9
// 新規作成: 2026/06/18
// ============================================
// ※ 保護者向けページのため通常の日本語表記
// ※ 子ども向けアプリのため、児童の個人情報保護に配慮
// ============================================

import React from 'react';

const PrivacyScreen = ({ onBack }) => {
  return (
    <div className="mn-page mn-legal" style={styles.container}>
      {/* ヘッダー */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← もどる
        </button>
        <h1 style={styles.headerTitle}>🔒 プライバシーポリシー</h1>
      </div>

      {/* 本文 */}
      <div style={styles.content}>
        <p style={styles.intro}>
          NON WORKS（以下「当方」）は、学習アプリ「まなびの木」（以下「本サービス」）におけるユーザーの個人情報の取り扱いについて、以下のとおりプライバシーポリシーを定めます。本サービスは主にお子さまにご利用いただくものであり、個人情報の保護には特に配慮しております。
        </p>

        {/* 第1条 */}
        <h2 style={styles.sectionTitle}>1. 収集する情報</h2>
        <div style={styles.sectionBody}>
          <p>本サービスでは、以下の情報を取得する場合があります。</p>
          <h3 style={styles.subTitle}>（1）アカウント情報</h3>
          <ul style={styles.list}>
            <li>メールアドレス（Googleアカウント連携またはメールログイン時）</li>
            <li>表示名（Googleアカウントから取得される場合）</li>
            <li>認証サービスが発行するユーザー識別子</li>
          </ul>
          <h3 style={styles.subTitle}>（2）学習データ</h3>
          <ul style={styles.list}>
            <li>学習の進捗状況（正答率、学習日数、連続日数など）</li>
            <li>回答履歴（教科・レベル別の正誤記録）</li>
            <li>アプリ内の設定・育成情報（レベル設定、表示モード、キャラクターの呼び名、着せ替え、パズル、コレクション等）</li>
          </ul>
          <h3 style={styles.subTitle}>（3）アクセス情報</h3>
          <ul style={styles.list}>
            <li>アクセス日時、利用ブラウザ、OS情報</li>
            <li>Cookieおよび類似の技術による識別情報</li>
            <li>閲覧したページや操作等の利用状況</li>
          </ul>
          <h3 style={styles.subTitle}>（4）決済情報</h3>
          <ul style={styles.list}>
            <li>有料プランをご利用の場合、決済処理はStripe社が行います。クレジットカード番号等の決済情報は当方のサーバーには保存されません。</li>
            <li>有料機能の提供・契約管理のため、契約プラン、契約期間、契約状態、決済サービスが発行する顧客等の識別子を取り扱います。</li>
          </ul>
        </div>

        {/* 第2条 */}
        <h2 style={styles.sectionTitle}>2. 利用目的</h2>
        <div style={styles.sectionBody}>
          <p>取得した情報は、以下の目的で利用します。</p>
          <ul style={styles.list}>
            <li>本サービスの提供・運営・改善</li>
            <li>ユーザー認証およびアカウント管理</li>
            <li>学習進捗の記録・分析</li>
            <li>有料プランの決済処理</li>
            <li>お問い合わせへの対応</li>
            <li>サービスの利用状況の分析（アクセス解析）</li>
          </ul>
        </div>

        {/* 第3条 */}
        <h2 style={styles.sectionTitle}>3. 第三者サービスの利用</h2>
        <div style={styles.sectionBody}>
          <p>本サービスでは、以下の第三者サービスを利用しています。各サービスにおける個人情報の取り扱いについては、それぞれのプライバシーポリシーをご確認ください。</p>

          <div style={styles.serviceBox}>
            <p style={styles.serviceName}>Supabase（認証・データベース）</p>
            <p style={styles.serviceDesc}>アカウント認証および学習データの保管に利用しています。</p>
            <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabaseのプライバシーポリシー（別タブ）</a>
          </div>
          <div style={styles.serviceBox}>
            <p style={styles.serviceName}>Google（ログイン）</p>
            <p style={styles.serviceDesc}>Googleアカウントでログインする場合に利用します。認証に必要なメールアドレス、表示名等の情報を受け取ります。</p>
            <a href="https://policies.google.com/privacy?hl=ja" target="_blank" rel="noopener noreferrer">Googleのプライバシーポリシー（別タブ）</a>
          </div>
          <div style={styles.serviceBox}>
            <p style={styles.serviceName}>Google Analytics 4（アクセス解析）</p>
            <p style={styles.serviceDesc}>サービスの利用状況を把握するため、Cookie等の識別子、ページ閲覧や操作、端末・ブラウザ等に関する情報を用いてアクセス解析を行います。これらは、氏名やメールアドレスの入力を伴わない場合でも、利用状況に関するデータです。</p>
            <a href="https://support.google.com/analytics/answer/6004245?hl=ja" target="_blank" rel="noopener noreferrer">Google Analyticsのデータ保護について（別タブ）</a>
          </div>
          <div style={styles.serviceBox}>
            <p style={styles.serviceName}>Stripe（決済処理）</p>
            <p style={styles.serviceDesc}>有料プランの決済処理・契約管理に利用しています。カード番号等の支払情報はStripe社が管理し、当方は保持しません。当方は有料機能の提供に必要な契約情報や識別子を取り扱います。</p>
            <a href="https://stripe.com/jp/privacy" target="_blank" rel="noopener noreferrer">Stripeのプライバシーポリシー（別タブ）</a>
          </div>
          <div style={styles.serviceBox}>
            <p style={styles.serviceName}>Vercel（ホスティング）</p>
            <p style={styles.serviceDesc}>本サービスのWebアプリケーションの配信に利用しています。</p>
            <a href="https://vercel.com/legal/privacy-notice" target="_blank" rel="noopener noreferrer">Vercelのプライバシーポリシー（別タブ）</a>
          </div>
          <div style={styles.serviceBox}>
            <p style={styles.serviceName}>Resend（メール送信）</p>
            <p style={styles.serviceDesc}>メールログイン用の8桁の確認コードを含む認証メールの送信に利用しています。</p>
            <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Resendのプライバシーポリシー（別タブ）</a>
          </div>
        </div>

        {/* 第4条 */}
        <h2 style={styles.sectionTitle}>4. お子さまの個人情報について</h2>
        <div style={styles.sectionBody}>
          <div style={styles.importantBox}>
            <p>本サービスは小学生のお子さまを主な利用者として想定しています。お子さまの個人情報の保護は最も重要な事項と考えており、以下の方針を遵守します。</p>
            <ul style={styles.list}>
              <li>アカウント登録・管理は保護者の方が行い、保護者の方のメールアドレス等をご利用ください</li>
              <li>お子さまの利用に伴い、回答履歴や学習の進捗、設定・育成情報等を取得・保存します。これらは、アカウントや端末の識別子と関連付けて取り扱う場合があります</li>
              <li>キャラクターの呼び名には、お子さまの本名、連絡先等の個人情報を入力しないでください</li>
              <li>個人情報の取扱いについて法令上本人の同意が必要であり、お子さまがその内容を判断することが難しい場合は、保護者の方の同意が必要です</li>
              <li>学習データはサービスの提供・改善の目的にのみ使用します</li>
              <li>お子さまの個人情報を広告目的で利用することはありません</li>
              <li>お子さまの個人情報を第三者に販売することはありません</li>
            </ul>
          </div>
        </div>

        {/* 第5条 */}
        <h2 style={styles.sectionTitle}>5. 情報の管理・保護</h2>
        <div style={styles.sectionBody}>
          <p>当方は、取得した個人情報の漏洩、滅失またはき損の防止その他の安全管理のために、合理的な技術的・組織的措置を講じます。</p>
          <p>アカウント情報や学習データの保管にはSupabaseを利用しています。また、認証状態や一部の設定・育成情報等は、ご利用のブラウザ内にも保存されます。各外部サービスによる情報の取扱いについては、前記「第三者サービスの利用」をご確認ください。</p>
        </div>

        {/* 第6条 */}
        <h2 style={styles.sectionTitle}>6. Cookie・ブラウザ内保存の使用</h2>
        <div style={styles.sectionBody}>
          <p>本サービスでは、認証状態の維持や設定・育成情報等の保持のため、ブラウザ内の保存領域（localStorage・sessionStorage）を利用しています。また、Google Analytics 4によるアクセス解析ではCookie等を利用します。</p>
          <p>Cookieやブラウザ内の保存データは、ブラウザの設定から削除・制限できます。ただし、ログイン状態や端末内の設定等が失われたり、一部の機能が利用できなくなったりする場合があります。ブラウザ内のデータを削除しても、サーバーに保存されたアカウントや学習データは削除されません。</p>
        </div>

        {/* 第7条 */}
        <h2 style={styles.sectionTitle}>7. 開示・訂正・削除の請求</h2>
        <div style={styles.sectionBody}>
          <p>ユーザー（保護者の方）は、当方に対して個人情報の開示・訂正・削除を請求することができます。ご希望の場合は、下記のお問い合わせ先までご連絡ください。</p>
          <p>ご本人または保護者の方であることを確認の上、適用法令に従って対応し、対応内容をご案内します。有料プランの解約は、データ削除とは別に、利用規約第4条に記載する方法でお手続きください。</p>
        </div>

        {/* 第8条 */}
        <h2 style={styles.sectionTitle}>8. ポリシーの変更</h2>
        <div style={styles.sectionBody}>
          <p>当方は、適用法令に従い、本プライバシーポリシーを変更することがあります。重要な変更がある場合は、変更内容と適用開始日を、本サービス上への掲載その他の適切な方法で事前にお知らせします。法令上同意が必要な変更については、必要な同意を得ます。</p>
        </div>

        {/* お問い合わせ */}
        <div style={styles.contactBox}>
          <h3 style={styles.contactTitle}>お問い合わせ</h3>
          <p style={styles.contactText}>NON WORKS</p>
          <p style={styles.contactText}>メール: manabinokiinfo@gmail.com</p>
        </div>

        {/* 施行日 */}
        <p style={styles.effectiveDate}>
          制定日: 2026年6月18日<br />
          改定案作成日: 2026年9月8日（未公開）
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
  intro: {
    fontSize: 14,
    color: '#555',
    lineHeight: 1.8,
    marginBottom: 24,
    background: '#F5F5F5',
    borderRadius: 12,
    padding: '14px 16px',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: '#2E7D32',
    marginTop: 28,
    marginBottom: 8,
    paddingBottom: 6,
    borderBottom: '2px solid #C8E6C9',
  },
  subTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: '#555',
    marginTop: 12,
    marginBottom: 4,
  },
  sectionBody: {
    fontSize: 14,
    color: '#444',
    lineHeight: 1.8,
  },
  list: {
    paddingLeft: 20,
    margin: '8px 0',
    lineHeight: 2,
  },
  serviceBox: {
    background: '#FAFAFA',
    borderRadius: 10,
    padding: '10px 14px',
    marginTop: 8,
    border: '1px solid #EEEEEE',
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 700,
    color: '#333',
    margin: '0 0 4px',
  },
  serviceDesc: {
    fontSize: 13,
    color: '#666',
    margin: 0,
    lineHeight: 1.6,
  },
  importantBox: {
    background: '#FFF8E1',
    borderRadius: 12,
    padding: '14px 16px',
    border: '1px solid #FFE082',
  },
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
  effectiveDate: {
    textAlign: 'center',
    fontSize: 13,
    color: '#999',
    marginTop: 24,
  },
};

export default PrivacyScreen;
