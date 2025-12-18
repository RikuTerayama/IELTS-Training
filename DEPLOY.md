# Renderデプロイ手順

## 前提条件

- Node.js と npm がインストールされていること
- ローカル環境で `npm install` を実行できること

## 1. package-lock.json の生成

ローカル環境で以下のコマンドを実行してください：

```bash
npm install
```

これにより `package-lock.json` が生成されます。

## 2. ビルド確認（オプション）

生成後、ローカルでビルドが通ることを確認：

```bash
npm run build
```

## 3. コミット・プッシュ

```bash
git add package-lock.json package.json
git commit -m "Add package-lock.json for Render deployment"
git push
```

## 4. Renderでの再デプロイ

Renderダッシュボードで「Manual Deploy」→「Deploy latest commit」を実行

または、自動デプロイが有効な場合は、push後に自動的に再デプロイが開始されます。

## Render設定

### Build Command
```
npm ci && npm run build
```

### Start Command
```
npm start
```

### Environment Variables
以下を設定してください：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `LLM_API_KEY`
- `LLM_MODEL` (オプション、デフォルト: gpt-4o-mini)
- `PORT` (Renderが自動設定、手動設定不要)

## 注意事項

- `package-lock.json` は必ずコミットしてください
- `.env.local` はコミットしないでください（.gitignoreに含まれています）
- 環境変数はRenderダッシュボードで設定してください

