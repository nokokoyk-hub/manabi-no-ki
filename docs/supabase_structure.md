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
| appタグ | `auth.users.raw_user_meta_data.app`（理想だが未設定が多い。13/15件がnull） |

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
| `user_progress` | 学習進捗（葉・花・実・ストリーク） | ⚠️ `true`（全員閲覧可能） | 🔴 要修正 |
| `learning_sessions` | 学習セッション記録 | ⚠️ `true`（全員閲覧可能） | 🔴 要修正 |
| `answer_history` | 回答履歴 | ⚠️ `true`（全員閲覧可能） | 🔴 要修正 |
| `questions` | 問題データ（587問） | ✅ `true`（読み取りのみ） | 安全（公開データ） |

### 👻 soul-backup 専用テーブル

| テーブル | 用途 | RLS | 危険度 |
|---|---|---|---|
| `soul_users` | soulアプリユーザー管理 | ✅ `auth.uid()=user_id` | 安全 |
| `soul_backups` | バックアップデータ(JSONB) | ✅ `auth.uid()=user_id` | 安全 |

### 📊 管理用ビュー（読み取り専用）

| ビュー | 用途 |
|---|---|
| `user_management_view` | まなびの木ユーザー管理用 |
| `soul_user_management_view` | soul-backupユーザー管理用 |

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

**RLSポリシー（現状）:**
- ALL: `true` ⚠️ **全員が全レコードにアクセス可能 → 要修正**

**RLSポリシー（あるべき姿）:**
- SELECT: `auth.uid() = user_id`
- INSERT: `auth.uid() = user_id`
- UPDATE: `auth.uid() = user_id`
- DELETE: `auth.uid() = user_id`

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

**RLSポリシー: `true` ⚠️ → `auth.uid() = user_id` に要修正**

### answer_history（回答履歴）

| カラム | 型 | NULL | デフォルト | 説明 |
|---|---|---|---|---|
| `id` | uuid | NO | gen_random_uuid() | PK |
| `device_id` | text | NO | — | レガシー |
| `user_id` | uuid | YES | null | auth.users.id |
| `question_id` | text | NO | — | 問題ID |
| `is_correct` | boolean | NO | — | 正答フラグ |
| `answered_at` | timestamptz | YES | now() | 回答日時 |

**RLSポリシー: `true` ⚠️ → `auth.uid() = user_id` に要修正**

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

## 4. RLS設定一覧（現状と改善計画）

| テーブル | 現状 | あるべき姿 | 優先度 |
|---|---|---|---|
| profiles | ✅ auth.uid()=id | そのまま | — |
| user_progress | ⚠️ true | auth.uid()=user_id | 🔴 高 |
| learning_sessions | ⚠️ true | auth.uid()=user_id | 🔴 高 |
| answer_history | ⚠️ true | auth.uid()=user_id | 🔴 高 |
| questions | ✅ SELECT true | そのまま | — |
| soul_backups | ✅ auth.uid()=user_id | そのまま | — |
| soul_users | ✅ auth.uid()=user_id | そのまま | — |

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

## 7. 現在の問題点（調査結果 2026-06-26）

### auth.users 15件の内訳

| 状態 | 件数 | 説明 |
|---|---|---|
| 🌳 まなびの木のみ | 3件 | 正常 |
| 👻 soulのみ | 3件 | 正常 |
| ⚠️ 両方に所属 | 3件 | のんのテスト用。構造的に混線リスク |
| 🔴 孤児（どちらにも未所属） | 6件 | OTP自動作成 or テスト残骸 |
| appタグ未設定 | 13/15件 | 振り分け機能が実質無効 |

### 改善計画（承認待ち）

| 対策 | 内容 | Phase |
|---|---|---|
| signInWithOtp修正 | shouldCreateUser: false 追加 | 次回 |
| 孤児ユーザー掃除 | profilesにもsoul_usersにもないauth.users削除 | 次回 |
| RLS強化 | user_progress/learning_sessions/answer_history を auth.uid()=user_id に | 次回 |
| ログアウト機能 | みまもり画面にログアウトボタン追加 | 次回 |
| appタグ付与の徹底 | AuthScreenでsignUp時にraw_user_meta_dataにappタグ設定 | 次回 |
| 重複所属の解消 | profiles＋soul_users両方にいる3件の整理 | 次回 |

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
> 日時: 2026-06-26（木）
> 次回更新: RLS強化・ログアウト実装・孤児掃除の実行後
