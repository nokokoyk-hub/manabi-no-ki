# 🌳 まなびの木 - プロジェクト現在地（北極星ドキュメント）
## 最終更新: 2026/07/11 Google Play起動不具合対応

---

## 📌 基本情報

| 項目 | 値 |
|---|---|
| バージョン | v1.0.12 |
| 本番URL | https://manabinoki.net |
| GitHub | https://github.com/nokokoyk-hub/manabi-no-ki (Public) |
| Supabase | Project ID: `ndqbtfahtjaafroevgwq`（Pro組織・ACTIVE_HEALTHY） |
| Vercel | Project: `manabi-no-ki` / Team: `team_wLDUprmHVwDKbqydwaFCl5k7` |
| GA4 | G-64GLZZQC24 |
| Stripe | 月額200円 + 年間2,100円 |
| Google Play | 初回審査で読み込み問題を指摘。v1.0.12コード修正済み・新AABで再申請待ち |

---

## 👥 ユーザー状況

- auth.users: 9件（まなびの木タグ付きは5件: のん2 + raffaele + asami + info用）
- soul-backup: 3名（隔離管理必須）
- 実ユーザー: raffaele含む外部ユーザーあり

---

## 📊 コンテンツ状況

- questions: 587問
- 解説（explanation）: 587問（100%）
- こうがくねん版解説（explanation_advanced）: 587問（100%）

---

## 🗂️ ファイル構造（主要ファイル）

```
src/
├── index.js                        # v1.0.12: React起動Error Boundary（白画面防止・再読み込み導線）
├── App.js                          # メインアプリ（画面ルーティング・状態管理・growthEvent）
├── lib/
│   ├── supabase.js                 # Supabaseクライアント（v1.0.12: getSession 8秒タイムアウト）
│   ├── storage.js                  # データ永続化（Supabase + localStorage）
│   ├── fruitCollection.js          # 果実コレクション管理（v1.0.4: Supabase同期対応）
│   ├── gachaData.js                # ガチャデータ定義（43種）
│   └── twaDetect.js                # ★v1.0.6新規: TWA（Google Playアプリ）判定
├── screens/
│   ├── AuthScreen.js               # ログイン画面
│   ├── HomeScreen.js               # ホーム画面（v1.0.5: 成長演出統合・葉表示廃止）
│   ├── LearningScreen.js           # 学習画面
│   ├── MimamoriScreen.js           # みまもり画面（v1.0.6: TWA課金出し分け）
│   ├── HarvestScreen.js            # 収穫演出画面
│   ├── CollectionScreen.js         # コレクション一覧
│   ├── FukushuScreen.js            # 復習画面
│   ├── GohoubiScreen.js            # ごほうび画面
│   ├── SubjectMenuScreen.js        # 教科メニュー
│   ├── LevelSettingsScreen.js      # レベル設定
│   ├── NamingScreen.js             # 名前設定
│   ├── ZukanScreen.js              # 元素図鑑
│   ├── TermsScreen.js              # 利用規約（v1.0.4: 年間プラン追記済み）
│   └── TokushohoScreen.js          # 特商法表記（v1.0.4: 年間プラン追記済み）
├── components/
│   ├── CharacterDisplay.js         # 汎用キャラ表示（まめ/ロボちゃん切替）
│   ├── MameCharacter.js            # まめキャラ（16ポーズ）
│   ├── RobotCharacter.js           # ロボちゃんキャラ
│   ├── GrowthEffect.js             # ★v1.0.5新規: 成長演出パーティクル
│   ├── PinGate.js                  # 保護者PIN認証
│   ├── PremiumGate.js              # 有料機能ゲート（v1.0.6: TWA課金出し分け）
│   └── UpdateBanner.js             # アプデバナー
├── constants/
│   ├── colors.js                   # 色定義
│   ├── mameMessages.js             # キャラメッセージ
│   ├── learningLevels.js           # レベル定義
│   └── growthEffects.js            # ★v1.0.5新規: 成長演出設定（一元管理）
├── index.css                       # v1.0.5: 成長演出keyframes追加
public/
├── index.html                      # ★v1.0.5: 静的LP埋め込み（SEO対策）
├── howto.html / terms.html / privacy.html / changelog.html
├── sitemap.xml                     # 5URL版
├── robot-icon-512.png              # PWAアイコン
├── og-image.png                    # OGP画像（1200×630）
├── version.json
docs/
├── current_state.md                # ★この文書（北極星）
├── supabase_structure.md           # DB設計書（DB変更時は同時更新必須）
└── version.json
```

---

## 🎬 成長演出システム（v1.0.5新規）

- **設定は `src/constants/growthEffects.js` で一元管理**（duration・セリフ・ポーズ・粒子を数値/文字変更だけで調整可能）
- `GROWTH_FX_ENABLED = false` で全演出OFF可能
- App.js: 成長判定時に `growthEvent` state（'leaf'|'flower'|'fruit'）をセット、優先度 fruit > flower > leaf
- HomeScreen: growthEvent受信→演出再生→duration後に自動終了・`onGrowthEventEnd()`でクリア
- 演出内容: 葉=木ぽよん2秒 / 花=キラキラ2.5秒 / 実=ドドーン3秒 + キャラポーズ切替 + セリフ
- keyframes: index.cssの tree-bounce / tree-shimmer / tree-boom / growth-particle

## 🌳 木の表示仕様（v1.0.5変更）

- **TreeSVG.js: BASE_LEAVES = 5**（表示葉 = 5 + 内部カウンター、最大10）→ 木が常に緑
- HomeScreenのステータス表示は**花と実のみ**（葉の枚数は非表示・裏方カウンター扱い）

---

## 🍎 果実コレクション・ガチャ仕様

### 成長サイクル（Bプラン）
- ミッション完了→葉+1、葉2枚→花+1、花2つ→実+1（4ミッション=果実1個）
- ミッション以外（教科練習・復習）では木は育たない
- 数値調整はApp.js handleLearningComplete内の1箇所

### ガチャ仕様
- 計43種: フルーツ37種 + キャラ6体
- レアリティ: ノーマル13種(50%) / レア6種(30%) / SR11種(15%) / レジェンド7種(5%)
- ガチャ専用キャラ6体: ももぴ🐰(SR)・ひめにゃ🐱(Legend)・にじぴよ🐥(Rare)・ライドラ🐉(Legend)・ガーディ🤖(SR)・ぽっけ🦊(Rare)

### データ同期（v1.0.4）
- Supabase優先 + localStorageフォールバック（profiles.fruit_collection jsonb）
- 初回ログイン時に自動マイグレーション・複数端末マージ対応
- このパターンが他のlocalStorage移行の雛形

---

## 💰 課金システム

- トライアル: 5日間（全機能開放）
- 月額プラン: 200円（Payment Link: `https://buy.stripe.com/14A4gz3lY3vl2QZ8pt6AM00`）
- 年間プラン: 2,100円（Payment Link: `https://buy.stripe.com/8x214n2hUaXNezHfRV6AM01`）
- Stripe Webhook → subscription_status自動更新

### 📱 TWA課金ポリシー対応（v1.0.6新規・重要！）
- **Google Play配信アプリ内から外部決済誘導はポリシー違反** → 「消費専用アプリ」方式を採用
- `src/lib/twaDetect.js` の `isTwa()` で起動経路判定（document.referrer が android-app:// → sessionStorageに保存）
- **⚠️ localStorage は使わない**（TWAとChromeブラウザで共有されるため事故る。sessionStorageはタブ単位で安全）
- TWA時の表示: PremiumGate（プランカード→案内文言）/ MimamoriScreen trial・free（ボタン→案内文言）/ premium（ポータルボタン→案内文言）
- 文言はURL記載OK・**タップ可能リンクはNG**（Netflixと同じ方式）
- Web版・PWA版は従来どおり課金ボタン表示
- ロールバック: isTwa()を `return false` 固定にするだけ
- 参考: Google 2026/3発表で外部課金解禁の流れあり（豪・EEA・英・米で2026/9/30〜）。日本適用後は方式再検討可

---

## 🌐 SEO戦略（v1.0.5強化）

- **index.html の `<div id="root">` 内に静的LPコンテンツ埋め込み済み**（Googlebot対策・Reactマウントで自動置換）
- LP内容: 特徴4つ（無学年式・木育成・200円・みまもり）+ 7教科 + 料金 + 静的ページリンク
- キーワード戦略: 「**無学年式**」「小学生向け学習アプリ」「月額200円」軸（title/description/JSON-LD更新済み）
- **競合注意**: manabinoki.org（鎌倉NPO・小学生対象）/ manabinoki.com（茨城の塾）が「まなびのき」検索上位 → 名前正面勝負は避け「アプリ」軸で差別化
- 静的HTMLページ: howto / terms / privacy / changelog + sitemap.xml（5URL）
- Search Console: httpsプロパティ登録済み。**インデックス未反映（7/2時点 site:検索0件）** → のんがURL検査で5URLのインデックス登録リクエスト実行推奨
- 次回チェック: 7/9頃に site:manabinoki.net を再確認

---

## 🛡️ セキュリティ（スレッド30対応完了）

- ✅ auth.users露出ビュー3件DROP（manabi_user_view / orphan_user_view / soul_user_management_view）→ CRITICAL解消
- ✅ delete_manabi_user / handle_new_user のEXECUTE権限をanon・authenticated・PUBLICからREVOKE（service_role・postgresのみ）
- ✅ 全関数に SET search_path = public 設定
- ユーザー一覧確認: Supabaseダッシュボード Authentication→Users、またはちゃぴにMCP依頼
- 残タスク: 漏洩パスワード保護の有効化（ダッシュボード設定・実害ほぼなし・任意）

---

## 📸 ストア申請アセット（スレッド30完成）

| アセット | 規格 | 状態 |
|---|---|---|
| screenshot1_9x16.png（イメージイラスト） | 1080×1920 | ✅ |
| screenshot2_home.png 〜 screenshot6_mimamori.png | 1080×1920 ×5枚 | ✅ |
| feature_graphic_lesser.png（れっさー版採用） | 1024×500 | ✅ |
| playstore_icon_512.png（フルブリード加工済み） | 512×512 | ✅ |

→ のんがローカル保管。掲載順: イラスト→ホーム→さんすう→レベル設定→コレクション→みまもり

---

## 📱 localStorage依存データ一覧と移行状況

| データ | localStorageキー | Supabase移行 |
|---|---|---|
| fruit_collection | manabi_fruit_collection | ✅ v1.0.4完了 |
| subject_levels | manabi_subject_levels | ❌ 未移行 |
| pet_name | manabi_pet_name | ❌ 未移行 |
| robot_name | manabi_robot_name | ❌ 未移行 |
| selected_character | manabi_selected_character | ❌ 未移行 |
| puzzle | manabi_puzzle | ❌ 未移行 |
| costume | manabi_costume | ❌ 未移行 |
| display_mode | manabi_display_mode | ❌ 未移行 |

---

## 🐛 既知のバグ・修正済み

### v1.0.12でコード対応済み（Android新規インストール再確認待ち）
- ✅ Google Play審査環境で、クリーム色の起動画面から先へ進まない可能性に対し、`supabase.auth.getSession()`へ8秒のタイムアウトを追加。
- ✅ セッション確認がreject・例外・タイムアウトになっても、未ログイン状態としてログイン画面へ進むフォールバックを追加。
- ✅ React描画中の致命的エラーを`BootErrorBoundary`で捕捉し、白画面ではなく再読み込み画面を表示。
- ✅ 起動診断状態は`sessionStorage`に保存し、TWAとChrome間で状態を持ち越さない。
- ⚠️ 根本原因は認証セッション確認の未応答が主要候補。新AABの新規インストール起動で最終確認する。

### v1.0.11で対応済み
- ✅ ホーム画面の「まなびの木」表示をタップ/クリックしてもトップへ戻れない導線不足を修正。ロゴ表示をアクセシブルなボタン化し、ホーム画面上部へスムーズスクロールするようにした。


### v1.0.5〜v1.0.6で対応済み
- ✅ 木が丸坊主に見える（BASE_LEAVES=5で常時緑化）
- ✅ 成長が無言で気づかれない（成長演出追加）
- ✅ TWA内からの外部決済誘導＝Play審査リジェクト要因（twaDetectで出し分け）
- ✅ 特商法・利用規約のReact画面に年間プラン記載漏れ（追記済み）
- ✅ Googlebotがトップページを読めない（LP埋め込み）
- ✅ Supabaseセキュリティ警告CRITICAL（ビューDROP・権限修正）

### v1.0.4で修正済み
- ✅ 木の成長が教科練習でも発生 / みまもり日付ズレ / カレンダーアイコン固定「17」/ USER_LOCAL_KEYS漏れ 他

---

## 📋 次回タスク（優先順）

### Phase 1: Google Play再申請（最優先）
1. ✅ TWAビルド・`assetlinks.json`設置・初回Play申請まで完了
2. ✅ v1.0.12 起動安全網を実装（PR #19）
3. 🔨 **PWABuilderで新AABを作成**（versionCodeを前回より増やす）
4. 🧪 **Androidエミュレーターでアプリ削除→新規インストール起動を確認**
5. 🚀 Play Consoleへ新AABをアップロードし、読み込み問題の修正版として再申請

### Phase 2: 品質向上
6. 💰 年間プラン実決済テスト
7. 🔍 Search Consoleインデックス経過確認（7/9頃 site:検索）+ URL検査リクエスト（のん未実施なら）
8. 🔐 Googleバッジ取得申請
9. 📊 他のlocalStorage→Supabase移行（subject_levels優先・fruitCollectionパターン）

### Phase 3: 機能拡張
10. 🎰 ガチャキャラを先生として選択可能に
11. 🍎 App Store（iOS）展開検討（Google Play安定後。Apple Developer $99/年・Mac必要・ラッパー審査4.2リスクあり。当面はiOS PWA「ホーム画面に追加」で代替）
12. 📉 成長サイクル調整（ユーザーFBに基づき growthEffects.js / App.js の数値変更）

---

## ⚠️ 開発ルール・注意事項

### バージョンバンプ（4箇所同期）
1. `src/App.js` → `APP_VERSION = 'x.x.x'`
2. `package.json` → `"version": "x.x.x"`（※package-LOCK.jsonではない！）
3. `public/version.json`
4. `docs/version.json`

### DB変更チェックリスト
- カラム追加 → storage.js反映 + 関連ファイル確認
- RLS変更 → storage.js + App.js + PinGate.js動作確認
- **docs/supabase_structure.md を必ず同時更新**

### 画像・スクショ
- ChatGPT生成画像はRGBモード → flood-fill背景除去必須
- GitHub Web UI一括アップは5〜6枚ずつ + 目視確認
- **スクショはLINE/メール経由禁止（自動圧縮される）→ 写真アプリから直接アップ**
- Google Playスクショは「最大辺≦最小辺×2」制約 → iPhoneスクショ(19.5:9)はちゃぴが1080×1920に変換

### デプロイ
- 複数ファイル変更時の中間ERRORは正常挙動
- import依存のある新規ファイルは**同時1コミット必須**
- mainに直接pushが確実 / 確認はVercel list_deployments

### 日付処理
- toISOString / toLocaleDateString 禁止 → **toSafeDateStr() パターン**（MimamoriScreen.jsに定義）

### TWA関連（v1.0.6〜）
- TWA判定にlocalStorage使用禁止（Chromeと共有）→ sessionStorage
- TWA内に外部決済への**タップ可能リンク**を置かない（文言のみOK）
- v1.0.12起動安全網: `getSession()`は8秒でフォールバックし、React致命エラー時は再読み込み画面を表示
- ロールバック: PR #19をrevertし、4箇所のバージョンをv1.0.11へ戻す

---

## 🔧 ツール・接続情報

| ツール | 用途 |
|---|---|
| Supabase MCP（ndqbtfahtjaafroevgwq） | SQL直接実行・スキーマ管理 |
| Vercel MCP | デプロイ確認・web_fetch_vercel_url（生HTML確認） |
| Stripe | 月額200円 + 年間2,100円 |
| GA4（G-64GLZZQC24） | アクセス解析 |
| Google Search Console | httpsプロパティ登録済み |
| GCP OAuth同意画面 | アプリ名「まなびの木」設定済み |
| Google Play Console | Developerアカウント登録済み（お受験マネージャー共通） |
