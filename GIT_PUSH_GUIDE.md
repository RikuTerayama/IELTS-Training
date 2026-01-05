# GitHubへのプッシュ手順

今回の変更（テーマカラー直書き色検出の実装）をGitHubにプッシュする手順です。

## 📋 現在の状態

- ✅ Gitリポジトリ: 正常に設定済み
- ✅ リモートリポジトリ: `git@github.com:RikuTerayama/IELTS-TRAINING.git`
- ✅ ブランチ: `main`
- ✅ SSH認証: 設定済み

## 📝 変更内容

以下のファイルが追加/変更されています：

- **変更**: `package.json`
- **新規**: `THEME_LINT_IMPLEMENTATION_SUMMARY.md`
- **新規**: `THEME_RULES.md`
- **新規**: `scripts/lint-theme-colors.mjs`

## 🚀 プッシュ手順

### オプション1: コマンドラインで実行（推奨）

```powershell
# 環境変数をリフレッシュ（必要に応じて）
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# 変更をステージング
git add package.json THEME_LINT_IMPLEMENTATION_SUMMARY.md THEME_RULES.md scripts/

# コミット（適切なメッセージを入力）
git commit -m "feat: テーマカラー直書き色検出機能の実装

- lint-theme-colors.mjsスクリプトを追加
- package.jsonにlint:themeコマンドを追加
- lintコマンドにlint:themeを統合
- THEME_RULES.mdドキュメントを追加
- 優先度B: 再発防止ルールの実装"

# プッシュ
git push origin main
```

### オプション2: CursorのGit統合機能を使用（最も簡単）

1. **ソース管理パネルを開く**
   - `Ctrl+Shift+G` を押す
   - または、サイドバーのソース管理アイコンをクリック

2. **変更をステージング**
   - 変更されたファイルの横の `+` ボタンをクリック
   - または「すべての変更をステージ」をクリック

3. **コミット**
   - コミットメッセージを入力（例：上記のメッセージ）
   - `Ctrl+Enter` でコミット

4. **プッシュ**
   - 「同期」ボタンまたは「プッシュ」ボタンをクリック

## ✅ 確認事項

プッシュ後、GitHubのリポジトリで以下を確認：

1. ファイルが追加/変更されているか
2. コミットメッセージが正しく表示されているか
3. `npm run lint:theme` が動作するか（CI/CDで実行する場合）

## 💡 コミットメッセージの例

```
feat: テーマカラー直書き色検出機能の実装

優先度B: 再発防止ルールとして、直書き色の混入を機械的に検知する仕組みを実装

- scripts/lint-theme-colors.mjs: 直書き色検出スクリプトを追加
- package.json: lint:themeコマンドを追加し、lintに統合
- THEME_RULES.md: テーマカラールールのドキュメントを追加
- THEME_LINT_IMPLEMENTATION_SUMMARY.md: 実装まとめを追加

検出対象:
- Tailwind arbitrary values (text-[#, bg-[#など)
- カラー関数 (rgb, rgba, hsl, hsla)
- inline style (style={{ color: ... }})
- hex直書き (#fffなど)

使用方法:
- npm run lint:theme で検出
- npm run lint で自動実行
```

