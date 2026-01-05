# テーマカラー直書き色検出の実装まとめ

優先度B「再発防止（運用ルール）」として、直書き色の混入を機械的に検知する仕組みを実装しました。

---

## 📋 実装内容

### 目的

- PRで直書き色が混入した瞬間に検知できる仕組みを作る
- チーム運用で“守れるルール”として定着させる（コマンド化＋ドキュメント化）
- 例外が必要な場合の扱いも明文化

---

## 📁 追加/変更したファイル一覧

### 新規作成

1. **`scripts/lint-theme-colors.mjs`**
   - 直書き色検出スクリプト（Node.js）
   - grepベースの軽量チェック
   - Mac/Linux/Windows対応

2. **`THEME_RULES.md`**
   - テーマカラールールのドキュメント
   - 検出対象パターン一覧
   - NG例/OK例
   - 例外処理の説明

3. **`THEME_LINT_IMPLEMENTATION_SUMMARY.md`**（このファイル）
   - 実装まとめ

### 変更

1. **`package.json`**
   - `lint:theme` コマンドを追加
   - `lint` コマンドに `lint:theme` を組み込み

---

## 🚀 lint:theme の実行例

### 成功時の出力

```bash
$ npm run lint:theme

> ielts-training@0.1.0 lint:theme
> node scripts/lint-theme-colors.mjs

🔍 Checking for hardcoded colors...

Target directories: app, components

✅ No hardcoded colors found!
```

### 失敗時の出力

```bash
$ npm run lint:theme

> ielts-training@0.1.0 lint:theme
> node scripts/lint-theme-colors.mjs

🔍 Checking for hardcoded colors...

Target directories: app, components

❌ Found 9 hardcoded color(s):

📄 app/example.tsx
  6:21 - Tailwind arbitrary color
    text-[# in: <div className="text-[#fff] bg-[#000] border-[#333]">
  6:33 - Tailwind arbitrary color
    bg-[# in: <div className="text-[#fff] bg-[#000] border-[#333]">
  6:43 - Tailwind arbitrary color
    border-[# in: <div className="text-[#fff] bg-[#000] border-[#333]">
  7:10 - Inline style color
    style={{ color: in: <p style={{ color: '#ff0000', background: '#00ff00' }}>Test</p>
  12:5 - Hex color
    #fff in: const color = '#fff';

❌ Total: 9 issue(s)

💡 Tip: Use design tokens instead of hardcoded colors.
   Example: bg-primary instead of bg-[#4f46e5]
   See THEME_RULES.md for details.
```

### lintコマンド統合

```bash
$ npm run lint

> ielts-training@0.1.0 lint
> npm run lint:theme && next lint

> ielts-training@0.1.0 lint:theme
> node scripts/lint-theme-colors.mjs

🔍 Checking for hardcoded colors...

Target directories: app, components

✅ No hardcoded colors found!

# その後、next lint が実行される
```

---

## 🔧 ignore/例外の仕組み

### 1. 例外ファイル

`app/globals.css` は例外として扱われます：

- `:root { ... }` 内の `rgb()` は許可
- `[data-theme="..."] { ... }` 内の `rgb()` は許可
- `rgb(var(--...))` は許可（CSS変数参照）

**設定場所**: `scripts/lint-theme-colors.mjs` の `EXCEPTION_FILES` 配列

```javascript
const EXCEPTION_FILES = [
  'app/globals.css', // CSS変数定義内のrgb()は許可
];
```

### 2. 除外パターン

以下のパターンは自動的に除外されます：

- **URL内の#**: `https://example.com/#anchor`
- **Markdownリンク**: `[text](#anchor)`
- **HTMLコメント**: `<!-- comment -->`
- **JSXコメント**: `{/* comment */}`

### 3. 除外ディレクトリ

以下のディレクトリ・ファイルは自動的に除外されます：

- `node_modules/`
- `.next/`
- `dist/`
- `out/`
- `.git/`
- `next-env.d.ts`

**設定場所**: `scripts/lint-theme-colors.mjs` の `IGNORE_PATTERNS` 配列

### 4. 例外を追加する場合

例外が必要な場合は、`scripts/lint-theme-colors.mjs` を編集：

```javascript
// 例外ファイルを追加
const EXCEPTION_FILES = [
  'app/globals.css', // CSS変数定義内のrgb()は許可
  'third-party/chart-library.ts', // 例外: サードパーティライブラリ
];

// または、除外ディレクトリを追加
const IGNORE_PATTERNS = [
  'node_modules',
  '.next',
  'third-party', // サードパーティライブラリを除外
];
```

**注意**: 例外を追加する場合は、**必ず理由をコメントに記載**してください。

---

## 📚 ドキュメント追記内容の要約

### THEME_RULES.md

以下の内容を記載：

1. **基本ルール**
   - 禁止事項（直書き色の使用）
   - 推奨事項（デザイントークンの使用）

2. **検出コマンド**
   - `npm run lint:theme` の使い方
   - 成功時/失敗時の出力例

3. **検出対象パターン**
   - Tailwind arbitrary values
   - カラー関数（rgb, rgba, hsl, hsla）
   - inline style
   - hex直書き

4. **NG例/OK例**
   - テキスト色、背景色、ボーダー色、プライマリー色の例

5. **例外処理**
   - 例外ファイルの説明
   - 将来的な拡張方法

6. **コマンド統合**
   - lintコマンドへの統合
   - CI/CD統合の例

7. **よくある質問（FAQ）**

---

## ✅ 動作確認結果

### 1. 現状コードで成功

```bash
$ npm run lint:theme
✅ No hardcoded colors found!
```

**結果**: ✅ 成功

### 2. 意図的に直書き色を入れて検知

テストファイル（`app/test-color-lint.tsx`）を作成し、以下のパターンを検証：

- `text-[#fff]`, `bg-[#000]`, `border-[#333]` → ✅ 検知
- `style={{ color: '#ff0000' }}` → ✅ 検知
- `#fff`, `#000` → ✅ 検知

**結果**: ✅ 9個の直書き色を検知（exit code 1）

### 3. 主要コマンドへの影響

```bash
$ npm run lint
✅ lint:theme が正常に実行
✅ next lint が正常に実行
```

**結果**: ✅ 影響なし

---

## 🎯 検出対象パターン（詳細）

### 1. Tailwind Arbitrary Values

- `text-[#...]`, `bg-[#...]`, `border-[#...]`
- `from-[#...]`, `to-[#...]`, `via-[#...]`（gradient系）
- `ring-[#...]`, `outline-[#...]`, `shadow-[#...]`

### 2. カラー関数

- `rgb(...)`, `rgba(...)`, `hsl(...)`, `hsla(...)`
- **除外**: `rgb(var(--...))` など、CSS変数参照は許可

### 3. Inline Style

- `style={{` と `color:`, `background`, `borderColor` 等が同時に存在

### 4. Hex直書き

- `#` を含む色指定
- **除外**: URL、Markdownリンク、コメント

---

## 📊 検索対象ディレクトリ

- `app/`
- `components/`
- `styles/`（存在する場合）

---

## 🔄 今後の拡張

### 現在の実装

- grepベースの軽量チェック
- Node.jsスクリプト（追加依存なし）
- Mac/Linux/Windows対応

### 将来的な拡張（オプション）

- ESLintプラグインとして実装
- より高度なパターンマッチング
- 自動修正機能

---

## 📝 まとめ

### 実装完了項目

- ✅ 直書き色検出スクリプトの作成
- ✅ package.jsonへのコマンド追加
- ✅ lintコマンドへの統合
- ✅ 動作確認（成功/失敗パターン）
- ✅ ドキュメント作成

### 成果物

- **スクリプト**: `scripts/lint-theme-colors.mjs`
- **ドキュメント**: `THEME_RULES.md`
- **コマンド**: `npm run lint:theme`
- **統合**: `npm run lint`（自動実行）

### 使用方法

```bash
# 直書き色を検出
npm run lint:theme

# lintコマンドを実行（lint:themeも自動実行）
npm run lint
```

---

## 🔗 関連ドキュメント

- **`THEME_RULES.md`**: 詳細なルールと使用方法
- **`app/globals.css`**: デザイントークンの定義
- **`tailwind.config.ts`**: Tailwind設定

---

**実装日**: 2025-01-05  
**優先度**: B（再発防止ルール）

