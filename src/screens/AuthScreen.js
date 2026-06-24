// ============================================
// 🔐 AuthScreen - ログイン画面
// まなびの木 - Phase A 認証基盤
// v1.0.1: OTPコード方式に変更（2026/06/24）
// ============================================
// Googleログイン（メイン推奨）
// + メールOTP（8桁コード入力・PWA対応）
// ============================================

import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';

// ------------------------------------------
// WebView判定
// ------------------------------------------
const isWebView = () => {
  const ua = navigator.userAgent || '';
  return /Line|FBAV|FB_IAB|FBAN|Instagram|YJApp|Yahoo/i.test(ua);
};

function AuthScreen({ onOpenTerms, onOpenPrivacy, onOpenTokushoho, onOpenHowTo }) {
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [googleError, setGoogleError] = useState(false);

  const otpInputRef = useRef(null);
  const webView = isWebView();

  // ------------------------------------------
  // Googleログイン（リダイレクト方式）
  // ------------------------------------------
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setGoogleError(false);
    setMessage('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        console.error('Google login error:', error);
        setGoogleError(true);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Google login exception:', err);
      setGoogleError(true);
      setIsLoading(false);
    }
  };

  // ------------------------------------------
  // OTPコード送信（メールで8桁コード）
  // ------------------------------------------
  const handleSendOtp = async () => {
    if (!email.trim()) {
      setMessage('メールアドレスを いれてね');
      return;
    }
    setIsLoading(true);
    setMessage('');
    setGoogleError(false);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
      });
      if (error) {
        console.error('OTP send error:', error);
        setMessage('エラーが おきました。もういちど ためしてね');
      } else {
        setOtpSent(true);
        setMessage('');
        // コード入力フィールドにフォーカス
        setTimeout(() => otpInputRef.current?.focus(), 300);
      }
    } catch (err) {
      console.error('OTP send exception:', err);
      setMessage('エラーが おきました');
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------
  // OTPコード確認（8桁入力して認証）
  // ------------------------------------------
  const handleVerifyOtp = async () => {
    const code = otpCode.trim();
    if (!code || code.length < 8) {
      setMessage('8けたの コードを いれてね');
      return;
    }
    setIsLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code,
        type: 'email',
      });
      if (error) {
        console.error('OTP verify error:', error);
        if (error.message?.includes('expired')) {
          setMessage('コードの 期限が きれちゃった。もう一回 おくってね');
        } else {
          setMessage('コードが ちがうかも。もういちど たしかめてね');
        }
      }
      // 成功時は onAuthStateChange が発火 → 自動遷移
    } catch (err) {
      console.error('OTP verify exception:', err);
      setMessage('エラーが おきました');
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------------------------------
  // コード再送信
  // ------------------------------------------
  const handleResendOtp = async () => {
    setOtpCode('');
    setMessage('');
    await handleSendOtp();
  };

  // ------------------------------------------
  // メールアドレス入力に戻る
  // ------------------------------------------
  const handleBackToEmail = () => {
    setOtpSent(false);
    setOtpCode('');
    setMessage('');
  };

  // メッセージ表示
  const isSuccess = message.startsWith('OK_');
  const displayMessage = message.replace('OK_', '');

  // OTP入力完了判定
  const otpReady = otpCode.length === 8;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* ===== ロゴ・タイトル ===== */}
        <div style={styles.logoSection}>
          <img
            src="/public/images/mame/mame_happy.png"
            alt="まなびの木"
            style={styles.logo}
          />
          <h1 style={styles.title}>🌳 まなびの木</h1>
          <p style={styles.subtitle}>まなぶほど 木が そだつ</p>
        </div>

        {/* ===== WebView案内バナー ===== */}
        {webView && (
          <div style={styles.webViewBanner}>
            <p style={{ margin: 0, fontWeight: 700, marginBottom: 6 }}>
              📱 アプリから ひらいていませんか？
            </p>
            <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>
              Googleログインが うまくいかないときは<br />
              ① 右上の「…」→「ブラウザでひらく」<br />
              ② 下の「メールでログイン」を おためしください
            </p>
          </div>
        )}

        {/* ===== OTP入力モード ===== */}
        {otpSent ? (
          <div style={styles.otpSection}>
            <div style={styles.otpHeader}>
              <span style={{ fontSize: 40 }}>✉️</span>
              <h2 style={styles.otpTitle}>コードを いれてね！</h2>
              <p style={styles.otpDesc}>
                <strong>{email}</strong> に<br />
                8けたの コードを おくったよ
              </p>
            </div>

            {/* 8桁コード入力 */}
            <input
              ref={otpInputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="● ● ● ● ● ● ● ●"
              style={{
                ...styles.otpInput,
                borderColor: otpReady ? '#2E7D32' : '#4CAF50',
                boxShadow: otpReady ? '0 0 0 3px rgba(46,125,50,0.15)' : 'none',
              }}
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleVerifyOtp()}
              autoComplete="one-time-code"
            />

            {/* 桁数カウンター */}
            <p style={styles.otpCounter}>
              <span style={{ color: otpReady ? '#2E7D32' : '#999' }}>
                {otpReady ? '✅ ' : ''}{otpCode.length} / 8 けた
              </span>
            </p>

            {/* 確認ボタン */}
            <button
              onClick={handleVerifyOtp}
              disabled={isLoading || !otpReady}
              style={{
                ...styles.verifyButton,
                opacity: (isLoading || !otpReady) ? 0.5 : 1,
                cursor: (isLoading || !otpReady) ? 'not-allowed' : 'pointer',
                transform: otpReady && !isLoading ? 'scale(1.03)' : 'scale(1)',
                boxShadow: otpReady && !isLoading ? '0 4px 12px rgba(67,160,71,0.3)' : 'none',
              }}
            >
              {isLoading ? 'かくにん中...' : '✅ ログイン！'}
            </button>

            {/* エラーメッセージ */}
            {displayMessage && (
              <div style={styles.errorMessage}>
                {displayMessage}
              </div>
            )}

            {/* 再送信 & 戻るボタン */}
            <div style={styles.otpActions}>
              <button onClick={handleResendOtp} style={styles.otpActionButton} disabled={isLoading}>
                📩 コードを もういちど おくる
              </button>
              <button onClick={handleBackToEmail} style={styles.otpActionButton} disabled={isLoading}>
                ← メールアドレスを かえる
              </button>
            </div>

            <p style={styles.otpHint}>
              💡 メールが とどかないときは<br />「めいわくメール」フォルダを みてね
            </p>
          </div>
        ) : (
          <>
            {/* ===== Googleログインボタン（推奨） ===== */}
            <div style={styles.recommendBadge}>⭐ かんたん！おすすめ</div>
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              style={{
                ...styles.googleButton,
                opacity: isLoading ? 0.6 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer',
              }}
            >
              <svg style={styles.googleIconSvg} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 001 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google で ログイン
            </button>

            {/* ===== Googleログイン失敗時のフォロー ===== */}
            {googleError && (
              <div style={styles.errorBanner}>
                <p style={{ margin: 0, fontWeight: 700 }}>
                  ⚠️ Googleログインが ブロックされました
                </p>
                <p style={{ margin: 0, fontSize: 13, marginTop: 4 }}>
                  アプリ内ブラウザでは つかえないことがあります<br />
                  🔽 下の「メールでログイン」を おためしください
                </p>
              </div>
            )}

            {/* ===== 区切り線 ===== */}
            <div style={styles.divider}>
              <span style={styles.dividerLine} />
              <span style={styles.dividerText}>または</span>
              <span style={styles.dividerLine} />
            </div>

            {/* ===== メールOTPログイン ===== */}
            <div style={styles.emailSection}>
              <label style={styles.emailLabel}>📧 メールでログイン（パスワードいらないよ！）</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                style={styles.emailInput}
                disabled={isLoading}
                onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
              />
              <button
                onClick={handleSendOtp}
                disabled={isLoading || !email.trim()}
                style={{
                  ...styles.magicLinkButton,
                  opacity: (isLoading || !email.trim()) ? 0.5 : 1,
                  cursor: (isLoading || !email.trim()) ? 'not-allowed' : 'pointer',
                }}
              >
                {isLoading ? 'おくっています...' : '確認コードを おくる ✉️'}
              </button>
            </div>

            {/* ===== メッセージ表示 ===== */}
            {displayMessage && (
              <div style={isSuccess ? styles.successMessage : styles.errorMessage}>
                {displayMessage.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < displayMessage.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* ===== ヘルプ ===== */}
            <button
              onClick={() => setShowHelp(!showHelp)}
              style={styles.helpToggle}
            >
              💡 うまくいかないときは？ {showHelp ? '▲' : '▼'}
            </button>
            {showHelp && (
              <div style={styles.helpContent}>
                <p style={styles.helpItem}>• Chrome や Safari で ひらきなおしてみてね</p>
                <p style={styles.helpItem}>• メールでログインは パスワード いらないよ！</p>
                <p style={styles.helpItem}>• 確認コードが とどかないときは「めいわくメール」フォルダを みてね</p>
                <p style={styles.helpItem}>• おうちの Wi-Fi で ためしてみてね</p>
              </div>
            )}
          </>
        )}

        {/* ===== 新規ユーザー案内 ===== */}
        <p style={styles.newUserNote}>
          はじめての方も ログインするだけで<br />
          アカウントが できます！
        </p>

        {/* ===== つかいかたガイド ===== */}
        <button onClick={onOpenHowTo} style={styles.howtoButton}>
          📱 つかいかたガイド — はじめての方はこちら
        </button>

        {/* ===== 利用規約等リンク ===== */}
        <div style={styles.legalLinks}>
          <button onClick={onOpenTerms} style={styles.legalLink}>利用規約</button>
          <span style={styles.legalDivider}>|</span>
          <button onClick={onOpenPrivacy} style={styles.legalLink}>プライバシーポリシー</button>
          <span style={styles.legalDivider}>|</span>
          <button onClick={onOpenTokushoho} style={styles.legalLink}>特商法表記</button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// スタイル定義
// ============================================
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(180deg, #E3F2FD 0%, #F1F8E9 40%, #FFFFFF 100%)',
    fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    padding: 16,
  },
  card: {
    background: '#FFFFFF',
    borderRadius: 24,
    padding: '32px 24px',
    maxWidth: 400,
    width: '100%',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
  },
  // --- ロゴセクション ---
  logoSection: {
    textAlign: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 800,
    color: '#2E7D32',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    margin: 0,
  },
  // --- WebViewバナー ---
  webViewBanner: {
    background: '#FFF3E0',
    border: '1px solid #FFB74D',
    borderRadius: 12,
    padding: '12px 16px',
    marginBottom: 16,
    fontSize: 14,
  },
  // --- おすすめバッジ ---
  recommendBadge: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 700,
    color: '#F57F17',
    marginBottom: 6,
  },
  // --- Googleボタン ---
  googleButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    padding: '16px 20px',
    fontSize: 17,
    fontWeight: 700,
    fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    color: '#333',
    background: '#FFFFFF',
    border: '2px solid #4285F4',
    borderRadius: 14,
    marginBottom: 12,
    transition: 'all 0.2s',
  },
  googleIconSvg: {
    width: 22,
    height: 22,
    flexShrink: 0,
  },
  // --- エラーバナー ---
  errorBanner: {
    background: '#FFF0F0',
    border: '1px solid #EF9A9A',
    borderRadius: 12,
    padding: '12px 16px',
    marginBottom: 12,
    fontSize: 14,
    color: '#C62828',
  },
  // --- 区切り線 ---
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '16px 0',
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    background: '#E0E0E0',
  },
  dividerText: {
    fontSize: 13,
    color: '#999',
    fontWeight: 500,
  },
  // --- メールセクション ---
  emailSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  emailLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#555',
  },
  emailInput: {
    padding: '12px 16px',
    fontSize: 16,
    border: '2px solid #C8E6C9',
    borderRadius: 12,
    outline: 'none',
    fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    transition: 'border-color 0.2s',
  },
  magicLinkButton: {
    padding: '12px 20px',
    fontSize: 15,
    fontWeight: 700,
    fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    color: '#FFFFFF',
    background: '#43A047',
    border: 'none',
    borderRadius: 12,
    transition: 'all 0.2s',
  },
  // --- OTPセクション ---
  otpSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  otpHeader: {
    textAlign: 'center',
    marginBottom: 8,
  },
  otpTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: '#2E7D32',
    margin: '8px 0 4px 0',
  },
  otpDesc: {
    fontSize: 14,
    color: '#666',
    lineHeight: 1.6,
    margin: 0,
  },
  otpInput: {
    width: '100%',
    maxWidth: 300,
    padding: '16px 16px',
    fontSize: 26,
    fontWeight: 800,
    fontFamily: "'Courier New', monospace",
    textAlign: 'center',
    letterSpacing: 8,
    border: '3px solid #4CAF50',
    borderRadius: 16,
    outline: 'none',
    background: '#F1F8E9',
    color: '#2E7D32',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  otpCounter: {
    fontSize: 13,
    fontWeight: 600,
    color: '#999',
    margin: '0 0 4px 0',
    textAlign: 'center',
  },
  verifyButton: {
    width: '100%',
    maxWidth: 300,
    padding: '14px 20px',
    fontSize: 17,
    fontWeight: 800,
    fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    color: '#FFFFFF',
    background: '#43A047',
    border: 'none',
    borderRadius: 14,
    transition: 'all 0.2s',
  },
  otpActions: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  otpActionButton: {
    background: 'none',
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    color: '#43A047',
    cursor: 'pointer',
    padding: '6px 12px',
    textDecoration: 'underline',
  },
  otpHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    lineHeight: 1.6,
    marginTop: 8,
  },
  // --- メッセージ ---
  successMessage: {
    background: '#E8F5E9',
    border: '1px solid #A5D6A7',
    borderRadius: 12,
    padding: '12px 16px',
    marginBottom: 12,
    fontSize: 14,
    color: '#2E7D32',
    textAlign: 'center',
    lineHeight: 1.6,
  },
  errorMessage: {
    background: '#FFF0F0',
    border: '1px solid #EF9A9A',
    borderRadius: 12,
    padding: '12px 16px',
    marginBottom: 12,
    fontSize: 14,
    color: '#C62828',
    textAlign: 'center',
    width: '100%',
  },
  // --- ヘルプ ---
  helpToggle: {
    display: 'block',
    width: '100%',
    padding: '8px 0',
    fontSize: 13,
    fontWeight: 600,
    fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    color: '#888',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center',
  },
  helpContent: {
    background: '#F5F5F5',
    borderRadius: 12,
    padding: '12px 16px',
    marginBottom: 8,
    fontSize: 13,
    color: '#666',
    lineHeight: 1.6,
  },
  helpItem: {
    margin: '4px 0',
  },
  // --- 新規ユーザー案内 ---
  newUserNote: {
    textAlign: 'center',
    fontSize: 13,
    color: '#999',
    lineHeight: 1.6,
    marginTop: 12,
    marginBottom: 0,
  },
  // --- つかいかたガイドボタン ---
  howtoButton: {
    display: 'block',
    width: '100%',
    padding: '12px 16px',
    fontSize: 14,
    fontWeight: 700,
    fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    color: '#43A047',
    background: '#F1F8E9',
    border: '2px solid #C8E6C9',
    borderRadius: 12,
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: 8,
    transition: 'all 0.2s',
  },
  // --- 利用規約等リンク ---
  legalLinks: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    paddingTop: 12,
    borderTop: '1px solid #F0F0F0',
    flexWrap: 'wrap',
  },
  legalLink: {
    background: 'none',
    border: 'none',
    fontSize: 11,
    color: '#AAAAAA',
    cursor: 'pointer',
    padding: '2px 4px',
    fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    textDecoration: 'underline',
  },
  legalDivider: {
    fontSize: 11,
    color: '#DDDDDD',
  },
};

export default AuthScreen;
