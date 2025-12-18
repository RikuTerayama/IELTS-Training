# package-lock.json 生成手順

## 現状

- `package-lock.json` が存在しない
- ローカル環境に Node.js/npm がインストールされていない
- Render のビルドが `npm ci` で失敗している

## 解決方法

### 方法1: Node.jsをインストールしてnpm installを実行（推奨）

1. **Node.jsをインストール**
   - [Node.js公式サイト](https://nodejs.org/) から LTS版をダウンロード・インストール
   - インストール後、PowerShellを再起動

2. **package-lock.jsonを生成**
   ```powershell
   cd "C:\Users\YCP\Downloads\IELTS Training"
   npm install
   ```

3. **ビルド確認**
   ```powershell
   npm run build
   ```

4. **Gitでコミット・プッシュ**
   ```powershell
   git status
   git add package-lock.json
   git commit -m "Add package-lock.json for Render npm ci"
   git push
   ```

### 方法2: GitHub Actionsで生成（代替案）

GitHub Actionsを使用してpackage-lock.jsonを生成する場合：

1. `.github/workflows/generate-lockfile.yml` を作成
2. GitHub Actionsでnpm installを実行
3. 生成されたpackage-lock.jsonをコミット

### 方法3: Renderで直接生成（一時的な解決策）

Renderのビルドログで以下を実行：

1. Render ダッシュボードで **Shell** を開く
2. 以下を実行：
   ```bash
   npm install
   git add package-lock.json
   git commit -m "Add package-lock.json"
   git push
   ```

## 注意事項

- 手動で作成した `package-lock.json` は不完全です
- `npm install` を実行して正確な lockfile を生成してください
- `package-lock.json` は `.gitignore` に含めないでください

## 次のステップ

1. Node.jsをインストール
2. `npm install` を実行
3. `npm run build` でビルド確認
4. Gitでコミット・プッシュ
5. Renderで再デプロイ

