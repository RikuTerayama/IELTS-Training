# 現状分析レポート：LP整理・Testimonials削除・Contact・Header・不要ファイル

**作成目的**: G1〜G6 要件を満たすための現状把握・原因特定・安全に削除できる対象の特定・実装方針の選択肢整理。  
**制約**: コード変更は一切行わない（調査・文書化のみ）。

---

## 1. 重要結論サマリ

- **LP（/）** は **App Router** の `app/page.tsx` 単一ファイルで実装されている。ヘッダー・フッターは LP 専用のインライン実装で、`Layout`/`Header`/`Footer` コンポーネントは使用していない。
- **Testimonials（ユーザーの声）** は LP 内の 1 セクション（`id="testimonials"`）とフッターの「Testimonials」ボタン（`scrollToSection('testimonials')`）に存在。他ページからの導線は LP フッター経由のみ。完全削除時は当該セクション削除とフッター Product 内の Testimonials 項目削除が必要。
- **Contact** は LP 内のフォーム（送信時は `alert` のみ、送信先なし）。`lib/constants/contact.ts` に `CONTACT_GOOGLE_FORM_URL` 等が既に定義されているが、LP の Contact セクションでは未使用。Google Forms 埋め込みには `viewform?embedded=true` への変換が必要（同一パスでクエリを `embedded=true` に）。
- **ヘッダー** は **2 系統** ある。（1）LP（`app/page.tsx` 内インライン）: 現状「Blog」のみ。（2）認証後（`components/layout/Header.tsx`）: Home / Vocab（`/training/vocab?skill=speaking`）/ Blog。`NAV_INPUT`/`NAV_OUTPUT`/`NAV_BLOG` は定義されているが **描画では未使用**（従って Input/Output/Blog の構造化は未実装）。
- **同一フォーマット** の不揃いは、Features セクション内の「見出しレベル（h2 vs h3）」「説明文の class（`text-sm` vs 指定なし）」「カードの grid 占有（col-span-2 vs 1）」「max-w-md の有無」の差が原因。これらを揃える最小変更候補をセクション 7 に列挙。
- **CSP / frame-src** は `next.config.js` および `middleware` に未設定のため、**iframe による Google Forms 埋め込みは現状ブロックされない**（推測：デフォルトで許可される想定）。
- **不要ファイル** は、参照ゼロが明確なものとして **`app/vocab/page.tsx`**（middleware で `/vocab` が 308 リダイレクトされるため冗長）を「Safe to delete」候補として提示。migrations 外の単体 SQL ファイルは見つかっておらず、**既存マイグレーションの削除は対象外**。

---

## 2. 現状アーキテクチャ

### 2.1 ルーター方式（根拠）

- **App Router のみ**。根拠：`app/` 配下に `layout.tsx`・`page.tsx` が存在し、`pages/` ディレクトリは存在しない。
- 参照：`app/layout.tsx`（ルートレイアウト）、`app/page.tsx`（ルート `/`）、`app/home/page.tsx`（`/home`）等。

### 2.2 LP（/）の実体とセクション構成（上から順）

| 順序 | 見出し/目的 | 主要要素 | 実装箇所（ファイルパス） |
|------|-------------|----------|---------------------------|
| 1 | ヒーロー | キャッチコピー、サインアップ/ログインフォーム | `app/page.tsx` L273〜L375 |
| 2 | 課題解決 | 「なぜ独学でスコアアップが難しいか」3 カード（フィードバック欠如・成長停滞・非効率） | L381〜L464 |
| 3 | Features | 「Everything you need to succeed」+ サブコピー + 4 カード（AI Instant Feedback, Smart Vocabulary, Visual Progress, レベル別カリキュラム） | L466〜L538 |
| 4 | Pricing | 「今は完全無料で始められます」+ FREE PLAN カード | L541〜L606 |
| 5 | **Testimonials** | 「ユーザーの声」3 件（スタブデータ） | L599〜L647 |
| 6 | About | 「IELTS Trainingについて」ミッション・技術スタック | L650〜L715 |
| 7 | **Contact** | 「お問い合わせ」フォーム（送信時は alert のみ） | L718〜L793 |
| 8 | フッター | Product（Features, Pricing, **Testimonials**）/ Company（About, Blog, **Contact**）、Privacy/Terms モーダル導線 | L801〜L884 |

- すべて **`app/page.tsx` 内** に記述。共通の `Layout` は使っていない。

### 2.3 Header / Footer の実体（ファイルパス）

| 種別 | 使用箇所 | 実体 |
|------|----------|------|
| LP 用ヘッダー | ルート `/` のみ | `app/page.tsx` 内インライン（L244〜L268）。リンクは「IELTS Training」ロゴ（`/`）、「Blog」（外部 ieltsconsult.netlify.app）のみ。 |
| LP 用フッター | ルート `/` のみ | `app/page.tsx` 内インライン（L801〜L884）。Product / Company リンク・Privacy/Terms ボタン。 |
| 認証後用ヘッダー | `/home` 他、`Layout` を使う全ページ | `components/layout/Header.tsx` |
| 認証後用フッター | 上記と同じ | `components/layout/Footer.tsx`（`Layout` 経由で `components/layout/Layout.tsx` が読み込み） |

- `Layout` の使用有無：`app/page.tsx` は **使用していない**。`app/home/page.tsx` をはじめ、`/task/*`、`/training/*`、`/feedback/*` 等は `Layout` を使用（`Layout.tsx` が `Header` + `Footer` を表示）。

### 2.4 リダイレクト / ガード / CSP（iframe 可否含む）

- **middleware.ts**（L86〜L95, L98〜L141）:
  - `/vocab` → 308 で `/training/vocab?skill=...` にリダイレクト。
  - `/training/writing/task2` → 308 で `/task/select?task_type=Task%202` にリダイレクト。
  - 認証ガード：`/home`, `/task`, `/feedback`, `/progress`, `/rewrite`, `/speak`, `/fillin` は未認証時 `/login` へ。`/login` 認証済み時は `/onboarding` または `/home` へ。`/onboarding` 未認証時は `/login` へ。
- **next.config.js**: `reactStrictMode: true` のみ。CSP・frame-src・headers の設定は **なし**。
- **iframe**: `Content-Security-Policy` や `frame-src` の記述はリポジトリ内に存在しない（検索結果 0 件）。このため **Google Forms の iframe 埋め込みは現状ポリシーではブロックされない** と判断できる（推測：ブラウザ・ホスティングのデフォルトに依存）。

---

## 3. 要件 G1〜G6 のギャップ分析

| ゴール | 現状 | 不足 | 阻害要因（根拠） |
|--------|------|------|------------------|
| **G1** LP を最小で信用できる構成に整理 | LP が 1 ファイルに集約され、課題解決・Features・Pricing・About・Contact が一通り存在 | 不要セクション（Testimonials）の残存、問い合わせが未実装 | Testimonials セクションとフッター導線が残っている（`app/page.tsx` L599〜L647, L824〜825）。Contact は alert のみ（L732）。 |
| **G2** ヘッダーを Input/Output/Blog に構造化 | LP ヘッダーは Blog のみ。認証後ヘッダーは Home + Vocab + Blog のフラット表示。NAV_* 定数は未使用 | Input（Vocab/Idiom/Bank）・Output（Speaking/Writing）・Blog（Official/Note）のグループ化と表示順の統一 | `Header.tsx` で `NAV_INPUT`/`NAV_OUTPUT`/`NAV_BLOG` を定義しているが、レンダーは `Link` 直書き（L76〜86, L148〜181）。ドロップダウン等の UI は未実装。 |
| **G3** 不要ファイル・不要 SQL の削除 | 参照ゼロが明確な候補として `app/vocab/page.tsx` が冗長 | 未使用ファイルの洗い出しと、migrations 外のゴミ SQL の有無確認 | 本レポートで「Safe to delete」候補を 1 件提示。migrations は原則削除対象外のため、削除候補は限定的。 |
| **G4** 口コミ（Testimonials）完全削除 | LP に「ユーザーの声」セクションとフッターの Testimonials 導線あり | セクション削除、フッターの Testimonials 項目削除、他ページからのリンク・アンカー削除 | 実体は `app/page.tsx` の L599〜L647（セクション）と L824〜825（フッター）。他ページから `#testimonials` へのリンクは未検出。 |
| **G5** 問い合わせを確実に届く形に | Contact はフォーム見た目のみで送信先なし。`lib/constants/contact.ts` に Google Form 用定数ありだが LP で未使用 | Google Forms 埋め込み（またはリンク）+ 必要に応じ mailto 併記 | Contact セクション（L718〜L793）が `CONTACT_GOOGLE_FORM_URL` 等を参照していない。埋め込み時は URL を `?embedded=true` に変換する必要あり（本レポート 5 節）。 |
| **G6** 指定ブロックの同一サイズ・同一フォーマット | Features 内で見出しレベル・テキスト class・カード幅・説明文長が不揃い | 6 ブロック（Everything you need〜＋4 カード）の見出し・本文・カードを同一ルールで統一 | 原因は L469〜L534 の class とタグの差（h2 vs h3、`text-sm` の有無、`max-w-md`、`md:col-span-2`）。詳細はセクション 7。 |

---

## 4. Testimonials 削除対象の特定

### 4.1 LP 内の該当セクション実体

- **ファイル**: `app/page.tsx`
- **行**: 約 L599〜L647
- **内容**: `<section id="testimonials" className="py-24 bg-[#FAFAFA]">` 以下、見出し「ユーザーの声」と 3 件のスタブカード（`.map` で表示）。別コンポーネントには分離されていない。

```599:647:app/page.tsx
        {/* Testimonials セクション */}
        <section id="testimonials" className="py-24 bg-[#FAFAFA]">
          ...
              ].map((testimonial, i) => (
                <StaggerItem key={i}>
                  <div className="bg-white rounded-2xl p-6 ...">
```

### 4.2 フッター / ヘッダー / アンカー / 他ページへの導線

| 場所 | 種別 | 内容 | ファイル・行 |
|------|------|------|--------------|
| LP フッター | ボタン（スクロール） | 「Testimonials」クリックで `scrollToSection('testimonials')` | `app/page.tsx` L824〜825 |
| LP ヘッダー | リンク | なし（LP ヘッダーに Testimonials はない） | - |
| 他ページ | リンク・アンカー | `#testimonials` や「Testimonials」へのリンクはコードベースになし（LP フッター以外） | grep 結果：`app/page.tsx` と `ランディングページ改善提案レポート.md` のみ |
| プライバシーポリシー | 文言 | 「Contactセクションからご連絡ください」のみ（Testimonials 非参照） | L943〜945 |

- **結論**: 削除対象は **LP の Testimonials セクション全体** と **フッターの「Testimonials」1 項目**。他ページからの Testimonials 導線はなし。ドキュメント `ランディングページ改善提案レポート.md` には言及があるが、コード上の導線ではない。

---

## 5. Contact を Google Forms へ置換する際の論点

### 5.1 現状フォームの送信先と課題

- **送信先**: なし。`onSubmit` で `e.preventDefault()` のうえ `alert('お問い合わせ機能は準備中です。メールにてご連絡ください。');` のみ（`app/page.tsx` L732）。
- **課題**: 問い合わせが届かない。スパム対策・到達性の保証がない。

### 5.2 埋め込み方法（iframe / 外部リンク / URL 変換の要否）

- **提供 URL**:  
  `https://docs.google.com/forms/d/e/1FAIpQLSe8CCgMzEvuc2Nz7xNh-laT3YbyXMNVyfUsukjjg0sL7TggvQ/viewform?usp=publish-editor`
- **embed 用 URL**: 同一パスの `viewform` に **クエリを `embedded=true` にしたもの** を使う。  
  - 推奨:  
    `https://docs.google.com/forms/d/e/1FAIpQLSe8CCgMzEvuc2Nz7xNh-laT3YbyXMNVyfUsukjjg0sL7TggvQ/viewform?embedded=true`  
  - 根拠: Google Forms の iframe 埋め込みでは `?embedded=true` が一般的。`usp=publish-editor` は編集用のため埋め込みでは不要。
- **実装方針**: 定数または環境変数で「表示用 URL」を保持し、LP で iframe の `src` に使う場合は、既存の `CONTACT_GOOGLE_FORM_URL` から `embedded=true` 版を生成するか、別で `CONTACT_GOOGLE_FORM_EMBED_URL` を用意する。未設定時は非表示または「準備中」とする既存思想（`lib/constants/contact.ts` の空なら非表示）に合わせられる。

### 5.3 定数 / 環境変数で管理すべき値一覧

- 既存（`lib/constants/contact.ts`）:
  - `CONTACT_EMAIL`（`NEXT_PUBLIC_CONTACT_EMAIL`）: mailto 用
  - `CONTACT_GOOGLE_FORM_URL`（`NEXT_PUBLIC_CONTACT_GOOGLE_FORM_URL`）: フォーム URL（未設定時は空）
  - `BLOG_OFFICIAL_URL` / `BLOG_NOTE_URL`
- 追加検討:
  - 埋め込み専用 URL を別変数にする場合: `CONTACT_GOOGLE_FORM_EMBED_URL` または `NEXT_PUBLIC_CONTACT_GOOGLE_FORM_EMBED_URL`（未確定ならプレースホルダでよい）。
  - mailto 併記する場合は既存 `CONTACT_EMAIL` を LP の Contact セクションでも参照する。

---

## 6. ヘッダー再設計の論点

### 6.1 現状メニュー構造と目標構造（Input / Output / Blog）への差分

| 対象 | 現状 | 目標（S3） |
|------|------|------------|
| **LP**（`app/page.tsx` 内） | ロゴ（/）、Blog（外部）のみ | LP も Input/Output/Blog に揃えるか、または LP は簡易のままにするか要方針決定。 |
| **認証後**（`Header.tsx`） | Home, Vocab（`/training/vocab?skill=speaking`）, Blog（外部）のフラット表示 | 1) Input: Vocab / Idiom / Bank 2) Output: Speaking / Writing 3) Blog: Official Blog / Note |

- **Header.tsx** では `NAV_INPUT`（Vocab, Idiom, Bank）、`NAV_OUTPUT`（Speaking, Writing）、`NAV_BLOG`（Official Blog, Note）が **定義済みだが未使用**。描画は L76〜86（デスクトップ）・L148〜181（モバイル）の固定 `Link` のみ。そのため「Input / Output / Blog」のグループ表示やドロップダウンは未実装。

### 6.2 /vocab 撲滅の影響範囲（検索結果）

- **結論**: ヘッダーに **`/vocab` というパスは既にない**。`Header.tsx` の Vocab リンクはすべて **`/training/vocab?skill=speaking`**（L13, L77, L163）。
- **middleware**: `/vocab` アクセス時は 308 で `/training/vocab` にリダイレクト（L86〜90）。
- **app/vocab/page.tsx**: クライアント側のリダイレクト用フォールバック。middleware が先に効くため、実質冗長。
- 他に `/vocab` を参照するコードは、`middleware` と `app/vocab/page.tsx` のみ。ヘッダーから `/vocab` を「残さない」という要件は、現状のままで満たされている。

### 6.3 disabled + Coming soon の実装パターン案（まだ実装しない）

- **既存例**: `app/home/page.tsx` の Input カテゴリで、`disabled: true` の技能に「Coming soon」を表示（`INPUT_CATEGORIES` とその描画）。ヘッダー側には同パターンはまだない。
- **案**: ヘッダーで `NAV_*` を実際に使用する際、`enabled: false` の項目を `span` 等で表示し、`opacity` や `cursor-not-allowed` を付け、ラベル横に「Coming soon」を表示する。未実装ページの項目は消さず、この形で統一する。

---

## 7. 「同一フォーマット」不整合の原因と最小修正候補（まだ実装しない）

対象ブロック（すべて `app/page.tsx` の Features セクション内）:

1. 見出し「Everything you need to succeed」
2. サブコピー「AI技術と学習科学を組み合わせた、オールインワンの学習プラットフォーム」
3. AI Instant Feedback（説明文）
4. Smart Vocabulary（説明文）
5. Visual Progress（説明文）
6. レベル別カリキュラム（説明文）

### 7.1 不揃いの原因（ファイルパス・該当コード）

| 要素 | 現状 | 原因 |
|------|------|------|
| セクション見出し | `h2` + `text-3xl font-bold ... mb-4`（L469〜470） | 他セクションと同一。 |
| サブコピー | `p` + `text-slate-500 text-lg`（L472〜473） | 問題なし。 |
| Feature 1（AI Instant Feedback） | カード `md:col-span-2`、`h3` + `text-2xl`、`p` + `text-slate-600 max-w-md mb-6`（L485〜486） | 見出しが `text-2xl`、本文に `max-w-md` があり他と異なる。 |
| Feature 2（Smart Vocabulary） | カード 1 列、`h3` + `text-xl`、`p` + `text-slate-600 text-sm`（L500〜502） | 本文が `text-sm`。 |
| Feature 3（Visual Progress） | 同上（L511〜515） | 同上。 |
| Feature 4（レベル別カリキュラム） | カード `md:col-span-2`、`h3` + `text-xl`、`p` + `text-slate-600`（指定なし）（L528〜531） | 本文に `text-sm` なし。 |

- **まとめ**: （1）見出しレベルが Feature 1 だけ `text-2xl`、他は `text-xl`。（2）説明文が Feature 2・3 は `text-sm`、Feature 1 は `max-w-md mb-6`、Feature 4 はクラスなし。（3）グリッドは 1 と 4 が `md:col-span-2`、2 と 3 が 1 列。

### 7.2 同一フォーマットに揃えるための最小変更候補

- **案 A（全カード同一サイズ）**: 4 カードをすべて `md:col-span-1` にし、`grid md:grid-cols-2` または `md:grid-cols-4` で均等に。見出しはすべて `h3` + `text-xl font-bold ... mb-3`、説明はすべて `p` + `text-slate-600 text-sm`（または同一の `leading-relaxed`）に統一。`max-w-md` は削除。
- **案 B（現状レイアウトを維持しつつ見た目だけ統一）**: col-span はそのままにし、見出しをすべて `text-xl` に、説明文をすべて同じ class（例: `text-slate-600 text-sm`）に揃える。Feature 1 の `max-w-md` を外す。
- **共通**: セクション見出し・サブコピーは現状のままでよい。カードの `min-height` を揃えたい場合は、同一の `min-h-[...]` を全カードに付与する。

---

## 8. 不要ファイル / 不要 SQL の削除候補リスト

### 8.1 Safe to delete（根拠付き）

| 候補 | 根拠 |
|------|------|
| **app/vocab/page.tsx** | `/vocab` は `middleware.ts` で 308 リダイレクトされるため、このページは通常リクエストで表示されない。クライアント遷移時のフォールバックとしての役割はあるが、middleware が先に効くため実質冗長。削除すると `/vocab` 直アクセスは middleware のみで処理される。 |

- 注意: 削除前に、`/vocab` への直リンクが他にないことを確認すること。本調査ではヘッダー・メニューはすべて `/training/vocab` を指している。

### 8.2 Needs confirmation（確認手順付き）

- **動的 import や文字列でパスを参照しているファイル**: `app/vocab/page.tsx` は Next.js のルートとして `app/vocab/page.tsx` で自動認識されるだけであり、他ファイルから import されていない（grep で `from.*vocab/page` 等は 0 件）。したがって「参照ゼロ」は成立。
- **migrations 外の SQL**: `supabase/migrations/` 以外に `.sql` は見つかっていない。docs や scripts 内の SQL 断片は未検出。**既存マイグレーション（001〜007）の削除は原則禁止** とする。

---

## 9. 実装前に追加確認すべき点（最大 12 個、優先度順）

1. **LP のヘッダーを Input/Output/Blog に変えるか**  
   LP は未ログイン用のため、簡易メニュー（Blog のみ）のままにするか、認証後と同様に Input/Output/Blog を並べるか方針を決める。

2. **Google Forms 埋め込み URL の最終形**  
   本番で使うフォーム URL を環境変数で渡す場合、`embedded=true` を付与する処理をクライアントで行うか、環境変数側で最初から埋め込み用 URL を入れるかを決める。

3. **Contact の mailto 併記の要否**  
   併記する場合、`CONTACT_EMAIL` を LP の Contact セクションで表示する。プレースホルダのままでよいか、実メールアドレスを設定するかを確認する。

4. **BLOG_NOTE_URL の有無**  
   `NEXT_PUBLIC_BLOG_NOTE_URL` が空の場合、Header の Note は出さない実装になっている。Note の URL を確定するか、TODO のままにするかを決める。

5. **Testimonials 削除後のフッター「Product」**  
   Testimonials を外すと Product は Features と Pricing のみになる。並びやラベルを変えるかどうか。

6. **同一フォーマットで「全カード同サイズ」か「Bento 維持」か**  
   セクション 7 の案 A（均等グリッド）と案 B（レイアウト維持）のどちらを採用するか。

7. **app/vocab/page.tsx 削除の可否**  
   middleware のみで `/vocab` を処理してよいか、クライアント用フォールバックを残すかを確認する。

8. **CSP の将来設定**  
   iframe を許可する場合、将来 CSP を入れるときは `frame-src` に `https://docs.google.com` を含める必要があることを頭に入れておく。

9. **ランディングページ改善提案レポート.md の扱い**  
   Testimonials 削除後、このドキュメント内の Testimonials 記述を更新するか、レポートは「過去の提案」として残すのみにするか。

10. **Privacy Policy の「Contactセクション」文言**  
   問い合わせを Google Forms にしたあとも「Contactセクションからご連絡ください」でよいか、または「お問い合わせフォーム」等に変更するか。

11. **認証後 Header のドロップダウン / SP メニュー**  
   NAV_INPUT / NAV_OUTPUT / NAV_BLOG を使う場合、PC はドロップダウンか横並び、SP はアコーディオンかハンバーガー内リストかを決める。

12. **Idiom / Bank のリンク先**  
   ヘッダーで Idiom は `/training/idiom`、Bank は `/training/lexicon` でよいか（既存ルートの確認）。

---

以上。
