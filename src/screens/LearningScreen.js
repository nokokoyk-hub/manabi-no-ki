// ============================================
// 📝 LearningScreen - 学習（問題回答）画面
// v0.7.0: 新画像10枚を活用した演出強化
// v0.9.1: 結果画面追加（ミッション完了→スコア表示→ホームへ）
// v0.9.2: しゃかい🗾・どうとく💛モード追加
// v1.0.2: キャラ選択対応（まめ/ロボちゃん切替）（2026/06/26）
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
import RobotCharacter from '../components/RobotCharacter';
import { COLORS } from '../constants/colors';
import { getTodayQuestions, getQuestionsByCategory, getQuestionsBySubject } from '../lib/questionLoader';
import { getMameMessage } from '../constants/mameMessages';
import { recordAnswer } from '../lib/storage';

const MODE_LABELS = {
  mission: 'きょうの ミッション',
  okurigana: 'おくりがな れんしゅう',
  clock: 'とけい れんしゅう',
  rika: '🌿 りか れんしゅう',
  genso: '🔬 げんそ れんしゅう',
  shakai: '🗾 しゃかい れんしゅう',
  doutoku: '💛 どうとく れんしゅう',
  math: '🔢 さんすう れんしゅう',
  kokugo: '📖 こくご れんしゅう',
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

// スコアに応じた結果メッセージ
const getResultMessage = (score, total, petName) => {
  const rate = score / total;
  if (rate === 1) return `ぜんもん せいかい！！${petName} だいかんどう！！😭💖🎉`;
  if (rate >= 0.8) return `すごいね！${petName} うれしそう！🌟✨`;
  if (rate >= 0.5) return `がんばったね！${petName} おうえんしてるよ！💪😊`;
  return `だいじょうぶ！${petName}と いっしょに れんしゅうしよう！🐕💕`;
};

// スコアに応じたポーズ
const getResultPose = (score, total) => {
  const rate = score / total;
  if (rate === 1) return 'cry_happy';
  if (rate >= 0.8) return 'medal';
  if (rate >= 0.5) return 'happy';
  return 'cheer';
};

const LearningScreen = ({ mode = 'mission', subjectLevels, petName, selectedCharacter = 'mame', onComplete, onBack, displayMode = 'hiragana' }) => {
  const [questions, setQuestions] = useState([]);
  const [isLoadingQ, setIsLoadingQ] = useState(true);

  // 🗄️ Supabaseから非同期で問題取得（フォールバック付き）
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        let qs;
        if (mode === 'okurigana') qs = await getQuestionsByCategory('okurigana', 5, subjectLevels);
        else if (mode === 'clock') qs = await getQuestionsBySubject('とけい', 5, subjectLevels);
        else if (mode === 'math') qs = await getQuestionsBySubject('さんすう', 5, subjectLevels);
        else if (mode === 'kokugo') qs = await getQuestionsBySubject('こくご', 5, subjectLevels);
        else if (mode === 'rika') qs = await getQuestionsBySubject('りか', 5, subjectLevels);
        else if (mode === 'genso') qs = await getQuestionsBySubject('げんそ', 5, subjectLevels);
        else if (mode === 'shakai') qs = await getQuestionsBySubject('しゃかい', 5, subjectLevels);
        else if (mode === 'doutoku') qs = await getQuestionsBySubject('どうとく', 5, subjectLevels);
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
  const [finished, setFinished] = useState(false); // 🆕 結果画面表示フラグ

  const displayName = petName || 'まめ';

  // 🤖 v1.0.2: キャラ選択に応じた表示切替ヘルパー
  const CharaComponent = selectedCharacter === 'robot' ? RobotCharacter : MameCharacter;
  const charaNameProp = selectedCharacter === 'robot' ? 'robotName' : 'petName';

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
        <CharaComponent pose="dash" message={`${displayName}が もんだいを さがしてるよ！`} size={90} {...{[charaNameProp]: displayName}} />
        <div style={{ marginTop: 16, fontSize: 14, color: COLORS.textLight, fontWeight: 700 }}>
          じゅんび ちゅう...
        </div>
      </div>
    );
  }

  const q = questions[currentQ];

  if (!q && !finished) {
    return (
      <div style={{
        minHeight: '100vh', background: COLORS.bg,
        fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
        color: COLORS.text,
      }}>
        <div style={{ background: 'white', borderRadius: 20, padding: 24, textAlign: 'center' }}>
          <CharaComponent pose="sad" message="もんだいが たりないよ…" size={80} {...{[charaNameProp]: displayName}} />
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

  // ============================================
  // 🎉 結果画面（ミッション完了後に表示）
  // ============================================
  if (finished) {
    const total = questions.length;
    const isPerfect = score === total;
    const resultPose = getResultPose(score, total);
    const resultMsg = getResultMessage(score, total, displayName);

    return (
      <div style={{
        minHeight: '100vh',
        background: isPerfect
          ? 'linear-gradient(180deg, #FFF8E1 0%, #FFFDE7 50%, #F1F8E9 100%)'
          : 'linear-gradient(180deg, #E3F2FD 0%, #F1F8E9 50%, #FFFFFF 100%)',
        fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 24, textAlign: 'center',
      }}>
        {/* タイトル */}
        <div style={{
          fontSize: 24, fontWeight: 800, color: COLORS.greenDark,
          marginBottom: 8,
        }}>
          {isPerfect ? '🏆 パーフェクト！！ 🏆' : '🎉 おつかれさま！'}
        </div>

        {/* モード名 */}
        <div style={{
          fontSize: 14, color: COLORS.textLight, fontWeight: 600, marginBottom: 20,
        }}>
          {MODE_LABELS[mode] || 'ミッション'} けっか
        </div>

        {/* キャラクター */}
        <CharaComponent
          pose={resultPose}
          message={resultMsg}
          size={100}
          {...{[charaNameProp]: displayName}}
        />

        {/* スコア表示 */}
        <div style={{
          background: 'white', borderRadius: 24, padding: '24px 40px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          marginTop: 20, marginBottom: 24,
        }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.textLight, marginBottom: 8 }}>
            せいかいすう
          </div>
          <div style={{
            fontSize: 48, fontWeight: 800,
            color: isPerfect ? '#FF6F00' : COLORS.green,
            lineHeight: 1,
          }}>
            {score} <span style={{ fontSize: 20, color: COLORS.textLight }}>/ {total}</span>
          </div>
          {isPerfect && (
            <div style={{
              marginTop: 8, fontSize: 14, fontWeight: 700,
              color: '#FF6F00',
            }}>
              ⭐ ぜんもん せいかい！ ⭐
            </div>
          )}
        </div>

        {/* 次回のメッセージ（ミッションの場合） */}
        {mode === 'mission' && (
          <div style={{
            fontSize: 15, color: COLORS.text, fontWeight: 700,
            marginBottom: 20, lineHeight: 1.8,
          }}>
            きょうの ミッションは おわり！<br />
            🌅 あしたも いっしょに がんばろうね！
          </div>
        )}

        {/* ボタン群 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%', maxWidth: 300 }}>
          <button
            onClick={() => onComplete(score, questions.length)}
            style={{
              background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
              color: 'white', border: 'none', borderRadius: 16,
              padding: '16px 24px', fontSize: 18, fontWeight: 800,
              cursor: 'pointer', boxShadow: '0 4px 15px rgba(76,175,80,0.4)',
              fontFamily: "'Rounded Mplus 1c', sans-serif",
            }}
          >
            🏠 ホームに もどる
          </button>
        </div>
      </div>
    );
  }

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);

    // 📊 誤答記録: 1問ごとにanswer_historyへ非同期記録（fire-and-forget）
    recordAnswer(q.id, idx === q.correct);

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
            // 🆕 最終問題完了 → 結果画面へ（自動リダイレクトしない）
            setFinished(true);
          }
        }, 1500);
      }, 500);
    } else {
      setCombo(0);
      setMamePose('sad');
      setMameMsg(getMameMessage('wrong', displayName));
      const delay = q.explanation ? 3500 : 1800;
      setTimeout(() => {
        setSelected(null);
        setShowResult(false);
        if (currentQ < questions.length - 1) {
          // 次の問題へ進む（不正解でも止まらない）
          setCurrentQ(c => c + 1);
          setMamePose('cheer');
          setMameMsg(getMameMessage('question', displayName));
        } else {
          // 最終問題が不正解でも結果画面へ
          setFinished(true);
        }
      }, delay);
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
            {displayMode === 'kanji' && q.questionAdvanced ? q.questionAdvanced : q.question}
          </div>
          <div style={{
            fontSize: 13, color: COLORS.textLight, textAlign: 'center',
            marginTop: 12, fontStyle: 'italic',
          }}>
            💡 {q.hint}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <CharaComponent pose={mamePose} message={mameMsg} size={70} {...{[charaNameProp]: displayName}} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {((displayMode === 'kanji' && q.optionsAdvanced && q.optionsAdvanced.length === q.options.length)
            ? q.optionsAdvanced : q.options).map((opt, idx) => {
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

        {/* 💡 解説表示（不正解時 + explanationがある場合のみ） */}
        {showResult && selected !== null && selected !== q.correct && q.explanation && (
          <div style={{
            marginTop: 14,
            padding: '14px 16px',
            background: '#FFF8E1',
            borderRadius: 14,
            border: '2px solid #FFD54F',
            animation: 'fadeIn 0.3s ease',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F57F17', marginBottom: 4 }}>
              💡 ポイント
            </div>
            <div style={{ fontSize: 14, color: COLORS.text, lineHeight: 1.6 }}>
              {displayMode === 'kanji' && q.explanationAdvanced ? q.explanationAdvanced : q.explanation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningScreen;
