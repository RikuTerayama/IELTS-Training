# Vocab Reading / Listening 本番 no-data 復旧報告

## 1. Root cause

- **seed-vocab-reading.ts が Validation で失敗していた原因**
  - `data/vocab/reading/tfng.ts` 内に、**同一の (category, mode, prompt 先頭50文字, correct_expression)** を持つ問題が 2 件あった。
  - 重複していた問題:
    - **prompt**: `'The building was completed in 1850.'`
    - **correct_expression**: `'True'`
    - **category**: `vocab_reading_tfng`、**mode**: `click`
  - 1 件目は「Question 15」付近（passage: Construction began in 1847...）、2 件目は「Question 37」付近（同じ passage の短い版）で、完全に同一の出題として扱われるため、バリデーションの重複チェックに引っかかっていた。
- その結果 `npm run seed:vocab:all` が `seed-vocab-reading.ts` で失敗し、`seed-vocab-listening.ts` まで到達していなかった。

---

## 2. 変更ファイル一覧

| ファイル | 変更内容 |
|----------|----------|
| `data/vocab/reading/tfng.ts` | 重複していた 2 件目の「The building was completed in 1850.」/ True の問題を 1 件削除 |
| `data/vocab/reading/index.ts` | `validateReadingSeed` の重複検出時メッセージを変更。`duplicate (same ...) — already at question N` のように、先に出現した問題番号を表示するよう改善 |
| `docs/VOCAB_READING_LISTENING_RECOVERY_REPORT.md` | 本報告書（新規） |

---

## 3. Duplicate 修正内容

- **対象**: `data/vocab/reading/tfng.ts`
- **重複の正体**
  - 同じ TFNG 問題が 2 回定義されていた:
    - 1 件目: 約 201 行目。passage_excerpt に "most recently in 2003" を含む版。
    - 2 件目: 約 554 行目。passage_excerpt が "It has since been restored twice." で終わる版。
  - 両方とも prompt `'The building was completed in 1850.'`、correct_expression `'True'`、category `vocab_reading_tfng`、mode `click` のため、バリデーションの key が一致していた。
- **修正**
  - 2 件目（後半の 1 問）を削除。1 件目のみ残した。
- **バリデーション**
  - 重複時は「already at question N」と表示するようにし、どの問題と被っているか分かるようにした。

---

## 4. 本番で次に打つコマンド

本番 DB で Reading / Listening vocab を投入するには、環境変数（`NEXT_PUBLIC_SUPABASE_URL` と `SUPABASE_SERVICE_ROLE_KEY`）を設定したうえで、**次の 2 つを順に実行**してください。

```bash
npm run seed:vocab:reading
npm run seed:vocab:listening
```

- まとめて実行する場合:
  ```bash
  npm run seed:vocab:all
  ```
  （`seed:vocab:all` は `seed-vocab.ts` → `seed-vocab-reading.ts` → `seed-vocab-listening.ts` の順。Reading の validation は通過する想定。）

---

## 5. Build / lint / tsc 結果

- **npm run build**: 成功（既存の react-hooks 等の警告のみ）。
- **npm run lint**: 成功。同上。
- **npx tsc --noEmit**: 成功（exit 0）。
- **seed-vocab-reading の validation**: ローカルで実行時、重複エラーは出ず、環境変数未設定のメッセージで終了することを確認（＝ validation は通過）。

---

## 6. Reading / Listening no-data 解消の見込み

- **Reading**
  - 上記のとおり重複を 1 件削除し、validation が通る状態にした。本番で `npm run seed:vocab:reading` を実行すれば、Reading vocab が投入され、`/training/vocab?skill=reading` の no-data は解消される見込み。
- **Listening**
  - コード上の不具合は今回の調査では見つかっていない。`seed-vocab-reading.ts` が通ることで `seed:vocab:all` が `seed-vocab-listening.ts` まで到達する。本番で `npm run seed:vocab:listening`（または `seed:vocab:all`）を実行すれば、Listening vocab が投入され、`/training/vocab?skill=listening` の no-data は解消される見込み。

---

## 7. 既知の制約

- Speaking / Writing vocab は既存どおり `seed-vocab.ts`（`npm run seed:vocab`）に依存。今回の変更は Reading / Listening 用シードのみ。
- 本番で上記 seed を実行しない限り、Reading / Listening の no-data は解消しない。
- 重複削除により、Reading TFNG の問題数は 1 問減っている（1 件削除）。
