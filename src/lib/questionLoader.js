// ============================================
// 🗄️ questionLoader.js - Supabaseから問題取得
// DB読み込み + フォールバック（既存ハードコード問題）
// v0.8.0: 新規作成
// v0.9.1: 誤答優先出題ロジック追加
// ============================================

import { supabase } from './supabase';
import { DEFAULT_SUBJECT_LEVELS } from '../constants/learningLevels';
import { getWeakQuestions, getRecentQuestionIds } from './storage';
import {
  getTodayQuestions as getTodayQuestionsLocal,
  getQuestionsByCategory as getQuestionsByCategoryLocal,
  getQuestionsBySubject as getQuestionsBySubjectLocal,
} from '../data/levelQuestions';

// ------------------------------------------
// ヘルパー関数
// ------------------------------------------
const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

// 文字列中の \n を実際の改行に変換
const unescapeNewlines = (str) => (str || '').replace(/\\n/g, '\n');

// DBのレコードをアプリ内形式に変換
const dbToAppFormat = (row) => ({
  id: row.question_id,
  type: row.type || 'text',
  subject: row.subject,
  subjectEmoji: row.subject_emoji,
  category: row.category || undefined,
  gradeLevel: row.grade_level,
  question: unescapeNewlines(row.question),
  questionAdvanced: row.question_advanced ? unescapeNewlines(row.question_advanced) : undefined,
  hint: unescapeNewlines(row.hint),
  options: typeof row.options === 'string' ? JSON.parse(row.options) : row.options,
  optionsAdvanced: row.options_advanced
    ? (typeof row.options_advanced === 'string' ? JSON.parse(row.options_advanced) : row.options_advanced)
    : undefined,
  correct: row.correct,
  clockTime: row.clock_time
    ? (typeof row.clock_time === 'string' ? JSON.parse(row.clock_time) : row.clock_time)
    : undefined,
  explanation: row.explanation || undefined,
  explanationAdvanced: row.explanation_advanced || undefined,
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
// 誤答優先出題ヘルパー
// 間違えた問題を最大40%まで優先的に混ぜる
// 誤答がゼロなら通常通りの動作（完全後方互換）
// v0.9.1: 新規追加
// ------------------------------------------
const prioritizeWeak = (allQuestions, weakIds, count) => {
  if (!weakIds || weakIds.length === 0) return null; // 誤答なし→通常ロジックに委譲

  const weakSet = new Set(weakIds);
  const weakOnes = shuffle(allQuestions.filter(q => weakSet.has(q.id)));
  const normalOnes = shuffle(allQuestions.filter(q => !weakSet.has(q.id)));

  if (weakOnes.length === 0) return null; // 該当レベルに誤答問題なし

  // 誤答枠: 最大40%（少なくとも1問）
  const weakSlots = Math.max(1, Math.min(weakOnes.length, Math.ceil(count * 0.4)));
  const normalSlots = count - weakSlots;

  const selected = [
    ...weakOnes.slice(0, weakSlots),
    ...normalOnes.slice(0, normalSlots),
  ];

  console.log(`🔄 誤答優先: ${weakSlots}問(苦手) + ${Math.min(normalOnes.length, normalSlots)}問(通常)`);
  return shuffle(selected);
};

// 誤答IDリストを取得する（失敗しても空配列で続行）
const fetchWeakIds = async () => {
  try {
    const weakData = await getWeakQuestions(30, 50);
    return weakData.map(w => w.question_id);
  } catch (err) {
    console.warn('⚠️ 誤答データ取得失敗、通常出題に:', err.message);
    return [];
  }
};

// 直近出題IDリストを取得する（失敗しても空配列で続行）
const fetchRecentIds = async () => {
  try {
    return await getRecentQuestionIds(3);
  } catch (err) {
    console.warn('⚠️ 直近出題データ取得失敗:', err.message);
    return [];
  }
};

// 最近出た問題を後回しにする（プール不足時は全問使う安全設計）
const applyRecentFilter = (questions, recentIds, minRequired = 5) => {
  if (!recentIds || recentIds.length === 0) return questions;

  const recentSet = new Set(recentIds);
  const fresh = questions.filter(q => !recentSet.has(q.id));

  // 新鮮な問題がminRequired以上あれば新鮮な問題だけ使う
  if (fresh.length >= minRequired) {
    console.log(`🆕 出題フレッシュ化: ${fresh.length}問(新鮮) / ${questions.length - fresh.length}問(最近出題済→除外)`);
    return fresh;
  }

  // 足りなければ全問使う（詰まり防止）
  console.log(`🔄 問題プール不足のため全問使用: ${questions.length}問`);
  return questions;
};

// ------------------------------------------
// Supabaseから問題を取得する関数群
// すべてフォールバック付き！
// ------------------------------------------

// ミッションに含めない教科（専用ボタンからのみアクセス）
const MISSION_EXCLUDE_SUBJECTS = ['げんそ'];

// ミッション用: 全教科からバランスよく（除外教科を除く）
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

    const appQuestions = data
      .map(dbToAppFormat)
      .filter(q => !MISSION_EXCLUDE_SUBJECTS.includes(q.subject));
    const filtered = filterByLevels(appQuestions, subjectLevels);

    if (filtered.length === 0) throw new Error('レベル対応問題なし');

    // 🆕 直近出題を後回し + 🔄 誤答優先出題
    const [recentIds, weakIds] = await Promise.all([fetchRecentIds(), fetchWeakIds()]);
    const freshFiltered = applyRecentFilter(filtered, recentIds, count);
    const weakResult = prioritizeWeak(freshFiltered, weakIds, count);
    if (weakResult) {
      console.log(`✅ DB問題取得(誤答優先): ${filtered.length}問中${count}問を出題`);
      return weakResult;
    }

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

    // 🆕 直近出題を後回し + 🔄 誤答優先出題
    const [recentIds, weakIds] = await Promise.all([fetchRecentIds(), fetchWeakIds()]);
    const freshFiltered = applyRecentFilter(filtered, recentIds, count);
    const weakResult = prioritizeWeak(freshFiltered, weakIds, count);
    if (weakResult) {
      console.log(`✅ DB問題取得(${category}/誤答優先): ${freshFiltered.length}問`);
      return weakResult;
    }

    console.log(`✅ DB問題取得(${category}): ${freshFiltered.length}問`);
    return shuffle(freshFiltered).slice(0, count);
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

    // 🆕 直近出題を後回し + 🔄 誤答優先出題
    const [recentIds, weakIds] = await Promise.all([fetchRecentIds(), fetchWeakIds()]);
    const freshFiltered = applyRecentFilter(filtered, recentIds, count);
    const weakResult = prioritizeWeak(freshFiltered, weakIds, count);
    if (weakResult) {
      console.log(`✅ DB問題取得(${subject}/誤答優先): ${freshFiltered.length}問`);
      return weakResult;
    }

    console.log(`✅ DB問題取得(${subject}): ${freshFiltered.length}問`);
    return shuffle(freshFiltered).slice(0, count);
  } catch (err) {
    console.warn(`⚠️ DB問題取得失敗(${subject})、フォールバック:`, err.message);
    return getQuestionsBySubjectLocal(subject, count, subjectLevels);
  }
};
