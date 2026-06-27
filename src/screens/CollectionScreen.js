// ============================================
// 📦 CollectionScreen.js - 果実コレクション
// 収穫したフルーツを一覧表示。レアリティ別セクション。
// v1.0.3: 果実コレクション機能追加
// ============================================

import React, { useMemo } from 'react';
import { FRUITS, RARITY, RARITY_INFO, TOTAL_FRUITS } from '../lib/gachaData';
import { getCollectedCount, getCompletionRate, getCollectionByRarity } from '../lib/fruitCollection';
import { COLORS } from '../constants/colors';

const CollectionScreen = ({ collection, onBack }) => {
  const collectedCount = useMemo(() => getCollectedCount(collection), [collection]);
  const completionRate = useMemo(() => getCompletionRate(collection), [collection]);
  const rarityStats = useMemo(() => getCollectionByRarity(collection), [collection]);

  const rarityOrder = [RARITY.LEGEND, RARITY.SUPER_RARE, RARITY.RARE, RARITY.NORMAL];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #FFF8E1 0%, #F1F8E9 50%, #E8F5E9 100%)',
      fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
      paddingBottom: 40,
    }}>
      {/* ヘッダー */}
      <div style={{
        background: 'linear-gradient(135deg, #66BB6A, #43A047)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 15px rgba(76,175,80,0.3)',
      }}>
        <button onClick={onBack} style={{
          background: 'rgba(255,255,255,0.2)', border: 'none',
          borderRadius: 20, padding: '6px 16px',
          color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          fontFamily: "'Rounded Mplus 1c', sans-serif",
        }}>
          ← もどる
        </button>
        <div style={{ color: 'white', fontSize: 18, fontWeight: 900 }}>
          🍎 かじつコレクション
        </div>
        <div style={{ width: 70 }} />
      </div>

      {/* 収集率バー */}
      <div style={{
        margin: '16px 16px 0', padding: 16,
        background: 'white', borderRadius: 16,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 8,
        }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#333' }}>
            あつめた かじつ
          </span>
          <span style={{ fontSize: 16, fontWeight: 900, color: COLORS.primary }}>
            {collectedCount} / {TOTAL_FRUITS}
          </span>
        </div>
        <div style={{
          height: 12, borderRadius: 6,
          background: '#E8F5E9',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', borderRadius: 6,
            background: completionRate === 100
              ? 'linear-gradient(90deg, #FFD700, #FFA000, #FFD700)'
              : 'linear-gradient(90deg, #66BB6A, #43A047)',
            width: `${completionRate}%`,
            transition: 'width 0.5s ease',
          }} />
        </div>
        <div style={{
          textAlign: 'right', fontSize: 12, color: '#888', marginTop: 4,
        }}>
          {completionRate}% コンプリート
          {completionRate === 100 && ' 🎉👑'}
        </div>
      </div>

      {/* レアリティ別セクション */}
      {rarityOrder.map(rarity => {
        const info = RARITY_INFO[rarity];
        const fruitsOfRarity = FRUITS.filter(f => f.rarity === rarity);
        const stats = rarityStats.find(s => s.rarity === rarity);

        return (
          <div key={rarity} style={{ margin: '16px 16px 0' }}>
            {/* セクションヘッダー */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <div style={{
                fontSize: 15, fontWeight: 900,
                color: info.color,
                display: 'flex', alignItems: 'center', gap: 6,
              }}>
                {info.emoji} {info.label}
              </div>
              <div style={{
                fontSize: 12, fontWeight: 700,
                color: stats.collected === stats.total ? info.color : '#aaa',
              }}>
                {stats.collected}/{stats.total}
                {stats.collected === stats.total && ' ✅'}
              </div>
            </div>

            {/* フルーツグリッド */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
              background: 'white',
              borderRadius: 16,
              padding: 12,
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              border: `2px solid ${info.color}22`,
            }}>
              {fruitsOfRarity.map(fruit => {
                const owned = collection.items[fruit.id];
                const count = owned?.count || 0;

                return (
                  <div key={fruit.id} style={{
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 2,
                    position: 'relative',
                  }}>
                    {/* フルーツ画像 */}
                    <div style={{
                      width: 64, height: 64,
                      borderRadius: 12,
                      background: owned ? info.bgColor : '#f5f5f5',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      border: owned ? `2px solid ${info.color}44` : '2px solid #e0e0e0',
                      position: 'relative',
                      overflow: 'hidden',
                    }}>
                      <img
                        src={fruit.image}
                        alt={owned ? fruit.name : '???'}
                        style={{
                          width: 50, height: 50,
                          objectFit: 'contain',
                          filter: owned
                            ? (rarity === RARITY.LEGEND ? 'drop-shadow(0 0 6px rgba(255,215,0,0.5))' : 'none')
                            : 'grayscale(1) brightness(0.3) opacity(0.3)',
                          transition: 'filter 0.3s ease',
                        }}
                      />
                      {/* 所持数バッジ */}
                      {count > 1 && (
                        <div style={{
                          position: 'absolute', top: -2, right: -2,
                          background: info.color, color: 'white',
                          fontSize: 10, fontWeight: 900,
                          width: 20, height: 20, borderRadius: 10,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                        }}>
                          ×{count}
                        </div>
                      )}
                    </div>
                    {/* フルーツ名 */}
                    <div style={{
                      fontSize: 10, fontWeight: 700,
                      color: owned ? '#555' : '#ccc',
                      textAlign: 'center',
                      lineHeight: 1.2,
                    }}>
                      {owned ? fruit.name : '???'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* 合計収穫回数 */}
      <div style={{
        margin: '20px 16px', padding: 12,
        background: 'rgba(255,255,255,0.7)', borderRadius: 12,
        textAlign: 'center', fontSize: 13, color: '#888',
      }}>
        🌳 これまでの しゅうかく: {collection.totalHarvests}かい
      </div>
    </div>
  );
};

export default CollectionScreen;
