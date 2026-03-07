# IELTS Training - 提供機能・価値の取りまとめ（ChatGPT共有用）

IELTS Writing / Speaking 向けの学習アプリ MVP の、現時点での提供機能と価値提案を整理したドキュメントです。外部（ChatGPT 等）への共有を想定しています。

---

## 1. アプリの位置づけ・価値提案

- **製品名**: IELTS Training（IELTS トレーニング）
- **対象**: IELTS Writing / Speaking のスコアアップを目指す学習者
- **価値**: データ駆動型アプローチで、AI による即時フィードバック・弱点分析・忘却曲線に基づく復習を提供し、独学では難しい「客観的フィードバック」と「学習戦略の可視化」を実現する
- **提供形態**: Web アプリ（Next.js）。MVP 期間中は無料で全機能を提供

---

## 2. 提供機能一覧（ユーザー向け）

### 2.1 認証・オンボーディング

- メール/パスワードでのサインアップ・ログイン（Supabase Auth）
- 初回時のオンボーディング（受験目的・現状レベル・推奨レベルの選択）
- プロファイルの作成・更新（目的、レベル）

### 2.2 ホーム・ナビゲーション

- **今日のメニュー**: Input（語彙・熟語・表現）と Output（Writing / Speaking）の Due 件数に基づく推奨カード表示
- レベル別の推奨タスク表示
- Input: 語彙練習（Vocab）・熟語練習（Idiom）・表現バンク（Bank）への導線
- Output: Speaking 練習・Writing Task 2（タスク選択）への導線
- ライト/ダークテーマ切替（全ページ共通、localStorage で保存）

### 2.3 Writing（ライティング）

- **タスク選択**: Task 1（グラフ・図表・地図）/ Task 2（エッセイ）の選択、レベル（初級・中級・上級）、ジャンル、モード（Training / Exam）
- **タスク実施**: LLM によるお題生成 → 回答入力・送信
- **PREP モード**（Task 2・初級/中級）: LLM が質問しながらエッセイ構築を支援し、その後本番エッセイ作成
- **穴埋め（Fill-in）**: フィードバック前の弱点補強用穴埋め問題（最大 3 問）
- **フィードバック**: LLM による Band 推定・ディメンション別コメント・改善アクション・書き直し対象の提示
- **書き直し（Rewrite）**: 指定箇所のみ編集して再評価
- **Task 1 進捗**: 推薦タスク・弱点統計・最近の練習一覧（Writing Task 1 用）

### 2.4 Speaking（スピーキング）

- **カテゴリ×Task 選択**: カテゴリ（例: work_study）と Task 1 / 2 / 3 の選択
- **ドリル画面**: Task 1〜3 ごとの瞬間英作文風ドリル（表現一覧・タイマー・声に出して答える形式）。録音・音声評価は未実装（テキストベース）
- プロンプト生成・セッション・回答記録・評価用 API あり（画面はドリル中心）

### 2.5 Input 学習（語彙・熟語・表現）

- **4 技能選択**: Reading / Listening（Coming soon）・Speaking / Writing から選択
- **語彙練習（Vocab）**: 単語の意味を覚える（クリック/タイピングモード）、カテゴリ・問題数選択
- **熟語練習（Idiom）**: イディオムを覚える（同上）
- **表現バンク（Lexicon）**: よく使う表現を覚える（同上）
- **SRS（間隔反復）**: 忘却曲線に基づく復習 Due の計算・表示
- **間違えた問題の復習**: 語彙で間違えた問題の再挑戦（vocabulary/review）

### 2.6 進捗・可視化

- **進捗サマリー**: 平均 Band・弱点タグの推移
- **履歴**: 完了したタスク一覧（日付・レベル・Band 推定・弱点タグ）
- **フィードバック詳細**: 各 Attempt に対する Band 範囲・ディメンション別コメント・書き直し提案

### 2.7 ランディングページ（LP）

- ヒーロー・特徴・料金（無料）・About・Contact（Google フォーム埋め込み or メール）
- サインアップ/ログイン導線
- 公式ブログ・Note へのリンク
- ライト/ダーク切替

---

## 3. 技術・外部連携（参考）

- **フロント**: Next.js 14（App Router）、TypeScript、Tailwind CSS
- **認証・DB**: Supabase（Auth, Postgres）。RLS による行単位のアクセス制御
- **LLM**: Groq / OpenAI 等（タスク生成、フィードバック、PREP ヒアリング、書き直し再評価）
- **ホスティング**: Vercel / Render 等を想定

---

## 4. 主要画面ルート（一覧）

| ルート | 内容 |
|--------|------|
| / | LP、サインアップ/ログイン |
| /login | ログイン |
| /onboarding | 目的・レベルヒアリング |
| /home | 今日のメニュー、Input/Output 導線 |
| /task/select | タスクタイプ・レベル・ジャンル選択 |
| /task/[taskId] | タスク実施（Task1/2） |
| /task/[taskId]/prep | PREP ヒアリング（Task2 初級/中級） |
| /training/vocab, /training/idiom, /training/lexicon | 語彙・熟語・表現学習（4 技能選択→カテゴリ→クイズ） |
| /training/vocabulary, /training/vocabulary/review | 語彙一覧・間違えた問題復習 |
| /training/speaking | カテゴリ・Task 選択 |
| /training/speaking/task1|2|3, .../drill | Speaking ドリル |
| /training/writing/task1, task1/progress, task2 | Writing Task1 入口・進捗・Task2 リダイレクト |
| /feedback/[attemptId] | フィードバック表示 |
| /fillin/[attemptId] | 穴埋め問題 |
| /rewrite/[attemptId] | 書き直し・再評価 |
| /progress | 進捗・履歴 |

---

## 5. 提供価値（ユーザー向けメッセージ）

- **即時スコア判定**: 提出後、AI が Band 推定とコメントを返す
- **論理構成アドバイス**: ディメンション別の改善ポイントを提示
- **学習ロードマップ**: 弱点タグ・Due に基づく「今日やるべきこと」の可視化
- **レベル別カリキュラム**: Beginner / Intermediate / Advanced に合わせた出題
- **忘却曲線ベースの復習**: 語彙・熟語・表現で SRS により定着を促進
- **無料で始められる**: MVP 期間中は全機能無料（将来的に有料化の可能性あり、移行期間を設ける方針）

---

## 6. 制限・未実装（現状）

- Speaking の録音・音声評価は未実装（テキストベースのドリルのみ）
- Reading / Listening の Input 学習は「Coming soon」
- 一部テーブル（speaking_prompts 等）は DB マイグレーションに含まれず、手動作成または別管理の可能性あり

---

以上を、ChatGPT 等に共有する際の「アプリの提供機能と価値」の説明として利用できます。
