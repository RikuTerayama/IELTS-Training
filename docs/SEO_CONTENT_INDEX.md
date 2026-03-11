# SEO 記事・コンテンツページ インデックス

公開中の SEO 目的の記事型ページのルートとソースを整理した一覧です。

---

## 1. Speaking トピック記事

| 項目 | 内容 |
|------|------|
| **Source** | `app/speaking/topics/[slug]/page.tsx`, `app/speaking/topics/[slug]/layout.tsx` |
| **Route pattern** | `/speaking/topics/[slug]` |
| **ビルド** | SSG（`generateStaticParams` で slug を事前生成） |
| **確認方法** | 開発: `http://localhost:3000/speaking/topics/work-study` など。本番: `https://<origin>/speaking/topics/<slug>` |

**公開 URL 例（slug 一覧）**

- `/speaking/topics/work-study` — Work & Study
- `/speaking/topics/hometown` — Hometown
- `/speaking/topics/free-time` — Free Time
- `/speaking/topics/travel` — Travel
- `/speaking/topics/technology` — Technology

slug の定義は `app/speaking/topics/[slug]/page.tsx` 先頭の `speakingTopics` 配列を参照してください。

---

## 2. Writing Task 2 トピック記事

| 項目 | 内容 |
|------|------|
| **Source** | `app/writing/task2/topics/[slug]/page.tsx`, `app/writing/task2/topics/[slug]/layout.tsx` |
| **Route pattern** | `/writing/task2/topics/[slug]` |
| **ビルド** | SSG（`generateStaticParams` で slug を事前生成） |
| **確認方法** | 開発: `http://localhost:3000/writing/task2/topics/education` など。本番: `https://<origin>/writing/task2/topics/<slug>` |

**公開 URL 例（slug 一部）**

- `/writing/task2/topics/education`
- `/writing/task2/topics/technology`
- `/writing/task2/topics/environment`
- `/writing/task2/topics/health`
- … 他 47 件以上

全 slug は `app/writing/task2/topics/[slug]/page.tsx` 先頭の `task2Topics` 配列を参照してください。

---

## 3. 親ページ（記事一覧・入口）

| ページ | Route | Source |
|--------|--------|--------|
| Speaking トップ | `/speaking` | `app/speaking/page.tsx` |
| Writing トップ | `/writing` | `app/writing/page.tsx` |

トピック一覧やリンクは各トップページから遷移できます。

---

## 4. 運用メモ

- **slug の追加・変更**: 上記 `page.tsx` / `layout.tsx` 内の `speakingTopics` または `task2Topics` を編集し、`generateStaticParams` がその配列を参照しているため再ビルドで反映されます。
- **canonical**: 各 `layout.tsx` で `canonical` を設定しているため、SEO 用 URL は上記ルートパターンと一致します。
- **404**: 未定義の slug でアクセスした場合は `notFound()` により 404 になります。
