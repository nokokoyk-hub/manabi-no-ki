# 🗄️ Supabase構造ドキュメント（まなびの木 + soul-backup 共有DB）

> このファイルはSupabaseのDB設計の正本です。
> テーブル変更・RLS変更・トリガー変更・Cron変更時は必ずこのファイルも更新すること。
> 最終更新: 2026-11-02（JST）。本番DBを**読み取り専用**で照会し、現行コード（main `1277954`）と突き合わせて全面更新。
> 前回: 2026-07-02（スレッド30）
> 追記: 2026-11-02 17:50頃（JST）マイグレーション `relax_learning_mode_and_fruits_checks` を適用（§10 の2件を解決）。下の「この版で確認した範囲」は照会時点の記録。

## 📌 この版で確認した範囲

- 確認方法: Supabase MCPで `pg_policies` / `pg_constraint` / `pg_proc` / `pg_trigger` / `cron.job` / `cron.job_run_details` / `information_schema` を照会（すべてSELECTのみ。DBは一切変更していない）
- 件数は **2026-11-02 JST 時点の照会結果**。以後は変動する
- Postgres: 17.6 / リージョン: ap-northeast-1（東京）/ 状態: ACTIVE_HEALTHY（2026-11-02確認）
- 前回からの主な差分: 問題587→**832問**、pg_cron追加、管理者専用ビュー `manabi_admin_users` 追加、Edge Function `create-portal-session` を記載、CHECK制約（値の上限ルール）を記載、⚠️ 要確認事項2件を新設（§10）

---

## 0. 共有プロジェクトの注意事項

| 項目 | 値 |
|---|---|
| Supabase Project ID | `ndqbtfahtjaafroevgwq` |
| 共有アプリ | **まなびの木**（学習アプリ）+ **soul-backup**（魂保存アプリ） |
| auth.users | 両アプリで共有（同一認証基盤） |
| アプリ識別方法 | `profiles` に存在 → まなびの木 / `soul_users` に存在 → soul-backup |
| appタグ | `auth.users.raw_user_meta_data.app`。まなびの木のOTPログインは `AuthScreen.js` で `data: { app: 'manabi-no-ki' }` を付与、App.jsにもフォールバックあり |

### ⚠️ 共有DBの絶対ルール
- **まなびの木のコードからsoul_*テーブルに触らない**
- **soul-backupのコードからprofiles/user_progress等に触らない**
- **auth.usersの削除は両アプリへの影響を確認してから**
- **RLSポリシーの変更は全アプリの動作を確認してから**

---

## 1. テーブル・ビュー一覧（2026-11-02 照会）

### 🌳 まなびの木 専用テーブル

| テーブル | 用途 | 行数 | RLS |
|---|---|---|---|
| `profiles` | ユーザー情報・課金状態・果実コレクション | 17 | ✅ `auth.uid()=id` |
| `user_progress` | 学習進捗（葉・花・実・ストリーク） | 12 | ✅ `auth.uid()=user_id` |
| `learning_sessions` | 学習セッション記録 | 144 | ✅ `auth.uid()=user_id` |
| `answer_history` | 回答履歴 | 1,263 | ✅ `auth.uid()=user_id` |
| `questions` | 問題データ | **832** | ✅ SELECTのみ全員可（公開データ） |

### 👻 soul-backup 専用テーブル

| テーブル | 用途 | 行数 | RLS |
|---|---|---|---|
| `soul_users` | soulアプリユーザー管理 | 5 | ✅ `auth.uid()=user_id` |
| `soul_backups` | バックアップデータ(JSONB) | 5 | ✅ `auth.uid()=user_id` |

### 📊 管理用ビュー・関数

| 名前 | 種別 | 状態 |
|---|---|---|
| `manabi_admin_users` | ビュー | 🆕 **管理者専用**。auth.users × profiles を結合し、メール・appタグ・表示名・プラン・トライアル開始日・Stripe有無・登録日・最終ログインを一覧表示。`security_invoker=on`（見る人の権限で動く）、権限は **postgres / service_role のみ**（anon・authenticated は参照不可）。ダッシュボードのSQLエディタ・MCP専用 |
| ~~`manabi_user_view`~~ / ~~`orphan_user_view`~~ / ~~`soul_user_management_view`~~ | ビュー | 🛡️ v1.0.6でDROP済み（auth.users露出のCRITICAL警告対策）。現在は存在しない（11/2確認） |
| `delete_manabi_user(target_email text)` | 関数 | まなびの木ユーザー安全削除（soulユーザーガード付き・CASCADE連鎖削除）。SECURITY DEFINER。実行権限は postgres / service_role のみ |
| `handle_new_user()` | 関数 | auth.users作成時のトリガー専用。SECURITY DEFINER。実行権限は postgres / service_role のみ |
| `handle_updated_at()` | 関数 | profiles の `updated_at` 自動更新（トリガー専用・SECURITY DEFINERではない） |
| `update_updated_at()` | 関数 | user_progress の `updated_at` 自動更新（トリガー専用・SECURITY DEFINERではない） |

> ✅ public スキーマの全4関数に `SET search_path = public` 設定済み（11/2確認）
> ℹ️ `handle_updated_at` / `update_updated_at` は anon・authenticated にも実行権限が残っているが、`updated_at` を書き換えるだけのトリガー関数で、トリガー外から呼んでも意味のある操作はできない（推測ではなく関数の役割からの判断。必要なら将来REVOKEを検討）
> ⚠️ ユーザー一覧の確認方法: Supabaseダッシュボード → SQLエディタで `select * from manabi_admin_users;`、またはちゃぴにMCP経由で依頼

### 🔗 外部キー制約（すべて ON DELETE CASCADE・11/2確認）

| テーブル | 制約 | 参照先 |
|---|---|---|
| profiles | profiles_id_fkey | auth.users(id) |
| user_progress | user_progress_user_id_fkey | auth.users(id) |
| learning_sessions | learning_sessions_user_id_fkey | auth.users(id) |
| answer_history | answer_history_user_id_fkey | auth.users(id) |
| soul_users | soul_users_user_id_fkey | auth.users(id) |
| soul_backups | soul_backups_user_id_fkey | auth.users(id) |

→ auth.users を1件削除すると、そのユーザーの全テーブルの行が連鎖削除される（soul側も含む）。

---

## 2. テーブル詳細

### profiles（まなびの木ユーザー）

| カラム | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| `id` | uuid | NO | — | auth.users.idへの参照（PK） |
| `device_id` | text | YES | null | レガシー。v1.0.3以降は使用しない |
| `display_name` | text | YES | null | 表示名 |
| `guardian_pin` | text | YES | null | 保護者PIN |
| `trial_started_at` | timestamptz | YES | null | トライアル開始日 |
| `subscription_status` | text | NO | 'trial' | trial / free / premium |
| `stripe_customer_id` | text | YES | null | Stripe顧客ID |
| `created_at` | timestamptz | NO | now() | 作成日時 |
| `updated_at` | timestamptz | NO | now() | 更新日時（`on_profiles_updated` トリガーで自動更新） |
| `fruit_collection` | jsonb | YES | null | 果実コレクション（v1.0.4追加）。`{items: {fruitId: {count, firstGotAt}}, totalHarvests, lastHarvestAt, migratedAt}` |

**RLSポリシー（対象ロール: public）:**
- SELECT: `auth.uid() = id`
- INSERT: `auth.uid() = id`
- UPDATE: `auth.uid() = id`
- DELETE: ポリシーなし（アプリからは削除不可。削除は `delete_manabi_user` か auth.users のCASCADE）

**プラン内訳（11/2）:** free 15 / premium 2 / trial 0

**📋 追加予定カラム（localStorage→Supabase移行計画）:**
| カラム | 型 | 説明 | 状態 |
|---|---|---|---|
| `subject_levels` | jsonb | 教科レベル設定（現localStorage `manabi_subject_levels`） | 🟠 未移行（優先候補） |
| `pet_name` | text | まめの名前（`manabi_pet_name`） | 🟡 未移行 |
| `robot_name` | text | ロボちゃんの名前（`manabi_robot_name`） | 🟡 未移行 |
| `selected_character` | text | 選択中のせんせい（`manabi_selected_character`。v1.0.13以降ガチャキャラIDも入る） | 🟡 未移行 |
| `puzzle_data` | jsonb | パズル進行（`manabi_puzzle`。パズルは5種） | 🟡 未移行 |
| `costume_data` | jsonb | 着せ替え（`manabi_costume`。v1.0.14で `equippedItems` 4スロット構造） | 🟡 未移行 |
| `display_mode` | text | 表示モード（`manabi_display_mode`） | 🟡 未移行 |

> ※ 移行パターンは fruitCollection.js が雛形（Supabase優先＋localStorageフォールバック＋初回ロード＋メモリキャッシュ＋デュアルライト）。
> ※ 移行時は初回ログインでlocalStorage→Supabase自動マイグレーションを実装し、既存ユーザーのデータを保全すること。

### user_progress（学習進捗）

| カラム | 型 | NULL | デフォルト | 制約 | 説明 |
|---|---|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() | PK | |
| `device_id` | text | NO | — | **UNIQUE** | レガシー。トレーサビリティ用に残存 |
| `user_id` | uuid | YES | null | | auth.users.id。v1.0.3以降は必須 |
| `leaves` | integer | YES | **5** | **0〜10** | 🍃 葉（成長計算用の内部カウンター。画面には出さない） |
| `flowers` | integer | YES | **2** | **0〜5** | 🌸 花の数 |
| `fruits` | integer | YES | 0 | **0以上（上限なし）** | 🍎 実の数（未収穫の実）。2026-11-02に上限3を撤廃 |
| `streak` | integer | YES | 0 | 0以上 | 🔥 連続学習日数 |
| `last_study_date` | date | YES | null | | 最終学習日 |
| `today_done` | boolean | YES | false | | 今日のミッション完了フラグ |
| `created_at` | timestamptz | YES | now() | | |
| `updated_at` | timestamptz | YES | now() | | `trigger_user_progress_updated` で自動更新 |

**RLSポリシー（対象ロール: authenticated）:** SELECT / INSERT / UPDATE / DELETE すべて `auth.uid() = user_id`

> ⚠️ DB側のデフォルト（葉5・花2）と、コード側 `storage.js` の `DEFAULT_PROGRESS`（葉0・花0）が違う。新規行は `insert({device_id, user_id})` で作られるため **DB側の5・2が入る**。成長計算は App.js `handleLearningComplete` 内1か所。
> ✅ 実（fruits）の上限3は2026-11-02に撤廃済み（§10 ②）。葉0〜10・花0〜5の上限は、成長計算（葉2→花、花2→実で繰り上げ）の範囲内なので維持。

### learning_sessions（学習セッション）

| カラム | 型 | NULL | デフォルト | 制約 | 説明 |
|---|---|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() | PK | |
| `device_id` | text | NO | — | | レガシー |
| `user_id` | uuid | YES | null | | auth.users.id |
| `mode` | text | NO | — | **下記9種のみ**（2026-11-02拡張） | 学習モード |
| `score` | integer | NO | — | 0以上 | スコア |
| `total_questions` | integer | NO | — | 1以上 | 出題数 |
| `completed_at` | timestamptz | YES | now() | | 完了日時 |

**RLSポリシー（authenticated）:** SELECT / INSERT / UPDATE / DELETE すべて `auth.uid() = user_id`

**受け付ける `mode`（CHECK制約 `learning_sessions_mode_check`）:** `mission` / `okurigana` / `clock` / `math` / `kokugo` / `shakai` / `doutoku` / `rika` / `genso`
→ アプリ側の学習モード（`App.js` の `startLearning`、`SubjectMenuScreen.js`、`FukushuScreen.js` の `startMode`）と**必ず一致させる**。教科を増やすときはこの制約も同時に変更する。

**記録の実績（11/2・制約拡張前）:** mission 141件（6/18〜10/31）/ okurigana 2件 / clock 1件。教科練習の記録は制約で弾かれていたため0件（§10 ①）。拡張前の教科練習の記録は復元できない。

### answer_history（回答履歴）

| カラム | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() | PK |
| `device_id` | text | NO | — | レガシー |
| `user_id` | uuid | YES | null | auth.users.id |
| `question_id` | text | NO | — | 問題ID（questions.question_id と対応。外部キーではない） |
| `is_correct` | boolean | NO | — | 正答フラグ |
| `answered_at` | timestamptz | YES | now() | 回答日時 |

**RLSポリシー（authenticated）:** SELECT / INSERT / UPDATE / DELETE すべて `auth.uid() = user_id`
**索引:** user_id / device_id / question_id / 誤答だけの部分索引（device_id, is_correct WHERE is_correct=false）

### questions（問題データ）

| カラム | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| `id` | integer | NO | serial | PK |
| `question_id` | text | NO | — | 問題ID（**UNIQUE**） |
| `subject` | text | NO | — | 教科（ひらがな表記: こくご・さんすう・しゃかい・どうとく・りか・とけい・げんそ） |
| `subject_emoji` | text | NO | '📝' | 教科絵文字（同じ教科でも複数の絵文字が混在している。表示の正本はコード側） |
| `category` | text | YES | null | カテゴリ |
| `type` | text | NO | 'text' | 問題タイプ |
| `grade_level` | integer | NO | 1 | レベル1〜6（教科別レベル設定と連動） |
| `question` | text | NO | — | 問題文（ひらがな版） |
| `question_advanced` | text | YES | null | 問題文（漢字版）。NULLならひらがな版にフォールバック（11/2時点 763/832問に設定） |
| `hint` | text | YES | null | ヒント |
| `options` | jsonb | NO | — | 選択肢 |
| `options_advanced` | jsonb | YES | null | 選択肢（漢字版）。NULLならoptionsにフォールバック。正解インデックスは共通 |
| `correct` | integer | NO | — | 正解インデックス |
| `explanation` | text | YES | null | 解説（ひらがな版）。832/832問 |
| `explanation_advanced` | text | YES | null | 解説（漢字版）。832/832問 |
| `clock_time` | jsonb | YES | null | 時計問題用データ |
| `active` | boolean | NO | true | falseで出題されなくなる（11/2時点 全問true） |
| `created_at` | timestamptz | YES | now() | 作成日時 |
| `updated_at` | timestamptz | YES | now() | 更新日時（トリガーなし。手動更新時は自分で更新する） |

**RLS:** `Allow anonymous read`（SELECT・全員可）のみ。INSERT/UPDATE/DELETEのポリシーなし → アプリからは書き換え不可。問題の追加はちゃぴがMCP経由のSQLで行う（手順: `docs/question_add_checklist.md`）。

**教科×レベル別の問題数（11/2照会）:**

| 教科 | Lv1 | Lv2 | Lv3 | Lv4 | Lv5 | Lv6 | 合計 |
|---|---|---|---|---|---|---|---|
| こくご | 20 | 20 | 20 | 20 | 30 | 30 | 140 |
| さんすう | 22 | 20 | 20 | 20 | 20 | 20 | 122 |
| しゃかい | 20 | 20 | 20 | 20 | 20 | 20 | 120 |
| どうとく | 20 | 20 | 20 | 20 | 20 | 20 | 120 |
| りか | 20 | 20 | 20 | 20 | 20 | 20 | 120 |
| とけい | 20 | 20 | 20 | 20 | 20 | 20 | 120 |
| げんそ | 15 | 15 | 15 | 15 | 15 | 15 | 90 |
| **合計** | | | | | | | **832** |

**問題IDの接頭辞（11/2照会）:**

| 接頭辞 | 教科と件数 | メモ |
|---|---|---|
| `math-` | さんすう 122 | |
| `kokugo-` / `okuri-` / （ハイフンなし） | こくご 75 / 12 / 53 | |
| `clock-` / （ハイフンなし） | とけい 59 / 61 | |
| （ハイフンなし） | しゃかい 120 / どうとく 120 | |
| `life-` / `kagaku-` / `rika-` | りか 62 / 36 / 22 | |
| `kagaku-` / `genso-` | げんそ 82 / 8 | |

> ⚠️ `kagaku-` は りか と げんそ で共用されている。**新規追加は りか=`rika-lN-XXX`、げんそ=`genso-lN-XXX`** を使い、INSERT前に既存IDとの重複をSELECTで確認する。既存IDは回答履歴と結びついているので一括変更しない。

**追加日（created_at・JST）:** 7/22 10件 / 7/24 20件 / 7/25 10件 / 7/26 95件 / 8/4 25件 / 8/19 67件 / 9/12 18件。最終追加は 2026-09-12。

---

## 3. トリガー

| トリガー | 対象 | タイミング | 関数 |
|---|---|---|---|
| `on_auth_user_created` | auth.users | AFTER INSERT（行ごと） | `handle_new_user()` |
| `on_profiles_updated` | profiles | BEFORE UPDATE（行ごと） | `handle_updated_at()` |
| `trigger_user_progress_updated` | user_progress | BEFORE UPDATE（行ごと） | `update_updated_at()` |

### handle_new_user のロジック
1. `raw_user_meta_data.app` が `'soul-backup'` → profilesにINSERTしない
2. `soul_users` に既に存在する → profilesにINSERTしない
3. 上記以外 → profilesにINSERT（trial_started_at = now()）

**既知の問題:**
- profileを手動削除してもauth.usersが残る → 再ログインでトリガー不発火 → App.jsのprofile自動作成フォールバックで対策済み

---

## 4. 自動実行（pg_cron）🆕

| ジョブ | スケジュール | 状態 | 内容 |
|---|---|---|---|
| `expire-trial-to-free`（jobid 1） | `0 0 * * *`（毎日 UTC 0:00 = **JST 9:00**） | ✅ active | `subscription_status='trial'` かつ `trial_started_at` から5日超のprofilesを `free` に更新 |

**実行実績（11/2確認）:** 初回 2026-07-19 / 計107回 / 失敗0回 / 最終 2026-11-02 09:00 JST

> ⚠️ トライアル日数（5日）を変える時は、このジョブのSQLとアプリ側の表示（PremiumGate・みまもり等）を同時に変えること。

---

## 5. RLS設定一覧（11/2照会）

| テーブル | 対象ロール | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|---|
| profiles | public | `auth.uid()=id` | `auth.uid()=id` | `auth.uid()=id` | なし |
| user_progress | authenticated | `auth.uid()=user_id` | 同左 | 同左 | 同左 |
| learning_sessions | authenticated | `auth.uid()=user_id` | 同左 | 同左 | 同左 |
| answer_history | authenticated | `auth.uid()=user_id` | 同左 | 同左 | 同左 |
| questions | public | `true` | なし | なし | なし |
| soul_users | public | `auth.uid()=user_id` | 同左 | 同左 | なし |
| soul_backups | public | `auth.uid()=user_id` | 同左 | 同左 | 同左 |

> 対象ロール public でも、未ログイン（anon）では `auth.uid()` がNULLになるため、questions 以外は自分の行しか触れない。

---

## 6. Edge Functions（11/2照会）

| 関数名 | 用途 | JWT検証 | バージョン | 呼び出し元 |
|---|---|---|---|---|
| `stripe-webhook` | Stripe決済イベント → `profiles.subscription_status` 自動更新 | なし（Stripe署名で検証する設計） | v9 | Stripe |
| `create-portal-session` | 🆕記載 Stripeの「プラン管理ページ」URL発行 | なし（関数内でトークン確認する設計） | v11 | `src/screens/MimamoriScreen.js`（premium時のポータルボタン） |

> 関数の中身（ソース）は今回読んでいない。署名検証・トークン確認の実装は過去の記録に基づく記載。

---

## 7. ファイル波及マップ（main `1277954` で確認）

### テーブル・認証 → JSファイル

| 対象 | 参照ファイル | 操作 |
|---|---|---|
| `profiles` | `src/App.js` | SELECT, UPSERT（profile自動作成フォールバック） |
| | `src/components/PinGate.js` | SELECT, UPDATE（guardian_pin） |
| | `src/lib/fruitCollection.js` | SELECT, UPDATE（fruit_collection） |
| `user_progress` | `src/lib/storage.js` | SELECT, INSERT, UPDATE |
| `learning_sessions` | `src/lib/storage.js`（`recordSession` ほか） | INSERT, SELECT |
| `answer_history` | `src/lib/storage.js` | INSERT, SELECT（みまもり・復習用の取得も storage.js 経由） |
| `questions` | `src/lib/questionLoader.js` | SELECT（出題） |
| | `src/lib/storage.js` | SELECT（復習・みまもり表示用に question_id から教科を引く） |
| 認証 | `src/screens/AuthScreen.js` | signInWithOAuth（Google）, signInWithOtp, verifyOtp |
| | `src/App.js` | getSession, onAuthStateChange, signOut, updateUser |
| | `src/lib/supabase.js` | getSession（v1.0.12: 8秒タイムアウト） |
| Edge Function | `src/screens/MimamoriScreen.js` | `create-portal-session` を fetch |

> 旧版にあった「LearningScreen.js / MimamoriScreen.js が answer_history を直接SELECT」は現行コードでは storage.js 経由に変わっている。

### ⚠️ DB変更時のチェックリスト
- カラム追加 → storage.jsのINSERT/SELECT/UPDATEに反映
- RLS変更 → storage.js + App.js + PinGate.jsの動作確認
- テーブル追加 → storage.jsに関数追加 + App.jsから呼び出し
- トリガー変更 → AuthScreen.js + App.jsの認証フローに影響
- CHECK制約の変更 → 送っている値（モード名・上限）をコード側でgrepして合わせる
- Cron変更 → この文書 §4 と北極星を同時更新

---

## 8. 認証フロー

### Google OAuth
```
AuthScreen.js signInWithOAuth → Google → callback → auth.users INSERT
→ handle_new_user トリガー → profiles INSERT（soulユーザーでなければ）
→ App.js onAuthStateChange → setCurrentUserId → fetchProfile
```

### メール OTP
```
AuthScreen.js signInWithOtp（options.data.app='manabi-no-ki'）→ Supabase がOTPメール送信
⚠️ shouldCreateUser未指定 → 未登録メールでもauth.users自動作成（孤児ユーザーの原因になりうる）
→ ユーザーがOTPコード入力 → verifyOtp → 認証完了
→ App.js onAuthStateChange → 以降同じ
```

---

## 9. ユーザー状況と改善計画

### auth.users 内訳（2026-11-02 照会・件数のみ）

| 状態 | 件数 |
|---|---|
| auth.users 合計 | 21 |
| profiles（まなびの木） | 17（うち2件はsoulにも所属） |
| soul_users | 5 |
| 両方に所属（のんのテスト用） | 2 |
| 🔴 孤児（どちらにもいない） | **1** |
| 7/26以降の新規登録 | 3 |

### 改善計画

| 対策 | 内容 | 状態 |
|---|---|---|
| RLS強化 | 進捗系3表を auth.uid()=user_id に | ✅ 完了（6/25） |
| ログアウト機能 | みまもり画面＋PremiumGate | ✅ 完了（6/26） |
| appタグ付与の徹底 | SQL一括＋AuthScreen OTP＋App.jsフォールバック | ✅ 完了（6/26） |
| 管理ビューの安全化 | 旧3ビューDROP、管理者専用 `manabi_admin_users` を security_invoker＋権限制限で用意 | ✅ 完了 |
| signInWithOtp修正 | `shouldCreateUser: false` 追加 | 🔴 未対応（11/2時点もコードに無し） |
| 孤児ユーザー掃除 | profilesにもsoul_usersにもないauth.users（現在1件） | 🔴 未対応（削除は要承認） |
| 重複所属の解消 | 両方に所属する2件の整理 | 🟡 将来 |

---

## 10. ✅ 2026-11-02 に見つかり、同日に解決した食い違い

どちらも **DBの決まり（CHECK制約）とアプリが送る値の食い違い** が根本原因。保存失敗は `storage.js` の `console.error` だけで終わり、画面にも通知されないため発見が遅れた。

**適用したマイグレーション:** `relax_learning_mode_and_fruits_checks`（2026-11-02 JST、のん承認のうえ適用）
**ロールバックSQL:** `docs/rollback/2026-11-02_relax_mode_and_fruits_checks.sql`（元の制約に戻す。既存データは壊れない）
**適用後の検証:** 6教科のモードの記録と fruits=7 の保存が通り、未知のモード名は引き続き弾かれることを、ロールバックするテストで確認。本番データは変化なし（記録144件・実の最大1）。

### ① learning_sessions.mode が3種類しか受け付けなかった
- **原因:** CHECK制約が `{mission, okurigana, clock}` のまま。アプリは `recordSession(learningMode, …)` で教科練習のモード名（`math`・`kokugo`・`shakai`・`doutoku`・`rika`・`genso`）も送っていた。
- **影響:** 教科練習の記録が全件弾かれていた（11/2時点で0件）。**みまもりの週間カレンダー**（`MimamoriScreen.js` は `learning_sessions` で「やった日」を判定）に教科練習の日が出ず、**ふくしゅう画面**（`FukushuScreen.js`）の math/kokugo/shakai/doutoku の成績も空だった。問題ごとの正誤 `answer_history` は別表で正常に保存されていた。
- **対応:** 制約を上記9種に拡張。拡張前の教科練習の記録は復元しない（`answer_history` からの推測再構成は「本物の記録」と混ざるため見送り）。

### ② user_progress.fruits の上限が3だった
- **原因:** CHECK制約 `fruits 0〜3`。アプリの成長計算に上限はなく、収穫しないと実は増え続ける。
- **影響:** 実が4つになる保存（＝約16日分ミッションを収穫せず続けた時点）は UPDATE 全体が失敗し、葉・花・連続日数・今日の完了もクラウドに残らない状態になり得た。11/2時点の最大は fruits=1 で、実害を受けたユーザーはいない。
- **対応:** 制約を `fruits >= 0` に変更（上限なし）。

### 残課題（コード側・次のPRで対応予定）
- 学習モード一覧がアプリ内の複数ファイルに散らばっている → 1か所にまとめ、DBの許可一覧との一致をテストで見張る
- `FukushuScreen.js` の `DEFAULT_REVIEW_MODES` に `rika`・`genso` が入っていない
- 保存失敗を握りつぶす構造（`console.error` のみ）は将来対応の候補

---

## 11. 触ってはいけない箇所

### DB側
- `handle_new_user` トリガー → 修正する場合は両アプリへの影響を確認
- `soul_*` テーブル → まなびの木のコードから触らない
- `profiles` のRLSポリシー → 既に適切。変更不要
- `manabi_admin_users` → anon / authenticated に権限を付けない（メールアドレスが露出する）
- `questions` → 直接UPDATE/DELETEしない。追加は `docs/question_add_checklist.md` の手順で
- `expire-trial-to-free` ジョブ → 課金状態を毎日書き換える。止める・変える時は要承認

### コード側（storage.js）
- `loadProgress` のストリークチェックロジック → 日付計算の変更は慎重に（`toSafeDateStr()` パターン）
- `applyIdFilter` → user_id一本化済み。device_idフォールバックを復活させない
- `checkAndSwitchUser` → アカウント切替検出。削除するとlocalStorage混線が再発

### コード側（App.js）
- `fetchProfile` のprofile自動作成フォールバック → トリガー不発対策。削除しない
- `onAuthStateChange` → 認証フローの根幹。変更は慎重に
- Stripe Webhook関連の処理 → 課金に直結

---

> 作成: ちゃぴ（2026-06-26 スレッド25）
> 更新: 2026-06-30 スレッド29 / 2026-07-02 スレッド30 / **2026-11-02 本番DB読み取り照会による全面更新**
> 次回更新: 学習モード（教科）追加時、localStorage→Supabase移行時、問題追加でテーブル構造が変わる時
