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
| 対象ユーザー | 小学4年生（実質小2レベル）、知的グレー（約2歳の遅れ） |
| 発達特性 | ADHD + LD 複合（推定） |
| 学習状況 | 不登校・自宅学習中。進研ゼミ小2教材がフィット |
| 学習教科 | 全教科（さんすう・こくご・せいかつ 他、順次拡張予定） |
| 使用端末 | スマホ（メイン）、iPad（サブ） |
| 依頼元 | のんの親戚のお母さん |
| 開発体制 | のん × ちゃぴ |
| 開発開始日 | 2026年5月27日（火） |

---

## 🔢 バージョン情報

| 項目 | 値 |
|------|-----|
| 現在のバージョン | **v0.1.1** |
| version.json | `public/version.json` → `"version": "0.1.0"` ※次回更新時に0.1.1に合わせる |
| APP_VERSION | `src/App.js` → `APP_VERSION = '0.1.0'` ※同上 |
| 最終更新日 | 2026年5月28日（水） |

> ⚠️ version.json と App.js の APP_VERSION は常に同期させること

---

## 🏗️ 技術スタック

| レイヤー | 技術 | 状態 |
|----------|------|------|
| フロントエンド | React（Create React App） | ✅ 稼働中 |
| バックエンド | Supabase | 🔲 未着手 |
| デプロイ | Vercel（GitHub連携・自動デプロイ） | ✅ 稼働中 |
| AI問題生成 | Claude API | 🔲 未着手 |
| 決済 | Stripe | 🔲 未着手（将来の有料化時） |
| バージョン管理 | GitHub | ✅ 稼働中 |
| フォント | Rounded Mplus 1c（Google Fonts） | ✅ 稼働中 |

---

## 🌐 インフラ情報

### GitHub
| 項目 | 値 |
|------|-----|
| リポジトリ | `nokokoyk-hub/manabi-no-ki`（Private） |
| URL | https://github.com/nokokoyk-hub/manabi-no-ki |
| ブランチ | `main`（本番） |
| 最新コミット | `d10cfd2` - APP_VERSION未使用警告修正 |

### Vercel
| 項目 | 値 |
|------|-----|
| プロジェクトID | `prj_NC6rJ3LFMakVQ9cXLCb3zl53xaYm` |
| チームID | `team_wLDUprmHVwDKbqydwaFCl5k7` |
| 本番URL | https://manabi-no-ki-kannari-norikos-projects.vercel.app |
| フレームワーク | Create React App（自動検出） |
| デプロイ方式 | GitHub連携（mainプッシュで自動デプロイ） |
| Deployment Protection | OFF（お母さんのスマホでアクセス可能にするため） |
| デプロイ状態 | ✅ READY |

### Supabase（未着手）
- プロジェクト未作成
- 学習データ永続化、ユーザー管理に使用予定

---

## 📁 ファイル構成（v0.1.1時点）

```
manabi-no-ki/
├── public/
│   ├── index.html          # PWA対応、lang="ja"
│   ├── manifest.json        # アプリ名・テーマカラー設定
│   ├── version.json         # バージョン管理
│   ├── favicon.ico
│   └── robots.txt
├── src/
│   ├── App.js               # メインルーター（画面遷移管理）
│   ├── index.js              # エントリーポイント
│   ├── index.css             # グローバルCSS・アニメーション定義
│   ├── constants/
│   │   └── colors.js         # カラー定数・教科別カラー（一括管理）
│   ├── components/
│   │   ├── TreeSVG.js        # 🌳 木のSVGビジュアル（葉/花/実）
│   │   ├── ClockSVG.js       # ⏰ アナログ時計SVG（時計問題用）
│   │   └── StarBurst.js      # 🌟 正解演出オーバーレイ
│   ├── screens/
│   │   ├── HomeScreen.js     # ホーム画面（木・ミッション・練習ボタン）
│   │   ├── LearningScreen.js # 学習画面（モード対応: mission/okurigana/clock）
│   │   └── MimamoriScreen.js # みまもり画面（保護者用・週間記録）
│   └── data/
│       └── questions.js      # 問題データ（19問）+ 取得関数
├── docs/
│   └── current_state.md      # ← このファイル（北極星）
├── .gitignore
├── README.md
└── package.json
```

---

## 📝 現在の機能一覧

### ✅ 実装済み

| 機能 | 説明 | ファイル |
|------|------|----------|
| ホーム画面 | まなびの木 + ストリーク + ミッションボタン | HomeScreen.js |
| 学習画面（ミッション） | 5問ランダム出題、選択肢式 | LearningScreen.js |
| 送り仮名れんしゅう | 漢字の送り仮名を選ぶ（6問） | questions.js, LearningScreen.js |
| 時計れんしゅう | アナログ時計SVG + 読み取り問題（5問） | ClockSVG.js, questions.js |
| みまもり画面 | 週間カレンダー + 教科別進捗 + 励まし | MimamoriScreen.js |
| 正解演出 | 🌟ポップアップ + 木の成長フィードバック | StarBurst.js |
| 木の成長 | 正答で葉/花/実が増えるビジュアル | TreeSVG.js |
| ADHD+LD対応UI | 丸文字フォント、大ボタン、ひらがな中心 | 全体 |

### 🔲 未実装（今後の予定）

| 機能 | 優先度 | 備考 |
|------|--------|------|
| Supabase連携（データ永続化） | 高 | 学習記録の保存、ストリーク維持 |
| Claude API問題自動生成 | 高 | 学年レベル指定で無限に問題生成 |
| ごほうび画面 | 中 | バッジ・スタンプ一覧 |
| ふくしゅう画面 | 中 | 苦手分野の自動検出と復習 |
| 音声読み上げ | 中 | LD対応強化 |
| UDフォント切替 | 低 | BIZ UDゴシック等 |
| 理科・社会の問題追加 | 中 | 教科拡張 |
| 有料化（Stripe） | 低 | みまもり強化版でサブスク検討 |
| PWA対応（オフライン） | 低 | Service Worker設定 |
| カスタムドメイン | 低 | manabi-no-ki.com 等 |

---

## 📊 問題データ構成（v0.1.1時点）

| 教科 | 問題数 | カテゴリ | type |
|------|--------|----------|------|
| さんすう | 4問 | 九九、二桁計算 | text |
| こくご（読み・理解） | 3問 | 主語読取、漢字読み | text |
| こくご（送りがな） | 6問 | 走/読/書/聞/歩/食 | text |
| とけい | 5問 | 時計の読み方 | clock |
| せいかつ | 1問 | 単位（メートル） | text |
| **合計** | **19問** | | |

---

## 🗓️ 開発ロードマップ

| フェーズ | 内容 | 状態 | 日付 |
|----------|------|------|------|
| Phase 0 | プロトタイプ作成・GitHub構築 | ✅ 完了 | 5/27 |
| Phase 0.5 | Vercelデプロイ・お母さんプレゼン | ✅ 完了 | 5/28 |
| Phase 1 | Supabase連携（学習データ保存） | 🔲 次 | - |
| Phase 2 | Claude API問題自動生成 | 🔲 | - |
| Phase 3 | ごほうび・ふくしゅう画面 | 🔲 | - |
| Phase 4 | お母さんフィードバック反映（随時） | 🔄 進行中 | - |
| Phase 5 | 有料化検討（Stripe連携） | 🔲 | - |

---

## 🐛 既知の課題・注意事項

1. **version.json と APP_VERSION のズレ**: 現在 version.json は `0.1.0` のまま。次回更新時に `0.1.1` に合わせる
2. **データは揮発性**: 現在はReact stateのみ。ブラウザリロードで学習データが消える。Supabase連携が急務
3. **問題数が少ない**: 19問のみ。Claude API連携で無限生成が必要
4. **みまもり画面はデモデータ**: 実データではなくハードコードされたサンプル
5. **ごほうび・ふくしゅうは見た目のみ**: ボタンはあるが遷移先なし

---

## 📋 お母さんからのフィードバック記録

| 日付 | 内容 | 対応状況 |
|------|------|----------|
| 5/27 | 「かわいい！」 | ✅ 好反応 |
| 5/27 | 漢字の送り仮名も作ってほしい | ✅ v0.1.1で実装 |
| 5/27 | 時計の見方も作ってほしい | ✅ v0.1.1で実装（アナログ時計SVG付き） |

---

## 🔧 開発ルール

### バージョン管理
- `public/version.json` と `src/App.js` の `APP_VERSION` を必ず同時更新
- コミットメッセージに絵文字＋バージョン番号を含める
- 修正は該当ファイルのみ変更（全書き換え禁止）

### ファイル修正ルール
- 修正前に必ず影響範囲を確認（5ステップ確認）
- コードの修正はちゃぴが担当（のんは触らない）
- ファイル分割を維持し、App.js肥大化を防ぐ

### スレッド引き継ぎ
- スレッド終了時に必ずこのファイルを更新
- 作業ダイジェストを作成
- changelog.htmlに追記内容を作成
- 次回開始時の引き継ぎメモを作成

---

## 🔑 スレッド引き継ぎ用呼び出しテンプレート

```
GitHub docs/current_state.md を正本とし、
これに沿って進めていくことを基本とします。

過去の開発ダイジェストはGoogle Driveに保管されています。
必要な場合のみ参照し、最新状態としては扱わないでください。
最新状態は必ず GitHub の docs/current_state.md を優先してください。

ファイル参照のうえ、よりよい提案、製作を進めること。
```

---

## 📎 関連リンク

- GitHub: https://github.com/nokokoyk-hub/manabi-no-ki
- Vercel: https://manabi-no-ki-kannari-norikos-projects.vercel.app
- Vercelダッシュボード: https://vercel.com/kannari-norikos-projects/manabi-no-ki

---

> 最終更新: 2026年5月28日（水）10:10 JST
> 更新者: ちゃぴ
