// ============================================
// 👗 着せ替えアイテム定義
// ごほうびで獲得 → まめに装着！
// v0.7.2: 新規作成
// ============================================

const COSTUME_ITEMS = [
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
];

export default COSTUME_ITEMS;

export const getItemById = (id) => COSTUME_ITEMS.find(item => item.id === id);
