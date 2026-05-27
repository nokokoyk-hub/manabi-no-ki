// ============================================
// 📝 問題データ（小2レベル）
// 将来的にはClaude APIで自動生成予定
// 現在はデモ用のサンプル問題
// ============================================

export const SAMPLE_QUESTIONS = [
  {
    id: 'math-001',
    subject: 'さんすう',
    subjectEmoji: '🔢',
    question: '7 × 8 = ？',
    options: ['48', '54', '56', '63'],
    correct: 2,
    hint: '七のだんを おもいだしてみよう',
    difficulty: 2,
  },
  {
    id: 'math-002',
    subject: 'さんすう',
    subjectEmoji: '🔢',
    question: '34 + 27 = ？',
    options: ['51', '57', '61', '63'],
    correct: 2,
    hint: '一のくらい から たしてみよう',
    difficulty: 2,
  },
  {
    id: 'math-003',
    subject: 'さんすう',
    subjectEmoji: '🔢',
    question: '63 − 28 = ？',
    options: ['25', '35', '45', '37'],
    correct: 1,
    hint: 'くりさがりに ちゅういしよう',
    difficulty: 2,
  },
  {
    id: 'kokugo-001',
    subject: 'こくご',
    subjectEmoji: '📖',
    question: '「父は 毎朝 新聞を 読む。」\nだれが よむ？',
    options: ['おかあさん', 'おとうさん', 'しんぶん', 'あさ'],
    correct: 1,
    hint: '「だれが」に あたる ことばを さがそう',
    difficulty: 2,
  },
  {
    id: 'kokugo-002',
    subject: 'こくご',
    subjectEmoji: '📖',
    question: '「春」の よみかたは？',
    options: ['なつ', 'あき', 'はる', 'ふゆ'],
    correct: 2,
    hint: 'さくらが さく きせつ だよ 🌸',
    difficulty: 2,
  },
  {
    id: 'kokugo-003',
    subject: 'こくご',
    subjectEmoji: '📖',
    question: '「友だちと 公園で あそぶ。」\nどこで あそぶ？',
    options: ['がっこう', 'こうえん', 'いえ', 'みせ'],
    correct: 1,
    hint: '「どこで」を あらわす ことばを さがそう',
    difficulty: 2,
  },
  {
    id: 'life-001',
    subject: 'せいかつ',
    subjectEmoji: '🌱',
    question: '時計の ながいはりが\n12をさすと なんぷん？',
    options: ['15ふん', '30ぷん', '0ふん', '45ふん'],
    correct: 2,
    hint: 'ながいはりは「ふん」を あらわすよ ⏰',
    difficulty: 2,
  },
  {
    id: 'life-002',
    subject: 'せいかつ',
    subjectEmoji: '🌱',
    question: '1メートルは なんセンチメートル？',
    options: ['10cm', '50cm', '100cm', '1000cm'],
    correct: 2,
    hint: '「メートル」と「センチメートル」の かんけい だよ',
    difficulty: 2,
  },
];

// 今日のミッション用に問題をランダムに取得
export const getTodayQuestions = (count = 5) => {
  const shuffled = [...SAMPLE_QUESTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
