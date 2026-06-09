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
| 現在のバージョン | **v0.9.3** |
| APP_VERSION | `src/App.js` → `APP_VERSION = '0.9.3'` |
| version.json | `public/version.json` → `"version": "0.9.3"` |
| package.json | `"version": "0.9.3"` |
| 最終更新日 | 2026年6月9日（火） |

---

## 🏗️ 技術スタック

| レイヤー | 技術 | 状態 |
|----------|------|------|
| フロントエンド | React（Create React App） | ✅ 稼働中 |
| バックエンド | Supabase | ✅ 稼働中 |
| 問題データ | Supabase questionsテーブル（v0.8.0〜） | ✅ 490問DB管理 |
| デプロイ | Vercel（GitHub連携・自動デプロイ） | ✅ 稼働中 |
| AI問題生成 | Claude API | 🔲 未着手 |
| バージョン管理 | GitHub | ✅ 稼働中（Public） |

---

## 🌐 インフラ情報

### GitHub
- リポジトリ: `nokokoyk-hub/manabi-no-ki`（Public）
- ブランチ: `main`（本番）

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
| `questions` | 問題データ（490問）v0.8.0〜 | ✅有効 |
| `answer_history` | 誤答記録（v0.9.1で実装完了） | ✅有効 |

#### questionsテーブル主要カラム
| カラム | 型 | 説明 |
|--------|-----|------|
| question | TEXT | ひらがな版問題文（ていがくねんモード） |
| question_advanced | TEXT (nullable) | 漢字交じり版問題文（こうがくねんモード）v0.9.3〜 |
| options | JSONB | ひらがな版選択肢 |
| options_advanced | JSONB (nullable) | 漢字交じり版選択肢 v0.9.3〜 |
| category | TEXT | okurigana / clock 等（v0.9.3でclockのNULL修正済） |

---

## 📁 ファイル構成（v0.9.3時点）

```
manabi-no-ki/
├── public/
│   ├── version.json
│   ├── changelog.html
│   └── public/images/
│       ├── mame/              # キャラ画像15枚（透過PNG）
│       ├── puzzles/           # パズル画像3枚
│       └── genso_hyou.png     # 元素周期表（ずかん用）
├── src/
│   ├── App.js                 # ルーター + 状態管理 + displayMode管理
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── storage.js         # データアクセス + displayMode
│   │   └── questionLoader.js  # Supabase問題取得 + 誤答優先出題 + dbToAppFormat（question_advanced/options_advanced対応）
│   ├── constants/
│   │   ├── colors.js
│   │   ├── learningLevels.js
│   │   └── mameMessages.js
│   ├── components/
│   │   ├── TreeSVG.js
│   │   ├── ClockSVG.js
│   │   ├── StarBurst.js
│   │   ├── MameCharacter.js
│   │   └── UpdateBanner.js
│   ├── screens/
│   │   ├── NamingScreen.js
│   │   ├── HomeScreen.js      # 2×3ボタン
│   │   ├── LearningScreen.js  # DB非同期読み込み + 7モード + displayMode漢字切替 + 誤答記録
│   │   ├── LevelSettingsScreen.js
│   │   ├── FukushuScreen.js
│   │   ├── GohoubiScreen.js
│   │   ├── MimamoriScreen.js  # 保護者モード + 表示モード切替UI
│   │   └── ZukanScreen.js
│   └── data/
│       ├── questions.js       # フォールバック用
│       ├── levelQuestions.js   # フォールバック用
│       ├── puzzles.js
│       └── costumeItems.js
└── docs/
    ├── current_state.md
    └── changelog.html
```

---

## 📝 機能一覧

### ✅ 実装済み
- ペット名カスタマイズ（NamingScreen）
- ホーム画面（木 + キャラ + ストリーク + 2×3ボタン）
- 学習画面（Supabase DB読み込み + フォールバック + 7モード対応）
- 教科別レベル設定（Lv1〜6、6教科対応）
- ふくしゅう画面（7モード対応）
- ごほうびパズル（3×3、9日で完成、アーカイブ）
- 着せ替え（8アイテム）
- コンボ演出 + パーフェクト演出
- Supabase問題DB管理（490問・6教科）
- ミッション8問出題（5教科からバランス出題、かがく除外）
- 誤答記録（answer_history書き込み）
- 誤答優先出題（苦手問題を最大40%優先）
- ミッション結果画面
- タブ復帰時の自動日付リセット
- げんそずかん（周期表ビューア）
- 保護者モード全面リニューアル（正答率バー/苦手検出/推移グラフ）
- **表示モード切り替え Phase 1-3 全完了** ← v0.9.3
  - ていがくねん（ひらがな中心）/ こうがくねん（漢字交じり）
  - 設定UI + localStorage永続化
  - question_advanced: 問題文421問の漢字版投入
  - options_advanced: 選択肢304問の漢字版投入
  - NULLフォールバック設計（未設定の問題は従来表示を維持）
- **とけいモードのレベル設定対応** ← v0.9.3
  - category NULL問題修正 + getQuestionsBySubject方式に変更
- **おくりがなモードのレベル固定対応** ← v0.9.3
  - 全問Lv2のため、レベル設定に関わらず全問出題

### 🔲 未実装
| 機能 | 優先度 |
|------|--------|
| フルスクリーン日跨ぎリセット（setInterval方式） | 🔴 高 |
| おくりがな Lv3-6問題追加（約40問） | 🟡 中 |
| FukushuScreen改修（問題単位の精密出題） | 🟡 中 |
| Claude API問題自動生成 | 🟡 中 |
| 音声読み上げ | 🟡 中 |
| 保護者PINロック | 🟢 低 |
| 名前変更機能 | 🟢 低 |

---

## 📊 問題データ（Supabase questionsテーブル: 490問）

| 教科 | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | 計 | 漢字版問題文 | 漢字版選択肢 |
|------|-----|-----|-----|-----|-----|-----|-----|---|---|
| さんすう | 22 | 11 | 20 | 20 | 20 | 20 | 113 | 44 | 19 |
| こくご | 7 | 15 | 8 | 8 | 20 | 20 | 78 | 78 | 4 |
| かがく | 23 | 19 | 24 | 24 | 24 | 24 | 138 | 138 | 126 |
| とけい | 3 | 6 | 8 | 8 | 8 | 8 | 41 | 41 | 39 |
| しゃかい | 10 | 10 | 10 | 10 | 10 | 10 | 60 | 60 | 56 |
| どうとく | 10 | 10 | 10 | 10 | 10 | 10 | 60 | 60 | 60 |
| **合計** | **75** | **71** | **80** | **80** | **92** | **92** | **490** | **421** | **304** |

※ 漢字版が未設定（NULL）の問題 = 計算式のみ・元素記号のみ・読み方テストのひらがな選択肢等 → フォールバックで従来表示

### ミッション出題ルール
- ミッション: さんすう・こくご・とけい・しゃかい・どうとく の5教科からバランスよく8問
- かがく: ミッションには含まず、ホーム画面の専用ボタンから5問出題
- MISSION_EXCLUDE_SUBJECTS = ['かがく']（questionLoader.js）
- 誤答優先出題: 過去30日の誤答問題を最大40%まで優先的に出題

### 問題取得パス（v0.9.3修正済）
| モード | 取得関数 | 備考 |
|--------|----------|------|
| ミッション | getTodayQuestions | 5教科バランス出題 |
| おくりがな | getQuestionsByCategory('okurigana') | こくごLv2固定で渡す |
| とけい | getQuestionsBySubject('とけい') | v0.9.3で修正（旧: categoryベース） |
| さんすう | getQuestionsBySubject('さんすう') | |
| こくご | getQuestionsBySubject('こくご') | |
| かがく | getQuestionsBySubject('かがく') | |
| しゃかい | getQuestionsBySubject('しゃかい') | |
| どうとく | getQuestionsBySubject('どうとく') | |

---

## 🔮 今後のロードマップ

### 次回スレッド（優先順）
1. **フルスクリーン日跨ぎリセット検証・実装**（setInterval方式）
2. おくりがな Lv3-6問題追加（約40問）
3. FukushuScreen改修（問題単位の精密復習）

### 中期（v1.0に向けて）
- Claude API問題自動生成
- 保護者PINロック
- 音声読み上げ

### 長期
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
| 6/5 | 社会や理科も作りたい（のんから） | ✅ v0.9.2で実装 |
| 6/5 | 道徳も入れたい（のんから） | ✅ v0.9.2で実装 |
| 6/7 | ひらがな/漢字切り替えモード（のんから） | ✅ v0.9.3で完了 |

---

## 🔧 開発ルール

- version.json / APP_VERSION / package.json は同時更新
- `dbToAppFormat`（`src/lib/questionLoader.js`）がDB→アプリの唯一の変換ポイント。新カラム追加時は必ずここに追記
- `ALTER TABLE`等のDDL操作は`Supabase:apply_migration`を使用。SELECT/DMLは`Supabase:execute_sql`
- JSONB列へのキャスト: `'[...]'::jsonb`の明示キャストが必要
- 日本語Unicode・絵文字を含むSQL UPDATEは8〜10行単位のCASEバッチが安定
- changelog.htmlは public/ と docs/ の2箇所に同じファイルを配置
- CI=true でビルドテスト（`REACT_APP_SUPABASE_URL=https://test.supabase.co REACT_APP_SUPABASE_KEY=test CI=true npx react-scripts build`）
- のんはコードに不慣れ。修正はちゃぴが担当しファイルで渡す
- Supabaseダッシュボードは100行ページネーション注意→実数確認はSELECT COUNT(*)
- Supabase MCP経由でちゃぴが直接SQL実行可能
- 表示モードの設定値: 'hiragana'（ていがくねん）/ 'kanji'（こうがくねん）

---

> 最終更新: 2026年6月9日（火）JST
> 更新者: ちゃぴ
> バージョン: v0.9.3
