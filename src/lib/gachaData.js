// ============================================
// 🍎 gachaData.js - 果実コレクション ガチャデータ
// フルーツ定義・レアリティ・ガチャ確率・演出設定
// v1.0.3: 果実コレクション機能追加
// ============================================

// ==============================
// レアリティ定義
// ==============================
export const RARITY = {
  NORMAL:     'normal',
  RARE:       'rare',
  SUPER_RARE: 'super_rare',
  LEGEND:     'legend',
};

export const RARITY_INFO = {
  [RARITY.NORMAL]:     { label: 'ノーマル',       emoji: '🍏', color: '#8BC34A', bgColor: '#F1F8E9', weight: 50 },
  [RARITY.RARE]:       { label: 'レア',           emoji: '⭐', color: '#FF9800', bgColor: '#FFF3E0', weight: 30 },
  [RARITY.SUPER_RARE]: { label: 'スーパーレア',   emoji: '💎', color: '#9C27B0', bgColor: '#F3E5F5', weight: 15 },
  [RARITY.LEGEND]:     { label: 'レジェンド',     emoji: '👑', color: '#FFD700', bgColor: '#FFFDE7', weight: 5  },
};

// ==============================
// フルーツ定義（20種）
// 画像追加時はここに1行追加するだけ！
// ==============================
export const FRUITS = [
  // --- ノーマル（6種）---
  { id: 'apple',         name: 'りんご',           rarity: RARITY.NORMAL,     image: '/public/images/fruits/fruit_apple.png' },
  { id: 'peach',         name: 'もも',             rarity: RARITY.NORMAL,     image: '/public/images/fruits/fruit_peach.png' },
  { id: 'banana',        name: 'バナナ',           rarity: RARITY.NORMAL,     image: '/public/images/fruits/fruit_banana.png' },
  { id: 'grape',         name: 'ぶどう',           rarity: RARITY.NORMAL,     image: '/public/images/fruits/fruit_grape.png' },
  { id: 'orange',        name: 'みかん',           rarity: RARITY.NORMAL,     image: '/public/images/fruits/fruit_orange.png' },
  { id: 'strawberry',    name: 'いちご',           rarity: RARITY.NORMAL,     image: '/public/images/fruits/fruit_strawberry.png' },

  // --- レア（4種）---
  { id: 'starfruit',     name: 'ほしのみ',         rarity: RARITY.RARE,       image: '/public/images/fruits/fruit_starfruit.png' },
  { id: 'spiral_fruit',  name: 'うずまきのみ',     rarity: RARITY.RARE,       image: '/public/images/fruits/fruit_spiral_fruit.png' },
  { id: 'heart_fruit',   name: 'ハートのみ',       rarity: RARITY.RARE,       image: '/public/images/fruits/fruit_heart_fruit.png' },
  { id: 'melon',         name: 'メロン',           rarity: RARITY.RARE,       image: '/public/images/fruits/fruit_melon.png' },

  // --- スーパーレア（7種）---
  { id: 'rainbow_apple', name: 'にじりんご',       rarity: RARITY.SUPER_RARE, image: '/public/images/fruits/fruit_rainbow_apple.png' },
  { id: 'moon_fruit',    name: 'つきのみ',         rarity: RARITY.SUPER_RARE, image: '/public/images/fruits/fruit_moon_fruit.png' },
  { id: 'night_apple',   name: 'よぞらりんご',     rarity: RARITY.SUPER_RARE, image: '/public/images/fruits/fruit_night_apple.png' },
  { id: 'cosmic_apple',  name: 'コズミックりんご', rarity: RARITY.SUPER_RARE, image: '/public/images/fruits/fruit_cosmic_apple.png' },
  { id: 'jewel_peach',   name: 'ジュエルもも',     rarity: RARITY.SUPER_RARE, image: '/public/images/fruits/fruit_jewel_peach.png' },
  { id: 'thunder_apple', name: 'いかずちりんご',   rarity: RARITY.SUPER_RARE, image: '/public/images/fruits/fruit_thunder_apple.png' },
  { id: 'fire_apple',    name: 'ほのおりんご',     rarity: RARITY.SUPER_RARE, image: '/public/images/fruits/fruit_fire_apple.png' },

  // --- レジェンド（3種）---
  { id: 'crown_apple',   name: 'おうかんりんご',   rarity: RARITY.LEGEND,     image: '/public/images/fruits/fruit_crown_apple.png' },
  { id: 'galaxy_pear',   name: 'ぎんがなし',       rarity: RARITY.LEGEND,     image: '/public/images/fruits/fruit_galaxy_pear.png' },
  { id: 'galaxy_apple',  name: 'ぎんがりんご',     rarity: RARITY.LEGEND,     image: '/public/images/fruits/fruit_galaxy_apple.png' },
];

// ==============================
// エフェクト定義（レアリティ別）
// ==============================
export const EFFECTS = {
  [RARITY.NORMAL]: {
    bg: '/public/images/fruits/effects/effect_burst_green.png',
    overlay: null,
    duration: 2000,
    shakeIntensity: 0,
  },
  [RARITY.RARE]: {
    bg: '/public/images/fruits/effects/effect_cloud_burst.png',
    overlay: '/public/images/fruits/effects/effect_confetti.png',
    duration: 2500,
    shakeIntensity: 2,
  },
  [RARITY.SUPER_RARE]: {
    bg: '/public/images/fruits/effects/effect_ring_rainbow.png',
    overlay: '/public/images/fruits/effects/effect_swirl_rainbow.png',
    duration: 3000,
    shakeIntensity: 4,
  },
  [RARITY.LEGEND]: {
    bg: '/public/images/fruits/effects/effect_stage_legend.png',
    overlay: '/public/images/fruits/effects/effect_sparkles.png',
    duration: 4000,
    shakeIntensity: 6,
  },
};

// ==============================
// ガチャロジック
// ==============================

/**
 * ガチャを引く（1回）
 * @returns {object} FRUITS配列の1要素（id, name, rarity, image）
 */
export const rollGacha = () => {
  // 1. レアリティを確率で決定
  const totalWeight = Object.values(RARITY_INFO).reduce((sum, r) => sum + r.weight, 0);
  let roll = Math.random() * totalWeight;
  let selectedRarity = RARITY.NORMAL;

  for (const [rarity, info] of Object.entries(RARITY_INFO)) {
    roll -= info.weight;
    if (roll <= 0) {
      selectedRarity = rarity;
      break;
    }
  }

  // 2. そのレアリティの中からランダムに1つ選ぶ
  const candidates = FRUITS.filter(f => f.rarity === selectedRarity);
  const selected = candidates[Math.floor(Math.random() * candidates.length)];

  return { ...selected };
};

/**
 * フルーツIDからフルーツ情報を取得
 */
export const getFruitById = (id) => {
  return FRUITS.find(f => f.id === id) || null;
};

/**
 * 全フルーツ数
 */
export const TOTAL_FRUITS = FRUITS.length;

/**
 * レアリティ別のフルーツ数
 */
export const getFruitCountByRarity = (rarity) => {
  return FRUITS.filter(f => f.rarity === rarity).length;
};
