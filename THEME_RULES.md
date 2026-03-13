# テーマカラールール

このプロジェクトでは、ライト/ダークテーマに対応するため、**直書き色の使用を禁止**しています。すべての色はデザイントークン（CSS変数）を使用する必要があります。

---

## 📋 基本ルール

### 禁止事項

以下のような直書き色の使用は**禁止**です：

- Tailwind arbitrary values: `text-[#fff]`, `bg-[#000]`, `border-[#333]`
- カラー関数: `rgb(255, 0, 0)`, `rgba(0, 0, 0, 0.5)`, `hsl(0, 100%, 50%)`
- inline style: `style={{ color: '#ff0000' }}`
- hex直書き: `#fff`, `#000000`

### 推奨事項

代わりに、デザイントークンを使用してください：

- `bg-[#4f46e5]` ではなく `bg-primary`
- `text-gray-600` ではなく `text-text-muted`
- `border-gray-200` ではなく `border-border`

詳細は `app/globals.css` と `tailwind.config.ts` を参照してください。

---

## 🔍 検出コマンド

### 基本的な使い方

```bash
# 直書き色を検出
npm run lint:theme

# lintコマンドを実行（lint:themeも自動的に実行される）
npm run lint
```

### 成功時の出力

```
🔍 Checking for hardcoded colors...

Target directories: app, components

✅ No hardcoded colors found!
```

### 失敗時の出力

```
🔍 Checking for hardcoded colors...

Target directories: app, components

❌ Found 3 hardcoded color(s):

📄 app/example.tsx
  10:21 - Tailwind arbitrary color
    text-[# in: <div className="text-[#fff] bg-primary">Test</div>
  10:33 - Inline style color
    style={{ color: in: <p style={{ color: '#ff0000' }}>Test</p>
  12:5 - Hex color
    #fff in: const color = '#fff';

❌ Total: 3 issue(s)

💡 Tip: Use design tokens instead of hardcoded colors.
   Example: bg-primary instead of bg-[#4f46e5]
   See THEME_RULES.md for details.
```

---

## 🎯 検出対象パターン

### 1. Tailwind Arbitrary Values

以下のようなTailwindのarbitrary valuesが検出されます：

- `text-[#...]`
- `bg-[#...]`
- `border-[#...]`
- `from-[#...]`, `to-[#...]`, `via-[#...]`（gradient系）
- `ring-[#...]`, `outline-[#...]`, `shadow-[#...]`

**NG例:**
```tsx
<div className="text-[#fff] bg-[#000] border-[#333]">
```

**OK例:**
```tsx
<div className="text-text bg-bg border-border">
```

### 2. カラー関数

`rgb()`, `rgba()`, `hsl()`, `hsla()` が検出されます。

**NG例:**
```tsx
<div style={{ backgroundColor: 'rgb(255, 0, 0)' }}>
<div className="bg-[rgb(255,0,0)]">
```

**OK例:**
```tsx
// CSS変数参照は許可（app/globals.css内）
rgb(var(--primary))
```

### 3. Inline Style

`style={{` と `color:`, `background`, `borderColor` 等が同時に存在する場合、検出されます。

**NG例:**
```tsx
<p style={{ color: '#ff0000', background: '#00ff00' }}>Test</p>
```

**OK例:**
```tsx
// スタイルオブジェクトを使用（デザイントークン経由）
<p style={{ color: 'var(--text)' }}>Test</p>
// または、Tailwindクラスを使用
<p className="text-text">Test</p>
```

### 4. Hex直書き

`#` を含む色指定が検出されます。ただし、以下の場合は除外されます：

- URL内の `#`: `https://example.com/#anchor`
- Markdownリンク: `[text](#anchor)`
- HTMLコメント: `<!-- comment -->`
- JSXコメント: `{/* comment */}`

**NG例:**
```tsx
const color = '#fff';
<div className="bg-[#000]">
```

**OK例:**
```tsx
// URLやコメントは除外される
const url = 'https://example.com/#anchor';
{/* <!-- comment --> */}
```

---

## 🔧 検索対象ディレクトリ

以下のディレクトリが検索対象です：

- `app/`
- `components/`
- `styles/`（存在する場合）

以下のディレクトリ・ファイルは**除外**されます：

- `node_modules/`
- `.next/`
- `dist/`
- `out/`
- `.git/`
- `next-env.d.ts`

---

## ⚠️ 例外処理

### 例外ファイル

`app/globals.css` 内のCSS変数定義は例外として扱われます：

- `:root { ... }` 内の `rgb()` は許可
- `[data-theme="..."] { ... }` 内の `rgb()` は許可
- `rgb(var(--...))` は許可（CSS変数参照）

### 将来的な拡張

例外が必要な場合は、以下の方法で対応できます：

1. **scripts/lint-theme-colors.mjs** の `EXCEPTION_FILES` 配列に追加
2. または、`IGNORE_PATTERNS` にディレクトリ/ファイルを追加

```javascript
// scripts/lint-theme-colors.mjs
const EXCEPTION_FILES = [
  'app/globals.css', // CSS変数定義内のrgb()は許可
  // 'third-party/chart-library.ts', // 例外が必要な場合は追加
];
```

**注意**: 例外を追加する場合は、**必ず理由をコメントに記載**してください。

---

## 📝 NG例 / OK例

### テキスト色

**NG:**
```tsx
<p className="text-[#333]">Text</p>
<p style={{ color: '#333' }}>Text</p>
```

**OK:**
```tsx
<p className="text-text">Text</p>
<p className="text-text-muted">Text</p>
<p style={{ color: 'var(--text)' }}>Text</p>
```

### 背景色

**NG:**
```tsx
<div className="bg-[#fff]">Content</div>
<div style={{ backgroundColor: 'rgb(255, 255, 255)' }}>Content</div>
```

**OK:**
```tsx
<div className="bg-bg">Content</div>
<div className="bg-surface">Content</div>
<div style={{ backgroundColor: 'var(--bg)' }}>Content</div>
```

### ボーダー色

**NG:**
```tsx
<div className="border-[#ccc]">Content</div>
<div style={{ borderColor: '#ccc' }}>Content</div>
```

**OK:**
```tsx
<div className="border-border">Content</div>
<div style={{ borderColor: 'var(--border)' }}>Content</div>
```

### プライマリー色

**NG:**
```tsx
<button className="bg-[#4f46e5] text-[#fff]">Button</button>
```

**OK:**
```tsx
<button className="bg-primary text-primary-foreground">Button</button>
```

---

## 🚀 コマンド統合

### lintコマンド

`npm run lint` を実行すると、自動的に `lint:theme` も実行されます：

```bash
npm run lint
# → lint:theme を実行
# → next lint を実行
```

### CI/CD統合

GitHub ActionsなどのCI/CDで使用する場合：

```yaml
- name: Lint theme colors
  run: npm run lint:theme
```

### 事前コミットフック（オプション）

huskyなどを使用する場合：

```bash
# .husky/pre-commit
npm run lint:theme
```

---

## 📚 参考

### デザイントークンの定義

- **CSS変数**: `app/globals.css`
- **Tailwind設定**: `tailwind.config.ts`

### 利用可能なトークン

- **背景**: `bg-bg`, `bg-surface`, `bg-surface-2`
- **テキスト**: `text-text`, `text-text-muted`, `text-text-subtle`
- **ボーダー**: `border-border`, `border-border-strong`
- **プライマリー**: `bg-primary`, `text-primary`, `text-primary-foreground`
- **アクセント**: `bg-accent-indigo`, `bg-accent-violet`, `bg-accent-emerald`
- **状態**: `bg-danger`, `bg-success`, `bg-warning`

詳細は `app/globals.css` を参照してください。

---

## ❓ よくある質問

### Q: なぜ直書き色を禁止するのか？

A: ライト/ダークテーマに対応するため、すべての色をデザイントークン（CSS変数）経由で管理する必要があります。直書き色を使用すると、テーマ切替時に色が変わらないため、視認性の問題が発生します。

### Q: Tailwindの標準クラス（`text-gray-600`など）は使用できるか？

A: いいえ。Tailwindの標準クラスもテーマに対応していないため、使用できません。代わりに、デザイントークンを使用してください（例: `text-text-muted`）。

### Q: 例外が必要な場合はどうすればよいか？

A: `scripts/lint-theme-colors.mjs` の `EXCEPTION_FILES` または `IGNORE_PATTERNS` に追加してください。**必ず理由をコメントに記載**してください。

### Q: 検出が誤検知の場合、どうすればよいか？

A: スクリプトを修正するか、例外ファイルとして追加してください。GitHubのIssueやPRで報告してください。

---

## 🌓 テーマモード（3状態）とFOUC対策（優先度C）

### テーマモードの仕様

ユーザーが選べるモードは次の3種類です。

| モード | 値 | 説明 |
|--------|-----|------|
| システム設定 | `system` | OSの `prefers-color-scheme` に従う |
| ライト | `light` | 常にライトテーマ |
| ダーク | `dark` | 常にダークテーマ |

### 保存キー

- **localStorage キー**: `themeMode`
- **取りうる値**: `'system'` | `'light'` | `'dark'`
- コンポーネントでは `themeMode`（ユーザー選択）と `theme`（実際に適用中のテーマ）を区別して管理しています。

### resolvedTheme（適用テーマ）の決定順

実際に `<html>` に適用される `data-theme`（ここでは **resolvedTheme** = コンテキストの `theme`）は、次の順で決まります。

1. **localStorage の `themeMode`** を参照
2. `themeMode` が `'light'` または `'dark'` の場合 → その値を resolvedTheme とする
3. `themeMode` が `'system'` または未設定の場合 → **OS の `prefers-color-scheme`** で `'light'` または `'dark'` を決定
4. エラー時（例: localStorage が使えない）→ フォールバックで `'dark'`

System モード選択時は、OS のテーマ設定を変更すると `matchMedia('(prefers-color-scheme: dark)')` の変更イベントで自動追従します。

### FOUC対策（初回チラつき防止）

**目的**: 初回アクセスやリロード時に、ライト→ダーク（または逆）の一瞬のチラつきを防ぐ。

**手順**: クライアントJS（React）の hydration 前に、`<html>` に正しい `data-theme` を設定する。

**実装箇所**: `app/layout.tsx` の `<head>` 内インラインスクリプト

- `<html lang="ja" suppressHydrationWarning>` で hydration 時の警告を抑制
- 直下の `<script dangerouslySetInnerHTML={{ __html: '...' }} />` で、ページ読み込み直後に以下を実行：
  - `localStorage.getItem('themeMode')` を取得
  - `themeMode === 'light' | 'dark'` ならそれを適用、それ以外なら `prefers-color-scheme` で決定
  - `document.documentElement.setAttribute('data-theme', resolvedTheme)` で反映
  - `try/catch` で失敗時は `data-theme="dark"` にフォールバック（白画面を防ぐ）

これにより、CSS の `[data-theme="light"]` / `[data-theme="dark"]` が最初のペイントから正しく効き、チラつきが発生しません。ThemeProvider の初期化も同じキー・同じ決定順で行っているため、整合しています。

---

## 🔄 更新履歴

- 2025-01-05: 初版作成（優先度B: 再発防止ルール）
- 2025-02-26: 3状態テーマ（system/light/dark）・保存キー・resolvedTheme 決定順・FOUC対策を追記（優先度C）

