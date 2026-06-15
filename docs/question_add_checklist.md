# 🩺 問題追加チェックリスト（健康診断キット）

> **置き場所**: `docs/question_add_checklist.md`
> **最終更新**: 2026/06/15（JST）
> **対象テーブル**: Supabase `questions`（Project ID: `ndqbtfahtjaafroevgwq`）

---

## 1. このファイルは何？

問題をDBに追加・編集したあと、**データの抜け漏れ・矛盾を一発で検出する**ためのチェックリスト。
過去に「問題は足したけど付随データ（正解・時刻・解説）を入れ忘れて、図が出ない／答えがズレる」事故が複数回あったので、それを**公開前に必ず潰す**ための仕組み。

代表的な過去事故（このキットで全部防げる）:
- 🕐 とけい問題で `clock_time` 入れ忘れ → 時計の図が出ない（id531〜540）
- 🧪 げんそ問題で `correct` が間違い → 嘘の答えが正解扱い（id274）
- ✍️ おくりがなで Lvデータ取りこぼし

---

## 2. いつ使う？

- 新しい問題をDBに追加したとき（**必須**）
- 既存問題の選択肢・正解・解説を編集したとき
- 解説（ひらがな／漢字）を一括追加したとき
- 「なんか表示がおかしい」と感じたとき（原因の切り分け）

---

## 3. 運用フロー（のん ⇄ ちゃぴ）

```
① のん: 問題をDBに追加 or 編集
        ↓
② のん: ちゃぴに「健康診断して」と一言
        ↓
③ ちゃぴ: 下の「健康診断SQL」を実行（Supabase MCP）
        ↓
④ ちゃぴ: 結果を報告（🔴エラーは件数、🟡警告は内容）
        ↓
⑤ 🔴エラーがあれば → ちゃぴが原因特定して修正SQLを実行
   🟡警告だけなら → 内容を確認して、直すか後回しか のんが判断
        ↓
⑥ 全部✅になったら 公開OK
```

**ポイント**: のんはSQLを触らんでええ。「健康診断して」と言うだけで、ちゃぴが全部やる。

---

## 4.【コピペ用】健康診断SQL（全部入り）

これ1本流せば、全チェックが1つの表で返る。`status` が全部 `✅ OK` なら健康体。

```sql
SELECT ord, severity, check_name, ng_count,
       CASE WHEN ng_count = 0 THEN '✅ OK' ELSE '❌ 要対応' END AS status
FROM (
  SELECT 1 AS ord, '🔴ERROR' AS severity, 'A. 図問題で時刻欠け (type=clock かつ clock_time NULL)' AS check_name,
    (SELECT count(*) FROM questions WHERE type='clock' AND clock_time IS NULL) AS ng_count
  UNION ALL SELECT 2, '🔴ERROR', 'B. 正解インデックス範囲外 (correct<0 または 選択肢数以上)',
    (SELECT count(*) FROM questions WHERE correct IS NULL OR correct < 0 OR correct >= jsonb_array_length(options))
  UNION ALL SELECT 3, '🔴ERROR', 'C. question_id の重複',
    (SELECT count(*) FROM (SELECT question_id FROM questions GROUP BY question_id HAVING count(*)>1) t)
  UNION ALL SELECT 4, '🔴ERROR', 'D. 必須カラム欠け (question/options/subject/correct のどれか NULL)',
    (SELECT count(*) FROM questions WHERE question IS NULL OR options IS NULL OR subject IS NULL OR correct IS NULL)
  UNION ALL SELECT 5, '🔴ERROR', 'E. 漢字解説アリ×ひらがな解説ナシ (ていがくねんで解説空白)',
    (SELECT count(*) FROM questions WHERE explanation_advanced IS NOT NULL AND explanation IS NULL)
  UNION ALL SELECT 6, '🔴ERROR', 'F. 漢字選択肢の個数が ひらがな選択肢と不一致',
    (SELECT count(*) FROM questions WHERE options_advanced IS NOT NULL AND jsonb_array_length(options_advanced) <> jsonb_array_length(options))
  UNION ALL SELECT 7, '🟡WARN ', 'G. 漢字問題文アリ×漢字選択肢ナシ (漢字モードで選択肢だけひらがな)',
    (SELECT count(*) FROM questions WHERE question_advanced IS NOT NULL AND options_advanced IS NULL)
  UNION ALL SELECT 8, '🟡WARN ', 'H. ひらがな解説アリ×漢字解説ナシ (解説の漢字版が未作成=進捗管理用)',
    (SELECT count(*) FROM questions WHERE explanation IS NOT NULL AND explanation_advanced IS NULL)
  UNION ALL SELECT 9, '🟡WARN ', 'I. 非アクティブ問題 (active≠true=出題されない)',
    (SELECT count(*) FROM questions WHERE active IS NOT TRUE)
) checks
ORDER BY ord;
```

---

## 5. チェック項目 詳細（深刻度・意味・直し方）

### 🔴 ERROR（公開前に必ず直す）

| 記号 | 何を見てる | これが起きると | 直し方 |
|---|---|---|---|
| **A** | `type='clock'` やのに `clock_time` が NULL | 時計の図が表示されへん（答えようがない） | その問題の正解に合う時刻を `clock_time` にセット（下の修正例参照） |
| **B** | `correct` が選択肢の範囲外（0始まり: 0〜選択肢数-1） | 正解が指せない／別の選択肢が正解扱い | 正しいインデックスに修正。**correct は 0始まり**に注意 |
| **C** | `question_id` が重複 | 識別子が衝突して挙動が不安定に | 重複してる `question_id` を別の一意な値に変更 |
| **D** | `question`/`options`/`subject`/`correct` のどれかが NULL | 問題として成立しない | 欠けてるカラムを埋める |
| **E** | 漢字解説アリ × ひらがな解説ナシ | ていがくねん（ひらがな）モードで解説が空白になる | ひらがな版解説を追加。**解説は必ずひらがな版から作る** |
| **F** | 漢字選択肢の**個数**がひらがな選択肢と違う | 漢字モードで選択肢が無視されひらがなに戻る（データ作成ミスのサイン） | `options_advanced` の要素数を `options` と揃える |

### 🟡 WARNING（落ちひんけど完成度の話。直すか後回しか判断）

| 記号 | 何を見てる | 影響 | メモ |
|---|---|---|---|
| **G** | 漢字問題文アリ × 漢字選択肢ナシ | 漢字モードで問題文は漢字やのに選択肢だけひらがな（見た目チグハグ） | 落ちはせえへん。数字選択肢（「3じ」等）なら実質差は無い。文字系の選択肢は揃えると綺麗 |
| **H** | ひらがな解説アリ × 漢字解説ナシ | 漢字解説の作成バックログ | **これは進捗メーター**。残ってる漢字解説の数 ＝ この件数 |
| **I** | `active≠true` | その問題は出題されない | 意図的に休止してるなら問題なし。意図せず false なら true に戻す |

---

## 6.【🔴が出たとき】どの問題か特定する 詳細クエリ

サマリーで件数が出たら、次はどの問題か。記号に対応する詳細クエリを流す:

```sql
-- A: 時刻欠けの図問題を一覧
SELECT id, question_id, question, correct, options->>(correct) AS answer
FROM questions WHERE type='clock' AND clock_time IS NULL ORDER BY id;

-- B: 正解インデックス範囲外を一覧
SELECT id, question_id, question, correct, jsonb_array_length(options) AS n_options, options
FROM questions WHERE correct IS NULL OR correct < 0 OR correct >= jsonb_array_length(options) ORDER BY id;

-- C: 重複してる question_id を一覧
SELECT question_id, count(*) FROM questions GROUP BY question_id HAVING count(*)>1;

-- E: ひらがな解説が欠けてる問題を一覧
SELECT id, question_id, subject, question FROM questions
WHERE explanation_advanced IS NOT NULL AND explanation IS NULL ORDER BY id;

-- F: 漢字選択肢の個数ズレを一覧
SELECT id, question_id, jsonb_array_length(options) AS n_hira, jsonb_array_length(options_advanced) AS n_kanji, options, options_advanced
FROM questions WHERE options_advanced IS NOT NULL AND jsonb_array_length(options_advanced) <> jsonb_array_length(options);
```

### 修正例: 時計問題（A）の直し方

```sql
-- 正解が「7じ」なら hour=7, minute=0。jsonb キャスト必須。
UPDATE questions SET clock_time = '{"hour":7,"minute":0}'::jsonb WHERE id = 531;
```

---

## 7. ⚠️ SQLでは見抜けないこと（ちゃぴ／のんの目視が要る）

自動チェックは「形」しか見れへん。**中身の正しさ**は人の目が要る:

1. **正解の事実が合ってるか** … 例: id274「日本で発見された元素＝4種類」は形は正常やったが**事実が間違い**（正解は1種類）。新規問題、特にインポートした問題は正解の中身を要確認。
2. **漢字選択肢の「並び順」がひらがなと同じか** … `correct` はひらがな・漢字で共通。`options_advanced` の並びが `options` とズレてると、漢字モードで別の選択肢が正解扱いになる（個数チェックFでは検出不可）。**漢字選択肢を作るときは、ひらがなと同じ順番を厳守**。
3. **clock_time の時刻が正解と一致してるか** … 個数や有無は見れるが「7:00の図に正解が3じ」みたいな中身ズレは目視で。
4. **問題文と選択肢の日本語が学年相応か** … 中学漢字が混ざってないか等。

---

## 8. 補足: 現在の既知の🟡（2026/06/15時点）

| 記号 | 件数 | 内訳・対応方針 |
|---|---|---|
| G | 175 | 漢字選択肢ナシ。多くは数字・短語で実害小。優先度低 |
| H | 123 | 漢字解説バックログ＝ さんすう漢字113 ＋ こくご10。解説作業の進捗そのもの |

※ G/H は「既知で管理下」。健康診断で `G/H 以外` に🟡が出たら新規発生なので要確認。

---

*このキットは問題追加のたびに使うこと。「二度手間を防ぐための一手間」や。*
