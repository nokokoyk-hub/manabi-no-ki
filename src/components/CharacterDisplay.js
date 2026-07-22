// ============================================
// 🎭 CharacterDisplay - 汎用キャラ表示コンポーネント
// selectedCharacter に応じて適切なキャラを表示する
// v1.0.4: 新規作成（2026/06/29）
// v1.0.13: ガチャキャラ先生対応（GachaCharacter追加）
// ============================================

import React from 'react';
import MameCharacter from './MameCharacter';
import RobotCharacter from './RobotCharacter';
import GachaCharacter from './GachaCharacter';
import { isGachaCharacter } from '../lib/gachaData';

const CharacterDisplay = ({
  character = 'mame',   // 'mame' | 'robot' | ガチャキャラID（gachaData.js FRUITSのid）
  pose = 'normal',
  message = '',
  size = 80,
  name,                 // キャラの表示名（まめ名 / ロボ名 / ガチャキャラの固定名）
  equippedItem,         // まめ専用（着せ替えアイテム）
  enableTap = false,
}) => {
  if (character === 'robot') {
    return (
      <RobotCharacter
        pose={pose}
        message={message}
        size={size}
        robotName={name}
        enableTap={enableTap}
      />
    );
  }

  // 🎰 ガチャキャラ先生（コレクションで入手済みのキャラのみ選択可能。呼び出し側で入手済み判定済み）
  if (isGachaCharacter(character)) {
    return (
      <GachaCharacter
        charaId={character}
        pose={pose}
        message={message}
        size={size}
        name={name}
        enableTap={enableTap}
      />
    );
  }

  // まめ（デフォルト）
  return (
    <MameCharacter
      pose={pose}
      message={message}
      size={size}
      petName={name}
      equippedItem={equippedItem}
      enableTap={enableTap}
    />
  );
};

export default CharacterDisplay;
