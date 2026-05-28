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

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '⚠️ Supabase環境変数が未設定です。ローカルモードで動作します。\n' +
    'Vercelダッシュボードで REACT_APP_SUPABASE_URL と REACT_APP_SUPABASE_ANON_KEY を設定してください。'
  );
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
