// ============================================
// 📝 問題データ（小2レベル）
// 対象: 小4（実質小2）知的グレー2歳遅れ
// ADHD+LD対応: 短い問題文、ひらがな中心、具体的ヒント
// 将来的にはClaude APIで自動生成予定
// ============================================
// type: 'text'（通常）, 'clock'（時計ビジュアル付き）
// clockTime: { hour, minute } - type='clock'の時に使用
// category: 'okurigana' / 'clock' - 特定モード用
// ============================================

export const SAMPLE_QUESTIONS = [
  // ========================================
  //            🔢 さんすう（15問）
  // ========================================

  // --- 九九 ---
  {
    id: 'math-001', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '7 × 8 = ？',
    options: ['48', '54', '56', '63'], correct: 2,
    hint: 'しちはち…って かぞえてみよう', difficulty: 2,
  },
  {
    id: 'math-002', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '6 × 9 = ？',
    options: ['45', '54', '56', '48'], correct: 1,
    hint: 'ろっく…って かぞえてみよう', difficulty: 2,
  },
  {
    id: 'math-003', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '8 × 4 = ？',
    options: ['24', '28', '32', '36'], correct: 2,
    hint: 'はちし…って かぞえてみよう', difficulty: 2,
  },
  {
    id: 'math-004', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '9 × 7 = ？',
    options: ['56', '63', '72', '54'], correct: 1,
    hint: 'くしち…って かぞえてみよう', difficulty: 2,
  },
  {
    id: 'math-005', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '5 × 6 = ？',
    options: ['25', '35', '30', '36'], correct: 2,
    hint: 'ごろく…って かぞえてみよう', difficulty: 1,
  },

  // --- 足し算 ---
  {
    id: 'math-006', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '34 + 27 = ？',
    options: ['51', '57', '61', '63'], correct: 2,
    hint: 'いちのくらい：4+7=？ から やってみよう', difficulty: 2,
  },
  {
    id: 'math-007', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '45 + 38 = ？',
    options: ['73', '83', '82', '78'], correct: 1,
    hint: 'いちのくらい：5+8=？ くりあがりに ちゅうい！', difficulty: 2,
  },
  {
    id: 'math-008', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '56 + 17 = ？',
    options: ['63', '73', '67', '77'], correct: 1,
    hint: 'いちのくらい：6+7=？ くりあがるよ！', difficulty: 2,
  },

  // --- 引き算 ---
  {
    id: 'math-009', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '63 − 28 = ？',
    options: ['25', '35', '45', '37'], correct: 1,
    hint: 'くりさがりに ちゅういしよう', difficulty: 2,
  },
  {
    id: 'math-010', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '82 − 35 = ？',
    options: ['47', '53', '43', '57'], correct: 0,
    hint: 'いちのくらい：2−5 は ひけないから くりさがり！', difficulty: 2,
  },
  {
    id: 'math-011', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '70 − 24 = ？',
    options: ['54', '56', '46', '44'], correct: 2,
    hint: '70 から 20 をひいて、さらに 4 をひこう', difficulty: 2,
  },

  // --- 文章題 ---
  {
    id: 'math-012', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: 'りんごが 8こ あります。\n3こ たべました。\nのこりは なんこ？',
    options: ['3こ', '4こ', '5こ', '6こ'], correct: 2,
    hint: '8 から 3 をひいてみよう 🍎', difficulty: 1,
  },
  {
    id: 'math-013', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: 'えんぴつが 6ぽん あります。\n4ほん もらいました。\nぜんぶで なんぼん？',
    options: ['8ほん', '10ぽん', '9ほん', '2ほん'], correct: 1,
    hint: '6 と 4 をたそう ✏️', difficulty: 1,
  },
  {
    id: 'math-014', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: 'おかしが 3こずつ\n4ふくろ あります。\nぜんぶで なんこ？',
    options: ['7こ', '8こ', '12こ', '15こ'], correct: 2,
    hint: '3 × 4 = ？ かけざんだよ！', difficulty: 2,
  },
  {
    id: 'math-015', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: 'ケーキを 12こ つくりました。\nともだちに 5こ あげました。\nのこりは？',
    options: ['5こ', '6こ', '7こ', '8こ'], correct: 2,
    hint: '12 から 5 をひいてみよう 🍰', difficulty: 1,
  },

  // ========================================
  //         📖 こくご・読み（10問）
  // ========================================
  {
    id: 'kokugo-001', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「父は 毎朝 新聞を 読む。」\nだれが よむ？',
    options: ['おかあさん', 'おとうさん', 'しんぶん', 'あさ'], correct: 1,
    hint: '「だれが」に あたる ことばを さがそう', difficulty: 2,
  },
  {
    id: 'kokugo-002', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「春」の よみかたは？',
    options: ['なつ', 'あき', 'はる', 'ふゆ'], correct: 2,
    hint: 'さくらが さく きせつ だよ 🌸', difficulty: 1,
  },
  {
    id: 'kokugo-003', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「友だちと 公園で あそぶ。」\nどこで あそぶ？',
    options: ['がっこう', 'こうえん', 'いえ', 'みせ'], correct: 1,
    hint: '「どこで」を あらわす ことばを さがそう', difficulty: 2,
  },
  {
    id: 'kokugo-004', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「夏」の よみかたは？',
    options: ['はる', 'なつ', 'あき', 'ふゆ'], correct: 1,
    hint: 'プールに はいる あつい きせつ 🌻', difficulty: 1,
  },
  {
    id: 'kokugo-005', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「秋」の よみかたは？',
    options: ['はる', 'なつ', 'あき', 'ふゆ'], correct: 2,
    hint: 'もみじが きれいな きせつ 🍁', difficulty: 1,
  },
  {
    id: 'kokugo-006', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「冬」の よみかたは？',
    options: ['はる', 'なつ', 'あき', 'ふゆ'], correct: 3,
    hint: 'ゆきが ふる さむい きせつ ⛄', difficulty: 1,
  },
  {
    id: 'kokugo-007', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「姉は ピアノを ひく。」\nなにを ひく？',
    options: ['ギター', 'たいこ', 'ピアノ', 'リコーダー'], correct: 2,
    hint: '「なにを」に あたる ことばを さがそう', difficulty: 2,
  },
  {
    id: 'kokugo-008', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「学校」の よみかたは？',
    options: ['がくえん', 'がっこう', 'がくもん', 'がくせい'], correct: 1,
    hint: 'まいにち かよう ところ 🏫', difficulty: 1,
  },
  {
    id: 'kokugo-009', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「先生」の よみかたは？',
    options: ['せんせ', 'せいせい', 'せんせい', 'さきせい'], correct: 2,
    hint: 'べんきょうを おしえてくれる ひと 👨‍🏫', difficulty: 1,
  },
  {
    id: 'kokugo-010', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「犬が にわで はしる。」\nなにが はしる？',
    options: ['ねこ', 'いぬ', 'にわ', 'とり'], correct: 1,
    hint: '「なにが」に あたる ことばを さがそう 🐕', difficulty: 1,
  },

  // ========================================
  //       ✏️ こくご・送りがな（12問）
  // ========================================
  {
    id: 'okuri-001', type: 'text', subject: 'こくご', subjectEmoji: '✏️',
    question: '「走」の ただしい おくりがなは？',
    options: ['走く', '走す', '走る', '走つ'], correct: 2,
    hint: 'はしる、って よむよ 🏃', difficulty: 2, category: 'okurigana',
  },
  {
    id: 'okuri-002', type: 'text', subject: 'こくご', subjectEmoji: '✏️',
    question: '「読」の ただしい おくりがなは？',
    options: ['読す', '読む', '読く', '読つ'], correct: 1,
    hint: 'ほんを よむ、って つかうよ 📚', difficulty: 2, category: 'okurigana',
  },
  {
    id: 'okuri-003', type: 'text', subject: 'こくご', subjectEmoji: '✏️',
    question: '「書」の ただしい おくりがなは？',
    options: ['書る', '書す', '書く', '書つ'], correct: 2,
    hint: 'えんぴつで かく、って つかうよ ✏️', difficulty: 2, category: 'okurigana',
  },
  {
    id: 'okuri-004', type: 'text', subject: 'こくご', subjectEmoji: '✏️',
    question: '「聞」の ただしい おくりがなは？',
    options: ['聞る', '聞く', '聞す', '聞む'], correct: 1,
    hint: 'おとを きく、って つかうよ 👂', difficulty: 2, category: 'okurigana',
  },
  {
    id: 'okuri-005', type: 'text', subject: 'こくご', subjectEmoji: '✏️',
    question: '「歩」の ただしい おくりがなは？',
    options: ['歩む', '歩る', '歩く', '歩す'], correct: 2,
    hint: 'みちを あるく、って つかうよ 🚶', difficulty: 2, category: 'okurigana',
  },
  {
    id: 'okuri-006', type: 'text', subject: 'こくご', subjectEmoji: '✏️',
    question: '「食」の ただしい おくりがなは？',
    options: ['食く', '食す', '食る', '食べる'], correct: 3,
    hint: 'ごはんを たべる、って つかうよ 🍚', difficulty: 2, category: 'okurigana',
  },
  {
    id: 'okuri-007', type: 'text', subject: 'こくご', subjectEmoji: '✏️',
    question: '「思」の ただしい おくりがなは？',
    options: ['思く', '思う', '思る', '思す'], correct: 1,
    hint: 'こころで おもう、って つかうよ 💭', difficulty: 2, category: 'okurigana',
  },
  {
    id: 'okuri-008', type: 'text', subject: 'こくご', subjectEmoji: '✏️',
    question: '「話」の ただしい おくりがなは？',
    options: ['話る', '話く', '話す', '話む'], correct: 2,
    hint: 'おともだちと はなす、って つかうよ 💬', difficulty: 2, category: 'okurigana',
  },
  {
    id: 'okuri-009', type: 'text', subject: 'こくご', subjectEmoji: '✏️',
    question: '「買」の ただしい おくりがなは？',
    options: ['買る', '買く', '買す', '買う'], correct: 3,
    hint: 'おかしを かう、って つかうよ 🛒', difficulty: 2, category: 'okurigana',
  },
  {
    id: 'okuri-010', type: 'text', subject: 'こくご', subjectEmoji: '✏️',
    question: '「泳」の ただしい おくりがなは？',
    options: ['泳る', '泳ぐ', '泳す', '泳く'], correct: 1,
    hint: 'プールで およぐ、って つかうよ 🏊', difficulty: 2, category: 'okurigana',
  },
  {
    id: 'okuri-011', type: 'text', subject: 'こくご', subjectEmoji: '✏️',
    question: '「作」の ただしい おくりがなは？',
    options: ['作す', '作く', '作る', '作む'], correct: 2,
    hint: 'こうさくを つくる、って つかうよ 🔨', difficulty: 2, category: 'okurigana',
  },
  {
    id: 'okuri-012', type: 'text', subject: 'こくご', subjectEmoji: '✏️',
    question: '「遊」の ただしい おくりがなは？',
    options: ['遊く', '遊す', '遊ぶ', '遊る'], correct: 2,
    hint: 'こうえんで あそぶ、って つかうよ ⚽', difficulty: 2, category: 'okurigana',
  },

  // ========================================
  //           ⏰ とけい（10問）
  // ========================================
  {
    id: 'clock-001', type: 'clock', subject: 'とけい', subjectEmoji: '⏰',
    question: 'この とけいは なんじ？',
    clockTime: { hour: 3, minute: 0 },
    options: ['2じ', '3じ', '3じ30ぷん', '12じ15ふん'], correct: 1,
    hint: 'みじかいはりが さしている すうじを みよう', difficulty: 1,
  },
  {
    id: 'clock-002', type: 'clock', subject: 'とけい', subjectEmoji: '⏰',
    question: 'この とけいは なんじ なんぷん？',
    clockTime: { hour: 7, minute: 30 },
    options: ['6じ30ぷん', '7じ', '7じ30ぷん', '7じ6ぷん'], correct: 2,
    hint: 'ながいはりが 6を さすと 30ぷん だよ', difficulty: 2,
  },
  {
    id: 'clock-003', type: 'clock', subject: 'とけい', subjectEmoji: '⏰',
    question: 'この とけいは なんじ なんぷん？',
    clockTime: { hour: 10, minute: 15 },
    options: ['10じ15ふん', '10じ3ぷん', '3じ50ぷん', '10じ45ふん'], correct: 0,
    hint: 'ながいはりが 3を さすと 15ふん だよ', difficulty: 2,
  },
  {
    id: 'clock-004', type: 'clock', subject: 'とけい', subjectEmoji: '⏰',
    question: 'この とけいは なんじ なんぷん？',
    clockTime: { hour: 2, minute: 45 },
    options: ['2じ45ふん', '3じ45ふん', '9じ10ぷん', '2じ9ふん'], correct: 0,
    hint: 'ながいはりが 9を さすと 45ふん だよ', difficulty: 3,
  },
  {
    id: 'clock-005', type: 'clock', subject: 'とけい', subjectEmoji: '⏰',
    question: 'この とけいは なんじ なんぷん？',
    clockTime: { hour: 8, minute: 20 },
    options: ['8じ4ぷん', '4じ40ぷん', '8じ20ぷん', '8じ15ふん'], correct: 2,
    hint: 'ながいはりが 4を さすと 20ぷん だよ', difficulty: 2,
  },
  {
    id: 'clock-006', type: 'clock', subject: 'とけい', subjectEmoji: '⏰',
    question: 'この とけいは なんじ？',
    clockTime: { hour: 12, minute: 0 },
    options: ['11じ', '12じ', '1じ', '6じ'], correct: 1,
    hint: 'みじかいはりが いちばん うえを さしてるよ', difficulty: 1,
  },
  {
    id: 'clock-007', type: 'clock', subject: 'とけい', subjectEmoji: '⏰',
    question: 'この とけいは なんじ なんぷん？',
    clockTime: { hour: 5, minute: 10 },
    options: ['5じ10ぷん', '2じ25ふん', '5じ2ふん', '10じ5ふん'], correct: 0,
    hint: 'ながいはりが 2を さすと 10ぷん だよ', difficulty: 2,
  },
  {
    id: 'clock-008', type: 'clock', subject: 'とけい', subjectEmoji: '⏰',
    question: 'この とけいは なんじ なんぷん？',
    clockTime: { hour: 11, minute: 40 },
    options: ['11じ8ぷん', '8じ55ふん', '11じ40ぷん', '11じ35ふん'], correct: 2,
    hint: 'ながいはりが 8を さすと 40ぷん だよ', difficulty: 3,
  },
  {
    id: 'clock-009', type: 'clock', subject: 'とけい', subjectEmoji: '⏰',
    question: 'この とけいは なんじ？',
    clockTime: { hour: 6, minute: 0 },
    options: ['5じ', '6じ', '12じ', '6じ30ぷん'], correct: 1,
    hint: 'みじかいはりが いちばん したを さしてるよ', difficulty: 1,
  },
  {
    id: 'clock-010', type: 'clock', subject: 'とけい', subjectEmoji: '⏰',
    question: 'この とけいは なんじ なんぷん？',
    clockTime: { hour: 9, minute: 50 },
    options: ['9じ50ぷん', '10じ45ふん', '9じ10ぷん', '10じ50ぷん'], correct: 0,
    hint: 'ながいはりが 10を さすと 50ぷん だよ', difficulty: 3,
  },

  // ========================================
  //         🌱 せいかつ（10問）
  // ========================================
  {
    id: 'life-001', type: 'text', subject: 'せいかつ', subjectEmoji: '🌱',
    question: '1メートルは なんセンチメートル？',
    options: ['10cm', '50cm', '100cm', '1000cm'], correct: 2,
    hint: '「メートル」と「センチメートル」の かんけい だよ', difficulty: 2,
  },
  {
    id: 'life-002', type: 'text', subject: 'せいかつ', subjectEmoji: '🌱',
    question: '1じかんは なんぷん？',
    options: ['30ぷん', '50ぷん', '60ぷん', '100ぷん'], correct: 2,
    hint: 'とけいの ながいはりが いっしゅう するよ ⏰', difficulty: 1,
  },
  {
    id: 'life-003', type: 'text', subject: 'せいかつ', subjectEmoji: '🌱',
    question: '1にちは なんじかん？',
    options: ['12じかん', '20じかん', '24じかん', '30じかん'], correct: 2,
    hint: 'あさから よるまで、そして また あさになるよ', difficulty: 2,
  },
  {
    id: 'life-004', type: 'text', subject: 'せいかつ', subjectEmoji: '🌱',
    question: 'たまごから うまれる いきものは？',
    options: ['いぬ', 'ねこ', 'にわとり', 'うさぎ'], correct: 2,
    hint: 'コケコッコー！って なく とりだよ 🐔', difficulty: 1,
  },
  {
    id: 'life-005', type: 'text', subject: 'せいかつ', subjectEmoji: '🌱',
    question: 'おひさまが のぼる ほうがくは？',
    options: ['きた', 'みなみ', 'にし', 'ひがし'], correct: 3,
    hint: 'あさ、おひさまが でてくる ほうこう 🌅', difficulty: 2,
  },
  {
    id: 'life-006', type: 'text', subject: 'せいかつ', subjectEmoji: '🌱',
    question: 'みずを こおらせると なにになる？',
    options: ['ゆげ', 'くも', 'こおり', 'あめ'], correct: 2,
    hint: 'れいぞうこの フリーザーに いれると… 🧊', difficulty: 1,
  },
  {
    id: 'life-007', type: 'text', subject: 'せいかつ', subjectEmoji: '🌱',
    question: '1しゅうかんは なんにち？',
    options: ['5にち', '6にち', '7にち', '10にち'], correct: 2,
    hint: 'げつ・か・すい・もく・きん・ど・にち 📅', difficulty: 1,
  },
  {
    id: 'life-008', type: 'text', subject: 'せいかつ', subjectEmoji: '🌱',
    question: 'はなを そだてるのに ひつような ものは？',
    options: ['みず と ひかり', 'けしゴム', 'えんぴつ', 'ノート'], correct: 0,
    hint: 'しょくぶつに あげる もの 🌻', difficulty: 1,
  },
  {
    id: 'life-009', type: 'text', subject: 'せいかつ', subjectEmoji: '🌱',
    question: 'あめのひに つかう どうぐは？',
    options: ['ぼうし', 'サングラス', 'かさ', 'てぶくろ'], correct: 2,
    hint: 'ぬれないように さす もの ☂️', difficulty: 1,
  },
  {
    id: 'life-010', type: 'text', subject: 'せいかつ', subjectEmoji: '🌱',
    question: '1ねんは なんかげつ？',
    options: ['6かげつ', '10かげつ', '11かげつ', '12かげつ'], correct: 3,
    hint: '1がつ から 12がつ まで あるよ 📆', difficulty: 1,
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
