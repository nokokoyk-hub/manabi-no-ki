// ============================================
// 🏠 HomeScreen - メインホーム画面
// まなびの木 + キャラ🐕🤖 + ミッションボタン + ナビ
// v0.6.0: petName対応（キャラ名カスタマイズ）
// v0.9.2: 教科再構成（しゃかい🗾・どうとく💛追加、2×3グリッド化）
// v1.0.2: キャラ選択機能（まめ/ロボちゃん切替）（2026/06/26）
// v1.0.4: キャラ名変更機能（長押しで名前変更ダイアログ）（2026/06/29）
// v1.0.7: セリフ全分岐キャラ対応（ロボちゃんがまめのセリフを喋る問題を修正）（2026/07/03）
// v1.0.8: 吹き出しをせんせい側キャラに表示（ロボ選択時はロボの頭上に）（2026/07/03）
// v1.0.9: せんせいバッジを足元ネームプレート化（吹き出しとの重なり解消）（2026/07/03）
// ============================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import TreeSVG from '../components/TreeSVG';
import MameCharacter from '../components/MameCharacter';
import RobotCharacter from '../components/RobotCharacter';
import GrowthEffect from '../components/GrowthEffect';
import { COLORS } from '../constants/colors';
import { getCharaMessage, getStreakMessage } from '../constants/mameMessages';
import { GROWTH_FX, GROWTH_FX_ENABLED } from '../constants/growthEffects';
import { SUBJECT_LEVELS, getLevelLabel } from '../constants/learningLevels';

const HomeScreen = ({
  leaves, flowers, fruits, streak, todayDone, subjectLevels, petName, rawPetName, robotName, puzzleData, equippedItem,
  userPlan, trialDaysLeft, selectedCharacter, onCharacterChange, onRenameCharacter,
  onStartLearning, onOpenMath, onOpenKokugo, onOpenRika, onStartShakai, onStartClock, onStartDoutoku, onOpenGenso, onOpenMimamori, onOpenLevelSettings, onOpenFukushu, onOpenGohoubi,
  canHarvest, onHarvest, onOpenCollection, fruitCollection,
  growthEvent, onGrowthEventEnd
}) => {
  const isFree = userPlan === 'free';
  const isTrial = userPlan === 'trial';
  const [mameMessage, setMameMessage] = useState('');

  // ===== 🎬 成長演出（v1.0.5） =====
  // growthEvent ('leaf'|'flower'|'fruit') を受け取ったら演出再生 → duration後に自動終了
  const [activeFx, setActiveFx] = useState(null);

  useEffect(() => {
    if (!growthEvent || !GROWTH_FX_ENABLED) return;
    const fx = GROWTH_FX[growthEvent];
    if (!fx) return;

    setActiveFx(fx);
    const timer = setTimeout(() => {
      setActiveFx(null);
      onGrowthEventEnd && onGrowthEventEnd();
    }, fx.duration);

    return () => clearTimeout(timer);
  }, [growthEvent, onGrowthEventEnd]);

  // 画面表示時にキャラのメッセージをセット（演出中は演出メッセージ優先）
  // v1.0.7: 全分岐をキャラ対応化（ロボちゃん選択時はロボ口調＋ロボの名前で{name}置換）
  const charaName = selectedCharacter === 'robot' ? robotName : petName;

  useEffect(() => {
    if (activeFx) {
      setMameMessage(selectedCharacter === 'robot' && activeFx.messageRobot ? activeFx.messageRobot : activeFx.message);
    } else if (todayDone) {
      setMameMessage(getCharaMessage('missionDone', charaName, selectedCharacter));
    } else if (streak >= 3) {
      setMameMessage(getStreakMessage(streak, selectedCharacter));
    } else {
      setMameMessage(getCharaMessage('home', charaName, selectedCharacter));
    }
  }, [activeFx, todayDone, streak, charaName, selectedCharacter]);

  // 💬 ホーム吹き出し（v1.0.8: せんせい側のキャラの頭上に表示）
  // side: 'left'=ロボちゃん側（木の左・右方向に展開） / 'right'=まめ側（木の右・左方向に展開）
  const renderBubble = (side) => mameMessage && (
    <div style={{
      position: 'absolute',
      bottom: '100%',
      ...(side === 'left' ? { left: -4 } : { right: -4 }),
      marginBottom: 4,
      background: 'white',
      borderRadius: 14,
      padding: '6px 14px',
      fontSize: 12,
      fontWeight: 700,
      color: '#5D4037',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      maxWidth: '55vw',
      width: 'max-content',
      textAlign: 'center',
      lineHeight: 1.5,
      zIndex: 3,
      animation: 'mame-fadeIn 0.3s ease-out',
    }}>
      {mameMessage}
      <div style={{
        position: 'absolute',
        bottom: -7,
        ...(side === 'left' ? { left: 18 } : { right: 18 }),
        width: 0, height: 0,
        borderLeft: '7px solid transparent',
        borderRight: '7px solid transparent',
        borderTop: '7px solid white',
      }} />
    </div>
  );

  // ===== 🏷️ キャラ名変更（長押し） =====
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null); // 'mame' or 'robot'
  const [renameInput, setRenameInput] = useState('');
  const longPressTimer = useRef(null);
  const longPressTriggered = useRef(false);

  const handlePressStart = useCallback((target) => {
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      setRenameTarget(target);
      setRenameInput(target === 'robot' ? (robotName || 'ロボちゃん') : (rawPetName || 'まめ'));
      setShowRenameModal(true);
    }, 500);
  }, [robotName, rawPetName]);

  const handlePressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  const handleCharaTap = useCallback((char) => {
    if (longPressTriggered.current) return; // 長押し後はタップ無視
    onCharacterChange && onCharacterChange(char);
  }, [onCharacterChange]);

  const handleRenameSubmit = useCallback(() => {
    const trimmed = renameInput.trim();
    if (!trimmed || !onRenameCharacter) return;
    onRenameCharacter(renameTarget, trimmed);
    setShowRenameModal(false);
  }, [renameInput, renameTarget, onRenameCharacter]);

  const levelSummary = SUBJECT_LEVELS
    .map(subject => `${subject.emoji}${getLevelLabel(subjectLevels?.[subject.key] || 1)}`)
    .join(' ');

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(180deg, ${COLORS.sky} 0%, ${COLORS.bg} 40%, ${COLORS.bgSoft} 100%)`,
      fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
      position: 'relative', overflow: 'hidden',
    }}>
      {/* 雲アニメーション */}
      <div style={{
        position: 'absolute', top: 20, left: '10%',
        fontSize: 28, opacity: 0.3,
        animation: 'floatCloud 8s ease-in-out infinite',
      }}>☁️</div>
      <div style={{
        position: 'absolute', top: 40, right: '15%',
        fontSize: 20, opacity: 0.2,
        animation: 'floatCloud 12s ease-in-out infinite',
      }}>☁️</div>

      {/* ヘッダー */}
      <div style={{
        padding: '20px 24px 12px', display: 'flex',
        justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <div style={{
            fontSize: 22, fontWeight: 800, color: COLORS.greenDark,
            letterSpacing: '0.05em',
          }}>
            🌳 まなびの木
          </div>
          <div style={{ fontSize: 13, color: COLORS.textLight, marginTop: 2 }}>
            {petName}と いっしょに がんばろう！
          </div>
        </div>
        <button
          onClick={onOpenMimamori}
          style={{
            background: 'white', border: '2px solid #E0E0E0',
            borderRadius: 12, padding: '8px 14px', fontSize: 13,
            fontWeight: 700, color: COLORS.textLight, cursor: 'pointer',
            fontFamily: "'Rounded Mplus 1c', sans-serif",
            opacity: isFree ? 0.55 : 1,
          }}
        >
          {isFree ? '🔒' : '👀'} みまもり
        </button>
      </div>

      {/* ストリークバッジ */}
      {streak > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
          <div style={{
            background: 'linear-gradient(135deg, #FF9800, #FF5722)',
            color: 'white', borderRadius: 20, padding: '6px 18px',
            fontSize: 14, fontWeight: 700,
            boxShadow: '0 3px 12px rgba(255,87,34,0.3)',
          }}>
            🔥 {streak}にち れんぞく！
          </div>
        </div>
      )}

      {/* トライアルバナー（Phase C） */}
      {isTrial && trialDaysLeft !== null && (
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 4, padding: '0 20px',
        }}>
          <div style={{
            background: trialDaysLeft <= 1
              ? 'linear-gradient(135deg, #FF9800, #F44336)'
              : 'linear-gradient(135deg, #42A5F5, #7E57C2)',
            color: 'white', borderRadius: 16, padding: '8px 20px',
            fontSize: 13, fontWeight: 700, textAlign: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)', width: '100%', maxWidth: 320,
          }}>
            {trialDaysLeft > 1
              ? `🎁 あと ${trialDaysLeft}にち ぜんぶ つかえるよ！`
              : trialDaysLeft === 1
                ? '🌳 あしたから ミッション１かいだけに なるよ'
                : '⏰ トライアルが おわりました'}
          </div>
        </div>
      )}

      {/* 無料プランバナー */}
      {isFree && (
        <div style={{
          display: 'flex', justifyContent: 'center', marginBottom: 4, padding: '0 20px',
        }}>
          <div style={{
            background: '#FFF3E0', border: '1px solid #FFE0B2',
            borderRadius: 16, padding: '8px 20px',
            fontSize: 12, fontWeight: 600, textAlign: 'center',
            color: '#E65100', width: '100%', maxWidth: 320,
          }}>
            🆓 むりょうプラン — ミッション 1にち1かい
          </div>
        </div>
      )}

      {/* 木 + キャラエリア */}
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'flex-end',
        padding: '0 10px', marginTop: 8,
      }}>
        {/* ロボットくんは木の左に（タップで出題キャラ選択 / 長押しで名前変更） */}
        <div
          onClick={() => handleCharaTap('robot')}
          onTouchStart={() => handlePressStart('robot')}
          onTouchEnd={handlePressEnd}
          onTouchCancel={handlePressEnd}
          onMouseDown={() => handlePressStart('robot')}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          style={{
            flexShrink: 0, width: 72, marginRight: -8, zIndex: 1, overflow: 'visible',
            position: 'relative', cursor: 'pointer',
          }}
        >
          {selectedCharacter === 'robot' && (
            <div style={{
              position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
              fontSize: 10, fontWeight: 800, color: '#FF9800',
              background: '#FFF8E1', borderRadius: 8, padding: '2px 6px',
              whiteSpace: 'nowrap', zIndex: 5,
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}>🎯 せんせい</div>
          )}
          {selectedCharacter === 'robot' && renderBubble('left')}
          <RobotCharacter
            pose={activeFx ? activeFx.charPose : (todayDone ? 'cheer' : 'wave')}
            size={72}
            enableTap={false}
          />
        </div>
        {/* 🎬 木 + 成長演出（v1.0.5: アニメーション + 粒子） */}
        <div style={{
          position: 'relative',
          animation: activeFx ? activeFx.treeAnimation : 'none',
          transformOrigin: 'center bottom',
        }}>
          <TreeSVG leaves={leaves} flowers={flowers} fruits={fruits} />
          {activeFx && (
            <GrowthEffect
              particles={activeFx.particles}
              count={activeFx.particleCount}
            />
          )}
        </div>
        {/* まめは木の右に（タップで出題キャラ選択 / 長押しで名前変更） */}
        <div
          onClick={() => handleCharaTap('mame')}
          onTouchStart={() => handlePressStart('mame')}
          onTouchEnd={handlePressEnd}
          onTouchCancel={handlePressEnd}
          onMouseDown={() => handlePressStart('mame')}
          onMouseUp={handlePressEnd}
          onMouseLeave={handlePressEnd}
          style={{
            flexShrink: 0, width: 80, marginLeft: -8, zIndex: 1, overflow: 'visible',
            position: 'relative', cursor: 'pointer',
          }}
        >
          {selectedCharacter === 'mame' && (
            <div style={{
              position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
              fontSize: 10, fontWeight: 800, color: '#FF9800',
              background: '#FFF8E1', borderRadius: 8, padding: '2px 6px',
              whiteSpace: 'nowrap', zIndex: 5,
              boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
            }}>🎯 せんせい</div>
          )}
          {/* ホーム専用吹き出し（v1.0.8: せんせい側キャラに表示） */}
          {selectedCharacter === 'mame' && renderBubble('right')}
          <MameCharacter
            pose={activeFx ? activeFx.charPose : (todayDone ? 'medal' : (streak >= 3 ? 'flag' : 'normal'))}
            message=""
            size={80}
            petName={petName}
            equippedItem={equippedItem}
          />
        </div>
      </div>

      {/* 木のステータス */}
      <div style={{ textAlign: 'center', padding: '0 20px 12px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.greenDark }}>
          🌸 おはな {flowers}こ　🍎 みのり {fruits}こ
        </div>
        <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>
          {canHarvest ? '🍎 みのりを タップして しゅうかくしよう！' : 'がくしゅうすると きが そだつよ！'}
        </div>

        {/* 🍎 収穫ボタン（実がある時だけ表示） */}
        {canHarvest && (
          <button onClick={onHarvest} style={{
            marginTop: 8,
            background: 'linear-gradient(135deg, #FF6B6B, #FF4757)',
            color: 'white', border: 'none', borderRadius: 30,
            padding: '10px 28px', fontSize: 16, fontWeight: 900,
            cursor: 'pointer', fontFamily: "'Rounded Mplus 1c', sans-serif",
            boxShadow: '0 4px 15px rgba(255,71,87,0.4)',
            animation: 'mame-float 2s ease-in-out infinite',
          }}>
            🍎 しゅうかくする！
          </button>
        )}

        {/* 📦 果実コレクションボタン */}
        <div style={{ marginTop: 8 }}>
          <button onClick={onOpenCollection} style={{
            background: 'rgba(139,195,74,0.15)', border: '2px solid #8BC34A44',
            borderRadius: 20, padding: '6px 18px',
            fontSize: 12, fontWeight: 700, color: '#689F38',
            cursor: 'pointer', fontFamily: "'Rounded Mplus 1c', sans-serif",
          }}>
            🍎 かじつコレクション
            {fruitCollection && Object.keys(fruitCollection.items || {}).length > 0 && (
              <span style={{ marginLeft: 4 }}>
                ({Object.keys(fruitCollection.items).length}しゅるい)
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ミッションボタン */}
      <div style={{ padding: '8px 20px 12px' }}>
        <button
          onClick={() => !todayDone && onStartLearning()}
          style={{
            width: '100%',
            background: todayDone
              ? 'linear-gradient(135deg, #A5D6A7, #81C784)'
              : 'linear-gradient(135deg, #FF9800, #F57C00)',
            border: 'none', borderRadius: 20, padding: '20px',
            cursor: todayDone ? 'default' : 'pointer',
            boxShadow: todayDone
              ? '0 4px 15px rgba(76,175,80,0.3)'
              : '0 4px 20px rgba(255,152,0,0.4)',
          }}
        >
          <div style={{
            fontSize: 20, fontWeight: 800, color: 'white',
            letterSpacing: '0.05em',
            fontFamily: "'Rounded Mplus 1c', sans-serif",
          }}>
            {todayDone ? '✅ きょうの ミッション クリア！' : '📝 きょうの ミッション スタート！'}
          </div>
          <div style={{
            fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 6,
          }}>
            {todayDone ? 'あしたも いっしょに がんばろうね' : 'その子にあわせた レベルで 8もん！'}
          </div>
        </button>
      </div>

      {/* レベル設定カード */}
      <div style={{ padding: '0 20px 12px' }}>
        <div onClick={onOpenLevelSettings} style={{
          background: 'white', borderRadius: 18, padding: '14px 16px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          cursor: 'pointer', border: '2px solid #FFF3E0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: COLORS.text }}>
                🎚️ 教科ごとの レベル設定
              </div>
              <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 4, lineHeight: 1.5 }}>
                {levelSummary}
              </div>
            </div>
            <div style={{ fontSize: 22, color: COLORS.orange }}>›</div>
          </div>
        </div>
      </div>

      {/* 教科ボタン（2列グリッド） */}
      <div style={{
        padding: '0 20px 12px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
      }}>
        {[
          { emoji: '🔢', name: 'さんすう', sub: 'けいさん', onClick: onOpenMath, border: '#E3F2FD', locked: isFree },
          { emoji: '📖', name: 'こくご', sub: 'かんじ・ことば', onClick: onOpenKokugo, border: '#E8F5E9', locked: isFree },
          { emoji: '🌿', name: 'りか', sub: 'しぜん・いきもの', onClick: onOpenRika, border: '#E0F2F1', locked: isFree },
          { emoji: '🗾', name: 'しゃかい', sub: 'ちり・れきし', onClick: onStartShakai, border: '#FBE9E7', locked: isFree },
          { emoji: '⏰', name: 'とけい', sub: 'なんじ？', onClick: onStartClock, border: '#E3F2FD', locked: isFree },
          { emoji: '💛', name: 'どうとく', sub: 'きもち', onClick: onStartDoutoku, border: '#FFF8E1', locked: isFree },
          { emoji: '🔬', name: 'げんそ', sub: 'もんだい・ずかん', onClick: onOpenGenso, border: '#F3E5F5', locked: isFree },
        ].map((btn, i) => (
          <div key={i} onClick={btn.onClick} style={{
            background: 'white', borderRadius: 16, padding: 14,
            textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
            cursor: 'pointer', border: `2px solid ${btn.border}`,
            position: 'relative', opacity: btn.locked ? 0.55 : 1,
          }}>
            <div style={{ fontSize: 26, marginBottom: 4 }}>{btn.emoji}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{btn.name}</div>
            <div style={{ fontSize: 10, color: COLORS.textLight, marginTop: 2 }}>{btn.sub}</div>
            {btn.locked && (
              <div style={{
                position: 'absolute', top: 6, right: 6,
                fontSize: 14, background: 'rgba(0,0,0,0.08)', borderRadius: 8,
                padding: '1px 5px',
              }}>🔒</div>
            )}
          </div>
        ))}
      </div>

      {/* ごほうび・ふくしゅう */}
      <div style={{
        padding: '0 20px 100px',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
      }}>
        <div onClick={onOpenGohoubi} style={{
          background: 'white', borderRadius: 16, padding: 16,
          textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          cursor: 'pointer', border: '2px solid #FFF3E0',
        }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>🎁</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>ごほうび</div>
          <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>
            🧩 {puzzleData?.collected || 0}/9 ピース
          </div>
        </div>
        <div onClick={onOpenFukushu} style={{
          background: 'white', borderRadius: 16, padding: 16,
          textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          cursor: 'pointer', border: '2px solid #E8F5E9',
          position: 'relative', opacity: isFree ? 0.55 : 1,
        }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>📚</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>ふくしゅう</div>
          <div style={{ fontSize: 11, color: COLORS.textLight, marginTop: 2 }}>
            にがてを そっと れんしゅう
          </div>
          {isFree && (
            <div style={{
              position: 'absolute', top: 6, right: 6,
              fontSize: 14, background: 'rgba(0,0,0,0.08)', borderRadius: 8,
              padding: '1px 5px',
            }}>🔒</div>
          )}
        </div>
      </div>

      {/* ===== 🏷️ キャラ名変更モーダル ===== */}
      {showRenameModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 100, padding: 20,
        }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowRenameModal(false); }}
        >
          <div style={{
            background: 'white', borderRadius: 24, padding: '28px 24px',
            width: '100%', maxWidth: 320, textAlign: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
            animation: 'mame-fadeIn 0.2s ease-out',
          }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>
              {renameTarget === 'robot' ? '🤖' : '🐕'}
            </div>
            <div style={{
              fontSize: 16, fontWeight: 800, color: '#2E7D32', marginBottom: 4,
            }}>
              {renameTarget === 'robot' ? 'ロボちゃん' : 'まめ'}の なまえを かえるよ！
            </div>
            <div style={{
              fontSize: 11, color: '#999', marginBottom: 16,
            }}>
              すきな なまえを つけてね 🌟
            </div>
            <input
              type="text"
              value={renameInput}
              onChange={(e) => setRenameInput(e.target.value)}
              maxLength={10}
              autoFocus
              style={{
                width: '100%', padding: '12px 16px',
                fontSize: 18, fontWeight: 700, textAlign: 'center',
                border: '2px solid #C8E6C9', borderRadius: 14,
                outline: 'none', fontFamily: "'Rounded Mplus 1c', sans-serif",
                background: '#F1F8E9', color: '#333',
              }}
              onFocus={(e) => e.target.select()}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSubmit(); }}
            />
            <div style={{ fontSize: 10, color: '#BDBDBD', marginTop: 6 }}>
              {renameInput.length}/10もじ
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <button
                onClick={() => setShowRenameModal(false)}
                style={{
                  flex: 1, padding: '10px', fontSize: 14, fontWeight: 700,
                  background: '#F5F5F5', border: '1px solid #E0E0E0',
                  borderRadius: 14, color: '#888', cursor: 'pointer',
                  fontFamily: "'Rounded Mplus 1c', sans-serif",
                }}
              >もどる</button>
              <button
                onClick={handleRenameSubmit}
                disabled={!renameInput.trim()}
                style={{
                  flex: 1, padding: '10px', fontSize: 14, fontWeight: 800,
                  background: renameInput.trim() ? 'linear-gradient(135deg, #66BB6A, #43A047)' : '#E0E0E0',
                  border: 'none', borderRadius: 14,
                  color: renameInput.trim() ? 'white' : '#999',
                  cursor: renameInput.trim() ? 'pointer' : 'default',
                  fontFamily: "'Rounded Mplus 1c', sans-serif",
                  boxShadow: renameInput.trim() ? '0 3px 10px rgba(67,160,71,0.3)' : 'none',
                }}
              >けってい！✨</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeScreen;
