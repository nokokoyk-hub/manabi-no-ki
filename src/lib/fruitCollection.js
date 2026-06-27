// ============================================
// 📦 fruitCollection.js - 果実コレクション管理
// localStorage保存・読込・統計
// v1.0.3: 果実コレクション機能追加
// ============================================

import { FRUITS, RARITY, RARITY_INFO } from './gachaData';

const COLLECTION_KEY = 'manabi_fruit_collection';

// ==============================
// データ構造
// ==============================
// {
//   items: { [fruitId]: { count: number, firstGotAt: string } },
//   totalHarvests: number,
//   lastHarvestAt: string | null,
// }

const DEFAULT_COLLECTION = {
  items: {},
  totalHarvests: 0,
  lastHarvestAt: null,
};

// ==============================
// 読み込み・保存
// ==============================

/**
 * コレクションデータを読み込む
 */
export const loadFruitCollection = () => {
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
    console.error('果実コレクション読み込みエラー:', e);
    return { ...DEFAULT_COLLECTION, items: {} };
  }
};

/**
 * コレクションデータを保存する
 */
export const saveFruitCollection = (collection) => {
  try {
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
  } catch (e) {
    console.error('果実コレクション保存エラー:', e);
  }
};

// ==============================
// コレクション操作
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
// 統計・ヘルパー
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
  return Object.values(RARITY).map(rarity => {
    const fruitsOfRarity = FRUITS.filter(f => f.rarity === rarity);
    const collected = fruitsOfRarity.filter(f => collection.items[f.id]).length;
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
  localStorage.removeItem(COLLECTION_KEY);
};
