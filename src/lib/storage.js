// ============================================
// 💾 storage.js - データアクセスレイヤー
// Supabaseへの読み書き + 端末ごとの設定を一元管理
// Supabase未設定時はローカルstateで動作（フォールバック）
// v0.6.0: ペット名（キャラ名カスタマイズ）追加
// v0.6.3: 更新時の名前復元バックアップに対応
// ============================================

import { supabase } from './supabase';
import { DEFAULT_SUBJECT_LEVELS, normalizeSubjectLevels } from '../constants/learningLevels';

// ------------------------------------------
// デバイスID管理
// ブラウザのlocalStorageに保存して端末を識別
// ------------------------------------------
const DEVICE_ID_KEY = 'manabi_device_id';
const SUBJECT_LEVELS_KEY = 'manabi_subject_levels';
const PET_NAME_KEY = 'manabi_pet_name';
const PET_NAME_BACKUP_KEY = 'manabi_pet_name_backup';

export const getDeviceId = () => {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
};

// ------------------------------------------
// 教科別レベル設定
// まずは端末localStorageで保存。DBスキーマ変更なしで安全に導入する。
// ------------------------------------------
export const loadSubjectLevels = () => {
  try {
    const raw = localStorage.getItem(SUBJECT_LEVELS_KEY);
    if (!raw) return DEFAULT_SUBJECT_LEVELS;
    return normalizeSubjectLevels(JSON.parse(raw));
  } catch (err) {
    console.error('❌ レベル設定読み込みエラー:', err);
    return DEFAULT_SUBJECT_LEVELS;
  }
};

export const saveSubjectLevels = (levels) => {
  try {
    const normalized = normalizeSubjectLevels(levels);
    localStorage.setItem(SUBJECT_LEVELS_KEY, JSON.stringify(normalized));
    return normalized;
  } catch (err) {
    console.error('❌ レベル設定保存エラー:', err);
    return DEFAULT_SUBJECT_LEVELS;
  }
};

// ------------------------------------------
// 🐕 ペット名（キャラ名カスタマイズ）
// 子供が自分でキャラの名前をつけられる機能
// localStorage保存（教科別レベルと同じ方式）
// ------------------------------------------
export const DEFAULT_PET_NAME = 'まめ';

export const loadPetName = () => {
  try {
    const name = localStorage.getItem(PET_NAME_KEY);
    if (name) return name;

    // 更新直前にsessionStorageへ退避した名前があれば復元する
    const backupName = sessionStorage.getItem(PET_NAME_BACKUP_KEY);
    if (backupName) {
      localStorage.setItem(PET_NAME_KEY, backupName);
      sessionStorage.removeItem(PET_NAME_BACKUP_KEY);
      return backupName;
    }

    return null; // null = 未設定（NamingScreen表示の判定に使う）
  } catch (err) {
    console.error('❌ ペット名読み込みエラー:', err);
    return null;
  }
};

export const savePetName = (name) => {
  try {
    const trimmed = (name || '').trim();
    const safeName = trimmed || DEFAULT_PET_NAME;
    localStorage.setItem(PET_NAME_KEY, safeName);
    return safeName;
  } catch (err) {
    console.error('❌ ペット名保存エラー:', err);
    return DEFAULT_PET_NAME;
  }
};

// ------------------------------------------
// 日付ヘルパー（日本時間）
// ------------------------------------------
const getTodayJST = () => {
  const now = new Date();
  // UTC+9 で日本時間の日付を取得
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().split('T')[0]; // 'YYYY-MM-DD'
};

// ------------------------------------------
// 進捗データの初期値
// ------------------------------------------
export const DEFAULT_PROGRESS = {
  leaves: 5,
  flowers: 2,
  fruits: 0,
  streak: 0,
  todayDone: false,
  lastStudyDate: null,
};

// ------------------------------------------
// 進捗を読み込む
// ------------------------------------------
export const loadProgress = async () => {
  if (!supabase) {
    console.log('📦 ローカルモード: デフォルト値を使用');
    return DEFAULT_PROGRESS;
  }

  try {
    const deviceId = getDeviceId();
    const today = getTodayJST();

    const { data, error } = await supabase
      .from('user_progress')
      .select('*')
      .eq('device_id', deviceId)
      .single();

    if (error && error.code === 'PGRST116') {
      // レコードなし → 新規作成
      console.log('🌱 初回アクセス: 進捗データを新規作成');
      const { data: newData, error: insertError } = await supabase
        .from('user_progress')
        .insert({ device_id: deviceId })
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

    // ストリークの日付チェック
    // 昨日でも今日でもない → ストリークリセット
    let streak = data.streak;
    let todayDone = data.today_done;

    if (data.last_study_date) {
      const lastDate = data.last_study_date;
      const yesterday = new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastDate !== today && lastDate !== yesterdayStr) {
        // 2日以上空いた → ストリークリセット
        streak = 0;
        await supabase
          .from('user_progress')
          .update({ streak: 0, today_done: false })
          .eq('device_id', deviceId);
      }

      // 日付が変わった → todayDoneリセット
      if (lastDate !== today) {
        todayDone = false;
        await supabase
          .from('user_progress')
          .update({ today_done: false })
          .eq('device_id', deviceId);
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
    const deviceId = getDeviceId();
    const today = getTodayJST();

    const { error } = await supabase
      .from('user_progress')
      .update({
        leaves: progress.leaves,
        flowers: progress.flowers,
        fruits: progress.fruits,
        streak: progress.streak,
        today_done: progress.todayDone,
        last_study_date: today,
      })
      .eq('device_id', deviceId);

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
// 学習セッションを記録
// ------------------------------------------
export const recordSession = async (mode, score, totalQuestions) => {
  if (!supabase) {
    console.log('📦 ローカルモード: セッション記録スキップ');
    return;
  }

  try {
    const deviceId = getDeviceId();

    const { error } = await supabase
      .from('learning_sessions')
      .insert({
        device_id: deviceId,
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
    const deviceId = getDeviceId();
    const since = new Date();
    since.setDate(since.getDate() - days);

    const { data, error } = await supabase
      .from('learning_sessions')
      .select('*')
      .eq('device_id', deviceId)
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
