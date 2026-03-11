# Reading Vocabulary v1 Phase 4 実装報告

## 1. 変更ファイル一覧

| ファイル | 変更内容 |
|----------|----------|
| `app/api/lexicon/questions/route.ts` | Reading: `weak_skill` クエリ対応、mini set を「セット単位で丸ごと」選択するロジックに変更（中間で別セットに飛ばない） |
| `app/api/progress/reading-vocab-history/route.ts` | `ReadingVocabStatsBySkill` に `skill_key` を追加（苦手スキル導線で API に渡す用） |
| `lib/api/lexicon.ts` | `LexiconQuestionsParams` に `weak_skill` を追加、Reading 時にクエリに付与 |
| `app/training/vocab/page.tsx` | Reading 時: 進捗 API で `stats_by_skill` 取得、苦手スキル優先 CTA、セット番号付きサマリー／進捗表示、`getReadingSetInfo` ヘルパー追加 |
| `docs/READING_VOCAB_V1_PHASE4_REPORT.md` | 本報告書 |

## 2. mini set 強化内容

- **API（セット単位選択）**
  - 従来: due/new から `limit` 件の ID を選び、取得後に `passage_group` で並べ替えのみ → 同じセットの途中で別セットが混ざる可能性あり。
  - 変更後: due/new のプールを多めに取得（最大 `limit * 3` 相当）→ 全件取得して `passage_group` でグループ化 → **グループ単位**で due 優先の順に並べ、先頭から「グループを丸ごと」追加して `limit` を超えるまで積む。これにより「2〜4 問のセットの途中で別セットに飛ぶ」ことがなくなる。
- **UI**
  - クイズ中: Reading かつセットが複数ある場合、「Set 2/5 · 問題 5/12」のように **Set 番号/総セット数** と **問題番号** を併記。
  - セット完了時: 「セット 2/5 の結果」「2 / 3 問正解」のように表示し、ボタンは「次のセットへ」に変更。

## 3. weakness-aware review 強化内容

- **進捗 API**
  - `stats_by_skill` の各要素に `skill_key`（`reading_skill` のメタ値）を追加。フロントで「苦手スキルで復習」時にそのまま `weak_skill` として渡せるようにした。
- **トレーニング開始導線**
  - `/training/vocab?skill=reading` でカテゴリ選択後、進捗 API を呼び出して `stats_by_skill` を取得。
  - 正答率 80% 未満かつ 1 問以上あるスキルを「苦手スキル」として表示し、「〇〇 (65%) で復習」ボタンを設置。
  - そのボタン押下で `handleStartQuiz(true, false, skill_key)` を実行 → **復習のみ**かつ **そのスキルの問題だけ**を出す（API の `weak_skill` でフィルタ）。
- **既存モード**
  - 「Review only」「New only」「復習＋新規で開始」は従来どおり。`weak_skill` は「苦手スキルで復習」ボタン押下時のみ付与され、既存の review_only / new_only / mixed は変更なし。

## 4. UI / progress の変更点

- **進捗表示（クイズ中）**
  - Reading かつセットが 2 つ以上あるとき: 「Set 1/4 · 問題 1/10」形式。セットが 1 つまたは `passage_group` なしのときは従来どおり「問題 1/10」のみ。
- **セット完了サマリー**
  - タイトル: 「セット 2/5 の結果」または「このセットの結果」（セットが 1 つの場合）。
  - 正解数: 「2 / 3 問正解」。
  - ボタン: 「続ける」→「次のセットへ」に文言変更。
- **完了画面**
  - 既存の「問題タイプ別」「今回弱かったスキル」はそのまま。Phase 4 では set 単位の振り返りは「セット完了時」で完結し、最終完了画面のレイアウト変更は行っていない。
- **モバイル**
  - 新規コンポーネントは既存の `cardBase` / `cardDesc` / フレックスで、モバイルで崩れない範囲で追加。特段のレスポンシブ変更はなし。

## 5. build / lint / tsc 結果

- **npm run build**: 成功（Next.js 14.1.0）。既存の他ファイルに対する ESLint 警告（react-hooks/exhaustive-deps 等）は Phase 4 では変更していない。
- **npm run lint**: 成功。同上。
- **npx tsc --noEmit**: 成功（exit 0）。

## 6. 既知の制約

- **Explanation 品質**
  - 既存シードは多くの問題で `explanation` / `distractor_note` / `paraphrase_tip` のいずれかが設定済みのため、Phase 4 ではシードの一括追加は行っていない。必要に応じて個別に追記可能。
- **苦手スキル導線**
  - 進捗がまだ少ないユーザーでは `stats_by_skill` が空または少なく、「苦手スキルを優先して復習」が表示されない。問題数が溜まれば表示される。
- **mini set のサイズ**
  - セットは「2〜4 問」を想定しているが、API は `passage_group` が同じ問題を 1 セットとして扱うだけなので、1 問だけのグループや 5 問以上のグループもあり得る。表示は「Set X/Y」でそのまま対応。
- **弱スキル復習時のカテゴリ**
  - 「苦手スキルで復習」は**現在選択中のカテゴリ**に対して `weak_skill` を付与する。全カテゴリ横断の「苦手スキルのみ」は未対応。
