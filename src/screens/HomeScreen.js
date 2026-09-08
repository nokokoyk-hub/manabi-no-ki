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
// v1.0.13: ガチャキャラ せんせい選択機能追加（2026/07/21）
// v1.0.14: 着せ替え複数装着対応（equippedItems）
// ============================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import MameCharacter from '../components/MameCharacter';
import RobotCharacter from '../components/RobotCharacter';
import GachaCharacter from '../components/GachaCharacter';
import GrowthEffect from '../components/GrowthEffect';
import { COLORS } from '../constants/colors';
import { getCharaMessage, getStreakMessage } from '../constants/mameMessages';
import { GROWTH_FX, GROWTH_FX_ENABLED } from '../constants/growthEffects';
import { GACHA_CHARACTERS, isGachaCharacter, getFruitById } from '../lib/gachaData';
const HomeScreen = ({
  leaves,
  flowers,
  fruits,
  streak,
  todayDone,
  subjectLevels,
  petName,
  rawPetName,
  robotName,
  puzzleData,
  equippedItems,
  userPlan,
  trialDaysLeft,
  selectedCharacter,
  onCharacterChange,
  onRenameCharacter,
  onStartLearning,
  onOpenMath,
  onOpenKokugo,
  onOpenRika,
  onStartShakai,
  onStartClock,
  onStartDoutoku,
  onOpenGenso,
  onOpenMimamori,
  onOpenLevelSettings,
  onOpenFukushu,
  onOpenGohoubi,
  canHarvest,
  onHarvest,
  onOpenCollection,
  fruitCollection,
  growthEvent,
  onGrowthEventEnd,
  onOpenHowTo
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

  // ===== 🏷️ キャラ名変更（長押し） =====
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null); // 'mame' or 'robot'
  const [renameInput, setRenameInput] = useState('');
  const longPressTimer = useRef(null);
  const longPressTriggered = useRef(false);
  const handlePressStart = useCallback(target => {
    longPressTriggered.current = false;
    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      setRenameTarget(target);
      setRenameInput(target === 'robot' ? robotName || 'ロボちゃん' : rawPetName || 'まめ');
      setShowRenameModal(true);
    }, 500);
  }, [robotName, rawPetName]);
  const handlePressEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);
  const handleCharaTap = useCallback(char => {
    if (longPressTriggered.current) return; // 長押し後はタップ無視
    onCharacterChange && onCharacterChange(char);
  }, [onCharacterChange]);
  const handleRenameSubmit = useCallback(() => {
    const trimmed = renameInput.trim();
    if (!trimmed || !onRenameCharacter) return;
    onRenameCharacter(renameTarget, trimmed);
    setShowRenameModal(false);
  }, [renameInput, renameTarget, onRenameCharacter]);
  const handleLogoClick = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // ===== 🎓 せんせい選択（ガチャキャラ対応・v1.0.13） =====
  // ガチャキャラがせんせいのときは、木の右（まめの位置）にそのキャラを表示する
  const isGachaSelected = isGachaCharacter(selectedCharacter);
  const selectedGachaFruit = isGachaSelected ? getFruitById(selectedCharacter) : null;
  const [showCharaSelectModal, setShowCharaSelectModal] = useState(false);
  const handleSelectTeacher = useCallback(charId => {
    onCharacterChange && onCharacterChange(charId);
    setShowCharaSelectModal(false);
  }, [onCharacterChange]);
  return <main className="mn-page mn-home">
    <header className="mn-home-heading"><div><button className="mn-logo" onClick={handleLogoClick}>🌳 まなびの木</button><p>まいにちの「できた！」を そだてよう</p></div><button className="reward-back" onClick={onOpenMimamori}>{isFree ? '🔒' : '👀'} みまもり</button></header>
    <div className="mn-streak">🌱 {streak > 0 ? streak + 'にち れんぞく！' : 'きょうの いっぽを はじめよう'}</div>
    <section className="mn-home-garden" aria-label={'まなびの木：葉' + leaves + '、花' + flowers + '、実' + fruits}>
      <img src="/ui/garden.png" alt="青空の下に育つまなびの木" className="mn-garden-image" style={{
        animation: activeFx ? activeFx.treeAnimation : 'none'
      }} />
      {canHarvest && <button className="mn-tree-fruit" onClick={onHarvest} aria-label={'みのりを しゅうかく（' + fruits + 'こ）'}><img src="/public/images/fruits/fruit_apple.png" alt="" /></button>}
      {activeFx && <GrowthEffect particles={activeFx.particles} count={activeFx.particleCount} />}
      <div className="mn-growth-counts"><span>🌸 はな {flowers}こ</span><span>🍎 みのり {fruits}こ</span></div>
    </section>
    <div className="mn-coach-message">{mameMessage}</div>
    <div className="mn-teachers">
      <button className="mn-teacher" aria-pressed={selectedCharacter === 'robot'} onClick={() => handleCharaTap('robot')} onPointerDown={() => handlePressStart('robot')} onPointerUp={handlePressEnd} onPointerCancel={handlePressEnd} onPointerLeave={handlePressEnd}><RobotCharacter pose={activeFx ? activeFx.charPose : 'wave'} size={80} enableTap={false} /><strong>{robotName || 'ロボちゃん'}</strong><small>{selectedCharacter === 'robot' ? '✓ せんせい' : 'えらぶ'}</small></button>
      <button className="mn-teacher" aria-pressed={selectedCharacter !== 'robot'} onClick={() => isGachaSelected ? setShowCharaSelectModal(true) : handleCharaTap('mame')} onPointerDown={() => !isGachaSelected && handlePressStart('mame')} onPointerUp={handlePressEnd} onPointerCancel={handlePressEnd} onPointerLeave={handlePressEnd}>
        {isGachaSelected ? <GachaCharacter charaId={selectedCharacter} pose="normal" size={80} name={selectedGachaFruit?.name} enableTap={false} /> : <MameCharacter pose={todayDone ? 'medal' : 'normal'} size={80} petName={rawPetName || 'まめ'} equippedItems={equippedItems} enableTap={false} />}
        <strong>{isGachaSelected ? selectedGachaFruit?.name : rawPetName || 'まめ'}</strong><small>{selectedCharacter !== 'robot' ? '✓ せんせい' : 'えらぶ'}</small>
      </button>
    </div>
    <div className="mn-teacher-actions"><button onClick={() => setShowCharaSelectModal(true)}>せんせいを えらぶ</button><button onClick={() => {
        setRenameTarget(selectedCharacter === 'robot' ? 'robot' : 'mame');
        setRenameInput(selectedCharacter === 'robot' ? robotName || 'ロボちゃん' : rawPetName || 'まめ');
        setShowRenameModal(true);
      }}>まめ・ロボの なまえ</button></div>
    {canHarvest && <button className="mn-harvest-link" onClick={onHarvest}>🍎 みのりが {fruits}こ！ しゅうかくする ›</button>}
    <section className="mn-mission"><span>きょうの ミッション</span><h1>{todayDone ? 'きょうも がんばったね！' : '８もんに チャレンジ！'}</h1><p>{todayDone ? 'あしたも いっしょに そだてよう' : '１もんずつ、じぶんの ペースで'}</p><button className="reward-primary" disabled={todayDone} onClick={onStartLearning}>{todayDone ? '✓ ミッション クリア！' : 'はじめる'} {!todayDone && <span aria-hidden="true">›</span>}</button></section>
    <nav className="mn-quick" aria-label="ごほうびとふくしゅう"><button onClick={onOpenGohoubi}>🧩 <strong>ごほうび</strong><small>{puzzleData?.collected || 0} / ９ ピース</small></button><button onClick={onOpenFukushu}>{isFree ? '🔒' : '📖'} <strong>ふくしゅう</strong><small>もういちど やろう</small></button></nav>
    <h2 className="mn-section-title">🌱 すきな きょうかで れんしゅう</h2>
    <nav className="mn-subject-grid" aria-label="きょうか">{[['🔢', 'さんすう', onOpenMath], ['📖', 'こくご', onOpenKokugo], ['🌿', 'りか', onOpenRika], ['🌏', 'しゃかい', onStartShakai], ['⏰', 'とけい', onStartClock], ['💛', 'どうとく', onStartDoutoku], ['⚛️', 'げんそ', onOpenGenso]].map(([icon, label, action], i) => <button key={label} className={'mn-subject subject-' + i} onClick={action}><span aria-hidden="true">{icon}</span><strong>{label}</strong>{isFree && <small>🔒</small>}</button>)}</nav>
    <button className="mn-row" onClick={onOpenLevelSettings}>⚙️ レベルせってい <span>›</span></button>
    <button className="mn-row" onClick={onOpenCollection}>📖 たからものの ずかん <span>›</span></button>
    <p className="mn-note">{isTrial && trialDaysLeft !== null ? 'おためし期間 あと' + Math.max(0, trialDaysLeft) + '日' : isFree ? 'むりょうプラン：ミッション １にち１かい' : ''}</p>
    <button className="mn-text-button" onClick={onOpenHowTo}>つかいかた</button>
      {/* ===== 🏷️ キャラ名変更モーダル ===== */}
      {showRenameModal && <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 20
    }} onClick={e => {
      if (e.target === e.currentTarget) setShowRenameModal(false);
    }}>
          <div style={{
        background: 'white',
        borderRadius: 24,
        padding: '28px 24px',
        width: '100%',
        maxWidth: 320,
        textAlign: 'center',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        animation: 'mame-fadeIn 0.2s ease-out'
      }}>
            <div style={{
          fontSize: 48,
          marginBottom: 8
        }}>
              {renameTarget === 'robot' ? '🤖' : '🐕'}
            </div>
            <div style={{
          fontSize: 16,
          fontWeight: 800,
          color: '#2E7D32',
          marginBottom: 4
        }}>
              {renameTarget === 'robot' ? 'ロボちゃん' : 'まめ'}の なまえを かえるよ！
            </div>
            <div style={{
          fontSize: 11,
          color: '#999',
          marginBottom: 16
        }}>
              すきな なまえを つけてね 🌟
            </div>
            <input type="text" value={renameInput} onChange={e => setRenameInput(e.target.value)} maxLength={10} autoFocus style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: 18,
          fontWeight: 700,
          textAlign: 'center',
          border: '2px solid #C8E6C9',
          borderRadius: 14,
          outline: 'none',
          fontFamily: "'Rounded Mplus 1c', sans-serif",
          background: '#F1F8E9',
          color: '#333'
        }} onFocus={e => e.target.select()} onKeyDown={e => {
          if (e.key === 'Enter') handleRenameSubmit();
        }} />
            <div style={{
          fontSize: 10,
          color: '#BDBDBD',
          marginTop: 6
        }}>
              {renameInput.length}/10もじ
            </div>
            <div style={{
          display: 'flex',
          gap: 10,
          marginTop: 16
        }}>
              <button onClick={() => setShowRenameModal(false)} style={{
            flex: 1,
            padding: '10px',
            fontSize: 14,
            fontWeight: 700,
            background: '#F5F5F5',
            border: '1px solid #E0E0E0',
            borderRadius: 14,
            color: '#888',
            cursor: 'pointer',
            fontFamily: "'Rounded Mplus 1c', sans-serif"
          }}>もどる</button>
              <button onClick={handleRenameSubmit} disabled={!renameInput.trim()} style={{
            flex: 1,
            padding: '10px',
            fontSize: 14,
            fontWeight: 800,
            background: renameInput.trim() ? 'linear-gradient(135deg, #66BB6A, #43A047)' : '#E0E0E0',
            border: 'none',
            borderRadius: 14,
            color: renameInput.trim() ? 'white' : '#999',
            cursor: renameInput.trim() ? 'pointer' : 'default',
            fontFamily: "'Rounded Mplus 1c', sans-serif",
            boxShadow: renameInput.trim() ? '0 3px 10px rgba(67,160,71,0.3)' : 'none'
          }}>けってい！✨</button>
            </div>
          </div>
        </div>}

      {/* ===== 🎓 せんせい選択モーダル（v1.0.13） ===== */}
      {showCharaSelectModal && <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 20
    }} onClick={e => {
      if (e.target === e.currentTarget) setShowCharaSelectModal(false);
    }}>
          <div style={{
        background: 'white',
        borderRadius: 24,
        padding: '24px 20px',
        width: '100%',
        maxWidth: 360,
        textAlign: 'center',
        boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        animation: 'mame-fadeIn 0.2s ease-out'
      }}>
            <div style={{
          fontSize: 16,
          fontWeight: 800,
          color: '#2E7D32',
          marginBottom: 4
        }}>
              🎓 せんせいを えらぼう！
            </div>
            <div style={{
          fontSize: 11,
          color: '#999',
          marginBottom: 16
        }}>
              いっしょに べんきょうする こを えらんでね
            </div>

            <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 8
        }}>
              {[{
            id: 'mame',
            name: rawPetName || 'まめ',
            emoji: '🐕'
          }, {
            id: 'robot',
            name: robotName || 'ロボちゃん',
            emoji: '🤖'
          }, ...GACHA_CHARACTERS.map(f => ({
            id: f.id,
            name: f.name,
            emoji: f.emoji
          }))].map(opt => {
            const isOwned = opt.id === 'mame' || opt.id === 'robot' || !!fruitCollection?.items?.[opt.id];
            const isSelected = selectedCharacter === opt.id;
            return <button key={opt.id} onClick={() => isOwned && handleSelectTeacher(opt.id)} disabled={!isOwned} style={{
              background: isSelected ? '#FFF3E0' : isOwned ? 'white' : '#F5F5F5',
              border: isSelected ? '2px solid #FF9800' : '2px solid #E0E0E0',
              borderRadius: 14,
              padding: '10px 4px',
              cursor: isOwned ? 'pointer' : 'default',
              textAlign: 'center',
              opacity: isOwned ? 1 : 0.45,
              transition: 'all 0.2s ease',
              fontFamily: "'Rounded Mplus 1c', sans-serif"
            }}>
                    <div style={{
                fontSize: 28
              }}>
                      {isOwned ? opt.emoji : '❓'}
                    </div>
                    <div style={{
                fontSize: 9,
                fontWeight: 700,
                marginTop: 4,
                color: isSelected ? '#EF6C00' : isOwned ? COLORS.text : COLORS.textLight,
                lineHeight: 1.3
              }}>
                      {isOwned ? opt.name : 'ガチャで ゲットしよう！'}
                    </div>
                    {isSelected && <div style={{
                fontSize: 8,
                color: '#FF9800',
                fontWeight: 800,
                marginTop: 2
              }}>
                        🎯 せんせい
                      </div>}
                  </button>;
          })}
            </div>

            <button onClick={() => setShowCharaSelectModal(false)} style={{
          marginTop: 18,
          width: '100%',
          padding: '10px',
          fontSize: 14,
          fontWeight: 700,
          background: '#F5F5F5',
          border: '1px solid #E0E0E0',
          borderRadius: 14,
          color: '#888',
          cursor: 'pointer',
          fontFamily: "'Rounded Mplus 1c', sans-serif"
        }}>とじる</button>
          </div>
        </div>}
    </main>;
};
export default HomeScreen;
