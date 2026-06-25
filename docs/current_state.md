# 🌳 まなびの木 — current_state.md（北極星ファイル）

> **このファイルがプロジェクトの正本（Single Source of Truth）です。**
> スレッド引き継ぎ時は必ずこのファイルを参照すること。
> Google Drive上の過去ダイジェストは参考扱いとし、最新状態としては扱わないこと。

---

## 📌 プロジェクト概要

| 項目 | 内容 |
|------|------|
| アプリ名 | まなびの木 |
| コンセプト | 学ぶほどに木が育つ、発達障害児向け自宅学習アプリ |
| 対象ユーザー | 小学4年生（教科ごとに得意・苦手の凸凹あり） |
| 発達特性 | ADHD + LD 複合（推定） |
| 学習特性 | さんすう: 一桁の繰り上がりが苦手 / かんじ: 6年生レベルの読み書き可能 |
| 使用端末 | スマホ（メイン）、iPad（サブ） |
| 開発体制 | のん × ちゃぴ |
| 開発開始日 | 2026年5月27日（火） |

---

## 🔢 バージョン情報

| 項目 | 値 |
|------|-----|
| 現在のバージョン | **v1.0.1** |
| APP_VERSION | `src/App.js` → `APP_VERSION = '1.0.1'` |
| version.json | `public/version.json` → `"version": "1.0.1"` |
| docs/version.json | `docs/version.json` → `"version": "1.0.1"` |
| package.json | `"version": "1.0.1"` |
| 最終更新日 | 2026年6月26日（木） |

> ※ v1.0.0〜v1.0.1 は **PWA化完了 + メール認証OTP化 + PWAログイン修正（implicit flow）（ロボットくんアイコン・Service Worker・ホーム画面追加対応）+ soul-backup混入対策 + ストア公開準備**を含む。
> ※ v1.0.2候補: OTP改善、つかいかたガイドLP追加、AuthScreenロボちゃん配置、ロボちゃん全18ポーズ、キャラ選択機能
> ※ v1.0.3（DB設計刷新 6/26）: storage.js user_id一本化、device_idフォールバック完全廃止、ゴーストレコード大掃除、profile自動作成フォールバック、checkAndSwitchUser実装
> ※ 4箇所すべてv1.0.1のまま（バンプはDB再構築完了後にまとめて実施予定）。

---

## 🏗️ 技術スタック

| レイヤー | 技術 | 状態 |
|----------|------|------|
| フロントエンド | React（Create React App） | ✅ 稼働中 |
| バックエンド | Supabase | ✅ 稼働中 |
| 認証 | Supabase Auth（Google OAuth + メールOTP） | ✅ 稼働中（v0.9.7〜） |
| メール送信 | Resend SMTP（マジックリンク用） | ✅ 稼働中（6/19開通） |
| 問題データ | Supabase questionsテーブル | ✅ 587問DB管理 |
| ユーザー管理 | Supabase profilesテーブル | ✅ 稼働中（v0.9.9〜） |
| デプロイ | Vercel（GitHub連携・自動デプロイ） | ✅ 稼働中 |
| PWA | manifest.json + Service Worker + アイコン | ✅ 稼働中（v1.0.0〜） |
| バージョン管理 | GitHub | ✅ 稼働中（Public） |
| アクセス解析 | Google Analytics 4（GA4） | ✅ 稼働中（v0.9.9〜） |
| ユーザー管理シート | Google Sheets + Apps Script | ✅ 稼働中（v0.9.9〜） |
| SEO | OGP・JSON-LD・sitemap・robots | ✅ 設定済み（6/19） |

### インフラ情報
- **独自ドメイン: `manabinoki.net`**（お名前.com取得、Vercelネームサーバー接続、SSL自動）
- **www.manabinoki.net → manabinoki.net にリダイレクト統一**（Vercel Domains設定）
- GitHub: `nokokoyk-hub/manabi-no-ki`（Public, main）
- Vercel: `manabi-no-ki-kannari-norikos-projects.vercel.app`（旧URL、リダイレクト用に残存）
- Supabase: `ndqbtfahtjaafroevgwq`（東京リージョン）
- GCP: プロジェクト `manabinoki`（OAuth Client ID発行済み）
- GA4: 測定ID `G-64GLZZQC24`（プロパティ「まなびの木」）
- テーブル: user_progress, learning_sessions, questions(587問), answer_history, **profiles(v0.9.9〜)**
- ビュー: **user_management_view**（Google Sheets連携用）

### SMTP設定（マジックリンク用・6/19開通）
| 項目 | 値 |
|------|-----|
| サービス | **Resend** |
| Host | `smtp.resend.com` |
| Port | `587`（※465はSupabaseでタイムアウトするため不可） |
| Username | `resend` |
| Password | ResendのAPIキー |
| Sender email | `noreply@manabinoki.net` |
| Sender name | `まなびの木` |
| ドメイン認証 | DKIM / SPF / MX すべてVerified |
| Resendアカウント | nokoko3@outlook.jpで登録 |

> ※ Brevoは無料プランのSMTPリレー制限により不採用。Brevo APIは使える（テストメール送信確認済み）がSMTP経由は不可だった。
> ※ お受験マネージャーのResendとは別アカウント（1アカウント1ドメイン制限のため）。

### SEO設定（6/19設定）
- **OGPタグ**: og:title, og:description, og:type, og:url, og:site_name, og:locale
- **Twitter Card**: summary
- **canonical URL**: https://manabinoki.net/
- **JSON-LD構造化データ**: WebApplication（EducationalApplication）
- **robots.txt**: Allow: / / Disallow: /api/ / Sitemap指定
- **sitemap.xml**: トップページ + changelog
- **manifest.json**: description, lang, orientation追加
- ✅ **Google Search Console**メタタグ設置済み（クロール待ち）
- ✅ **OG画像**: og-image.png（ロボットくん1200×630）設定済み
- ✅ **Twitter Card**: summary_large_image に変更済み

### questionsテーブル主要カラム
| カラム | 型 | 説明 |
|--------|-----|------|
| question / question_advanced | TEXT | ひらがな版 / 漢字版問題文 |
| options / options_advanced | JSONB | ひらがな版 / 漢字版選択肢 |
| grade_level | INTEGER | 難易度レベル（1〜6）※カラム名は level ではなく grade_level |
| category | TEXT | okurigana / clock 等（どうとくは null） |
| hint | TEXT (nullable) | 出題中のヒント |
| explanation | TEXT (nullable) | 不正解時の解説文（ていがくねん用・ひらがな主体）v0.9.5〜 |
| explanation_advanced | TEXT (nullable) | 不正解時の解説文（こうがくねん用・漢字混じり）v0.9.6〜 |

### profilesテーブル（v0.9.9〜）
| カラム | 型 | 説明 |
|--------|-----|------|
| id | UUID (PK) | auth.users.id と1:1連携 |
| device_id | TEXT | 既存データとの橋渡し用（Phase A-4で使用予定） |
| display_name | TEXT | 表示名（将来用） |
| guardian_pin | TEXT | 保護者PINコード（4桁）Phase B |
| trial_started_at | TIMESTAMPTZ | トライアル開始日 Phase C |
| subscription_status | TEXT | trial / free / premium（デフォルト: trial） |
| stripe_customer_id | TEXT | Stripe顧客ID Phase D |
| created_at / updated_at | TIMESTAMPTZ | 自動管理 |

> RLS設定済み（自分のprofileのみ読み書き可能）。新規ユーザー登録時に自動でprofile作成（DBトリガー）。

---

## 📊 問題データ（587問・7教科）

| 教科 | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | 計 |
|------|-----|-----|-----|-----|-----|-----|-----|
| さんすう | 22 | 20 | 20 | 20 | 20 | 20 | **122** |
| こくご | 20 | 20 | 18 | 18 | 30 | 30 | **136** |
| りか | 16 | 17 | 12 | 11 | 10 | 12 | **78** |
| しゃかい | 10 | 10 | 10 | 10 | 10 | 15 | **65** |
| とけい | 13 | 6 | 8 | 8 | 8 | 13 | **56** |
| どうとく | 10 | 10 | 10 | 10 | 10 | 10 | 60 |
| げんそ | 7 | 12 | 12 | 13 | 14 | 12 | 70 |
| **合計** | **98** | **95** | **90** | **90** | **102** | **112** | **587** |

### ミッション出題ルール
- 6教科（さんすう・こくご・りか・しゃかい・とけい・どうとく）からバランスよく8問
- げんそはミッション除外（MISSION_EXCLUDE_SUBJECTS = ['げんそ']）
- 誤答優先: 過去30日の誤答問題を最大40%優先
- フレッシュ化: 直近3日以内の出題を後回し（プール5問未満なら全問使用）

---

## 💡 解説（explanation）進捗

ていがくねん版（`explanation`・ひらがな）／こうがくねん版（`explanation_advanced`・漢字）の2本立て。
**全7教科・587問・ひらがな＋漢字 = 1,174個の解説が100%完成。**

> 今後の問題追加時はフルセット（問題文＋選択肢＋解説 × ひらがな＋漢字）で同時投入する。

---

## 🔐 認証（v0.9.7〜）

### 認証方式
| 方式 | 状態 | 技術 |
|------|------|------|
| Googleログイン | ✅ 稼働中 | Supabase Auth（リダイレクト方式） |
| メールログイン（OTPコード） | ✅ 稼働中 | Supabase Auth + Resend SMTP（v1.0.1〜OTP方式） |

### 認証フロー
- 未ログイン → AuthScreen.js（ログイン画面）表示
- ログイン済み → 既存のホーム画面へ
- WebView検知（LINE/Facebook/Instagram/Yahoo）→ 案内バナー表示
- Googleログイン失敗時 → メールログインへ自動誘導
- supabase未接続（ローカルモード）時は認証スキップ → 既存動作を維持
- **認証後のURL末尾 # 残骸を自動クリア（v0.9.9〜）**

### 関連設定
- GCP: プロジェクト `manabinoki` → OAuth Client ID
- Supabase: Authentication → Providers → Google ON / Email ON
- Supabase: URL Configuration → Site URL = `https://manabinoki.net`
- Supabase: Redirect URLs = `https://manabinoki.net`, `https://manabinoki.net/**`
- GCP: リダイレクトURI = `https://ndqbtfahtjaafroevgwq.supabase.co/auth/v1/callback`

---

## 🔒 保護者PINロック（Phase B・v0.9.9〜）

- みまもり画面に入る前に4桁PIN入力を要求
- **初回**: PIN新規設定（2回入力で確認）→ Supabase profiles.guardian_pin に保存
- **2回目以降**: PIN照合 → 成功でみまもり画面表示
- **PIN変更**: 「PINを わすれた / へんこうする」リンクから再設定可能
- ローカルモード時はlocalStorageにフォールバック
- コンポーネント: `src/components/PinGate.js`

---

## 🎫 トライアル制限（Phase C・v0.9.9〜）

### プラン設計
| プラン | 料金 | 内容 |
|--------|------|------|
| トライアル | 無料（5日間） | 全機能フル開放 |
| 無料プラン | 0円 | ミッション1日1回 + パズル・きせかえ |
| プレミアム | 月額200円 | 全機能開放 |

### 機能制限（無料プラン）
| 機能 | free | trial | premium |
|------|:---:|:---:|:---:|
| ミッション（1日1回） | ✅ | ✅ | ✅ |
| パズル・きせかえ | ✅ | ✅ | ✅ |
| 教科別モード（7教科） | 🔒 | ✅ | ✅ |
| ふくしゅう | 🔒 | ✅ | ✅ |
| みまもり | ✅ | ✅ | ✅ |
| レベル設定 | 🔒 | ✅ | ✅ |
| げんそずかん | 🔒 | ✅ | ✅ |

### 自動切り替えロジック
- App.jsでprofilesからsubscription_status + trial_started_atを取得
- trial開始から5日経過 → 自動でsubscription_status='free'に更新
- canAccessPremium判定: premium or trial → OK / free → ロック
- HomeScreenにトライアルバナー＋無料プランバナー＋ボタンロックアイコン表示
- ロック機能タップ → PremiumGate画面（「おうちのひとに そうだんしてね🌳」）
- コンポーネント: `src/components/PremiumGate.js`

### 開発用アカウント
- `nokoko.yk@gmail.com` → **premium**（制限なし）

---

## 📝 機能一覧（v0.9.9時点）

### ✅ 実装済み主要機能
- **🔐 認証（Googleログイン＋マジックリンク）** ← v0.9.7
- **🔒 保護者PINロック** ← v0.9.9
- **🎫 トライアル制限（5日→無料→プレミアム）** ← v0.9.9
- **📊 GA4アクセス解析** ← v0.9.9
- **📋 Google Sheets ユーザー管理** ← v0.9.9
- **📧 マジックリンクSMTP（Resend）** ← 6/19開通
- **🔍 SEO基盤（OGP・JSON-LD・sitemap）** ← 6/19設定
- **🤖 ロボットくんキャラクター** ← v0.9.9
- **📜 利用規約・プライバシーポリシー・特商法表記ページ** ← v0.9.9
- **💳 Stripe Checkout連携（本番稼働中）** ← v0.9.9（6/19本番切替）
- **🔓 Stripe Customer Portal（解約・プラン管理）** ← 6/19実装
- **🌳 trialアップグレードボタン** ← 6/19追加
- **みまもり画面 freeアクセス解放** ← v0.9.9
- ホーム画面7ボタン構成（算国理社＋とけい・どうとく・げんそ）
- SubjectMenuScreen（教科→カテゴリ階層）
- 表示モード切り替え（ていがくねん/こうがくねん）
- 教科別レベル設定（Lv1〜6、7教科）
- フルスクリーン日跨ぎリセット
- 着せ替え（8アイテム）
- UpdateBanner（localStorage + version.json 2段構え）
- 誤答記録 + 誤答優先出題 + 出題フレッシュ化
- 解説機能（不正解時に💡黄色カード表示、ひらがな/漢字両面100%完成）
- ごほうびパズル + げんそずかん + 保護者モード

### 🔲 未実装（優先順）
1. ~~🤖 キャラクター追加（ロボットくん）~~ ✅ **完了（v0.9.9）**
2. ~~Phase D: Stripe Checkout連携~~ ✅ **テスト環境完了（v0.9.9）**
3. ~~利用規約・プライバシーポリシー・特商法表記ページ~~ ✅ **完了（v0.9.9）**
4. ~~Stripe本番切替 + 解約機能~~ ✅ **完了（6/19）**
5. ~~**PWA化（ロボットくんアイコン活用）**~~ ✅ **完了（v1.0.0）**
6. ~~**Google Search Console 登録**~~ ✅ **メタタグ設置済み・クロール待ち（v1.0.1）**
7. ~~**OG画像をロボットくんに設定**~~ ✅ **完了（v1.0.1）**
8. ~~**UpdateBannerの自動消去タイミング調整**~~ ✅ **15秒に延長（v1.0.1）**
9. **ストア掲載素材（スクリーンショット・説明文・フィーチャーグラフィック）** 🔴
10. **TWAビルド + Digital Asset Links** 🔴
11. ~~Phase A-4: device_id → user_id 移行~~ ✅ **完了（6/25）**
12. Google Play Store 公開（TWA） 🟡
13. FukushuScreen改修 🟡
14. 問題追加（とけいLv2補強、りかLv4-5等） 🟡
15. ロボットくん名前機能 + キャラ選択（出題時キャラ交代/ランダム） 🟡
16. UI調整 🟡
17. **Supabase Pro Plan移行（auth.manabinoki.net化）** 🟡

---

## 🤖 キャラクター（v0.9.9実装済み）

### ロボットくん
- 水彩タッチのかわいいロボット。頭にアンテナ、お腹に水色ライト。
- コンポーネント: `src/components/RobotCharacter.js`
- 画像: `public/public/images/robot/` に18枚配置（v1.0.2で15枚追加）
- MameCharacterと同じpose名に対応（キャラ選択時に同じ変数で切替可能）
- 吹き出しメッセージ機能・きらきらパーティクル搭載

| ファイル | ポーズ | 用途 |
|----------|--------|------|
| robot_wave.png | 👋 手振り | ホーム画面・通常 |
| robot_cheer.png | 💪 ガッツポーズ | ミッションクリア後 |
| robot_icon.png | 📱 アイコン | favicon・PWA用 |
| robot_happy.png | 😊 にっこり | 正解時 |
| robot_sad.png | 😢 しょんぼり | 不正解時 |
| robot_question.png | ❓ はてな | 出題中 |
| robot_jump.png | 🦘 ジャンプ | 2コンボ |
| robot_medal.png | 🏅 メダル | 4コンボ以上 |
| robot_cry_happy.png | 😭 嬉し泣き | 全問正解 |
| robot_dash.png | 💨 ダッシュ | 問題読み込み中 |
| robot_touched.png | 🥺 感動 | 復習画面 |
| robot_flag.png | 🚩 旗 | ストリーク |
| robot_heart.png | 💕 ハート | 好感度 |
| robot_sleep.png | 💤 おやすみ | 休憩 |
| robot_eat.png | 🔩 もぐもぐ | ボルト食べ |
| robot_relax.png | ☕ リラックス | OIL缶 |
| robot_sparkle.png | ✨ きらきら | 3コンボ |
| robot_bow.png | 🙇 おじぎ | 挨拶 |

### キャラ選択機能（v1.0.2〜 mainマージ済み）
- App.js: `selectedCharacter` state（localStorage保存）
- HomeScreen: まめ/ロボちゃんタップで切替 + 🎯せんせいバッジ
- LearningScreen: CharaComponent切替ヘルパー（出題キャラ交代対応）
- 対応済み画面: HomeScreen, LearningScreen
- 未対応画面: FukushuScreen, GohoubiScreen, SubjectMenuScreen, LevelSettingsScreen（次回）

### 配置状況
- **ホーム画面**: 木の左にロボットくん、右にまめ ✅
- **ふわふわ浮遊アニメーション** ✅
- **タップでぽよん** ✅（まめと同じmame-tap風）
- ミッションクリア後はガッツポーズに切り替わり ✅
- ロボットくんの名前機能: 🔲 未実装（将来）

### アイコン活用（v1.0.0〜 PWA対応済み）
| ファイル | サイズ | 用途 |
|----------|--------|------|
| robot-icon-192.png | 192x192 | PWAアイコン（Android） |
| robot-icon-512.png | 512x512 | PWAアイコン（大）+ ストア用 |
| apple-touch-icon.png | 180x180 | iPhoneホーム画面アイコン |
| favicon-32.png | 32x32 | ブラウザタブ |
| favicon.ico | 16/32/48px | レガシーブラウザ |

- manifest.json: icons 3エントリ（192 any / 512 any / 512 maskable）
- Service Worker: `public/service-worker.js`（パススルー方式・キャッシュなし）
- SW登録: `src/index.js` で `navigator.serviceWorker.register()`

---

## 🚀 ストア公開ロードマップ

| バージョン | 内容 |
|-----------|------|
| **v0.9.9** | ✅ キャラクター追加 + 利用規約・プラポリ・特商法 + Stripe本番切替 + 解約機能 |
| **v1.0.0** | ✅ PWA化完了 + ストア審査準備 🎉 |
| **v1.0.1〜** | Google Play Store 公開（TWA）+ OG画像 + UpdateBanner調整 + フィードバック反映 |

> Google Play Developerアカウントはお受験マネージャーで登録済み。新規アプリ追加でまなびの木を出店予定。
> ストア公開には利用規約・プライバシーポリシーが審査で必須。課金ありで出す方が審査やり直し不要。

---

## ⚠️ 既知の整理候補（バグの温床になる前に）

| 項目 | 内容 | 緊急度 |
|------|------|--------|
| public/public/images 入れ子 | コードが `/public/images/...` 参照のため二重構造。動作はするがPWA整理時に一緒に直す | 🟡 |
| changelog v0.9.3 重複 | public/changelog.html に v0.9.3 エントリが2つある。次回整理候補 | 🟢 |
| デカいファイル | App.js(555行)・storage.js(22KB)・MimamoriScreen.js(712行)・LearningScreen.js(18KB)。MimamoriScreen.jsが特に肥大化傾向（Stripe関連追加で増加）、将来的にファイル分割候補 | 🟡 |
| ~~device_id / user_id 二重管理~~ | ✅ **v1.0.3でuser_id一本化完了（6/26）。device_idフォールバック完全廃止。storage.js 1,030行→823行** | ✅ |
| RLS未強化 | user_progress/learning_sessions/answer_historyのRLSが`true`（全員閲覧可能）→ `auth.uid()=user_id`に要修正 | 🔴 |
| ログアウト機能 | 未実装。同一デバイスで別アカウント切替ができない。兄弟利用に必要 | 🔴 |
| signInWithOtp shouldCreateUser | 未指定のため未登録メールでauth.usersが自動作成される（孤児ユーザーの原因） | 🔴 |
| auth孤児ユーザー | profilesにもsoul_usersにもないauth.usersが6件存在。掃除必要 | 🟡 |
| appタグ未設定 | auth.users 15件中13件にappタグなし。トリガー振り分けが不十分 | 🟡 |
| ~~UpdateBanner 6秒自動消去~~ | ✅ **15秒に延長済み（v1.0.1）** | ✅ |
| auth ゴーストユーザー | SMTP テスト時にnokoko333@gmail.com等の未認証ユーザーが大量作成された可能性。要掃除 | 🟢 |
| ~~OG画像未設定~~ | ✅ **og-image.png設定済み（v1.0.1）** | ✅ |

### 🔒 soul-backup同居対策（v1.0.0〜）
- **profilesトリガー二重ガード**実装済み: ①app_tagチェック + ②soul_usersチェック + ON CONFLICT DO NOTHING
- **soul_user_management_view**作成済み: soul-backup専用のユーザー管理ビュー
- **SMTP送信者名問題**: Supabaseプロジェクト単位のためsoul-backupユーザーにも「まなびの木」名義でメールが届く → Twitter告知 + アプリ内注意書きで対応（将来的にSupabase分離で根本解決）
- **soul-backup側signInWithOtp修正**: `data: { app: 'soul-backup' }` メタデータ付与が未実装 → 修正ガイド作成済み・次回適用予定

### 🩺 品質管理ツール
- **`docs/question_add_checklist.md`** = 問題追加チェックリスト（健康診断キット）
- **セクション9** = 問題追加フルセットテンプレート
- **`docs/auth_setup_guide.md`** = GCP + Supabase 認証設定手順書

---


### Stripe連携（v0.9.9〜 本番稼働中）
| 項目 | 値 |
|------|-----|
| Stripeアカウント | `acct_1TjaQSDVjCZnmwjF`（まなびの木専用・本番有効化済み） |
| Payment Link（本番） | `https://buy.stripe.com/14A4gz3lY3vl2QZ8pt6AM00` |
| Product | まなびの木 プレミアム（¥200/月） |
| Edge Function① | `stripe-webhook`（Webhook処理） |
| Edge Function② | `create-portal-session`（Customer Portal URL生成） |
| Webhook URL | `https://ndqbtfahtjaafroevgwq.supabase.co/functions/v1/stripe-webhook` |
| Webhookイベント | `checkout.session.completed` / `customer.subscription.deleted` |
| 環境変数 | `STRIPE_SECRET_KEY`（sk_live_） / `STRIPE_WEBHOOK_SECRET`（whsec_）Supabase Secrets設定済み |
| 決済フロー | みまもり画面 → アップグレードボタン → Payment Link（+client_reference_id） → Webhook → profiles更新 |
| 解約フロー | みまもり画面 → プラン管理ボタン → Edge Function → Stripe Customer Portal → 解約 → Webhook → profiles更新 |
| 本番切替 | ✅ 完了（2026/06/19） |
| テスト決済 | ✅ テスト環境で成功確認済み |

> ※ お受験マネージャーとは別のStripeアカウント。お受験マネージャーのサンドボックスでテスト後、まなびの木専用アカウントの本番に移行。
> ※ みまもり画面はPINロックで保護されているため、freeプランでもアクセス可能。課金ボタンがPINロック内にあるので子どもの誤課金を防止。
> ※ Customer Portalは「請求期間の終了時にキャンセル」設定（払った分は最後まで使える）。

### Edge Function技術ノート
- `create-portal-session`: **JWT直接デコード方式**（`getUser()`はES256 JWT互換性問題あり→不使用）
- `verify_jwt: false` で両Edge Functionをデプロイ（内部で自前認証 or Webhook署名検証）
- フロントからは `fetch` 直接呼び出し + `supabase.auth.getSession()` でトークン明示送信
- `hasStripeCustomer` 判定: stripe_customer_idがある場合のみCustomer Portalボタン表示（DB直接premium設定の開発者アカウントではボタン非表示）

### 法的ページ（v0.9.9〜）
| ページ | コンポーネント | アクセス |
|--------|---------------|---------|
| 利用規約 | `src/screens/TermsScreen.js` | 認証前からアクセス可能 |
| プライバシーポリシー | `src/screens/PrivacyScreen.js` | 認証前からアクセス可能 |
| 特商法表記 | `src/screens/TokushohoScreen.js` | 認証前からアクセス可能 |
| つかいかたガイド | `src/screens/HowToScreen.js` | 認証前からアクセス可能（v1.0.2〜） |

- AuthScreen（ログイン画面）下部にリンク配置
- MimamoriScreen（保護者画面）下部にリンク配置
- App.jsで認証チェック前にバイパス判定（ログイン前でも閲覧可能）
- 事業者: NON WORKS / 連絡先: manabinokiinfo@gmail.com

## 💰 v1.0 課金設計（2026/6/14策定）

フリーミアム月額200円。5日間トライアル→無料(ミッション1日1回)→プレミアム(全機能)。
認証: ✅ Googleログイン + マジックリンク **実装済み（v0.9.7）**
PIN: ✅ 保護者PINロック **実装済み（v0.9.9）**
トライアル制限: ✅ 自動切り替え **実装済み（v0.9.9）**
SMTP: ✅ Resend経由マジックリンク **開通済み（6/19）**
課金: Stripe Checkout（みまもり画面内、保護者PINロック内）。**本番稼働中（6/19〜）**
解約: Stripe Customer Portal（みまもり画面内、請求期間終了時キャンセル）。**実装済み（6/19〜）**
設計書: `docs/auth_and_billing_design.md`

### v1.0実装Phase進捗
- [x] **Phase A: 認証基盤** ✅（v0.9.7）
- [x] **Phase B: 保護者PINロック** ✅（v0.9.9）
- [x] **Phase C: トライアル制限ロジック** ✅（v0.9.9）
- [x] **Phase D: Stripe Checkout連携** ✅（v0.9.9・テスト→6/19本番切替完了）
- [x] **Phase D-2: 解約機能（Customer Portal）** ✅（6/19実装）
- [x] **Phase A-4: device_id → user_id 移行** ✅（6/25実装・テスト完了）

---

## 🔧 開発ルール

- version.json / APP_VERSION / package.json / **docs/version.json** は同時更新（4箇所）
- **DBコンテンツのみの追加（解説など）はバージョンを上げない**
- `dbToAppFormat`（questionLoader.js）がDB→アプリの唯一の変換ポイント
- DDLは`Supabase:apply_migration`、DMLは`Supabase:execute_sql`
- JSONB列は`'[...]'::jsonb`明示キャスト必須
- **日本語SQL UPDATEは8〜10行バッチが安定。CASE WHEN id 方式が安全**
- **changelog.htmlは public/ と docs/ の2箇所に配置。必ず両方同時更新**
- のんはコードに不慣れ→修正はちゃぴ担当、ファイルで渡す
- **問題追加は「フルセット」で**（セクション9テンプレ準拠）: 8カラム同時投入
- **問題を追加・編集したら必ず健康診断SQLを流す**
- **認証関連**: AuthScreen.js、App.jsに認証状態管理。supabase未接続時は認証スキップ
- **課金プラン**: App.jsでprofilesから読み取り、canAccessPremiumで判定。PremiumGateでロック表示
- **PINロック**: MimamoriScreen内でPinGateコンポーネントが入口をガード
- **SMTP**: Supabase SMTP設定 → Resend（smtp.resend.com:587）。ポート465はタイムアウト不可
- **Edge Function認証**: `getUser()`はES256 JWT互換性問題あり→JWT直接Base64デコード方式を使用。`verify_jwt: false`で自前認証
- **Edge Function呼び出し**: `supabase.functions.invoke()`ではなく`fetch`直接+`getSession()`でトークン明示送信が確実
- **Stripeアカウント**: まなびの木専用（`acct_1TjaQSDVjCZnmwjF`）。お受験マネージャーとは完全分離
- **学習データ同期（v1.0.3）**: storage.jsはuser_id一本化（1,030行→823行）。device_idフォールバック完全廃止。migrateDeviceDataToUserは空関数化。loadProgress: user_idで1件取得のシンプル設計。アカウント切替検出（checkAndSwitchUser）＋localStorage自動クリア＋stateリセット実装済
- **profile自動作成**: App.jsのfetchProfile内にupsertフォールバック追加済（トリガー不発対策）
- **DB構造ドキュメント**: `docs/supabase_structure.md` に全テーブルスキーマ・RLS・トリガー・依存マップ・既知問題・DontTouchリスト記載
- **Supabase Pro**: お受験マネージャーのみPro組織（$25/月）。まなびの木は別Free組織（DB再構築中）。再構築完了後にPro合流予定

---

> 最終更新: 2026年6月26日（木）JST
> 更新者: ちゃぴ（スレッド23）
> バージョン: v1.0.1（v1.0.3相当の変更済み。バンプはDB再構築完了後）
> DB構造ドキュメント: `docs/supabase_structure.md`
