# Render ビルドエラー修正手順

## 問題

Renderのビルドが `npm ci && npm run build` で失敗している。
原因: `package-lock.json` が存在しない。

## 解決手順

### ステップ1: Node.jsのインストール確認

PowerShellで以下を実行：

```powershell
node -v
npm -v
```

**Node.jsがインストールされていない場合:**
1. [Node.js公式サイト](https://nodejs.org/) から LTS版（推奨）をダウンロード
2. インストーラーを実行
3. PowerShellを再起動
4. 再度 `node -v` と `npm -v` で確認

### ステップ2: package-lock.jsonの生成

プロジェクトディレクトリで以下を実行：

```powershell
cd "C:\Users\YCP\Downloads\IELTS Training"
npm install
```

これで `package-lock.json` が生成されます。

### ステップ3: ビルド確認（ローカル）

```powershell
npm run build
```

**エラーが出た場合:**
- `package.json` の `scripts.build` が `"next build"` になっているか確認
- 依存関係が正しくインストールされているか確認

### ステップ4: Gitでコミット・プッシュ

```powershell
# Gitの状態確認
git status

# package-lock.jsonを追加
git add package-lock.json

# コミット
git commit -m "Add package-lock.json for Render npm ci"

# プッシュ
git push
```

### ステップ5: Renderで再デプロイ

1. [Render Dashboard](https://dashboard.render.com/) にログイン
2. デプロイしている **Web Service** を選択
3. **Manual Deploy** → **Deploy latest commit** をクリック
4. ビルドログを確認

**ビルドが成功することを確認:**
- `npm ci` が成功する
- `npm run build` が成功する

## トラブルシューティング

### package-lock.jsonが生成されない

- Node.jsが正しくインストールされているか確認
- `npm install` の実行ログを確認
- `package.json` が正しいか確認

### npm ciが失敗する

- `package-lock.json` がリポジトリにコミットされているか確認
- Renderの **Root Directory** が正しいか確認（通常は `/` または空欄）
- ビルドログでエラーメッセージを確認

### npm run buildが失敗する

- `package.json` の `scripts.build` が `"next build"` になっているか確認
- 環境変数が正しく設定されているか確認（`RENDER_ENV_VARIABLES.md` 参照）

## 確認事項

- [ ] Node.jsがインストールされている
- [ ] `npm install` が成功した
- [ ] `package-lock.json` が生成された
- [ ] `npm run build` がローカルで成功した
- [ ] `package-lock.json` がGitにコミットされた
- [ ] Renderで再デプロイが成功した

## 参考

- `RENDER_ENV_VARIABLES.md` - Render環境変数の設定
- `README.md` - プロジェクトの概要

