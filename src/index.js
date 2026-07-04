import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const HOME_TITLE = '🌳 まなびの木';

// ホーム以外の画面で、左上に共通のホーム導線を表示する。
// App.jsの画面状態や学習データには触れず、ルート再読込で安全にホームへ戻す。
const HomeShortcut = () => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const appRoot = document.getElementById('root');
    if (!appRoot) return undefined;

    const updateVisibility = () => {
      const isHomeOrStartup = Array.from(appRoot.querySelectorAll('div')).some(
        (element) => element.childElementCount === 0 && element.textContent?.trim() === HOME_TITLE
      );
      setVisible(!isHomeOrStartup);
    };

    updateVisibility();
    const observer = new MutationObserver(updateVisibility);
    observer.observe(appRoot, { childList: true, subtree: true, characterData: true });

    return () => observer.disconnect();
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="まなびの木のホームへ戻る"
      title="ホームへ戻る"
      onClick={() => window.location.assign('/')}
      style={{
        position: 'fixed',
        top: 'calc(env(safe-area-inset-top, 0px) + 62px)',
        left: 12,
        zIndex: 9000,
        border: '2px solid #A5D6A7',
        borderRadius: 999,
        background: 'rgba(255, 255, 255, 0.96)',
        color: '#2E7D32',
        padding: '6px 11px',
        fontSize: 12,
        fontWeight: 800,
        lineHeight: 1,
        fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
        boxShadow: '0 2px 8px rgba(46, 125, 50, 0.18)',
        cursor: 'pointer',
      }}
    >
      {HOME_TITLE}
    </button>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    <HomeShortcut />
  </React.StrictMode>
);

// PWA: Service Worker登録（ホーム画面追加を有効化）
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  });
}
