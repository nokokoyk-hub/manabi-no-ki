// ============================================
// 🎰 HarvestScreen.js - 収穫ガチャ演出画面
// 実をタップ → レアリティ別エフェクト → フルーツどーん！
// v1.0.3: 果実コレクション機能追加
// ============================================

import React, { useState, useEffect } from 'react';
import { RARITY_INFO, EFFECTS } from '../lib/gachaData';

const HarvestScreen = ({ fruit, isNew, onClose }) => {
  const [phase, setPhase] = useState('intro');  // intro → reveal → done
  const rarityInfo = RARITY_INFO[fruit.rarity];
  const effects = EFFECTS[fruit.rarity];

  useEffect(() => {
    // intro（暗転）→ 500ms後にreveal
    const t1 = setTimeout(() => setPhase('reveal'), 600);
    // reveal → 演出時間後にdone（タップ可能）
    const t2 = setTimeout(() => setPhase('done'), 600 + effects.duration);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [effects.duration]);

  const handleTap = () => {
    if (phase === 'done') onClose();
  };

  return (
    <div onClick={handleTap} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 10000,
      background: phase === 'intro'
        ? 'rgba(0,0,0,0.9)'
        : `radial-gradient(circle, ${rarityInfo.bgColor}ee 0%, rgba(0,0,0,0.85) 100%)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.8s ease',
      cursor: phase === 'done' ? 'pointer' : 'default',
      overflow: 'hidden',
      fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    }}>

      {/* エフェクト背景 */}
      {phase !== 'intro' && effects.bg && (
        <img src={effects.bg} alt="" style={{
          position: 'absolute',
          width: '120%', maxWidth: 600, height: 'auto',
          opacity: phase === 'reveal' ? 0 : 0.8,
          animation: 'harvestEffectIn 1.2s ease-out forwards',
          pointerEvents: 'none',
        }} />
      )}

      {/* エフェクトオーバーレイ */}
      {phase !== 'intro' && effects.overlay && (
        <img src={effects.overlay} alt="" style={{
          position: 'absolute',
          width: '110%', maxWidth: 550, height: 'auto',
          opacity: 0,
          animation: 'harvestOverlayIn 1.5s 0.5s ease-out forwards',
          pointerEvents: 'none',
        }} />
      )}

      {/* レアリティラベル（上部） */}
      {phase !== 'intro' && (
        <div style={{
          position: 'absolute', top: '12%',
          fontSize: 22, fontWeight: 900,
          color: rarityInfo.color,
          textShadow: `0 0 20px ${rarityInfo.color}66, 0 2px 4px rgba(0,0,0,0.3)`,
          opacity: 0,
          animation: 'harvestLabelIn 0.6s 0.8s ease-out forwards',
          letterSpacing: 4,
        }}>
          {rarityInfo.emoji} {rarityInfo.label} {rarityInfo.emoji}
        </div>
      )}

      {/* フルーツ画像（中央にドーン！） */}
      {phase !== 'intro' && (
        <div style={{
          position: 'relative',
          animation: `harvestFruitIn 0.8s 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards,
                      ${effects.shakeIntensity > 0 ? `harvestShake ${0.1 + effects.shakeIntensity * 0.02}s 0.3s ease-in-out ${Math.min(effects.shakeIntensity, 4)}` : 'none'}`,
          opacity: 0,
          transform: 'scale(0)',
        }}>
          <img src={fruit.image} alt={fruit.name} style={{
            width: 200, height: 200,
            objectFit: 'contain',
            filter: fruit.rarity === 'legend'
              ? 'drop-shadow(0 0 30px rgba(255,215,0,0.8)) drop-shadow(0 0 60px rgba(255,215,0,0.4))'
              : fruit.rarity === 'super_rare'
              ? 'drop-shadow(0 0 20px rgba(156,39,176,0.6))'
              : fruit.rarity === 'rare'
              ? 'drop-shadow(0 0 15px rgba(255,152,0,0.5))'
              : 'drop-shadow(0 0 10px rgba(139,195,74,0.4))',
          }} />

          {/* NEW! バッジ */}
          {isNew && (
            <div style={{
              position: 'absolute', top: -10, right: -20,
              background: 'linear-gradient(135deg, #FF6B6B, #FF4757)',
              color: 'white', fontSize: 14, fontWeight: 900,
              padding: '4px 12px', borderRadius: 20,
              transform: 'rotate(15deg)',
              boxShadow: '0 2px 10px rgba(255,71,87,0.5)',
              animation: 'harvestNewBadge 0.5s 1.2s ease-out forwards',
              opacity: 0,
            }}>
              NEW!
            </div>
          )}
        </div>
      )}

      {/* フルーツ名 */}
      {phase !== 'intro' && (
        <div style={{
          marginTop: 24,
          fontSize: 28, fontWeight: 900,
          color: 'white',
          textShadow: `0 0 15px ${rarityInfo.color}88, 0 2px 4px rgba(0,0,0,0.5)`,
          opacity: 0,
          animation: 'harvestNameIn 0.6s 1s ease-out forwards',
        }}>
          {fruit.name}
        </div>
      )}

      {/* タップで閉じるテキスト */}
      {phase === 'done' && (
        <div style={{
          position: 'absolute', bottom: '10%',
          fontSize: 14, color: 'rgba(255,255,255,0.6)',
          animation: 'harvestTapHint 1.5s ease-in-out infinite',
        }}>
          タップして とじる
        </div>
      )}

      {/* CSSアニメーション定義 */}
      <style>{`
        @keyframes harvestEffectIn {
          0%   { opacity: 0; transform: scale(0.3) rotate(-10deg); }
          50%  { opacity: 1; transform: scale(1.1) rotate(5deg); }
          100% { opacity: 0.8; transform: scale(1) rotate(0deg); }
        }
        @keyframes harvestOverlayIn {
          0%   { opacity: 0; transform: scale(0.5) rotate(0deg); }
          100% { opacity: 0.6; transform: scale(1) rotate(360deg); }
        }
        @keyframes harvestFruitIn {
          0%   { opacity: 0; transform: scale(0); }
          60%  { opacity: 1; transform: scale(1.3); }
          80%  { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes harvestShake {
          0%, 100% { transform: translateX(0); }
          25%      { transform: translateX(-${effects.shakeIntensity}px); }
          75%      { transform: translateX(${effects.shakeIntensity}px); }
        }
        @keyframes harvestLabelIn {
          0%   { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes harvestNameIn {
          0%   { opacity: 0; transform: translateY(20px) scale(0.8); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes harvestNewBadge {
          0%   { opacity: 0; transform: rotate(15deg) scale(0); }
          60%  { transform: rotate(15deg) scale(1.3); }
          100% { opacity: 1; transform: rotate(15deg) scale(1); }
        }
        @keyframes harvestTapHint {
          0%, 100% { opacity: 0.4; }
          50%      { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default HarvestScreen;
