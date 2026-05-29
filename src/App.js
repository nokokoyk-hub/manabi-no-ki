// ============================================
// 🌳 まなびの木 - メインアプリ
// バージョン: 0.4.0
// 最終更新: 2026/05/29
// ============================================
// ⚠️ 修正時の注意:
// - version.json と APP_VERSION を同時に更新すること
// - 画面遷移ロジックを壊さないこと
// - Supabase連携ロジックは lib/storage.js に集約
// ============================================

import React, { useState, useEffect, useCallback } from 'react';
import HomeScreen from './screens/HomeScreen';
import LearningScreen from './screens/LearningScreen';
import MimamoriScreen from './screens/MimamoriScreen';
import LevelSettingsScreen from './screens/LevelSettingsScreen';
import UpdateBanner from './components/UpdateBanner';
import {
  loadProgress,
  saveProgress,
  recordSession,
  DEFAULT_PROGRESS,
  loadSubjectLevels,
  saveSubjectLevels,
} from './lib/storage';

// eslint-disable-next-line no-unused-vars
export const APP_VERSION = '0.4.0';

function App() {
  const [screen, setScreen] = useState('home');
  const [learningMode, setLearningMode] = useState('mission');
  const [subjectLevels, setSubjectLevels] = useState(() => loadSubjectLevels());

  // 木の成長状態（Supabaseから読み込み）
  const [leaves, setLeaves] = useState(DEFAULT_PROGRESS.leaves);
  const [flowers, setFlowers] = useState(DEFAULT_PROGRESS.flowers);
  const [fruits, setFruits] = useState(DEFAULT_PROGRESS.fruits);
  const [todayDone, setTodayDone] = useState(DEFAULT_PROGRESS.todayDone);
  const [streak, setStreak] = useState(DEFAULT_PROGRESS.streak);

  // ローディング状態
  const [isLoading, setIsLoading] = useState(true);

  // 起動時にSupabaseからデータ読み込み
  useEffect(() => {
    const init = async () => {
      try {
        const progress = await loadProgress();
        setLeaves(progress.leaves);
        setFlowers(progress.flowers);
        setFruits(progress.fruits);
        setStreak(progress.streak);
        setTodayDone(progress.todayDone);
      } catch (err) {
        console.error('初期読み込みエラー:', err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const handleSubjectLevelsChange = useCallback((nextLevels) => {
    const savedLevels = saveSubjectLevels(nextLevels);
    setSubjectLevels(savedLevels);
  }, []);

  // 学習完了時のハンドラ
  const handleLearningComplete = useCallback(async (score, totalQuestions) => {
    const newLeaves = Math.min(10, leaves + 1);
    const newFlowers = score >= 3 ? Math.min(5, flowers + 1) : flowers;
    const newFruits = score >= 4 ? Math.min(3, fruits + 1) : fruits;
    const newTodayDone = learningMode === 'mission' ? true : todayDone;
    const newStreak = learningMode === 'mission' && !todayDone ? streak + 1 : streak;

    // React state更新
    setLeaves(newLeaves);
    setFlowers(newFlowers);
    setFruits(newFruits);
    if (learningMode === 'mission') setTodayDone(true);
    if (learningMode === 'mission' && !todayDone) setStreak(newStreak);
    setScreen('home');

    // Supabaseに保存（非同期・UIブロックしない）
    await saveProgress({
      leaves: newLeaves,
      flowers: newFlowers,
      fruits: newFruits,
      streak: newStreak,
      todayDone: newTodayDone,
    });

    // セッション記録
    await recordSession(learningMode, score, totalQuestions || 5);
  }, [leaves, flowers, fruits, streak, todayDone, learningMode]);

  // 学習開始ハンドラ
  const startLearning = (mode) => {
    setLearningMode(mode);
    setScreen('learning');
  };

  // ローディング画面
  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(180deg, #E3F2FD 0%, #F1F8E9 40%, #FFFFFF 100%)',
        fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
      }}>
        <img
          src="/public/images/mame/mame_run.png"
          alt="まめ"
          style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 16, animation: 'mame-bounce 0.6s ease-in-out infinite' }}
        />
        <div style={{ fontSize: 18, fontWeight: 700, color: '#2E7D32' }}>
          まめが じゅんび しています...
        </div>
      </div>
    );
  }

  // 画面ルーティング
  const renderScreen = () => {
    switch (screen) {
      case 'learning':
        return (
          <LearningScreen
            mode={learningMode}
            subjectLevels={subjectLevels}
            onComplete={handleLearningComplete}
            onBack={() => setScreen('home')}
          />
        );
      case 'mimamori':
        return <MimamoriScreen onBack={() => setScreen('home')} streak={streak} />;
      case 'level-settings':
        return (
          <LevelSettingsScreen
            levels={subjectLevels}
            onChange={handleSubjectLevelsChange}
            onBack={() => setScreen('home')}
          />
        );
      default:
        return (
          <HomeScreen
            leaves={leaves}
            flowers={flowers}
            fruits={fruits}
            streak={streak}
            todayDone={todayDone}
            subjectLevels={subjectLevels}
            onStartLearning={() => startLearning('mission')}
            onStartOkurigana={() => startLearning('okurigana')}
            onStartClock={() => startLearning('clock')}
            onOpenMimamori={() => setScreen('mimamori')}
            onOpenLevelSettings={() => setScreen('level-settings')}
          />
        );
    }
  };

  return (
    <>
      <UpdateBanner currentVersion={APP_VERSION} />
      {renderScreen()}
    </>
  );
}

export default App;
