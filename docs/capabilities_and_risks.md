# ケイパビリティと潜在的リスク（棚卸し）

更新日: 2025年時点。開発継続時の「何ができていて」「何が事故の種か」を明文化し、優先順位を付けられる状態にする。

---

## 1. 画面・ルート一覧（CAP-FR-1）

| ルート | 説明 | 認証 |
|--------|------|------|
| `/` | LP（ランディング） | 不要 |
| `/login` | ログイン | 未認証時のみ |
| `/onboarding` | 目的ヒアリング | 要 |
| `/home` | Top（今日のメニュー） | 要 |
| `/training/vocab` | 語彙トレーニング（正） | 要 |
| `/training/idiom` | イディオム | 要 |
| `/training/lexicon` | 表現バンク（Bank） | 要 |
| `/training/speaking` | Speaking カテゴリ・Task選択 | 要 |
| `/training/speaking/task{1,2,3}/drill` | Speaking 実施 | 要 |
| `/training/writing/task1` | Writing Task1 入口 | 要 |
| `/training/writing/task1/progress` | Task1 進捗 | 要 |
| `/training/vocabulary` | 語彙（旧）→ /training/vocab へ誘導 | 要 |
| `/training/vocabulary/review` | 語彙復習 | 要 |
| `/task/select` | タスク選択（Task1/2） | 要 |
| `/task/[taskId]` | タスク実施・提出 | 要 |
| `/task/[taskId]/prep` | PREPモード（Task2 初級・中級） | 要 |
| `/feedback/[attemptId]` | フィードバック閲覧 | 要 |
| `/progress` | 進捗 | 要 |
| `/rewrite/[attemptId]`, `/fillin/[attemptId]` | 穴埋め等 | 要 |
| `/vocab` | 廃止 → 308 で /training/vocab へ | - |

---

## 2. 学習機能（CAP-FR-1）

| 機能 | 説明 | 依存API・データ |
|------|------|-----------------|
| 今日のメニュー | Input/Output カード、XP表示 | `GET /api/menu/today` |
| Input 語彙・イディオム・Bank | 語彙/idiom/lexicon 学習 | lexicon API（sets, questions, submit）, `lexicon_items`, `lexicon_srs_state` |
| SRS（復習） | 忘却曲線に基づく due 管理 | `lexicon_srs_state`, next_review_on |
| Speaking Task1〜3 | カテゴリ×Task、推奨表現、タイマー | `/api/input/items`（表現）, 静的プロンプト |
| Writing Task1 | グラフ等・ステップ学習 | task1 attempts, recommendation, review API |
| Writing Task2 | レベル別（穴埋め/PREP/自由） | tasks/generate, tasks/[id]/submit, LLM（prep-to-essay, feedback） |
| タスク生成 | ジャンル・レベル指定でタスク作成 | `POST /api/tasks/generate` |
| フィードバック | 提出後のAIフィードバック | `POST /api/llm/feedback` 等 |
| 進捗・履歴 | サマリー・履歴表示 | progress/summary, progress/history |

---

## 3. 外部連携・依存先（CAP-FR-2）

| 種別 | 依存先 | 用途 | データの流れ |
|------|--------|------|--------------|
| 認証 | Supabase Auth | ログイン・セッション | Cookie / JWT、middleware でガード |
| DB | Supabase (PostgreSQL) | ユーザー、タスク、attempts、lexicon、SRS | API Routes から createClient（server）で R/W |
| LLM | Groq / OpenAI（GPT-4o-mini） | フィードバック、PREP→エッセイ、評価 | API Routes 内で呼び出し、ユーザー入力を送信 |
| ホスティング | （Vercel 等を想定） | デプロイ | 環境変数で Supabase/LLM キーを注入 |
| 問い合わせ | メール / Google Forms | LP の Contact | 定数（環境変数）で URL 管理 |

---

## 4. データの流れ（CAP-FR-2）

- **認証**: middleware で `getSession`/`getUser` → 保護パスは未認証時 `/login` へリダイレクト。
- **今日のメニュー**: `GET /api/menu/today` が Supabase で due 件数等を取得し、Input/Output カードを返す。
- **語彙・表現**: `lexicon_items`（module=vocab/idiom/lexicon）→ sets → questions → 回答は `lexicon_submit` 経由で SRS 更新（`lexicon_srs_state`）。
- **タスク**: `tasks/generate` でタスク作成 → `task/[taskId]` で実施 → `tasks/[taskId]/submit` で保存。Task2 は prep API で日本語→英語変換、LLM でフィードバック。
- **進捗**: `progress/summary`, `progress/history` が attempts 等を集約。

---

## 5. リスク棚卸し（RISK-FR-1〜6）

### 5.1 セキュリティ（RISK-FR-1）

| リスク | 重大度 | 影響 | 対策案 | 優先 |
|--------|--------|------|--------|------|
| 環境変数・キーの露出 | 高 | 認証/DB/LLM の悪用 | キーは env のみ、ログに含めない、本番で console.log 削減 | 高 |
| 認可漏れ | 中 | 未ログインで保護ページ閲覧 | middleware の protectedPaths の網羅確認、新ルート追加時の見直し | 中 |
| 入力の扱い（XSS等） | 中 | 表示時のスクリプト実行 | ユーザー入力をそのまま dangerouslySetInnerHTML に渡さない、React のエスケープに依存 | 中 |

### 5.2 信頼性・可用性（RISK-FR-2）

| リスク | 重大度 | 影響 | 対策案 | 優先 |
|--------|--------|------|--------|------|
| Supabase 障害 | 高 | ログイン・DB 不可 | リトライ・エラー表示の統一、障害時のメッセージ | 中 |
| LLM タイムアウト・失敗 | 中 | フィードバックが返らない | タイムアウト設定、リトライ、フォールバックメッセージ | 中 |
| 静的生成時の動的利用 | 中 | ビルドエラー（request.url, cookies） | API/ページで dynamic 指定の明示、必要なら force-dynamic | 低 |

### 5.3 コストと濫用耐性（RISK-FR-3）

| リスク | 重大度 | 影響 | 対策案 | 優先 |
|--------|--------|------|--------|------|
| LLM API 連打 | 高 | コスト増・レート制限 | レート制限（API または middleware）、1ユーザーあたり制限 | 高 |
| 認証なしでの API 直接叩き | 中 | 不正利用 | 全 API で getUser() チェック統一 | 中 |

### 5.4 データ整合性（RISK-FR-4）

| リスク | 重大度 | 影響 | 対策案 | 優先 |
|--------|--------|------|--------|------|
| SRS 更新の二重・不整合 | 中 | 復習日がおかしくなる | 更新は単一経路、トランザクション検討 | 中 |
| /vocab と /training/vocab の二重管理 | 低 | 解消済み（/vocab はリダイレクト） | 現状維持 | - |

### 5.5 UX・アクセシビリティ（RISK-FR-5）

| リスク | 重大度 | 影響 | 対策案 | 優先 |
|--------|--------|------|--------|------|
| コントラスト・フォント | 中 | 可読性 | タイポトークン・ダーク背景の統一（今回対応） | 済 |
| 横スクロール・折り返し | 中 | スマホで崩れ | min-w-0, break-words, overflow-x-hidden（今回対応） | 済 |
| フォーカス・キーボード | 低 | アクセシビリティ | focus-visible の一貫、スキップリンク検討 | 低 |

### 5.6 保守性（RISK-FR-6）

| リスク | 重大度 | 影響 | 対策案 | 優先 |
|--------|--------|------|--------|------|
| 未使用ファイル・古い SQL | 低 | 複雑化 | 参照ゼロのもののみ削除、マイグレーションは触らない | 低 |
| middleware の console.log | 中 | 本番ログ肥大化・情報漏れ | 本番では無効化またはレベル制御 | 中 |
| 重複実装（例: 同じフォーム複数） | 低 | 修正漏れ | コンポーネント化の段階的推進 | 低 |

---

## 6. 直近でやるべき改善トップ5（CAP-AC-3）

1. **本番で middleware の console.log を無効化する**（セキュリティ・保守性）
2. **LLM 呼び出しにレート制限を入れる**（コスト・濫用耐性）
3. **全 API で認可チェックを統一する**（未認証での直叩き防止）
4. **Supabase/LLM 障害時のエラー表示・リトライ方針を決め、1箇所で扱う**（信頼性）
5. **環境変数チェックリストを README に明記し、キーがコードに混入していないか定期確認**（セキュリティ）

---

## 7. ドキュメントの更新

- 新規ルート・API を追加したら本ドキュメントの「画面・ルート一覧」「学習機能」「外部連携」「データの流れ」を更新する。
- 障害・インシデントがあったら「リスク」に事実と対策を追記する。
- 四半期ごとに「直近でやるべき改善トップ5」を見直す。
