// ============================================
// 🎰 GachaCharacter - ガチャキャラ せんせいコンポーネント
// ガチャで入手した1枚絵キャラを「せんせい」として表示する
// v1.0.13: 新規作成
// ============================================
// ・ポーズ芸はできないので「立ち絵 + 吹き出し」方式
// ・吹き出しの見た目は MameCharacter.js を踏襲
// ・pose は受け取っても無視（1枚絵のため）
// ・画像load失敗時は emoji で大きくフォールバック
// ============================================

import React, { useState, useCallback } from 'react';
import { getFruitById } from '../lib/gachaData';

const GachaCharacter = ({
  charaId,
  // eslint-disable-next-line no-unused-vars
  pose = 'normal',   // 1枚絵のため未使用（他キャラコンポーネントとAPIを揃えるために受け取る）
  message = '',
  size = 80,
  name,
  enableTap = true,
  messagePosition = 'top',
  style = {},
}) => {
  const [isTapped, setIsTapped] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fruit = getFruitById(charaId);
  const displayName = name || fruit?.name || 'せんせい';
  const emoji = fruit?.emoji || '❓';
  const hasImage = !!fruit?.image && !imgError;

  // ふわふわ浮遊（index.cssの既存keyframesを流用）
  const animation = isTapped
    ? 'mame-tap 0.5s ease-out'
    : 'mame-float 2.4s ease-in-out infinite';

  const handleTap = useCallback(() => {
    if (!enableTap || isTapped) return;
    setIsTapped(true);
    setTimeout(() => setIsTapped(false), 500);
  }, [enableTap, isTapped]);

  const isRight = messagePosition === 'right';
  const isTopLeft = messagePosition === 'top-left';

  // 吹き出し要素（MameCharacterと同じ見た目）
  const bubble = message ? (
    <div style={{
      background: 'white',
      borderRadius: 16,
      padding: '8px 14px',
      fontSize: 13,
      fontWeight: 700,
      color: '#5D4037',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'relative',
      maxWidth: isRight ? 180 : 200,
      textAlign: 'center',
      animation: 'mame-fadeIn 0.3s ease-out',
      lineHeight: 1.5,
      flexShrink: 0,
      ...(isTopLeft ? { alignSelf: 'flex-end' } : {}),
    }}>
      {message}
      {/* 三角（矢印）*/}
      {isRight ? (
        <div style={{
          position: 'absolute',
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 0, height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '8px solid white',
        }} />
      ) : (
        <div style={{
          position: 'absolute',
          bottom: -8,
          ...(isTopLeft ? { right: 20 } : { left: '50%', transform: 'translateX(-50%)' }),
          width: 0, height: 0,
          borderLeft: '8px solid transparent',
          borderRight: '8px solid transparent',
          borderTop: '8px solid white',
        }} />
      )}
    </div>
  ) : null;

  return (
    <div style={{
      display: 'flex',
      flexDirection: isRight ? 'row' : 'column',
      alignItems: 'center',
      gap: isRight ? 6 : 8,
      ...style,
    }}>
      {!isRight && bubble}

      <div
        onClick={handleTap}
        style={{
          position: 'relative',
          cursor: enableTap ? 'pointer' : 'default',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {hasImage ? (
          <img
            src={fruit.image}
            alt={displayName}
            onError={() => setImgError(true)}
            style={{
              width: size,
              height: size,
              objectFit: 'contain',
              animation,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))',
            }}
          />
        ) : (
          <div style={{
            width: size,
            height: size,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.75,
            lineHeight: 1,
            animation,
          }}>
            {emoji}
          </div>
        )}
      </div>

      {isRight && bubble}
    </div>
  );
};

export default GachaCharacter;
