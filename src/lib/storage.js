// ============================================
// 📦 storage.js - データ保存・読み込みモジュール
// まなびの木
// Supabase + localStorage ハイブリッド
// v1.0.3: user_id一本化。device_idフォールバック完全廃止（2026/06/26）
// ============================================

import { supabase } from './supabase';
import COSTUME_ITEMS_DATA from '../data/costumeItems';

// ------------------------------------------
// 🆔 デバイスID管理（レガシー・フォールバック用）
// ------------------------------------------
const DEVICE_ID_KEY = 'manabi_device_id';
const SUBJECT_LEVELS_KEY = 'manabi_subject_levels';
const PET_NAME_KEY = 'manabi_pet_name';
const PET_NAME_BACKUP_KEY = 'manabi_pet_name_backup';
const ROBOT_NAME_KEY = 'manabi_robot_name';
const ROBOT_NAME_BACKUP_KEY = 'manabi_robot_name_backup';
const CURRENT_USER_KEY = 'manabi_current_user_id';

// ============================================
// ⛑️ アカウント切替検出 + localStorageクリア（v1.0.2）
// 同じデバイスで別アカウントにログインしたら
// 前のユーザーのlocalStorageデータをクリアする
// ============================================
const USER_LOCAL_KEYS = [
  'manabi_subject_levels',
  'manabi_pet_name',
  'manabi_robot_name',
  'manabi_puzzle',
  'manabi_costume',
  'manabi_display_mode',
  'manabi_guardian_pin',
  'manabi_selected_character',
];

export const checkAndSwitchUser = (userId) => {
  try {
    const prevUserId = localStorage.getItem(CURRENT_USER_KEY);
    if (prevUserId && prevUserId !== userId) {
      // 別アカウントに切り替わった → 学習データをクリア
      console.log('🔄 アカウント変更検出！localStorageをクリアします');
      USER_LOCAL_KEYS.forEach(k => {
        try { localStorage.removeItem(k); } catch {}
      });
      console.log('🧹 クリア完了');
      localStorage.setItem(CURRENT_USER_KEY, userId);
      return true; // 切り替え発生
    }
    localStorage.setItem(CURRENT_USER_KEY, userId);
    return false; // 切り替えなし
  } catch (e) {
    console.warn('⚠️ アカウント切替チェックエラー:', e.message);
    return false;
  }
};

export const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

// ============================================
// 🔑 Phase A-4: user_id 管理
// ログイン時にsetCurrentUserIdでセット
// v1.0.3: user_idのみで管理
// ============================================
let currentUserId = null;

export const setCurrentUserId = (userId) => {
  currentUserId = userId;
  console.log('🆔 ユーザーID設定:', userId ? '✅' : '❌ (未ログイン)');
};

export const getCurrentUserId = () => currentUserId;

/**
 * Supabaseクエリに user_id フィルタを適用
 * v1.0.3: user_idのみ。device_idフォールバック廃止
 */
const applyIdFilter = (query) => {
  if (!currentUserId) {
    console.warn('⚠️ applyIdFilter: 未ログイン状態');
    return query.eq('user_id', 'NONE'); // 未ログイン時は何もヒットさせない
  }
  return query.eq('user_id', currentUserId);
};

/**
 * INSERT時に付与するID情報
 * v1.0.3: user_id必須。device_idはトレーサビリティ用に残す
 */
const getInsertIds = () => ({
  device_id: getDeviceId(),
  user_id: currentUserId || null,
});

/**
 * v1.0.3: 廃止（互換性のためexportは残す）
 * device_id→user_id移行はもう不要。ログイン時はuser_idで直接検索する
 */
export const migrateDeviceDataToUser = async (userId) => {
  // 何もしない（v1.0.3で廃止）
};

// ------------------------------------------
// 📐 教科別レベル設定（localStorage）
// ------------------------------------------
export const loadSubjectLevels = () => {
  try {
    const raw = localStorage.getItem(SUBJECT_LEVELS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    // 正規化: 値を1〜6に制限
    const normalized = {};
    Object.entries(parsed).forEach(([key, val]) => {
      normalized[key] = Math.max(1, Math.min(6, Number(val) || 1));
    });
    return normalized;
  } catch (err) {
    console.error('❌ レベル読み込みエラー:', err);
    return {};
  }
};

export const saveSubjectLevels = (levels) => {
  try {
    localStorage.setItem(SUBJECT_LEVELS_KEY, JSON.stringify(levels));
    return levels;
  } catch (err) {
    console.error('❌ レベル保存エラー:', err);
    return levels;
  }
};

// ------------------------------------------
// 🐕 ペット名管理（localStorage）
// クリア・更新で消えないようバックアップ機構あり
// ------------------------------------------
export const DEFAULT_PET_NAME = 'まめ';

export const loadPetName = () => {
  try {
    const name = localStorage.getItem(PET_NAME_KEY);
    if (name && name.trim()) return name.trim();

    const backupName = sessionStorage.getItem(PET_NAME_BACKUP_KEY);
    if (backupName && backupName.trim()) {
      localStorage.setItem(PET_NAME_KEY, backupName);
      return backupName.trim();
    }

    const hasAnyData =
      localStorage.getItem(DEVICE_ID_KEY) || localStorage.getItem(SUBJECT_LEVELS_KEY);
    if (hasAnyData) {
      localStorage.setItem(PET_NAME_KEY, DEFAULT_PET_NAME);
      return DEFAULT_PET_NAME;
    }

    // 完全な初回 or ログアウト後 → null を返してNamingScreen表示
    return null;
  } catch (err) {
    console.error('❌ ペット名読み込みエラー:', err);
    return DEFAULT_PET_NAME;
  }
};

export const savePetName = (name) => {
  try {
    const safeName = (name && name.trim()) ? name.trim() : DEFAULT_PET_NAME;
    localStorage.setItem(PET_NAME_KEY, safeName);
    sessionStorage.setItem(PET_NAME_BACKUP_KEY, safeName);
    return safeName;
  } catch (err) {
    console.error('❌ ペット名保存エラー:', err);
    return name;
  }
};

export const backupPetNameForUpdate = () => {
  try {
    const name = localStorage.getItem(PET_NAME_KEY);
    if (name) sessionStorage.setItem(PET_NAME_BACKUP_KEY, name);
  } catch {}
};

// ============================================
// 🤖 ロボちゃん名前（v1.0.2）
// ============================================
export const DEFAULT_ROBOT_NAME = 'ロボちゃん';

export const loadRobotName = () => {
  try {
    const name = localStorage.getItem(ROBOT_NAME_KEY);
    if (name && name.trim()) return name.trim();

    const backupName = sessionStorage.getItem(ROBOT_NAME_BACKUP_KEY);
    if (backupName && backupName.trim()) {
      localStorage.setItem(ROBOT_NAME_KEY, backupName);
      return backupName.trim();
    }

    return null;
  } catch (err) {
    console.error('❌ ロボちゃん名読み込みエラー:', err);
    return null;
  }
};

export const saveRobotName = (name) => {
  try {
    const safeName = (name && name.trim()) ? name.trim() : DEFAULT_ROBOT_NAME;
    localStorage.setItem(ROBOT_NAME_KEY, safeName);
    sessionStorage.setItem(ROBOT_NAME_BACKUP_KEY, safeName);
    return safeName;
  } catch (err) {
    console.error('❌ ロボちゃん名保存エラー:', err);
    return name;
  }
};

// ------------------------------------------
// 📅 日付ユーティリティ
// ------------------------------------------
export const getTodayJST = () => {
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().split('T')[0];
};

// ------------------------------------------
// 🌳 進捗データのデフォルト値
// ------------------------------------------
export const DEFAULT_PROGRESS = {
  leaves: 0,
  flowers: 0,
  fruits: 0,
  streak: 0,
  todayDone: false,
  lastStudyDate: null,
};

// ------------------------------------------
// 🌳 進捗の読み込み（v1.0.3: user_idのみ。シンプル設計）
// ------------------------------------------
export const loadProgress = async () => {
  if (!supabase) return DEFAULT_PROGRESS;

  try {
    const today = getTodayJST();

    // 未ログインならデフォルト（認証必須なので通常は到達しない）
    if (!currentUserId) {
      console.log('📦 未ログイン: デフォルト値を使用');
      return DEFAULT_PROGRESS;
    }

    // user_idで検索（これだけ！）
    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', currentUserId)
      .single();

    // レコードなし → 新規作成
    if (error && error.code === 'PGRST116') {
      console.log('🌱 新規ユーザー: 進捗データを作成');
      const { data: newData, error: insertError } = await supabase
        .from('user_progress')
        .insert({
          device_id: getDeviceId(),
          user_id: currentUserId,
        })
        .select()
        .single();

      if (insertError) {
        console.error('❌ 進捗作成エラー:', insertError);
        return DEFAULT_PROGRESS;
      }

      return {
        leaves: newData.leaves,
        flowers: newData.flowers,
        fruits: newData.fruits,
        streak: newData.streak,
        todayDone: newData.today_done,
        lastStudyDate: newData.last_study_date,
      };
    }

    if (error) {
      console.error('❌ 進捗読み込みエラー:', error);
      return DEFAULT_PROGRESS;
    }

    // ストリークの日付チェック（既存ロジック維持）
    let streak = data.streak;
    let todayDone = data.today_done;

    if (data.last_study_date) {
      const lastDate = data.last_study_date;
      const yesterday = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastDate !== today && lastDate !== yesterdayStr) {
        streak = 0;
        await applyIdFilter(
          supabase.from('user_progress').update({ streak: 0, today_done: false })
        );
      }

      if (lastDate !== today) {
        todayDone = false;
        await applyIdFilter(
          supabase.from('user_progress').update({ today_done: false })
        );
      }
    }

    return {
      leaves: data.leaves,
      flowers: data.flowers,
      fruits: data.fruits,
      streak,
      todayDone,
      lastStudyDate: data.last_study_date,
    };
  } catch (err) {
    console.error('❌ 進捗読み込み例外:', err);
    return DEFAULT_PROGRESS;
  }
};

// ------------------------------------------
// 学習完了時に進捗を保存
// ------------------------------------------
export const saveProgress = async (progress) => {
  if (!supabase) {
    console.log('📦 ローカルモード: 保存スキップ');
    return;
  }

  try {
    const today = getTodayJST();

    const { error } = await applyIdFilter(
      supabase.from('user_progress').update({
        leaves: progress.leaves,
        flowers: progress.flowers,
        fruits: progress.fruits,
        streak: progress.streak,
        today_done: progress.todayDone,
        last_study_date: today,
      })
    );

    if (error) {
      console.error('❌ 進捗保存エラー:', error);
    } else {
      console.log('✅ 進捗保存完了！');
    }
  } catch (err) {
    console.error('❌ 進捗保存例外:', err);
  }
};

// ------------------------------------------
// 📝 学習セッション記録
// ------------------------------------------
export const recordSession = async (mode, score, totalQuestions) => {
  if (!supabase) {
    console.log('📦 ローカルモード: セッション記録スキップ');
    return;
  }

  try {
    const { error } = await supabase
      .from('learning_sessions')
      .insert({
        ...getInsertIds(),
        mode,
        score,
        total_questions: totalQuestions,
      });

    if (error) {
      console.error('❌ セッション記録エラー:', error);
    } else {
      console.log('📝 セッション記録完了！');
    }
  } catch (err) {
    console.error('❌ セッション記録例外:', err);
  }
};

// ------------------------------------------
// みまもり用: 過去7日間のセッションを取得
// ------------------------------------------
export const getRecentSessions = async (days = 7) => {
  if (!supabase) {
    console.log('📦 ローカルモード: セッション取得スキップ');
    return [];
  }

  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await applyIdFilter(
      supabase.from('learning_sessions')
        .select('*')
    )
      .gte('completed_at', since.toISOString())
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('❌ セッション取得エラー:', error);
      return [];
    }

    return data || [];
  } catch (err) {
    console.error('❌ セッション取得例外:', err);
    return [];
  }
};

// ------------------------------------------
// 📊 誤答記録（answer_history）
// 1問ごとに正誤を記録し、復習の精度を高める
// v0.9.1: 新規追加
// ------------------------------------------

/**
 * 1問の回答結果をanswer_historyに記録する
 * fire-and-forget（呼び出し元でawaitしなくてOK）
 */
export const recordAnswer = async (questionId, isCorrect) => {
  if (!supabase) {
    console.log('📦 ローカルモード: 誤答記録スキップ');
    return;
  }

  try {
    const { error } = await supabase
      .from('answer_history')
      .insert({
        ...getInsertIds(),
        question_id: questionId,
        is_correct: isCorrect,
      });

    if (error) {
      console.error('❌ 誤答記録エラー:', error);
    }
  } catch (err) {
    console.error('❌ 誤答記録例外:', err);
  }
};

/**
 * 直近N日以内に出題された問題IDを取得する
 * 正解/不正解を問わず、出題されたもの全て
 * 返り値: ['question_id_1', 'question_id_2', ...]
 */
export const getRecentQuestionIds = async (days = 3) => {
  if (!supabase) return [];

  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await applyIdFilter(
      supabase.from('answer_history').select('question_id')
    )
      .gte('answered_at', since.toISOString());

    if (error) throw error;
    if (!data || data.length === 0) return [];

    // 重複除去してIDリストを返す
    return [...new Set(data.map(row => row.question_id))];
  } catch (err) {
    console.warn('⚠️ 直近出題取得失敗:', err.message);
    return [];
  }
};

/**
 * 指定日数以内の誤答が多い問題IDを取得する
 * 返り値: [{ question_id, wrong_count, total_count, wrong_rate }]
 * wrong_rateが高い順にソート
 */
export const getWeakQuestions = async (days = 30, limit = 20) => {
  if (!supabase) {
    console.log('📦 ローカルモード: 誤答取得スキップ');
    return [];
  }

  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await applyIdFilter(
      supabase.from('answer_history').select('question_id, is_correct')
    )
      .gte('answered_at', since.toISOString());

    if (error) throw error;
    if (!data || data.length === 0) return [];

    // 問題ごとに集計
    const stats = {};
    data.forEach(row => {
      if (!stats[row.question_id]) {
        stats[row.question_id] = { question_id: row.question_id, wrong_count: 0, total_count: 0 };
      }
      stats[row.question_id].total_count += 1;
      if (!row.is_correct) {
        stats[row.question_id].wrong_count += 1;
      }
    });

    // 誤答率を計算してソート
    return Object.values(stats)
      .map(s => ({
        ...s,
        wrong_rate: s.total_count > 0 ? s.wrong_count / s.total_count : 0,
      }))
      .filter(s => s.wrong_count > 0) // 1回でも間違えた問題だけ
      .sort((a, b) => b.wrong_rate - a.wrong_rate || b.wrong_count - a.wrong_count)
      .slice(0, limit);
  } catch (err) {
    console.error('❌ 誤答取得例外:', err);
    return [];
  }
};

// ------------------------------------------
// 🧩 ごほうびパズル
// ミッションクリアでピースを集めて絵を完成させる
// v0.7.1: 新規追加
// ------------------------------------------
const PUZZLE_KEY = 'manabi_puzzle';

const DEFAULT_PUZZLE_DATA = {
  currentPuzzleId: null,  // 現在のパズルID（null=初期状態）
  collected: 0,           // 収集済みピース数（0〜9）
  completedIds: [],       // 完了済みパズルIDリスト（アーカイブ）
};

export const loadPuzzleData = () => {
  try {
    const raw = localStorage.getItem(PUZZLE_KEY);
    if (!raw) return DEFAULT_PUZZLE_DATA;
    const parsed = JSON.parse(raw);
    return {
      currentPuzzleId: parsed.currentPuzzleId || null,
      collected: parsed.collected || 0,
      completedIds: parsed.completedIds || [],
    };
  } catch (err) {
    console.error('❌ パズルデータ読み込みエラー:', err);
    return DEFAULT_PUZZLE_DATA;
  }
};

export const savePuzzleData = (data) => {
  try {
    localStorage.setItem(PUZZLE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('❌ パズルデータ保存エラー:', err);
  }
};

// ピースを1つ追加（ミッションクリア時に呼ぶ）
export const addPuzzlePiece = (puzzleId) => {
  const data = loadPuzzleData();

  // 初回 or パズルID不一致 → 新パズル開始
  if (!data.currentPuzzleId || data.currentPuzzleId !== puzzleId) {
    data.currentPuzzleId = puzzleId;
    data.collected = 1;
  } else {
    data.collected = Math.min(9, data.collected + 1);
  }

  // 9ピース達成 → 完成！
  let justCompleted = false;
  if (data.collected >= 9) {
    if (!data.completedIds.includes(puzzleId)) {
      data.completedIds.push(puzzleId);
    }
    justCompleted = true;
  }

  savePuzzleData(data);
  return { ...data, justCompleted };
};

// ------------------------------------------
// 👗 着せ替えアイテム
// アンロック状態と装着中アイテムを管理
// v0.7.2: 新規追加
// ------------------------------------------
const COSTUME_KEY = 'manabi_costume';

const DEFAULT_COSTUME_DATA = {
  unlockedItems: [],    // アンロック済みアイテムIDリスト
  equippedItem: null,   // 現在装着中のアイテムID（null=なし）
  missionCount: 0,      // 総ミッションクリア回数
  perfectCount: 0,      // パーフェクト回数
};

export const loadCostumeData = () => {
  try {
    const raw = localStorage.getItem(COSTUME_KEY);
    if (!raw) return DEFAULT_COSTUME_DATA;
    const parsed = JSON.parse(raw);
    return {
      unlockedItems: parsed.unlockedItems || [],
      equippedItem: parsed.equippedItem || null,
      missionCount: parsed.missionCount || 0,
      perfectCount: parsed.perfectCount || 0,
    };
  } catch (err) {
    console.error('❌ 着せ替えデータ読み込みエラー:', err);
    return DEFAULT_COSTUME_DATA;
  }
};

export const saveCostumeData = (data) => {
  try {
    localStorage.setItem(COSTUME_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('❌ 着せ替えデータ保存エラー:', err);
  }
};

// アイテム装着/解除
export const equipItem = (itemId) => {
  const data = loadCostumeData();
  data.equippedItem = data.equippedItem === itemId ? null : itemId;
  saveCostumeData(data);
  return data;
};

// アイテムアンロック
export const unlockItem = (itemId) => {
  const data = loadCostumeData();
  if (!data.unlockedItems.includes(itemId)) {
    data.unlockedItems.push(itemId);
    saveCostumeData(data);
  }
  return data;
};

// ミッション完了時のアンロック判定
export const checkCostumeUnlocks = (streak, puzzleCompletedCount) => {
  const data = loadCostumeData();
  const ITEMS = COSTUME_ITEMS_DATA;
  const newUnlocks = [];

  ITEMS.forEach(item => {
    if (data.unlockedItems.includes(item.id)) return;

    let shouldUnlock = false;
    switch (item.unlockType) {
      case 'mission_count':
        shouldUnlock = data.missionCount >= item.unlockValue;
        break;
      case 'streak':
        shouldUnlock = streak >= item.unlockValue;
        break;
      case 'perfect':
        shouldUnlock = data.perfectCount >= item.unlockValue;
        break;
      case 'puzzle':
        shouldUnlock = puzzleCompletedCount >= item.unlockValue;
        break;
      default:
        break;
    }

    if (shouldUnlock) {
      data.unlockedItems.push(item.id);
      newUnlocks.push(item);
    }
  });

  if (newUnlocks.length > 0) {
    saveCostumeData(data);
  }
  return { costumeData: data, newUnlocks };
};

// ミッションカウント・パーフェクトカウント更新
export const incrementMissionCount = (isPerfect) => {
  const data = loadCostumeData();
  data.missionCount += 1;
  if (isPerfect) data.perfectCount += 1;
  saveCostumeData(data);
  return data;
};

// ============================================
// 📊 みまもり画面用データ取得関数（v0.9.2追加）
// ============================================

// ============================================
// 🔤 表示モード（ていがくねん / こうがくねん）
// v0.9.2追加: Phase 1 設定UI
// ============================================
const DISPLAY_MODE_KEY = 'manabi_display_mode';

/**
 * 表示モードを読み込む
 * 'hiragana' = ていがくねん（ひらがな中心）
 * 'kanji' = こうがくねん（漢字交じり）
 */
export const loadDisplayMode = () => {
  try {
    return localStorage.getItem(DISPLAY_MODE_KEY) || 'hiragana';
  } catch {
    return 'hiragana';
  }
};

export const saveDisplayMode = (mode) => {
  try {
    localStorage.setItem(DISPLAY_MODE_KEY, mode);
    return mode;
  } catch {
    return mode;
  }
};

/**
 * 教科別正答率を取得（answer_history × questions JOINで集計）
 * 返り値: [{ subject, emoji, total, correct, accuracy, levels: { [lv]: {total, correct, accuracy} } }]
 */
export const getSubjectAccuracy = async (days = 30) => {
  if (!supabase) return [];

  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    // answer_historyから期間内のデータ取得
    const { data: answers, error: aErr } = await applyIdFilter(
      supabase.from('answer_history').select('question_id, is_correct')
    )
      .gte('answered_at', since.toISOString());

    if (aErr) throw aErr;
    if (!answers || answers.length === 0) return [];

    // question_idリストを作成
    const questionIds = [...new Set(answers.map(a => a.question_id))];

    // questionsからsubject情報を取得
    const { data: questions, error: qErr } = await supabase
      .from('questions')
      .select('question_id, subject, subject_emoji, grade_level')
      .in('question_id', questionIds);

    if (qErr) throw qErr;
    if (!questions) return [];

    // question_id → subject マッピング
    const questionMap = {};
    questions.forEach(q => { questionMap[q.question_id] = q; });

    // 教科別に集計
    const subjectStats = {};
    answers.forEach(a => {
      const q = questionMap[a.question_id];
      if (!q) return;
      if (!subjectStats[q.subject]) {
        subjectStats[q.subject] = {
          subject: q.subject,
          emoji: q.subject_emoji,
          total: 0,
          correct: 0,
          levels: {},
        };
      }
      subjectStats[q.subject].total++;
      if (a.is_correct) subjectStats[q.subject].correct++;

      // レベル別も集計
      const lvl = q.grade_level;
      if (!subjectStats[q.subject].levels[lvl]) {
        subjectStats[q.subject].levels[lvl] = { total: 0, correct: 0 };
      }
      subjectStats[q.subject].levels[lvl].total++;
      if (a.is_correct) subjectStats[q.subject].levels[lvl].correct++;
    });

    return Object.values(subjectStats).map(s => ({
      ...s,
      accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
      levels: Object.fromEntries(
        Object.entries(s.levels).map(([lv, d]) => [
          lv,
          { ...d, accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0 },
        ])
      ),
    }));
  } catch (err) {
    console.error('❌ 教科別正答率取得エラー:', err);
    return [];
  }
};

/**
 * 日別正答率の推移を取得
 * 返り値: [{ date, total, correct, accuracy }]（日付昇順）
 */
export const getDailyAccuracyTrend = async (days = 14) => {
  if (!supabase) return [];

  try {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data: answers, error } = await applyIdFilter(
      supabase.from('answer_history').select('is_correct, answered_at')
    )
      .gte('answered_at', since.toISOString())
      .order('answered_at', { ascending: true });

    if (error) throw error;
    if (!answers || answers.length === 0) return [];

    // 日別に集計
    const dailyStats = {};
    answers.forEach(a => {
      const date = new Date(a.answered_at).toLocaleDateString('sv-SE');
      if (!dailyStats[date]) {
        dailyStats[date] = { date, total: 0, correct: 0 };
      }
      dailyStats[date].total++;
      if (a.is_correct) dailyStats[date].correct++;
    });

    return Object.values(dailyStats)
      .map(d => ({
        ...d,
        accuracy: d.total > 0 ? Math.round((d.correct / d.total) * 100) : 0,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  } catch (err) {
    console.error('❌ 日別推移取得エラー:', err);
    return [];
  }
};
