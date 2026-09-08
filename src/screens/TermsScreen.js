// ============================================
// 📜 TermsScreen - 利用規約
// まなびの木 v0.9.9
// 新規作成: 2026/06/18
// ============================================
// ※ 保護者向けページのため通常の日本語表記
// ============================================

import React from 'react';

const TermsScreen = ({ onBack }) => {
  return (
    <div className="mn-page mn-legal" style={styles.container}>
      {/* ヘッダー */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← もどる
        </button>
        <h1 style={styles.headerTitle}>📜 利用規約</h1>
      </div>

      {/* 本文 */}
      <div style={styles.content}>
        <p style={styles.intro}>
          この利用規約（以下「本規約」）は、NON WORKS（以下「当方」）が提供する学習アプリ「まなびの木」（以下「本サービス」）の利用条件を定めるものです。本サービスをご利用いただく前に、本規約をよくお読みください。
        </p>

        {/* 第1条 */}
        <h2 style={styles.sectionTitle}>第1条（適用）</h2>
        <div style={styles.sectionBody}>
          <p>本規約は、本サービスの利用に関する当方とユーザーとの間の一切の関係に適用されます。</p>
          <p>本サービスは主に小学生のお子さまを対象としていますが、アカウント登録および課金手続きは保護者の方が行ってください。</p>
        </div>

        {/* 第2条 */}
        <h2 style={styles.sectionTitle}>第2条（サービスの内容）</h2>
        <div style={styles.sectionBody}>
          <p>本サービスは、小学生向けの学習コンテンツをWebアプリケーションとして提供するものです。算数・国語・理科・社会・時計・道徳・元素の7教科に対応した問題演習、学習記録の管理、キャラクター育成などの機能を含みます。</p>
          <p>当方は、本サービスの内容を予告なく変更・追加・削除することがあります。</p>
        </div>

        {/* 第3条 */}
        <h2 style={styles.sectionTitle}>第3条（アカウント登録）</h2>
        <div style={styles.sectionBody}>
          <p>本サービスの利用にはアカウント登録が必要です。保護者の方のGoogleアカウント、または保護者の方のメールアドレスに送信する8桁の確認コードでログインできます。</p>
          <p>ユーザーは、登録情報を正確かつ最新の状態に保つものとします。</p>
          <p>アカウントの管理責任はユーザーにあり、第三者への貸与・譲渡はできません。</p>
        </div>

        {/* 第4条 */}
        <h2 style={styles.sectionTitle}>第4条（料金・お支払い）</h2>
        <div style={styles.sectionBody}>
          <p>本サービスには無料プランと有料プラン（プレミアム）があります。</p>
          <p>月額プラン：200円（税込）/ 月<br />年間プラン：2,100円（税込）/ 年</p>
          <p>有料プランの決済にはStripeを利用します。クレジットカードのほか、決済画面に表示される場合はGoogle Pay・Apple Payをご利用いただけます。利用できる支払方法は、ご利用の端末・ブラウザ等によって異なります。申込み時の決済画面でご確認ください。</p>
          <p>プラン申込時に初回決済を行います。月額プランは毎月、年間プランは毎年、契約期間ごとに自動更新されます。次回更新前に解約手続きを完了しない限り、次の契約期間の料金が請求されます。</p>
          <p>解約は、ブラウザで本サービスを開き、「みまもり」の「プランを管理する（解約・変更）」からお手続きください。次回更新日・請求内容は、プラン管理画面でご確認いただけます。手続きができない場合は、下記のお問い合わせ先までご連絡ください。</p>
          <p>解約後も、お支払い済みの契約期間の終了まで有料機能をご利用いただけます。お客様の都合による期間途中の解約について、日割り・月割りの返金は行いません。ただし、法令上返金が必要な場合はこの限りではありません。</p>
        </div>

        {/* 第5条 */}
        <h2 style={styles.sectionTitle}>第5条（無料プラン・トライアル）</h2>
        <div style={styles.sectionBody}>
          <p>新規登録時より5日間の無料トライアル期間を設けています。トライアル期間中は全機能をご利用いただけます。</p>
          <p>トライアル終了後は無料プラン（ミッション1日1回のみ）に自動移行します。自動課金は発生しません。</p>
        </div>

        {/* 第6条 */}
        <h2 style={styles.sectionTitle}>第6条（禁止事項）</h2>
        <div style={styles.sectionBody}>
          <p>ユーザーは、以下の行為を行ってはなりません。</p>
          <ul style={styles.list}>
            <li>法令または公序良俗に違反する行為</li>
            <li>不正アクセス、サービスへの妨害行為</li>
            <li>本サービスのコンテンツの無断複製・転載</li>
            <li>他のユーザーへの迷惑行為</li>
            <li>その他、当方が不適切と判断する行為</li>
          </ul>
        </div>

        {/* 第7条 */}
        <h2 style={styles.sectionTitle}>第7条（知的財産権）</h2>
        <div style={styles.sectionBody}>
          <p>本サービスに含まれるすべてのコンテンツ（問題文、イラスト、プログラム、デザイン等）の著作権その他の知的財産権は、当方または正当な権利者に帰属します。</p>
        </div>

        {/* 第8条 */}
        <h2 style={styles.sectionTitle}>第8条（免責事項）</h2>
        <div style={styles.sectionBody}>
          <p>本サービスは学習を支援するものであり、特定の学習成果や成績の向上を保証するものではありません。教材等に誤りを見つけた場合は、お問い合わせ先までお知らせください。</p>
          <p>通信環境、保守作業、システムの不具合等により、本サービスを一時的に利用できない場合があります。</p>
          <p>本サービスに関して当方の責任によりユーザーに損害が生じた場合、当方は民法、消費者契約法その他の適用法令に従って責任を負います。本規約は、法令により認められるユーザーの権利を制限するものではありません。</p>
        </div>

        {/* 第9条 */}
        <h2 style={styles.sectionTitle}>第9条（利用停止・退会）</h2>
        <div style={styles.sectionBody}>
          <p>ユーザーが本規約に違反した場合、当方は事前の通知なくアカウントを停止することがあります。</p>
          <p>退会やアカウントに関するデータの削除を希望される場合は、お問い合わせ先までご連絡ください。本人確認の上、ご案内します。</p>
          <p>有料プランの解約とアカウントの退会は別の手続きです。有料プランをご利用中の場合は、第4条の方法で解約手続きも行ってください。手続きができない場合は、お問い合わせの際にその旨をお知らせください。</p>
        </div>

        {/* 第10条 */}
        <h2 style={styles.sectionTitle}>第10条（規約の変更）</h2>
        <div style={styles.sectionBody}>
          <p>当方は、民法その他の適用法令に従い、本規約を変更することがあります。変更する場合は、変更内容と効力発生日を、本サービス上への掲載その他の適切な方法で、効力発生前にお知らせします。</p>
          <p>法令上ユーザーの同意が必要な変更については、必要な同意を得た上で変更します。</p>
        </div>

        {/* 第11条 */}
        <h2 style={styles.sectionTitle}>第11条（準拠法・管轄）</h2>
        <div style={styles.sectionBody}>
          <p>本規約の解釈は日本法に準拠します。本サービスに関する紛争については、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
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

export default TermsScreen;
