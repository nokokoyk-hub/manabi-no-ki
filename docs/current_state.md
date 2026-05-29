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
| 学習教科 | 全教科（さんすう・こくご・せいかつ・とけい、順次拡張予定） |
| 使用端末 | スマホ（メイン）、iPad（サブ） |
| 依頼元 | のんの親戚のお母さん |
| 開発体制 | のん × ちゃぴ |
| 開発開始日 | 2026年5月27日（火） |

---

## 🔢 バージョン情報

| 項目 | 値 |
|------|-----|
| 現在のバージョン | **v0.3.0** |
| version.json | `public/version.json` → `"version": "0.3.0"` ✅ |
| APP_VERSION | `src/App.js` → `APP_VERSION = '0.3.0'` ✅ |
| package.json | `"version": "0.2.0"` ⚠️ **未同期（0.3.0に合わせること）** |
| 最終更新日 | 2026年5月29日（木） |

> ⚠️ version.json と App.js の APP_VERSION と package.json は常に同期させること

---

## 🏗️ 技術スタック

| レイヤー | 技術 | 状態 |
|----------|------|------|
| フロントエンド | React（Create React App） | ✅ 稼働中 |
| バックエンド | Supabase | ✅ 稼働中（v0.2.0〜） |
| デプロイ | Vercel（GitHub連携・自動デプロイ） | ✅ 稼働中 |
| AI問題生成 | Claude API | 🔲 未着手 |
| 決済 | Stripe | 🔲 未着手（将来の有料化時） |
| バージョン管理 | GitHub | ✅ 稼働中（Public） |
| フォント | Rounded Mplus 1c（Google Fonts） | ✅ 稼働中 |

---

## 🌐 インフラ情報

### GitHub
| 項目 | 値 |
|------|-----|
| リポジトリ | `nokokoyk-hub/manabi-no-ki`（**Public**） |
| URL | https://github.com/nokokoyk-hub/manabi-no-ki |
| ブランチ | `main`（本番） |

### Vercel
| 項目 | 値 |
|------|-----|
| プロジェクトID | `prj_NC6rJ3LFMakVQ9cXLCb3zl53xaYm` |
| チームID | `team_wLDUprmHVwDKbqydwaFCl5k7` |
| 本番URL | https://manabi-no-ki-kannari-norikos-projects.vercel.app |
| フレームワーク | Create React App（自動検出） |
| デプロイ方式 | GitHub連携（mainプッシュで自動デプロイ） |
| Deployment Protection | OFF |
| 環境変数 | `REACT_APP_SUPABASE_URL`, `REACT_APP_SUPABASE_ANON_KEY` 設定済み |

### Supabase
| 項目 | 値 |
|------|-----|
| プロジェクト名 | `manabi-no-ki` |
| プロジェクトID | `ndqbtfahtjaafroevgwq` |
| リージョン | `ap-northeast-1`（東京） |
| URL | `https://ndqbtfahtjaafroevgwq.supabase.co` |

#### テーブル構成
| テーブル | 用途 | RLS |
|----------|------|-----|
| `user_progress` | 木の成長状態・ストリーク・最終学習日 | ✅有効 |
| `learning_sessions` | 学習セッション記録（モード・スコア・日時） | ✅有効 |

---

## 📁 ファイル構成（v0.3.0時点）

```
manabi-no-ki/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── version.json         # バージョン管理（0.3.0）+ 更新通知用
│   ├── favicon.ico
│   ├── robots.txt
│   └── public/images/mame/  # ⚠️ パスが二重！（後述）
│       ├── mame_happy.png   # 🙌 バンザイ・正解時
│       ├── mame_heart.png   # 💖 ミッション完了
│       ├── mame_question.png # ❓ 首かしげ・出題中
│       ├── mame_run.png     # 🏃 走る・ローディング
│       └── mame_sleep.png   # 💤 おやすみ
├── src/
│   ├── App.js               # メインルーター + Supabase連携 + 更新通知
│   ├── index.js
│   ├── index.css             # グローバルCSS + まめアニメーション
│   ├── lib/
│   │   ├── supabase.js       # Supabaseクライアント初期化
│   │   └── storage.js        # データアクセスレイヤー
│   ├── constants/
│   │   ├── colors.js         # カラー定数
│   │   └── mameMessages.js   # 🐕 まめのセリフ集
│   ├── components/
│   │   ├── TreeSVG.js        # 🌳 木のSVG
│   │   ├── ClockSVG.js       # ⏰ アナログ時計SVG
│   │   ├── StarBurst.js      # 🌟 正解演出
│   │   ├── MameCharacter.js  # 🐕 まめコンポーネント
│   │   └── UpdateBanner.js   # 🔄 更新通知バナー
│   ├── screens/
│   │   ├── HomeScreen.js     # ホーム画面（まめ付き）
│   │   ├── LearningScreen.js # 学習画面（まめリアクション付き）
│   │   └── MimamoriScreen.js # みまもり画面（実データ）
│   └── data/
│       └── questions.js      # 問題データ（57問）
├── docs/
│   ├── current_state.md      # ← このファイル（北極星）
│   └── changelog.html
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

### ⚠️ 画像パスの二重問題（既知）
まめ画像が `public/public/images/mame/` に配置されている（publicが二重）。
コード側で `/public/images/mame/` として参照することで回避中。
将来的に `public/images/mame/` に正規化推奨。

---

## 🐕 キャラクター「まめ」

| 項目 | 内容 |
|------|------|
| 名前 | まめ |
| 種類 | 柴犬 |
| 由来 | 「まめにがんばる」の掛け言葉 |
| ポーズ数 | 5種類（happy/heart/question/run/sleep） |
| 使用場所 | ホーム画面、学習画面、ローディング |
| アニメーション | CSS（float/bounce/jump/tilt/pulse/breathe） |
| セリフ | mameMessages.js（シーン別ランダム） |

### まめの使用シーン
| シーン | ポーズ | アニメーション | セリフ |
|--------|--------|--------------|--------|
| ホーム画面 | happy（通常）/ heart（完了後） | ゆらゆら | ランダム応援 |
| ローディング | run | ぴょこぴょこ | - |
| 問題出題中 | question | 首かしげ | 「どれかな〜？」等 |
| 正解！ | happy | ジャンプ | 「すごーい！」等 |
| 不正解 | question | 首かしげ | 「おしい！」等 |

---

## 📝 現在の機能一覧

### ✅ 実装済み

| 機能 | 説明 | ファイル |
|------|------|----------|
| ホーム画面 | まなびの木 + まめ🐕 + ストリーク + ボタン群 | HomeScreen.js |
| 学習画面（ミッション） | 5問ランダム出題 + まめリアクション | LearningScreen.js |
| 送り仮名れんしゅう | 漢字の送り仮名（12問） | questions.js |
| 時計れんしゅう | アナログ時計SVG + 読み取り（10問） | ClockSVG.js |
| みまもり画面 | 週間カレンダー + 教科別進捗（**実データ**） | MimamoriScreen.js |
| 正解演出 | 🌟ポップアップ + 木の成長 | StarBurst.js |
| 木の成長 | 正答で葉/花/実が増える | TreeSVG.js |
| ADHD+LD対応UI | 丸文字フォント、大ボタン、ひらがな | 全体 |
| Supabaseデータ永続化 | リロードしても学習データが残る | lib/storage.js |
| セッション記録 | 毎回の学習結果をDBに保存 | lib/storage.js |
| まめ🐕キャラ | 5ポーズ + CSSアニメーション + 吹き出し | MameCharacter.js |
| 更新通知バナー | 新バージョン検知で自動通知 | UpdateBanner.js |

### 🔲 未実装（ハリボテ・ボタンあり機能なし）

| 機能 | 現状 | 優先度 | 備考 |
|------|------|--------|------|
| **ごほうび画面** | ボタンあり・「じゅんびちゅう」表示 | 高 | バッジ/スタンプ/まめの着せ替え等 |
| **ふくしゅう画面** | ボタンあり・「じゅんびちゅう」表示 | 高 | 苦手分野の自動検出→復習出題 |

### 🔲 未実装（ボタンもまだない）

| 機能 | 優先度 | 備考 |
|------|--------|------|
| Claude API問題自動生成 | 高 | 学年レベル指定で無限に問題生成 |
| 音声読み上げ | 中 | LD対応強化 |
| UDフォント切替 | 低 | BIZ UDゴシック等 |
| 理科・社会の問題追加 | 中 | 教科拡張 |
| 有料化（Stripe） | 低 | みまもり強化版でサブスク検討 |
| PWA対応（オフライン） | 低 | Service Worker設定 |
| カスタムドメイン | 低 | manabi-no-ki.com 等 |

---

## 📊 問題データ構成（v0.3.0時点 / 57問）

| 教科 | 問題数 | 内容 | type | category |
|------|--------|------|------|----------|
| 🔢 さんすう | 15問 | 九九(5)・足し算(3)・引き算(3)・文章題(4) | text | - |
| 📖 こくご（読み） | 10問 | 漢字読み・主語述語・季節 | text | - |
| ✏️ こくご（送りがな） | 12問 | 走/読/書/聞/歩/食/思/話/買/泳/作/遊 | text | okurigana |
| ⏰ とけい | 10問 | ちょうど・5分刻み・難問 | clock | - |
| 🌱 せいかつ | 10問 | 単位・時間・方角・生き物・季節 | text | - |
| **合計** | **57問** | | | |

---

## 🗓️ 開発ロードマップ

| フェーズ | 内容 | 状態 | 日付 |
|----------|------|------|------|
| Phase 0 | プロトタイプ作成・GitHub構築 | ✅ 完了 | 5/27 |
| Phase 0.5 | Vercelデプロイ・お母さんプレゼン | ✅ 完了 | 5/28 |
| Phase 1 | Supabase連携（データ永続化） | ✅ 完了 | 5/28 |
| Phase 1.5 | みまもり実データ化・まめ🐕実装・問題57問・更新通知 | ✅ **完了** | **5/29** |
| Phase 2 | ごほうび画面・ふくしゅう画面 | 🔲 **次ここ** | - |
| Phase 3 | Claude API問題自動生成 | 🔲 | - |
| Phase 4 | お母さんフィードバック反映（随時） | 🔄 進行中 | - |
| Phase 5 | 有料化検討（Stripe連携） | 🔲 | - |

---

## 🔜 次スレッドでやること（優先順）

### 🔴 高優先
1. **ごほうび画面の実装**
   - 新規: `src/screens/GohoubiScreen.js`
   - 内容: バッジ一覧、スタンプ帳、まめの着せ替え等
   - App.jsに画面遷移追加、HomeScreenのボタンにonClick設定
   - Supabaseにバッジ/スタンプ用テーブル追加の可能性あり

2. **ふくしゅう画面の実装**
   - 新規: `src/screens/FukushuScreen.js`
   - 内容: learning_sessionsから苦手分野を検出 → その分野の問題を出題
   - 不正解率の高いモード/問題を優先表示
   - App.jsに画面遷移追加、HomeScreenのボタンにonClick設定

3. **Claude API問題自動生成**
   - 新規: `src/lib/questionGenerator.js`
   - Claude APIキーをVercel環境変数に設定
   - 学年レベル・教科を指定して動的に問題生成
   - Supabaseに生成問題キャッシュ用テーブル追加

### 🟡 中優先
4. **package.json version同期** → `0.3.0`に合わせる（軽微）
5. **画像パス正規化** → `public/public/images/mame/` → `public/images/mame/`
6. **音声読み上げ** → Web Speech APIでLD対応強化
7. **教科追加**（理科・社会）

### 🟢 低優先
8. **PWA対応**
9. **カスタムドメイン**
10. **有料化検討**

---

## 🐛 既知の課題・注意事項

1. **画像パス二重**: `public/public/images/mame/` → コード側で `/public/images/mame/` 参照で回避中
2. **package.json version未同期**: `0.2.0` のまま（v0.3.0に合わせること）
3. **ごほうび・ふくしゅうはハリボテ**: ボタンあるが「じゅんびちゅう」表示のみ
4. **デバイスID方式**: 同ブラウザでのみデータ共有。別端末は別データ
5. **anon keyの安全性**: Supabase anon keyは公開前提。RLS設定済み。service_role keyは絶対にコードに書かないこと

---

## 📋 お母さんからのフィードバック記録

| 日付 | 内容 | 対応状況 |
|------|------|----------|
| 5/27 | 「かわいい！」 | ✅ 好反応 |
| 5/27 | 漢字の送り仮名も作ってほしい | ✅ 実装済み |
| 5/27 | 時計の見方も作ってほしい | ✅ 実装済み |
| - | （追加フィードバック待ち） | 🔲 |

---

## 🔧 開発ルール

### バージョン管理
- `public/version.json` と `src/App.js` の `APP_VERSION` と `package.json` の `version` を必ず同時更新
- version.json を更新すると、古いキャッシュのユーザーに更新通知バナーが表示される

### ファイル修正ルール
- 修正前に必ず影響範囲を5ステップで確認
- コードの修正はちゃぴが担当（のんは触らない）
- ファイル分割を維持し、App.js肥大化を防ぐ
- 新画面追加時: Screen作成 → App.jsにimport+ルーティング → HomeScreenにボタン

### 環境変数ルール
- APIキーはVercel環境変数で管理
- `.env`は`.gitignore`で除外
- anon keyは公開前提、service_role keyは絶対非公開

### GitHub操作（のん向け）
- 新規ファイル: 「Add file」→「Create new file」→ パスを入力（/でフォルダ自動作成）
- 上書き: ファイルを開いて✏️ → 全選択して貼り替え → Commit
- 画像: フォルダに移動してから「Upload files」
- ⚠️ `src/components/` と `src/constants/` を間違えないこと！

### スレッド引き継ぎ
- スレッド終了時に必ずこのファイルを更新
- 作業ダイジェスト・changelog・引き継ぎメモを作成

---

## 📎 関連リンク

- GitHub: https://github.com/nokokoyk-hub/manabi-no-ki
- Vercel: https://manabi-no-ki-kannari-norikos-projects.vercel.app
- Vercelダッシュボード: https://vercel.com/kannari-norikos-projects/manabi-no-ki
- Supabaseダッシュボード: https://supabase.com/dashboard/project/ndqbtfahtjaafroevgwq

---

> 最終更新: 2026年5月29日（木）19:00 JST
> 更新者: ちゃぴ
> バージョン: v0.3.0（まめ🐕キャラ実装・問題57問・更新通知バナー搭載）
