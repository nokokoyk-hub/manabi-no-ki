# 🗄️ Supabase構造ドキュメント（まなびの木 + soul-backup 共有DB）

> このファイルはSupabaseのDB設計の正本です。
> テーブル変更・RLS変更・トリガー変更時は必ずこのファイルも更新すること。
> 最終更新: 2026-06-26（JST）

---

## 0. 共有プロジェクトの注意事項

| 項目 | 値 |
|---|---|
| Supabase Project ID | `ndqbtfahtjaafroevgwq` |
| 共有アプリ | **まなびの木**（学習アプリ）+ **soul-backup**（魂保存アプリ） |
| auth.users | 両アプリで共有（同一認証基盤） |
| アプリ識別方法 | `profiles` に存在 → まなびの木 / `soul_users` に存在 → soul-backup |
| appタグ | `auth.users.raw_user_meta_data.app`（まなびの木ユーザー全員に`manabi-no-ki`付与済み。新規はAuthScreen OTP＋App.jsフォールバックで自動付与） |

### ⚠️ 共有DBの絶対ルール
- **まなびの木のコードからsoul_*テーブルに触らない**
- **soul-backupのコードからprofiles/user_progress等に触らない**
- **auth.usersの削除は両アプリへの影響を確認してから**
- **RLSポリシーの変更は全アプリの動作を確認してから**

---

## 1. テーブル一覧

### 🌳 まなびの木 専用テーブル

| テーブル | 用途 | RLS | 危険度 |
|---|---|---|---|
| `profiles` | ユーザー情報・課金状態 | ✅ `auth.uid()=id` | 安全 |
| `user_progress` | 学習進捗（葉・花・実・ストリーク） | ✅ `auth.uid()=user_id` | 安全（6/25修正） |
| `learning_sessions` | 学習セッション記録 | ✅ `auth.uid()=user_id` | 安全（6/25修正） |
| `answer_history` | 回答履歴 | ✅ `auth.uid()=user_id` | 安全（6/25修正） |
| `questions` | 問題データ（587問） | ✅ `true`（読み取りのみ） | 安全（公開データ） |

### 👻 soul-backup 専用テーブル

| テーブル | 用途 | RLS | 危険度 |
|---|---|---|---|
| `soul_users` | soulアプリユーザー管理 | ✅ `auth.uid()=user_id` | 安全 |
| `soul_backups` | バックアップデータ(JSONB) | ✅ `auth.uid()=user_id` | 安全 |

### 📊 管理用ビュー・関数

| 名前 | 種別 | 用途 |
|---|---|---|
| `manabi_user_view` | ビュー | まなびの木ユーザー管理（メール・プラン・学習データ・最終学習日） |
| `orphan_user_view` | ビュー | 孤児ユーザーチェック（どのアプリにも所属しないauth.users） |
| `soul_user_management_view` | ビュー | soul-backupユーザー管理用 |
| `delete_manabi_user(email)` | 関数 | まなびの木ユーザー安全削除（soulユーザーガード付き・CASCADE連鎖削除） |

### 🔗 外部キー制約（6/25 CASCADE追加）

| テーブル | 制約 | 参照先 | DELETE時 |
|---|---|---|---|
| profiles | profiles_id_fkey | auth.users(id) | **CASCADE** |
| user_progress | user_progress_user_id_fkey | auth.users(id) | **CASCADE**（6/25変更） |
| learning_sessions | learning_sessions_user_id_fkey | auth.users(id) | **CASCADE**（6/25変更） |
| answer_history | answer_history_user_id_fkey | auth.users(id) | **CASCADE**（6/25変更） |

---

## 2. テーブル詳細

### profiles（まなびの木ユーザー）

| カラム | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| `id` | uuid | NO | — | auth.users.idへの参照（PK） |
| `device_id` | text | YES | null | レガシー。v1.0.3以降は使用しない |
| `display_name` | text | YES | null | 表示名 |
| `guardian_pin` | text | YES | null | 保護者PIN（ハッシュ保存） |
| `trial_started_at` | timestamptz | YES | null | トライアル開始日 |
| `subscription_status` | text | NO | 'trial' | free / trial / premium |
| `stripe_customer_id` | text | YES | null | Stripe顧客ID |
| `created_at` | timestamptz | NO | now() | 作成日時 |
| `updated_at` | timestamptz | NO | now() | 更新日時 |

**RLSポリシー:**
- SELECT: `auth.uid() = id` ✅
- INSERT: `auth.uid() = id` ✅
- UPDATE: `auth.uid() = id` ✅

**📋 追加予定カラム（localStorage→Supabase移行計画 / App Store出店に向けて）:**
| カラム | 型 | 説明 | 優先度 |
|---|---|---|---|
| `fruit_collection` | jsonb | 果実コレクション（現localStorage `manabi_fruit_collection`） | 🔴 最重要 |
| `subject_levels` | jsonb | 教科レベル設定（現localStorage `manabi_subject_levels`） | 🟠 |
| `pet_name` | text | まめの名前（現localStorage `manabi_pet_name`） | 🟡 |
| `robot_name` | text | ロボちゃんの名前（現localStorage `manabi_robot_name`） | 🟡 |
| `selected_character` | text | 選択中キャラ（現localStorage `manabi_selected_character`） | 🟡 |
| `puzzle_data` | jsonb | パズルデータ（現localStorage `manabi_puzzle`） | 🟡 |
| `costume_data` | jsonb | 着せ替えデータ（現localStorage `manabi_costume`） | 🟡 |

> ※ 移行時は初回ログインでlocalStorage→Supabase自動マイグレーション機能を実装し、既存ユーザーのデータを保全すること。
> ※ App Store出店前に最低限 `fruit_collection` の移行は必須（デバイス間同期がないと審査で指摘される可能性）。

### user_progress（学習進捗）

| カラム | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() | PK |
| `device_id` | text | NO | — | レガシー。トレーサビリティ用に残存 |
| `user_id` | uuid | YES | null | auth.users.id。v1.0.3以降は必須 |
| `leaves` | integer | YES | 5 | 🍃 葉っぱの数 |
| `flowers` | integer | YES | 2 | 🌸 花の数 |
| `fruits` | integer | YES | 0 | 🍎 実の数 |
| `streak` | integer | YES | 0 | 🔥 連続学習日数 |
| `last_study_date` | date | YES | null | 最終学習日 |
| `today_done` | boolean | YES | false | 今日のミッション完了フラグ |
| `created_at` | timestamptz | YES | now() | 作成日時 |
| `updated_at` | timestamptz | YES | now() | 更新日時 |

**RLSポリシー（6/25修正済み）:**
- SELECT: `auth.uid() = user_id` ✅
- INSERT: `auth.uid() = user_id` ✅
- UPDATE: `auth.uid() = user_id` ✅
- DELETE: `auth.uid() = user_id` ✅

### learning_sessions（学習セッション）

| カラム | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() | PK |
| `device_id` | text | NO | — | レガシー |
| `user_id` | uuid | YES | null | auth.users.id |
| `mode` | text | NO | — | 学習モード（mission等） |
| `score` | integer | NO | — | スコア |
| `total_questions` | integer | NO | — | 出題数 |
| `completed_at` | timestamptz | YES | now() | 完了日時 |

**RLSポリシー（6/25修正済み）:**
- SELECT: `auth.uid() = user_id` ✅
- INSERT: `auth.uid() = user_id` ✅
- UPDATE: `auth.uid() = user_id` ✅
- DELETE: `auth.uid() = user_id` ✅

### answer_history（回答履歴）

| カラム | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() | PK |
| `device_id` | text | NO | — | レガシー |
| `user_id` | uuid | YES | null | auth.users.id |
| `question_id` | text | NO | — | 問題ID |
| `is_correct` | boolean | NO | — | 正答フラグ |
| `answered_at` | timestamptz | YES | now() | 回答日時 |

**RLSポリシー（6/25修正済み）:**
- SELECT: `auth.uid() = user_id` ✅
- INSERT: `auth.uid() = user_id` ✅
- UPDATE: `auth.uid() = user_id` ✅
- DELETE: `auth.uid() = user_id` ✅

### questions（問題データ）

| カラム | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| `id` | integer | NO | serial | PK |
| `question_id` | text | NO | — | 問題ID（math_001等） |
| `subject` | text | NO | — | 教科 |
| `subject_emoji` | text | NO | '📝' | 教科絵文字 |
| `category` | text | YES | null | カテゴリ |
| `type` | text | NO | 'text' | 問題タイプ |
| `grade_level` | integer | NO | 1 | 学年レベル |
| `question` | text | NO | — | 問題文（ひらがな版） |
| `question_advanced` | text | YES | null | 問題文（漢字版） |
| `hint` | text | YES | null | ヒント |
| `options` | jsonb | NO | — | 選択肢 |
| `options_advanced` | jsonb | YES | null | 選択肢（漢字版） |
| `correct` | integer | NO | — | 正解インデックス |
| `explanation` | text | YES | null | 解説（ひらがな版） |
| `explanation_advanced` | text | YES | null | 解説（漢字版） |
| `clock_time` | jsonb | YES | null | 時計問題用データ |
| `active` | boolean | NO | true | 有効フラグ |

**RLS: 読み取りのみ許可 ✅（全ユーザー共通の問題データ）**

---

## 3. トリガー

### handle_new_user（auth.users INSERT時に発火）

```
発火: auth.usersにINSERTされた時（AFTER INSERT FOR EACH ROW）
権限: SECURITY DEFINER（postgres権限で実行）
```

**ロジック:**
1. `raw_user_meta_data.app` が `'soul-backup'` → profilesにINSERTしない（RETURN NEW）
2. `soul_users` に既に存在する → profilesにINSERTしない（RETURN NEW）
3. 上記以外 → profilesにINSERT（trial_started_at = now()）

**既知の問題:**
- appタグが付いていないsoul-backupユーザーが存在（2/6件） → ガード2で救済されてるが不完全
- profileを手動削除してもauth.usersが残る → 再ログインでトリガー不発火（INSERTではなくUPDATE） → App.jsのupsertフォールバックで対策済み

---

## 4. RLS設定一覧（6/25更新）

| テーブル | 状態 | ポリシー | 更新日 |
|---|---|---|---|
| profiles | ✅ | auth.uid()=id | — |
| user_progress | ✅ | auth.uid()=user_id（SELECT/INSERT/UPDATE/DELETE） | 6/25 |
| learning_sessions | ✅ | auth.uid()=user_id（SELECT/INSERT/UPDATE/DELETE） | 6/25 |
| answer_history | ✅ | auth.uid()=user_id（SELECT/INSERT/UPDATE/DELETE） | 6/25 |
| questions | ✅ | SELECT true（読み取りのみ） | — |
| soul_backups | ✅ | auth.uid()=user_id | — |
| soul_users | ✅ | auth.uid()=user_id | — |

---

## 5. ファイル波及マップ

### テーブル → JSファイル

| テーブル | 参照ファイル | 操作 |
|---|---|---|
| `profiles` | `src/App.js` | SELECT, UPSERT |
| | `src/components/PinGate.js` | SELECT, UPDATE |
| `user_progress` | `src/lib/storage.js` | SELECT, INSERT, UPDATE |
| `learning_sessions` | `src/lib/storage.js` | INSERT, SELECT |
| `answer_history` | `src/lib/storage.js` | INSERT, SELECT |
| | `src/screens/LearningScreen.js` | SELECT（参照のみ） |
| | `src/screens/MimamoriScreen.js` | SELECT（参照のみ） |
| `questions` | `src/lib/questionLoader.js` | SELECT |
| `auth（認証）` | `src/screens/AuthScreen.js` | signInWithOAuth, signInWithOtp |
| | `src/App.js` | onAuthStateChange, signOut |

### ⚠️ DB変更時のチェックリスト
- カラム追加 → storage.jsのINSERT/SELECT/UPDATEに反映
- RLS変更 → storage.js + App.js + PinGate.jsの動作確認
- テーブル追加 → storage.jsに関数追加 + App.jsから呼び出し
- トリガー変更 → AuthScreen.js + App.jsの認証フローに影響

---

## 6. 認証フロー

### Google OAuth
```
AuthScreen.js signInWithOAuth → Google → callback → auth.users INSERT
→ handle_new_user トリガー → profiles INSERT（soulユーザーでなければ）
→ App.js onAuthStateChange → setCurrentUserId → fetchProfile
```

### メール OTP
```
AuthScreen.js signInWithOtp → Supabase がOTPメール送信
⚠️ shouldCreateUser未指定 → 未登録メールでもauth.users自動作成（孤児ユーザーの原因）
→ ユーザーがOTPコード入力 → verifyOtp → 認証完了
→ App.js onAuthStateChange → 以降同じ
```

---

## 7. 現在の問題点（調査結果 2026-06-25）

### auth.users 9件の内訳

| 状態 | 件数 | 説明 |
|---|---|---|
| 🌳 まなびの木のみ | 4件 | 正常（appタグ付与済み） |
| 👻 soulのみ | 3件 | 正常 |
| ⚠️ 両方に所属 | 2件 | のんのテスト用。構造的に混線リスク |
| 🔴 孤児 | **0件** | ✅ 6/25に5件削除完了 |
| appタグ設定済み | まなびの木全員 | ✅ 6/26にSQL一括＋自動付与設定完了 |

### 改善計画

| 対策 | 内容 | 状態 |
|---|---|---|
| RLS強化 | user_progress/learning_sessions/answer_history を auth.uid()=user_id に | ✅ **完了（6/25）** |
| signInWithOtp修正 | shouldCreateUser: false 追加 | 🔴 次回 |
| 孤児ユーザー掃除 | profilesにもsoul_usersにもないauth.users削除 | 🔴 次回 |
| ログアウト機能 | みまもり画面＋PremiumGateにログアウトボタン追加 | ✅ **完了（6/26）** |
| appタグ付与の徹底 | SQL一括＋AuthScreen OTP＋App.jsフォールバック | ✅ **完了（6/26）** |
| 重複所属の解消 | profiles＋soul_users両方にいる3件の整理 | 🟡 将来 |

---

## 8. 触ってはいけない箇所

### DB側
- `handle_new_user` トリガー → 修正する場合は両アプリへの影響を確認
- `soul_*` テーブル → まなびの木のコードから触らない
- `profiles` のRLSポリシー → 既に適切。変更不要
- `questions` テーブル → Google Sheets連携で管理。直接編集しない

### コード側（storage.js）
- `loadProgress` のストリークチェックロジック → 日付計算の変更は慎重に
- `applyIdFilter` → user_id一本化済み。device_idフォールバックを復活させない
- `checkAndSwitchUser` → アカウント切替検出。削除するとlocalStorage混線が再発

### コード側（App.js）
- `fetchProfile` のprofile自動作成フォールバック → トリガー不発対策。削除しない
- `onAuthStateChange` → 認証フローの根幹。変更は慎重に
- Stripe Webhook関連の処理 → 課金に直結

---

## 9. Edge Functions

| 関数名 | 用途 | JWT | アプリ |
|---|---|---|---|
| `stripe-webhook` | Stripe決済イベント処理 | なし | まなびの木 |
| (今後追加予定) | ログアウト・アカウント削除等 | — | — |

---

> 作成: ちゃぴ
> 日時: 2026-06-26（金）スレッド25
> 次回更新: 実の収穫機能実装・コレクションテーブル追加等
