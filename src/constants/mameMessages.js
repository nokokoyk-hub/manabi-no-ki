// ============================================
// 🐕 キャラクターのセリフ集
// シーン別にランダムでメッセージを表示
// v0.6.0: {name}プレースホルダーで名前カスタマイズ対応
// ============================================

// ランダムに1つ選ぶヘルパー
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// {name} をペット名に置換するヘルパー
const insertName = (text, name) => text.replace(/\{name\}/g, name || 'まめ');

// --- ホーム画面 ---
export const HOME_MESSAGES = [
  'きょうも いっしょに がんばろ！',
  '{name}と おべんきょう しよ！',
  'わくわく するね！',
  'きょうの ミッション、やってみよ！',
  '{name}、おうえん してるよ！',
];

// --- 問題出題中 ---
export const QUESTION_MESSAGES = [
  'どれかな〜？',
  'よーく かんがえてね！',
  '{name}も いっしょに かんがえるよ！',
  'ゆっくりで いいよ！',
  'できるできる！',
];

// --- 正解！ ---
export const CORRECT_MESSAGES = [
  'すごーい！せいかい！🎉',
  'やったね！てんさい！✨',
  '{name}、うれしい！💖',
  'かっこいい〜！🌟',
  'ばっちり！すごいよ！',
  'せいかい！{name}も うれしいワン！',
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
  'がんばったね！{name}も うれしい！💖',
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
// petName を渡すと {name} が差し替わる
export const getMameMessage = (scene, petName) => {
  let msg;
  switch (scene) {
    case 'home': msg = pick(HOME_MESSAGES); break;
    case 'question': msg = pick(QUESTION_MESSAGES); break;
    case 'correct': msg = pick(CORRECT_MESSAGES); break;
    case 'wrong': msg = pick(WRONG_MESSAGES); break;
    case 'complete': msg = pick(COMPLETE_MESSAGES); break;
    default: msg = pick(HOME_MESSAGES); break;
  }
  return insertName(msg, petName);
};
