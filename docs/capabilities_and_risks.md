# Capabilities and Risks

**目的**: 現状のケイパビリティ（機能・外部連携・データフロー）とリスクを整理し、優先順位を決められる状態にする。  
**最終更新**: 2025-02-26（タイポ/レスポンシブ/ダークモード/theme 実装後）

---

## 1. 画面・ルート一覧（主要ページ）

| ルート | 役割 | 備考 |
|--------|------|------|
| / | LP、サインアップ/ログイン | メイン導線 |
| /login | ログイン | 認証 |
| /onboarding | 目的ヒアリング | profiles |
| /home | 今日のメニュー、Input/Output 導線 | メイン導線 |
| /task/select | タスク選択 | 出題 |
| /task/[taskId] | タスク実施（Task1/2） | 出題・提出 |
| /task/[taskId]/prep | PREP ヒアリング | LLM 連携 |
| /training/vocab, idiom, lexicon | 語彙・熟語・表現学習 | 学習 |
| /training/speaking/* | Speaking 練習 | 学習 |
| /feedback/[attemptId] | フィードバック表示 | 結果表示 |
| /fillin/[attemptId] | 穴埋め | 復習 |
| /rewrite/[attemptId] | 書き直し | 復習 |
| /progress | 進捗 | 可視化 |

---

## 2. 学習機能一覧

| 機能 | 説明 | 主要ルート |
|------|------|------------|
| SRS | 忘却曲線に基づく語彙定着 | /training/vocab, idiom, lexicon |
| 出題 | Task1/2 エッセイ出題、穴埋め、Speaking ドリル | /task/*, /training/speaking/* |
| 記録 | 回答履歴・attempt・フィードバック | attempts, feedback |
| 今日のメニュー | Due 件数に基づく Input/Output 推奨 | /home, /api/menu/today |
| 表現プール | 推奨表現・lexicon_* | /api/input/items, /task/[taskId] |
| タイマー | 時間制限（一部画面） | task, speaking drill |
| PREP ヒアリング | LLM が質問しながらエッセイ構築 | /task/[taskId]/prep |
| AI フィードバック | LLM による採点・コメント | /feedback/[attemptId] |

---

## 3. 外部連携

| 連携先 | 用途 |
|--------|------|
| Supabase Auth | 認証・セッション |
| Supabase DB | profiles, tasks, attempts, feedback, lexicon_* |
| Groq / OpenAI (GPT-4o-mini) | LLM（タスク生成、フィードバック、PREP） |
| ホスティング | Vercel / Netlify 等 |

---

## 4. 依存先とデータフロー（画面→API→DB）

```
認証: Supabase Auth → session/cookies → middleware でガード
メニュー: /api/menu/today → lexicon_srs_state, profiles → Input/Output カード
タスク: /api/tasks/generate (LLM) → タスク作成 → /api/input/items → ユーザー実施
      → /api/tasks/[id]/submit → /api/output/submit で使用チェック
フィードバック: attempts → /api/llm/feedback → フィードバック生成・保存
```

---

## 5. リスク棚卸し（重大度・影響・対策案・優先順位）

| 観点 | リスク | 重大度 | 影響 | 対策案 | 優先順位 |
|------|--------|--------|------|--------|----------|
| セキュリティ | 認可漏れ（他ユーザー attempt 参照等） | 中 | 情報漏洩 | attempt_id に user_id 紐付け確認、API で所有者チェック | 高 |
| セキュリティ | 入力検証不足（XSS、インジェクション） | 中 | 脆弱性 | 出力のエスケープ、LLM 入力のサニタイズ | 中 |
| 信頼性 | Supabase 未設定時のビルド失敗 | 高 | デプロイ不可 | 静的生成時は API をスキップ、env チェックで早期 return | 高 |
| 信頼性 | LLM API 失敗時のフォールバック不足 | 中 | UX 悪化 | エラー時にフォールバック表示、リトライ案内 | 中 |
| 信頼性 | 外部 API（Groq, OpenAI）制限・障害 | 中 | 機能停止 | レート制限、エラーハンドリング、フォールバック | 中 |
| コスト | LLM API 連打・制限なし | 中 | コスト増 | クライアント側の連打防止、API 側のレート制限 | 中 |
| データ整合性 | ルート重複（/vocab, /training/writing/task2） | 低 | 混乱 | middleware で 308 リダイレクト（既存） | 低 |
| UX | 文字サイズ不統一 | 中 | 読みづらさ | タイポグラフィスケールの適用 | 高（対応済み） |
| UX | ダークモードが LP/Layout で効かない | 中 | 可読性 | #FAFAFA を CSS 変数参照に置換 | 高（対応済み） |
| UX | コントラスト不足（ダーク時） | 低 | 可読性 | トークン調整、WCAG 確認 | 中 |
| 保守性 | タイポトークン未使用 | 中 | 一貫性低下 | text-display, text-heading-* 等の採用 | 高（対応済み） |
| 保守性 | ハードコード色（#FAFAFA 等） | 中 | テーマ破綻 | CSS 変数・theme トークンへの移行 | 高（対応済み） |

---

## 6. 直近の改善トップ 5（今回実装で解消した点も含む）

| # | 項目 | 状態 | メモ |
|---|------|------|------|
| 1 | LP・Layout・login の背景を CSS 変数参照に変更 | ✅ 対応済 | bg-bg-secondary 等に置換。ダークモード有効化 |
| 2 | タイポグラフィトークンの採用 | ✅ 対応済 | text-heading-1/2/3, text-body, text-body-lg, text-ui 等を適用 |
| 3 | theme.ts の cardBase 等を CSS 変数参照に変更 | ✅ 対応済 | bg-surface, border-border, text-text に置換 |
| 4 | whitespace-nowrap の見直し | ✅ 対応済 | sm:whitespace-nowrap に変更、Header に truncate 追加 |
| 5 | Supabase 未設定時のビルド堅牢化 | 未対応 | 静的生成時の API スキップ等が必要 |

---

## 7. 次にやるべき改善候補（優先度順）

1. **Supabase 未設定時のビルド堅牢化**（信頼性・高）
2. **認可漏れの確認と修正**（セキュリティ・高）
3. **LLM API 失敗時のフォールバック強化**（信頼性・中）
4. **入力検証・サニタイズ強化**（セキュリティ・中）
5. **LLM API レート制限・連打防止**（コスト・中）
