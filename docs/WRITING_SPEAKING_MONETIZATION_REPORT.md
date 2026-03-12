# Writing essay 添削・Speaking AI 面接 マネタイズ対応 報告

## 1. Root cause / 既存不足の整理

| 領域 | 状況 |
|------|------|
| **Writing フィードバック** | 既存で band・dimensions（TR/CC/LR/GRA）・band_up_actions・rewrite_targets・vocab_suggestions・strengths は API/LLM で生成・保存されていたが、**画面で strengths / rewrite_targets / vocab_suggestions を表示していなかった**。また基準名が短いラベルのみで、IELTS 公式名（Task Response, Coherence and Cohesion 等）がなかった。無料枠到達時の文言が英語だった。 |
| **Speaking フィードバック** | 評価画面のラベルが英語（Evaluation, Top fixes, Back to Progress）。**Pronunciation が音声未実装である旨の注記がなく**、参考値であることが分かりづらかった。 |
| **履歴・再訪** | Progress の Speaking 履歴の見出し・ボタンが英語。Writing フィードバック画面に「履歴を見る」導線がなく、率直な Pro 訴求（回数無制限・履歴保存）が弱かった。 |
| **マネタイズ導線** | 無料枠到達時のメッセージが英語。Exam Speaking の「本日の残り」表示も英語。Pro への誘導文言を日本語化し、料金ページへのリンクを明確にした。 |

## 2. 変更ファイル一覧

- `app/feedback/[attemptId]/page.tsx` — Writing フィードバック: 良い点・具体的に直す箇所・語彙の改善案を表示、IELTS 基準名、Pro 訴求・履歴リンク、無料枠文言の日本語化、ボタン整理
- `app/speaking/feedback/[attemptId]/page.tsx` — 評価セクションの日本語化、Pronunciation 注記、基準名（Fluency and Coherence 等）、履歴に戻る・もう一度面接する
- `app/progress/page.tsx` — Speaking 履歴の見出し・説明・「詳細」「もう一度面接する」を日本語化
- `app/exam/speaking/page.tsx` — 本日の残り・無料枠・Pro の表示を日本語化
- `docs/WRITING_SPEAKING_MONETIZATION_REPORT.md` — 本報告（新規）

## 3. Writing essay 添削の改善内容

- **表示の拡充**
  - **良い点**: `feedback.strengths` をカードで表示（基準・説明・例）。
  - **基準別評価**: 従来の「4次元評価」を「基準別評価」にし、**IELTS 公式名**（Task Response / Task Achievement, Coherence and Cohesion, Lexical Resource, Grammatical Range and Accuracy）を表示。プログレスバーは固定クラスで表示（動的クラスを廃止）。
  - **具体的に直す箇所**: `feedback.rewrite_targets` を表示（該当文・問題点・修正のポイント）。
  - **語彙の改善案**: `feedback.vocab_suggestions` を表示（元の語・提案・文脈・説明）。
- **次に Band を上げる3つの行動**: 既存の band_up_actions を維持しつつ、優先度ごとの色を固定クラスで指定。
- **Pro 訴求**: 総合 Band 下に「Proで回数無制限・履歴保存」リンク（`/#pricing`）を追加。
- **無料枠到達時**: 「本日の無料枠に達しました」「Pro にアップグレードすると…」「料金を見る」「履歴を見る」「ホームに戻る」に変更。
- **アクション**: 「改善して書き直す」（rewrite_targets がある場合）、「履歴を見る」（/progress）、「ホームに戻る」。不要な「Speak」ボタンは削除。

## 4. Speaking AI 面接の改善内容

- **評価画面の日本語化**
  - 見出し「Evaluation」→「評価」、「Overall Band」→「総合 Band」。
  - 基準名を IELTS に合わせて表示: Fluency and Coherence, Lexical Resource, Grammatical Range and Accuracy, Pronunciation。
  - 「Top fixes」→「改善ポイント」。
  - 「Back to Progress」→「履歴に戻る」、「Try another interview」→「もう一度面接する」。
- **Pronunciation 注記**: Pronunciation の Band 表示の上に「（音声未実装のため参考値です）」を表示。
- **Progress の Speaking 履歴**: 「Speaking History」→「スピーキング面接履歴」、説明文を日本語化、「View details」→「詳細」、「Try another interview」→「もう一度面接する」。
- **Exam Speaking の利用枠表示**: 「Remaining today」→「本日の残り」、「Unlimited (Pro)」→「無制限（Pro）」、「No free attempts left today」→「本日の無料枠を使い切りました」、「View pricing」→「料金を見る」、「Last free attempt today」→「本日あと1回です」、「Resets at 00:00 JST」→「0:00 JSTでリセット」。

## 5. 無料枠 / Pro 枠の差分設計

- **既存の仕組み**: `consumeOrThrow429`（writing / speaking の delta）、`/api/usage/today` による本日残数、`is_pro` による無制限表示がすでに存在。
- **今回の UI での整理**
  - **Writing**: フィードバック画面で無料枠到達時に「Pro にアップグレードすると回数無制限・履歴保存が利用できます」と明示。常時「Proで回数無制限・履歴保存」リンクを表示。
  - **Speaking**: Exam 開始前の「本日の残り」で、0 件時は「本日の無料枠を使い切りました」＋「料金を見る」、Pro 時は「無制限（Pro）」と表示。
- **履歴**: Writing は `/api/progress/history`（最新10件）、Speaking は `/api/progress/speaking-history` で取得。いずれも「履歴に戻る」／「履歴を見る」で /progress に誘導。履歴保持件数・保存期間の差別化は既存 API の拡張となるため今回は未実装。

## 6. Build / Lint / tsc 結果

- **npm run build**: 成功（既存の ESLint 警告のみ）。
- **npm run lint**: 成功（既存警告のみ）。
- **npx tsc --noEmit**: 成功。

## 7. 既知の制約

- 音声録音は未実装のため、Speaking の Pronunciation はテキスト入力のみの参考値として注記済み。
- Stripe / 課金の商品設計変更は行っていない。既存の usage limit と pricing 表示を前提に UI のみ調整。
- Writing の「Exam mode」直行（PREP なしでエッセイのみ提出）フローは既存の task/select → prep → submit → feedback を想定。エッセイのみ提出の専用ルートは未追加。
- commit / push および開発ブランチの新規作成は行っていない。
