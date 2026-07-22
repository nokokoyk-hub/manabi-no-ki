// ============================================
// 🐕🤖 キャラクターのセリフ集
// シーン別にランダムでメッセージを表示
// v0.6.0: {name}プレースホルダーで名前カスタマイズ対応
// v1.0.2: ロボちゃん専用セリフ追加 + getCharaMessage()
// v1.0.7: ミッションクリア文言のキャラ対応 + ストリークのロボ口調追加（2026/07/03）
// v1.0.13: ガチャキャラ せんせい用の汎用セリフ追加（2026/07/21）
// ============================================

import { isGachaCharacter } from '../lib/gachaData';

// ランダムに1つ選ぶヘルパー
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// {name} をペット名に置換するヘルパー
const insertName = (text, name) => text.replace(/\{name\}/g, name || 'まめ');

// ============================================
// 🐕 まめ（豆しば）セリフ
// ============================================

export const HOME_MESSAGES = [
  'きょうも いっしょに がんばろ！',
  '{name}と おべんきょう しよ！',
  'わくわく するね！',
  'きょうの ミッション、やってみよ！',
  '{name}、おうえん してるよ！',
  'しっぽ ふりふり まってたよ！',
  'きょうは なにを まなぶ？',
];

export const QUESTION_MESSAGES = [
  'どれかな〜？',
  'よーく かんがえてね！',
  '{name}も いっしょに かんがえるよ！',
  'ゆっくりで いいよ！',
  'できるできる！',
  'しっぽ ぴーん！きあい いれるワン！',
  'ヒントは もんだいの なかに あるよ！',
];

export const CORRECT_MESSAGES = [
  'すごーい！せいかい！🎉',
  'やったね！てんさい！✨',
  '{name}、うれしい！💖',
  'かっこいい〜！🌟',
  'ばっちり！すごいよ！',
  'せいかい！{name}も うれしいワン！',
  'おみごと！はなまる！💮',
  '{name}の しっぽが とまらないワン！',
];

export const WRONG_MESSAGES = [
  'おしい！もういっかい！',
  'だいじょうぶ！つぎ がんばろ！',
  'まちがえても へいき だよ！',
  'いっしょに かんがえよ！',
  'つぎは できるよ！',
  'まちがいは せいちょうの チャンス！',
  '{name}が ついてるよ！',
];

export const COMPLETE_MESSAGES = [
  'ミッション クリア！すごい！🏆',
  'がんばったね！{name}も うれしい！💖',
  'きょうも えらいね！🌳',
  'まなびの木が おおきく なったよ！🌿',
  '{name}と いっしょに せいちょう してるね！🌟',
];

// きょうのミッション完了後のホーム画面（v1.0.7: HomeScreen直書きから移設・文言は従来と同一）
export const MISSION_DONE_MESSAGES = [
  'きょうの ミッション クリア！えらいね！🎉',
];

// ============================================
// 🤖 ロボちゃん セリフ
// ============================================

const ROBOT_HOME_MESSAGES = [
  'きょうも いっしょに がんばろ！',
  '{name}と おべんきょう しよ！',
  'わくわく するね！ピコ！',
  'ミッション スタンバイ かんりょう！',
  '{name}、おうえん してるよ！',
  'アンテナ びびび！やるきマンマン！',
  'きょうも まなびの データ ためよう！',
];

const ROBOT_QUESTION_MESSAGES = [
  'どれかな〜？',
  'よーく かんがえてね！',
  '{name}も いっしょに かんがえるよ！',
  'ゆっくりで いいよ！',
  'できるできる！',
  'のうみそ フル回転 させてね！ピコ！',
  'データ ぶんせきちゅう…！🔍',
  'アンテナが ビビッと きてるよ！',
];

const ROBOT_CORRECT_MESSAGES = [
  'すごーい！せいかい！🎉',
  'やったね！てんさい！✨',
  '{name}、うれしい！💖',
  'かっこいい〜！🌟',
  'ばっちり！すごいよ！',
  'せいかい！{name}の ライトが ピカーン！💡',
  'おみごと！かんぺき！ピコピコ！🏅',
  'データ しょうごう… 100てん！✨',
];

const ROBOT_WRONG_MESSAGES = [
  'おしい！もういっかい！',
  'だいじょうぶ！つぎ がんばろ！',
  'まちがえても へいき だよ！',
  'いっしょに かんがえよ！',
  'つぎは できるよ！',
  'エラーは せいちょうの もと！ピコ！',
  'さいチャレンジ スタンバイ！💪',
  '{name}も いっしょに リトライ するよ！',
];

const ROBOT_COMPLETE_MESSAGES = [
  'ミッション クリア！すごい！🏆',
  'がんばったね！{name}も うれしい！💖',
  'きょうも えらいね！🌳',
  'まなびの木が おおきく なったよ！🌿',
  'ミッション かんりょう！データ ほぞん したよ！📊',
  '{name}の パワー ぜんかい だったね！⚡',
];

// ミッション完了後のホーム画面（ロボちゃん版・v1.0.7）
const ROBOT_MISSION_DONE_MESSAGES = [
  'ミッション コンプリート！きょうも がんばったね！🎉',
];

// ============================================
// 🎰 ガチャキャラ せんせい 共通セリフ（v1.0.13）
// にじぴよ/ぽっけ/ももぴ/ガーディ/ライドラ/ひめにゃ 共通で使う
// かわいい共通口調（「〜だよ！」系）
// ============================================

const GACHA_HOME_MESSAGES = [
  'きょうも いっしょに がんばろうね！',
  '{name}と おべんきょう しよ！',
  'わくわく するね！',
  'きょうの ミッション、やってみよ！',
  '{name}、おうえん してるよ！',
  'きょうは なにを まなぶ？',
];

const GACHA_QUESTION_MESSAGES = [
  'どれかな〜？',
  'よーく かんがえてね！',
  '{name}も いっしょに かんがえるよ！',
  'ゆっくりで いいよ！',
  'できるできる！',
];

const GACHA_CORRECT_MESSAGES = [
  'すごーい！せいかいだよ！🎉',
  'やったね！てんさい！✨',
  '{name}、うれしいよ！💖',
  'かっこいい〜！🌟',
  'ばっちり！すごいよ！',
];

const GACHA_WRONG_MESSAGES = [
  'おしい！もういっかい！',
  'だいじょうぶ！つぎ がんばろ！',
  'まちがえても へいき だよ！',
  'いっしょに かんがえよ！',
  'つぎは できるよ！',
];

const GACHA_COMPLETE_MESSAGES = [
  'ミッション クリア！すごいよ！🏆',
  'がんばったね！{name}も うれしい！💖',
  'きょうも えらいね！🌳',
];

// ミッション完了後のホーム画面（ガチャキャラ版）
const GACHA_MISSION_DONE_MESSAGES = [
  'きょうの ミッション クリア！えらいね！🎉',
];

// ガチャキャラ用セリフ取得
export const getGachaCharaMessage = (scene, name) => {
  let msg;
  switch (scene) {
    case 'home': msg = pick(GACHA_HOME_MESSAGES); break;
    case 'question': msg = pick(GACHA_QUESTION_MESSAGES); break;
    case 'correct': msg = pick(GACHA_CORRECT_MESSAGES); break;
    case 'wrong': msg = pick(GACHA_WRONG_MESSAGES); break;
    case 'complete': msg = pick(GACHA_COMPLETE_MESSAGES); break;
    case 'missionDone': msg = pick(GACHA_MISSION_DONE_MESSAGES); break;
    default: msg = pick(GACHA_HOME_MESSAGES); break;
  }
  return insertName(msg, name || 'せんせい');
};

// ============================================
// 📦 セリフ取得関数
// ============================================

// ストリーク（v1.0.7: キャラ別口調に対応。第2引数省略時は従来どおりまめ口調＝後方互換）
export const getStreakMessage = (streak, character = 'mame') => {
  if (character === 'robot') {
    if (streak >= 7) return `${streak}にち れんぞく！てんさいと けいさんが でたよ！🔥`;
    if (streak >= 3) return `${streak}にち れんぞく！データが かがやいてる！✨`;
    if (streak >= 1) return `${streak}にち れんぞく きろく こうしんちゅう！ピコ！`;
    return 'きょうから スタート だよ！ピコ！';
  }
  if (isGachaCharacter(character)) {
    if (streak >= 7) return `${streak}にち れんぞく！てんさいだよ！🔥`;
    if (streak >= 3) return `${streak}にち れんぞく！すごいね！✨`;
    if (streak >= 1) return `${streak}にち れんぞく がんばってるね！`;
    return 'きょうから はじめよう！';
  }
  if (streak >= 7) return `${streak}にち れんぞく！てんさい！🔥`;
  if (streak >= 3) return `${streak}にち れんぞく！すごいね！✨`;
  if (streak >= 1) return `${streak}にち れんぞく がんばってるね！`;
  return 'きょうから はじめよう！';
};

// まめ用セリフ取得（後方互換）
export const getMameMessage = (scene, petName) => {
  let msg;
  switch (scene) {
    case 'home': msg = pick(HOME_MESSAGES); break;
    case 'question': msg = pick(QUESTION_MESSAGES); break;
    case 'correct': msg = pick(CORRECT_MESSAGES); break;
    case 'wrong': msg = pick(WRONG_MESSAGES); break;
    case 'complete': msg = pick(COMPLETE_MESSAGES); break;
    case 'missionDone': msg = pick(MISSION_DONE_MESSAGES); break;
    default: msg = pick(HOME_MESSAGES); break;
  }
  return insertName(msg, petName);
};

// ロボちゃん用セリフ取得
export const getRobotMessage = (scene, robotName) => {
  let msg;
  switch (scene) {
    case 'home': msg = pick(ROBOT_HOME_MESSAGES); break;
    case 'question': msg = pick(ROBOT_QUESTION_MESSAGES); break;
    case 'correct': msg = pick(ROBOT_CORRECT_MESSAGES); break;
    case 'wrong': msg = pick(ROBOT_WRONG_MESSAGES); break;
    case 'complete': msg = pick(ROBOT_COMPLETE_MESSAGES); break;
    case 'missionDone': msg = pick(ROBOT_MISSION_DONE_MESSAGES); break;
    default: msg = pick(ROBOT_HOME_MESSAGES); break;
  }
  return insertName(msg, robotName || 'ロボちゃん');
};

// 🎯 キャラ別セリフ取得（v1.0.2〜推奨）
export const getCharaMessage = (scene, name, character = 'mame') => {
  if (character === 'robot') return getRobotMessage(scene, name);
  if (isGachaCharacter(character)) return getGachaCharaMessage(scene, name);
  return getMameMessage(scene, name);
};
