// ============================================
// 🧩 パズル定義データ
// ごほうびパズルの絵とメタデータ
// v0.7.1: 新規作成
// v1.0.14+: パズル2種追加（花火・海の冒険）
// ============================================

const PUZZLES = [
  {
    id: 'spring',
    title: 'はるの おはなばたけ',
    description: 'まめと おはなが いっぱい！🌸',
    image: '/public/images/puzzles/puzzle_spring.png',
    pieces: 9,
  },
  {
    id: 'summer',
    title: 'まめと なつの うみ',
    description: 'まめが うみで あそんでるよ！🌊',
    image: '/public/images/puzzles/puzzle_summer.png',
    pieces: 9,
  },
  {
    id: 'night',
    title: 'おほしさまの よる',
    description: 'まめと おほしさま キラキラ！🌟',
    image: '/public/images/puzzles/puzzle_night.png',
    pieces: 9,
  },
  {
    id: 'fireworks',
    title: 'まめと はなびの よる',
    description: 'きれいな はなびを みてるよ！🎆',
    image: '/public/images/puzzles/puzzle_fireworks.png',
    pieces: 9,
  },
  {
    id: 'ocean',
    title: 'まめの うみの ぼうけん',
    description: 'うみの なかを たんけんだ！🐢',
    image: '/public/images/puzzles/puzzle_ocean.png',
    pieces: 9,
  },
];

export default PUZZLES;

// 次のパズルを取得（アーカイブ済みの次）
export const getNextPuzzle = (completedIds = []) => {
  const next = PUZZLES.find(p => !completedIds.includes(p.id));
  return next || PUZZLES[0]; // 全部完了したら最初に戻る
};

// IDからパズルを取得
export const getPuzzleById = (id) => {
  return PUZZLES.find(p => p.id === id) || PUZZLES[0];
};
