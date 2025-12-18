# Node.js インストールガイド

## 問題

ChocolateyでNode.jsのインストールが失敗しました。権限エラーが発生しています。

## 解決方法

### 方法1: Node.js公式サイトから直接インストール（推奨・簡単）

1. **Node.js公式サイトにアクセス**
   - https://nodejs.org/
   - **LTS版（推奨）** をダウンロード
   - Windows Installer (.msi) を選択

2. **インストーラーを実行**
   - ダウンロードした `.msi` ファイルを実行
   - インストールウィザードに従ってインストール
   - 「Add to PATH」オプションが選択されていることを確認

3. **PowerShellを再起動**
   - 現在のPowerShellを閉じる
   - 新しいPowerShellを開く

4. **インストール確認**
   ```powershell
   node -v
   npm -v
   ```

5. **package-lock.jsonを生成**
   ```powershell
   cd "C:\Users\YCP\Downloads\IELTS Training"
   npm install
   ```

### 方法2: Chocolateyで管理者権限で再インストール

1. **PowerShellを管理者権限で開く**
   - Windowsキーを押す
   - 「PowerShell」と入力
   - 「Windows PowerShell」を右クリック
   - 「管理者として実行」を選択

2. **ロックファイルを削除（必要に応じて）**
   ```powershell
   Remove-Item "C:\ProgramData\chocolatey\lib\80b5db4ae59a27a4e5a98bc869b3316f892f2838" -Force -ErrorAction SilentlyContinue
   ```

3. **Node.jsを再インストール**
   ```powershell
   choco install nodejs -y
   ```

4. **PowerShellを再起動**

5. **インストール確認**
   ```powershell
   node -v
   npm -v
   ```

## 次のステップ（Node.jsインストール後）

### 1. package-lock.jsonを生成

```powershell
cd "C:\Users\YCP\Downloads\IELTS Training"
npm install
```

### 2. ビルド確認

```powershell
npm run build
```

### 3. Gitでコミット・プッシュ

```powershell
git status
git add package-lock.json
git commit -m "Add package-lock.json for Render npm ci"
git push
```

### 4. Renderで再デプロイ

1. Render ダッシュボードにアクセス
2. Web Service を選択
3. **Manual Deploy** → **Deploy latest commit**

## トラブルシューティング

### nodeコマンドが見つからない

- PowerShellを再起動
- 環境変数PATHにNode.jsが追加されているか確認
- Node.jsのインストールが完了しているか確認

### npm installが失敗する

- インターネット接続を確認
- ファイアウォール/プロキシの設定を確認
- `npm cache clean --force` を実行してから再試行

## 推奨

**方法1（公式サイトから直接インストール）** を推奨します。最も確実で簡単です。

