# 🌳 まなびの木

発達障害を持つ不登校のお子さん向け自宅学習アプリ

## 概要

- **対象**: 小学4年生（実質小2レベル）
- **特性対応**: ADHD + LD 複合
- **コンセプト**: 学ぶほどに木が育つ、楽しい自宅学習
- **問題数**: 587問（解説・高学年版解説つき）

## 現在の状態（v1.0.12）

- **本番URL**: https://manabinoki.net （Vercelデプロイ稼働中）
- **Google Play**: v1.0.12で再申請済み・審査待ち（TWA対応）
- **課金**: Stripe（月額200円 / 年間2,100円）
- 詳細な最新状況は `docs/current_state.md` を参照

## 技術スタック

- **フロントエンド**: React 19 (Create React App)
- **バックエンド**: Supabase（認証・DB・実装済み）
- **決済**: Stripe
- **デプロイ**: Vercel（稼働中）
- **アプリ形態**: PWA / TWA（Google Playアプリ対応）
- **分析**: GA4
- **AI問題生成**: 将来的にClaude APIで自動生成予定（現状は手動データ）

## セットアップ

```bash
npm install
npm start
```

`.env` の設定は `env.example` を参照（`REACT_APP_SUPABASE_URL` / `REACT_APP_SUPABASE_ANON_KEY`）。
※ `.env` は `.gitignore` 対象。Vercelではダッシュボードから設定すること。

## ファイル構成

```
src/
├── App.js                    # メインアプリ（画面ルーティング・状態管理）
├── index.js                  # エントリーポイント（Error Boundary）
├── index.css                 # グローバルスタイル・成長演出keyframes
├── constants/
│   ├── colors.js             # カラー定数
│   ├── growthEffects.js      # 成長演出設定
│   ├── learningLevels.js     # レベル定義
│   └── mameMessages.js       # キャラメッセージ
├── components/
│   ├── CharacterDisplay.js   # 汎用キャラ表示（まめ/ロボちゃん切替）
│   ├── MameCharacter.js      # まめキャラ
│   ├── RobotCharacter.js     # ロボちゃんキャラ
│   ├── GrowthEffect.js       # 成長演出パーティクル
│   ├── PinGate.js            # 保護者PIN認証
│   ├── PremiumGate.js        # 有料機能ゲート
│   ├── UpdateBanner.js       # アプデバナー
│   ├── TreeSVG.js            # 木のSVGビジュアル
│   └── StarBurst.js          # 正解演出
├── screens/
│   ├── AuthScreen.js         # ログイン画面
│   ├── HomeScreen.js         # ホーム画面
│   ├── LearningScreen.js     # 学習画面
│   ├── MimamoriScreen.js     # みまもり画面（保護者用）
│   ├── LevelSettingsScreen.js# レベル設定
│   ├── SubjectMenuScreen.js  # 教科メニュー
│   ├── FukushuScreen.js      # 復習画面
│   ├── HarvestScreen.js      # 収穫演出画面
│   ├── CollectionScreen.js   # コレクション一覧
│   ├── ZukanScreen.js        # 図鑑
│   ├── GohoubiScreen.js      # ごほうび画面
│   ├── NamingScreen.js       # 名前設定
│   ├── HowToScreen.js        # 使い方
│   ├── TermsScreen.js        # 利用規約
│   ├── PrivacyScreen.js      # プライバシーポリシー
│   └── TokushohoScreen.js    # 特商法表記
├── lib/
│   ├── supabase.js           # Supabaseクライアント
│   ├── storage.js            # データ永続化（Supabase + localStorage）
│   ├── fruitCollection.js    # 果実コレクション管理
│   ├── gachaData.js          # ガチャデータ定義
│   ├── questionLoader.js     # 問題データ読み込み
│   └── twaDetect.js          # TWA（Google Playアプリ）判定
└── data/
    ├── questions.js          # 問題データ
    ├── levelQuestions.js     # レベル別問題データ
    ├── puzzles.js            # パズルデータ
    └── costumeItems.js       # 衣装アイテムデータ
```

## ドキュメント

- `docs/current_state.md` — プロジェクト現在地（北極星ドキュメント、最新状況はここ）
- `docs/supabase_structure.md` — DB設計書（DB変更時は必ず同時更新）
- `docs/auth_setup_guide.md` / `docs/auth_and_billing_design.md` — 認証・課金まわりの設計

## バージョン管理ルール

- `public/version.json` と `src/App.js` の `APP_VERSION` を同時に更新
- 修正時は該当ファイルのみ変更（全書き換え禁止）

## 開発: のん × ちゃぴ
