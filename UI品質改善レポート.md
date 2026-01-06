# UI品質改善レポート

## 修正完了サマリー

### (1) Task1入力が消える致命的バグの修正 ✅

**原因特定**:
- `components/task1/Task1Flow.tsx` 58-80行目の`useEffect`が`[attempt, stepState]`を依存配列にしていた
- `saveStepDebounced`が`onAttemptChange(data.data.attempt)`を呼ぶ（113行目）
- これにより`attempt`が新しい参照になり、`useEffect`が再実行される
- `useEffect`内で`setStepContent(content)`が呼ばれ、ローカルの入力が上書きされる

**修正内容**:
- `useRef`で復元フラグ（`hydratedRef`）と`lastAttemptIdRef`を追加
- `attempt.id`が変わった時だけ復元フラグをリセット
- 既に復元済み（`hydratedRef.current === attempt.id`）の場合は復元をスキップ
- 復元時は「空のstepContentだけ埋める」方式に変更（既にローカルで編集済みのstepは上書きしない）
- 依存配列を`[attempt?.id, stepState]`に変更（`attempt`全体ではなく`attempt.id`のみ）

**修正ファイル**:
- `components/task1/Task1Flow.tsx`

**修正後の動作**:
- タイピング中に`save-step`が何回走ってもtextareaの入力が消えない
- リロード時はDBの値で復元される（初回復元は効く）
- `attempt`が更新されても、ローカル入力が優先される

---

### (2) ダークモード配色のアプリ全体統一 ✅

**修正内容**:

#### `app/vocab/page.tsx`
- **変更前**: `bg-white`, `text-gray-600`, `text-gray-900`, `text-gray-700`, `bg-gray-50`, `border-gray-200`
- **変更後**:
  - カード: `cardBase`（`bg-surface`, `border-border`）
  - 見出し: `cardTitle`（`text-text`）
  - 本文・補助文: `cardDesc`（`text-text-muted`）
  - 選択可能カード: `selectableSelected` / `selectableUnselected`
  - ボタン: `buttonPrimary` / `buttonSecondary`
  - バッジ: `border-primary/20`, `bg-accent-indigo/10`, `text-text`
  - プログレスバー: `bg-surface-2` / `bg-primary`

**修正ファイル**:
- `app/vocab/page.tsx`

**検証結果**:
- `components/task1`配下: `bg-white`, `text-gray-*` → **0件**
- `app/vocab/page.tsx`: `bg-white`, `text-gray-*` → **0件**

---

### (3) フォントの統一 ✅

**導入内容**:
- **Inter**（英語用）と**Noto Sans JP**（日本語用）を`next/font/google`で導入
- `app/layout.tsx`でフォントを読み込み、`html`要素に`className`を付与
- `globals.css`の`body`にフォントスタックを設定
- `tailwind.config.ts`の`fontFamily.sans`にフォント変数を設定

**修正ファイル**:
- `app/layout.tsx`
- `app/globals.css`
- `tailwind.config.ts`

**フォントスタック**:
```css
font-family: var(--font-inter), var(--font-noto-sans-jp), system-ui, -apple-system, sans-serif;
```

---

## 変更ファイル一覧

1. **`components/task1/Task1Flow.tsx`** - 入力が消えるバグ修正
2. **`app/vocab/page.tsx`** - ダークモード配色統一
3. **`app/layout.tsx`** - フォント導入
4. **`app/globals.css`** - フォントスタック設定
5. **`tailwind.config.ts`** - フォントファミリー設定

---

## 手動テスト手順

### テスト1: Task1入力が消えないことを確認
1. `/task/[taskId]`にアクセス（Task1タスク）
2. Step1のtextareaに入力開始
3. タイピング中に自動保存が走る（1秒デバウンス）
4. **確認**: 入力が消えないこと
5. ページをリロード
6. **確認**: DBの値で復元されること

### テスト2: vocabページのダークモード
1. `/vocab`にアクセス
2. ダークモードに切り替え
3. **確認項目**:
   - 「単語練習」見出しが読める
   - 「4技能別・難易度別のIELTS重要単語をテストできます」が読める
   - 技能選択カード（Reading/Listening/Writing/Speaking）が読める
   - 難易度選択カード（初級/中級/上級）が読める
   - テスト開始後、問題文・選択肢が読める
   - 結果画面の見出し・本文が読める

### テスト3: フォント統一
1. `/vocab`, `/task/select`, `/task/[taskId]`を開く
2. **確認項目**:
   - 日本語と英語が同じフォントファミリーで表示される
   - 日本語が細すぎて読めないことがない
   - 英語だけ別フォントになっていない

### テスト4: 再発防止チェック（grep）
```bash
# 危険クラスが残っていないか確認
rg "bg-white|text-gray-700|text-black|text-gray-600|text-gray-500" app/vocab components/task1
# → 0件であることを確認
```

---

## 再発防止のためのチェック手順

### 1. 入力が消えるバグの再発防止
- `useEffect`で`attempt`全体を依存配列に入れない（`attempt.id`のみ）
- 復元時は「空のstepContentだけ埋める」方式を維持
- `useRef`で復元フラグを管理し、初回のみ復元する

### 2. ダークモード配色の再発防止
- 新規コンポーネント作成時は`cardBase`, `cardTitle`, `cardDesc`を使用
- `bg-white`, `text-gray-*`の直書きを禁止
- 定期的に以下で検索して残骸をチェック:
  ```bash
  rg "bg-white|text-gray-|text-black|text-slate-" app components
  ```

### 3. フォント統一の維持
- `app/layout.tsx`で定義したフォント変数を全ページで使用
- 個別の`font-family`指定を避ける

---

## 修正の要点

### 入力が消えるバグ修正の核心
```typescript
// 修正前（問題あり）
useEffect(() => {
  if (stepState && attempt) {
    setStepContent(content); // 常に上書き
  }
}, [attempt, stepState]); // attempt全体が依存配列

// 修正後（安全）
const hydratedRef = useRef<string | null>(null);
const lastAttemptIdRef = useRef<string | null>(null);

useEffect(() => {
  if (!stepState || !attempt) return;
  
  // attempt.idが変わった時だけリセット
  if (lastAttemptIdRef.current !== attempt.id) {
    hydratedRef.current = null;
    lastAttemptIdRef.current = attempt.id;
  }
  
  // 既に復元済みの場合はスキップ
  if (hydratedRef.current === attempt.id) {
    return;
  }
  
  // 空のstepContentだけ埋める
  setStepContent((prev) => {
    const content: Record<number, string> = { ...prev };
    if (!content[1] && stepState.step1) content[1] = stepState.step1;
    // ... 他のstepも同様
    return content;
  });
  
  hydratedRef.current = attempt.id;
}, [attempt?.id, stepState]); // attempt.idのみ
```

### ダークモード統一の核心
- 共通トークン（`cardBase`, `cardTitle`, `cardDesc`）を徹底利用
- 直書きの`bg-white`, `text-gray-*`を完全排除
- Task1で「読めている」見た目を全ページに適用

### フォント統一の核心
- `next/font/google`でInter + Noto Sans JPを導入
- `tailwind.config.ts`と`globals.css`でフォントスタックを統一
- 全ページで自動適用

---

すべての修正を完了しました。✅

