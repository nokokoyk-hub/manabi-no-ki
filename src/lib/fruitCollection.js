// ============================================
// 📦 fruitCollection.js - 果実コレクション管理
// Supabase + localStorage ハイブリッド
// v1.0.4: Supabase同期対応（ストア出店対応）
//
// 設計思想:
//   - loadFruitCollection() / addFruitToCollection() は同期関数のまま
//   - 呼び出し側（HarvestScreen/CollectionScreen）の変更不要
//   - initFruitCollection() をApp.jsのログイン時に1回呼ぶだけでOK
//   - Supabase優先 + localStorageフォールバック（オフライン対応）
//   - 初回ログイン時にlocalStorage→Supabase自動マイグレーション
//
// 配置: src/lib/fruitCollection.js
// ============================================
import { FRUITS, RARITY, RARITY_INFO } from './gachaData';
import { supabase } from './supabase';
import { getCurrentUserId } from './storage';

const COLLECTION_KEY = 'manabi_fruit_collection';

// ==============================
// データ構造
// ==============================
// {
//   items: { [fruitId]: { count: number, firstGotAt: string } },
//   totalHarvests: number,
//   lastHarvestAt: string | null,
//   migratedAt: string | null,   ← Supabase移行済みフラグ（v1.0.4追加）
// }
const DEFAULT_COLLECTION = {
  items: {},
  totalHarvests: 0,
  lastHarvestAt: null,
};

// ==============================
// 🧠 メモリキャッシュ
// ログイン時にinitFruitCollectionで読み込み、
// 以降はキャッシュから同期的に返す
// ==============================
let cachedCollection = null;

// ==============================
// 📂 localStorage操作（内部用）
// ==============================
const loadFromLocalStorage = () => {
  try {
    const raw = localStorage.getItem(COLLECTION_KEY);
    if (!raw) return { ...DEFAULT_COLLECTION, items: {} };
    const parsed = JSON.parse(raw);
    return {
      items: parsed.items || {},
      totalHarvests: parsed.totalHarvests || 0,
      lastHarvestAt: parsed.lastHarvestAt || null,
    };
  } catch (e) {
    console.error('🍎 localStorage読み込みエラー:', e);
    return { ...DEFAULT_COLLECTION, items: {} };
  }
};

const saveToLocalStorage = (collection) => {
  try {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  } catch (e) {
    console.error('🍎 localStorage保存エラー:', e);
  }
};

// ==============================
// ☁️ Supabase操作（内部用）
// ==============================
const loadFromSupabase = async (userId) => {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('fruit_collection')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('🍎 Supabase読み込みエラー:', error.message);
      return null;
    }
    return data?.fruit_collection || null;
  } catch (e) {
    console.error('🍎 Supabase読み込み例外:', e);
    return null;
  }
};

const saveToSupabase = async (collection) => {
  const userId = getCurrentUserId();
  if (!supabase || !userId) return;
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ fruit_collection: collection })
      .eq('id', userId);

    if (error) {
      console.error('🍎 Supabase保存エラー:', error.message);
    } else {
      console.log('🍎 Supabase保存完了！');
    }
  } catch (e) {
    console.error('🍎 Supabase保存例外:', e);
  }
};

// ==============================
// 🔀 マージロジック（衝突解決）
// 複数端末で同時操作した場合の安全策
// ==============================
const mergeCollections = (supabaseData, localData) => {
  const merged = {
    items: {},
    totalHarvests: Math.max(
      supabaseData.totalHarvests || 0,
      localData.totalHarvests || 0
    ),
    lastHarvestAt: null,
  };

  // Supabaseのアイテムを全てコピー
  Object.entries(supabaseData.items || {}).forEach(([fruitId, item]) => {
    merged.items[fruitId] = { ...item };
  });

  // localDataのアイテムをマージ（多い方を採用・古い取得日を保持）
  Object.entries(localData.items || {}).forEach(([fruitId, localItem]) => {
    if (!merged.items[fruitId]) {
      // Supabaseにないアイテム → そのまま追加
      merged.items[fruitId] = { ...localItem };
    } else {
      // 両方にある → 多い方のcount、古い方のfirstGotAt
      if (localItem.count > merged.items[fruitId].count) {
        merged.items[fruitId].count = localItem.count;
      }
      const localFirst = localItem.firstGotAt;
      const cloudFirst = merged.items[fruitId].firstGotAt;
      if (localFirst && (!cloudFirst || localFirst < cloudFirst)) {
        merged.items[fruitId].firstGotAt = localFirst;
      }
    }
  });

  // lastHarvestAt: 新しい方を採用
  const dates = [
    supabaseData.lastHarvestAt,
    localData.lastHarvestAt,
  ].filter(Boolean);
  merged.lastHarvestAt = dates.length > 0 ? dates.sort().pop() : null;

  return merged;
};

// ==============================
// 🚀 初期化（ログイン時にApp.jsから1回呼ぶ）
//
// 動作フロー:
//   1. Supabaseからロード
//   2. localStorageからロード
//   3. 状況に応じてマージ or マイグレーション
//   4. メモリキャッシュにセット
// ==============================
export const initFruitCollection = async (userId) => {
  console.log('🍎 果実コレクション初期化開始...');

  // 1. Supabaseからロード
  const supabaseData = await loadFromSupabase(userId);

  // 2. localStorageからロード
  const localData = loadFromLocalStorage();

  const hasSupabase =
    supabaseData && Object.keys(supabaseData.items || {}).length > 0;
  const hasLocal = localData && localData.totalHarvests > 0;

  // 3. マージ・マイグレーション判定
  if (hasSupabase && !hasLocal) {
    // ☁️ Supabaseのみ → ローカルにコピー（機種変更・再インストール時）
    console.log('🍎 Supabaseからコレクション復元');
    cachedCollection = supabaseData;
    saveToLocalStorage(cachedCollection);
  } else if (!hasSupabase && hasLocal) {
    // 📱 ローカルのみ → Supabaseにマイグレーション（初回同期）
    console.log('🍎 localStorage → Supabase マイグレーション実行');
    cachedCollection = {
      ...localData,
      migratedAt: new Date().toISOString(),
    };
    await saveToSupabase(cachedCollection);
  } else if (hasSupabase && hasLocal) {
    // 🔀 両方にある → マージ（複数端末使用時）
    console.log('🍎 データマージ実行（Supabase + localStorage）');
    cachedCollection = mergeCollections(supabaseData, localData);
    await saveToSupabase(cachedCollection);
    saveToLocalStorage(cachedCollection);
  } else {
    // 🌱 両方空 → 新規スタート
    console.log('🍎 コレクション新規開始');
    cachedCollection = { ...DEFAULT_COLLECTION, items: {} };
  }

  return cachedCollection;
};

// ==============================
// 📖 読み込み（⚡同期関数！呼び出し側変更不要！）
// ==============================
/**
 * コレクションデータを読み込む
 * initFruitCollection() 後はメモリキャッシュから即座に返す
 * init前はlocalStorageフォールバック（オフライン対応）
 */
export const loadFruitCollection = () => {
  if (cachedCollection) return cachedCollection;
  return loadFromLocalStorage();
};

// ==============================
// 💾 保存（デュアルライト：localStorage即座 + Supabaseバックグラウンド）
// ==============================
/**
 * コレクションデータを保存する
 * localStorageは即座に書き込み、Supabaseはバックグラウンドで書き込み
 */
export const saveFruitCollection = (collection) => {
  // メモリキャッシュ更新
  cachedCollection = collection;
  // localStorage即座に書き込み
  saveToLocalStorage(collection);
  // Supabaseバックグラウンド書き込み（失敗しても次回initで回復）
  saveToSupabase(collection).catch((e) => {
    console.warn('🍎 Supabase保存失敗（次回ログインで同期）:', e.message);
  });
};

// ==============================
// 🎰 コレクション操作（⚡同期関数！呼び出し側変更不要！）
// ==============================
/**
 * 収穫した果実をコレクションに追加する
 * @param {string} fruitId - 果実ID（例: 'apple'）
 * @returns {object} 更新後のコレクション
 */
export const addFruitToCollection = (fruitId) => {
  const collection = loadFruitCollection();
  const now = new Date().toISOString();

  if (collection.items[fruitId]) {
    collection.items[fruitId].count += 1;
  } else {
    collection.items[fruitId] = {
      count: 1,
      firstGotAt: now,
    };
  }

  collection.totalHarvests += 1;
  collection.lastHarvestAt = now;

  saveFruitCollection(collection);
  return collection;
};

// ==============================
// 🧹 キャッシュクリア（ログアウト/アカウント切替時用）
// App.jsの handleLogout / checkAndSwitchUser から呼ぶ
// ==============================
export const clearFruitCollectionCache = () => {
  cachedCollection = null;
  console.log('🍎 コレクションキャッシュクリア');
};

// ==============================
// 📊 統計・ヘルパー（変更なし！）
// ==============================

/**
 * コレクション済みのフルーツ種類数（ユニーク数）
 */
export const getCollectedCount = (collection) => {
  return Object.keys(collection.items).length;
};

/**
 * コレクション達成率（0〜100%）
 */
export const getCompletionRate = (collection) => {
  const collected = getCollectedCount(collection);
  return Math.round((collected / FRUITS.length) * 100);
};

/**
 * レアリティ別の収集状況
 * @returns {{ rarity: string, collected: number, total: number }[]}
 */
export const getCollectionByRarity = (collection) => {
  return Object.values(RARITY).map((rarity) => {
    const fruitsOfRarity = FRUITS.filter((f) => f.rarity === rarity);
    const collected = fruitsOfRarity.filter(
      (f) => collection.items[f.id]
    ).length;
    return {
      rarity,
      label: RARITY_INFO[rarity].label,
      emoji: RARITY_INFO[rarity].emoji,
      color: RARITY_INFO[rarity].color,
      collected,
      total: fruitsOfRarity.length,
    };
  });
};

/**
 * 特定フルーツの所持数
 */
export const getFruitCount = (collection, fruitId) => {
  return collection.items[fruitId]?.count || 0;
};

/**
 * 新規取得かどうか（初めてのフルーツ）
 */
export const isNewFruit = (collection, fruitId) => {
  return !collection.items[fruitId];
};

/**
 * コレクションをリセット（デバッグ用）
 */
export const resetFruitCollection = () => {
  cachedCollection = null;
  localStorage.removeItem(COLLECTION_KEY);
  // Supabaseもクリア
  const userId = getCurrentUserId();
  if (supabase && userId) {
    supabase
      .from('profiles')
      .update({ fruit_collection: null })
      .eq('id', userId)
      .then(() => console.log('🍎 Supabaseコレクションリセット完了'))
      .catch(() => {});
  }
};
