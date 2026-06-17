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
| 現在のバージョン | **v0.9.8** |
| APP_VERSION | `src/App.js` → `APP_VERSION = '0.9.8'` |
| version.json | `public/version.json` → `"version": "0.9.8"` |
| docs/version.json | `docs/version.json` → `"version": "0.9.8"` |
| package.json | `"version": "0.9.8"` |
| 最終更新日 | 2026年6月19日（木） |

> ※ v0.9.8 は **Phase B（保護者PINロック）+ Phase C（トライアル制限）+ GA4 + profilesテーブル新設 + SEO基盤整備 + SMTP開通**を含む。
> ※ 4箇所すべてv0.9.8に統一済み（6/19修正完了）。

---

## 🏗️ 技術スタック

| レイヤー | 技術 | 状態 |
|----------|------|------|
| フロントエンド | React（Create React App） | ✅ 稼働中 |
| バックエンド | Supabase | ✅ 稼働中 |
| 認証 | Supabase Auth（Google OAuth + マジックリンク） | ✅ 稼働中（v0.9.7〜） |
| メール送信 | Resend SMTP（マジックリンク用） | ✅ 稼働中（6/19開通） |
| 問題データ | Supabase questionsテーブル | ✅ 587問DB管理 |
| ユーザー管理 | Supabase profilesテーブル | ✅ 稼働中（v0.9.8〜） |
| デプロイ | Vercel（GitHub連携・自動デプロイ） | ✅ 稼働中 |
| バージョン管理 | GitHub | ✅ 稼働中（Public） |
| アクセス解析 | Google Analytics 4（GA4） | ✅ 稼働中（v0.9.8〜） |
| ユーザー管理シート | Google Sheets + Apps Script | ✅ 稼働中（v0.9.8〜） |
| SEO | OGP・JSON-LD・sitemap・robots | ✅ 設定済み（6/19） |

### インフラ情報
- **独自ドメイン: `manabinoki.net`**（お名前.com取得、Vercelネームサーバー接続、SSL自動）
- **www.manabinoki.net → manabinoki.net にリダイレクト統一**（Vercel Domains設定）
- GitHub: `nokokoyk-hub/manabi-no-ki`（Public, main）
- Vercel: `manabi-no-ki-kannari-norikos-projects.vercel.app`（旧URL、リダイレクト用に残存）
- Supabase: `ndqbtfahtjaafroevgwq`（東京リージョン）
- GCP: プロジェクト `manabinoki`（OAuth Client ID発行済み）
- GA4: 測定ID `G-64GLZZQC24`（プロパティ「まなびの木」）
- テーブル: user_progress, learning_sessions, questions(587問), answer_history, **profiles(v0.9.8〜)**
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
- ⚠️ **Google Search Console未登録**（次回タスク）

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

### profilesテーブル（v0.9.8〜）
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
| メールログイン（マジックリンク） | ✅ 稼働中 | Supabase Auth + Resend SMTP |

### 認証フロー
- 未ログイン → AuthScreen.js（ログイン画面）表示
- ログイン済み → 既存のホーム画面へ
- WebView検知（LINE/Facebook/Instagram/Yahoo）→ 案内バナー表示
- Googleログイン失敗時 → メールログインへ自動誘導
- supabase未接続（ローカルモード）時は認証スキップ → 既存動作を維持
- **認証後のURL末尾 # 残骸を自動クリア（v0.9.8〜）**

### 関連設定
- GCP: プロジェクト `manabinoki` → OAuth Client ID
- Supabase: Authentication → Providers → Google ON / Email ON
- Supabase: URL Configuration → Site URL = `https://manabinoki.net`
- Supabase: Redirect URLs = `https://manabinoki.net`, `https://manabinoki.net/**`
- GCP: リダイレクトURI = `https://ndqbtfahtjaafroevgwq.supabase.co/auth/v1/callback`

---

## 🔒 保護者PINロック（Phase B・v0.9.8〜）

- みまもり画面に入る前に4桁PIN入力を要求
- **初回**: PIN新規設定（2回入力で確認）→ Supabase profiles.guardian_pin に保存
- **2回目以降**: PIN照合 → 成功でみまもり画面表示
- **PIN変更**: 「PINを わすれた / へんこうする」リンクから再設定可能
- ローカルモード時はlocalStorageにフォールバック
- コンポーネント: `src/components/PinGate.js`

---

## 🎫 トライアル制限（Phase C・v0.9.8〜）

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
| みまもり | 🔒 | ✅ | ✅ |
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

## 📝 機能一覧（v0.9.8時点）

### ✅ 実装済み主要機能
- **🔐 認証（Googleログイン＋マジックリンク）** ← v0.9.7
- **🔒 保護者PINロック** ← v0.9.8
- **🎫 トライアル制限（5日→無料→プレミアム）** ← v0.9.8
- **📊 GA4アクセス解析** ← v0.9.8
- **📋 Google Sheets ユーザー管理** ← v0.9.8
- **📧 マジックリンクSMTP（Resend）** ← 6/19開通
- **🔍 SEO基盤（OGP・JSON-LD・sitemap）** ← 6/19設定
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
1. **🤖 キャラクター追加（ロボットくん）** 🔴 ← **次の実装ステップ**
2. **Phase D: Stripe Checkout連携** 🔴
3. **利用規約・プライバシーポリシー・特商法表記ページ** 🔴（課金前に必須）
4. Phase A-4: device_id → user_id 移行 🟡
5. PWA化（アプリアイコン対応） 🟡
6. Google Search Console 登録・サイトマップ送信 🟡
7. Google Play Store 公開（TWA） 🟡
8. FukushuScreen改修 🟡
9. 問題追加（とけいLv2補強、りかLv4-5等） 🟡
10. UI調整 🟡

---

## 🤖 キャラクター計画

### 新キャラ: ロボットくん（仮称）
- 水彩タッチのかわいいロボット。頭にアンテナ、お腹に水色ライト。
- **のんが複数ポーズ・表情を作成中**（通常・考え中・拍手・手振り等）
- 1枚目: アプリアイコン用（数字+双葉付き）
- 2枚目: 透過PNG（アプリ内キャラ用）

### 配置計画
- **ホーム画面**: 木の両脇に「まめ」と「ロボットくん」を配置
- **正解時**: 拍手ポーズ + CSSアニメ（バウンス）
- **不正解時**: 考え中ポーズ
- **出題中**: ランダムでまめ or ロボットくん登場
- CSSアニメーションで軽量に動かす（画像切り替え + 揺れ・跳ね）

### アイコン活用
- ロボットくんの画像をfavicon・PWAアイコン・OG画像にも活用予定

---

## 🚀 ストア公開ロードマップ

| バージョン | 内容 |
|-----------|------|
| **v0.9.9** | キャラクター追加 + UI調整 + 利用規約・プラポリ・特商法ページ |
| **v1.0.0** | Phase D: Stripe Checkout連携 + PWA化 🎉 |
| **v1.0.1〜** | Google Play Store 公開（TWA）+ フィードバック反映 |

> ストア公開には利用規約・プライバシーポリシーが審査で必須。課金ありで出す方が審査やり直し不要。

---

## ⚠️ 既知の整理候補（バグの温床になる前に）

| 項目 | 内容 | 緊急度 |
|------|------|--------|
| public/public/images 入れ子 | コードが `/public/images/...` 参照のため二重構造。動作はするがPWA整理時に一緒に直す | 🟡 |
| changelog v0.9.3 重複 | public/changelog.html に v0.9.3 エントリが2つある。次回整理候補 | 🟢 |
| デカいファイル | App.js(519行)・storage.js(22KB)・MimamoriScreen.js(563行)・LearningScreen.js(18KB)。App.jsは特に肥大化傾向、将来的にファイル分割候補 | 🟡 |
| device_id / user_id 二重管理 | storage.jsはまだdevice_idベース。Phase A-4で移行予定 | 🟡 |
| auth ゴーストユーザー | SMTP テスト時にnokoko333@gmail.com等の未認証ユーザーが大量作成された可能性。要掃除 | 🟢 |

### 🩺 品質管理ツール
- **`docs/question_add_checklist.md`** = 問題追加チェックリスト（健康診断キット）
- **セクション9** = 問題追加フルセットテンプレート
- **`docs/auth_setup_guide.md`** = GCP + Supabase 認証設定手順書

---

## 💰 v1.0 課金設計（2026/6/14策定）

フリーミアム月額200円。5日間トライアル→無料(ミッション1日1回)→プレミアム(全機能)。
認証: ✅ Googleログイン + マジックリンク **実装済み（v0.9.7）**
PIN: ✅ 保護者PINロック **実装済み（v0.9.8）**
トライアル制限: ✅ 自動切り替え **実装済み（v0.9.8）**
SMTP: ✅ Resend経由マジックリンク **開通済み（6/19）**
課金: Stripe Checkout（みまもり画面内、保護者PINロック内）。
設計書: `docs/auth_and_billing_design.md`

### v1.0実装Phase進捗
- [x] **Phase A: 認証基盤** ✅（v0.9.7）
- [x] **Phase B: 保護者PINロック** ✅（v0.9.8）
- [x] **Phase C: トライアル制限ロジック** ✅（v0.9.8）
- [ ] **Phase D: Stripe Checkout連携** ← **次のステップ**
- [ ] Phase A-4: device_id → user_id 移行（別途）

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

---

> 最終更新: 2026年6月19日（木）JST
> 更新者: ちゃぴ
> バージョン: v0.9.8（Phase B+C完了、GA4導入、profilesテーブル新設、Google Sheets連携、SMTP開通、SEO基盤整備）
