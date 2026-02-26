# Render ビルド失敗の原因と修正（app/api/menu/today/route.ts）

## (a) 原因の一文説明

**1つ目の `const outputModules` の配列で、先頭要素（Speaking）の `cta` オブジェクトが `href: "/training/speaking",` の直後で閉じられておらず、さらに同じファイル内に重複したコメントと2つ目の `const outputModules` 宣言があった。パーサは「まだオブジェクトリテラル内」と解釈したまま2つ目の `const` に到達し、プロパティ名や `}` を期待して「Unexpected token outputModules」となった。**

つまり、**括弧の閉じ忘れ**（`cta` と配列要素を閉じる `},` と `},` の欠如）**と重複宣言**（2つ目の `const outputModules` とその配列ブロック）の両方が原因。

---

## (b) 適用した修正パッチ（route.ts）

- 1つ目の speaking 要素を `},` `},` で閉じた。
- 重複していた「スタブデータ」コメントと2つ目の `const outputModules` およびその配列（writing_task1, writing_task2, speaking の3件）を削除し、代わりに writing_task2 の1件だけを同じ配列内の2要素目として追加して配列を `];` で閉じた。

---

## (c) ビルド・型チェックの確認結果

- **`npx tsc --noEmit`**: 終了コード 0（型エラーなし）
- **`npm run build`**: 「✓ Compiled successfully」まで到達（構文エラーなし）。静的生成フェーズでは環境変数未設定等でエラーが出るが、**コンパイル失敗**ではない

Render で「Failed to compile」を解消するには、上記の括弧が正しく閉じられている `route.ts` がデプロイされていることを確認すること。
