// ============================================
// 🎁 GohoubiScreen - ごほうびパズル画面
// パズルのピースを集めて絵を完成させる！
// v0.7.1: 新規作成
// ============================================

import React, { useState, useEffect } from 'react';
import MameCharacter from '../components/MameCharacter';
import { COLORS } from '../constants/colors';
import { loadPuzzleData } from '../lib/storage';
import { getPuzzleById } from '../data/puzzles';

const GohoubiScreen = ({ onBack, petName, puzzleData: propsPuzzleData }) => {
  const [puzzleData] = useState(propsPuzzleData || loadPuzzleData());
  const [showArchive, setShowArchive] = useState(false);
  const [imgError, setImgError] = useState(false);

  const displayName = petName || 'まめ';
  const puzzle = getPuzzleById(puzzleData.currentPuzzleId);
  const collected = puzzleData.collected || 0;
  const isComplete = collected >= 9;
  const completedIds = puzzleData.completedIds || [];

  // まめのメッセージ
  const getMessage = () => {
    if (isComplete) return `やったー！！かんせい！！🎉💖`;
    if (collected >= 7) return `あと ${9 - collected}ピース！もうすぐだよ！`;
    if (collected >= 4) return `はんぶん くらい きたね！✨`;
    if (collected >= 1) return `ピースが あつまってきたよ！🧩`;
    return `ミッションを クリアして\nピースを あつめよう！`;
  };

  // まめのポーズ
  const getPose = () => {
    if (isComplete) return 'cry_happy';
    if (collected >= 7) return 'cheer';
    if (collected >= 4) return 'flag';
    if (collected >= 1) return 'happy';
    return 'touched';
  };

  // パズルピースのレンダリング
  const renderPuzzleGrid = () => {
    const pieces = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const pieceIndex = row * 3 + col;
        const isCollected = pieceIndex < collected;

        pieces.push(
          <div
            key={pieceIndex}
            style={{
              width: '100%',
              aspectRatio: '1',
              borderRadius: 8,
              overflow: 'hidden',
              position: 'relative',
              border: isCollected ? '2px solid #A5D6A7' : '2px dashed #E0E0E0',
              background: isCollected ? 'transparent' : '#F5F5F5',
              transition: 'all 0.3s ease',
              animation: isCollected && pieceIndex === collected - 1
                ? 'popIn 0.5s ease-out' : 'none',
            }}
          >
            {isCollected && !imgError ? (
              <div style={{
                width: '300%',
                height: '300%',
                backgroundImage: `url(${puzzle.image})`,
                backgroundSize: '100% 100%',
                backgroundPosition: `${-col * 100}% ${-row * 100}%`,
                transform: `translate(${-col * 100 / 3}%, ${-row * 100 / 3}%)`,
                imageRendering: 'auto',
              }} />
            ) : isCollected && imgError ? (
              // 画像がまだない場合のフォールバック
              <div style={{
                width: '100%',
                height: '100%',
                background: `hsl(${pieceIndex * 40}, 70%, 80%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
              }}>
                🧩
              </div>
            ) : (
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 22,
                color: '#BDBDBD',
                fontWeight: 800,
              }}>
                ？
              </div>
            )}
          </div>
        );
      }
    }
    return pieces;
  };

  // 隠し画像プリロード（エラーチェック用）
  useEffect(() => {
    if (puzzle?.image) {
      const img = new Image();
      img.onload = () => setImgError(false);
      img.onerror = () => setImgError(true);
      img.src = puzzle.image;
    }
  }, [puzzle]);

  // アーカイブ画面
  if (showArchive) {
    return (
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(180deg, ${COLORS.sky} 0%, ${COLORS.bg} 42%, ${COLORS.bgSoft} 100%)`,
        fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
      }}>
        <div style={{
          padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
          background: 'rgba(255,255,255,0.92)', borderBottom: '2px solid #F5F5F5',
          position: 'sticky', top: 0, zIndex: 2,
        }}>
          <button onClick={() => setShowArchive(false)} style={{
            background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', padding: 4,
          }}>←</button>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.greenDark }}>📚 アーカイブ</div>
            <div style={{ fontSize: 12, color: COLORS.textLight }}>かんせいした パズルたち</div>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {completedIds.length === 0 ? (
            <div style={{
              background: 'white', borderRadius: 20, padding: 32, textAlign: 'center',
              boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
            }}>
              <MameCharacter pose="touched" message="まだ かんせいした パズルは ないよ" size={80} petName={displayName} />
              <div style={{ marginTop: 16, fontSize: 14, color: COLORS.textLight, fontWeight: 700, lineHeight: 1.7 }}>
                ミッションを クリアして
                <br />ピースを あつめよう！
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {completedIds.map(id => {
                const p = getPuzzleById(id);
                return (
                  <div key={id} style={{
                    background: 'white', borderRadius: 18, overflow: 'hidden',
                    boxShadow: '0 4px 18px rgba(0,0,0,0.06)',
                    border: '2px solid #A5D6A7',
                  }}>
                    <div style={{
                      width: '100%', aspectRatio: '1',
                      backgroundImage: `url(${p.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: '#F5F5F5',
                    }} />
                    <div style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text }}>{p.title}</div>
                      <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>✅ かんせい！</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  // メイン画面
  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${COLORS.sky} 0%, ${COLORS.bg} 42%, ${COLORS.bgSoft} 100%)`,
      fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    }}>
      {/* ヘッダー */}
      <div style={{
        padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12,
        background: 'rgba(255,255,255,0.92)', borderBottom: '2px solid #F5F5F5',
        position: 'sticky', top: 0, zIndex: 2,
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', padding: 4,
        }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: COLORS.greenDark }}>🎁 ごほうび</div>
          <div style={{ fontSize: 12, color: COLORS.textLight }}>パズルを かんせい させよう！</div>
        </div>
        <button onClick={() => setShowArchive(true)} style={{
          background: 'white', border: '2px solid #E0E0E0', borderRadius: 12,
          padding: '6px 12px', fontSize: 12, fontWeight: 700, color: COLORS.textLight,
          cursor: 'pointer', fontFamily: "'Rounded Mplus 1c', sans-serif",
        }}>
          📚 アーカイブ
        </button>
      </div>

      <div style={{ padding: 20 }}>
        {/* まめ + メッセージ */}
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 16,
        }}>
          <MameCharacter
            pose={getPose()}
            message={getMessage()}
            size={80}
            petName={displayName}
          />
        </div>

        {/* パズルタイトル */}
        <div style={{
          background: 'white', borderRadius: 18, padding: '14px 16px', marginBottom: 16,
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', textAlign: 'center',
        }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text }}>
            🧩 {puzzle.title}
          </div>
          <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>
            {puzzle.description}
          </div>
        </div>

        {/* パズルグリッド */}
        <div style={{
          background: 'white', borderRadius: 20, padding: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: 16,
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 6,
          }}>
            {renderPuzzleGrid()}
          </div>
        </div>

        {/* 進捗バー */}
        <div style={{
          background: 'white', borderRadius: 16, padding: '14px 18px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)', marginBottom: 16,
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8,
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.text }}>
              {isComplete ? '🎉 かんせい！' : `🧩 ${collected} / 9 ピース`}
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.orange }}>
              {isComplete ? '100%' : `${Math.round(collected / 9 * 100)}%`}
            </div>
          </div>
          <div style={{
            height: 12, background: '#E8F5E9', borderRadius: 6, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              borderRadius: 6,
              background: isComplete
                ? 'linear-gradient(90deg, #4CAF50, #FFD700)'
                : 'linear-gradient(90deg, #4CAF50, #81C784)',
              width: `${(collected / 9) * 100}%`,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>

        {/* ヒント */}
        <div style={{
          background: '#FFFDE7', border: '2px solid #FFE082', borderRadius: 18,
          padding: 14, fontSize: 12, lineHeight: 1.7,
          color: COLORS.textLight, fontWeight: 700, textAlign: 'center',
        }}>
          💡 まいにちの ミッションを クリアすると
          <br />パズルの ピースが 1つ もらえるよ！
        </div>
      </div>
    </div>
  );
};

export default GohoubiScreen;
