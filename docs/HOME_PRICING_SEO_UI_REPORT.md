# Home / Pricing / SEO導線 / ダークモード / 図形サイズ UI 整備 報告

## 1. Root cause 一覧

| 問題 | 原因 |
|------|------|
| Pro の価格欄に金額が出ていない | 価格表示用の API がなく、Pricing ページが「—」「Price set in Stripe」の固定表示のみだった。Stripe の Price ID は checkout 用に env で設定されていたが、**表示用に Stripe から amount を取得する処理が存在しなかった**。 |
| ダークモードで Pro セクションが白背景で文字が読みにくい | ランディングの Pro カードが `bg-gradient-to-br from-indigo-50 to-blue-50` と `text-indigo-700` のみで、**ダークモード用のクラスがなく**、テーマ切り替え時も同じ色のままだった。 |
| 問題提起セクションと特徴セクションの図形サイズが揃っていない | 問題セクションは `p-8`・アイコン `w-12 h-12` のみで min-height なし。特徴セクションは `min-h-[220px]`・`rounded-3xl` で**高さ・角丸・余白がばらばら**だった。 |
| SEO 記事がホームから十分に繋がっていない | ランディングに **Speaking / Writing ハブやトピック記事への内部リンクがなかった**。フッターにも記事入口がなかった。 |
| どこから SEO 記事を見られるか分かりにくい | 上記に加え、**docs にも「UI 上の入口」の記載がなかった**。 |

---

## 2. 変更ファイル一覧

| ファイル | 変更内容 |
|----------|----------|
| `app/api/billing/prices/route.ts` | **新規**。GET で Stripe から Pro 月額・年額の表示用価格を取得し `{ monthly, annual }` を返す API。 |
| `app/pricing/page.tsx` | 価格表示（`/api/billing/prices` 取得・表示）、fallback 文言、ダークモード対応（Pro 有効カード・未ログイン・FAQ リンク）、日本語文言（料金・FAQ・CTA）。 |
| `app/page.tsx` | ダークモード対応（PRO セクション・Free カード・問題/特徴アイコン）、図形サイズ統一（min-h-[260px]、rounded-2xl、shrink-0）、SEO 導線セクション「学習リソース・記事」追加、フッターに Speaking/Writing 記事リンク・日本語表記、フォーム・料金・CTA の日本語化。 |
| `docs/SEO_CONTENT_INDEX.md` | 「4. ホーム・ランディングからの導線（どこから見られるか）」を追加。運用メモを 5 に繰り下げ。 |
| `docs/billing_and_limits.md` | 「Prices API: GET /api/billing/prices」と env 依存（Stripe Price ID）の説明を追加。 |

---

## 3. SEO 導線の変更内容

- **ランディング**（`app/page.tsx`）  
  - **「学習リソース・記事」セクション**を追加（Features と Pricing の間）。  
  - リンク: Speaking ハブ (`/speaking`)、Writing ハブ (`/writing`)、Work & Study (`/speaking/topics/work-study`)、Education (`/writing/task2/topics/education`)。  
- **フッター**（同ファイル）  
  - 「サービス」列に **Speaking 記事** (`/speaking`)、**Writing 記事** (`/writing`) を追加。  
- **docs**  
  - `docs/SEO_CONTENT_INDEX.md` に「どこから見られるか」を表で整理し、ランディング・フッターのソース位置を記載。  

`docs/SEO_CONTENT_INDEX.md` の既存ルート（親ページ・トピック記事）との整合は取った。

---

## 4. Pricing 表示修正内容

- **原因**: フロントで「—」「Price set in Stripe」の固定表示のみで、Stripe から金額を取得していなかった。  
- **対応**:  
  - **GET /api/billing/prices** を新設。  
    - `STRIPE_PRICE_ID_PRO_MONTHLY` / `STRIPE_PRICE_ID_PRO_ANNUAL`（または `STRIPE_PRICE_ID_PRO`）で Stripe の Price を取得し、`unit_amount` と `currency` から表示用の `formatted`（例: 円は `¥1,234`）を生成。  
    - env 未設定や Stripe 取得失敗時は該当 interval を `null` で返す。  
  - **Pricing ページ**でマウント時に `/api/billing/prices` を fetch。  
    - 取得できた場合は「Pro 月額」「Pro 年額」に `formatted` を表示し、単位として「/ 月」「/ 年」を表示。  
    - 取得できない場合は従来どおり「—」と「価格はStripeで設定されています」を表示（自然な fallback）。  
- **env 依存**: checkout と同じ `STRIPE_PRICE_ID_PRO_MONTHLY` / `STRIPE_PRICE_ID_PRO_ANNUAL`（および `STRIPE_SECRET_KEY`）。`docs/billing_and_limits.md` に Prices API と env の説明を追記。

---

## 5. ダークモード / 図形サイズ修正内容

### ダークモード

- **ランディング Pro カード**  
  - 背景: `dark:from-indigo-950/70 dark:to-blue-950/60`、枠: `dark:border-indigo-600`。  
  - PRO バッジ: `dark:bg-indigo-500/25 dark:text-indigo-300`。  
  - 本文・リスト: `text-text` のまま。チェックアイコン: `dark:text-indigo-400`。  
  - 「Request Pro」リンク: `dark:text-indigo-400 dark:hover:text-indigo-300`。  
- **ランディング Free カード**  
  - 無料バッジ: `dark:bg-slate-700/50 dark:text-slate-300`。チェック: `dark:text-indigo-400`。  
- **問題提起・特徴セクションのアイコン**  
  - 各色で `dark:bg-*-900/30 dark:text-*-400` を付与し、ダーク時も視認可能に。  
- **Pricing ページ**  
  - Pro 有効ブロック: `dark:border-green-700 dark:bg-green-900/30`、テキスト `dark:text-green-100` 等。  
  - 未ログイン案内・FAQ 内リンク: `dark:` 付きでコントラスト確保。  

### 図形・カードサイズ統一

- **問題提起**（「フィードバックの欠如」「成長の停滞」「非効率な学習戦略」）  
  - カード: `min-h-[260px] flex flex-col`、`p-8`、アイコンは `w-12 h-12 shrink-0`・`rounded-xl`・`mb-6`。  
  - 説明文: `text-sm` で統一。  
- **特徴**（「AI 即時フィードバック」「スマート語彙」「進捗の可視化」「レベル別カリキュラム」）  
  - カード: `min-h-[260px]` に変更、`rounded-2xl` に統一（従来 `rounded-3xl`）、`p-8`、アイコンは同様に `w-12 h-12 shrink-0`・`mb-6`。  
- 両セクションとも **260px 最小高さ** で揃え、モバイルでも崩れないよう `flex flex-col` と `shrink-0` でレイアウトを固定。  

---

## 6. Build / Lint / TSC 結果

- **`npm run build`**: 成功（Next.js 14.1.0）。  
- **`npm run lint`**: 成功。既存の react-hooks/exhaustive-deps 等の Warning のみ（今回の変更には新規の lint エラーなし）。  
- **`npx tsc --noEmit`**: 成功。  

---

## 7. 既知の制約

- **価格表示**: `STRIPE_SECRET_KEY` および Pro 用 Price ID が未設定の環境では、Pricing ページは「—」と「価格はStripeで設定されています」のまま。本番では env を設定すれば表示される。  
- **SEO 記事**: 今回追加した導線は「Speaking ハブ」「Writing ハブ」と代表トピック 2 件（work-study, education）のみ。他トピックは各ハブページから遷移。  
- **文言**: Pricing の FAQ は日本語に統一。Request Pro のリンク表記は「請求書払いなどは Request Pro へ」のまま（製品名として Request Pro を残している）。  
- **ブランチ**: 要件どおり commit / push は行っていない。開発ブランチは `origin/main` から新規作成する想定。  

---

以上で、Home / Pricing / SEO導線 / ダークモード / 図形サイズの UI 整備を一通り反映済みです。
