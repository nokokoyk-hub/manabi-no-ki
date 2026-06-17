// ============================================
// 🌳 まなびの木 - メインアプリ
// バージョン: 0.9.4
// 最終更新: 2026/06/10
// ============================================
// ⚠️ 修正時の注意:
// - version.json と APP_VERSION を同時に更新すること
// - 画面遷移ロジックを壊さないこと
// - Supabase連携ロジックは lib/storage.js に集約
// ============================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import AuthScreen from './screens/AuthScreen';
import HomeScreen from './screens/HomeScreen';
import LearningScreen from './screens/LearningScreen';
import MimamoriScreen from './screens/MimamoriScreen';
import LevelSettingsScreen from './screens/LevelSettingsScreen';
import FukushuScreen from './screens/FukushuScreen';
import NamingScreen from './screens/NamingScreen';
import GohoubiScreen from './screens/GohoubiScreen';
import ZukanScreen from './screens/ZukanScreen';
import SubjectMenuScreen from './screens/SubjectMenuScreen';
import UpdateBanner from './components/UpdateBanner';
import PremiumGate from './components/PremiumGate';
import {
  loadProgress,
  saveProgress,
  recordSession,
  DEFAULT_PROGRESS,
  loadSubjectLevels,
  saveSubjectLevels,
  loadPetName,
  savePetName,
  DEFAULT_PET_NAME,
  loadPuzzleData,
  addPuzzlePiece,
  savePuzzleData,
  loadDisplayMode,
  saveDisplayMode,
  getTodayJST,
  loadCostumeData,
  incrementMissionCount,
  checkCostumeUnlocks,
} from './lib/storage';
import { getNextPuzzle } from './data/puzzles';
import { supabase } from './lib/supabase';

// eslint-disable-next-line no-unused-vars
export const APP_VERSION = '0.9.8';

function App() {
  // ===== 🔐 認証状態（Phase A）=====
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(!!supabase); // supabaseがあるときだけ認証チェック

  // 認証状態の監視
  useEffect(() => {
    if (!supabase) return; // ローカルモードは認証スキップ

    // 現在のセッション確認
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
      // Supabase Auth リダイレクト後の #access_token=... 残骸をクリア
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    });

    // 認証状態の変化を監視（ログイン/ログアウト時に自動更新）
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ===== 💰 課金プラン状態（Phase C）=====
  const [userPlan, setUserPlan] = useState('premium'); // デフォルトpremium（制限なし）
  const [trialDaysLeft, setTrialDaysLeft] = useState(null);

  // プロフィール取得（subscription_status + trial判定）
  useEffect(() => {
    if (!supabase || !user) {
      setUserPlan('premium'); // ローカルモード → 制限なし
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_status, trial_started_at')
          .eq('id', user.id)
          .single();

        if (error || !data) {
          console.error('Profile取得エラー:', error);
          setUserPlan('trial');
          return;
        }

        let status = data.subscription_status;
        let daysLeft = null;

        if (status === 'trial' && data.trial_started_at) {
          const trialStart = new Date(data.trial_started_at);
          const now = new Date();
          const daysPassed = Math.floor((now - trialStart) / (1000 * 60 * 60 * 24));
          daysLeft = Math.max(0, 5 - daysPassed);

          if (daysLeft <= 0) {
            // トライアル期限切れ → freeに自動更新
            status = 'free';
            daysLeft = 0;
            await supabase
              .from('profiles')
              .update({ subscription_status: 'free' })
              .eq('id', user.id);
          }
        }

        setUserPlan(status);
        setTrialDaysLeft(daysLeft);
      } catch (err) {
        console.error('Profile取得例外:', err);
        setUserPlan('trial');
      }
    };

    fetchProfile();
  }, [user]);

  // 有料機能かどうか判定（free→ロック、trial/premium→OK）
  const canAccessPremium = userPlan === 'premium' || userPlan === 'trial';

  // ===== 既存の画面・学習状態 =====
  const [screen, setScreen] = useState('home');
  const [learningMode, setLearningMode] = useState('mission');
  const [subjectLevels, setSubjectLevels] = useState(() => loadSubjectLevels());

  // 🐕 ペット名（キャラ名カスタマイズ）
  const [petName, setPetName] = useState(() => loadPetName());

  // 🧩 パズルデータ
  const [puzzleData, setPuzzleData] = useState(() => loadPuzzleData());

  // 🔤 表示モード（ていがくねん / こうがくねん）
  const [displayMode, setDisplayMode] = useState(() => loadDisplayMode());

  // 👗 着せ替えデータ
  const [costumeData, setCostumeData] = useState(() => loadCostumeData());

  // 木の成長状態（Supabaseから読み込み）
  const [leaves, setLeaves] = useState(DEFAULT_PROGRESS.leaves);
  const [flowers, setFlowers] = useState(DEFAULT_PROGRESS.flowers);
  const [fruits, setFruits] = useState(DEFAULT_PROGRESS.fruits);
  const [todayDone, setTodayDone] = useState(DEFAULT_PROGRESS.todayDone);
  const [streak, setStreak] = useState(DEFAULT_PROGRESS.streak);

  // ローディング状態
  const [isLoading, setIsLoading] = useState(true);

  // 起動時にSupabaseからデータ読み込み + パズル初期化
  useEffect(() => {
    const init = async () => {
      try {
        const progress = await loadProgress();
        setLeaves(progress.leaves);
        setFlowers(progress.flowers);
        setFruits(progress.fruits);
        setStreak(progress.streak);
        setTodayDone(progress.todayDone);

        // パズル初期化（currentPuzzleIdがなければ最初のパズルをセット）
        const pd = loadPuzzleData();
        if (!pd.currentPuzzleId) {
          const first = getNextPuzzle(pd.completedIds);
          pd.currentPuzzleId = first.id;
          pd.collected = 0;
        }
        setPuzzleData(pd);
      } catch (err) {
        console.error('初期読み込みエラー:', err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // ============================================
  // 🌅 日跨ぎリセット（フルスクリーン対策）
  // setInterval: 60秒ごとに日付チェック（開きっぱなし対策）
  // visibilitychange: タブ復帰時にも即チェック
  // v0.9.4: 新規追加
  // ============================================
  const dateRef = useRef(getTodayJST());

  useEffect(() => {
    const checkDateChange = async () => {
      const today = getTodayJST();
      if (today !== dateRef.current) {
        console.log('🌅 日付が変わりました！ミッションをリセットします');
        dateRef.current = today;

        try {
          const progress = await loadProgress();
          setLeaves(progress.leaves);
          setFlowers(progress.flowers);
          setFruits(progress.fruits);
          setStreak(progress.streak);
          setTodayDone(progress.todayDone);
        } catch (err) {
          console.error('日跨ぎリセットエラー:', err);
          setTodayDone(false);
        }
      }
    };

    // 60秒ごとに日付チェック（フルスクリーン開きっぱなし対策）
    const interval = setInterval(checkDateChange, 60 * 1000);

    // タブ復帰時にも日付チェック
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        checkDateChange();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  // ペット名決定ハンドラ
  const handleNameDecided = useCallback((name) => {
    const saved = savePetName(name);
    setPetName(saved);
  }, []);

  // 表示モード変更ハンドラ
  const handleDisplayModeChange = useCallback((mode) => {
    const saved = saveDisplayMode(mode);
    setDisplayMode(saved);
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

    // 🧩 ミッションクリア時にパズルピース追加
    if (learningMode === 'mission' && !todayDone) {
      const currentPd = loadPuzzleData();
      const puzzleId = currentPd.currentPuzzleId || getNextPuzzle(currentPd.completedIds).id;
      const result = addPuzzlePiece(puzzleId);

      if (result.justCompleted) {
        // パズル完成！次のパズルをセット
        const next = getNextPuzzle(result.completedIds);
        result.currentPuzzleId = next.id;
        result.collected = 0;
        result.justCompleted = false;
        savePuzzleData(result);
      }
      setPuzzleData(loadPuzzleData());

      // 👗 着せ替えアンロック判定（v0.9.4修正）
      const isPerfect = score === (totalQuestions || 5);
      incrementMissionCount(isPerfect);
      const latestPd = loadPuzzleData();
      const { costumeData: newCostume } = checkCostumeUnlocks(newStreak, latestPd.completedIds.length);
      setCostumeData(newCostume);
    }

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
    // 無料ユーザーはミッション以外ロック
    if (!canAccessPremium && mode !== 'mission') {
      setScreen('premium-gate');
      return;
    }
    setLearningMode(mode);
    setScreen('learning');
  };

  // 表示用のペット名（未設定時のフォールバック）
  const displayName = petName || DEFAULT_PET_NAME;

  // ===== 🔐 認証チェック（Phase A）=====
  // 認証ローディング中
  if (authLoading) {
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
        <div style={{ fontSize: 18, fontWeight: 700, color: '#2E7D32' }}>
          🌳 まなびの木
        </div>
      </div>
    );
  }

  // 未ログイン → ログイン画面（supabase有効時のみ）
  if (supabase && !user) {
    return <AuthScreen />;
  }

  // ===== 既存のローディング（データ読み込み中）=====
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
          alt={displayName}
          style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 16, animation: 'mame-bounce 0.6s ease-in-out infinite' }}
        />
        <div style={{ fontSize: 18, fontWeight: 700, color: '#2E7D32' }}>
          {displayName}が じゅんび しています...
        </div>
      </div>
    );
  }

  // ペット名未設定 → NamingScreen表示
  if (petName === null) {
    return <NamingScreen onNameDecided={handleNameDecided} />;
  }

  // 画面ルーティング
  const renderScreen = () => {
    switch (screen) {
      case 'learning':
        return (
          <LearningScreen
            mode={learningMode}
            subjectLevels={subjectLevels}
            petName={displayName}
            onComplete={handleLearningComplete}
            onBack={() => setScreen('home')}
            displayMode={displayMode}
          />
        );
      case 'mimamori':
        if (!canAccessPremium) return <PremiumGate featureName="みまもり" onBack={() => setScreen('home')} />;
        return <MimamoriScreen onBack={() => setScreen('home')} streak={streak} appVersion={APP_VERSION} onOpenLevelSettings={() => setScreen('level-settings')} displayMode={displayMode} onChangeDisplayMode={handleDisplayModeChange} user={user} />;
      case 'level-settings':
        if (!canAccessPremium) return <PremiumGate featureName="レベルせってい" onBack={() => setScreen('home')} />;
        return (
          <LevelSettingsScreen
            levels={subjectLevels}
            onChange={handleSubjectLevelsChange}
            onBack={() => setScreen('home')}
          />
        );
      case 'fukushu':
        if (!canAccessPremium) return <PremiumGate featureName="ふくしゅう" onBack={() => setScreen('home')} />;
        return (
          <FukushuScreen
            onBack={() => setScreen('home')}
            onStartReview={startLearning}
            petName={displayName}
          />
        );
      case 'gohoubi':
        return (
          <GohoubiScreen
            onBack={() => setScreen('home')}
            petName={displayName}
            puzzleData={puzzleData}
            costumeData={costumeData}
            onEquipChange={() => setCostumeData(loadCostumeData())}
          />
        );
      case 'zukan':
        if (!canAccessPremium) return <PremiumGate featureName="げんそずかん" onBack={() => setScreen('home')} />;
        return (
          <ZukanScreen
            onBack={() => setScreen('home')}
            petName={displayName}
          />
        );
      case 'subject-kokugo':
        if (!canAccessPremium) return <PremiumGate featureName="こくご れんしゅう" onBack={() => setScreen('home')} />;
        return (
          <SubjectMenuScreen
            subject="kokugo"
            onStartMode={startLearning}
            onBack={() => setScreen('home')}
            petName={displayName}
            equippedItem={costumeData.equippedItem}
          />
        );
      case 'subject-genso':
        if (!canAccessPremium) return <PremiumGate featureName="げんそ" onBack={() => setScreen('home')} />;
        return (
          <SubjectMenuScreen
            subject="genso"
            onStartMode={startLearning}
            onOpenZukan={() => setScreen('zukan')}
            onBack={() => setScreen('home')}
            petName={displayName}
            equippedItem={costumeData.equippedItem}
          />
        );
      case 'subject-math':
        if (!canAccessPremium) return <PremiumGate featureName="さんすう れんしゅう" onBack={() => setScreen('home')} />;
        return (
          <SubjectMenuScreen
            subject="math"
            onStartMode={startLearning}
            onBack={() => setScreen('home')}
            petName={displayName}
            equippedItem={costumeData.equippedItem}
          />
        );
      case 'subject-rika':
        if (!canAccessPremium) return <PremiumGate featureName="りか れんしゅう" onBack={() => setScreen('home')} />;
        return (
          <SubjectMenuScreen
            subject="rika"
            onStartMode={startLearning}
            onBack={() => setScreen('home')}
            petName={displayName}
            equippedItem={costumeData.equippedItem}
          />
        );
      case 'premium-gate':
        return <PremiumGate featureName="この きのう" onBack={() => setScreen('home')} />;
      default:
        return (
          <HomeScreen
            leaves={leaves}
            flowers={flowers}
            fruits={fruits}
            streak={streak}
            todayDone={todayDone}
            subjectLevels={subjectLevels}
            petName={displayName}
            puzzleData={puzzleData}
            equippedItem={costumeData.equippedItem}
            userPlan={userPlan}
            trialDaysLeft={trialDaysLeft}
            onStartLearning={() => startLearning('mission')}
            onOpenMath={() => setScreen('subject-math')}
            onOpenKokugo={() => setScreen('subject-kokugo')}
            onOpenRika={() => setScreen('subject-rika')}
            onStartShakai={() => startLearning('shakai')}
            onStartClock={() => startLearning('clock')}
            onStartDoutoku={() => startLearning('doutoku')}
            onOpenGenso={() => setScreen('subject-genso')}
            onOpenMimamori={() => setScreen('mimamori')}
            onOpenLevelSettings={() => setScreen('level-settings')}
            onOpenFukushu={() => setScreen('fukushu')}
            onOpenGohoubi={() => setScreen('gohoubi')}
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
