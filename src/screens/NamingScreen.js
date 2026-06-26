// ============================================
// 🐕🤖 NamingScreen - なかまに なまえをつけよう！
// 初回起動時にキャラクターの名前を子供がつける画面
// v0.6.0: 新規作成
// v1.0.2: 2キャラ対応（まめ + ロボちゃん）
// ============================================

import React, { useState } from 'react';
import MameCharacter from '../components/MameCharacter';
import RobotCharacter from '../components/RobotCharacter';
import { COLORS } from '../constants/colors';

const NamingScreen = ({ onNameDecided }) => {
  const [mameName, setMameName] = useState('');
  const [robotName, setRobotName] = useState('');
  const [phase, setPhase] = useState('greeting');

  const handleDecideMame = () => {
    const trimmed = (mameName || '').trim();
    if (!trimmed) return;
    setPhase('intro_robot');
  };

  const handleDecideRobot = () => {
    const trimmed = (robotName || '').trim();
    if (!trimmed) return;
    setPhase('done');
    setTimeout(() => {
      onNameDecided(mameName.trim(), robotName.trim());
    }, 3000);
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #E3F2FD 0%, #F1F8E9 40%, #FFFFFF 100%)',
    fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  };

  const cardStyle = {
    background: 'white',
    borderRadius: 24,
    padding: '24px 28px',
    marginTop: 20,
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    maxWidth: 320,
  };

  const inputStyle = {
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
  };

  const buttonStyle = (active, color = '#FF9800') => ({
    marginTop: 24,
    background: active
      ? `linear-gradient(135deg, ${color}, ${color}DD)`
      : '#E0E0E0',
    color: 'white',
    border: 'none',
    borderRadius: 20,
    padding: '18px 48px',
    fontSize: 20,
    fontWeight: 800,
    cursor: active ? 'pointer' : 'default',
    boxShadow: active ? `0 4px 20px ${color}66` : 'none',
    fontFamily: "'Rounded Mplus 1c', sans-serif",
    letterSpacing: '0.05em',
    transition: 'all 0.3s ease',
  });

  return (
    <div style={containerStyle}>
      {/* ===== フェーズ1: はじめまして ===== */}
      {phase === 'greeting' && (
        <div style={{ textAlign: 'center', animation: 'mame-fadeIn 0.8s ease-out' }}>
          <MameCharacter pose="dash" message="" size={140} enableTap={true} />
          <div style={cardStyle}>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text, lineHeight: 1.8 }}>
              はじめまして！！
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.textLight, lineHeight: 1.8, marginTop: 8 }}>
              ぼく、きみの なかまだよ！
              <br />
              きみが なまえを
              <br />
              きめてくれる？
            </div>
          </div>
          <button
            onClick={() => setPhase('input_mame')}
            style={{
              ...buttonStyle(true),
              animation: 'mame-pulse 2s ease-in-out infinite',
            }}
          >
            いいよ！✨
          </button>
        </div>
      )}

      {/* ===== フェーズ2: まめの名前入力 ===== */}
      {phase === 'input_mame' && (
        <div style={{ textAlign: 'center', animation: 'mame-fadeIn 0.5s ease-out', width: '100%', maxWidth: 360 }}>
          <MameCharacter pose="cheer" message="どんな なまえに する？" size={120} enableTap={true} />
          <div style={{ ...cardStyle, marginTop: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.textLight, marginBottom: 16 }}>
              🐕 このこの なまえを いれてね
            </div>
            <input
              type="text"
              value={mameName}
              onChange={(e) => setMameName(e.target.value)}
              placeholder="なまえを いれてね"
              maxLength={10}
              autoFocus
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = COLORS.orange; e.target.style.boxShadow = '0 0 0 4px rgba(255,152,0,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#A5D6A7'; e.target.style.boxShadow = 'none'; }}
            />
            <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 8 }}>
              ひらがな・カタカナ・なんでもOK！（10もじまで）
            </div>
          </div>
          <button onClick={handleDecideMame} disabled={!mameName.trim()} style={buttonStyle(!!mameName.trim(), '#4CAF50')}>
            けってい！🎉
          </button>
        </div>
      )}

      {/* ===== フェーズ3: ロボちゃん登場 ===== */}
      {phase === 'intro_robot' && (
        <div style={{ textAlign: 'center', animation: 'mame-fadeIn 0.8s ease-out' }}>
          <RobotCharacter pose="wave" message="" size={140} enableTap={true} />
          <div style={cardStyle}>
            <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.text, lineHeight: 1.8 }}>
              もうひとり なかまが いるよ！
            </div>
            <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.textLight, lineHeight: 1.8, marginTop: 8 }}>
              ロボットの おともだちだよ！
              <br />
              なまえを つけてあげてね！
            </div>
          </div>
          <button
            onClick={() => setPhase('input_robot')}
            style={{
              ...buttonStyle(true, '#42A5F5'),
              animation: 'mame-pulse 2s ease-in-out infinite',
            }}
          >
            つけるよ！🤖
          </button>
        </div>
      )}

      {/* ===== フェーズ4: ロボちゃんの名前入力 ===== */}
      {phase === 'input_robot' && (
        <div style={{ textAlign: 'center', animation: 'mame-fadeIn 0.5s ease-out', width: '100%', maxWidth: 360 }}>
          <RobotCharacter pose="cheer" message="どんな なまえが いい？ ピコ！" size={120} enableTap={true} />
          <div style={{ ...cardStyle, marginTop: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.textLight, marginBottom: 16 }}>
              🤖 このこの なまえを いれてね
            </div>
            <input
              type="text"
              value={robotName}
              onChange={(e) => setRobotName(e.target.value)}
              placeholder="なまえを いれてね"
              maxLength={10}
              autoFocus
              style={inputStyle}
              onFocus={(e) => { e.target.style.borderColor = '#42A5F5'; e.target.style.boxShadow = '0 0 0 4px rgba(66,165,245,0.15)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#A5D6A7'; e.target.style.boxShadow = 'none'; }}
            />
            <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 8 }}>
              ひらがな・カタカナ・なんでもOK！（10もじまで）
            </div>
          </div>
          <button onClick={handleDecideRobot} disabled={!robotName.trim()} style={buttonStyle(!!robotName.trim(), '#42A5F5')}>
            けってい！🎉
          </button>
        </div>
      )}

      {/* ===== フェーズ5: よろしくね！演出 ===== */}
      {phase === 'done' && (
        <div style={{ textAlign: 'center', animation: 'mame-fadeIn 0.5s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 8 }}>
            <MameCharacter pose="cry_happy" petName={mameName.trim()} message="" size={110} enableTap={false} />
            <RobotCharacter pose="happy" robotName={robotName.trim()} message="" size={110} enableTap={false} />
          </div>
          <div style={{
            marginTop: 12,
            fontSize: 24,
            fontWeight: 800,
            color: COLORS.greenDark,
            lineHeight: 1.6,
            animation: 'mame-jump 0.8s ease-out',
          }}>
            {mameName.trim()}と {robotName.trim()}！
            <br />
            よろしくね！💖
          </div>
          <div style={{ marginTop: 12, fontSize: 16, color: COLORS.textLight, fontWeight: 700 }}>
            いっしょに がんばろうね！🌳
          </div>
        </div>
      )}
    </div>
  );
};

export default NamingScreen;
