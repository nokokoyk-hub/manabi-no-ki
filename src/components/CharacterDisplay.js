// ============================================
// 🎭 CharacterDisplay - 汎用キャラ表示コンポーネント
// selectedCharacter に応じて適切なキャラを表示する
// v1.0.4: 新規作成（2026/06/29）
// ============================================
// 📌 将来のガチャキャラ先生対応:
//    FRUITS配列のtype:'character'のキャラをここに追加するだけ
//    → 全画面で自動的にそのキャラが先生として表示される
// ============================================

import React from 'react';
import MameCharacter from './MameCharacter';
import RobotCharacter from './RobotCharacter';

const CharacterDisplay = ({
  character = 'mame',   // 'mame' | 'robot' | 将来のキャラID
  pose = 'normal',
  message = '',
  size = 80,
  name,                 // キャラの表示名（まめ名 or ロボ名）
  equippedItem,         // まめ専用（着せ替えアイテム）
  enableTap = false,
}) => {
  switch (character) {
    case 'robot':
      return (
        <RobotCharacter
          pose={pose}
          message={message}
          size={size}
          robotName={name}
          enableTap={enableTap}
        />
      );

    // ===== 🎰 将来のガチャキャラ先生 =====
    // ガチャキャラを先生にする場合はここに case を追加:
    //
    // case 'momopi':
    //   return <GachaCharacterDisplay id="momopi" pose={pose} message={message} size={size} name={name} />;
    // case 'himenya':
    //   return <GachaCharacterDisplay id="himenya" pose={pose} message={message} size={size} name={name} />;
    //
    // GachaCharacterDisplay は gachaData.js の画像パスを参照して表示する新コンポーネント
    // ============================================

    default:
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
  }
};

export default CharacterDisplay;
