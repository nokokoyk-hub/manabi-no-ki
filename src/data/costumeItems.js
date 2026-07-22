// ============================================
// 👗 着せ替えアイテム定義
// ごほうびで獲得 → まめに装着！
// v0.7.2: 新規作成
// v1.0.14: カテゴリごとに重ねづけ対応（あたま/かお/くび/て）
//          新規アイテム8個追加（計16個）+ collection型の解放条件を追加
// ============================================

// 🗂️ カテゴリ（日本語）→ 装着スロットキー（英語）の対応表
// equippedItems（storage.js）はこの英語キーで管理する
export const CATEGORY_TO_SLOT = {
  'あたま': 'head',
  'かお': 'face',
  'くび': 'neck',
  'て': 'hand',
};

// スロット表示順 + 見出し用ラベル（UI側で利用）
export const CATEGORY_ORDER = ['head', 'face', 'neck', 'hand'];

export const SLOT_LABELS = {
  head: { emoji: '👒', label: 'あたま' },
  face: { emoji: '👀', label: 'かお' },
  neck: { emoji: '🧣', label: 'くび' },
  hand: { emoji: '✋', label: 'て' },
};

const COSTUME_ITEMS = [
  // ------------------------------------------
  // 🌱 既存アイテム（id・解放条件は変更しない）
  // ------------------------------------------
  {
    id: 'ribbon',
    name: 'ピンクリボン',
    emoji: '🎀',
    category: 'あたま',
    position: { top: '-10%', left: '55%' },
    size: 0.35,
    unlockType: 'mission_count',
    unlockValue: 1,
    unlockLabel: 'はじめての ミッション クリア！',
  },
  {
    id: 'crown',
    name: 'おうかん',
    emoji: '👑',
    category: 'あたま',
    position: { top: '-18%', left: '50%' },
    size: 0.4,
    unlockType: 'streak',
    unlockValue: 3,
    unlockLabel: '3にち れんぞく ストリーク！',
  },
  {
    id: 'sunglasses',
    name: 'サングラス',
    emoji: '🕶️',
    category: 'かお',
    position: { top: '15%', left: '50%' },
    size: 0.35,
    unlockType: 'perfect',
    unlockValue: 1,
    unlockLabel: 'はじめての パーフェクト！',
  },
  {
    id: 'flower_crown',
    name: 'おはなの かんむり',
    emoji: '🌸',
    category: 'あたま',
    position: { top: '-12%', left: '45%' },
    size: 0.35,
    unlockType: 'puzzle',
    unlockValue: 1,
    unlockLabel: 'パズル 1まい かんせい！',
  },
  {
    id: 'tophat',
    name: 'シルクハット',
    emoji: '🎩',
    category: 'あたま',
    position: { top: '-20%', left: '50%' },
    size: 0.4,
    unlockType: 'puzzle',
    unlockValue: 2,
    unlockLabel: 'パズル 2まい かんせい！',
  },
  {
    id: 'scarf',
    name: 'マフラー',
    emoji: '🧣',
    category: 'くび',
    position: { top: '55%', left: '50%' },
    size: 0.35,
    unlockType: 'streak',
    unlockValue: 7,
    unlockLabel: '7にち れんぞく ストリーク！',
  },
  {
    id: 'star',
    name: 'スーパースター',
    emoji: '⭐',
    category: 'あたま',
    position: { top: '-15%', left: '60%' },
    size: 0.3,
    unlockType: 'mission_count',
    unlockValue: 10,
    unlockLabel: 'ミッション 10かい クリア！',
  },
  {
    id: 'heart_glasses',
    name: 'ハートめがね',
    emoji: '💖',
    category: 'かお',
    position: { top: '15%', left: '50%' },
    size: 0.3,
    unlockType: 'streak',
    unlockValue: 14,
    unlockLabel: '14にち れんぞく！すごすぎ！',
  },

  // ------------------------------------------
  // 🆕 新規アイテム（v1.0.14: 梅プラン8個追加）
  // ------------------------------------------
  {
    id: 'grad_cap',
    name: 'そつぎょうハット',
    emoji: '🎓',
    category: 'あたま',
    position: { top: '-18%', left: '50%' },
    size: 0.38,
    unlockType: 'mission_count',
    unlockValue: 30,
    unlockLabel: 'ミッション 30かい クリア！',
  },
  {
    id: 'headphones',
    name: 'ヘッドホン',
    emoji: '🎧',
    category: 'あたま',
    position: { top: '-2%', left: '50%' },
    size: 0.42,
    unlockType: 'mission_count',
    unlockValue: 50,
    unlockLabel: 'ミッション 50かい クリア！がくしゅうマスター！',
  },
  {
    id: 'goggles',
    name: 'すいえいゴーグル',
    emoji: '🥽',
    category: 'かお',
    position: { top: '15%', left: '50%' },
    size: 0.32,
    unlockType: 'perfect',
    unlockValue: 5,
    unlockLabel: 'パーフェクト 5かい たっせい！',
  },
  {
    id: 'necktie',
    name: 'ネクタイ',
    emoji: '👔',
    category: 'くび',
    position: { top: '58%', left: '50%' },
    size: 0.3,
    unlockType: 'perfect',
    unlockValue: 10,
    unlockLabel: 'パーフェクト 10かい たっせい！',
  },
  {
    id: 'magic_wand',
    name: 'まほうのつえ',
    emoji: '🪄',
    category: 'て',
    position: { top: '62%', left: '22%' },
    size: 0.3,
    unlockType: 'puzzle',
    unlockValue: 3,
    unlockLabel: 'パズル 3まい かんせい！',
  },
  {
    id: 'flag_hand',
    name: 'おうえんフラッグ',
    emoji: '🚩',
    category: 'て',
    position: { top: '60%', left: '78%' },
    size: 0.32,
    unlockType: 'streak',
    unlockValue: 60,
    unlockLabel: '60にち れんぞく！でんせつの がくしゅうか！',
  },
  {
    id: 'rainbow_band',
    name: 'にじのヘアバンド',
    emoji: '🌈',
    category: 'あたま',
    position: { top: '-8%', left: '50%' },
    size: 0.36,
    unlockType: 'collection',
    unlockValue: 10,
    unlockLabel: 'ずかん 10しゅるい あつめた！',
  },
  {
    id: 'trophy_crown',
    name: 'おうごんカップ',
    emoji: '🏆',
    category: 'あたま',
    position: { top: '-22%', left: '50%' },
    size: 0.35,
    unlockType: 'collection',
    unlockValue: 25,
    unlockLabel: 'ずかん 25しゅるい あつめた！ものすごい コレクターだ！',
  },
];

export default COSTUME_ITEMS;

export const getItemById = (id) => COSTUME_ITEMS.find(item => item.id === id);
