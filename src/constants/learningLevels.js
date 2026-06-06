// ============================================
// 🎚️ 教科別レベル設定
// 発達凸凹に合わせて「学年」ではなく教科ごとの実力で調整する
// v0.9.2: 教科再構成（せいかつ消滅→しゃかい🗾・どうとく💛追加）
// ============================================

export const MIN_LEARNING_LEVEL = 1;
export const MAX_LEARNING_LEVEL = 6;

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
    key: 'かがく',
    emoji: '🧪',
    label: 'かがく',
    description: 'げんそ・しゅうきひょう・かがくのふしぎ',
    lowHint: 'みぢかな ものから',
    highHint: 'げんその せかいを たんけん',
  },
  {
    key: 'しゃかい',
    emoji: '🗾',
    label: 'しゃかい',
    description: 'ちり・れきし・くらしのルール',
    lowHint: 'みぢかな まちから',
    highHint: 'にほんと せかいを まなぶ',
  },
  {
    key: 'どうとく',
    emoji: '💛',
    label: 'どうとく',
    description: 'おもいやり・ルール・きもち',
    lowHint: 'やさしい きもちから',
    highHint: 'じぶんで かんがえて こうどう',
  },
];

// お母さんフィードバック反映の初期値
// 算数は1年生レベル、国語は4年生レベルから始める
// 上限は興味・得意の伸びに合わせて6年生相当まで広げる
export const DEFAULT_SUBJECT_LEVELS = {
  さんすう: 1,
  こくご: 4,
  とけい: 2,
  かがく: 1,
  しゃかい: 2,
  どうとく: 1,
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
