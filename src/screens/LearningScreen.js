// ============================================
// 📝 LearningScreen - 学習（問題回答）画面
// v0.7.0: 新画像10枚を活用した演出強化
//   - 正解: happy→jump→medal（コンボ段階）
//   - 不正解: sad（ぶるぶる）
//   - 出題: cheer（わくわく）
//   - パーフェクト: medal→cry_happy
//   - コンボバッジ強化
// ============================================

import React, { useState, useEffect } from 'react';
import StarBurst from '../components/StarBurst';
import ClockSVG from '../components/ClockSVG';
import MameCharacter from '../components/MameCharacter';
import { COLORS } from '../constants/colors';
import { getTodayQuestions, getQuestionsByCategory, getQuestionsBySubject } from '../lib/questionLoader';
import { getMameMessage } from '../constants/mameMessages';

const MODE_LABELS = {
  mission: 'きょうの ミッション',
  okurigana: 'おくりがな れんしゅう',
  clock: 'とけい れんしゅう',
  kagaku: '🧪 かがく れんしゅう',
  math: 'さんすう ふくしゅう',
  kokugo: 'こくご ふくしゅう',
};

const getComboMessage = (combo, petName) => {
  if (combo >= 5) return `${combo}れんぞく！！もう てんさい！！🔥🔥🔥`;
  if (combo >= 4) return `${combo}れんぞく！！${petName} かんどう！！🔥🔥`;
  if (combo >= 3) return `${combo}れんぞく！${petName} おどってる！💃✨`;
  if (combo >= 2) return `${combo}れんぞく せいかい！すごーい！🌟`;
  return getMameMessage('correct', petName);
};

// コンボに応じたポーズを返す
const getComboPose = (combo) => {
  if (combo >= 4) return 'medal';    // 4連続以上: メダルドヤ🏅
  if (combo >= 3) return 'sparkle';  // 3連続: きらきら
  if (combo >= 2) return 'jump';     // 2連続: ガッツジャンプ
  return 'happy';                     // 通常正解: ジャンプ
};

const LearningScreen = ({ mode = 'mission', subjectLevels, petName, onComplete, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [isLoadingQ, setIsLoadingQ] = useState(true);

  // 🗄️ Supabaseから非同期で問題取得（フォールバック付き）
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        let qs;
        if (mode === 'okurigana') qs = await getQuestionsByCategory('okurigana', 5, subjectLevels);
        else if (mode === 'clock') qs = await getQuestionsByCategory('clock', 5, subjectLevels);
        else if (mode === 'math') qs = await getQuestionsBySubject('さんすう', 5, subjectLevels);
        else if (mode === 'kokugo') qs = await getQuestionsBySubject('こくご', 5, subjectLevels);
        else if (mode === 'kagaku') qs = await getQuestionsBySubject('かがく', 5, subjectLevels);
        else qs = await getTodayQuestions(8, subjectLevels);
        setQuestions(qs || []);
      } catch (err) {
        console.error('問題取得エラー:', err);
        setQuestions([]);
      } finally {
        setIsLoadingQ(false);
      }
    };
    loadQuestions();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showStar, setShowStar] = useState(false);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);

  const displayName = petName || 'まめ';

  const [mamePose, setMamePose] = useState('cheer');
  const [mameMsg, setMameMsg] = useState(getMameMessage('question', displayName));

  // ローディング中
  if (isLoadingQ) {
    return (
      <div style={{
        minHeight: '100vh', background: COLORS.bg,
        fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 24,
      }}>
        <MameCharacter pose="dash" message={`${displayName}が もんだいを さがしてるよ！`} size={90} petName={displayName} />
        <div style={{ marginTop: 16, fontSize: 14, color: COLORS.textLight, fontWeight: 700 }}>
          じゅんび ちゅう...
        </div>
      </div>
    );
  }

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
          <MameCharacter pose="sad" message="もんだいが たりないよ…" size={80} petName={displayName} />
          <div style={{ fontSize: 18, fontWeight: 800, marginTop: 12, marginBottom: 8 }}>問題を じゅんび中です</div>
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
      const newScore = score + 1;
      const newCombo = combo + 1;
      setScore(newScore);
      setCombo(newCombo);

      setMamePose(getComboPose(newCombo));
      setMameMsg(getComboMessage(newCombo, displayName));

      setTimeout(() => {
        setShowStar(true);
        setTimeout(() => {
          setShowStar(false);
          if (currentQ < questions.length - 1) {
            setCurrentQ(c => c + 1);
            setSelected(null);
            setShowResult(false);
            setMamePose('cheer');
            setMameMsg(getMameMessage('question', displayName));
          } else {
            // 最終問題完了
            if (newScore === questions.length) {
              // パーフェクト！
              setMamePose('cry_happy');
              setMameMsg(`ぜんもん せいかい！！${displayName} かんどう！！😭💖🎉`);
              setTimeout(() => onComplete(newScore, questions.length), 2500);
            } else {
              setMamePose('flag');
              setMameMsg(getMameMessage('complete', displayName));
              setTimeout(() => onComplete(newScore, questions.length), 1500);
            }
          }
        }, 1500);
      }, 500);
    } else {
      setCombo(0);
      setMamePose('sad');
      setMameMsg(getMameMessage('wrong', displayName));
      setTimeout(() => {
        setSelected(null);
        setShowResult(false);
        setMamePose('cheer');
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

      {combo >= 2 && (
        <div style={{
          display: 'flex', justifyContent: 'center', padding: '8px 0 0',
          animation: 'popIn 0.3s ease-out',
        }}>
          <div style={{
            background: combo >= 4
              ? 'linear-gradient(135deg, #FF1744, #D500F9)'
              : combo >= 3
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

      <div style={{ padding: 20 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: COLORS.cream, padding: '6px 14px', borderRadius: 20,
          fontSize: 14, fontWeight: 700, color: COLORS.orange,
          marginBottom: 16,
        }}>
          {q.subjectEmoji} {q.subject} <span style={{ color: COLORS.textLight }}>レベル{q.gradeLevel || 1}</span>
        </div>

        <div style={{
          background: 'white', borderRadius: 20, padding: '28px 24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          marginBottom: 20,
        }}>
          {q.type === 'clock' && q.clockTime && (
            <div style={{ marginBottom: 16 }}>
              <ClockSVG hour={q.clockTime.hour} minute={q.clockTime.minute} />
            </div>
          )}
          <div style={{
            fontSize: 26, fontWeight: 800, color: COLORS.text,
            textAlign: 'center', lineHeight: 1.6,
            letterSpacing: '0.05em', whiteSpace: 'pre-line',
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

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <MameCharacter pose={mamePose} message={mameMsg} size={70} petName={displayName} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {q.options.map((opt, idx) => {
            let bg = 'white';
            let border = '2px solid #E0E0E0';
            let emoji = '';
            if (showResult && idx === q.correct) {
              bg = '#E8F5E9'; border = `2px solid ${COLORS.green}`; emoji = ' ⭕';
            } else if (showResult && idx === selected && idx !== q.correct) {
              bg = '#FFEBEE'; border = `2px solid ${COLORS.incorrect}`; emoji = ' ❌';
            }
            return (
              <button key={idx} onClick={() => handleSelect(idx)} style={{
                background: bg, border, borderRadius: 16,
                padding: '18px 20px', fontSize: 22, fontWeight: 700,
                color: COLORS.text, cursor: 'pointer',
                textAlign: 'center', transition: 'all 0.2s ease',
                fontFamily: "'Rounded Mplus 1c', sans-serif",
                letterSpacing: '0.05em',
                transform: selected === idx ? 'scale(0.97)' : 'scale(1)',
              }}>
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
