# 🌳 まなびの木

発達障害を持つ不登校のお子さん向け自宅学習アプリ

## 概要
- **対象**: 小学4年生（実質小2レベル）
- **特性対応**: ADHD + LD 複合
- **コンセプト**: 学ぶほどに木が育つ、楽しい自宅学習

## 技術スタック
- **フロントエンド**: React (Create React App)
- **バックエンド**: Supabase（予定）
- **デプロイ**: Vercel（予定）
- **AI問題生成**: Claude API（予定）

## セットアップ♪
```bash
npm install
npm start
```

## ファイル構成
```
src/
├── App.js              # メインルーター
├── index.js            # エントリーポイント
├── index.css           # グローバルスタイル
├── constants/
│   └── colors.js       # カラー定数
├── components/
│   ├── TreeSVG.js      # 木のSVGビジュアル
│   └── StarBurst.js    # 正解演出
├── screens/
│   ├── HomeScreen.js   # ホーム画面
│   ├── LearningScreen.js # 学習画面
│   └── MimamoriScreen.js # みまもり画面（保護者用）
└── data/
    └── questions.js    # 問題データ（サンプル）
```

## バージョン管理ルール
- `public/version.json` と `src/App.js` の `APP_VERSION` を同時に更新
- 修正時は該当ファイルのみ変更（全書き換え禁止）

## 開発: のん × ちゃぴ
