// ============================================
// 📝 LearningScreen - 学習（問題回答）画面
// 1回5問、選択肢式、正解で木が育つ
// v0.6.0: petName対応
// v0.6.1: アニメーション強化
//   - 連続正解コンボ判定（2連続→spin、3連続→sparkle）
//   - 不正解→shake（ぶるぶる）
//   - 全問正解→パーフェクト演出
//   - 出題時→wiggle（わくわく）
// ============================================

import React, { useState } from 'react';
import StarBurst from '../components/StarBurst';
import ClockSVG from '../components/ClockSVG';
import MameCharacter from '../components/MameCharacter';
import { COLORS } from '../constants/colors';
import { getTodayQuestions, getQuestionsByCategory, getQuestionsBySubject } from '../data/levelQuestions';
import { getMameMessage } from '../constants/mameMessages';

// モード名の表示テキスト
const MODE_LABELS = {
  mission: 'きょうの ミッション',
  okurigana: 'おくりがな れんしゅう',
  clock: 'とけい れんしゅう',
  math: 'さんすう ふくしゅう',
  kokugo: 'こくご ふくしゅう',
};

// コンボメッセージ
const getComboMessage = (combo, petName) => {
  if (combo >= 4) return `${combo}れんぞく！！てんさいだ！！🔥🔥`;
  if (combo >= 3) return `${combo}れんぞく！${petName} おどってる！💃✨`;
  if (combo >= 2) return `${combo}れんぞく せいかい！すごーい！🌟`;
  return getMameMessage('correct', petName);
};

const LearningScreen = ({ mode = 'mission', subjectLevels, petName, onComplete, onBack }) => {
  const [questions] = useState(() => {
    if (mode === 'okurigana') return getQuestionsByCategory('okurigana', 5, subjectLevels);
    if (mode === 'clock') return getQuestionsByCategory('clock', 5, subjectLevels);
    if (mode === 'math') return getQuestionsBySubject('さんすう', 5, subjectLevels);
    if (mode === 'kokugo') return getQuestionsBySubject('こくご', 5, subjectLevels);
    return getTodayQuestions(5, subjectLevels);
  });
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showStar, setShowStar] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0); // 連続正解カウント

  const displayName = petName || 'まめ';

  // キャラの状態
  const [mamePose, setMamePose] = useState('wiggle'); // 最初はわくわく
  const [mameMsg, setMameMsg] = useState(getMameMessage('question', displayName));

  const q = questions[currentQ];

  if (!q) {
    return (
      <div style={{
        minHeight: '100vh', background: COLORS.bg,
        fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        color: COLORS.text,
      }}>
        <div style={{ background: 'white', borderRadius: 20, padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>問題を じゅんび中です</div>
          <div style={{ color: COLORS.textLight, lineHeight: 1.6, marginBottom: 16 }}>
            このレベルの問題が まだ少ないみたい。<br />
            レベルを変えるか、問題を追加してね。
          </div>
          <button onClick={onBack} style={{
            background: COLORS.green, color: 'white', border: 'none', borderRadius: 14,
            padding: '12px 20px', fontWeight: 800, cursor: 'pointer',
            fontFamily: "'Rounded Mplus 1c', sans-serif",
          }}>
            ホームへ もどる
          </button>
        </div>
      </div>
    );
  }

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);

    if (idx === q.correct) {
      // ===== 正解！ =====
      const newScore = score + 1;
      const newCombo = combo + 1;
      setScore(newScore);
      setCombo(newCombo);

      // コンボに応じたポーズ
      if (newCombo >= 3) {
        setMamePose('sparkle'); // 3連続以上: きらきら
      } else if (newCombo >= 2) {
        setMamePose('spin');    // 2連続: くるくる
      } else {
        setMamePose('happy');   // 通常正解: ジャンプ
      }
      setMameMsg(getComboMessage(newCombo, displayName));

      setTimeout(() => {
        setShowStar(true);
        setTimeout(() => {
          setShowStar(false);
          if (currentQ < questions.length - 1) {
            setCurrentQ(c => c + 1);
            setSelected(null);
            setShowResult(false);
            setMamePose('wiggle'); // 次の問題→わくわく
            setMameMsg(getMameMessage('question', displayName));
          } else {
            // 最終問題完了
            if (newScore === questions.length) {
              // パーフェクト！
              setMamePose('sparkle');
              setMameMsg(`ぜんもん せいかい！！${displayName} かんどう！！😭💖🎉`);
              setTimeout(() => onComplete(newScore, questions.length), 2500);
            } else {
              onComplete(newScore, questions.length);
            }
          }
        }, 1500);
      }, 500);
    } else {
      // ===== 不正解 =====
      setCombo(0); // コンボリセット
      setMamePose('shake'); // ぶるぶる震え
      setMameMsg(getMameMessage('wrong', displayName));
      setTimeout(() => {
        setSelected(null);
        setShowResult(false);
        setMamePose('wiggle'); // 再チャレンジ→わくわく
        setMameMsg(getMameMessage('question', displayName));
      }, 1800);
    }
  };

  const progress = (currentQ / questions.length) * 100;

  return (
    <div style={{
      minHeight: '100vh', background: COLORS.bg,
      fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
    }}>
      <StarBurst show={showStar} />

      {/* ヘッダー */}
      <div style={{
        padding: '16px 20px', display: 'flex', alignItems: 'center',
        gap: 12, background: 'white', borderBottom: '2px solid #F5F5F5',
      }}>
        <button onClick={onBack} style={{
          background: 'none', border: 'none', fontSize: 24,
          cursor: 'pointer', padding: 4,
        }}>
          ←
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: COLORS.textLight, fontWeight: 600 }}>
            {MODE_LABELS[mode] || 'きょうの ミッション'}
          </div>
          <div style={{
            height: 8, background: '#E8F5E9', borderRadius: 4, marginTop: 4,
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', background: COLORS.green, borderRadius: 4,
              width: `${progress}%`, transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.green }}>
          {currentQ + 1} / {questions.length}
        </div>
      </div>

      {/* コンボバッジ */}
      {combo >= 2 && (
        <div style={{
          display: 'flex', justifyContent: 'center', padding: '8px 0 0',
          animation: 'popIn 0.3s ease-out',
        }}>
          <div style={{
            background: combo >= 3
              ? 'linear-gradient(135deg, #FF6F00, #FF1744)'
              : 'linear-gradient(135deg, #FF9800, #FF5722)',
            color: 'white', borderRadius: 20, padding: '5px 16px',
            fontSize: 13, fontWeight: 800,
            boxShadow: '0 3px 12px rgba(255,87,34,0.4)',
          }}>
            🔥 {combo}コンボ！
          </div>
        </div>
      )}

      {/* 問題カード */}
      <div style={{ padding: 20 }}>
        {/* 教科バッジ */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: COLORS.cream, padding: '6px 14px', borderRadius: 20,
          fontSize: 14, fontWeight: 700, color: COLORS.orange,
          marginBottom: 16,
        }}>
          {q.subjectEmoji} {q.subject} <span style={{ color: COLORS.textLight }}>レベル{q.gradeLevel || 1}</span>
        </div>

        {/* 問題文 */}
        <div style={{
          background: 'white', borderRadius: 20, padding: '28px 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          marginBottom: 20, position: 'relative',
        }}>
          {q.type === 'clock' && q.clockTime && (
            <div style={{ marginBottom: 16 }}>
              <ClockSVG hour={q.clockTime.hour} minute={q.clockTime.minute} />
            </div>
          )}
          <div style={{
            fontSize: 26, fontWeight: 800, color: COLORS.text,
            textAlign: 'center', lineHeight: 1.6,
            letterSpacing: '0.05em',
            whiteSpace: 'pre-line',
          }}>
            {q.question}
          </div>
          <div style={{
            fontSize: 13, color: COLORS.textLight, textAlign: 'center',
            marginTop: 12, fontStyle: 'italic',
          }}>
            💡 {q.hint}
          </div>
        </div>

        {/* キャラリアクション */}
        <div style={{
          display: 'flex', justifyContent: 'center',
          marginBottom: 16,
        }}>
          <MameCharacter
            pose={mamePose}
            message={mameMsg}
            size={70}
            petName={displayName}
          />
        </div>

        {/* 選択肢 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {q.options.map((opt, idx) => {
            let bg = 'white';
            let border = '2px solid #E0E0E0';
            let emoji = '';
            if (showResult && idx === q.correct) {
              bg = '#E8F5E9';
              border = `2px solid ${COLORS.green}`;
              emoji = ' ⭕';
            } else if (showResult && idx === selected && idx !== q.correct) {
              bg = '#FFEBEE';
              border = `2px solid ${COLORS.incorrect}`;
              emoji = ' ❌';
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                style={{
                  background: bg, border, borderRadius: 16,
                  padding: '18px 20px', fontSize: 22, fontWeight: 700,
                  color: COLORS.text, cursor: 'pointer',
                  textAlign: 'center', transition: 'all 0.2s ease',
                  fontFamily: "'Rounded Mplus 1c', sans-serif",
                  letterSpacing: '0.05em',
                  transform: selected === idx ? 'scale(0.97)' : 'scale(1)',
                }}
              >
                {opt}{emoji}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearningScreen;
