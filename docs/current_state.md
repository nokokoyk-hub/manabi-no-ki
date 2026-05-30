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
| 学習状況 | 不登校・自宅学習中。進研ゼミ小2教材がフィット |
| 学習教科 | さんすう・こくご・せいかつ・とけい、順次拡張予定 |
| 使用端末 | スマホ（メイン）、iPad（サブ） |
| 依頼元 | のんの親戚のお母さん |
| 開発体制 | のん × ちゃぴ |
| 開発開始日 | 2026年5月27日（火） |

---

## 🌱 設計思想・大切にすること

まなびの木は、苦手を「だめ」と決めつけて矯正するアプリではなく、得意や興味を見つけて伸ばし、自己肯定感を育てるためのアプリとして設計する。

学校では一律に「みんなと同じことができること」が評価されやすいが、発達凸凹のある子には、それがどうしても難しい場面がある。その難しさを否定するのではなく、その子の個性・地形として受け止める。

苦手な教科は足元をやわらかく、得意や興味のある教科は天井を高くする。算数はレベル1から、国語や理科的語彙は高学年相当まで、教科ごとに自由に伸ばせる構造を重視する。

親子ともに健やかでいられるように、「できない」を責めるより、「おもしろい」「得意かも」「もっと知りたい」を入口にする。学習の目的は点数だけではなく、その子が自分を好きでいられる土台を育てること。

---

## 🔢 バージョン情報

| 項目 | 値 |
|------|-----|
| 現在のバージョン | **v0.6.1** |
| APP_VERSION | `src/App.js` → `APP_VERSION = '0.6.1'` ✅ |
| package.json | `"version": "0.6.1"` ✅ |
| version.json | `public/version.json` → `"version": "0.6.1"` ✅ |
| package-lock.json | `0.2.0` ⚠️ 依存関係更新なし。次回npm install時に同期推奨 |
| 最終更新日 | 2026年5月30日（土） |

> ⚠️ version.json と App.js の APP_VERSION と package.json は常に同期させること。

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
| リポジトリ | `nokokoyk-hub/manabi-no-ki`（Public） |
| ブランチ | `main`（本番） |

### Vercel
| 項目 | 値 |
|------|-----|
| プロジェクトID | `prj_NC6rJ3LFMakVQ9cXLCb3zl53xaYm` |
| チームID | `team_wLDUprmHVwDKbqydwaFCl5k7` |
| 本番URL | `manabi-no-ki-kannari-norikos-projects.vercel.app` |
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

> 教科別レベル設定・ペット名はDBスキーマ変更を避けるため端末localStorage保存。復習画面は既存の `learning_sessions` を読み取り、モード単位でおすすめを出す。問題ごとの誤答記録は未実装。

---

## 📁 ファイル構成（v0.6.1時点）

```
manabi-no-ki/
├── public/
│   ├── index.html
│   ├── manifest.json
│   ├── version.json         # 0.6.1
│   ├── favicon.ico
│   ├── robots.txt
│   └── public/images/mame/  # ⚠️ パスが二重
├── src/
│   ├── App.js               # メインルーター + petName管理 + NamingScreen制御
│   ├── index.js
│   ├── index.css
│   ├── lib/
│   │   ├── supabase.js
│   │   └── storage.js        # データアクセス + localStorage設定 + ペット名
│   ├── constants/
│   │   ├── colors.js
│   │   ├── learningLevels.js
│   │   └── mameMessages.js   # 🐕 セリフ集（{name}プレースホルダー対応）
│   ├── components/
│   │   ├── TreeSVG.js
│   │   ├── ClockSVG.js
│   │   ├── StarBurst.js
│   │   ├── MameCharacter.js  # 🐕 キャラコンポ（petName prop対応）
│   │   └── UpdateBanner.js
│   ├── screens/
│   │   ├── NamingScreen.js        # 🐕 なまえ入力画面（v0.6.1新規）
│   │   ├── HomeScreen.js          # ホーム画面（petName対応）
│   │   ├── LearningScreen.js      # 学習画面（petName対応）
│   │   ├── LevelSettingsScreen.js # 教科別レベル設定画面
│   │   ├── FukushuScreen.js       # 復習画面（petName対応）
│   │   └── MimamoriScreen.js
│   └── data/
│       ├── questions.js
│       └── levelQuestions.js
├── docs/
│   ├── current_state.md
│   └── changelog.html
├── package.json
└── package-lock.json
```

### ⚠️ 画像パスの二重問題（既知）
まめ画像が `public/public/images/mame/` に配置されている。コード側で `/public/images/mame/` として参照することで回避中。将来的に `public/images/mame/` に正規化推奨。

---

## 🐕 キャラクター（ペット名カスタマイズ対応）

| 項目 | 内容 |
|------|------|
| デフォルト名 | まめ |
| 名前変更 | ✅ 初回起動時にNamingScreenで子供が命名 |
| 保存方式 | localStorage（`manabi_pet_name` キー） |
| 種類 | 柴犬 |
| 由来 | 「まめにがんばる」の掛け言葉（デフォルト名） |
| ポーズ数 | 5画像 × 12アニメーション（v0.6.1で6種追加） |
| 使用場所 | 全画面（ホーム/学習/復習/レベル設定/ローディング/NamingScreen） |
| セリフ | mameMessages.js（`{name}`プレースホルダーで名前差し替え） |

### NamingScreen フロー
```
初回起動（petName === null）
  → greeting: 「はじめまして！！きみが なまえを きめてくれる？」
  → input: 名前入力（10文字まで）
  → done: 「○○！よろしくね！💖」演出
  → ホーム画面へ
```
> 2回目以降はNamingScreenを表示せず直接ホーム画面。名前変更機能は将来実装予定。

---

## 📝 現在の機能一覧

### ✅ 実装済み

| 機能 | 説明 | ファイル |
|------|------|----------|
| なまえ入力画面 | 初回起動時にキャラ名を子供が命名 | NamingScreen.js |
| ホーム画面 | まなびの木 + キャラ + ストリーク + ボタン群 | HomeScreen.js |
| 学習画面（ミッション） | 5問ランダム出題 + キャラリアクション | LearningScreen.js |
| 教科別レベル設定 | さんすう/こくご/とけい/せいかつをレベル1〜6で個別設定 | LevelSettingsScreen.js |
| レベル別問題出題 | 選択レベル以下の問題から出題 | levelQuestions.js |
| ふくしゅう画面 | 最近14日の学習記録から正解率の低いモードをおすすめ | FukushuScreen.js |
| 送り仮名れんしゅう | 漢字の送り仮名 | questions.js |
| 時計れんしゅう | アナログ時計SVG + 読み取り | ClockSVG.js |
| みまもり画面 | 週間カレンダー + 教科別進捗（実データ） | MimamoriScreen.js |
| 正解演出 | 星ポップアップ + 木の成長 | StarBurst.js |
| 木の成長 | 正答で葉/花/実が増える | TreeSVG.js |
| ADHD+LD対応UI | 丸文字フォント、大ボタン、ひらがな | 全体 |
| Supabaseデータ永続化 | リロードしても学習データが残る | storage.js |
| 更新通知バナー | 新バージョン検知で自動通知 | UpdateBanner.js |

### 🔲 未実装

| 機能 | 現状 | 優先度 | 備考 |
|------|------|--------|------|
| ごほうび画面 | ボタンあり・準備中表示 | 高 | バッジ/スタンプ/キャラの着せ替え等 |
| 問題ごとの誤答記録 | 未実装 | 高 | 復習精度を上げるには必要 |
| Claude API問題自動生成 | 未着手 | 高 | 教科別レベル設定をプロンプトへ渡す |
| 名前変更機能 | 未実装 | 低 | 設定画面から名前を変更できるように |
| 音声読み上げ | 未着手 | 中 | LD対応強化 |
| 理科・社会の問題追加 | 未着手 | 中 | 教科拡張 |
| 有料化（Stripe） | 未着手 | 低 | みまもり強化版でサブスク検討 |

---

## 📊 問題データ

| 教科 | 内容 | 現在の問題レベル | 設定上限 |
|------|------|----------------|----------|
| さんすう | 既存小2相当 + Lv1用1桁問題 | 1〜2 | 6 |
| こくご | 既存読み取り/送り仮名 + Lv4漢字読み | 2・4 | 6 |
| とけい | ちょうど・5分刻み・難問 | 1〜3 | 6 |
| せいかつ | 単位・時間・方角・生き物・季節 | 1〜2 | 6 |

> レベル5〜6は器のみ用意済み。問題自体は今後追加が必要。

---

## 📚 ふくしゅう機能（v0.5.0〜）

### 現在できること
- ホーム画面の「ふくしゅう」カードから FukushuScreen へ遷移
- 過去14日の学習データからモードごとの正解率を計算
- 正解率が低いモードを上に表示
- 復習開始で学習画面へ遷移

### 現在の限界
- 問題ごとの正誤は保存していない（モード単位の弱点推定のみ）
- より精密な復習には回答履歴テーブルが必要

---

## 🗓️ 開発ロードマップ

| フェーズ | 内容 | 状態 | 日付 |
|----------|------|------|------|
| Phase 0 | プロトタイプ作成・GitHub構築 | ✅ 完了 | 5/27 |
| Phase 0.5 | Vercelデプロイ・お母さんプレゼン | ✅ 完了 | 5/28 |
| Phase 1 | Supabase連携（データ永続化） | ✅ 完了 | 5/28 |
| Phase 1.5 | みまもり実データ化・キャラ実装・問題57問 | ✅ 完了 | 5/29 |
| Phase 1.6 | 教科別レベル設定 | ✅ 完了 | 5/29 |
| Phase 1.7 | 教科別レベル上限を6へ拡張 | ✅ 完了 | 5/29 |
| Phase 2.0 | ふくしゅう画面 初回実装 | ✅ 完了 | 5/30 |
| Phase 2.1 | ペット名カスタマイズ（NamingScreen） | ✅ **完了** | **5/30** |
| Phase 2.1.1 | アニメーション強化＋画像透過 | ✅ **完了** | **5/30** |
| Phase 2.2 | ごほうび画面 | 🔲 次候補 | - |
| Phase 2.3 | 問題ごとの誤答記録・精密復習 | 🔲 | - |
| Phase 3 | Claude API問題自動生成 | 🔲 | - |
| Phase 4 | お母さんフィードバック反映（随時） | 🔄 進行中 | - |
| Phase 5 | 有料化検討（Stripe連携） | 🔲 | - |

---

## 🔜 次スレッドでやること（優先順）

### 🔴 高優先
1. **ごほうび画面の実装**
   - 新規: `src/screens/GohoubiScreen.js`
   - バッジ・スタンプ・キャラ着せ替え等
   - App.jsに画面遷移追加、HomeScreenのボタン接続

2. **問題ごとの誤答記録**
   - Supabaseに回答履歴テーブル追加の検討
   - 復習精度向上

3. **Claude API問題自動生成**
   - `src/lib/questionGenerator.js` 新規
   - Vercel環境変数にAPIキー設定

### 🟡 中優先
- 画像パス正規化（public二重問題の解消）
- 音声読み上げ（Web Speech API）
- レベル5〜6問題追加
- 名前変更機能（設定画面から）

### 🟢 低優先
- PWA対応
- カスタムドメイン
- 有料化検討

---

## 🐛 既知の課題・注意事項

1. **画像パス二重: `public/public/images/mame/` → コード側で回避中。画像は透過PNG化済み(v0.6.1)
2. **package-lock.json version未同期**: 次回npm install時に同期推奨
3. **ごほうびはハリボテ**: ボタンあるが準備中表示
4. **デバイスID方式**: 同ブラウザでのみデータ共有。別端末は別データ
5. **ペット名・レベル設定はlocalStorage**: 別端末共有は未対応
6. **レベル5〜6の問題は未整備**: 設定上は選べるが問題が少ない
7. **復習はモード単位**: 問題ごとの誤答記録は未実装
8. **名前変更機能なし**: 初回設定のみ。ブラウザデータ消去で再設定可能

---

## 📋 お母さんからのフィードバック記録

| 日付 | 内容 | 対応状況 |
|------|------|----------|
| 5/27 | 「かわいい！」 | ✅ 好反応 |
| 5/27 | 漢字の送り仮名も作ってほしい | ✅ 実装済み |
| 5/27 | 時計の見方も作ってほしい | ✅ 実装済み |
| 5/29 | 教科ごとにレベルを自由設定したい | ✅ v0.4.0で実装 |
| 5/29 | 学年レベルは6年くらいまで欲しい | ✅ v0.4.1で拡張 |
| 5/29 | 得意を伸ばして自己肯定感を育てることが大事 | ✅ 設計思想に反映 |
| 5/30 | ふくしゅうが準備中なので使えるようにしてほしい | ✅ v0.5.0で実装 |
| 5/30 | キャラの名前を子供自身がつけられないか | ✅ **v0.6.1で実装** |

---

## 🔧 開発ルール

### バージョン管理
- `public/version.json` と `src/App.js` の `APP_VERSION` と `package.json` の `version` を必ず同時更新

### ファイル修正ルール
- 修正前に必ず影響範囲を5ステップで確認
- コードの修正はちゃぴが担当（のんは触らない）
- ファイル分割を維持し、App.js肥大化を防ぐ
- 新画面追加時: Screen作成 → App.jsにimport+ルーティング → HomeScreenにボタン

### 環境変数ルール
- APIキーはVercel環境変数で管理
- anon keyは公開前提、service_role keyは絶対非公開

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

> 最終更新: 2026年5月30日（土）18:00 JST
> 更新者: ちゃぴ
> バージョン: v0.6.1（ペット名カスタマイズ・NamingScreen実装）
