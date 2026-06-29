// ============================================
// 🌳 まなびの木 - メインアプリ
// バージョン: 1.0.1
// 最終更新: 2026/06/27
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
import TermsScreen from './screens/TermsScreen';
import PrivacyScreen from './screens/PrivacyScreen';
import TokushohoScreen from './screens/TokushohoScreen';
import HowToScreen from './screens/HowToScreen';
import HarvestScreen from './screens/HarvestScreen';
import CollectionScreen from './screens/CollectionScreen';
import UpdateBanner from './components/UpdateBanner';
import PremiumGate from './components/PremiumGate';
import { rollGacha } from './lib/gachaData';
import { loadFruitCollection, addFruitToCollection, isNewFruit } from './lib/fruitCollection';
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
  loadRobotName,
  saveRobotName,
  DEFAULT_ROBOT_NAME,
  loadPuzzleData,
  addPuzzlePiece,
  savePuzzleData,
  loadDisplayMode,
  saveDisplayMode,
  getTodayJST,
  loadCostumeData,
  incrementMissionCount,
  checkCostumeUnlocks,
  setCurrentUserId,
  migrateDeviceDataToUser,
  checkAndSwitchUser,
} from './lib/storage';
import { getNextPuzzle } from './data/puzzles';
import { supabase } from './lib/supabase';

// eslint-disable-next-line no-unused-vars
export const APP_VERSION = '1.0.3';

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
  const [hasStripeCustomer, setHasStripeCustomer] = useState(false);

  // プロフィール取得（subscription_status + trial判定）
  useEffect(() => {
    if (!supabase || !user) {
      setCurrentUserId(null); // Phase A-4: ログアウト時クリア
      setUserPlan('premium'); // ローカルモード → 制限なし
      return;
    }

    // Phase A-4: user_id設定（以降のDB操作はuser_idベース）
    setCurrentUserId(user.id);

    const fetchProfile = async () => {
      try {
        // ⛑️ v1.0.2: アカウント切替検出（前のユーザーのlocalStorageをクリア）
        const userSwitched = checkAndSwitchUser(user.id);
        if (userSwitched) {
          // localStorageクリア済み → stateもデフォルトに戻す
          setPetName(null);
          setCostumeData({ equippedItem: null, unlockedItems: ['item_none'], missionCount: 0 });
          setPuzzleData({ completed: [], current: null });
          setSubjectLevels({});
          console.log('🔄 アカウント変更: stateもリセット完了');
        }

        // Phase A-4: デバイスデータをuser_idに紐付け + 進捗再読み込み
        await migrateDeviceDataToUser(user.id);

        // 🏷️ v1.0.2: appタグ自動付与（未設定のユーザーに付与。OAuth新規ユーザー対策）
        if (!user.user_metadata?.app) {
          supabase.auth.updateUser({ data: { app: 'manabi-no-ki' } })
            .then(() => console.log('🏷️ appタグ付与完了'))
            .catch(e => console.warn('⚠️ appタグ付与エラー:', e.message));
        }
        const migrated = await loadProgress();
        setLeaves(migrated.leaves);
        setFlowers(migrated.flowers);
        setFruits(migrated.fruits);
        setStreak(migrated.streak);
        setTodayDone(migrated.todayDone);

        const { data, error } = await supabase
          .from('profiles')
          .select('subscription_status, trial_started_at, stripe_customer_id')
          .eq('id', user.id)
          .single();

        // ⛑️ profile自動作成フォールバック（トリガー不発対策 v1.0.2）
        let profileData = data;
        if (error || !data) {
          console.log('⚠️ Profile未発見 → 自動作成を試みます');
          const { data: newProfile, error: createErr } = await supabase
            .from('profiles')
            .upsert({ id: user.id, trial_started_at: new Date().toISOString() })
            .select('subscription_status, trial_started_at, stripe_customer_id')
            .single();
          if (createErr || !newProfile) {
            console.error('Profile自動作成エラー:', createErr);
            setUserPlan('trial');
            return;
          }
          profileData = newProfile;
          console.log('✅ Profile自動作成完了');
        }

        let status = profileData.subscription_status;
        let daysLeft = null;

        if (status === 'trial' && profileData.trial_started_at) {
          const trialStart = new Date(profileData.trial_started_at);
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
        setHasStripeCustomer(!!profileData.stripe_customer_id);
      } catch (err) {
        console.error('Profile取得例外:', err);
        setUserPlan('trial');
      }
    };

    fetchProfile();

    // 💳 Stripe決済完了後のリダイレクト検知
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('checkout') === 'success') {
      // URLパラメータをクリア（リロード無限ループ防止）
      window.history.replaceState(null, '', window.location.pathname);
      // Webhook処理を待って再取得（3秒後）
      setTimeout(() => fetchProfile(), 3000);
    }
  }, [user]);

  // 有料機能かどうか判定（free→ロック、trial/premium→OK）
  const canAccessPremium = userPlan === 'premium' || userPlan === 'trial';

  // ===== 既存の画面・学習状態 =====
  const [screen, setScreen] = useState('home');
  const [learningMode, setLearningMode] = useState('mission');
  const [subjectLevels, setSubjectLevels] = useState(() => loadSubjectLevels());

  // 🐕 ペット名（キャラ名カスタマイズ）
  const [petName, setPetName] = useState(() => loadPetName());
  const [robotName, setRobotName] = useState(() => loadRobotName());

  // 🤖 出題キャラ選択（'mame' or 'robot'）v1.0.2
  const [selectedCharacter, setSelectedCharacter] = useState(() => {
    try { return localStorage.getItem('manabi_selected_character') || 'mame'; }
    catch { return 'mame'; }
  });
  const handleCharacterChange = (char) => {
    setSelectedCharacter(char);
    try { localStorage.setItem('manabi_selected_character', char); } catch {}
  };

  // 🏷️ キャラ名変更ハンドラ（v1.0.4: 長押しで名前変更）
  const handleRenameCharacter = useCallback((target, newName) => {
    if (target === 'robot') {
      const saved = saveRobotName(newName);
      setRobotName(saved);
    } else {
      const saved = savePetName(newName);
      setPetName(saved);
    }
  }, []);

  // ===== 🔓 ログアウト（v1.0.2）=====
  const handleLogout = async () => {
    if (!window.confirm('ログアウトしますか？\nべつの アカウントで ログインできます')) return;
    try {
      // localStorageクリア（ユーザー固有データ）
      ['manabi_subject_levels', 'manabi_pet_name', 'manabi_robot_name', 'manabi_puzzle',
       'manabi_costume', 'manabi_display_mode', 'manabi_guardian_pin',
       'manabi_selected_character', 'manabi_current_user_id', 'manabi_fruit_collection'].forEach(k => {
        try { localStorage.removeItem(k); } catch {}
      });
      await supabase.auth.signOut();
      setPetName(null);
      setRobotName(null);
      setFruitCollection({ items: {}, totalHarvests: 0, lastHarvestAt: null });
      setScreen('home');
    } catch (e) {
      console.error('ログアウトエラー:', e);
      alert('ログアウトに失敗しました。もう一度お試しください。');
    }
  };

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

  // 🍎 果実コレクション
  const [fruitCollection, setFruitCollection] = useState(() => loadFruitCollection());
  const [harvestedFruit, setHarvestedFruit] = useState(null);  // ガチャ結果表示用
  const [harvestedIsNew, setHarvestedIsNew] = useState(false); // NEW!バッジ用

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

  // キャラ名決定ハンドラ（v1.0.2: 2キャラ対応）
  const handleNameDecided = useCallback((mameName, robotNameInput) => {
    const savedMame = savePetName(mameName);
    setPetName(savedMame);
    if (robotNameInput) {
      const savedRobot = saveRobotName(robotNameInput);
      setRobotName(savedRobot);
    }
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
    // 🌳 B案サイクル: 葉+1 → 葉2枚で花+1 → 花2つで実+1
    let newLeaves = leaves + 1;
    let newFlowers = flowers;
    let newFruits = fruits;

    // 葉2枚 → 花1つに変換
    if (newLeaves >= 2) {
      newFlowers += 1;
      newLeaves -= 2;
    }
    // 花2つ → 実1つに変換
    if (newFlowers >= 2) {
      newFruits += 1;
      newFlowers -= 2;
    }

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

  // 🍎 収穫ハンドラ: 実をタップ → ガチャ → 演出表示
  const handleHarvest = useCallback(() => {
    if (fruits <= 0) return;

    // ガチャを引く
    const result = rollGacha();
    const isNew = isNewFruit(fruitCollection, result.id);

    setHarvestedFruit(result);
    setHarvestedIsNew(isNew);

    // 実を1つ消費
    const newFruits = fruits - 1;
    setFruits(newFruits);

    // Supabaseに実の減少を保存
    saveProgress({ leaves, flowers, fruits: newFruits, streak, todayDone });
  }, [fruits, leaves, flowers, streak, todayDone, fruitCollection]);

  // 🍎 ガチャ演出を閉じる → コレクションに追加
  const handleHarvestClose = useCallback(() => {
    if (harvestedFruit) {
      const updated = addFruitToCollection(harvestedFruit.id);
      setFruitCollection(updated);
    }
    setHarvestedFruit(null);
    setHarvestedIsNew(false);
  }, [harvestedFruit]);

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
  // 🎯 v1.0.2: 選択中のキャラの名前を表示名にする
  const displayName = selectedCharacter === 'robot'
    ? (robotName || DEFAULT_ROBOT_NAME)
    : (petName || DEFAULT_PET_NAME);

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

  // 📜 利用規約等は認証不要で表示（ログイン前でもアクセス可能）
  if (['terms', 'privacy', 'tokushoho', 'howto'].includes(screen)) {
    const legalOnBack = () => setScreen('home');
    switch (screen) {
      case 'terms': return <TermsScreen onBack={legalOnBack} />;
      case 'privacy': return <PrivacyScreen onBack={legalOnBack} />;
      case 'tokushoho': return <TokushohoScreen onBack={legalOnBack} />;
      case 'howto': return <HowToScreen onBack={legalOnBack} />;
      default: break;
    }
  }

  // 未ログイン → ログイン画面（supabase有効時のみ）
  if (supabase && !user) {
    return (
      <AuthScreen
        onOpenTerms={() => setScreen('terms')}
        onOpenPrivacy={() => setScreen('privacy')}
        onOpenTokushoho={() => setScreen('tokushoho')}
        onOpenHowTo={() => setScreen('howto')}
      />
    );
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
            selectedCharacter={selectedCharacter}
            onComplete={handleLearningComplete}
            onBack={() => setScreen('home')}
            displayMode={displayMode}
          />
        );
      case 'mimamori':
        if (!canAccessPremium) return <PremiumGate featureName="みまもり" onBack={() => setScreen('home')} user={user} onLogout={handleLogout} />;
        return <MimamoriScreen onBack={() => setScreen('home')} streak={streak} appVersion={APP_VERSION} onOpenLevelSettings={() => setScreen('level-settings')} displayMode={displayMode} onChangeDisplayMode={handleDisplayModeChange} user={user} userPlan={userPlan} hasStripeCustomer={hasStripeCustomer} onOpenTerms={() => setScreen('terms')} onOpenPrivacy={() => setScreen('privacy')} onOpenTokushoho={() => setScreen('tokushoho')} onLogout={handleLogout} />;
      case 'level-settings':
        if (!canAccessPremium) return <PremiumGate featureName="レベルせってい" onBack={() => setScreen('home')} user={user} />;
        return (
          <LevelSettingsScreen
            levels={subjectLevels}
            onChange={handleSubjectLevelsChange}
            onBack={() => setScreen('home')}
          />
        );
      case 'fukushu':
        if (!canAccessPremium) return <PremiumGate featureName="ふくしゅう" onBack={() => setScreen('home')} user={user} />;
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
        if (!canAccessPremium) return <PremiumGate featureName="げんそずかん" onBack={() => setScreen('home')} user={user} />;
        return (
          <ZukanScreen
            onBack={() => setScreen('home')}
            petName={displayName}
          />
        );
      case 'subject-kokugo':
        if (!canAccessPremium) return <PremiumGate featureName="こくご れんしゅう" onBack={() => setScreen('home')} user={user} />;
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
        if (!canAccessPremium) return <PremiumGate featureName="げんそ" onBack={() => setScreen('home')} user={user} />;
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
        if (!canAccessPremium) return <PremiumGate featureName="さんすう れんしゅう" onBack={() => setScreen('home')} user={user} />;
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
        if (!canAccessPremium) return <PremiumGate featureName="りか れんしゅう" onBack={() => setScreen('home')} user={user} />;
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
        return <PremiumGate featureName="この きのう" onBack={() => setScreen('home')} user={user} />;
      case 'terms':
        return <TermsScreen onBack={() => setScreen('home')} />;
      case 'privacy':
        return <PrivacyScreen onBack={() => setScreen('home')} />;
      case 'tokushoho':
        return <TokushohoScreen onBack={() => setScreen('home')} />;
      case 'howto':
        return <HowToScreen onBack={() => setScreen('home')} />;
      case 'collection':
        return <CollectionScreen collection={fruitCollection} onBack={() => setScreen('home')} />;
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
            robotName={robotName}
            puzzleData={puzzleData}
            equippedItem={costumeData.equippedItem}
            userPlan={userPlan}
            trialDaysLeft={trialDaysLeft}
            selectedCharacter={selectedCharacter}
            onCharacterChange={handleCharacterChange}
            onRenameCharacter={handleRenameCharacter}
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
            canHarvest={fruits > 0}
            onHarvest={handleHarvest}
            onOpenCollection={() => setScreen('collection')}
            fruitCollection={fruitCollection}
          />
        );
    }
  };

  return (
    <>
      <UpdateBanner currentVersion={APP_VERSION} />
      {renderScreen()}
      {harvestedFruit && (
        <HarvestScreen
          fruit={harvestedFruit}
          isNew={harvestedIsNew}
          onClose={handleHarvestClose}
        />
      )}
    </>
  );
}

export default App;
