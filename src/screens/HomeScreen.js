// ============================================
// 🏠 HomeScreen - メインホーム画面
// まなびの木 + キャラ🐕 + ミッションボタン + ナビ
// v0.6.0: petName対応（キャラ名カスタマイズ）
// v0.9.2: 教科再構成（しゃかい🗾・どうとく💛追加、2×3グリッド化）
// ============================================

import React, { useState, useEffect } from 'react';
import TreeSVG from '../components/TreeSVG';
import MameCharacter from '../components/MameCharacter';
import RobotCharacter from '../components/RobotCharacter';
import { COLORS } from '../constants/colors';
import { getMameMessage, getStreakMessage } from '../constants/mameMessages';
import { SUBJECT_LEVELS, getLevelLabel } from '../constants/learningLevels';

const HomeScreen = ({
  leaves, flowers, fruits, streak, todayDone, subjectLevels, petName, puzzleData, equippedItem,
  userPlan, trialDaysLeft,
  onStartLearning, onOpenMath, onOpenKokugo, onOpenRika, onStartShakai, onStartClock, onStartDoutoku, onOpenGenso, onOpenMimamori, onOpenLevelSettings, onOpenFukushu, onOpenGohoubi
}) => {
  const isFree = userPlan === 'free';
  const isTrial = userPlan === 'trial';
  const [mameMessage, setMameMessage] = useState('');

  // 画面表示時にキャラのメッセージをセット
  useEffect(() => {
    if (todayDone) {
      setMameMessage('きょうの ミッション クリア！えらいね！🎉');
    } else if (streak >= 3) {
      setMameMessage(getStreakMessage(streak));
    } else {
      setMameMessage(getMameMessage('home', petName));
    }
  }, [todayDone, streak, petName]);

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
        padding: '0 20px', marginTop: 8, position: 'relative',
      }}>
        {/* ロボットくんは木の左に */}
        <div style={{
          position: 'absolute', left: 16, bottom: 0,
        }}>
          <RobotCharacter
            pose={todayDone ? 'cheer' : 'wave'}
            size={72}
          />
        </div>
        <TreeSVG leaves={leaves} flowers={flowers} fruits={fruits} />
        {/* まめは木の右に */}
        <div style={{
          position: 'absolute', right: 20, bottom: 0,
        }}>
          <MameCharacter
            pose={todayDone ? 'medal' : (streak >= 3 ? 'flag' : 'normal')}
            message={mameMessage}
            size={80}
            petName={petName}
            equippedItem={equippedItem}
          />
        </div>
      </div>

      {/* 木のステータス */}
      <div style={{ textAlign: 'center', padding: '0 20px 12px' }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.greenDark }}>
          🌿 はっぱ {leaves}まい　🌸 おはな {flowers}こ　🍎 みのり {fruits}こ
        </div>
        <div style={{ fontSize: 12, color: COLORS.textLight, marginTop: 4 }}>
          がくしゅうすると きが そだつよ！
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
    </div>
  );
};

export default HomeScreen;
