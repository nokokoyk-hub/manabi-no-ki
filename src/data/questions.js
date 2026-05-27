// ============================================
// 📝 問題データ（小2レベル）
// 将来的にはClaude APIで自動生成予定
// 現在はデモ用のサンプル問題
// ============================================
// type: 'text'（通常）, 'clock'（時計ビジュアル付き）
// clockTime: { hour, minute } - type='clock'の時に使用
// ============================================

export const SAMPLE_QUESTIONS = [
  // ========== さんすう ==========
  {
    id: 'math-001',
    type: 'text',
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
    type: 'text',
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
    type: 'text',
    subject: 'さんすう',
    subjectEmoji: '🔢',
    question: '63 − 28 = ？',
    options: ['25', '35', '45', '37'],
    correct: 1,
    hint: 'くりさがりに ちゅういしよう',
    difficulty: 2,
  },
  {
    id: 'math-004',
    type: 'text',
    subject: 'さんすう',
    subjectEmoji: '🔢',
    question: '6 × 9 = ？',
    options: ['45', '54', '56', '48'],
    correct: 1,
    hint: '六のだんを おもいだしてみよう',
    difficulty: 2,
  },

  // ========== こくご（読み・文章理解） ==========
  {
    id: 'kokugo-001',
    type: 'text',
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
    type: 'text',
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
    type: 'text',
    subject: 'こくご',
    subjectEmoji: '📖',
    question: '「友だちと 公園で あそぶ。」\nどこで あそぶ？',
    options: ['がっこう', 'こうえん', 'いえ', 'みせ'],
    correct: 1,
    hint: '「どこで」を あらわす ことばを さがそう',
    difficulty: 2,
  },

  // ========== こくご（送りがな） ==========
  {
    id: 'okuri-001',
    type: 'text',
    subject: 'こくご',
    subjectEmoji: '✏️',
    question: '「走」の ただしい おくりがなは？',
    options: ['走く', '走す', '走る', '走つ'],
    correct: 2,
    hint: 'はしる、って よむよ 🏃',
    difficulty: 2,
    category: 'okurigana',
  },
  {
    id: 'okuri-002',
    type: 'text',
    subject: 'こくご',
    subjectEmoji: '✏️',
    question: '「読」の ただしい おくりがなは？',
    options: ['読す', '読む', '読く', '読つ'],
    correct: 1,
    hint: 'ほんを よむ、って つかうよ 📚',
    difficulty: 2,
    category: 'okurigana',
  },
  {
    id: 'okuri-003',
    type: 'text',
    subject: 'こくご',
    subjectEmoji: '✏️',
    question: '「書」の ただしい おくりがなは？',
    options: ['書る', '書す', '書く', '書つ'],
    correct: 2,
    hint: 'えんぴつで かく、って つかうよ ✏️',
    difficulty: 2,
    category: 'okurigana',
  },
  {
    id: 'okuri-004',
    type: 'text',
    subject: 'こくご',
    subjectEmoji: '✏️',
    question: '「聞」の ただしい おくりがなは？',
    options: ['聞る', '聞く', '聞す', '聞む'],
    correct: 1,
    hint: 'おとを きく、って つかうよ 👂',
    difficulty: 2,
    category: 'okurigana',
  },
  {
    id: 'okuri-005',
    type: 'text',
    subject: 'こくご',
    subjectEmoji: '✏️',
    question: '「歩」の ただしい おくりがなは？',
    options: ['歩む', '歩る', '歩く', '歩す'],
    correct: 2,
    hint: 'みちを あるく、って つかうよ 🚶',
    difficulty: 2,
    category: 'okurigana',
  },
  {
    id: 'okuri-006',
    type: 'text',
    subject: 'こくご',
    subjectEmoji: '✏️',
    question: '「食」の ただしい おくりがなは？',
    options: ['食く', '食す', '食る', '食べる'],
    correct: 3,
    hint: 'ごはんを たべる、って つかうよ 🍚',
    difficulty: 2,
    category: 'okurigana',
  },

  // ========== とけい ==========
  {
    id: 'clock-001',
    type: 'clock',
    subject: 'とけい',
    subjectEmoji: '⏰',
    question: 'この とけいは なんじ なんぷん？',
    clockTime: { hour: 3, minute: 0 },
    options: ['2じ', '3じ', '3じ30ぷん', '12じ15ふん'],
    correct: 1,
    hint: 'みじかいはりが さしている すうじを みよう',
    difficulty: 1,
  },
  {
    id: 'clock-002',
    type: 'clock',
    subject: 'とけい',
    subjectEmoji: '⏰',
    question: 'この とけいは なんじ なんぷん？',
    clockTime: { hour: 7, minute: 30 },
    options: ['6じ30ぷん', '7じ', '7じ30ぷん', '7じ6ぷん'],
    correct: 2,
    hint: 'ながいはりが 6を さすと 30ぷん だよ',
    difficulty: 2,
  },
  {
    id: 'clock-003',
    type: 'clock',
    subject: 'とけい',
    subjectEmoji: '⏰',
    question: 'この とけいは なんじ なんぷん？',
    clockTime: { hour: 10, minute: 15 },
    options: ['10じ15ふん', '10じ3ぷん', '3じ50ぷん', '10じ45ふん'],
    correct: 0,
    hint: 'ながいはりが 3を さすと 15ふん だよ',
    difficulty: 2,
  },
  {
    id: 'clock-004',
    type: 'clock',
    subject: 'とけい',
    subjectEmoji: '⏰',
    question: 'この とけいは なんじ なんぷん？',
    clockTime: { hour: 2, minute: 45 },
    options: ['2じ45ふん', '3じ45ふん', '9じ10ぷん', '2じ9ふん'],
    correct: 0,
    hint: 'ながいはりが 9を さすと 45ふん だよ',
    difficulty: 3,
  },
  {
    id: 'clock-005',
    type: 'clock',
    subject: 'とけい',
    subjectEmoji: '⏰',
    question: 'この とけいは なんじ なんぷん？',
    clockTime: { hour: 8, minute: 20 },
    options: ['8じ4ぷん', '4じ40ぷん', '8じ20ぷん', '8じ15ふん'],
    correct: 2,
    hint: 'ながいはりが 4を さすと 20ぷん だよ',
    difficulty: 2,
  },

  // ========== せいかつ ==========
  {
    id: 'life-001',
    type: 'text',
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

// カテゴリ別に問題を取得
export const getQuestionsByCategory = (category, count = 5) => {
  const filtered = SAMPLE_QUESTIONS.filter(q =>
    q.category === category || q.type === category
  );
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// 教科別に問題を取得
export const getQuestionsBySubject = (subject, count = 5) => {
  const filtered = SAMPLE_QUESTIONS.filter(q => q.subject === subject);
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};
