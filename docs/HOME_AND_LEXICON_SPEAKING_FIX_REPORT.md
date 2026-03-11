# Home と Lexicon speaking 残課題解消 報告

## 1. Root cause 一覧

| 問題 | Root cause |
|------|------------|
| **Lexicon speaking が EMPTY のまま** | `lib/lexicon/noteParser.ts` で、**すべての見出し**（`#`, `##`, `###`）を `if (trimmed.startsWith('#'))` で処理しており、`### Linking words` など **h3 の行でも** `inferSkillFromHeading("Linking words")` が実行されていた。h3 のテキストには "speaking" が含まれないため `'writing'` が返り、**「## Speaking - Cohesion」で正しく設定した skill が h3 ごとに writing で上書きされていた**。その結果、ws_note の Speaking セクションの表現がすべて skill=writing として DB に入り、speaking の items/questions が 0 件だった。 |
| **Home 括弧・説明文** | 要望どおり括弧を削除し、Input 説明を「4技能の必須〜」に統一。 |
| **Home 英語文言** | Practice / Exam Mode の説明とお知らせが英語のままだったため、日本語に変更。 |
| **Home ボタンサイズ** | スキルボタンが flex-wrap で幅がばらついていたため、grid で 4 列揃えて統一。 |
| **SEO 記事の所在** | 記事型ルートがコードベース内で分かりづらいため、`docs/SEO_CONTENT_INDEX.md` で一覧化。 |

## 2. 変更ファイル一覧

- `lib/lexicon/noteParser.ts` — ### 見出しでは skill を更新せず category のみ階層追加
- `app/home/page.tsx` — 括弧削除、Input 説明文統一、Practice/Exam 日本語化、スキルボタン grid 化、Speaking/Writing リンクに `?skill=` 付与
- `app/api/menu/today/route.ts` — お知らせメッセージを日本語に変更
- `docs/SEO_CONTENT_INDEX.md` — 新規（SEO 記事ルート一覧）
- `docs/HOME_AND_LEXICON_SPEAKING_FIX_REPORT.md` — 本報告（新規）

## 3. Home copy / 日本語化 / ボタンサイズ修正内容

### Copy

- 「語彙・熟語・表現を覚えましょう（定着: 認知と想起）」→ **「語彙・熟語・表現を覚えましょう」**
- 「覚えた語彙・表現を実際に使いましょう（運用: 使わせる制約）」→ **「覚えた語彙・表現を実際に使いましょう」**
- Input カード: 単語練習「4技能の必須単語を覚えましょう」、熟語練習「4技能の必須熟語を覚えましょう」、表現バンク「4技能の必須表現を覚えましょう」に統一。タイトルを「語彙練習」→「単語練習」に変更。

### 日本語化

- **Practice**: "Build fluency with guided drills and structured writing practice." → **「ドリルと構成されたライティング練習で流暢さを高めます。」**
- **Exam Mode**: "Simulate test-day performance with AI interviewer and essay evaluation." → **「AI面接官・エッセイ採点で本番に近いパフォーマンスをシミュレートします。」**
- Practice カード: subtitle と ctaLabel を日本語化（例: 「IELTS のタスク別で瞬間英作文ドリル」「練習する」）。
- Exam カード: subtitle と ctaLabel を日本語化。
- **お知らせ**（API）: "Lexicon reviews due today: ..." → **「表現バンクの復習が今日 due: Click ○問・Typing ○問」**。Idiom / Reviews due も同様に日本語化。

### ボタンサイズ統一

- Input カード内の Reading / Listening / Speaking / Writing を `grid grid-cols-2 sm:grid-cols-4 gap-2` に変更。各ボタンに `justify-center` と `py-2.5` を指定し、モバイルでは 2 列・sm 以上で 4 列で揃えて表示。

## 4. Lexicon speaking 修正内容

- **noteParser.ts**: 見出しの処理順を変更。
  - **`###` のみ**: `inferSkillFromHeading` を呼ばず、`currentCategory` だけを階層追加（`currentCategory_subCategory`）。**skill はそのまま**（親の `##` で設定した speaking を維持）。
  - **`##` および `#`**: 従来どおり `inferSkillFromHeading(heading)` で `currentSkill` を更新し、`currentCategory` も更新。
- これにより「## Speaking - Cohesion」以降の「### Linking words」などはすべて skill=speaking のまま DB に投入され、seed 再実行で lexicon speaking が OK になる。

## 5. SEO_CONTENT_INDEX の内容

- **Speaking トピック**: `app/speaking/topics/[slug]/page.tsx` → ルート `/speaking/topics/[slug]`。例: `/speaking/topics/work-study`, `hometown`, `free-time`, `travel`, `technology`。
- **Writing Task 2 トピック**: `app/writing/task2/topics/[slug]/page.tsx` → ルート `/writing/task2/topics/[slug]`。slug は 50 件以上（education, technology, environment など）。一覧は該当 `page.tsx` の `task2Topics` を参照。
- 親ページ: `/speaking`（`app/speaking/page.tsx`）, `/writing`（`app/writing/page.tsx`）。
- 各項目に source file / route pattern / 確認方法 / 公開 URL 例を記載。

## 6. 本番で必要な追加コマンド

**Lexicon speaking を解消するには、修正後のパーサで seed を再実行してください。** 既存の誤って writing で入った項目は (normalized, skill, category) が異なるため、同じ表現が speaking で新規登録されます。必要に応じて DB 側で古い誤データを削除してもよいです。

```bash
npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-lexicon.ts
```

または

```bash
npx tsx scripts/seed-lexicon.ts
```

- 環境変数: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` を設定して実行。

## 7. Build / Lint / tsc 結果

- **npm run build**: 成功（既存警告のみ）。
- **npm run lint**: 成功（既存警告のみ）。
- **npx tsc --noEmit**: 成功。

## 8. 既知の制約

- 既存の DB に「本来は speaking なのに writing で入った」行が残っている場合、seed 再実行で speaking の行が追加され、重複する表現が writing と speaking の両方に存在する可能性があります。必要なら手動で skill=writing かつ category が `speaking_` で始まるような誤投入行を削除してください。
- commit / push は行っていません。開発ブランチの新規作成も行っていません。
