# 公開中 Input モジュール — seed / health-check 運用

## 必要な環境変数

いずれの script も **本番 DB に接続するため**、以下が必須です。

| 変数名 | 説明 |
|--------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase プロジェクトの URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase の service role key（本番用） |

- 値は `.env.local` に置くか、実行前にシェルで export してください。
- **本番 DB に繋ぐ場合は、本番プロジェクトの URL と service role key を指定してください。**

---

## seed:public-input の使い方

公開中 Input（語彙練習・熟語練習・表現バンク）の **全モジュール・全 skill 向け seed をまとめて実行**します。

```bash
npm run seed:public-input
```

**実行順（中身）**

1. **Vocab** — `seed:vocab:all`（Speaking/Writing → Reading → Listening）
2. **Idiom** — `seed:idiom` → `seed:idiom:listening` → `seed:idiom:reading`
3. **Lexicon** — `seed:lexicon` → `seed:lexicon:listening` → `seed:lexicon:reading`

- 途中でいずれかが失敗すると、その時点で終了します。
- 初回投入や「全モジュールを揃えたいとき」に実行してください。
- 既存データは各 seed 内のロジック（削除＋再投入など）に従います。

---

## check:public-input の使い方

公開中 Input の **各 module / skill に DB 上でデータがあるか** を確認します。

```bash
npm run check:public-input
```

**確認項目**

- 対象: `vocab` / `idiom` / `lexicon` × `reading` / `listening` / `speaking` / `writing`
- Reading / Listening: `lexicon_questions` に 1 件以上あるか
- Speaking / Writing: `lexicon_items` または `lexicon_questions` に 1 件以上あるか

**出力例**

```
Public Input health-check (module / skill)

[vocab]
  reading: OK
  listening: OK
  speaking: OK
  writing: OK

[idiom]
  ...
[lexicon]
  ...
```

- すべてデータがある場合: `All public Input module/skills have data.` と表示され、**exit 0** で終了します。
- 1 つでもデータがない場合: 該当を `EMPTY` と表示し、**exit 1** で終了します。CI やデプロイ後の確認に使えます。

---

## no-data が出たときの切り分け

1. **`check:public-input` を実行する**  
   - どの module / skill が `EMPTY` か確認します。

2. **EMPTY のモジュールだけ seed を実行する**
   - 例: Vocab だけ → `npm run seed:vocab:all`
   - 例: Idiom だけ → `npm run seed:idiom` + `npm run seed:idiom:listening` + `npm run seed:idiom:reading`
   - 例: Lexicon だけ → `npm run seed:lexicon` + `npm run seed:lexicon:listening` + `npm run seed:lexicon:reading`
   - 全部揃えたい → `npm run seed:public-input`

3. **環境変数を確認する**  
   - 本番用に実行している場合は、本番 Supabase の URL と service role key が設定されているか確認してください。

4. **エラーメッセージを確認する**  
   - Validation failed → 該当 seed の data やバリデーションを確認。
   - DB error → migration 適用や RLS / 接続先を確認。

---

## 個別 seed 一覧（参考）

| コマンド | 内容 |
|----------|------|
| `npm run seed:vocab` | Vocab Speaking / Writing |
| `npm run seed:vocab:reading` | Vocab Reading |
| `npm run seed:vocab:listening` | Vocab Listening |
| `npm run seed:vocab:all` | 上記 3 つを順に実行 |
| `npm run seed:idiom` | Idiom Speaking / Writing |
| `npm run seed:idiom:listening` | Idiom Listening |
| `npm run seed:idiom:reading` | Idiom Reading |
| `npm run seed:lexicon` | Lexicon Speaking / Writing（ws_note 由来） |
| `npm run seed:lexicon:listening` | Lexicon Listening |
| `npm run seed:lexicon:reading` | Lexicon Reading |
