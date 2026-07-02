// ============================================
// 🎬 growthEffects.js - 成長演出の設定（一元管理）
// まなびの木 v1.0.5
// 新規作成: 2026/07/01（スレッド30）
// ============================================
// 📌 演出の調整はこのファイルだけ変えればOK！
//    - duration: 演出の長さ（ミリ秒）
//    - treeAnimation: 木のアニメーション名（index.cssのkeyframes）
//    - charPose: キャラのポーズ（MameCharacter/RobotCharacterのpose）
//    - message: 吹き出しに出るセリフ
//    - particles: 舞う絵文字（複数OK、なしなら null）
//    - particleCount: 粒子の数
// ============================================

export const GROWTH_FX = {
  // 🌿 葉が育った日（演出: 小）
  leaf: {
    duration: 2000,
    treeAnimation: 'tree-bounce 0.8s ease-out 2',
    charPose: 'happy',
    message: 'きが そだったよ！🌿',
    particles: ['🌿'],
    particleCount: 4,
  },

  // 🌸 花が咲いた日（演出: 中）
  flower: {
    duration: 2500,
    treeAnimation: 'tree-shimmer 1.2s ease-in-out 2',
    charPose: 'cheer',
    message: 'わぁ！おはなが さいたよ！🌸',
    particles: ['🌸', '✨'],
    particleCount: 8,
  },

  // 🍎 実がなった日（演出: 大！）
  fruit: {
    duration: 3000,
    treeAnimation: 'tree-boom 1.5s ease-out 1',
    charPose: 'medal',
    message: 'やったー！みが なったよ！！🍎✨',
    particles: ['🍎', '🎉', '✨'],
    particleCount: 12,
  },
};

// 演出のON/OFF（false にすると全演出停止）
export const GROWTH_FX_ENABLED = true;
