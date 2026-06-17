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
| 現在のバージョン | **v0.9.7** |
| APP_VERSION | `src/App.js` → `APP_VERSION = '0.9.7'` |
| version.json | `public/version.json` → `"version": "0.9.7"` |
| package.json | `"version": "0.9.7"` |
| 最終更新日 | 2026年6月18日（水） |

> ※ v0.9.7 は **Google認証（Supabase Auth）+ ログイン画面（AuthScreen.js）追加**のコード変更を含む。

---

## 🏗️ 技術スタック

| レイヤー | 技術 | 状態 |
|----------|------|------|
| フロントエンド | React（Create React App） | ✅ 稼働中 |
| バックエンド | Supabase | ✅ 稼働中 |
| 認証 | Supabase Auth（Google OAuth + マジックリンク） | ✅ 稼働中（v0.9.7〜） |
| 問題データ | Supabase questionsテーブル | ✅ 587問DB管理 |
| デプロイ | Vercel（GitHub連携・自動デプロイ） | ✅ 稼働中 |
| バージョン管理 | GitHub | ✅ 稼働中（Public） |

### インフラ情報
- **独自ドメイン: `manabinoki.net`**（お名前.com取得、Vercelネームサーバー接続、SSL自動）
- GitHub: `nokokoyk-hub/manabi-no-ki`（Public, main）
- Vercel: `manabi-no-ki-kannari-norikos-projects.vercel.app`（旧URL、リダイレクト用に残存）
- Supabase: `ndqbtfahtjaafroevgwq`（東京リージョン）
- GCP: プロジェクト `manabinoki`（OAuth Client ID発行済み）
- テーブル: user_progress, learning_sessions, questions(587問), answer_history

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

---

## 📊 問題データ（587問・7教科）

| 教科 | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | 計 |
|------|-----|-----|-----|-----|-----|-----|-----|
| さんすう | 22 | **20** | 20 | 20 | 20 | 20 | **122** |
| こくご | **20** | **20** | 18 | 18 | 30 | 30 | **136** |
| りか | 16 | **17** | 12 | 11 | 10 | 12 | **78** |
| しゃかい | 10 | 10 | 10 | 10 | 10 | **15** | **65** |
| とけい | 13 | 6 | 8 | 8 | 8 | **13** | **56** |
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

> 6/17に548問で完全制覇達成。6/18に+39問追加、全問フルセット（解説同時投入）のため引き続き100%維持。
> 今後の問題追加時はフルセット（問題文＋選択肢＋解説 × ひらがな＋漢字）で同時投入する。

---

## 🔐 認証（v0.9.7〜）

### 認証方式
| 方式 | 状態 | 技術 |
|------|------|------|
| Googleログイン | ✅ 稼働中 | Supabase Auth（リダイレクト方式） |
| メールログイン（マジックリンク） | ✅ 稼働中 | Supabase Auth（パスワード不要） |

### 認証フロー
- 未ログイン → AuthScreen.js（ログイン画面）表示
- ログイン済み → 既存のホーム画面へ
- WebView検知（LINE/Facebook/Instagram/Yahoo）→ 案内バナー表示
- Googleログイン失敗時 → メールログインへ自動誘導
- supabase未接続（ローカルモード）時は認証スキップ → 既存動作を維持

### 関連設定
- GCP: プロジェクト `manabinoki` → OAuth Client ID
- Supabase: Authentication → Providers → Google ON / Email ON
- Supabase: URL Configuration → Site URL = `https://manabinoki.net`
- Supabase: Redirect URLs = `https://manabinoki.net`, `https://manabinoki.net/**`
- GCP: リダイレクトURI = `https://ndqbtfahtjaafroevgwq.supabase.co/auth/v1/callback`

### ⚠️ 未完了（Phase A-4）
- **device_id → user_id 移行はまだ**。現在はログインできるが、学習データはdevice_idベースのまま。認証安定後に移行する。

---

## 📝 機能一覧（v0.9.7時点）

### ✅ 実装済み主要機能
- **🔐 認証（Googleログイン＋マジックリンク）** ← v0.9.7 NEW
- ホーム画面7ボタン構成（算国理社＋とけい・どうとく・げんそ）
- SubjectMenuScreen（教科→カテゴリ階層：こくご→おくりがな/よみかき、げんそ→もんだい/ずかん）
- 表示モード切り替え（ていがくねん/こうがくねん）
- 教科別レベル設定（Lv1〜6、7教科）
- フルスクリーン日跨ぎリセット（setInterval + visibilitychange）
- 着せ替え（8アイテム、ミッション初回クリア時に判定）
- UpdateBanner（localStorage + version.json 2段構え）
- 誤答記録 + 誤答優先出題 + 出題フレッシュ化
- 解説機能（不正解時に💡黄色カード表示、ひらがな/漢字両面100%完成）
- ごほうびパズル + げんそずかん + 保護者モード

### 🔲 未実装（優先順）
1. **Phase B: 保護者PINロック** 🔴
2. **Phase C: トライアル制限ロジック**（5日間→無料制限）🔴
3. **Phase D: Stripe Checkout連携** 🔴
4. **Phase A-4: device_id → user_id 移行** 🟡
5. PWA化（manifest.jsonは存在するがiconsが空、service worker無し）🟡
6. 利用規約・プライバシーポリシーページ 🟡
7. FukushuScreen改修 🟡
8. 問題追加（とけいLv2補強、りかLv4-5等）🟡
9. UI調整 🟡

---

## ⚠️ 既知の整理候補（バグの温床になる前に）

| 項目 | 内容 | 緊急度 |
|------|------|--------|
| public/public/images 入れ子 | コードが `/public/images/...` 参照のため二重構造。動作はするが本来は `public/images/` が正。PWA整理時に一緒に直すのが理想 | 🟡 |
| changelog v0.9.3 重複 | public/changelog.html に v0.9.3 エントリが2つある（過去の更新ミス）。履歴のため未削除。次回整理候補 | 🟢 |
| デカいファイル | storage.js(22KB)・MimamoriScreen.js(21KB)・LearningScreen.js(18KB)。将来的にファイル分割候補 | 🟡 |
| device_id / user_id 二重管理 | 認証追加によりuser_idが取れるようになったが、storage.jsはまだdevice_idベース。Phase A-4で移行予定 | 🟡 |

### 🩺 品質管理ツール
- **`docs/question_add_checklist.md`** = 問題追加チェックリスト（健康診断キット）
- **セクション9** = 問題追加フルセットテンプレート
- **`docs/auth_setup_guide.md`** = GCP + Supabase 認証設定手順書 ← v0.9.7 NEW

---

## 💰 v1.0 課金設計（2026/6/14策定）

フリーミアム月額200円。5日間トライアル→無料(ミッション1日1回)→プレミアム(全機能)。
認証: ✅ Googleログイン + マジックリンク **実装済み（v0.9.7）**
課金: Stripe Checkout（みまもり画面内、保護者PINロック内）。
設計書: `docs/auth_and_billing_design.md`

### v1.0実装Phase進捗
- [x] **Phase A: 認証基盤** ✅（v0.9.7で完了。A-4移行は別途）
- [ ] Phase B: 保護者PINロック ← **次のステップ**
- [ ] Phase C: トライアル制限ロジック
- [ ] Phase D: Stripe Checkout連携

---

## 🔧 開発ルール

- version.json / APP_VERSION / package.json は同時更新
- **DBコンテンツのみの追加（解説など）はバージョンを上げない**（コード変更がないとUpdateBannerが誤通知するため）
- `dbToAppFormat`（questionLoader.js）がDB→アプリの唯一の変換ポイント
- DDLは`Supabase:apply_migration`、DMLは`Supabase:execute_sql`
- JSONB列は`'[...]'::jsonb`明示キャスト必須
- **日本語SQL UPDATEは8〜10行（レベル単位10問）バッチが安定。CASE WHEN id 方式が安全**
- **changelog.htmlは public/ と docs/ の2箇所に配置。必ず両方同時更新**
- のんはコードに不慣れ→修正はちゃぴ担当、ファイルで渡す
- **問題追加は「フルセット」で**（セクション9テンプレ準拠）: 8カラム同時投入
- **問題を追加・編集したら必ず健康診断SQLを流す**
- **認証関連**: AuthScreen.js（ログイン画面）、App.jsに認証状態管理。supabase未接続時は認証スキップ

---

> 最終更新: 2026年6月18日（水）JST
> 更新者: ちゃぴ
> バージョン: v0.9.7（Google認証導入、独自ドメイン manabinoki.net、問題587問）
