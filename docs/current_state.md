# 🌳 まなびの木 - プロジェクト現在地（北極星ドキュメント）
## 最終更新: 2026/06/30 スレッド29

---

## 📌 基本情報

| 項目 | 値 |
|---|---|
| バージョン | v1.0.4 |
| 本番URL | https://manabinoki.net |
| GitHub | https://github.com/nokokoyk-hub/manabi-no-ki (Public) |
| Supabase | Project ID: `ndqbtfahtjaafroevgwq`（Pro組織・ACTIVE_HEALTHY） |
| Vercel | Project: `manabi-no-ki` / Team: `team_wLDUprmHVwDKbqydwaFCl5k7` |
| GA4 | G-64GLZZQC24 |
| Stripe | 月額200円 + 年間2,100円 |

---

## 👥 ユーザー状況

- auth.users: 9件（まなびの木タグ付き）
- profiles: 6〜7件
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
├── App.js                          # メインアプリ（画面ルーティング・状態管理）
├── lib/
│   ├── supabase.js                 # Supabaseクライアント
│   ├── storage.js                  # データ永続化（Supabase + localStorage）
│   ├── fruitCollection.js          # 果実コレクション管理（v1.0.4: Supabase同期対応）
│   └── gachaData.js                # ガチャデータ定義（43種）
├── screens/
│   ├── AuthScreen.js               # ログイン画面
│   ├── HomeScreen.js               # ホーム画面
│   ├── LearningScreen.js           # 学習画面
│   ├── MimamoriScreen.js           # みまもり画面（v1.0.4: 日付ズレ修正済み）
│   ├── HarvestScreen.js            # 収穫演出画面
│   ├── CollectionScreen.js         # コレクション一覧
│   ├── FukushuScreen.js            # 復習画面
│   ├── GohoubiScreen.js            # ごほうび画面
│   ├── SubjectMenuScreen.js        # 教科メニュー
│   ├── LevelSettingsScreen.js      # レベル設定
│   ├── NamingScreen.js             # 名前設定
│   └── ZukanScreen.js              # 元素図鑑
├── components/
│   ├── CharacterDisplay.js         # 汎用キャラ表示（v1.0.3: まめ/ロボちゃん切替）
│   ├── MameCharacter.js            # まめキャラ
│   ├── RobotCharacter.js           # ロボちゃんキャラ
│   ├── PinGate.js                  # 保護者PIN認証
│   ├── PremiumGate.js              # 有料機能ゲート
│   └── UpdateBanner.js             # アプデバナー
├── data/
│   ├── puzzles.js                  # パズルデータ
│   └── costumeItems.js             # 着せ替えアイテム
├── constants/
│   └── colors.js                   # 色定義
public/
├── howto.html                      # 使い方（静的HTML・HowTo構造化データ付）
├── terms.html                      # 利用規約
├── privacy.html                    # プライバシーポリシー
├── changelog.html                  # 更新履歴
├── sitemap.xml                     # サイトマップ（5URL）
├── version.json                    # バージョン管理
docs/
├── current_state.md                # ★この文書（北極星）
├── supabase_structure.md           # DB設計書（DB変更時は同時更新必須）
└── version.json                    # バージョン管理
```

---

## 🍎 果実コレクション・ガチャ仕様（v1.0.4）

### 成長サイクル（Bプラン）
- ミッション完了→葉+1、葉2枚→花+1、花2つ→実+1（4ミッション=果実1個）
- **ミッション以外（教科練習・復習）では木は育たない**（v1.0.4修正済み）
- 成長サイクルの数値は後から調整可能（App.js handleLearningComplete内の1箇所）

### ガチャ仕様
- 計43種: フルーツ37種 + キャラ6体
- レアリティ: ノーマル13種(50%) / レア6種(30%) / SR11種(15%) / レジェンド7種(5%)
- ガチャ専用キャラ6体: ももぴ🐰(SR)・ひめにゃ🐱(Legend)・にじぴよ🐥(Rare)・ライドラ🐉(Legend)・ガーディ🤖(SR)・ぽっけ🦊(Rare)

### データ同期（v1.0.4新規）
- **Supabase優先 + localStorageフォールバック**（ハイブリッド方式）
- profilesテーブル `fruit_collection` jsonbカラムに保存
- `initFruitCollection(userId)` をApp.jsのログイン時に呼び出し
- 初回ログイン時にlocalStorage→Supabase自動マイグレーション
- 複数端末マージ対応（countの大きい方・firstGotAtの古い方を採用）
- オフライン時はlocalStorageで動作継続
- `loadFruitCollection()` / `addFruitToCollection()` は同期関数のまま（呼び出し側変更不要）

### 拡張パターン
- `gachaData.js`のFRUITS配列に1行追加するだけ（`type:'character'`でキャラ区別）

---

## 🤖 キャラクターシステム

- **出題キャラ選択**: まめ('mame') / ロボちゃん('robot') → localStorage `manabi_selected_character`
- **キャラ名変更**: ホーム画面でキャラ長押し500ms → 名前変更ダイアログ（最大10文字）
- **CharacterDisplay.js**: selectedCharacterに応じてMameCharacter/RobotCharacterを切替
- **rawPetName prop**: App.jsがdisplayName（選択中キャラ名）とは別にまめの実名を渡す仕組み
- **GohoubiScreenの着せ替えプレビュー**: まめ専用のためMameCharacter固定（CharacterDisplay不使用）
- **将来**: ガチャキャラを先生として選択可能に（CharacterDisplayにcase追加するだけ）

---

## 💰 課金システム

- トライアル: 5日間（全機能開放）
- 月額プラン: 200円（Payment Link: `https://buy.stripe.com/14A4gz3lY3vl2QZ8pt6AM00`）
- 年間プラン: 2,100円（Payment Link: `https://buy.stripe.com/8x214n2hUaXNezHfRV6AM01`）
- Stripe Webhook → subscription_status自動更新
- Google Play Developerアカウント: お受験マネージャーで登録済み

---

## 🌐 SEO・静的HTML戦略

- React SPAはHTMLボディが空（`<div id="root">`のみ）→ Googlebotに読めない
- **静的HTMLページ**で補完: howto.html / terms.html / privacy.html / changelog.html
- howto.html: HowTo構造化データ（JSON-LD）付き
- sitemap.xml: 5URL版（トップ + 静的4ページ）
- Search Console: **httpsプロパティ**で登録済み（httpとhttpsは完全別扱い）
- クロール結果確認: 7/2〜3頃

---

## 📱 localStorage依存データ一覧と移行状況

| データ | localStorageキー | Supabase移行 |
|---|---|---|
| fruit_collection | manabi_fruit_collection | ✅ **v1.0.4完了** |
| subject_levels | manabi_subject_levels | ❌ 未移行 |
| pet_name | manabi_pet_name | ❌ 未移行 |
| robot_name | manabi_robot_name | ❌ 未移行 |
| selected_character | manabi_selected_character | ❌ 未移行 |
| puzzle | manabi_puzzle | ❌ 未移行 |
| costume | manabi_costume | ❌ 未移行 |
| display_mode | manabi_display_mode | ❌ 未移行 |

→ fruitCollection.jsのパターン（Supabase優先+localStorageフォールバック）を雛形として順次移行予定

---

## 🐛 既知のバグ・修正済み

### v1.0.4で修正済み
- ✅ 木の成長が教科練習でも発生する（ミッション限定にゲーティング）
- ✅ みまもり画面の曜日が1日ズレる（toISOStringのUTC問題 → toSafeDateStr統一）
- ✅ 日付フォーマットが機種依存で崩れる（toLocaleDateString('sv-SE') → 手動フォーマット）
- ✅ 📅カレンダーアイコンがApple端末で固定「17」表示（🗓️に変更）
- ✅ storage.js USER_LOCAL_KEYSにmanabi_fruit_collectionが抜けていた
- ✅ saveSubjectLevelsにreturn文がなかった（v0.4.1〜の古代バグ）
- ✅ rawPetNameバグ（App.jsがdisplayNameをpetNameで渡していた）

---

## 📋 次回タスク（優先順）

### Phase 1: ストア出店準備
1. 🎭 **木の成長演出強化**（葉ぴょん・花キラキラ・実ドドーン + キャラリアクション）
2. 🎭 **キャラ演出強化**（より動きのあるアニメーション）
3. 📸 **ストア用スクリーンショット撮影**（演出入れてから）
4. 📝 **ストア説明文・アイコン準備**
5. 🔨 **TWAビルド**（WebアプリをAndroidアプリ化）
6. 🏪 **Google Play Store出店申請**

### Phase 2: 品質向上
7. 🔢 **v1.0.5バージョンバンプ**（スレ29の修正を正式バージョンに）
8. 💰 **年間プラン実決済テスト**
9. 🔍 **Search Consoleクロール結果確認**（7/2〜3頃）
10. 🔐 **Googleバッジ取得申請**
11. 📊 **他のlocalStorage→Supabase移行**（subject_levels, pet_name等）

### Phase 3: 機能拡張
12. 🎰 **ガチャキャラを先生として選択可能にする**
13. 🌐 **バニティサブドメイン設定**（manabinoki.supabase.co）※CLI操作必要
14. 📉 **成長サイクル調整**（ユーザーフィードバックに基づき数値変更）

---

## ⚠️ 開発ルール・注意事項

### バージョンバンプ（4箇所同期）
1. `src/App.js` → `APP_VERSION = 'x.x.x'`
2. `package.json` → `"version": "x.x.x"`（※package-LOCK.jsonではない！）
3. `public/version.json` → `{"version": "x.x.x"}`
4. `docs/version.json` → `{"version": "x.x.x"}`

### DB変更チェックリスト
- カラム追加 → storage.js反映 + 関連ファイル確認
- RLS変更 → storage.js + App.js + PinGate.js動作確認
- テーブル追加 → storage.js関数追加
- **docs/supabase_structure.md を必ず同時更新**

### 画像アップロード
- ChatGPT生成画像はRGBモード（透過なし）→ flood-fill背景除去必須
- GitHub Web UI一括アップは5〜6枚ずつ + 目視確認

### デプロイ
- 複数ファイル変更時の中間ERRORは正常挙動（全ファイル揃うまで）
- ブランチプレビューは信用しない → mainに直接pushが確実
- 確認はVercelのlist_deploymentsでREADY状態を見る

### 日付処理
- **toISOString().split('T')[0] は使わない**（UTCでズレる）
- **toLocaleDateString('sv-SE') は使わない**（機種依存）
- **toSafeDateStr() パターン**を使う:
  ```javascript
  const toSafeDateStr = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  };
  ```

### soul-backupユーザー
- 誤削除防止のため管理ビューを完全隔離

---

## 🔧 ツール・接続情報

| ツール | 用途 |
|---|---|
| Supabase MCP（ndqbtfahtjaafroevgwq） | SQL直接実行・スキーマ管理 |
| Vercel MCP | デプロイ確認・ビルドログ |
| Stripe | 月額200円 + 年間2,100円 |
| GA4（G-64GLZZQC24） | アクセス解析 |
| Google Search Console | httpsプロパティ登録済み |
| GCP OAuth同意画面 | アプリ名「まなびの木」設定済み |
