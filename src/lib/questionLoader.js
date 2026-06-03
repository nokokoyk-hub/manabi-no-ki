// ============================================
// 🗄️ questionLoader.js - Supabaseから問題取得
// DB読み込み + フォールバック（既存ハードコード問題）
// v0.8.0: 新規作成
// ============================================

import { supabase } from './supabase';
import { DEFAULT_SUBJECT_LEVELS } from '../constants/learningLevels';
import {
  getTodayQuestions as getTodayQuestionsLocal,
  getQuestionsByCategory as getQuestionsByCategoryLocal,
  getQuestionsBySubject as getQuestionsBySubjectLocal,
} from '../data/levelQuestions';

// ------------------------------------------
// ヘルパー関数
// ------------------------------------------
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

// DBのレコードをアプリ内形式に変換
const dbToAppFormat = (row) => ({
  id: row.question_id,
  type: row.type || 'text',
  subject: row.subject,
  subjectEmoji: row.subject_emoji,
  category: row.category || undefined,
  gradeLevel: row.grade_level,
  question: row.question,
  hint: row.hint || '',
  options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
  correct: row.correct,
  clockTime: row.clock_time
    ? (typeof row.clock_time === 'string' ? JSON.parse(row.clock_time) : row.clock_time)
    : undefined,
  difficulty: row.grade_level,
});

// 教科別レベルでフィルタ
const filterByLevels = (questions, subjectLevels) => {
  const levels = subjectLevels || DEFAULT_SUBJECT_LEVELS;
  return questions.filter(q => {
    // 設定レベルの問題だけ出す（ぴったり一致）
    const targetLevel = levels[q.subject] || 2;
    return q.gradeLevel === targetLevel;
  });
};

// バランスよく問題を選ぶ（教科が偏らないように）
const takeBalanced = (questions, count) => {
  if (questions.length <= count) return shuffle(questions);

  const bySubject = {};
  questions.forEach(q => {
    if (!bySubject[q.subject]) bySubject[q.subject] = [];
    bySubject[q.subject].push(q);
  });

  const subjects = Object.keys(bySubject);
  const perSubject = Math.max(1, Math.floor(count / subjects.length));
  let result = [];

  subjects.forEach(subj => {
    const shuffled = shuffle(bySubject[subj]);
    result.push(...shuffled.slice(0, perSubject));
  });

  // 足りない分をランダム追加
  if (result.length < count) {
    const remaining = questions.filter(q => !result.includes(q));
    result.push(...shuffle(remaining).slice(0, count - result.length));
  }

  return shuffle(result.slice(0, count));
};

// ------------------------------------------
// Supabaseから問題を取得する関数群
// すべてフォールバック付き！
// ------------------------------------------

// ミッション用: 全教科からバランスよく
export const getTodayQuestions = async (count = 5, subjectLevels = DEFAULT_SUBJECT_LEVELS) => {
  if (!supabase) {
    console.log('📦 ローカルモード: ハードコード問題を使用');
    return getTodayQuestionsLocal(count, subjectLevels);
  }

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('active', true)
      .order('id');

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('DB問題なし');

    const appQuestions = data.map(dbToAppFormat);
    const filtered = filterByLevels(appQuestions, subjectLevels);

    if (filtered.length === 0) throw new Error('レベル対応問題なし');

    console.log(`✅ DB問題取得: ${filtered.length}問中${count}問を出題`);
    return takeBalanced(filtered, count);
  } catch (err) {
    console.warn('⚠️ DB問題取得失敗、フォールバック使用:', err.message);
    return getTodayQuestionsLocal(count, subjectLevels);
  }
};

// カテゴリ別: おくりがな / とけい
export const getQuestionsByCategory = async (category, count = 5, subjectLevels = DEFAULT_SUBJECT_LEVELS) => {
  if (!supabase) {
    return getQuestionsByCategoryLocal(category, count, subjectLevels);
  }

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('active', true)
      .eq('category', category);

    if (error) throw error;
    if (!data || data.length === 0) throw new Error(`カテゴリ ${category} の問題なし`);

    const appQuestions = data.map(dbToAppFormat);
    const filtered = filterByLevels(appQuestions, subjectLevels);

    if (filtered.length === 0) throw new Error('レベル対応問題なし');

    console.log(`✅ DB問題取得(${category}): ${filtered.length}問`);
    return shuffle(filtered).slice(0, count);
  } catch (err) {
    console.warn(`⚠️ DB問題取得失敗(${category})、フォールバック:`, err.message);
    return getQuestionsByCategoryLocal(category, count, subjectLevels);
  }
};

// 教科別: さんすう / こくご 等（復習用）
export const getQuestionsBySubject = async (subject, count = 5, subjectLevels = DEFAULT_SUBJECT_LEVELS) => {
  if (!supabase) {
    return getQuestionsBySubjectLocal(subject, count, subjectLevels);
  }

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('active', true)
      .eq('subject', subject);

    if (error) throw error;
    if (!data || data.length === 0) throw new Error(`教科 ${subject} の問題なし`);

    const appQuestions = data.map(dbToAppFormat);
    const filtered = filterByLevels(appQuestions, subjectLevels);

    if (filtered.length === 0) throw new Error('レベル対応問題なし');

    console.log(`✅ DB問題取得(${subject}): ${filtered.length}問`);
    return shuffle(filtered).slice(0, count);
  } catch (err) {
    console.warn(`⚠️ DB問題取得失敗(${subject})、フォールバック:`, err.message);
    return getQuestionsBySubjectLocal(subject, count, subjectLevels);
  }
};
