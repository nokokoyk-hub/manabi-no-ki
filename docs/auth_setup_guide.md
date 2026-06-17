# 🔐 認証設定ガイド — まなびの木 Phase A

> **この手順書の通りにやれば認証が動きます！**
> のんがやること = 設定画面でポチポチするだけ。コードは触らんでOK！

---

## 📋 やること一覧（3ステップ）

| Step | 内容 | 所要時間目安 |
|------|------|------------|
| ① | GCPで OAuth クライアントID 取得 | 10〜15分 |
| ② | SupabaseでGoogle認証を有効化 | 5分 |
| ③ | GitHubにコードをpush | 5分 |

---

## Step ① GCP Console で OAuth クライアントID を取得

### 1-1. GCPにアクセス
- **https://console.cloud.google.com/** を開く
- Googleアカウントでログイン

### 1-2. プロジェクト作成（または既存を使う）
- 左上の「プロジェクトを選択」をクリック
- 「新しいプロジェクト」→ 名前: `manabinoki` → 「作成」
- ※お受験マネージャーで使ったプロジェクトがあれば、そこに追加でもOK

### 1-3. OAuth同意画面を設定
- 左メニュー「APIとサービス」→「OAuth同意画面」
- 「外部」を選択 →「作成」
- 入力する項目:
  - **アプリ名**: `まなびの木`
  - **ユーザーサポートメール**: のんのGmailアドレス
  - **デベロッパーの連絡先**: のんのGmailアドレス
- 「保存して次へ」を3回押す（スコープ等はデフォルトでOK）
- 「ダッシュボードに戻る」

### 1-4. 「アプリを公開」する
- OAuth同意画面のダッシュボードで
- 「公開ステータス」が「テスト」になってたら → **「アプリを公開」ボタンを押す**
- ※「テスト」のままだとのんのGmailでしかログインできない

### 1-5. OAuth クライアントID を作成
- 左メニュー「APIとサービス」→「認証情報」
- 上部の「+ 認証情報を作成」→「OAuthクライアントID」
- 入力する項目:
  - **アプリケーションの種類**: `ウェブアプリケーション`
  - **名前**: `まなびの木`
  - **承認済みのリダイレクトURI**: 以下を「URIを追加」で入力👇

```
https://ndqbtfahtjaafroevgwq.supabase.co/auth/v1/callback
```

- 「作成」を押す
- **クライアントID** と **クライアントシークレット** が表示される → 両方コピーしてメモ！

> ⚠️ この2つの値を次のStep②で使います！

---

## Step ② Supabase で Google 認証を有効化

### 2-1. Supabaseダッシュボードにアクセス
- **https://supabase.com/dashboard** を開く
- manabinoki プロジェクト（ndqbtfahtjaafroevgwq）を選択

### 2-2. Google Authを有効化
- 左メニュー「Authentication」→「Providers」
- 「Google」を見つけてクリック → トグルを **ON**
- 入力する項目:
  - **Client ID**: Step①でメモした「クライアントID」
  - **Client Secret**: Step①でメモした「クライアントシークレット」
- 「Save」を押す

### 2-3. サイトURLを設定
- 左メニュー「Authentication」→「URL Configuration」
- **Site URL** を以下に設定:

```
https://manabinoki.net
```

- **Redirect URLs** に以下を追加:

```
https://manabinoki.net
https://manabinoki.net/**
```

- 「Save」を押す

### 2-4. Email Auth の確認
- 左メニュー「Authentication」→「Providers」
- 「Email」が **ON** になっていることを確認（デフォルトでON）
- ※マジックリンク用。パスワード不要のメールログイン

---

## Step ③ GitHub にコードを push

ちゃぴから渡されたファイル2つをGitHubにアップロード:

| ファイル | 操作 |
|---------|------|
| `src/screens/AuthScreen.js` | **新規追加**（鉛筆→「Add file」→「Create new file」） |
| `src/App.js` | **上書き更新**（既存ファイルを鉛筆で編集→全選択→貼り付け） |

push後、Vercelが自動デプロイ → **https://manabinoki.net** でログイン画面が表示されるはず！

---

## ✅ 動作確認チェックリスト

1. [ ] manabinoki.net を開く → ログイン画面が表示される
2. [ ] 「Googleでログイン」→ Googleアカウント選択 → ホーム画面に戻る
3. [ ] 一度ログインしたら、再度開いてもホーム画面が表示される（セッション維持）
4. [ ] メールでログイン → メールが届く → リンクタップ → ホーム画面

---

## 🆘 トラブルシューティング

### 「Googleログインが動かない」
- GCPの「承認済みリダイレクトURI」が正確か確認
- Supabaseの「Redirect URLs」に `https://manabinoki.net` が入っているか確認
- GCPのOAuth同意画面が「公開」になっているか確認

### 「ログイン後にホーム画面に戻らない」
- Supabase「URL Configuration」の「Site URL」が `https://manabinoki.net` になっているか確認

### 「メールが届かない」
- 迷惑メールフォルダを確認
- Supabase「Providers」→「Email」がONになっているか確認

---

> 作成日: 2026年6月18日（水）JST
> 作成者: ちゃぴ
