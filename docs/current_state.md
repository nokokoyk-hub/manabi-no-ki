# 🌳 まなびの木 - プロジェクト現在地（北極星ドキュメント）
## 最終更新: 2026/07/26 スレッド32: 問題+70問(657問)・pg_cron自動化・API要件確認

---

## 📌 基本情報

| 項目 | 値 |
|---|---|
| バージョン | v1.0.14 |
| 本番URL | https://manabinoki.net |
| GitHub | https://github.com/nokokoyk-hub/manabi-no-ki (Public) |
| Supabase | Project ID: `ndqbtfahtjaafroevgwq`（Pro組織・ACTIVE_HEALTHY） | pg_cron | ✅ 有効化済み。`expire-trial-to-free`: 毎日UTC 0:00にtrial期限切れを自動free化 |
| Vercel | Project: `manabi-no-ki` / Team: `team_wLDUprmHVwDKbqydwaFCl5k7` |
| GA4 | G-64GLZZQC24 |
| Stripe | 月額200円 + 年間2,100円 |
| Google Play | 🎉 **審査通過（2026/07/22までに承認）**。v1.0.12の起動安全網（getSessionタイムアウト+Error Boundary）で逆転承認。公開状態・ストア掲載はPlay Consoleで確認 |

---

## 👥 ユーザー状況

- auth.users: 13件（7/26時点。外部ユーザー jaime*** 等の新規あり）
- soul-backup: 3名（隔離管理必須）
- 実ユーザー: raffaele, jaime 含む外部ユーザーあり
---

## 📊 コンテンツ状況

- questions: 657問（スレ32で+70問: とけいLv2-5各+10, しゃかいLv1-3各+10）
- 解説（explanation）: 657問（100%）
- こうがくねん版解説（explanation_advanced）: 657問（100%）
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
│   ├── gachaData.js                # ガチャデータ定義（43種）+ v1.0.13: GACHA_CHARACTERS / isGachaCharacter
│   └── twaDetect.js                # ★v1.0.6新規: TWA（Google Playアプリ）判定
├── data/
│   ├── puzzles.js                  # ごほうびパズル定義（3種・9ピース）
│   └── costumeItems.js             # ★v1.0.14拡張: 着せ替え16個+CATEGORY_TO_SLOT等の対応表
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
│   ├── CharacterDisplay.js         # 汎用キャラ表示（まめ/ロボ/ガチャキャラ切替・v1.0.13拡張）
│   ├── GachaCharacter.js           # ★v1.0.13新規: ガチャキャラせんせい表示（立ち絵+吹き出し）
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
├── sitemap.xml                     # 6URL版
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

### 🎓 ガチャキャラせんせい機能（v1.0.13新規）
- ガチャキャラ6体を「せんせい」（出題キャラ）として選択可能。**コレクション入手済みのみ選択可**（ガチャの動機づけ）
- ホームの「🎓 せんせいを えらぶ」ボタン→選択モーダル（まめ・ロボ+6体。未入手は❓+「ガチャで ゲットしよう！」）
- ガチャキャラは1枚絵のため「立ち絵+吹き出し」方式（GachaCharacter.js）。ふわふわ浮遊アニメ・固定名（名前変更不可）
- ガチャキャラ選択中はホームの木の右（まめの位置）に表示、タップで選択モーダル再オープン
- セリフは mameMessages.js のガチャキャラ用汎用セット（まめ/ロボの既存文言は不変）
- 未入手・不明IDが選択状態のときは起動時に'mame'へ自動フォールバック（App.js）
- 7体目の追加は gachaData.js に1行+画像1枚で完結するデータ駆動設計

## 👗 着せ替えシステム（v1.0.14で豪華版に）

- **4スロット重ねづけ**：あたま(head)/かお(face)/くび(neck)/て(hand) にカテゴリごと1個ずつ装着可
- アイテム**16個**（絵文字方式）。解放条件5タイプ：mission_count / streak / perfect / puzzle / **collection（果実コレクション種類数・v1.0.14新設）**
- collection型（にじのヘアバンド🌈=10種 / おうごんカップ🏆=25種）は**収穫直後に即反映**（handleHarvestClose内でcheckCostumeUnlocks）
- データ構造：`manabi_costume` の `equippedItems: {head,face,neck,hand}`。**旧形式 `equippedItem`（単数）からの自動マイグレーション実装済み**（二重移行ガードあり）
- アイテム定義に任意 `image` フィールドあり：**画像パスを足すと絵文字→イラストに差し替わる**（松プランの受け入れ口。image失敗時はemojiフォールバック）
- 着せ替えは**まめ専用**（ロボ・ガチャキャラには適用されない）。GohoubiScreenのプレビューもまめ固定
- 新カテゴリ追加時は costumeItems.js の CATEGORY_TO_SLOT / CATEGORY_ORDER / SLOT_LABELS を更新（1ファイル完結。リセット値は createDefaultCostumeData() が自動追従）

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
| costume | manabi_costume | ❌ 未移行（v1.0.14で構造変更: equippedItems 4スロット・旧形式自動移行あり） |
| display_mode | manabi_display_mode | ❌ 未移行 |

---

## 🐛 既知のバグ・修正済み

### v1.0.13〜v1.0.14で対応済み（2026/07/22）
- ✅ 結果画面（スコア50%未満）でどのせんせいでも犬絵文字🐕が出る既存バグ → キャラ出し分けに修正
- ✅ collection型の着せ替え解放が次のミッションまで反映されない非対称 → 収穫直後に即反映
- ✅ アカウント切替リセット値のスロット手打ち・item_none遺物 → createDefaultCostumeData()に集約
- ⚠️ 既知の軽微な残り：成長演出セリフはガチャキャラ専用トーンなし（まめ用汎用文で代用・実害なし）/ LevelSettingsScreenはまめ固定表示（既存）

### v1.0.12でコード対応済み（Android新規インストール再確認待ち）
- ✅ Google Play審査環境で、クリーム色の起動画面から先へ進まない可能性に対し、`supabase.auth.getSession()`へ8秒のタイムアウトを追加。
- ✅ セッション確認がreject・例外・タイムアウトになっても、未ログイン状態としてログイン画面へ進むフォールバックを追加。
- ✅ React描画中の致命的エラーを`BootErrorBoundary`で捕捉し、白画面ではなく再読み込み画面を表示。
- ✅ 起動診断状態は`sessionStorage`に保存し、TWAとChrome間で状態を持ち越さない。
- ⚠️ 根本原因は認証セッション確認の未応答が主要候補。新AABの新規インストール起動で最終確認する。

### スレッド31 捜査で判明した事実（重要な検証記録）
- ✅ **画像パス `/public/images/...` は正常**（本番でstatus200・PNG返却を確認済み）。「/public/は誤り」は誤解で、まなびの木は本番でこのパスが正しく解決される。**全ファイル修正しかけたが冤罪と判明・回避**
- ✅ **OTPメール「即期限切れ」問題はGmailの `+` エイリアス限定**（例：`manabinokiinfo+review@gmail.com`）。素のアドレスなら正常。実ユーザー影響なし。→ **審査用アカウントにエイリアス不可**
- ✅ **認証は Google OAuth + メールOTP の2方式、両方パスワードレス**。審査官に固定の鍵を渡せない構造的弱点（Phase1.5 保険B参照）
- ✅ **否承認の真因（推定）**：起動→即ログイン要求の導線。審査官（機械の可能性大）がログイン/読み込みの壁で「不完全な機能」判定。お受験マネージャーは「LPで踏みとどまる」構造で通過した差
- ✅ Codexの診断（認証セッション未応答が主犯）とちゃぴの独立診断が一致=信頼度高

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

### ✅ Phase 1 完了: Google Play審査通過🎉（2026/07/22確認）
- 保険策（WelcomeScreen / 審査官用パスワードログイン）は**出番なしで通過**。素材（welcome_bg.webp等）はのんローカル保管のまま、将来のLP改善に転用可

### Phase 1.6: コンテンツ拡充（現在ここ・のんの素材待ち）
1. 🧩 **パズル種類追加**：のんがGPTで画像作成中（正方形1024×1024・主役ドーン）→ 届いたら `src/data/puzzles.js` に1ブロック+画像設置で追加
2. 🎨 **ガチャキャラのポーズ絵**（任意）：1キャラ3ポーズ案（よろこび/おうえん/だいよろこび）→ 届いたらGachaCharacterをポーズ対応に拡張
3. 👗 **着せ替え松プラン**：アイテムのイラスト画像化。costumeItems.jsの`image`フィールドに差すだけの受け入れ口実装済み

### Phase 1.7: リファクタ宿題（レビュアー指摘・動作は正常）
4. 💬 SpeechBubble共通化（MameCharacter/RobotCharacter/GachaCharacterに吹き出しJSXが3重コピー。デザイン変更時の事故源）
5. 📏 HomeScreen分割（708行・モーダル2枚をCharaSelectModal/RenameModalに抽出）・GohoubiScreen分割（417行・CostumeCorner抽出）
6. 🎯 LevelSettingsScreenにselectedCharacter伝播（既存の抜け・現状まめ固定表示）

### Phase 2: 品質向上
7. 💰 年間プラン実決済テスト
8. 🔍 Search Consoleインデックス経過確認 + URL検査リクエスト
9. 🔐 Googleバッジ取得申請
10. 📊 他のlocalStorage→Supabase移行（subject_levels優先・fruitCollectionパターン。costume/puzzleも候補）
11. 📱 **API レベル要件対応**（期限 2026/08/31、BubbleWrap再ビルドのみ・React変更不要）

### Phase 3: 機能拡張・マルチプラットフォーム
11. ✅ ~~ガチャキャラを先生として選択可能に~~（v1.0.13で実装完了）
12. 🍎 **App Store（iOS）展開**（お受験マネージャーが本命・別スレで本腰）
   - ルート確定：**Capacitor + クラウドビルド（Macなし）**。のんリサーチ済み
   - Apple Developer $99/年 = 了解済み。**まなびの木単独で回収想定せず、お受験マネージャー（本命）と1アカウント共有で分散**
   - iOS価格：手数料上乗せ予定（Small Business Program申請で15%になる／年商10万ドル以下）
   - ⚠️ 4.2ラッパー審査リスク：iOSはAndroidより「単なるWebラッパー」に厳しい。Android通過実績を4.2対策の足がかりにする
   - ⚠️ iOSアプリ内からWeb決済誘導はリジェクト要因（AndroidのtwaDetect同様の出し分けがiOS版でも必要）
   - お受験マネージャーは別リポジトリ（Private）。iOS化は専用スレで現物レビューから開始
14. 📉 成長サイクル調整（growthEffects.js / App.js の数値変更）

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
- **Vercelプレビューの動作確認はメールOTPログインを使う**：GoogleログインはSupabaseのリダイレクト許可リスト外のプレビューURLから本番へ着地してしまい「新機能が出ない」ように見える（2026/07/22確認）

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
