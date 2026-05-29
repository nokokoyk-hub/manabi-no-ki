// ============================================
// 🐕 まめのセリフ集
// シーン別にランダムでメッセージを表示
// ============================================

// ランダムに1つ選ぶヘルパー
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- ホーム画面 ---
export const HOME_MESSAGES = [
  'きょうも いっしょに がんばろ！',
  'まめと おべんきょう しよ！',
  'わくわく するね！',
  'きょうの ミッション、やってみよ！',
  'まめ、おうえん してるよ！',
];

// --- 問題出題中 ---
export const QUESTION_MESSAGES = [
  'どれかな〜？',
  'よーく かんがえてね！',
  'まめも いっしょに かんがえるよ！',
  'ゆっくりで いいよ！',
  'できるできる！',
];

// --- 正解！ ---
export const CORRECT_MESSAGES = [
  'すごーい！せいかい！🎉',
  'やったね！てんさい！✨',
  'まめ、うれしい！💖',
  'かっこいい〜！🌟',
  'ばっちり！すごいよ！',
  'せいかい！まめも うれしいワン！',
];

// --- 不正解 ---
export const WRONG_MESSAGES = [
  'おしい！もういっかい！',
  'だいじょうぶ！つぎ がんばろ！',
  'まちがえても へいき だよ！',
  'いっしょに かんがえよ！',
  'つぎは できるよ！',
];

// --- ミッション完了 ---
export const COMPLETE_MESSAGES = [
  'ミッション クリア！すごい！🏆',
  'がんばったね！まめも うれしい！💖',
  'きょうも えらいね！🌳',
  'まなびの木が おおきく なったよ！🌿',
];

// --- ストリーク ---
export const getStreakMessage = (streak) => {
  if (streak >= 7) return `${streak}にち れんぞく！てんさい！🔥`;
  if (streak >= 3) return `${streak}にち れんぞく！すごいね！✨`;
  if (streak >= 1) return `${streak}にち れんぞく がんばってるね！`;
  return 'きょうから はじめよう！';
};

// --- 各シーンのメッセージを取得 ---
export const getMameMessage = (scene) => {
  switch (scene) {
    case 'home': return pick(HOME_MESSAGES);
    case 'question': return pick(QUESTION_MESSAGES);
    case 'correct': return pick(CORRECT_MESSAGES);
    case 'wrong': return pick(WRONG_MESSAGES);
    case 'complete': return pick(COMPLETE_MESSAGES);
    default: return pick(HOME_MESSAGES);
  }
};
