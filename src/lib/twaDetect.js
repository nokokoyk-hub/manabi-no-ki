// ============================================
// 📱 twaDetect.js - TWA（Google Playアプリ）判定
// まなびの木 v1.0.6
// 新規作成: 2026/07/02（スレッド30）
// ============================================
// 【なぜ必要か】
// Google Play配信アプリ内からStripe等の外部決済へ誘導すると
// Google Play課金ポリシー違反となり審査リジェクトされる。
// TWA経由で開かれた場合のみ課金ボタンを非表示にし、
// 「ウェブサイトからご契約ください」の文言（リンクなし）に
// 差し替えるための判定を行う。
//
// 【判定の仕組み】
// TWAで起動されたページは document.referrer が
// "android-app://<パッケージ名>" になる（Android仕様）。
// SPA遷移でreferrerが失われるため、モジュール読み込み時に
// 1回判定して sessionStorage に保存する。
//
// 【⚠️ localStorage を使わない理由】
// TWAとChromeブラウザは localStorage を共有するため、
// localStorageに保存するとブラウザ版でも課金ボタンが
// 消える事故が起きる。sessionStorageはタブ（セッション）
// 単位で独立しているため安全。
//
// 【ロールバック】
// isTwa() を「return false;」固定にすれば全環境で
// 従来どおり課金ボタンが表示される。
// ============================================

const TWA_KEY = 'manabi_twa_session';

// モジュール読み込み時（アプリ起動直後）に1回だけ判定して保存
// ※ referrerはページロード直後が最も確実なためここで実行
try {
  if (document.referrer && document.referrer.startsWith('android-app://')) {
    sessionStorage.setItem(TWA_KEY, '1');
  }
} catch (e) {
  // sessionStorage が使えない環境では何もしない（＝Web版扱い）
}

/**
 * TWA（Google Playアプリ）経由で開かれているかを判定
 * @returns {boolean} true = TWA / false = 通常のWeb・PWA
 */
export const isTwa = () => {
  try {
    if (document.referrer && document.referrer.startsWith('android-app://')) {
      return true;
    }
    return sessionStorage.getItem(TWA_KEY) === '1';
  } catch (e) {
    return false;
  }
};
