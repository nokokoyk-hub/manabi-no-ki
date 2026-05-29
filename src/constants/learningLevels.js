// ============================================
// 🎚️ 教科別レベル設定
// 発達凸凹に合わせて「学年」ではなく教科ごとの実力で調整する
// ============================================

export const MIN_LEARNING_LEVEL = 1;
export const MAX_LEARNING_LEVEL = 4;

export const SUBJECT_LEVELS = [
  {
    key: 'さんすう',
    emoji: '🔢',
    label: 'さんすう',
    description: 'かず・たしざん・ひきざん',
    lowHint: 'ゆっくり いっぽずつ',
    highHint: 'むずかしい けいさんにも ちょうせん',
  },
  {
    key: 'こくご',
    emoji: '📖',
    label: 'こくご',
    description: 'かんじ・ことば・よみとり',
    lowHint: 'やさしい よみから',
    highHint: 'がくねんを こえて ぐんぐん',
  },
  {
    key: 'とけい',
    emoji: '⏰',
    label: 'とけい',
    description: 'なんじ・なんぷん',
    lowHint: 'ちょうどの 時間から',
    highHint: '5ふんきざみも れんしゅう',
  },
  {
    key: 'せいかつ',
    emoji: '🌱',
    label: 'せいかつ',
    description: 'くらし・じかん・いきもの',
    lowHint: '身近な ことから',
    highHint: '少しずつ ひろげる',
  },
];

// お母さんフィードバック反映の初期値
// 算数は1年生レベル、国語は4年生レベルから始める
export const DEFAULT_SUBJECT_LEVELS = {
  さんすう: 1,
  こくご: 4,
  とけい: 2,
  せいかつ: 2,
};

export const clampLearningLevel = (level) => {
  const numeric = Number(level);
  if (Number.isNaN(numeric)) return MIN_LEARNING_LEVEL;
  return Math.min(MAX_LEARNING_LEVEL, Math.max(MIN_LEARNING_LEVEL, numeric));
};

export const getLevelLabel = (level) => `レベル${clampLearningLevel(level)}`;

export const normalizeSubjectLevels = (levels = {}) => {
  return SUBJECT_LEVELS.reduce((acc, subject) => {
    acc[subject.key] = clampLearningLevel(levels[subject.key] || DEFAULT_SUBJECT_LEVELS[subject.key]);
    return acc;
  }, {});
};
