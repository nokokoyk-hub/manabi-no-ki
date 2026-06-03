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

---

## 🔢 バージョン情報

| 項目 | 値 |
|------|-----|
| 現在のバージョン | **v0.8.0** |
| APP_VERSION | `src/App.js` → `APP_VERSION = '0.8.0'` |
| version.json | `public/version.json` → `"version": "0.8.0"` |
| package.json | `"version": "0.8.0"` |
| 最終更新日 | 2026年6月3日（火） |

---

## 🏗️ 技術スタック

| レイヤー | 技術 | 状態 |
|----------|------|------|
| フロントエンド | React（Create React App） | ✅ 稼働中 |
| バックエンド | Supabase | ✅ 稼働中 |
| 問題データ | Supabase questionsテーブル（v0.8.0〜） | ✅ 99問DB管理 |
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
| `questions` | 問題データ（99問）v0.8.0〜 | ✅有効 |
| `answer_history` | 🔲 未作成（誤答記録・次回実装予定） | - |

---

## 📁 ファイル構成（v0.8.0時点）

```
manabi-no-ki/
├── public/
│   ├── version.json
│   └── public/images/
│       ├── mame/          # キャラ画像15枚（透過PNG）
│       └── puzzles/       # パズル画像3枚
├── src/
│   ├── App.js             # ルーター + 状態管理
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── storage.js     # データアクセス + localStorage管理
│   │   └── questionLoader.js  # Supabase問題取得 + フォールバック
│   ├── constants/
│   │   ├── colors.js
│   │   ├── learningLevels.js
│   │   └── mameMessages.js
│   ├── components/
│   │   ├── TreeSVG.js
│   │   ├── ClockSVG.js
│   │   ├── StarBurst.js
│   │   ├── MameCharacter.js   # 15ポーズ + 着せ替えオーバーレイ
│   │   └── UpdateBanner.js
│   ├── screens/
│   │   ├── NamingScreen.js    # なまえ入力
│   │   ├── HomeScreen.js
│   │   ├── LearningScreen.js  # DB非同期読み込み
│   │   ├── LevelSettingsScreen.js
│   │   ├── FukushuScreen.js
│   │   ├── GohoubiScreen.js   # パズル + 着せ替え
│   │   └── MimamoriScreen.js
│   └── data/
│       ├── questions.js       # フォールバック用（ハードコード）
│       ├── levelQuestions.js   # フォールバック用
│       ├── puzzles.js         # パズル定義
│       └── costumeItems.js    # 着せ替えアイテム定義
└── docs/
    ├── current_state.md
    └── changelog.html
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
- ホーム画面（木 + キャラ + ストリーク）
- 学習画面（Supabase DB読み込み + フォールバック）
- 教科別レベル設定（Lv1〜6、設定レベルの問題だけ出す）
- ふくしゅう画面（モード単位の弱点推定）
- ごほうびパズル（3×3、9日で完成、アーカイブ）
- 着せ替え（8アイテム、条件達成で自動アンロック）
- コンボ演出 + パーフェクト演出
- みまもり画面
- Supabase問題DB管理（99問）

### 🔲 未実装
| 機能 | 優先度 |
|------|--------|
| 誤答記録（answer_historyテーブル） | 🔴 高 |
| 復習の問題ごと精密出題 | 🔴 高 |
| Lv3〜6の問題追加 | 🔴 高 |
| Claude API問題自動生成 | 🟡 中 |
| 元素・理科の問題 | 🟡 中 |
| 音声読み上げ | 🟡 中 |
| 名前変更機能 | 🟢 低 |

---

## 📊 問題データ（Supabase questionsテーブル: 99問）

| 教科 | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 |
|------|-----|-----|-----|-----|-----|-----|
| さんすう | 22 | 11 | 0 | 0 | 0 | 0 |
| こくご | 7 | 15 | 0 | 8 | 8 | 8 |
| せいかつ | 7 | 3 | 0 | 0 | 0 | 0 |
| とけい | 3 | 6 | 1 | 0 | 0 | 0 |

※ Lv3, さんすうLv4以上, せいかつLv3以上, とけいLv4以上は問題未整備

---

## 📐 次回実装予定: 誤答記録＋復習強化（設計済み）

### answer_historyテーブル
```
id, device_id, question_id, is_correct, answered_at
```

### 実装ステップ
1. テーブル作成（Supabase）
2. LearningScreenで1問ごとに正誤記録
3. questionLoader.jsに誤答優先出題ロジック
4. FukushuScreen改修

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

---

> 最終更新: 2026年6月3日（火）13:15 JST
> 更新者: ちゃぴ
> バージョン: v0.8.0
