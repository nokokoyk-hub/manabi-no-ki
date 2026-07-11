import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// React内部で致命的な描画エラーが起きても、白画面のままにしない安全網。
class BootErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ アプリ起動中に致命的なエラーが発生しました。', error, errorInfo);
    try {
      window.sessionStorage.setItem('manabi_boot_status', 'render-error');
    } catch {
      // sessionStorageが使えない環境でもエラー画面は表示する
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
          background: '#FFF8F0',
          fontFamily: "'Rounded Mplus 1c', 'Noto Sans JP', sans-serif",
          color: '#37474F',
          textAlign: 'center',
        }}>
          <div style={{ maxWidth: 360 }}>
            <div style={{ fontSize: 42, marginBottom: 12 }}>🌱</div>
            <h1 style={{ fontSize: 20, color: '#2E7D32', margin: '0 0 12px' }}>
              うまく ひらけませんでした
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.8, margin: '0 0 20px' }}>
              つうしんを たしかめて、もういちど おためしください。
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                border: 0,
                borderRadius: 999,
                padding: '12px 24px',
                background: '#43A047',
                color: '#FFFFFF',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              もういちど よみこむ
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('React root element (#root) was not found.');
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BootErrorBoundary>
      <App />
    </BootErrorBoundary>
  </React.StrictMode>
);

// PWA: Service Worker登録（ホーム画面追加を有効化）
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  });
}
