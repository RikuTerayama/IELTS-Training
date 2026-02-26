# Step2実装完了レポート

## 実装概要

Lexiconの出題を「忘却曲線（SRS）＋未回答優先」に変更し、submit時にSRS状態を更新、次回出題日を決定する機能を実装しました。`/api/menu/today`に「今日やるべきLexicon（due件数）」を反映し、今日のメニューとして提示できる状態にしました。

---

## 実装したファイル

### 1. 日付ユーティリティ

#### `lib/utils/dateTokyo.ts` (新規作成)
- `getTokyoDateString()`: Tokyo基準で今日の日付文字列を取得（YYYY-MM-DD形式）
- `addDays(dateString, days)`: 日付文字列に指定日数を加算
- `compareDates(date1, date2)`: 日付文字列を比較

### 2. データベースマイグレーション

#### `supabase/migrations/006_lexicon_srs_state.sql` (新規作成)
- `lexicon_srs_state` テーブル:
  - id, user_id, item_id, mode, stage, next_review_on, last_review_on
  - correct_streak, total_correct, total_wrong, updated_at
  - UNIQUE(user_id, item_id, mode)
- インデックス: (user_id, mode, next_review_on), (user_id, item_id, mode), (next_review_on)
- RLS: 本人のみ閲覧・挿入・更新可能

### 3. SRS更新ロジック

#### `lib/lexicon/srs.ts` (新規作成)
- `STAGE_INTERVALS`: [0, 1, 3, 7, 14, 30]（日数）
- `updateSRSState()`: SRS状態を更新
  - **正答**: stageを上げる（最大MAX_STAGE）、correct_streakを増やす、total_correctを増やす、next_review_onを更新
  - **誤答**: stageを0にリセット、correct_streakを0に、total_wrongを増やす、next_review_onを翌日に
  - **初回**: stage=0, next_review_on=today（newは今日出せる）
- `isDueToday()`: 今日復習すべきかどうかを判定

### 4. API更新

#### `app/api/lexicon/submit/route.ts` (更新)
- SRS連動を追加:
  - question.item_idを取得（無い場合はcorrect_expressionで引く）
  - 現在のSRS状態を取得
  - `updateSRSState()`で更新
  - `lexicon_srs_state`をupsert

#### `app/api/lexicon/questions/route.ts` (更新)
- 「due + new優先」の出題戦略:
  1. **dueItems**: `next_review_on <= today` のitem_idを取得（そのcategoryに属するもの）
  2. **newItems**: そのユーザーのsrs_stateが存在しないitem（そのcategory）
  3. **優先配分**: まずdueから最大limit、足りなければnewで埋める
  4. **問題取得**: item_idを軸に、該当itemのquestionを優先して取得（複数ある場合はランダム）
  5. **fallback**: 足りない場合はcategory+modeからランダム取得
- mode=typingのときはtyping_enabled=trueを必須条件

#### `app/api/lexicon/sets/route.ts` (更新)
- 認証チェックを追加（due件数を取得するため）
- `due_click`, `due_typing`を追加:
  - 今日時点で`next_review_on <= today`の件数
  - category別に集計

#### `app/api/menu/today/route.ts` (更新)
- Lexicon due件数を取得（認証済みの場合のみ）
- lexiconカードのdescriptionに「Due: X」を追加
- noticesに「Lexicon reviews due today: click X, typing Y」を追加

### 5. UI更新

#### `app/training/lexicon/page.tsx` (更新)
- category選択時にdue件数を表示
- mode選択時にdue件数を表示

#### `lib/api/lexicon.ts` (更新)
- `LexiconSetsResponse`に`due_click`, `due_typing`を追加

---

## 実装内容の詳細

### 1. SRS更新ルール

#### 正答時
- `stage = min(stage + 1, MAX_STAGE)`
- `correct_streak += 1`
- `total_correct += 1`
- `next_review_on = today + STAGE_INTERVALS[stage]`

#### 誤答時
- `stage = 0`
- `correct_streak = 0`
- `total_wrong += 1`
- `next_review_on = today + 1`（翌日復習）

#### 初回
- `stage = 0`
- `next_review_on = today`（newは今日出せる）

### 2. 出題優先順位

1. **due優先**: `next_review_on <= today`のitem
2. **new優先**: srs_stateが存在しないitem
3. **fallback**: それでも足りない場合はcategory+modeからランダム

### 3. 今日のメニューへの反映

- `/api/menu/today`でLexicon due件数を取得
- lexiconカードのdescriptionに「Due: X」を表示
- noticesに「Lexicon reviews due today: click X, typing Y」を追加

---

## 受け入れ条件の確認

- ✅ migration 006 が適用できる（実装完了）
- ✅ submit時に lexicon_srs_state が作られ/更新される（実装完了）
- ✅ questionsが due優先、次に未回答優先で返る（実装完了）
- ✅ sets が due_click/due_typing を返す（実装完了）
- ✅ menu/today に due件数が反映される（実装完了）

---

## 注意事項

### Tokyo基準の日付
- サーバ側の「今日判定」は必ずTokyo基準（`getTokyoDateString()`）
- UTCズレを防止

### 次のステップ
- UI改修は最小限（Step1-2の画面は壊さない）
- 必要なら件数表示だけ追加（実装済み）

---

## 実装ファイル一覧

### 新規作成
- `lib/utils/dateTokyo.ts`
- `supabase/migrations/006_lexicon_srs_state.sql`
- `lib/lexicon/srs.ts`

### 更新
- `app/api/lexicon/submit/route.ts`
- `app/api/lexicon/questions/route.ts`
- `app/api/lexicon/sets/route.ts`
- `app/api/menu/today/route.ts`
- `app/training/lexicon/page.tsx` (due件数表示)
- `lib/api/lexicon.ts` (型定義更新)

---

**実装完了日**: Step2実装時
