// ============================================
// 🔄 UpdateBanner - アプリ更新通知
// 2段構え:
//   ① localStorage保存バージョンとの比較 → 更新完了通知（緑）
//   ② version.jsonとの比較 → 更新あり通知（オレンジ）
// v0.6.3: ペット名退避 + 通常リロード
// v0.9.4: localStorage比較方式を追加（デプロイ直後にもバナー表示）
// ============================================

import React, { useState, useEffect } from 'react';
import { backupPetNameForUpdate } from '../lib/storage';

const LAST_VERSION_KEY = 'manabi_last_version';

const UpdateBanner = ({ currentVersion }) => {
  // bannerType: 'updated'(更新完了/緑) | 'available'(更新あり/オレンジ) | null
  const [bannerType, setBannerType] = useState(null);
  const [prevVersion, setPrevVersion] = useState(null);
  const [remoteVersion, setRemoteVersion] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // ① ローカル保存バージョンとの比較（更新完了検知）
    const lastVersion = localStorage.getItem(LAST_VERSION_KEY);

    if (lastVersion && lastVersion !== currentVersion) {
      // バージョンが上がった！更新完了バナーを表示
      setPrevVersion(lastVersion);
      setBannerType('updated');
      localStorage.setItem(LAST_VERSION_KEY, currentVersion);
      // 更新完了通知を15秒後に自動消去（v1.0.1: 6秒→15秒に延長、見逃し防止）
      const autoHide = setTimeout(() => setBannerType(null), 15000);
      return () => clearTimeout(autoHide);
    }

    // 初回 or 一致 → 記録
    if (!lastVersion) {
      localStorage.setItem(LAST_VERSION_KEY, currentVersion);
    }

    // ② version.jsonとの比較（開きっぱなし対策）
    const checkUpdate = async () => {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.version && data.version !== currentVersion) {
          setRemoteVersion(data.version);
          setBannerType('available');
        }
      } catch (err) {
        console.log('バージョンチェックスキップ');
      }
    };

    checkUpdate();
    const interval = setInterval(checkUpdate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentVersion]);

  const handleTap = () => {
    if (bannerType === 'available') {
      // まだ古いバージョン → リロード
      backupPetNameForUpdate();
      window.location.reload();
    } else {
      // 更新完了通知 → 閉じるだけ
      setDismissed(true);
    }
  };

  if (!bannerType || dismissed) return null;

  const isUpdated = bannerType === 'updated';

  return (
    <div
      onClick={handleTap}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: isUpdated
          ? 'linear-gradient(135deg, #4CAF50, #388E3C)'
          : 'linear-gradient(135deg, #FF9800, #F57C00)',
        color: 'white',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
        boxShadow: isUpdated
          ? '0 4px 15px rgba(76,175,80,0.4)'
          : '0 4px 15px rgba(255,152,0,0.4)',
        animation: 'mame-fadeIn 0.5s ease-out',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <img
          src="/public/images/mame/mame_happy.png"
          alt="まめ"
          style={{ width: 32, height: 32, objectFit: 'contain' }}
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div>
          {isUpdated ? (
            <>
              <div style={{ fontSize: 13, fontWeight: 800 }}>
                🎉 アップデート かんりょう！
              </div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>
                v{prevVersion} → v{currentVersion} になったよ！
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: 13, fontWeight: 800 }}>
                🎉 あたらしい バージョンが あるよ！
              </div>
              <div style={{ fontSize: 11, opacity: 0.9 }}>
                v{currentVersion} → v{remoteVersion}　タップして こうしん！
              </div>
            </>
          )}
        </div>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); setDismissed(true); }}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: 8,
          color: 'white',
          fontSize: 12,
          padding: '4px 10px',
          cursor: 'pointer',
          fontFamily: "'Rounded Mplus 1c', sans-serif",
        }}
      >
        {isUpdated ? 'OK' : 'あとで'}
      </button>
    </div>
  );
};

export default UpdateBanner;
