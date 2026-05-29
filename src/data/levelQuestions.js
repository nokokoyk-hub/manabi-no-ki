// ============================================
// 🎚️ レベル対応問題セレクター
// 既存 questions.js は温存し、ここで gradeLevel 付与と追加問題を扱う
// ============================================

import { SAMPLE_QUESTIONS as BASE_QUESTIONS } from './questions';
import { DEFAULT_SUBJECT_LEVELS, normalizeSubjectLevels } from '../constants/learningLevels';

const EXTRA_QUESTIONS = [
  // さんすう Lv1: 1桁のくり上がり・くり下がり
  {
    id: 'math-l1-001', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '5 + 6 = ？', options: ['10', '11', '12', '13'], correct: 1,
    hint: '5に 6を たすよ。10を こえる たしざんだね', difficulty: 1, gradeLevel: 1,
  },
  {
    id: 'math-l1-002', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '8 + 7 = ？', options: ['14', '15', '16', '17'], correct: 1,
    hint: '8に 2を たすと10。のこりは 5だよ', difficulty: 1, gradeLevel: 1,
  },
  {
    id: 'math-l1-003', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '9 + 4 = ？', options: ['12', '13', '14', '15'], correct: 1,
    hint: '9に 1を たすと10。のこりは 3だよ', difficulty: 1, gradeLevel: 1,
  },
  {
    id: 'math-l1-004', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '6 + 6 = ？', options: ['10', '11', '12', '13'], correct: 2,
    hint: '6を ふたつ あわせよう', difficulty: 1, gradeLevel: 1,
  },
  {
    id: 'math-l1-005', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '7 + 5 = ？', options: ['11', '12', '13', '14'], correct: 1,
    hint: '7に 3を たすと10。のこりは 2だよ', difficulty: 1, gradeLevel: 1,
  },
  {
    id: 'math-l1-006', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: '11 - 5 = ？', options: ['5', '6', '7', '8'], correct: 1,
    hint: '11から 5を ひいてみよう', difficulty: 1, gradeLevel: 1,
  },
  {
    id: 'math-l1-007', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: 'りんごが 5こ あります。\n6こ もらいました。\nぜんぶで なんこ？',
    options: ['10こ', '11こ', '12こ', '13こ'], correct: 1,
    hint: '5 + 6 を してみよう 🍎', difficulty: 1, gradeLevel: 1,
  },
  {
    id: 'math-l1-008', type: 'text', subject: 'さんすう', subjectEmoji: '🔢',
    question: 'あめが 12こ あります。\n5こ たべました。\nのこりは なんこ？',
    options: ['6こ', '7こ', '8こ', '9こ'], correct: 1,
    hint: '12 - 5 を してみよう 🍬', difficulty: 1, gradeLevel: 1,
  },

  // こくご Lv4: 漢字読み
  {
    id: 'kokugo-l4-001', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「季節」の よみかたは？', options: ['きせつ', 'きぶん', 'きじつ', 'きそく'], correct: 0,
    hint: '春・夏・秋・冬のことだよ 🌸', difficulty: 3, gradeLevel: 4,
  },
  {
    id: 'kokugo-l4-002', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「努力」の よみかたは？', options: ['どうりょく', 'どりょく', 'のうりょく', 'きょうりょく'], correct: 1,
    hint: 'がんばることを あらわす ことばだよ', difficulty: 3, gradeLevel: 4,
  },
  {
    id: 'kokugo-l4-003', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「希望」の よみかたは？', options: ['きぼう', 'のぞみ', 'きもう', 'きほう'], correct: 0,
    hint: 'こうなったらいいな、という きもちだよ', difficulty: 3, gradeLevel: 4,
  },
  {
    id: 'kokugo-l4-004', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「勇気」の よみかたは？', options: ['ゆき', 'ゆうき', 'ようき', 'げんき'], correct: 1,
    hint: 'こわくても 一歩すすむ ちからだよ', difficulty: 3, gradeLevel: 4,
  },
  {
    id: 'kokugo-l4-005', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「成長」の よみかたは？', options: ['せいちょう', 'せいなが', 'じょうちょう', 'せいちょ'], correct: 0,
    hint: 'すこしずつ 大きくなること 🌳', difficulty: 3, gradeLevel: 4,
  },
  {
    id: 'kokugo-l4-006', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「観察」の よみかたは？', options: ['かんさつ', 'けんさつ', 'かんせつ', 'けんせつ'], correct: 0,
    hint: 'よく見て しらべることだよ', difficulty: 3, gradeLevel: 4,
  },
  {
    id: 'kokugo-l4-007', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「目的」の よみかたは？', options: ['もくてき', 'もくまと', 'めあて', 'もくひょう'], correct: 0,
    hint: 'なにをするためか、という ことだよ', difficulty: 3, gradeLevel: 4,
  },
  {
    id: 'kokugo-l4-008', type: 'text', subject: 'こくご', subjectEmoji: '📖',
    question: '「特別」の よみかたは？', options: ['とくべつ', 'とくわけ', 'とうべつ', 'とくべち'], correct: 0,
    hint: 'ふつうとは ちがう、とっておきのこと', difficulty: 3, gradeLevel: 4,
  },
];

const getBaseQuestionLevel = (question) => {
  if (question.subject === 'さんすう') return 2;
  if (question.subject === 'こくご') return 2;
  if (question.subject === 'とけい') return question.difficulty || 1;
  if (question.subject === 'せいかつ') return question.difficulty || 1;
  return question.gradeLevel || question.difficulty || 1;
};

export const LEVEL_QUESTIONS = [
  ...EXTRA_QUESTIONS,
  ...BASE_QUESTIONS.map((question) => ({
    ...question,
    gradeLevel: question.gradeLevel || getBaseQuestionLevel(question),
  })),
];

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
const getQuestionLevel = (question) => question.gradeLevel || question.difficulty || 1;

const filterBySubjectLevels = (questions, subjectLevels = DEFAULT_SUBJECT_LEVELS) => {
  const normalizedLevels = normalizeSubjectLevels(subjectLevels);
  return questions.filter((question) => {
    const selectedLevel = normalizedLevels[question.subject] || 1;
    return getQuestionLevel(question) <= selectedLevel;
  });
};

const takeBalancedQuestions = (questions, count = 5) => {
  const bySubject = questions.reduce((acc, question) => {
    if (!acc[question.subject]) acc[question.subject] = [];
    acc[question.subject].push(question);
    return acc;
  }, {});

  const picked = [];
  const subjects = shuffle(Object.keys(bySubject));

  subjects.forEach((subject) => {
    if (picked.length < count) {
      const subjectQuestions = shuffle(bySubject[subject]);
      picked.push(subjectQuestions[0]);
    }
  });

  const pickedIds = new Set(picked.map(q => q.id));
  const remaining = shuffle(questions.filter(q => !pickedIds.has(q.id)));
  return [...picked, ...remaining].slice(0, count);
};

// 今日のミッション用に問題をランダムに取得
// 教科別レベル設定に合わせ、各教科からできるだけバランスよく出題
export const getTodayQuestions = (count = 5, subjectLevels = DEFAULT_SUBJECT_LEVELS) => {
  const eligible = filterBySubjectLevels(LEVEL_QUESTIONS, subjectLevels);
  return takeBalancedQuestions(eligible, count);
};

// カテゴリ別に問題を取得
export const getQuestionsByCategory = (category, count = 5, subjectLevels = DEFAULT_SUBJECT_LEVELS) => {
  const filtered = LEVEL_QUESTIONS.filter(q =>
    q.category === category || q.type === category
  );
  const eligible = filterBySubjectLevels(filtered, subjectLevels);
  return shuffle(eligible).slice(0, count);
};

// 教科別に問題を取得
export const getQuestionsBySubject = (subject, count = 5, subjectLevels = DEFAULT_SUBJECT_LEVELS) => {
  const filtered = LEVEL_QUESTIONS.filter(q => q.subject === subject);
  const eligible = filterBySubjectLevels(filtered, subjectLevels);
  return shuffle(eligible).slice(0, count);
};

// 管理画面やデバッグで使える件数確認
export const getQuestionCountBySubjectLevel = (subject, level) => {
  return LEVEL_QUESTIONS.filter(q => q.subject === subject && getQuestionLevel(q) <= level).length;
};
