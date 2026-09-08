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
// v1.0.13: CharacterDisplay経由に統一（ガチャキャラ せんせい対応）（2026/07/21）
// ============================================

import React, { useState, useEffect, useRef } from 'react';
import StarBurst from '../components/StarBurst';
import ClockSVG from '../components/ClockSVG';
import CharacterDisplay from '../components/CharacterDisplay';
import { PageHeader } from '../components/ForestUI';
import { getTodayQuestions, getQuestionsByCategory, getQuestionsBySubject } from '../lib/questionLoader';
import { getCharaMessage } from '../constants/mameMessages';
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
  kokugo: '📖 こくご れんしゅう'
};
const getComboMessage = (combo, petName, character = 'mame') => {
  if (combo >= 5) return `${combo}れんぞく！！もう てんさい！！🔥🔥🔥`;
  if (combo >= 4) return `${combo}れんぞく！！${petName} かんどう！！🔥🔥`;
  if (combo >= 3) return `${combo}れんぞく！${petName} おどってる！💃✨`;
  if (combo >= 2) return `${combo}れんぞく せいかい！すごーい！🌟`;
  return getCharaMessage('correct', petName, character);
};

// コンボに応じたポーズを返す
const getComboPose = combo => {
  if (combo >= 4) return 'medal'; // 4連続以上: メダルドヤ🏅
  if (combo >= 3) return 'sparkle'; // 3連続: きらきら
  if (combo >= 2) return 'jump'; // 2連続: ガッツジャンプ
  return 'happy'; // 通常正解: ジャンプ
};

// スコアに応じた結果メッセージ
const getResultMessage = (score, total, petName, character = 'mame') => {
  const rate = score / total;
  if (rate === 1) return `ぜんもん せいかい！！${petName} だいかんどう！！😭💖🎉`;
  if (rate >= 0.8) return `すごいね！${petName} うれしそう！🌟✨`;
  if (rate >= 0.5) return `がんばったね！${petName} おうえんしてるよ！💪😊`;
  const cheerEmoji = character === 'mame' ? '🐕💕' : '🌱💕';
  return `だいじょうぶ！${petName}と いっしょに れんしゅうしよう！${cheerEmoji}`;
};

// スコアに応じたポーズ
const getResultPose = (score, total) => {
  const rate = score / total;
  if (rate === 1) return 'cry_happy';
  if (rate >= 0.8) return 'medal';
  if (rate >= 0.5) return 'happy';
  return 'cheer';
};
const LearningScreen = ({
  mode = 'mission',
  subjectLevels,
  petName,
  selectedCharacter = 'mame',
  onComplete,
  onBack,
  displayMode = 'hiragana'
}) => {
  const [questions, setQuestions] = useState([]);
  const [isLoadingQ, setIsLoadingQ] = useState(true);

  // 🗄️ Supabaseから非同期で問題取得（フォールバック付き）
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        let qs;
        if (mode === 'okurigana') qs = await getQuestionsByCategory('okurigana', 5, subjectLevels);else if (mode === 'clock') qs = await getQuestionsBySubject('とけい', 5, subjectLevels);else if (mode === 'math') qs = await getQuestionsBySubject('さんすう', 5, subjectLevels);else if (mode === 'kokugo') qs = await getQuestionsBySubject('こくご', 5, subjectLevels);else if (mode === 'rika') qs = await getQuestionsBySubject('りか', 5, subjectLevels);else if (mode === 'genso') qs = await getQuestionsBySubject('げんそ', 5, subjectLevels);else if (mode === 'shakai') qs = await getQuestionsBySubject('しゃかい', 5, subjectLevels);else if (mode === 'doutoku') qs = await getQuestionsBySubject('どうとく', 5, subjectLevels);else qs = await getTodayQuestions(8, subjectLevels);
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
  const [mamePose, setMamePose] = useState('cheer');
  const [mameMsg, setMameMsg] = useState(getCharaMessage('question', displayName, selectedCharacter));
  const [hintOpen, setHintOpen] = useState(false);
  const answerLock = useRef(false),
    completeLock = useRef(false),
    questionTitle = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    questionTitle.current?.focus({
      preventScroll: true
    });
  }, [currentQ, isLoadingQ, finished]);
  useEffect(() => {
    if (!showStar) return;
    const timer = setTimeout(() => setShowStar(false), 1200);
    return () => clearTimeout(timer);
  }, [showStar]);
  if (isLoadingQ) return <main className="mn-page mn-loading"><CharacterDisplay character={selectedCharacter} pose="dash" message="もんだいを さがしてるよ！" size={90} name={displayName} /><p>じゅんび ちゅう…</p></main>;
  const q = questions[currentQ];
  if (!q && !finished) return <main className="mn-page mn-loading"><h1>もんだいを じゅんび中です</h1><p>レベルを かえて ためしてね。</p><button className="reward-primary" onClick={onBack}>ホームへ もどる</button></main>;
  if (finished) return <main className="mn-page mn-result"><h1 ref={questionTitle} tabIndex={-1}>{score === questions.length ? '🏆 ぜんもん せいかい！' : '🌱 おつかれさま！'}</h1><p>{MODE_LABELS[mode]} けっか</p><CharacterDisplay character={selectedCharacter} pose={getResultPose(score, questions.length)} message={getResultMessage(score, questions.length, displayName, selectedCharacter)} size={120} name={displayName} /><section className="mn-score"><span>せいかいすう</span><strong>{score}<small> / {questions.length}もん</small></strong></section><p>{mode === 'mission' ? 'きょうの がんばりを 木に とどけよう！' : 'すこしずつ、できることが ふえたね！'}</p><button className="reward-primary" onClick={() => {
      if (completeLock.current) return;
      completeLock.current = true;
      onComplete(score, questions.length);
    }}>ホームに もどる <span aria-hidden="true">›</span></button></main>;
  const handleSelect = idx => {
    if (answerLock.current) return;
    answerLock.current = true;
    setSelected(idx);
    setShowResult(true);
    recordAnswer(q.id, idx === q.correct);
    if (idx === q.correct) {
      setScore(s => s + 1);
      setCombo(combo + 1);
      setMamePose(getComboPose(combo + 1));
      setMameMsg(getComboMessage(combo + 1, displayName, selectedCharacter));
      setShowStar(true);
    } else {
      setCombo(0);
      setMamePose('sad');
      setMameMsg(getCharaMessage('wrong', displayName, selectedCharacter));
    }
  };
  const next = () => {
    if (!answerLock.current) return;
    if (currentQ === questions.length - 1) {
      setFinished(true);
      return;
    }
    answerLock.current = false;
    setCurrentQ(c => c + 1);
    setSelected(null);
    setShowResult(false);
    setShowStar(false);
    setHintOpen(false);
    setMamePose('cheer');
    setMameMsg(getCharaMessage('question', displayName, selectedCharacter));
  };
  const options = displayMode === 'kanji' && q.optionsAdvanced?.length === q.options.length ? q.optionsAdvanced : q.options;
  const explanation = displayMode === 'kanji' && q.explanationAdvanced ? q.explanationAdvanced : q.explanation;
  return <main className="mn-page mn-learning">
    <StarBurst show={showStar} /><PageHeader title={MODE_LABELS[mode] || 'れんしゅう'} onBack={onBack} />
    <div className="mn-question-progress"><progress value={currentQ + (showResult ? 1 : 0)} max={questions.length} aria-label="もんだいの進みぐあい" /><b>{currentQ + 1} / {questions.length}もん</b></div>
    <p className="mn-question-meta">{q.subjectEmoji} {q.subject} ・ レベル{q.gradeLevel || 1}</p>
    <section className="mn-question"><h2 ref={questionTitle} tabIndex={-1}>{displayMode === 'kanji' && q.questionAdvanced ? q.questionAdvanced : q.question}</h2>{q.type === 'clock' && q.clockTime && <ClockSVG hour={q.clockTime.hour} minute={q.clockTime.minute} />}
      {q.hint && <><button className="mn-hint" aria-expanded={hintOpen} aria-controls="question-hint" onClick={() => setHintOpen(!hintOpen)}>💡 {hintOpen ? 'ヒントを とじる' : 'ヒントを みる'}</button><p id="question-hint" hidden={!hintOpen}>{q.hint}</p></>}
    </section>
    <div className="mn-answer-grid">{options.map((opt, idx) => <button key={idx} disabled={showResult} className={'mn-answer' + (showResult && idx === q.correct ? ' is-correct' : showResult && idx === selected ? ' is-wrong' : '')} onClick={() => handleSelect(idx)}><span className="mn-answer-number" aria-hidden="true">{idx + 1}</span><span>{opt}{showResult && idx === q.correct ? ' ⭕' : showResult && idx === selected ? ' もういっぽ！' : ''}</span></button>)}</div>
    {showResult ? <section className="mn-feedback" role="status"><h3>{selected === q.correct ? '🌟 せいかい！' : '🌱 いっしょに たしかめよう'}</h3>{explanation && <p>{explanation}</p>}<button className="reward-primary" onClick={next}>{currentQ === questions.length - 1 ? 'けっかを みる' : 'つぎの もんだいへ'} <span aria-hidden="true">›</span></button></section> : <p className="mn-note">こたえを １つ えらんでね</p>}
    <div className="mn-learning-coach"><CharacterDisplay character={selectedCharacter} pose={mamePose} message={mameMsg} size={75} name={displayName} /></div>
  </main>;
};
export default LearningScreen;
