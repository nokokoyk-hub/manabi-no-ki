# 🌳 まなびの木 - プロジェクト現在地（北極星ドキュメント）

## 最終更新: 2026/09/13（JST）Claudeスレッド33の記録と、現行main・DBを照合して統合

## 現在地と、この統合で確認した範囲

- コード基準: GitHub `main` の `044226ad25012be4454a8cd4ee754ea9c005d726`（2026/09/09、PR #26）。アプリのバージョン表記は **v1.0.14** のまま。
- コンテンツ基準: 2026/09/13の `public.questions` 読み取り集計。**有効832問、通常・高学年向けの解説とも832問、７教科×６レベルすべて15問以上**。
- 統合元: GitHubの旧北極星（2026/07/26）と、のん提供の `Downloads/current_state.md`（2026/09/12、Claudeスレッド33）。更新日の新しさだけで上書きせず、実コード・Git履歴・DB集計を優先した。
- この変更は北極星の文書更新のみ。コード、DB、決済、外部サービス設定、バージョンは変更していない。GitHubへの反映状態は、この文書を更新したPRとGit履歴で確認する。
- Google Playの公開状況、Search Console、決済の実取引、認証設定・DB権限・Cronの現在状態は今回再検証していない。以下の過去記録と現在の確認済み事実を分けて扱う。

### 添付から抽出した変更点と統合結果

| 項目 | 統合結果・根拠 |
|---|---|
| 問題数657→832、教科別マトリクス、解説100% | DB集計で一致。現状として採用 |
| 「スレ33で+175問」の教科別内訳 | 添付内訳は合計145問。175は旧文書657との差であり、特定日の追加実績としては採用しない |
| パズル３→５種 | ５種は実コードで確認。名称・画像パスを訂正し、追加日は2026/07/28のGit履歴に合わせた |
| `rika-lN-XXX` / `genso-lN-XXX` の新規ID方針 | Claude側の追加方針として保持。既存の `kagaku` 共有をDBで確認。既存IDは変更しない |
| 2000問目標、げんそ底上げ、DB文書更新候補 | 計画として統合。実装・DB追加や別文書更新の承認とは扱わない |
| ７月の検索確認予定やAPI期限の記述 | 経過済みの日付を次回予定から外し、現在状況の確認事項に変更 |
| ９月の森のUI・ホーム改善・動物・開花と結実 | 添付には未反映。PR #23〜#26と実コードから補完 |
| 旧SVGの木、画面行数、ガチャ内訳、全演出OFFの説明 | 現在のコードに合わせて訂正。過去の設計と現在の仕様を区別 |

---

## 📌 基本情報

| 項目 | 値 |
|---|---|
| バージョン | v1.0.14 |
| 本番URL | https://manabinoki.net |
| GitHub | https://github.com/nokokoyk-hub/manabi-no-ki (Public) |
| Supabase | Project ID: `ndqbtfahtjaafroevgwq`。`questions` 集計は2026/09/13確認。Pro組織・稼働状態の表記は旧記録で、今回は未再検証 |
| pg_cron | 旧記録: `expire-trial-to-free` を毎日UTC 0:00（JST 09:00）に実行。現在の有効状態・実行結果は未再検証 |
| Vercel | Project: `manabi-no-ki` / Team: `team_wLDUprmHVwDKbqydwaFCl5k7` |
| GA4 | G-64GLZZQC24 |
| Stripe | 月額200円 + 年間2,100円 |
| Google Play | 旧記録: v1.0.12の起動安全網追加後、**2026/07/22までに審査通過**。変更と承認の因果は未確定。現在の公開状態・ストア掲載はPlay Consoleで確認 |

---

## 👥 ユーザー状況（2026/07/26の過去記録・今回未再集計）

- auth.users: 13件（7/26時点。外部ユーザー jaime*** 等の新規あり）
- soul-backup: 3名（隔離管理必須）
- 実ユーザー: raffaele, jaime 含む外部ユーザーあり
---

## 📊 コンテンツ状況

- `questions`: **832問**。全832問が `active = true`。
- `explanation`: 空欄ではない解説が832問（100%）。
- `explanation_advanced`: 空欄ではない高学年向け解説が832問（100%）。件数の確認であり、問題・解説の内容品質を全問審査した結果ではない。
- 取得元: Supabase `public.questions` を `subject`・`grade_level` ごとに集計（2026/09/13 JST）。アプリの読み込みは `src/lib/questionLoader.js`。ローカルのフォールバック問題数とは区別する。

### 教科別・レベル別の問題数（DB確認済み）

| 教科 | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | 合計 |
|---|---|---|---|---|---|---|---|
| こくご | 20 | 20 | 20 | 20 | 30 | 30 | 140 |
| さんすう | 22 | 20 | 20 | 20 | 20 | 20 | 122 |
| しゃかい | 20 | 20 | 20 | 20 | 20 | 20 | 120 |
| どうとく | 20 | 20 | 20 | 20 | 20 | 20 | 120 |
| りか | 20 | 20 | 20 | 20 | 20 | 20 | 120 |
| とけい | 20 | 20 | 20 | 20 | 20 | 20 | 120 |
| げんそ | 15 | 15 | 15 | 15 | 15 | 15 | 90 |
| **合計** | **137** | **135** | **135** | **135** | **145** | **145** | **832** |

### 追加数の履歴と、元資料の食い違い

- 旧北極星の657問と現在832問の差は175問。
- 添付の内訳（しゃかい25・どうとく60・りか22・げんそ20・とけい14・こくご4）は合計145問で、30問分が説明されていない。対象期間や内訳は要確認のため、推測で教科に配分しない。
- 現在のレコードの `created_at` をJSTで集計すると、2026/08/04は25件、08/19は67件、09/12は18件（こくご4・とけい14）。「09/12に175問追加」とは記載しない。これは現在残る行の作成日時集計であり、過去の削除・再登録まで証明する監査ログではない。

### 次回追加時のID方針（Claudeスレッド33から引き継ぎ）

- 新規のりか問題は `rika-lN-XXX`、げんそ問題は `genso-lN-XXX` を使う方針。追加前に既存IDとの重複を確認する。
- DBで `kagaku` 接頭辞がりか36件・げんそ82件に使われていることを確認。`rika` 22件、`genso` 8件も存在する。「衝突多発」は添付での報告で、今回衝突ログは再検証していない。
- 既存IDを一括変更しない。回答履歴などとの関連があるため、名称整理と問題追加を混同しない。

### パズル（実コード確認済み・全５種、各９ピース）

| ID | 表示名 | リポジトリ内の画像 |
|---|---|---|
| spring | はるの おはなばたけ | `public/public/images/puzzles/puzzle_spring.png` |
| summer | まめと なつの うみ | `public/public/images/puzzles/puzzle_summer.png` |
| night | おほしさまの よる | `public/public/images/puzzles/puzzle_night.png` |
| fireworks | まめと はなびの よる | `public/public/images/puzzles/puzzle_fireworks.png` |
| ocean | まめの うみの ぼうけん | `public/public/images/puzzles/puzzle_ocean.png` |

- 正本: `src/data/puzzles.js`。公開時の画像URLは `/public/images/puzzles/puzzle_<id>.png`。
- 花火・海中の追加は2026/07/28の `058760e`、画像追加は同日の `1949d28`。添付の「スレ33で追加」と旧作品名・旧画像パスは現行説明に採用しない。
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
│   ├── puzzles.js                  # ごほうびパズル定義（5種・各9ピース）
│   └── costumeItems.js             # ★v1.0.14拡張: 着せ替え16個+CATEGORY_TO_SLOT等の対応表
├── screens/
│   ├── AuthScreen.js               # ログイン画面
│   ├── HomeScreen.js               # 森のホーム・花/実の段階表示・次の実までの目安
│   ├── LearningScreen.js           # 学習画面
│   ├── MimamoriScreen.js           # みまもり画面（v1.0.6: TWA課金出し分け）
│   ├── HarvestScreen.js            # 収穫演出画面
│   ├── CollectionScreen.js         # コレクション一覧
│   ├── FukushuScreen.js            # 復習画面
│   ├── GohoubiScreen.js            # 図鑑・パズル・着せ替えのタブと収穫導線
│   ├── ForestUI.test.js            # UI・成長表示・動物演出の回帰テスト
│   ├── HowToScreen.js              # アプリ内の使い方
│   ├── PrivacyScreen.js            # プライバシーポリシー
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
│   ├── GrowthEffect.js             # 成長イベントの粒子
│   ├── ForestUI.js                 # ヘッダー・タブ・果樹園などの共通UI
│   ├── GardenBlossoms.js           # 花数に応じた枝上の花・実への変化
│   ├── GardenVisitors.js           # ちょうちょ・小鳥・リスのランダム演出
│   ├── PinGate.js                  # 保護者PIN認証
│   ├── PremiumGate.js              # 有料機能ゲート（v1.0.6: TWA課金出し分け）
│   └── UpdateBanner.js             # アプデバナー
├── constants/
│   ├── colors.js                   # 色定義
│   ├── mameMessages.js             # キャラメッセージ
│   ├── learningLevels.js           # レベル定義
│   └── growthEffects.js            # 成長イベントの時間・セリフ・ポーズ・粒子の設定
├── index.css                       # 基本スタイル・従来の成長演出keyframes
├── forest.css                      # 森のUI、動物・開花/結実のスタイル
└── reward-ui.css                   # ごほうび・収穫のスタイル
public/
├── index.html                      # ★v1.0.5: 静的LP埋め込み（SEO対策）
├── howto.html / terms.html / privacy.html / changelog.html / account-deletion.html
├── ui/garden.png                   # 現在のホームの木と背景
├── ui/legal.css                    # 静的公開ページの共通スタイル
├── public/images/puzzles/          # 上記5種のパズル画像（URLは/public/images/puzzles/...）
├── sitemap.xml                     # 6URL版
├── robot-icon-512.png              # PWAアイコン
├── og-image.png                    # OGP画像（1200×630）
├── version.json
docs/
├── current_state.md                # ★この文書（北極星）
├── supabase_structure.md           # DB設計書。2026/07/02時点で止まっているため更新候補
└── version.json
```

---

## 🌳 現在のUIと木の表示（2026/09の反映分）

- 対象は小学校低学年〜一部高学年。森を基調とする色・丸み・文字・ボタンに全体を統一。保護者向けページは通常の日本語で読みやすさを優先する。
- ホームの木は **`public/ui/garden.png` の画像に花・実・動物を重ねる構成**。`TreeSVG.js` は残っている旧部品で、現在のホームでは使わない。
- ステータスは花と実。葉は成長計算用の内部カウンター。次の実までの必要ミッション数を表示する。
- せんせい選択欄は木の下。ガチャキャラはその右側に表示する。「名前を変更する」はまめ・ロボの名前変更用。
- 学習画面は１問ずつ進め、回答後は自分で次の問題へ進む。ごほうびは図鑑・パズル・着せ替えを同じ画面のタブにまとめる。
- ホームの「ごほうび」からパズルへ、「たからもののずかん」からコレクションへ直接開く。今日のミッション完了後はパズル内のミッション開始ボタンも無効になる。

### 開花・結実と従来の成長演出

- `App.js` が成長時に `growthEvent`（leaf / flower / fruit）を設定し、`HomeScreen` が演出後に `onGrowthEventEnd()` で終了する。優先度は fruit > flower > leaf。
- `src/constants/growthEffects.js` はイベントの時間・セリフ・ポーズ・粒子を管理。葉2秒、花2.5秒、実3秒。従来の木の動き・粒子は `index.css` にある。
- `GardenBlossoms.js` と `forest.css` が枝上の花を表示する。花が増えた日はつぼみが開き、演出が終わっても保存された花数に応じて枝に残る。花の揺れは４秒・１回。
- 実になる日は変換前の２輪を一時表示し、**1.4秒後**に実への変化を開始する。花・実のカウント、読み上げラベル、収穫導線も同じ段階に合わせる。既存の実がある場合はその数に加算される。
- OSの「動きを減らす」設定では開花・結実の途中表示を省き、保存済みの最終値を表示する。表示の演出は保存値や成長ルールを変更しない。
- **`GROWTH_FX_ENABLED` はHomeScreenのイベント起因演出のスイッチ**。動物、保存済み花の表示・CSSの揺れ、収穫ダイアログなどを一括停止するスイッチではない。

### 森の動物（GardenVisitors）

- １匹ずつ表示。初回はちょうちょ、その後はちょうちょ50%・小鳥30%・リス20%で抽選する（ガチャ確率とは別）。
- 初回の待ち時間は1.8〜3秒。退場後、次の訪問まで **２〜５秒**。表示時間はちょうちょ９秒、小鳥5.5秒、リス8.5秒。
- 左右をランダムにし、リスは地面側を走って花・実のカウンターの後ろに一部が隠れる。
- 停止・再開ボタンあり。OSの動きを減らす設定、タブ非表示、庭が画面外の場合は動物とタイマーを止める。

### 収穫演出

- `HarvestScreen.js` で揺れ→光→結果を表示。開始約1.3秒で光、約2.7秒で結果へ進む。
- スキップ、画面内の動きを控える設定、OSの動きを減らす設定に対応。旧ガチャ定数のレア別durationを現在の再生時間と混同しない。

### ９月の反映履歴と検証範囲

| JST日付 | PR / mainコミット | 内容 |
|---|---|---|
| 2026/09/08 | [#23](https://github.com/nokokoyk-hub/manabi-no-ki/pull/23) / `b8ede09` | 森のUI統一、学習・ごほうび・関連画面、規約等の整理 |
| 2026/09/08 | [#24](https://github.com/nokokoyk-hub/manabi-no-ki/pull/24) / `e8817e3` | ホームの「名前を変更する」表記 |
| 2026/09/08 | [#25](https://github.com/nokokoyk-hub/manabi-no-ki/pull/25) / `fc40233` | 動物、成長目安、ごほうび導線、公開日付表示 |
| 2026/09/09 | [#26](https://github.com/nokokoyk-hub/manabi-no-ki/pull/26) / `044226a` | 枝に残る花、開花・結実、動物の待ち時間を２〜５秒へ短縮 |

- PR #26当時の記録: `ForestUI.test.js` 15件成功、最適化ビルド成功、ローカルで開花・結実・花なし・カウント遷移を確認。ユーザーによる試作確認済み。
- 2026/09/09にVercel本番 `dpl_5iTFxPQeJcciTwVgzp24BShwQCtc` のREADY、本番起動と花のCSSの配信、コンソールエラーなしを確認済み。ログイン後の実データで開花する瞬間やAndroid実機の検証とは区別する。
- 文書統合の検証は実コード・Git履歴・DB集計との照合、記載ファイルの存在確認、文書差分のレビュー。アプリテスト・実決済は再実行していない。Git連携による自動デプロイの結果は文書更新PRに対応するVercelの状態を参照する。

---

## 🍎 果実コレクション・ガチャ仕様

### 成長サイクル（Bプラン）
- その日のミッション初回完了→葉+1、葉2枚→花+1、花2つ→実+1（葉・花が０からなら４日分のミッションで果実１個）
- ミッション以外（教科練習・復習）では木は育たない
- 数値調整はApp.js handleLearningComplete内の1箇所

### ガチャ仕様
- 計43種: フルーツ37種 + キャラ6体
- レアリティ抽選確率: ノーマル50% / レア30% / SR15% / レジェンド5%。選んだレアリティ内では各項目を均等に抽選（`src/lib/gachaData.js`）。
- キャラを含む43種の内訳: ノーマル13 / レア8 / SR13 / レジェンド9。旧記録の13 / 6 / 11 / 7は果実37種だけの内訳。
- ガチャ専用キャラ6体: ももぴ🐰(SR)・ひめにゃ🐱(Legend)・にじぴよ🐥(Rare)・ライドラ🐉(Legend)・ガーディ🤖(SR)・ぽっけ🦊(Rare)

### データ同期（v1.0.4）
- Supabase優先 + localStorageフォールバック（profiles.fruit_collection jsonb）
- 初回ログイン時に自動マイグレーション・複数端末マージ対応
- このパターンが他のlocalStorage移行の雛形

### 🎓 ガチャキャラせんせい機能（v1.0.13新規）
- ガチャキャラ6体を「せんせい」（出題キャラ）として選択可能。**コレクション入手済みのみ選択可**（ガチャの動機づけ）
- ホームの「🎓 せんせいを えらぶ」ボタン→選択モーダル（まめ・ロボ+6体。未入手は❓+「ガチャで ゲットしよう！」）
- ガチャキャラは1枚絵のため「立ち絵+吹き出し」方式（GachaCharacter.js）。ふわふわ浮遊アニメ・固定名（名前変更不可）
- ガチャキャラ選択中は木の下のせんせい選択欄の右側に表示、タップで選択モーダル再オープン
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
- 既存の連携設計: Stripe Webhook → subscription_status自動更新。現在の配備状態・実取引による動作は今回未検証。

### 📱 TWAでの課金表示（現在の実装方針）
- 「消費専用アプリ」方式として、TWA内の外部決済ボタンを案内文に置き換える実装。現在のストア規約への適合を今回の文書確認で認定したものではない。
- `src/lib/twaDetect.js` の `isTwa()` で起動経路判定（document.referrer が android-app:// → sessionStorageに保存）
- **⚠️ localStorage は使わない**（TWAとChromeブラウザで共有されるため事故る。sessionStorageはタブ単位で安全）
- TWA時の表示: PremiumGate（プランカード→案内文言）/ MimamoriScreen trial・free（ボタン→案内文言）/ premium（ポータルボタン→案内文言）
- URLを含む案内文とタップ可能な購入リンクを区別する既存設計。ストア規約上の可否は配信地域・申請時の公式規約で別途確認する。
- Web版・PWA版は従来どおり課金ボタン表示
- `isTwa()` を一律falseにするとアプリ内へ購入ボタンが出るため、一般的な切り戻し手順にはしない。変更時は対象差分と実機への影響を確認する。
- 旧文書の地域別解禁日・適用時期は今回未検証のため、現行要件として採用しない。

### 規約・プライバシーの表示

- PR #23/#25でアプリ内と公開HTMLの説明・デザイン・日付表示を整理。`TermsScreen.js`、`PrivacyScreen.js`、`TokushohoScreen.js` と `public/terms.html`、`public/privacy.html` が関連する。
- 公開文書の最終更新日表示は2026年９月８日。特商法の事業者氏名・電話番号は「請求時に開示する」表示を保持している。
- 開示対応など実運用や法的適合を確認したという意味ではない。変更する場合は表示と運用を分けて確認する。

---

## 🌐 SEO戦略（v1.0.5強化）

- **index.html の `<div id="root">` 内に静的LPコンテンツ埋め込み済み**（Googlebot対策・Reactマウントで自動置換）
- LP内容: 特徴4つ（無学年式・木育成・200円・みまもり）+ 7教科 + 料金 + 静的ページリンク
- キーワード戦略: 「**無学年式**」「小学生向け学習アプリ」「月額200円」軸（title/description/JSON-LD更新済み）
- 旧記録では同名のNPO・塾との検索競合を考慮し、「アプリ」軸で差別化する方針。現在の検索順位は未確認。
- 静的HTMLページ: howto / terms / privacy / changelog / account-deletion。`sitemap.xml` はトップを含む **６URL**。
- Search Consoleのhttpsプロパティ登録は旧記録。現在のインデックス状況は要確認。旧「7/2時点の検索０件」を現在の未登録状態として扱わない。

---

## 🛡️ セキュリティ（スレッド30の対応履歴・現在状態は未再検証）

- ✅ auth.users露出ビュー3件DROP（manabi_user_view / orphan_user_view / soul_user_management_view）→ CRITICAL解消
- ✅ delete_manabi_user / handle_new_user のEXECUTE権限をanon・authenticated・PUBLICからREVOKE（service_role・postgresのみ）
- ✅ 全関数に SET search_path = public 設定
- ユーザー一覧確認: Supabaseダッシュボード Authentication→Users、またはちゃぴにMCP依頼
- 旧残タスク: 漏洩パスワード保護の有効化。現在の設定・適用対象は未確認。「実害ほぼなし」とは断定しない。

---

## 📸 ストア申請アセット（スレッド30の保管記録・現在の実ファイルは未照合）

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

## 🐛 過去の修正・検証記録

以下は７月までの引き継ぎ記録。９月のUI変更は上の「現在のUI」節を優先し、外部サービスや実機の結果は確認当時の範囲に限定する。

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
- 旧調査ではGmailの `+` エイリアス使用時にOTPの「即期限切れ」を観測し、通常アドレスでは成功したと記録。審査用アカウントではエイリアスを避ける運用案。エイリアス限定・全ユーザーへの影響なしという断定は今回再検証していない。
- **認証は Google OAuth + メールOTP の２方式、両方パスワードレス**。固定パスワードを渡す審査導線は未実装。旧Phase1.5の保険案は将来案として扱う。
- 旧調査の仮説: 起動直後のログイン要求・認証セッション待ちが審査時の問題に関係した可能性。確定原因や審査主体は不明で、複数AIの見解一致を根拠に確定扱いしない。

### v1.0.11で対応済み
- ✅ ホーム画面の「まなびの木」表示をタップ/クリックしてもトップへ戻れない導線不足を修正。ロゴ表示をアクセシブルなボタン化し、ホーム画面上部へスムーズスクロールするようにした。


### v1.0.5〜v1.0.6で対応済み
- ✅ 木が丸坊主に見える（BASE_LEAVES=5で常時緑化）
- ✅ 成長が無言で気づかれない（成長演出追加）
- ✅ 外部購入ボタンのTWA出し分け対応（twaDetect）。審査結果との因果は未確定
- ✅ 特商法・利用規約のReact画面に年間プラン記載漏れ（追記済み）
- ✅ Googlebotがトップページを読めない（LP埋め込み）
- ✅ Supabaseセキュリティ警告CRITICAL（ビューDROP・権限修正）

### v1.0.4で修正済み
- ✅ 木の成長が教科練習でも発生 / みまもり日付ズレ / カレンダーアイコン固定「17」/ USER_LOCAL_KEYS漏れ 他

---

## 📋 次回タスク（引き継いだ計画・実施前に優先度と範囲を確認）

### 完了として引き継ぐこと

- Google Play審査通過は2026/07/22の旧記録。現在の公開状態やAPIレベルは別途確認する。
- ガチャキャラの先生選択、パズル５種、９月のUI・開花・動物演出はコードに反映済み。
- 旧保険策（WelcomeScreen / 審査官用パスワードログイン）は未実装。`welcome_bg.webp` 等のローカル保管は旧記録で、今回は現物未確認。

### Phase 1.6: コンテンツ拡充（Claudeスレッド33の計画を引き継ぎ）

1. **問題数2000問を目標**とする案。現在832問なので残1168問、到達率41.6%。
2. げんそを各Lv15→20問にする案（６レベルで+30問）。その後、Lv5・6の高難度問題を充実させる候補。今回、問題追加は行わない。
3. パズルの追加候補。現在５種。採用時は `src/data/puzzles.js` の定義と実際の画像配置・URLをそろえる。
4. ガチャキャラのポーズ絵（よろこび・おうえん・だいよろこび）や着せ替えのイラスト化は任意の将来案。画像だけでなく表示側の対応要否も確認する。

### Phase 1.7: 旧リファクタ候補を再評価

- SpeechBubble共通化は旧提案。現コードの重複と効果を確認してから範囲を決める。
- HomeScreenのモーダル分離などは必要性を再評価する。現行はHomeScreen423行・GohoubiScreen67行（本統合時のmain）で、旧708行・417行を前提に作業しない。
- LevelSettingsScreenへのselectedCharacter伝播は旧残課題。実施時に現在の表示と期待する仕様を確認する。
- いずれも文書への掲載だけで実装承認とは扱わない。

### Phase 2: 品質・運用の確認候補

- 年間プランの実決済テスト（取引を発生させるため別途承認）。
- Search Consoleの現在のインデックス状況、Googleバッジ申請状況の確認。
- localStorageデータのSupabase移行案。subject_levelsを優先候補に、costume/puzzle等も検討する。移行設計・復旧方法を決めてから実施する。
- AndroidのAPIレベル要件。旧文書の「2026/08/31」は経過済み。現在のPlay Console表示・配布AABのtarget API・適用期限を確認し、再ビルドだけで足りると先に断定しない。
- `docs/supabase_structure.md` は2026/07/02、問題587問のまま。DB設計書の更新は別タスク候補。実スキーマ・RLS・Cronを確認して更新し、問題件数はこの北極星の確認日を参照する。パズル５種は現在ローカルコードの定義であり、DBスキーマ変更ではない。

### Phase 3: 将来案

- App Store展開: 旧方針はCapacitor＋クラウドビルド。お受験マネージャーと開発者アカウントを共有する考えを引き継ぐが、まなびの木のiOS実装・公開が済んだという意味ではない。
- iOS価格・手数料・Small Business Programの適用条件・審査要件は計画実施時に公式情報を確認する。旧文書の数値や地域別外部決済ルールをそのまま採用しない。
- 成長サイクル調整は将来案。成長ルールは `App.js`、演出の設定は `growthEffects.js` 等に分かれている。表示時間の調整と保存値の変更を分ける。

---

## ⚠️ 開発ルール・注意事項

### バージョンバンプ（4箇所同期）

- 変更はリリース範囲として承認されたときだけ行う。今回の北極星統合では変更しない。

1. `src/App.js` → `APP_VERSION = 'x.x.x'`
2. `package.json` → `"version": "x.x.x"`（依存更新と混同しない。lockfileの整合性は変更時に確認）
3. `public/version.json`
4. `docs/version.json`

### DB変更チェックリスト
- カラム追加 → storage.js反映 + 関連ファイル確認
- RLS変更 → storage.js + App.js + PinGate.js動作確認
- **docs/supabase_structure.md を必ず同時更新**

### 画像・スクショ
- 背景透過が必要な素材は画像の背景・透過状態を確認して加工する。生成画像すべてへの一律の背景除去は行わない。
- GitHub Web UI一括アップは5〜6枚ずつ + 目視確認
- **スクショはLINE/メール経由禁止（自動圧縮される）→ 写真アプリから直接アップ**
- 旧申請時の画像規格は上のアセット表を参照。新規申請時にはPlay Consoleの現行規格を確認して書き出す。

### デプロイ
- ユーザーの承認範囲に沿って変更し、関連ファイルをまとめて検証する。デプロイERRORを正常扱いして完了報告しない。
- import依存のある新規ファイルは利用側と同じコミットに含め、検証不能な中間状態を公開しない。
- 現行の流れは作業ブランチ→ローカル確認/必要な試作確認→承認を得てpush・PR・マージ。`main`へのマージによりVercel本番へ自動反映されるため、対象SHAとREADYを確認する。
- ステージするファイルを明示し、既存の未コミット変更を巻き込まない。`.codex/` 等の利用者環境を勝手に変更しない。
- 切り戻しは問題を入れたPRの差分を特定してrevertし、再デプロイを確認する。古いPR #19を全変更の共通切り戻し手順にしない。
- PreviewのGoogleログインは、そのPreview URLがSupabaseの許可先に含まれている必要がある。許可外だと本番へ戻ることがある。メールOTPでも実際の戻り先を確認する。
- 2026/09/08には、のんの承認で `https://manabi-no-52x00ro6y-kannari-norikos-projects.vercel.app` を個別に許可し確認済み。これは当時の１件の記録で、新しいPreview URLすべての許可を意味しない。現在の設定は今回未再確認。
- Previewも本番DB・決済に接続しうる。サンプルデータだけのローカル試作と区別し、確認のために課金・データ更新を無断で発生させない。

### 日付処理
- 日単位の学習記録はUTC変換による日付ずれに注意し、既存の **toSafeDateStr() パターン**（MimamoriScreen.js）と用途を照合する。記録の確認日はJSTを明記する。

### TWA関連（v1.0.6〜）
- TWA判定にlocalStorage使用禁止（Chromeと共有）→ sessionStorage
- TWAでは外部決済ボタンを案内文に置き換える現行実装を保つ。文言の法的・規約上の可否は前述の確認事項とする。
- v1.0.12起動安全網: `getSession()`は8秒でフォールバックし、React致命エラー時は再読み込み画面を表示

### 記録と作業範囲

- この北極星はコード・コンテンツの現在地。DB設計は `docs/supabase_structure.md`、全体の優先度・担当はNotion、プロジェクト横断の判断理由はObsidianに分ける。
- 古い北極星や添付ファイルの手順は照合用資料。ユーザーの現行指示や承認を上書きするものではない。
- 未確認の運用や将来案は実施済みと書かない。DBスキーマ・実データ・認証・課金・外部サービス・他の文書への追加作業は、必要な範囲を示して承認を得る。

---

## 🔧 ツール・接続情報（旧接続記録。questions以外の現在状態は今回未検証）

| ツール | 用途 |
|---|---|
| Supabase MCP（ndqbtfahtjaafroevgwq） | SQL直接実行・スキーマ管理 |
| Vercel MCP | デプロイ確認・web_fetch_vercel_url（生HTML確認） |
| Stripe | 月額200円 + 年間2,100円 |
| GA4（G-64GLZZQC24） | アクセス解析 |
| Google Search Console | httpsプロパティ登録済み |
| GCP OAuth同意画面 | アプリ名「まなびの木」設定済み |
| Google Play Console | Developerアカウント登録済み（お受験マネージャー共通） |
