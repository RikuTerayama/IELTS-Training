# Render ビルド失敗の原因と修正（app/api/menu/today/route.ts）

## (a) 原因の一文説明

**`outputModules` 配列の第1要素（Speaking）の `cta` オブジェクトおよび配列要素を閉じる `},` と `},` が、`href: "/training/speaking",` の直後に存在せず、パーサがオブジェクトリテラル内にあると解釈したまま `const outputModules` に到達したため、「Unexpected token outputModules」の構文エラーになっている。**

つまり、**括弧の閉じ忘れ**（`cta` を閉じる `},` と、配列要素を閉じる `},` の2行が欠けている）が原因。

---

## (b) 修正パッチ（閉じが欠けている版向け）

**欠けている場合**は、`href: "/training/speaking",` の**直後**に次の2行を挿入する。

```diff
         cta: {
           label: "選ぶ",
           href: "/training/speaking",
+        },
+      },
         // スタブデータ: Outputセクション（最小3件）
         const outputModules: TodayMenu['output'] = [
```

※ 現在のリポジトリの `app/api/menu/today/route.ts` は**既に正しく閉じられている**ため、上記2行は既に存在する。Render に古い版がデプロイされている場合は、この修正が入ったコミットをデプロイすればコンパイルは通る。

---

## (c) ビルド・型チェックの確認結果

- **`npx tsc --noEmit`**: 終了コード 0（型エラーなし）
- **`npm run build`**: 「✓ Compiled successfully」まで到達（構文エラーなし）。静的生成フェーズでは環境変数未設定等でエラーが出るが、**コンパイル失敗**ではない

Render で「Failed to compile」を解消するには、上記の括弧が正しく閉じられている `route.ts` がデプロイされていることを確認すること。
