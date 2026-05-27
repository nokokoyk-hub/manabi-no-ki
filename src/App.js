// ============================================
// 🌳 まなびの木 - メインアプリ
// バージョン: 0.1.0
// 最終更新: 2026/05/27
// ============================================
// ⚠️ 修正時の注意:
// - version.json と APP_VERSION を同時に更新すること
// - 画面遷移ロジックを壊さないこと
// ============================================

import React, { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import LearningScreen from './screens/LearningScreen';
import MimamoriScreen from './screens/MimamoriScreen';

const APP_VERSION = '0.1.0';

function App() {
  const [screen, setScreen] = useState('home');

  // 木の成長状態（将来はSupabaseで永続化）
  const [leaves, setLeaves] = useState(5);
  const [flowers, setFlowers] = useState(2);
  const [fruits, setFruits] = useState(0);
  const [todayDone, setTodayDone] = useState(false);
  const [streak, setStreak] = useState(3);

  // 学習完了時のハンドラ
  const handleLearningComplete = (score) => {
    setLeaves(prev => Math.min(10, prev + 1));
    if (score >= 3) setFlowers(prev => Math.min(5, prev + 1));
    if (score >= 4) setFruits(prev => Math.min(3, prev + 1));
    setTodayDone(true);
    setStreak(prev => prev + 1);
    setScreen('home');
  };

  // 画面ルーティング
  switch (screen) {
    case 'learning':
      return (
        <LearningScreen
          onComplete={handleLearningComplete}
          onBack={() => setScreen('home')}
        />
      );
    case 'mimamori':
      return <MimamoriScreen onBack={() => setScreen('home')} />;
    default:
      return (
        <HomeScreen
          leaves={leaves}
          flowers={flowers}
          fruits={fruits}
          streak={streak}
          todayDone={todayDone}
          onStartLearning={() => setScreen('learning')}
          onOpenMimamori={() => setScreen('mimamori')}
        />
      );
  }
}

export default App;
