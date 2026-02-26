# IELTS Training デザイン変更対象ファイル一覧（Google Gemini用）

## 概要

このドキュメントは、LandingPage（`app/page.tsx`）以外のページのデザイン変更を依頼する際に、Google Geminiに渡すための情報を整理したものです。

**重要**: LandingPage（`app/page.tsx`）は除外してください。このファイルは既に最新のデザインが適用されています。

---

## 1. 共通コンポーネント（全ページに影響）

### 1.1 Layout（レイアウト）
**ファイル**: `components/layout/Layout.tsx`
- **役割**: 全ページの共通レイアウト（Header + Main + Footer）
- **現在のスタイル**: `bg-bg`（背景色）、`flex min-h-screen flex-col`
- **変更可能箇所**: 背景色、レイアウト構造、余白

### 1.2 Header（ヘッダー）
**ファイル**: `components/layout/Header.tsx`
- **役割**: 全ページ共通のヘッダー（ロゴ、ナビゲーション、ログイン状態）
- **現在のスタイル**: 
  - `border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50`
  - ロゴ: `text-xl font-bold text-primary`
  - ナビゲーション: `text-text-muted hover:text-text`
- **変更可能箇所**: 
  - ヘッダーの背景色・透明度
  - ロゴのスタイル
  - ナビゲーションメニューのデザイン
  - モバイルメニューのデザイン
  - ログイン/ログアウトボタンのスタイル

### 1.3 Footer（フッター）
**ファイル**: `components/layout/Footer.tsx`
- **役割**: 全ページ共通のフッター（進捗表示、次のおすすめ）
- **現在のスタイル**: 
  - `border-t border-border bg-surface/50 backdrop-blur-sm`
  - テキスト: `text-sm text-text-muted`
- **変更可能箇所**: 
  - フッターの背景色・透明度
  - テキストスタイル
  - レイアウト構造

---

## 2. 認証関連ページ

### 2.1 Login（ログイン）
**ファイル**: `app/(auth)/login/page.tsx`
- **URL**: `/login`
- **役割**: ログイン/サインアップフォーム
- **現在のスタイル**: 
  - 背景: `bg-bg`
  - カード: `bg-surface border border-border`
  - 入力欄: `bg-surface-2 text-text`（既に`text-gray-900`に修正済み）
- **変更可能箇所**: 
  - ページ全体の背景デザイン
  - フォームカードのデザイン
  - ボタンのスタイル
  - エラーメッセージの表示方法
  - ログイン/サインアップ切り替えUI

---

## 3. メインページ

### 3.1 Home（ホーム）
**ファイル**: `app/home/page.tsx`
- **URL**: `/home`
- **役割**: 今日のメニュー表示（Input/Outputモジュール、通知）
- **主要コンポーネント**:
  - Lv/Exp表示（Input Level, Output Level）
  - Inputセクション（vocab, idiom, lexicon）
  - Outputセクション（writing_task1, writing_task2, speaking）
  - 通知（notices）
  - Blogセクション
- **現在のスタイル**: 
  - カード: `cardBase`（`bg-surface border border-border`）
  - タイトル: `cardTitle`（`text-lg font-semibold text-text`）
  - 説明: `cardDesc`（`text-sm text-text-muted`）
- **変更可能箇所**: 
  - カードレイアウト（グリッド、リスト等）
  - カードのデザイン（影、角丸、色）
  - モジュールカードのCTAボタン
  - Lv/Exp表示のデザイン
  - 通知の表示方法

### 3.2 Onboarding（オンボーディング）
**ファイル**: `app/onboarding/page.tsx`
- **URL**: `/onboarding`
- **役割**: 初回設定（目的選択、レベル選択、レベル登録）
- **主要ステップ**:
  1. 目的選択（university_admission, work_visa, immigration等）
  2. 現状レベル選択（beginner, intermediate, advanced）
  3. 推奨レベル提案
  4. レベル登録
- **現在のスタイル**: 
  - Layoutコンポーネントを使用
  - カードベースの選択UI
- **変更可能箇所**: 
  - ステップインジケーターのデザイン
  - 選択カードのデザイン
  - ボタンのスタイル
  - プログレスバー

---

## 4. 学習ページ（Input）

### 4.1 Lexicon（表現バンク）
**ファイル**: `app/training/lexicon/page.tsx`
- **URL**: `/training/lexicon`
- **役割**: Lexicon学習（skill選択 → category選択 → mode選択 → クイズ）
- **主要ステップ**:
  1. Skill選択（writing/speaking）
  2. Category選択（カテゴリ別の問題数、due件数表示）
  3. Mode選択（click/typing）
  4. クイズセッション（10問）
- **現在のスタイル**: 
  - カードベースの選択UI
  - Clickモード: 4択ボタン、10秒タイマー
  - Typingモード: 入力欄、hint表示
- **変更可能箇所**: 
  - 選択カードのデザイン
  - クイズ画面のレイアウト
  - タイマーの表示方法
  - 結果表示のデザイン
  - サマリー画面のデザイン

### 4.2 Idiom（熟語）
**ファイル**: `app/training/idiom/page.tsx`
- **URL**: `/training/idiom`
- **役割**: Idiom学習（Lexiconと同じUI構造、`module='idiom'`）
- **変更可能箇所**: Lexiconと同じ

### 4.3 Vocab（単語）
**ファイル**: `app/training/vocab/page.tsx`
- **URL**: `/training/vocab`
- **役割**: Vocab学習（Lexiconと同じUI構造、`module='vocab'`）
- **変更可能箇所**: Lexiconと同じ

---

## 5. 学習ページ（Output）

### 5.1 Task（タスク画面）
**ファイル**: `app/task/[taskId]/page.tsx`
- **URL**: `/task/[taskId]`
- **役割**: Writing Task 1/2の回答入力画面
- **主要コンポーネント**:
  - タスク質問表示
  - 必須使用表現（Required Items）表示
  - レベル別入力フォーム
  - PREPガイド（初級/中級）
  - 提出ボタン
  - 使用チェック結果表示
- **現在のスタイル**: 
  - Layoutコンポーネントを使用
  - カードベースのUI
  - 必須表現: `bg-accent-indigo/10 border border-accent-indigo/20`
- **変更可能箇所**: 
  - タスク質問の表示方法
  - 必須表現のバッジデザイン
  - 入力フォームのデザイン
  - PREPガイドの表示方法
  - 提出ボタンのスタイル
  - 使用チェック結果の表示方法

### 5.2 Speaking（スピーキング練習）
**ファイル**: `app/training/speaking/page.tsx`
- **URL**: `/training/speaking`
- **役割**: Speaking練習（最小実装、テキスト入力）
- **主要ステップ**:
  1. トピック選択（ハードコード）
  2. 必須使用表現表示
  3. ユーザー入力（テキスト）
  4. 提出 → 使用チェック結果表示
- **変更可能箇所**: 
  - トピック選択UI
  - 必須表現の表示方法
  - 入力フォームのデザイン
  - 結果表示のデザイン

---

## 6. フィードバック・学習履歴ページ

### 6.1 Feedback（フィードバック）
**ファイル**: `app/feedback/[attemptId]/page.tsx`
- **URL**: `/feedback/[attemptId]`
- **役割**: フィードバック表示（Band推定、4次元評価、Band-up actions）
- **主要コンポーネント**:
  - Overall Band Range表示
  - 4次元評価（TR, CC, LR, GRA）
  - Strengths表示
  - Band-up Actions（最大3つ）
  - Rewrite Targets
  - Vocab Suggestions
  - アクションボタン（Rewrite, Speak）
- **現在のスタイル**: 
  - Layoutコンポーネントを使用
  - カードベースのUI
- **変更可能箇所**: 
  - Band Rangeの表示方法（バッジ、グラフ等）
  - 4次元評価の可視化（レーダーチャート、バー等）
  - Band-up Actionsのカードデザイン
  - Rewrite Targetsの表示方法
  - Vocab Suggestionsの表示方法
  - アクションボタンのスタイル

### 6.2 Progress（進捗）
**ファイル**: `app/progress/page.tsx`
- **URL**: `/progress`
- **役割**: 学習履歴・進捗表示
- **主要コンポーネント**:
  - 進捗サマリー（平均Band、完了タスク数等）
  - 履歴一覧（最新10件）
  - 弱点タグ推移
- **現在のスタイル**: 
  - Layoutコンポーネントを使用
  - カードベースのUI
- **変更可能箇所**: 
  - サマリーカードのデザイン
  - 履歴リストのデザイン
  - 弱点タグの表示方法
  - グラフ・チャートのデザイン（将来的に追加する場合）

---

## 7. その他のページ

### 7.1 Task Select（タスク選択）
**ファイル**: `app/task/select/page.tsx`
- **URL**: `/task/select`
- **役割**: タスク選択（Task1/Task2、レベル、ジャンル）
- **変更可能箇所**: 選択UIのデザイン

### 7.2 Rewrite（書き直し）
**ファイル**: `app/rewrite/[attemptId]/page.tsx`
- **URL**: `/rewrite/[attemptId]`
- **役割**: 書き直し画面（2カラム表示、指定範囲のみ編集）
- **変更可能箇所**: 2カラムレイアウト、編集エリアのデザイン

### 7.3 Fill-in（穴埋め）
**ファイル**: `app/fillin/[attemptId]/page.tsx`
- **URL**: `/fillin/[attemptId]`
- **役割**: 穴埋め問題画面（選択式、最大3問）
- **変更可能箇所**: 問題表示、選択肢ボタンのデザイン

### 7.4 Writing Task 1
**ファイル**: `app/training/writing/task1/page.tsx`
- **URL**: `/training/writing/task1`
- **役割**: Writing Task 1専用ページ
- **変更可能箇所**: ページ全体のデザイン

### 7.5 Writing Task 2
**ファイル**: `app/training/writing/task2/page.tsx`
- **URL**: `/training/writing/task2`
- **役割**: Writing Task 2専用ページ
- **変更可能箇所**: ページ全体のデザイン

---

## 8. UIテーマシステム

### 8.1 テーマトークン
**ファイル**: `lib/ui/theme.ts`
- **役割**: 共通のUIトークン定義（カラー、フォント、スペーシング等）
- **主要トークン**:
  - `cardBase`: カードの基本スタイル
  - `cardTitle`: カードタイトルのスタイル
  - `cardDesc`: カード説明のスタイル
  - `buttonPrimary`: プライマリボタンのスタイル
  - `buttonSecondary`: セカンダリボタンのスタイル
  - `inputBase`: 入力欄の基本スタイル
  - `textareaBase`: テキストエリアの基本スタイル
- **変更可能箇所**: 
  - カラーパレット
  - フォントサイズ・ウェイト
  - スペーシング
  - 角丸
  - 影

### 8.2 グローバルスタイル
**ファイル**: `app/globals.css`
- **役割**: グローバルCSS、Tailwind設定
- **変更可能箇所**: 
  - カスタムCSS変数
  - Tailwind設定
  - フォント設定

---

## 9. デザイン変更の優先順位

### Phase 1: 高優先度（全ページに影響）
1. **共通コンポーネント**（Layout, Header, Footer）
   - 全ページの基盤となるため、最初に変更すべき
   - ファイル: `components/layout/Layout.tsx`, `Header.tsx`, `Footer.tsx`

2. **UIテーマシステム**
   - 全ページのスタイルに影響
   - ファイル: `lib/ui/theme.ts`, `app/globals.css`

### Phase 2: 中優先度（主要ページ）
3. **Homeページ**
   - ユーザーが最初に見るページ
   - ファイル: `app/home/page.tsx`

4. **Loginページ**
   - 認証フローの入口
   - ファイル: `app/(auth)/login/page.tsx`

5. **Taskページ**
   - コア機能のメインページ
   - ファイル: `app/task/[taskId]/page.tsx`

6. **Feedbackページ**
   - 重要な結果表示ページ
   - ファイル: `app/feedback/[attemptId]/page.tsx`

### Phase 3: 低優先度（学習ページ）
7. **Trainingページ**（Lexicon, Idiom, Vocab, Speaking）
   - ファイル: `app/training/lexicon/page.tsx`, `idiom/page.tsx`, `vocab/page.tsx`, `speaking/page.tsx`

8. **その他のページ**（Onboarding, Progress, Rewrite, Fill-in等）

---

## 10. Google Geminiへの依頼時の推奨プロンプト構造

```
以下のIELTS Trainingアプリケーションのページデザインを、LandingPage（app/page.tsx）のモダンなデザインに合わせてブラッシュアップしてください。

【除外ファイル】
- app/page.tsx（LandingPage）は変更不要です。

【優先的に変更するファイル】
1. components/layout/Header.tsx
2. components/layout/Footer.tsx
3. app/home/page.tsx
4. app/(auth)/login/page.tsx
5. app/task/[taskId]/page.tsx
6. app/feedback/[attemptId]/page.tsx

【デザイン方針】
- LandingPageと同じモダンなデザイン言語を使用
- カラーパレット: indigo/blue系を基調
- カードデザイン: 角丸、影、ホバー効果
- タイポグラフィ: 読みやすさを重視
- レスポンシブ: モバイル対応

【技術スタック】
- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- 既存のUIトークン（lib/ui/theme.ts）を活用

【注意事項】
- 既存の機能・ロジックは変更しない
- 既存のAPI呼び出しは維持
- 型定義は変更しない
```

---

## 11. ファイル一覧（編集対象）

### 共通コンポーネント
- `components/layout/Layout.tsx`
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`

### 認証
- `app/(auth)/login/page.tsx`

### メインページ
- `app/home/page.tsx`
- `app/onboarding/page.tsx`

### 学習ページ（Input）
- `app/training/lexicon/page.tsx`
- `app/training/idiom/page.tsx`
- `app/training/vocab/page.tsx`

### 学習ページ（Output）
- `app/task/[taskId]/page.tsx`
- `app/training/speaking/page.tsx`

### フィードバック・履歴
- `app/feedback/[attemptId]/page.tsx`
- `app/progress/page.tsx`

### その他
- `app/task/select/page.tsx`
- `app/rewrite/[attemptId]/page.tsx`
- `app/fillin/[attemptId]/page.tsx`
- `app/training/writing/task1/page.tsx`
- `app/training/writing/task2/page.tsx`

### UIテーマ
- `lib/ui/theme.ts`
- `app/globals.css`

---

## 12. 参考情報

### LandingPageのデザイン特徴
- 背景: `bg-[#FAFAFA]`（薄いグレー）
- カード: `bg-white rounded-2xl shadow-sm border border-slate-100`
- プライマリカラー: `indigo-600`, `blue-500`
- テキスト: `text-slate-900`（見出し）、`text-slate-600`（本文）
- ホバー効果: `hover:shadow-xl hover:-translate-y-1 transition-all`
- グラデーション: `bg-gradient-to-br from-indigo-50 to-blue-50`

### 既存のUIトークン（lib/ui/theme.ts）
- `cardBase`: `bg-surface border border-border rounded-lg p-4`
- `cardTitle`: `text-lg font-semibold text-text`
- `cardDesc`: `text-sm text-text-muted`
- `buttonPrimary`: `bg-primary text-primary-foreground`
- `buttonSecondary`: `bg-surface-2 text-text border border-border`

---

## 13. 注意事項

1. **機能の維持**: デザイン変更時は、既存の機能・ロジックを変更しないでください
2. **API互換性**: 既存のAPI呼び出しは維持してください
3. **型定義**: TypeScriptの型定義は変更しないでください
4. **アクセシビリティ**: キーボード操作、スクリーンリーダー対応を維持してください
5. **パフォーマンス**: 過度なアニメーションや重い画像は避けてください

---

## 14. チェックリスト

デザイン変更後、以下を確認してください：

- [ ] 全ページが正常に表示される
- [ ] レスポンシブデザインが機能している（モバイル、タブレット、デスクトップ）
- [ ] 既存の機能が正常に動作する
- [ ] API呼び出しが正常に動作する
- [ ] エラーハンドリングが機能している
- [ ] ローディング状態が適切に表示される
- [ ] アクセシビリティが維持されている
- [ ] パフォーマンスに問題がない
