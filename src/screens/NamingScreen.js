// ============================================
// 🐕 NamingScreen - なかまに なまえをつけよう！
// 初回起動時にキャラクターの名前を子供がつける画面
// v0.6.0: 新規作成
// ============================================

import React, { useState } from 'react';
import MameCharacter from '../components/MameCharacter';
import { COLORS } from '../constants/colors';

const NamingScreen = ({ onNameDecided }) => {
  const [name, setName] = useState('');
  const [phase, setPhase] = useState('greeting'); // greeting → input → done

  // 「はじめまして」→ 入力画面へ
  const handleStartNaming = () => {
    setPhase('input');
  };

  // 名前決定
  const handleDecide = () => {
    const trimmed = (name || '').trim();
    if (!trimmed) return;
    setPhase('done');
    // 少し演出を見せてからホームへ
    setTimeout(() => {
      onNameDecided(trimmed);
    }, 2500);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #E3F2FD 0%, #F1F8E9 40%, #FFFFFF 100%)',
      fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      {/* ===== フェーズ1: はじめまして ===== */}
      {phase === 'greeting' && (
        <div style={{
          textAlign: 'center',
          animation: 'mame-fadeIn 0.8s ease-out',
        }}>
          <MameCharacter
            pose="happy"
            message=""
            size={140}
          />
          <div style={{
            background: 'white',
            borderRadius: 24,
            padding: '24px 28px',
            marginTop: 20,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            maxWidth: 320,
          }}>
            <div style={{
              fontSize: 22,
              fontWeight: 800,
              color: COLORS.text,
              lineHeight: 1.8,
              letterSpacing: '0.03em',
            }}>
              はじめまして！！
            </div>
            <div style={{
              fontSize: 18,
              fontWeight: 700,
              color: COLORS.textLight,
              lineHeight: 1.8,
              marginTop: 8,
            }}>
              ぼく、きみの なかまだよ！
              <br />
              きみが なまえを
              <br />
              きめてくれる？
            </div>
          </div>
          <button
            onClick={handleStartNaming}
            style={{
              marginTop: 28,
              background: 'linear-gradient(135deg, #FF9800, #F57C00)',
              color: 'white',
              border: 'none',
              borderRadius: 20,
              padding: '18px 48px',
              fontSize: 20,
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(255,152,0,0.4)',
              fontFamily: "'Rounded Mplus 1c', sans-serif",
              letterSpacing: '0.05em',
              animation: 'mame-pulse 2s ease-in-out infinite',
            }}
          >
            いいよ！✨
          </button>
        </div>
      )}

      {/* ===== フェーズ2: 名前入力 ===== */}
      {phase === 'input' && (
        <div style={{
          textAlign: 'center',
          animation: 'mame-fadeIn 0.5s ease-out',
          width: '100%',
          maxWidth: 360,
        }}>
          <MameCharacter
            pose="question"
            message="どんな なまえに する？"
            size={120}
          />
          <div style={{
            background: 'white',
            borderRadius: 24,
            padding: '28px 24px',
            marginTop: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}>
            <div style={{
              fontSize: 16,
              fontWeight: 700,
              color: COLORS.textLight,
              marginBottom: 16,
            }}>
              なかまの なまえを いれてね
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="なまえを いれてね"
              maxLength={10}
              autoFocus
              style={{
                width: '100%',
                boxSizing: 'border-box',
                fontSize: 28,
                fontWeight: 800,
                textAlign: 'center',
                padding: '16px 12px',
                border: '3px solid #A5D6A7',
                borderRadius: 16,
                outline: 'none',
                color: COLORS.text,
                fontFamily: "'Rounded Mplus 1c', sans-serif",
                letterSpacing: '0.1em',
                background: '#FAFFF5',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = COLORS.orange;
                e.target.style.boxShadow = '0 0 0 4px rgba(255,152,0,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#A5D6A7';
                e.target.style.boxShadow = 'none';
              }}
            />
            <div style={{
              fontSize: 12,
              color: COLORS.textLight,
              marginTop: 8,
            }}>
              ひらがな・カタカナ・なんでもOK！（10もじまで）
            </div>
          </div>
          <button
            onClick={handleDecide}
            disabled={!name.trim()}
            style={{
              marginTop: 24,
              background: name.trim()
                ? 'linear-gradient(135deg, #4CAF50, #2E7D32)'
                : '#E0E0E0',
              color: 'white',
              border: 'none',
              borderRadius: 20,
              padding: '18px 48px',
              fontSize: 20,
              fontWeight: 800,
              cursor: name.trim() ? 'pointer' : 'default',
              boxShadow: name.trim() ? '0 4px 20px rgba(76,175,80,0.4)' : 'none',
              fontFamily: "'Rounded Mplus 1c', sans-serif",
              letterSpacing: '0.05em',
              transition: 'all 0.3s ease',
            }}
          >
            けってい！🎉
          </button>
        </div>
      )}

      {/* ===== フェーズ3: よろしくね！演出 ===== */}
      {phase === 'done' && (
        <div style={{
          textAlign: 'center',
          animation: 'mame-fadeIn 0.5s ease-out',
        }}>
          <MameCharacter
            pose="heart"
            petName={name.trim()}
            message=""
            size={150}
          />
          <div style={{
            marginTop: 20,
            fontSize: 28,
            fontWeight: 800,
            color: COLORS.greenDark,
            lineHeight: 1.6,
            animation: 'mame-jump 0.8s ease-out',
          }}>
            {name.trim()}！
            <br />
            よろしくね！💖
          </div>
          <div style={{
            marginTop: 12,
            fontSize: 16,
            color: COLORS.textLight,
            fontWeight: 700,
          }}>
            いっしょに がんばろうね！🌳
          </div>
        </div>
      )}
    </div>
  );
};

export default NamingScreen;
