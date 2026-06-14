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
| 現在のバージョン | **v0.9.5** |
| APP_VERSION | `src/App.js` → `APP_VERSION = '0.9.5'` |
| version.json | `public/version.json` → `"version": "0.9.5"` |
| package.json | `"version": "0.9.5"` |
| 最終更新日 | 2026年6月14日（土） |

---

## 🏗️ 技術スタック

| レイヤー | 技術 | 状態 |
|----------|------|------|
| フロントエンド | React（Create React App） | ✅ 稼働中 |
| バックエンド | Supabase | ✅ 稼働中 |
| 問題データ | Supabase questionsテーブル | ✅ 548問DB管理 |
| デプロイ | Vercel（GitHub連携・自動デプロイ） | ✅ 稼働中 |
| バージョン管理 | GitHub | ✅ 稼働中（Public） |

### インフラ情報
- GitHub: `nokokoyk-hub/manabi-no-ki`（Public, main）
- Vercel: `manabi-no-ki-kannari-norikos-projects.vercel.app`
- Supabase: `ndqbtfahtjaafroevgwq`（東京リージョン）
- テーブル: user_progress, learning_sessions, questions(548問), answer_history

### questionsテーブル主要カラム
| カラム | 型 | 説明 |
|--------|-----|------|
| question / question_advanced | TEXT | ひらがな版 / 漢字版問題文 |
| options / options_advanced | JSONB | ひらがな版 / 漢字版選択肢 |
| category | TEXT | okurigana / clock 等 |
| explanation | TEXT (nullable) | 不正解時の解説文 v0.9.5〜 |

---

## 📊 問題データ（548問・7教科）

| 教科 | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | 計 |
|------|-----|-----|-----|-----|-----|-----|-----|
| さんすう | 22 | 11 | 20 | 20 | 20 | 20 | 113 |
| こくご | 15 | 15 | 18 | 18 | 30 | 30 | 126 |
| りか | 16 | 7 | 12 | 11 | 10 | 12 | 68 |
| しゃかい | 10 | 10 | 10 | 10 | 10 | 10 | 60 |
| とけい | 13 | 6 | 8 | 8 | 8 | 8 | 51 |
| どうとく | 10 | 10 | 10 | 10 | 10 | 10 | 60 |
| げんそ | 7 | 12 | 12 | 13 | 14 | 12 | 70 |
| **合計** | **93** | **71** | **90** | **90** | **102** | **102** | **548** |

### ミッション出題ルール
- 6教科（さんすう・こくご・りか・しゃかい・とけい・どうとく）からバランスよく8問
- げんそはミッション除外（MISSION_EXCLUDE_SUBJECTS = ['げんそ']）
- 誤答優先: 過去30日の誤答問題を最大40%優先
- フレッシュ化: 直近3日以内の出題を後回し（プール5問未満なら全問使用）

---

## 📝 機能一覧（v0.9.5時点）

### ✅ 実装済み主要機能
- ホーム画面7ボタン構成（算国理社＋とけい・どうとく・げんそ）
- SubjectMenuScreen（教科→カテゴリ階層：こくご→おくりがな/よみかき、げんそ→もんだい/ずかん）
- 表示モード切り替え（ていがくねん/こうがくねん）
- 教科別レベル設定（Lv1〜6、7教科）
- フルスクリーン日跨ぎリセット（setInterval + visibilitychange）
- 着せ替え（8アイテム、ミッション初回クリア時に判定）
- UpdateBanner（localStorage + version.json 2段構え）
- 誤答記録 + 誤答優先出題 + 出題フレッシュ化
- 解説機能（不正解時にexplanation表示、おくりがなLv3に10問サンプル投入済）
- ごほうびパズル + げんそずかん + 保護者モード

### 🔲 未実装（優先順）
1. 解説文の全問追加（随時）🔴
2. PWA化 🔴
3. FukushuScreen改修 🟡
4. 問題追加（りかLv2補強等）🟡
5. v1.0認証・課金（設計書完成済: docs/auth_and_billing_design.md）🟢

---

## 💰 v1.0 課金設計（2026/6/14策定）

フリーミアム月額200円。5日間トライアル→無料(ミッション1日1回)→プレミアム(全機能)。
認証: Googleログイン + マジックリンク + WebView検知案内。
課金: Stripe Checkout（みまもり画面内、保護者PINロック内）。
設計書: `docs/auth_and_billing_design.md`

---

## 🔧 開発ルール

- version.json / APP_VERSION / package.json は同時更新
- `dbToAppFormat`（questionLoader.js）がDB→アプリの唯一の変換ポイント
- DDLは`Supabase:apply_migration`、DMLは`Supabase:execute_sql`
- JSONB列は`'[...]'::jsonb`明示キャスト必須
- 日本語SQL UPDATEは8〜10行バッチが安定
- changelog.htmlは public/ と docs/ の2箇所に配置
- のんはコードに不慣れ→修正はちゃぴ担当、ファイルで渡す
- SubjectMenuScreen: SUBJECT_CATEGORIESにカテゴリ追加で拡張可能
- 解説: explanationカラム（nullable）、NULLなら従来の❌表示のみ

---

> 最終更新: 2026年6月14日（土）JST
> 更新者: ちゃぴ
> バージョン: v0.9.5
