# Listening Lexicon v1 Progress / 履歴・統計 PR レポート

## 1. 変更ファイル一覧

### 新規作成
- `app/api/progress/listening-lexicon-history/route.ts` — Listening Lexicon 用履歴 API（直近ログ、due_count、category 別統計）

### 変更
- `lib/db/listening-srs.ts` — `countListeningLexiconDueToday(supabase, userId)` を追加（skill=listening, module=lexicon の Due 件数）。既存の Vocab / Idiom 用関数は変更なし。
- `app/progress/page.tsx` — Listening Lexicon 用 state・fetch・UI セクションを追加（Due today、By category、Recent attempts、CTA、0件時空状態）

---

## 2. 追加した API の内容

### GET /api/progress/listening-lexicon-history

- **認証**: 要ログイン（401 未認証時）
- **対象**: `lexicon_questions` の `skill='listening'`, `module='lexicon'` に紐づく `lexicon_logs` と、`listening_srs_state` による今日の Due 件数。

**レスポンス型 `ListeningLexiconHistoryResponse`**

| フィールド | 型 | 説明 |
|------------|-----|------|
| `history` | `ListeningLexiconHistoryItem[]` | 直近 10 件の試行（id, category, is_correct, user_answer, created_at, prompt） |
| `stats_by_category` | `ListeningLexiconStatsByCategory[]` | カテゴリ別集計（category, category_label, total, correct, accuracy_percent） |
| `due_count` | `number` | 今日 Due の件数（listening_srs_state の question_id で lexicon 問題のみ集計） |

**処理概要**

1. `lexicon_questions` から `skill='listening'`, `module='lexicon'` の id・prompt・category を取得。
2. 上記 question_id に限定して `lexicon_logs` を取得（user_id 一致、created_at 降順、最大 50 件）。
3. 直近 10 件を `history` に、全取得ログでカテゴリ別正答数を集計し `stats_by_category` を生成。`category_label` は `LISTENING_LEXICON_CATEGORY_LABELS` で付与。
4. `countListeningLexiconDueToday(supabase, user.id)` で `due_count` を取得（lexicon 用 question_id のみ対象）。

**0 件時**

- 問題が 0 件、またはログが 0 件でも、`history: []`, `stats_by_category: []`, `due_count` のみ返す（due_count は lexicon 問題の Due のみ）。Reading Lexicon / Listening Vocab / Listening Idiom と同様の形。

---

## 3. Progress UI の変更点

- **Listening Lexicon セクション**を、Listening Idiom セクションの直後に追加。

**表示内容**

- **タイトル**: 「Listening Lexicon」
- **説明**: 講義・セミナーの signposting、説明・例のマーカー、比較・対比、強調・スタンス、プロセス・順序、ディスカッション表現の練習記録。`due_count > 0` のとき「· Due today: N」を表示。
- **By category（正答率）**: `stats_by_category` を grid で表示。ラベルは Lecture signposting, Explanation / example markers, Compare / contrast in speech, Emphasis / stance, Process / sequence in lectures, Seminar discussion signals（`LISTENING_LEXICON_CATEGORY_LABELS` と API の `category_label` で統一）。
- **Recent attempts**: 直近 10 件を日時・カテゴリ・正誤・回答・prompt 抜粋で表示。
- **CTA**: 「Review Listening Lexicon」または「Practice Listening Lexicon」（due_count に応じて文言切り替え）。リンク先は `/training/lexicon?skill=listening`。

**0 件時の空状態**

- `history.length === 0` かつ `stats_by_category.length === 0` かつ `due_count === 0` のとき、「まだ Listening Lexicon の記録がありません」と短文説明＋「Listening Lexicon を始める」リンク（同じ `/training/lexicon?skill=listening`）を表示。

**既存との整合**

- Reading Vocab / Reading Lexicon / Listening Vocab / Listening Idiom / Speaking の各ブロックは変更なし。Listening Lexicon は独立した 1 ブロック追加のみ。

---

## 4. build / lint / tsc 結果

- **npm run build**: 成功（exit 0）。
- **npm run lint**: 成功（既存の react-hooks/exhaustive-deps 等の Warning のみ。本 PR 起因の新規エラーなし）。
- **npx tsc --noEmit**: 成功。

---

## 5. 既知の制約

- Listening Lexicon の Due は「今日」のみ表示（Tokyo 日付の `listening_srs_state.next_review_on` で判定）。週間・月間の Due 集計は未実装。
- 履歴は直近 10 件のみ表示。API は内部で 50 件取得し、stats は 50 件で集計。
- topic / difficulty フィルタはなし（Reading Lexicon のようなフィルタは未追加）。
- Listening Vocab / Listening Idiom の Progress は既存の `countListeningDueToday` / `countListeningIdiomDueToday` のまま変更なし。Listening Lexicon は `countListeningLexiconDueToday`（module=lexicon）で別集計。
