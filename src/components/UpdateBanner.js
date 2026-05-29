// ============================================
// 🔄 UpdateBanner - アプリ更新通知
// version.jsonとAPP_VERSIONを比較し、
// 新バージョンがあれば通知バナーを表示
// ============================================

import React, { useState, useEffect } from 'react';

const UpdateBanner = ({ currentVersion }) => {
  const [newVersion, setNewVersion] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const checkUpdate = async () => {
      try {
        // キャッシュ無効化してversion.jsonを取得
        const res = await fetch(`/version.json?t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json();

        if (data.version && data.version !== currentVersion) {
          // バージョンが違う → 更新あり！
          setNewVersion(data.version);
        }
      } catch (err) {
        // ネットワークエラー等は静かに無視
        console.log('バージョンチェックスキップ');
      }
    };

    // 起動時にチェック
    checkUpdate();

    // 5分ごとにチェック（長時間開きっぱなし対策）
    const interval = setInterval(checkUpdate, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [currentVersion]);

  // 更新なし or 閉じた
  if (!newVersion || dismissed) return null;

  return (
    <div
      onClick={() => window.location.reload(true)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        background: 'linear-gradient(135deg, #FF9800, #F57C00)',
        color: 'white',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
        boxShadow: '0 4px 15px rgba(255,152,0,0.4)',
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
          <div style={{ fontSize: 13, fontWeight: 800 }}>
            🎉 あたらしい バージョンが あるよ！
          </div>
          <div style={{ fontSize: 11, opacity: 0.9 }}>
            v{currentVersion} → v{newVersion}　タップして こうしん！
          </div>
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
        あとで
      </button>
    </div>
  );
};

export default UpdateBanner;
