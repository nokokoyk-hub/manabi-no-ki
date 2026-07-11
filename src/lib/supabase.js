// ============================================
// 🔌 Supabase クライアント設定
// まなびの木 - データ永続化用
// ============================================
// ⚠️ 環境変数は Vercel ダッシュボードで設定すること
// REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const AUTH_BOOT_TIMEOUT_MS = 8000;
const AUTH_BOOT_STATUS_KEY = 'manabi_auth_boot_status';

const setAuthBootStatus = (status) => {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(AUTH_BOOT_STATUS_KEY, status);
  } catch {
    // sessionStorageが使えない環境でも起動を止めない
  }
};

// Android TWAや一部ブラウザでgetSession()が返らない場合でも、
// 認証ローディング画面に永久滞在しないための安全網。
const installAuthSessionGuard = (client) => {
  const originalGetSession = client.auth.getSession.bind(client.auth);

  client.auth.getSession = async (...args) => {
    const timeoutSentinel = Symbol('auth-session-timeout');
    const timerHost = typeof window !== 'undefined' ? window : globalThis;
    let timeoutId;

    try {
      setAuthBootStatus('checking');

      const timeoutPromise = new Promise((resolve) => {
        timeoutId = timerHost.setTimeout(
          () => resolve(timeoutSentinel),
          AUTH_BOOT_TIMEOUT_MS
        );
      });

      const result = await Promise.race([
        originalGetSession(...args),
        timeoutPromise,
      ]);

      if (result === timeoutSentinel) {
        const error = new Error(
          `Supabase session check timed out after ${AUTH_BOOT_TIMEOUT_MS}ms`
        );
        console.warn('⚠️ 認証確認がタイムアウトしました。ログイン画面へ進みます。', error);
        setAuthBootStatus('timeout');
        return { data: { session: null }, error };
      }

      setAuthBootStatus(result?.error ? 'error' : 'ready');
      return result;
    } catch (error) {
      console.error('❌ 認証確認に失敗しました。ログイン画面へ進みます。', error);
      setAuthBootStatus('error');
      return { data: { session: null }, error };
    } finally {
      if (timeoutId) timerHost.clearTimeout(timeoutId);
    }
  };

  return client;
};

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase環境変数が未設定です。ローカルモードで動作します。\n' +
    'Vercelダッシュボードで REACT_APP_SUPABASE_URL と REACT_APP_SUPABASE_ANON_KEY を設定してください。'
  );
}

const supabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'implicit',        // PWA互換: PKCEだとstandalone→ブラウザ間でカギが消えるため
        detectSessionInUrl: true,     // リダイレクト後のURL内トークンを自動検知
        persistSession: true,         // localStorageにセッション保持（明示）
        autoRefreshToken: true,       // トークン自動更新（明示）
      }
    })
  : null;

export const supabase = supabaseClient
  ? installAuthSessionGuard(supabaseClient)
  : null;
