// ============================================
// 🔐 PinGate - 保護者PINロック コンポーネント
// まなびの木 - Phase B
// v1.0.0: 新規作成（2026/06/19）
// ============================================
// 4桁パスコード入力UI
// PIN未設定 → 新規登録（2回入力で確認）
// PIN設定済み → 入力して照合
// Supabase接続あり → profiles.guardian_pin
// ローカルモード → localStorage
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { COLORS } from '../constants/colors';

// ローカルストレージのキー
const LOCAL_PIN_KEY = 'manabi_guardian_pin';

// --- PIN読み取り ---
async function loadPin(userId) {
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('guardian_pin')
        .eq('id', userId)
        .single();
      if (error) {
        console.error('PIN読み取りエラー:', error);
        return null;
      }
      return data?.guardian_pin || null;
    } catch (err) {
      console.error('PIN読み取り例外:', err);
      return null;
    }
  }
  // ローカルモード
  return localStorage.getItem(LOCAL_PIN_KEY) || null;
}

// --- PIN保存 ---
async function savePin(userId, pin) {
  if (supabase && userId) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ guardian_pin: pin })
        .eq('id', userId);
      if (error) {
        console.error('PIN保存エラー:', error);
        return false;
      }
      return true;
    } catch (err) {
      console.error('PIN保存例外:', err);
      return false;
    }
  }
  // ローカルモード
  localStorage.setItem(LOCAL_PIN_KEY, pin);
  return true;
}

// --- メインコンポーネント ---
const PinGate = ({ user, onSuccess, onBack }) => {
  const [mode, setMode] = useState('loading'); // loading / set-new / confirm-new / enter
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState(''); // 新規設定時の1回目入力
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  // 初期化: PIN設定済みか確認
  useEffect(() => {
    (async () => {
      const existingPin = await loadPin(user?.id);
      if (existingPin) {
        setMode('enter');
        setMessage('PINを いれてね 🔒');
      } else {
        setMode('set-new');
        setMessage('はじめに 4けたの PINを きめてね 🔑');
      }
    })();
  }, [user?.id]);

  // シェイクアニメーション
  const triggerShake = useCallback(() => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  }, []);

  // 数字入力
  const handleDigit = useCallback((digit) => {
    setError('');
    setPin(prev => {
      if (prev.length >= 4) return prev;
      return prev + digit;
    });
  }, []);

  // バックスペース
  const handleBackspace = useCallback(() => {
    setError('');
    setPin(prev => prev.slice(0, -1));
  }, []);

  // 4桁入力完了時の処理
  useEffect(() => {
    if (pin.length !== 4) return;

    const handleComplete = async () => {
      if (mode === 'set-new') {
        // 新規設定: 1回目入力完了 → 確認入力へ
        setFirstPin(pin);
        setPin('');
        setMode('confirm-new');
        setMessage('もういちど おなじ PINを いれてね ✨');
      } else if (mode === 'confirm-new') {
        // 確認入力: 1回目と一致するか
        if (pin === firstPin) {
          const ok = await savePin(user?.id, pin);
          if (ok) {
            onSuccess();
          } else {
            setError('ほぞんに しっぱいしました 😢');
            setPin('');
            triggerShake();
          }
        } else {
          setError('PINが あいません。もういちど！');
          setPin('');
          setFirstPin('');
          setMode('set-new');
          setMessage('はじめから もういちど 4けたの PINを きめてね 🔑');
          triggerShake();
        }
      } else if (mode === 'enter') {
        // 照合
        const savedPin = await loadPin(user?.id);
        if (pin === savedPin) {
          onSuccess();
        } else {
          setError('PINが ちがうよ 🔒');
          setPin('');
          triggerShake();
        }
      }
    };

    // 少し遅延を入れて最後のドットが表示されてから判定
    const timer = setTimeout(handleComplete, 200);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pin]);

  // --- ローディング ---
  if (mode === 'loading') {
    return (
      <div style={styles.container}>
        <div style={styles.loadingText}>よみこみちゅう...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* ヘッダー */}
      <div style={styles.header}>
        <button onClick={onBack} style={styles.backButton}>
          ← もどる
        </button>
      </div>

      {/* ロックアイコン */}
      <div style={styles.lockIcon}>
        {mode === 'set-new' || mode === 'confirm-new' ? '🔑' : '🔐'}
      </div>

      <div style={styles.title}>ほごしゃ モード</div>

      {/* メッセージ */}
      <div style={styles.message}>{message}</div>

      {/* ドット表示（シェイクアニメーション付き） */}
      <div style={{
        ...styles.dotsRow,
        animation: shake ? 'pinShake 0.5s ease-in-out' : 'none',
      }}>
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{
              ...styles.dot,
              backgroundColor: i < pin.length ? COLORS.greenDark : '#E0E0E0',
              transform: i < pin.length ? 'scale(1.2)' : 'scale(1)',
            }}
          />
        ))}
      </div>

      {/* エラーメッセージ */}
      {error && <div style={styles.error}>{error}</div>}

      {/* テンキー */}
      <div style={styles.keypad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
          <button
            key={num}
            onClick={() => handleDigit(String(num))}
            style={styles.key}
          >
            {num}
          </button>
        ))}
        <div style={styles.keyEmpty} />
        <button
          onClick={() => handleDigit('0')}
          style={styles.key}
        >
          0
        </button>
        <button
          onClick={handleBackspace}
          style={{ ...styles.key, fontSize: 20 }}
        >
          ←
        </button>
      </div>

      {/* PIN変更リンク（入力モード時のみ） */}
      {mode === 'enter' && (
        <button
          onClick={() => {
            setMode('set-new');
            setPin('');
            setFirstPin('');
            setMessage('あたらしい 4けたの PINを きめてね 🔑');
            setError('');
          }}
          style={styles.resetLink}
        >
          PINを わすれた / へんこうする
        </button>
      )}

      {/* CSSアニメーション */}
      <style>{`
        @keyframes pinShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
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
    background: `linear-gradient(180deg, ${COLORS.bg} 0%, #E8F5E9 100%)`,
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
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: COLORS.greenDark,
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 1.5,
  },
  dotsRow: {
    display: 'flex',
    gap: 16,
    marginBottom: 12,
  },
  dot: {
    width: 20,
    height: 20,
    borderRadius: '50%',
    transition: 'all 0.15s ease',
    border: `2px solid ${COLORS.greenDark}`,
  },
  error: {
    fontSize: 14,
    color: COLORS.incorrect,
    marginBottom: 8,
    minHeight: 20,
    fontWeight: 600,
  },
  keypad: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 72px)',
    gap: 12,
    marginTop: 16,
  },
  key: {
    width: 72,
    height: 56,
    borderRadius: 16,
    border: 'none',
    background: COLORS.white,
    fontSize: 24,
    fontWeight: 700,
    color: COLORS.text,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    transition: 'transform 0.1s, box-shadow 0.1s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyEmpty: {
    width: 72,
    height: 56,
  },
  resetLink: {
    marginTop: 24,
    background: 'none',
    border: 'none',
    fontSize: 13,
    color: COLORS.textLight,
    cursor: 'pointer',
    textDecoration: 'underline',
    padding: 8,
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textLight,
  },
};

export default PinGate;
