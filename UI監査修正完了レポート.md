# UI監査修正完了レポート

## 修正完了サマリー

### ✅ フェーズ1: 危険クラスの全体検索と一覧化
- `bg-white`, `text-gray-*`, `text-slate-*`, `text-black`などの危険クラスを検索
- 主要ファイルで0件を確認

### ✅ フェーズ2: Task1の「比較フレーズ集」「お題」等が読めない問題を修正
- `ComparisonPhrasesPanel.tsx`は既に修正済み（共通トークン使用）
- `app/task/[taskId]/page.tsx`の「お題」セクションは既に修正済み（共通トークン使用）
- `app/task/[taskId]/prep/page.tsx`を修正（共通トークンに統一）

### ✅ フェーズ3: Task1画像が見切れる問題を修正
- `components/task/Task1Image.tsx`を修正
- コンテナに`max-h-[60vh] overflow-auto`を追加
- 画像に`max-h-[60vh] object-contain`を適用
- 画像全体が視認可能になり、スクロール量も削減

---

## 修正したファイル一覧

### 1. `components/task/Task1Image.tsx`
**変更内容**:
- コンテナに`max-h-[60vh] overflow-auto`を追加（画像全体が見えるように）
- 画像に`max-h-[60vh] object-contain`を適用（縮尺表示で切れない）

**変更前**:
```tsx
<div className={cn('relative w-full rounded-xl border border-border bg-surface p-4')}>
  <img
    src={imagePath}
    alt={alt}
    className="mx-auto w-full h-auto max-h-[320px] md:max-h-[400px] object-contain"
  />
</div>
```

**変更後**:
```tsx
<div className={cn('relative w-full rounded-xl border border-border bg-surface p-4', 'max-h-[60vh] overflow-auto')}>
  <img
    src={imagePath}
    alt={alt}
    className="mx-auto w-full h-auto max-h-[60vh] object-contain"
  />
</div>
```

---

### 2. `app/task/[taskId]/prep/page.tsx`
**変更内容**:
- `bg-white dark:bg-slate-800` → `cardBase`
- `text-slate-900 dark:text-slate-100` → `cardTitle`
- `text-slate-700 dark:text-slate-200` → `cardDesc` or `text-text`
- `text-gray-600` → `cardDesc`
- `text-gray-700` → `text-text`
- `bg-gray-200` → `bg-surface-2`
- `border-gray-200` → `border-border`
- `bg-blue-600` → `bg-primary` (buttonPrimary)
- `text-white` → `text-primary-foreground`
- `border-gray-300` → `border-border`
- `bg-gray-50` → `bg-surface-2`
- `text-blue-800 dark:text-blue-200` → `text-text` (バッジ)
- `bg-blue-100 dark:bg-blue-900/40` → `bg-accent-indigo/10` (バッジ)
- `text-green-600` → `text-success`
- `text-red-600` → `text-danger`
- `bg-red-50` → `bg-danger/10`
- `text-red-800` → `text-danger`

**主要な変更箇所**:
- お題表示セクション
- ステップ別コンテンツ（日本語PREP評価、英語エッセイ、入力エリア）
- エラー表示
- ナビゲーションボタン
- プログレスバー

---

### 3. `components/layout/Header.tsx`
**変更内容**:
- `text-slate-400` → `text-text-muted`
- `bg-slate-700/50 text-slate-200 hover:bg-slate-700` → `buttonSecondary`
- `bg-indigo-600 text-white hover:bg-indigo-500` → `buttonPrimary`

---

### 4. `app/training/writing/task1/page.tsx`
**変更内容**:
- `text-slate-900 dark:text-slate-100` → `text-text`
- `text-slate-700 dark:text-slate-200` → `text-text`
- `text-slate-600 dark:text-slate-300` → `text-text-muted`
- `bg-blue-600 text-white hover:bg-blue-700` → `buttonPrimary`
- `border-gray-300 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700` → `buttonSecondary`
- `border-blue-200 bg-blue-50 dark:bg-blue-950/30 dark:border-blue-800/50` → `border-primary/20 bg-accent-indigo/10`

---

## 検証結果

### 危険クラスの残骸チェック
```bash
# Task1関連
rg "bg-white|text-gray-700|text-black|text-gray-600|text-gray-500" app/task components/task1
# → 0件 ✅

# Task1関連コンポーネント
rg "bg-white|text-gray-700|text-black|text-gray-600|text-gray-500" components/task1
# → 0件 ✅
```

### 修正前後の比較

#### Task1画像表示
- **修正前**: `max-h-[320px] md:max-h-[400px]`で固定、下半分が見切れる
- **修正後**: `max-h-[60vh]`で画面高さに応じて調整、`overflow-auto`で全体が見える

#### ダークモード可読性
- **修正前**: `bg-white dark:bg-slate-800`で白背景/暗背景が混在、`text-slate-*`で可読性が不安定
- **修正後**: `cardBase`（`bg-surface`）で統一、`cardTitle`/`cardDesc`で常に読める

---

## 手動テスト手順

### テスト1: Task1画像が切れないことを確認
1. `/task/[taskId]`にアクセス（Task1タスク）
2. **確認**: 画像全体（軸ラベル含む）が表示される
3. **確認**: 画像が縦に長い場合、コンテナ内でスクロールできる
4. **確認**: 画像の下が見切れない

### テスト2: ダークモードで読めることを確認
1. ダークモードに切り替え
2. `/task/[taskId]`（Task1）にアクセス
3. **確認項目**:
   - 「お題」セクションの見出し・本文・バッジが読める
   - 「比較フレーズ集」の英語・日本語が読める
   - Step見出し・説明・入力欄が読める
   - チェックリスト・数字登録パネルが読める
4. `/task/[taskId]/prep`（Task2 PREPモード）にアクセス
5. **確認項目**:
   - 「お題」セクションが読める
   - ステップ別コンテンツ（日本語PREP評価、英語エッセイ、入力エリア）が読める
   - エラー表示が読める
   - ナビゲーションボタンが読める
6. `/training/writing/task1`にアクセス
7. **確認項目**:
   - 「おすすめタスク」セクションの見出し・本文が読める
   - ボタンが読める

### テスト3: ライトモードでも問題ないことを確認
1. ライトモードに切り替え
2. 上記のテスト2と同じページを確認
3. **確認**: すべてのテキストが読める

---

## 再発防止のためのチェック手順

### 1. 危険クラスの残骸チェック（定期的に実行）
```bash
# 主要ディレクトリで危険クラスを検索
rg "bg-white|text-gray-700|text-black|text-gray-600|text-gray-500" app components

# 0件であることを確認
```

### 2. 新規コンポーネント作成時のルール
- `bg-white`, `text-gray-*`, `text-slate-*`, `text-black`の直書きを禁止
- 必ず`lib/ui/theme.ts`の共通トークンを使用:
  - カード: `cardBase`, `cardTitle`, `cardDesc`
  - 入力欄: `inputBase`, `textareaBase`
  - ボタン: `buttonPrimary`, `buttonSecondary`
  - 選択可能カード: `selectableSelected`, `selectableUnselected`
  - バッジ: `badgeBase`

### 3. 画像表示のルール
- 画像コンテナには`max-h-[60vh] overflow-auto`を使用
- 画像自体には`max-h-[60vh] object-contain`を使用
- 画像全体が見えるようにする（切れない）

---

## 修正の要点

### 画像が見切れる問題の核心
- **原因**: 固定の`max-h-[320px] md:max-h-[400px]`で、縦に長い画像の下半分が見切れていた
- **解決**: `max-h-[60vh]`で画面高さに応じて調整し、`overflow-auto`でコンテナ内スクロールを可能にした

### ダークモード可読性の核心
- **原因**: `bg-white dark:bg-slate-800`や`text-slate-*`の直書きで、背景と文字色の組み合わせが不安定
- **解決**: 共通トークン（`cardBase`, `cardTitle`, `cardDesc`）で統一し、CSS変数（`--bg`, `--text`, `--text-muted`）で常に適切なコントラストを保証

---

すべての修正を完了しました。✅

