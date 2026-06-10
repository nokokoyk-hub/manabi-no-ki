# 🌳 まなびの木 — 認証・課金設計書
# docs/auth_and_billing_design.md

> **v1.0リリースに向けた認証基盤・課金モデルの設計書**
> 2026年6月11日（木）策定 — のん × ちゃぴ

---

## 📌 概要

まなびの木を持続可能なサービスにするため、ユーザー認証と課金の仕組みを導入する。
子供の学習習慣を壊さない設計を最優先とし、保護者に寄り添った導線を構築する。

---

## 🔐 認証設計

### 認証方式（2段構え）

| 方式 | 用途 | 技術 |
|------|------|------|
| **Googleログイン** | メイン認証 | Supabase Auth（リダイレクト方式） |
| **メールログイン（マジックリンク）** | フォールバック | Supabase Auth（パスワード不要） |

### なぜリダイレクト方式か
- ポップアップ方式はLINE内ブラウザ・Yahoo!ブラウザ等のWebViewでブロックされやすい
- リダイレクト方式はWebView環境でも比較的安定して動作する
- ただしWebView環境では完全保証できないため、マジックリンクをフォールバックに置く

### 認証フロー

```
ユーザーがアプリを開く
  │
  ├─ ログイン済み → ホーム画面へ
  │
  └─ 未ログイン → ログイン画面
       │
       ├─ [Googleでログイン] → Supabase Auth (redirect)
       │     ├─ 成功 → 初回ならトライアル開始 → ホーム画面
       │     └─ 失敗 → WebView案内表示 + メールログインへ誘導
       │
       └─ [メールでログイン]
             └─ メール入力 → マジックリンク送信 → メール内リンクタップ → ログイン完了
```

### WebView検知・フォロー導線

**検知方法:** User-Agent で LINE / FBAV / Yahoo 等のWebView判定

**検知時の表示:**
```
📱 LINEやアプリからひらいていませんか？
Googleログインがうまくいかないときは
① 右上の「…」→「ブラウザでひらく」をタップ
または
② 下の「メールでログイン」をおためしください
```

**Googleログイン失敗時の自動フォロー:**
```
⚠️ Googleログインがブロックされました
アプリ内ブラウザでは使えないことがあります

🔽 メールでログインはこちら（パスワード不要！）
または Chrome / Safari で開き直してください
```

### ログイン画面レイアウト

```
┌─────────────────────────┐
│   🌳 まなびの木          │
│  「まなぶほど 木がそだつ」 │
│                          │
│  [🔵 Googleでログイン]   │  ← メイン
│                          │
│  ── または ──             │
│                          │
│  📧 メールアドレス [____] │  ← フォールバック
│  [ログインリンクを送る]   │
│                          │
│  📱 うまくいかない時は？  │  ← ヘルプ（タップで展開）
│                          │
│  はじめての方も            │
│  ログインするだけで        │
│  アカウントができます！    │
└─────────────────────────┘
```

---

## 💰 課金モデル

### プラン設計

| プラン | 料金 | 内容 |
|--------|------|------|
| **トライアル** | 無料（5日間） | 全機能フル開放 |
| **無料プラン** | 0円 | ミッション1日1回のみ |
| **プレミアム** | 月額200円 | 全機能開放 |
| **年額プラン** | 2,000円（将来追加） | 2ヶ月分お得 |

### コンセプト
**「ジュース1本分で、こどもの学びを応援」**

### 機能の線引き

| 機能 | 無料（トライアル後） | プレミアム |
|------|------|------|
| ミッション（1日1回） | ✅ | ✅ |
| ミッション（回数無制限） | ❌ | ✅ |
| 木の成長・ストリーク | ✅ | ✅ |
| おくりがなモード | ❌ | ✅ |
| とけいモード | ❌ | ✅ |
| かがくモード | ❌ | ✅ |
| しゃかいモード | ❌ | ✅ |
| どうとくモード | ❌ | ✅ |
| ふくしゅう | ❌ | ✅ |
| ごほうびパズル | ✅（継続） | ✅ |
| きせかえ | ✅（継続） | ✅ |
| みまもり画面 | ❌ | ✅ |
| げんそずかん | ❌ | ✅ |
| レベル設定 | ❌ | ✅ |

**設計方針:**
- パズル・きせかえは無料でも継続 → 学習習慣を途切れさせない
- みまもり画面は有料 → 保護者にとって課金動機になる
- ミッション1日1回は無料 → 毎日使い続けてもらいDAUを維持

### 課金を促すメッセージ設計

**原則: 子供を悲しませない。保護者に判断してもらう。**

制限された機能をタップした時の表示:
```
┌─────────────────────────┐
│  🔒 プレミアムきのう      │
│                          │
│  このきのうを つかうには   │
│  おうちのひとに           │
│  そうだんしてね 🌳        │
│                          │
│  [おうちのひとに みせる]  │ ← みまもり画面内の課金ページへ
│  [もどる]                │
│                          │
└─────────────────────────┘
```

### トライアル期間の表示

```
🎁 あと○にち ぜんぶ つかえるよ！
```
（ホーム画面上部にやさしいバナーで表示）

トライアル最終日:
```
🌳 あしたから ミッション１かいだけになるよ
おうちのひとに そうだんしてね！
```

---

## 💳 Stripe連携設計

### 決済フロー

```
みまもり画面（保護者PINロック内）
  │
  └─ [プレミアムにアップグレード] ボタン
       │
       └─ Stripe Checkout Session 生成
            │
            └─ Stripe決済ページ（月額200円）
                 │
                 ├─ 決済成功 → Supabase subscription 更新 → 完了画面
                 └─ 決済キャンセル → みまもり画面に戻る
```

### 手数料シミュレーション

| プラン | 売上 | Stripe手数料 | 手取り | 手数料率 |
|--------|------|------|------|------|
| 月額200円 | 200円 | 約47円（3.6%+40円） | **約153円** | 23.6% |
| 年額2,000円 | 2,000円 | 約112円（3.6%+40円） | **約1,888円** | 5.6% |

※ 年額プランは将来追加予定。まずは月額のみでスタート。

### 解約フロー
- みまもり画面内に「プランを解約する」ボタン
- 解約しても当月末まではプレミアム機能を利用可能
- 解約時メッセージ: 「いつでもまた始められます🌳」

---

## 🗄️ DB設計変更

### 既存テーブル変更

**user_progress テーブル**
```sql
-- device_id に加えて user_id カラムを追加
ALTER TABLE user_progress ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- device_id → user_id への移行期間中は両方保持
-- 移行完了後、device_id はフォールバック用に残す
```

### 新規テーブル

**subscriptions テーブル**
```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'trial',
    -- 'trial' / 'active' / 'canceled' / 'expired'
  plan TEXT NOT NULL DEFAULT 'free',
    -- 'free' / 'premium'
  trial_start TIMESTAMPTZ DEFAULT now(),
  trial_end TIMESTAMPTZ DEFAULT (now() + interval '5 days'),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- RLS設定
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

**user_profiles テーブル**（将来の管理用）
```sql
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  email TEXT,
  display_name TEXT,
  device_ids TEXT[] DEFAULT '{}',  -- 複数端末対応
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### データ移行戦略
1. ログイン時に device_id を検索
2. 既存データが見つかったら user_id を紐づけ
3. 見つからなかったら新規作成
4. 移行後も device_id は残し、未ログイン時のフォールバックに使用

---

## 🔧 実装Phase

### Phase A: 認証基盤 ← 最優先
- [ ] Supabase Auth 有効化（Google + Email）
- [ ] Google OAuth設定（GCP Console）
- [ ] ログイン画面（AuthScreen.js）作成
- [ ] WebView検知ロジック実装
- [ ] App.jsに認証状態管理追加
- [ ] device_id → user_id 移行ロジック

### Phase B: 保護者PINロック ← 課金とセット
- [ ] PIN設定画面
- [ ] PIN入力ゲート（みまもり画面の前に配置）
- [ ] PIN保存（Supabase user_profiles）

### Phase C: トライアル＆機能制限
- [ ] subscriptions テーブル作成
- [ ] トライアル期間カウントロジック
- [ ] 機能制限ゲート（usePremium カスタムフック）
- [ ] 制限時のやさしいメッセージUI
- [ ] トライアル残日数バナー

### Phase D: Stripe課金
- [ ] Stripe アカウント開設
- [ ] Checkout Session API（Supabase Edge Function）
- [ ] Webhook受信（支払い成功/失敗/解約）
- [ ] みまもり画面内の課金UI
- [ ] 解約フロー

### Phase E: 運用ダッシュボード（v1.1以降）
- [ ] ユーザー数・DAU
- [ ] 課金率・チャーン率
- [ ] のん用管理画面

---

## ⚠️ 注意事項

- 課金ボタンは必ず**保護者PINロック内**に配置（子供が勝手に課金しない）
- 個人情報の取り扱い → プライバシーポリシー作成が必要
- 特定商取引法に基づく表記が必要（有料サービス提供時の法的要件）
- Apple/Google経由のアプリ課金ではなくWeb直接課金のため、ストア手数料は不要
- ただし将来PWA化やネイティブアプリ化する場合はストア規約に注意

---

> 策定日: 2026年6月11日（木）JST
> 策定者: のん × ちゃぴ
> ステータス: 設計確定・実装待ち
