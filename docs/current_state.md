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

## 🌱 設計思想

苦手を「だめ」と決めつけず、得意や興味を見つけて伸ばし、自己肯定感を育てるアプリ。
苦手な教科は足元をやわらかく、得意な教科は天井を高くする。
レベル設定は「そのレベルの問題だけ出す」方式で、教科ごとに独立管理。
「かがく」など興味特化型教科はミッションに混ぜず、やりたい子だけが選べる設計。

---

## 🔢 バージョン情報

| 項目 | 値 |
|------|-----|
| 現在のバージョン | **v0.9.0** |
| APP_VERSION | `src/App.js` → `APP_VERSION = '0.9.0'` |
| version.json | `public/version.json` → `"version": "0.9.0"` |
| package.json | `"version": "0.9.0"` |
| 最終更新日 | 2026年6月3日（火） |

---

## 🏗️ 技術スタック

| レイヤー | 技術 | 状態 |
|----------|------|------|
| フロントエンド | React（Create React App） | ✅ 稼働中 |
| バックエンド | Supabase | ✅ 稼働中 |
| 問題データ | Supabase questionsテーブル（v0.8.0〜） | ✅ 250問DB管理 |
| デプロイ | Vercel（GitHub連携・自動デプロイ） | ✅ 稼働中 |
| AI問題生成 | Claude API | 🔲 未着手 |
| バージョン管理 | GitHub | ✅ 稼働中（Public） |

---

## 🌐 インフラ情報

### GitHub
- リポジトリ: `nokokoyk-hub/manabi-no-ki`（Public）
- ブランチ: `main`（本番）
- ワークフロー: ブランチ作成→作業→PR→マージ→ブランチ削除

### Vercel
- プロジェクトID: `prj_NC6rJ3LFMakVQ9cXLCb3zl53xaYm`
- チームID: `team_wLDUprmHVwDKbqydwaFCl5k7`
- 本番URL: `manabi-no-ki-kannari-norikos-projects.vercel.app`

### Supabase
- プロジェクトID: `ndqbtfahtjaafroevgwq`
- リージョン: `ap-northeast-1`（東京）

#### テーブル構成
| テーブル | 用途 | RLS |
|----------|------|-----|
| `user_progress` | 木の成長状態・ストリーク | ✅有効 |
| `learning_sessions` | 学習セッション記録 | ✅有効 |
| `questions` | 問題データ（250問）v0.8.0〜 | ✅有効 |
| `answer_history` | 誤答記録（v0.9.0で作成済み・コード実装は次回） | ✅有効 |

---

## 📁 ファイル構成（v0.9.0時点）

```
manabi-no-ki/
├── public/
│   ├── version.json
│   ├── changelog.html         # 更新履歴（アプリ表示用）
│   └── images/
│       ├── mame/              # キャラ画像15枚（透過PNG）
│       └── puzzles/           # パズル画像3枚
├── src/
│   ├── App.js                 # ルーター + 状態管理
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── storage.js         # データアクセス + localStorage管理
│   │   └── questionLoader.js  # Supabase問題取得 + フォールバック + ミッション除外ロジック
│   ├── constants/
│   │   ├── colors.js          # SUBJECT_COLORS（5教科対応）
│   │   ├── learningLevels.js  # SUBJECT_LEVELS（5教科対応）
│   │   └── mameMessages.js
│   ├── components/
│   │   ├── TreeSVG.js
│   │   ├── ClockSVG.js
│   │   ├── StarBurst.js
│   │   ├── MameCharacter.js   # 15ポーズ + 着せ替えオーバーレイ
│   │   └── UpdateBanner.js
│   ├── screens/
│   │   ├── NamingScreen.js    # なまえ入力
│   │   ├── HomeScreen.js      # 3列ボタン（おくりがな/とけい/かがく）
│   │   ├── LearningScreen.js  # DB非同期読み込み + 5モード対応
│   │   ├── LevelSettingsScreen.js  # 5教科対応
│   │   ├── FukushuScreen.js
│   │   ├── GohoubiScreen.js   # パズル + 着せ替え
│   │   └── MimamoriScreen.js  # 更新履歴リンク + バージョン表示
│   └── data/
│       ├── questions.js       # フォールバック用（ハードコード）
│       ├── levelQuestions.js   # フォールバック用
│       ├── puzzles.js         # パズル定義
│       └── costumeItems.js    # 着せ替えアイテム定義
└── docs/
    ├── current_state.md
    └── changelog.html         # 更新履歴（リポジトリ管理用）
```

---

## 🐕 キャラクター「まめ」

| 項目 | 内容 |
|------|------|
| 名前 | ユーザーがカスタマイズ可能（デフォルト: まめ） |
| 画像数 | 15枚（透過PNG 400x400） |
| ポーズ | happy/heart/question/run/sleep/cheer/flag/cry_happy/touched/medal/jump/eat/sad/relax/dash |
| アニメーション | 12種（float/bounce/jump/tilt/pulse/breathe/shake/spin/sparkle/slideUp/wiggle/bow） |
| コンボ演出 | 2連続→spin、3連続→sparkle+パーティクル、4連続→medal |
| パーフェクト | cry_happy + 特別セリフ |
| タップ反応 | ぽよん |
| 着せ替え | 8アイテム（🎀👑🕶️🌸🎩🧣⭐💖） |

---

## 📝 機能一覧

### ✅ 実装済み
- ペット名カスタマイズ（NamingScreen）
- ホーム画面（木 + キャラ + ストリーク + 3列ボタン）
- 学習画面（Supabase DB読み込み + フォールバック + 5モード対応）
- 教科別レベル設定（Lv1〜6、設定レベルの問題だけ出す・5教科対応）
- ふくしゅう画面（モード単位の弱点推定）
- ごほうびパズル（3×3、9日で完成、アーカイブ）
- 着せ替え（8アイテム、条件達成で自動アンロック）
- コンボ演出 + パーフェクト演出
- みまもり画面 + 更新履歴リンク + バージョン表示
- Supabase問題DB管理（250問・5教科）
- ミッション8問出題
- かがく教科（ミッション除外・専用ボタンからのみ）
- answer_historyテーブル（作成済み・コード実装は次回）

### 🔲 未実装
| 機能 | 優先度 |
|------|--------|
| 誤答記録のコード実装（LearningScreen→answer_history書き込み） | 🔴 高 |
| 復習の問題ごと精密出題 | 🔴 高 |
| 対象年齢設定（ひらがな/漢字切り替え） | 🟡 中 |
| 問題文のルビ（ふりがな）対応 | 🟡 中 |
| 問題文の漢字版（question_advanced列） | 🟡 中 |
| Claude API問題自動生成 | 🟡 中 |
| 音声読み上げ | 🟡 中 |
| 名前変更機能 | 🟢 低 |

---

## 📊 問題データ（Supabase questionsテーブル: 250問）

| 教科 | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | 計 |
|------|-----|-----|-----|-----|-----|-----|-----|
| さんすう | 22 | 11 | 8 | 8 | 8 | 8 | 65 |
| こくご | 7 | 15 | 8 | 8 | 8 | 8 | 54 |
| せいかつ | 7 | 3 | 8 | 8 | 8 | 8 | 42 |
| とけい | 3 | 6 | 8 | 8 | 8 | 8 | 41 |
| かがく | 8 | 8 | 8 | 8 | 8 | 8 | 48 |
| **合計** | **47** | **43** | **40** | **40** | **40** | **40** | **250** |

### ミッション出題ルール
- ミッション: さんすう・こくご・せいかつ・とけい の4教科からバランスよく8問
- かがく: ミッションには含まず、ホーム画面の専用ボタンから5問出題
- MISSION_EXCLUDE_SUBJECTS = ['かがく']（questionLoader.js）

---

## 📐 次回実装予定: 誤答記録＋復習強化

### answer_historyテーブル（✅作成済み）
```
id (UUID), device_id (TEXT), question_id (TEXT), is_correct (BOOLEAN), answered_at (TIMESTAMPTZ)
```
インデックス: device_id, question_id, device_id+is_correct(部分)

### 実装ステップ
1. ~~テーブル作成（Supabase）~~ ✅完了
2. LearningScreenで1問ごとに正誤記録 ← 次回ここから
3. questionLoader.jsに誤答優先出題ロジック
4. FukushuScreen改修

---

## 🔮 今後のロードマップ

### 次回スレッド（優先順）
1. 誤答記録コード実装（LearningScreen→answer_history書き込み）
2. FukushuScreen改修（誤答優先出題）
3. 対象年齢設定 + ルビ対応（フェーズ1: 設定UI）

### 中期（v1.0に向けて）
- 問題文のルビ（ふりがな）共通コンポーネント
- question_advanced列（漢字版問題文）
- Claude API問題自動生成
- みまもり画面の学習分析強化（正答率推移グラフ等）

### 長期
- 音声読み上げ
- 有料化・リリース準備

---

## 📋 お母さんからのフィードバック記録

| 日付 | 内容 | 対応状況 |
|------|------|----------|
| 5/27 | 漢字の送り仮名も作ってほしい | ✅ 実装済み |
| 5/27 | 時計の見方も作ってほしい | ✅ 実装済み |
| 5/29 | 教科ごとにレベルを自由設定したい | ✅ 実装済み |
| 5/29 | 得意を伸ばして自己肯定感を育てる | ✅ 設計思想に反映 |
| 5/30 | キャラの名前を子供がつけられないか | ✅ v0.6.0で実装 |
| 6/1 | ごほうびにパズルピース収集→絵の完成 | ✅ v0.7.1で実装 |

---

## 🔧 開発ルール

- version.json / APP_VERSION / package.json は同時更新
- 画像の事前確認: コードで参照する前にリポジトリに実在確認
- DALL-E画像は透過処理必須（RGB閾値238以上を除去）
- ブランチワークフロー: ブランチ→作業→PR→マージ→削除
- 修正前に影響範囲5ステップ確認
- CI=true でビルドテスト（Vercelと同じ環境）
- のんはコードに不慣れ。修正はちゃぴが担当
- Supabaseダッシュボードは100行ページネーション注意

---

> 最終更新: 2026年6月3日（火）JST
> 更新者: ちゃぴ
> バージョン: v0.9.0
