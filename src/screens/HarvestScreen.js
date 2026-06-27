// ============================================
// 🎰 HarvestScreen.js - 収穫ガチャ演出画面
// フルーツ: レアリティ別エフェクト → ドーン！
// キャラ: 画面ヒビ割れ → ガラス砕ける → 降臨！！
// v1.0.3: 果実コレクション + キャラガチャ
// ============================================

import React, { useState, useEffect } from 'react';
import { RARITY_INFO, EFFECTS, CHARACTER_EFFECT } from '../lib/gachaData';

const HarvestScreen = ({ fruit, isNew, onClose }) => {
  const [phase, setPhase] = useState('intro');
  const isCharacter = fruit.type === 'character';
  const rarityInfo = RARITY_INFO[fruit.rarity];
  const effects = EFFECTS[fruit.rarity];

  useEffect(() => {
    if (isCharacter) {
      // キャラ降臨: intro → glow → crack → shatter → flash → reveal → done
      const ci = CHARACTER_EFFECT;
      const timers = [
        setTimeout(() => setPhase('glow'),    500),
        setTimeout(() => setPhase('crack'),   ci.crackDelay),
        setTimeout(() => setPhase('shatter'), ci.crackDelay + 600),
        setTimeout(() => setPhase('flash'),   ci.crackDelay + 1200),
        setTimeout(() => setPhase('reveal'),  ci.revealDelay),
        setTimeout(() => setPhase('done'),    ci.duration),
      ];
      return () => timers.forEach(clearTimeout);
    } else {
      const t1 = setTimeout(() => setPhase('reveal'), 600);
      const t2 = setTimeout(() => setPhase('done'), 600 + effects.duration);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isCharacter, effects]);

  const handleTap = () => { if (phase === 'done') onClose(); };
  const ci = CHARACTER_EFFECT.images || {};

  // ========== キャラ降臨演出 ==========
  if (isCharacter) {
    const showReveal = phase === 'reveal' || phase === 'done';

    return (
      <div onClick={handleTap} style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000,
        background: showReveal
          ? `radial-gradient(circle, ${rarityInfo.bgColor}ee 0%, rgba(0,0,0,0.8) 100%)`
          : 'rgba(0,0,0,0.95)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.5s ease',
        cursor: phase === 'done' ? 'pointer' : 'default',
        overflow: 'hidden',
        fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
      }}>

        {/* ① 予兆光 */}
        {phase === 'glow' && ci.glow && (
          <img src={ci.glow} alt="" style={{
            position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
            animation: 'charaFadeIn 0.8s ease-out forwards', opacity: 0,
            pointerEvents: 'none',
          }} />
        )}

        {/* ② 小さなヒビ */}
        {phase === 'crack' && ci.crack && (
          <img src={ci.crack} alt="" style={{
            position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
            animation: 'charaCrackPop 0.4s ease-out forwards', opacity: 0,
            pointerEvents: 'none',
          }} />
        )}

        {/* ③ 画面バリバリ */}
        {phase === 'shatter' && ci.shatter && (
          <img src={ci.shatter} alt="" style={{
            position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
            animation: 'charaShatterIn 0.5s ease-out forwards', opacity: 0,
            pointerEvents: 'none',
          }} />
        )}

        {/* ④ ガラス破片飛散 + ⑤ 光の爆発 */}
        {phase === 'flash' && (
          <>
            {ci.burst && <img src={ci.burst} alt="" style={{
              position: 'absolute', width: '120%', height: '120%', objectFit: 'cover',
              animation: 'charaBurstOut 0.8s ease-out forwards', opacity: 0,
              pointerEvents: 'none',
            }} />}
            {ci.flash && <img src={ci.flash} alt="" style={{
              position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
              animation: 'charaFlashIn 0.6s 0.2s ease-out forwards', opacity: 0,
              pointerEvents: 'none',
            }} />}
          </>
        )}

        {/* ⑥ 虹色稲妻（reveal時の背景） */}
        {showReveal && ci.thunder && (
          <img src={ci.thunder} alt="" style={{
            position: 'absolute', width: '100%', height: '100%', objectFit: 'cover',
            animation: 'charaFadeIn 1s ease-out forwards', opacity: 0,
            pointerEvents: 'none',
          }} />
        )}

        {/* 「なかまが あらわれた！」 */}
        {showReveal && (
          <div style={{
            position: 'absolute', top: '10%', fontSize: 22, fontWeight: 900,
            color: 'white', textShadow: `0 0 15px ${rarityInfo.color}aa, 0 2px 4px rgba(0,0,0,0.5)`,
            opacity: 0, animation: 'harvestLabelIn 0.6s 0.3s ease-out forwards',
          }}>
            ✨ なかまが あらわれた！ ✨
          </div>
        )}

        {/* レアリティ */}
        {showReveal && (
          <div style={{
            position: 'absolute', top: '16%', fontSize: 16, fontWeight: 900,
            color: rarityInfo.color, letterSpacing: 3,
            textShadow: `0 0 20px ${rarityInfo.color}88`,
            opacity: 0, animation: 'harvestLabelIn 0.5s 0.6s ease-out forwards',
          }}>
            {rarityInfo.emoji} {rarityInfo.label} {rarityInfo.emoji}
          </div>
        )}

        {/* キャラ画像 */}
        {showReveal && (
          <div style={{
            position: 'relative', zIndex: 2,
            animation: 'charaRevealIn 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
            opacity: 0, transform: 'scale(0) translateY(50px)',
          }}>
            <img src={fruit.image} alt={fruit.name} style={{
              width: 220, height: 220, objectFit: 'contain',
              filter: `drop-shadow(0 0 40px ${rarityInfo.color}88) drop-shadow(0 0 80px ${rarityInfo.color}44)`,
            }} />
            {isNew && (
              <div style={{
                position: 'absolute', top: -15, right: -25,
                background: 'linear-gradient(135deg, #FF6B6B, #FF4757)',
                color: 'white', fontSize: 16, fontWeight: 900,
                padding: '5px 14px', borderRadius: 20, transform: 'rotate(15deg)',
                boxShadow: '0 2px 10px rgba(255,71,87,0.5)',
                animation: 'harvestNewBadge 0.5s 1s ease-out forwards', opacity: 0,
              }}>NEW!</div>
            )}
          </div>
        )}

        {/* キャラ名 */}
        {showReveal && (
          <div style={{
            marginTop: 20, fontSize: 32, fontWeight: 900, color: 'white', zIndex: 2,
            textShadow: `0 0 20px ${rarityInfo.color}aa, 0 3px 6px rgba(0,0,0,0.5)`,
            opacity: 0, animation: 'harvestNameIn 0.6s 0.8s ease-out forwards',
          }}>
            {fruit.emoji || ''} {fruit.name}
          </div>
        )}

        {phase === 'done' && (
          <div style={{
            position: 'absolute', bottom: '10%', fontSize: 14,
            color: 'rgba(255,255,255,0.6)', zIndex: 2,
            animation: 'harvestTapHint 1.5s ease-in-out infinite',
          }}>タップして とじる</div>
        )}

        <style>{`
          @keyframes charaFadeIn { 0% { opacity:0; } 100% { opacity:0.8; } }
          @keyframes charaCrackPop { 0% { opacity:0; transform:scale(0.5); } 100% { opacity:1; transform:scale(1); } }
          @keyframes charaShatterIn { 0% { opacity:0; transform:scale(0.8); } 50% { opacity:1; } 100% { opacity:1; transform:scale(1); } }
          @keyframes charaBurstOut { 0% { opacity:0; transform:scale(0.5); } 50% { opacity:1; transform:scale(1); } 100% { opacity:0; transform:scale(1.5); } }
          @keyframes charaFlashIn { 0% { opacity:0; transform:scale(0.3); } 50% { opacity:1; } 100% { opacity:0.9; transform:scale(1); } }
          @keyframes charaRevealIn { 0% { opacity:0; transform:scale(0) translateY(50px); } 60% { opacity:1; transform:scale(1.2) translateY(-10px); } 80% { transform:scale(0.95) translateY(5px); } 100% { opacity:1; transform:scale(1) translateY(0); } }
          @keyframes harvestLabelIn { 0% { opacity:0; transform:translateY(-20px); } 100% { opacity:1; transform:translateY(0); } }
          @keyframes harvestNameIn { 0% { opacity:0; transform:translateY(20px) scale(0.8); } 100% { opacity:1; transform:translateY(0) scale(1); } }
          @keyframes harvestNewBadge { 0% { opacity:0; transform:rotate(15deg) scale(0); } 60% { transform:rotate(15deg) scale(1.3); } 100% { opacity:1; transform:rotate(15deg) scale(1); } }
          @keyframes harvestTapHint { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
        `}</style>
      </div>
    );
  }

  // ========== フルーツ演出 ==========
  return (
    <div onClick={handleTap} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10000,
      background: phase === 'intro' ? 'rgba(0,0,0,0.9)'
        : `radial-gradient(circle, ${rarityInfo.bgColor}ee 0%, rgba(0,0,0,0.85) 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.8s ease', cursor: phase === 'done' ? 'pointer' : 'default',
      overflow: 'hidden', fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    }}>
      {phase !== 'intro' && effects.bg && (
        <img src={effects.bg} alt="" style={{ position: 'absolute', width: '120%', maxWidth: 600, height: 'auto', animation: 'fruitEffectIn 1.2s ease-out forwards', opacity: 0, pointerEvents: 'none' }} />
      )}
      {phase !== 'intro' && effects.overlay && (
        <img src={effects.overlay} alt="" style={{ position: 'absolute', width: '110%', maxWidth: 550, height: 'auto', opacity: 0, animation: 'fruitOverlayIn 1.5s 0.5s ease-out forwards', pointerEvents: 'none' }} />
      )}
      {phase !== 'intro' && (
        <div style={{ position: 'absolute', top: '12%', fontSize: 22, fontWeight: 900, color: rarityInfo.color, textShadow: `0 0 20px ${rarityInfo.color}66`, opacity: 0, animation: 'harvestLabelIn 0.6s 0.8s ease-out forwards', letterSpacing: 4 }}>
          {rarityInfo.emoji} {rarityInfo.label} {rarityInfo.emoji}
        </div>
      )}
      {phase !== 'intro' && (
        <div style={{ position: 'relative', animation: 'fruitBounceIn 0.8s 0.3s cubic-bezier(0.34,1.56,0.64,1) forwards', opacity: 0, transform: 'scale(0)' }}>
          <img src={fruit.image} alt={fruit.name} style={{
            width: 200, height: 200, objectFit: 'contain',
            filter: fruit.rarity === 'legend' ? 'drop-shadow(0 0 30px rgba(255,215,0,0.8))' : fruit.rarity === 'super_rare' ? 'drop-shadow(0 0 20px rgba(156,39,176,0.6))' : fruit.rarity === 'rare' ? 'drop-shadow(0 0 15px rgba(255,152,0,0.5))' : 'drop-shadow(0 0 10px rgba(139,195,74,0.4))',
          }} />
          {isNew && (
            <div style={{ position: 'absolute', top: -10, right: -20, background: 'linear-gradient(135deg,#FF6B6B,#FF4757)', color: 'white', fontSize: 14, fontWeight: 900, padding: '4px 12px', borderRadius: 20, transform: 'rotate(15deg)', boxShadow: '0 2px 10px rgba(255,71,87,0.5)', animation: 'harvestNewBadge 0.5s 1.2s ease-out forwards', opacity: 0 }}>NEW!</div>
          )}
        </div>
      )}
      {phase !== 'intro' && (
        <div style={{ marginTop: 24, fontSize: 28, fontWeight: 900, color: 'white', textShadow: `0 0 15px ${rarityInfo.color}88`, opacity: 0, animation: 'harvestNameIn 0.6s 1s ease-out forwards' }}>{fruit.name}</div>
      )}
      {phase === 'done' && (
        <div style={{ position: 'absolute', bottom: '10%', fontSize: 14, color: 'rgba(255,255,255,0.6)', animation: 'harvestTapHint 1.5s ease-in-out infinite' }}>タップして とじる</div>
      )}
      <style>{`
        @keyframes fruitEffectIn { 0% { opacity:0; transform:scale(0.3) rotate(-10deg); } 50% { opacity:1; transform:scale(1.1) rotate(5deg); } 100% { opacity:0.8; transform:scale(1) rotate(0); } }
        @keyframes fruitOverlayIn { 0% { opacity:0; transform:scale(0.5); } 100% { opacity:0.6; transform:scale(1) rotate(360deg); } }
        @keyframes fruitBounceIn { 0% { opacity:0; transform:scale(0); } 60% { opacity:1; transform:scale(1.3); } 80% { transform:scale(0.9); } 100% { opacity:1; transform:scale(1); } }
        @keyframes harvestLabelIn { 0% { opacity:0; transform:translateY(-20px); } 100% { opacity:1; transform:translateY(0); } }
        @keyframes harvestNameIn { 0% { opacity:0; transform:translateY(20px) scale(0.8); } 100% { opacity:1; transform:translateY(0) scale(1); } }
        @keyframes harvestNewBadge { 0% { opacity:0; transform:rotate(15deg) scale(0); } 60% { transform:rotate(15deg) scale(1.3); } 100% { opacity:1; transform:rotate(15deg) scale(1); } }
        @keyframes harvestTapHint { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
      `}</style>
    </div>
  );
};

export default HarvestScreen;
