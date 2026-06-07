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
| 現在のバージョン | **v0.9.2** |
| APP_VERSION | `src/App.js` → `APP_VERSION = '0.9.2'` |
| version.json | `public/version.json` → `"version": "0.9.2"` |
| package.json | `"version": "0.9.2"` |
| 最終更新日 | 2026年6月7日（土） |

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
| `questions` | 問題データ（490問）v0.8.0〜 | ✅有効 |
| `answer_history` | 誤答記録（v0.9.1で実装完了） | ✅有効 |

---

## 📁 ファイル構成（v0.9.2時点）

```
manabi-no-ki/
├── public/
│   ├── version.json
│   ├── changelog.html         # 更新履歴（アプリ表示用）
│   └── public/images/
│       ├── mame/              # キャラ画像15枚（透過PNG）
│       ├── puzzles/           # パズル画像3枚
│       └── genso_hyou.png     # 元素周期表（ずかん用）
├── src/
│   ├── App.js                 # ルーター + 状態管理 + タブ復帰リセット + displayMode管理
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── storage.js         # データアクセス + recordAnswer + getWeakQuestions + getSubjectAccuracy + getDailyAccuracyTrend + displayMode
│   │   └── questionLoader.js  # Supabase問題取得 + 誤答優先出題(40%) + ミッション除外
│   ├── constants/
│   │   ├── colors.js          # SUBJECT_COLORS（6教科対応）
│   │   ├── learningLevels.js  # SUBJECT_LEVELS（6教科対応）
│   │   └── mameMessages.js
│   ├── components/
│   │   ├── TreeSVG.js
│   │   ├── ClockSVG.js
│   │   ├── StarBurst.js
│   │   ├── MameCharacter.js   # 15ポーズ + 着せ替えオーバーレイ
│   │   └── UpdateBanner.js
│   ├── screens/
│   │   ├── NamingScreen.js    # なまえ入力
│   │   ├── HomeScreen.js      # 2×3ボタン（おくりがな/とけい/しゃかい/どうとく/かがく/げんそずかん）
│   │   ├── LearningScreen.js  # DB非同期読み込み + 7モード + 結果画面 + 誤答記録
│   │   ├── LevelSettingsScreen.js  # 6教科対応
│   │   ├── FukushuScreen.js   # 7モード対応（しゃかい/どうとく追加）
│   │   ├── GohoubiScreen.js   # パズル + 着せ替え
│   │   ├── MimamoriScreen.js  # 保護者モード（正答率バー/苦手検出/推移グラフ/表示モード切替）
│   │   └── ZukanScreen.js     # 元素周期表ビューア（タップズーム対応）
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
- ホーム画面（木 + キャラ + ストリーク + 2×3ボタン）
- 学習画面（Supabase DB読み込み + フォールバック + 7モード対応）
- 教科別レベル設定（Lv1〜6、設定レベルの問題だけ出す・6教科対応）
- ふくしゅう画面（7モード対応）
- ごほうびパズル（3×3、9日で完成、アーカイブ）
- 着せ替え（8アイテム、条件達成で自動アンロック）
- コンボ演出 + パーフェクト演出
- Supabase問題DB管理（490問・6教科）
- ミッション8問出題（5教科からバランス出題、かがく除外）
- かがく教科（ミッション除外・専用ボタンからのみ）
- しゃかい教科（ミッションに含む + 専用ボタン） ← v0.9.2
- どうとく教科（ミッションに含む + 専用ボタン） ← v0.9.2
- 誤答記録（answer_history書き込み） ← v0.9.1
- 誤答優先出題（苦手問題を最大40%優先） ← v0.9.1
- ミッション結果画面（スコア表示+ホームに戻る） ← v0.9.1
- 不正解でも次の問題に進む ← v0.9.1
- タブ復帰時の自動日付リセット ← v0.9.1
- げんそずかん（周期表ビューア・タップズーム対応） ← v0.9.1
- **保護者モード全面リニューアル** ← v0.9.2
  - 週間サマリー（学習日数・問題数・ストリーク）
  - 週間カレンダー（問題数表示）
  - 教科別正答率バー（answer_historyベース）
  - 苦手ポイント自動検出
  - 正答率推移グラフ（SVG折れ線14日間）
  - レベル設定への導線
- **表示モード切り替え Phase 1** ← v0.9.2
  - ていがくねん（ひらがな中心）/ こうがくねん（漢字交じり）
  - 設定UI + localStorage永続化

### 🔲 未実装
| 機能 | 優先度 |
|------|--------|
| 表示モード Phase 2: question_advancedカラム + 切替表示 | 🔴 高 |
| 表示モード Phase 3: 490問の漢字版作成 | 🔴 高 |
| FukushuScreen改修（問題単位の精密出題） | 🟡 中 |
| Claude API問題自動生成 | 🟡 中 |
| 音声読み上げ | 🟡 中 |
| 保護者PINロック | 🟢 低 |
| 名前変更機能 | 🟢 低 |

---

## 📊 問題データ（Supabase questionsテーブル: 490問）

| 教科 | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | 計 |
|------|-----|-----|-----|-----|-----|-----|-----|
| さんすう | 22 | 11 | 20 | 20 | 20 | 20 | 113 |
| こくご | 7 | 15 | 8 | 8 | 20 | 20 | 78 |
| かがく | 23 | 19 | 24 | 24 | 24 | 24 | 138 |
| とけい | 3 | 6 | 8 | 8 | 8 | 8 | 41 |
| しゃかい | 10 | 10 | 10 | 10 | 10 | 10 | 60 |
| どうとく | 10 | 10 | 10 | 10 | 10 | 10 | 60 |
| **合計** | **75** | **71** | **80** | **80** | **92** | **92** | **490** |

### ミッション出題ルール
- ミッション: さんすう・こくご・とけい・しゃかい・どうとく の5教科からバランスよく8問
- かがく: ミッションには含まず、ホーム画面の専用ボタンから5問出題
- MISSION_EXCLUDE_SUBJECTS = ['かがく']（questionLoader.js）
- 誤答優先出題: 過去30日の誤答問題を最大40%まで優先的に出題

---

## 🔮 次回実装予定: 表示モード切り替え Phase 2-3

### Phase 2: DB拡張 + 表示切替
1. questionsテーブルに `question_advanced` カラム追加（TEXT, nullable）
2. LearningScreen.jsで displayMode === 'kanji' の場合 question_advanced を優先表示
3. question_advancedが空の問題は従来のquestion（ひらがな）にフォールバック

### Phase 3: 490問の漢字版作成
- ちゃぴがSQLで一気にUPDATE
- 教科ごとにバッチ処理
- フォールバック設計により段階的に対応可能

---

## 🔮 今後のロードマップ

### 次回スレッド（優先順）
1. 表示モード Phase 2-3（question_advanced + 漢字版問題文）
2. FukushuScreen改修（問題単位の精密復習）

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
| 6/7 | ひらがな/漢字切り替えモード（のんから） | 🔲 Phase 1完了・Phase 2-3次回 |

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
- 問題の正解が曖昧にならないよう注意（「革」「歩」問題の教訓）
- Supabase MCP経由でちゃぴが直接SQL実行可能（のんの手間削減）
- changelog.htmlは public/ と docs/ の2箇所に同じファイルを配置

---

> 最終更新: 2026年6月7日（土）JST
> 更新者: ちゃぴ
> バージョン: v0.9.2
