# 現状分析レポート：選択状態UI（T1/T2）と 4技能導線（T3）

**作成方針**: コード変更禁止。原因特定・影響範囲・統一修正のための設計案のみ記載。推測は「推測」と明記し根拠（ファイルパス・該当コード・検索結果）を付与。

---

## 1. 重要結論サマリ

- **T1/T2（選択中UI）**: `/task/select` は `lib/ui/theme.ts` の `selectableSelected` / `selectableUnselected`（CSS変数トークン）を使用しており、ダークモードでも白背景にならない。一方で **`/training/speaking` の Task 選択ボタン**は `selectableSelected` を使わず、**選択時に `border-indigo-600 bg-indigo-50` を直書き**しているため、ダークモードで `bg-indigo-50` が白っぽく見え、文字が読みにくい。同様に **Header の Input/Output/Blog ドロップダウン開時**も `bg-indigo-50` 直書きで、選択中が分かりにくい箇所が残る。選択状態の「共通化」は `/task/select` のみで、他ページは各所で className を分岐している。
- **T3（4技能が飛ぶ）**: `/training/vocab`（idiom/lexicon も同様）では、**URL に `?skill=` がなくても `effectiveSkill = 'speaking'` とし、mount 時 useEffect で `fetchLexiconSets(effectiveSkill)` を実行し、成功時に `setStep('category')` している**。その結果、初回レンダー前に step が `'category'` になり、**4技能選択（step === 'skill'）の UI が一度も表示されず**、いきなり「Speaking - カテゴリとモード選択」が表示される。middleware のリダイレクトや page 内の `router.replace` は原因ではない。
- **統一修正の方向性**: 選択中スタイルは「共通クラス（theme.ts の selectableSelected）または SelectableButton コンポーネント」に寄せ、`bg-indigo-50` 等の直書きを廃止する。4技能導線は「URL に skill が無いときは useEffect で fetch せず step を 'skill' のままにし、ユーザーが技能を選んだときだけ fetch して step を 'category' に進める」ように条件分岐を変える必要がある。

---

## 2. 現状アーキテクチャ（UI観点）

### 2.1 ダークモード方式

- **方式**: `document.documentElement` に `data-theme="dark"` を付与する方式（`app/globals.css` の `[data-theme="dark"]` で CSS 変数を上書き）。
- **根拠**: `app/globals.css` に `:root` と `[data-theme="dark"]` で `--bg`, `--surface`, `--surface-2`, `--text`, `--text-muted`, `--border`, `--selectable-selected-bg`, `--selectable-selected-border` 等が定義されている。
- **Tailwind**: `tailwind.config.ts` で `colors.bg`, `surface`, `text`, `border`, `selectable-selected.bg` 等が `rgb(var(--*))` を参照。`dark:` メディア/クラスは使っておらず、**テーマは CSS 変数の切り替えのみ**で制御されている。

### 2.2 選択状態スタイルの共通化の有無

- **共通化されている箇所**: `lib/ui/theme.ts` の `selectableSelected` / `selectableUnselected`。`selectableSelected` は `border-selectable-selected-border` / `bg-selectable-selected-bg`（globals.css の変数）を参照し、ライト/ダーク両対応。
- **使用箇所**: `app/task/select/page.tsx` のみ。タスクタイプ・レベル・モード・ジャンル選択の全ボタンで `cn(..., condition ? selectableSelected : selectableUnselected)` を使用。
- **共通化されていない箇所**: 以下は各ページで独自の className 分岐を使用。
  - `app/training/speaking/page.tsx`（カテゴリ・Task 選択）
  - `app/training/vocab/page.tsx`（カテゴリ選択: `border-primary bg-accent-indigo/10` 等）
  - `app/training/idiom/page.tsx`（同上）
  - `app/training/lexicon/page.tsx`（同上）
  - `components/layout/Header.tsx`（ドロップダウン開時: `bg-indigo-50`）

---

## 3. T1/T2: 選択状態UIの現状と問題点

### 3.1 白背景（または白っぽく見える）が出る箇所一覧

| URL/画面 | 該当ファイル | 該当箇所（行番目安） | 選択時クラス |
|----------|-------------|----------------------|--------------|
| `/training/speaking`（Task 選択） | `app/training/speaking/page.tsx` | 94–98 | `border-indigo-600 bg-indigo-50` |
| 認証後ヘッダー（Input/Output/Blog 開時） | `components/layout/Header.tsx` | 83, 110, 137 | `text-indigo-600 bg-indigo-50` |
| `/home`（Input カード内の技能リンク） | `app/home/page.tsx` | 235 | `bg-indigo-50 text-indigo-600 border border-indigo-200`（リンク常時） |
| `/home`（Output カードのアイコン背景） | `app/home/page.tsx` | 263, 306 | `bg-indigo-50 border-indigo-200` 等 |

**検索根拠**:  
`grep "bg-indigo-50" app components` の結果（該当ファイル・行）に基づく。  
`/task/select` は `selectableSelected` 使用のため、**白背景にはならない**（トークンでダーク時は surface 系）。

### 3.2 選択時クラスで白になる条件分岐（抜粋）

**app/training/speaking/page.tsx（Task 選択ボタン）**

```tsx
// 89–99行付近
<button
  ...
  className={cn(
    'p-4 rounded-xl border-2 text-left transition-all',
    task === t.id
      ? 'border-indigo-600 bg-indigo-50'   // ← 選択時: 固定色
      : 'border-border hover:border-indigo-200'
  )}
>
```

- **なぜ白になるか**: `bg-indigo-50` は Tailwind の固定色（238 242 255 相当）のため、`[data-theme="dark"]` で変わらず、ダーク背景上で白っぽく目立つ。`theme.ts` の `selectableSelected` は参照していない。

**components/layout/Header.tsx（ドロップダウン開いているグループ）**

```tsx
// 81–84, 108–111, 135–138 付近
desktopOpenGroup === 'input' ? 'text-indigo-600 bg-indigo-50' : 'text-text-muted hover:text-indigo-600'
```

- 開いているグループのボタンに `bg-indigo-50` が付与され、ダーク時に同様に白っぽく見える。

### 3.3 「選択中が分からない」原因（枠線・対比・余白の観点）

- **selectableSelected（task/select）**: 枠線（`border-selectable-selected-border`）と背景（`bg-selectable-selected-bg`）の両方でトークンを使用しており、ダーク時は surface 系で統一されている。**問題は主に「selectableSelected を使っていないページ」**。
- **speaking の Task 選択**: 選択時は「薄い紫背景＋紫枠」だが、ダーク時は背景が白っぽく、かつ **ring/outline によるフォーカス的強調が無い**。未選択との差が「背景色のみ」に依存しているため、コントラストが弱い。
- **Header**: 開いているグループが「背景のみ」で示されており、枠線や ring による補強がない。

---

## 4. 統一的に直すための設計案（まだ実装しない）

- **方針**: 選択中は「背景は surface 系トークン ＋ 枠線強調 ＋ 必要に応じて ring」とし、`bg-white` / `bg-indigo-50` の直書きをやめる。
- **推奨**:
  1. **共通クラスの拡張**: `lib/ui/theme.ts` の `selectableSelected` を、すでにトークン化されているためそのまま「選択中ボタン/カードの標準」とする。必要なら `ring-2 ring-selectable-selected-border ring-offset-2 ring-offset-bg` のような枠線・ring を追加し、「選択中が分かりにくい」を解消する。
  2. **未使用箇所の置き換え**:  
     - `app/training/speaking/page.tsx` の Task 選択ボタン: `task === t.id ? selectableSelected : selectableUnselected` に変更。  
     - カテゴリ選択ボタン（speaking の 74–76 行）: 現状 `bg-indigo-600 text-white` で「塗りつぶし」スタイル。こちらは「選択＝塗りつぶし」の意図が明確なため、トークン化するなら `bg-primary text-primary-foreground` 等に寄せる程度でよい。  
     - Header のドロップダウン開時: `bg-indigo-50` → `bg-selectable-selected-bg` または `bg-surface-2` に変更し、必要なら `border-selectable-selected-border` を付与。
  3. **コンポーネント化（任意）**: 全ページで同じ見せ方にしたい場合は、`SelectableButton` のようなコンポーネントを `lib/ui` に作り、`selected` 時に `selectableSelected` を渡す形にすると、今後の「選択中＝白」の混入を防ぎやすい。
- **既存トークン**: `--selectable-selected-bg`, `--selectable-selected-border`, `--surface`, `--border`, `--text` をそのまま利用する前提でよい。

---

## 5. T3: /training/vocab（idiom/lexicon）の導線問題の原因

### 5.1 何が「speaking 選択済み」扱いにしているか（根拠）

- **原因**: **URL に `?skill=` が無い場合でも `effectiveSkill = 'speaking'` とし、mount 直後の useEffect で `fetchLexiconSets(effectiveSkill, ...)` を実行し、成功時に `setStep('category')` しているため**。
- **該当コード**:  
  - **app/training/vocab/page.tsx**  
    - 61–62 行: `const effectiveSkill = (urlSkill === 'speaking' || urlSkill === 'writing') ? urlSkill : 'speaking';`  
    - 63–84 行: `useEffect(() => { setSelectedSkill(effectiveSkill); ...; fetchLexiconSets(effectiveSkill, 'vocab').then(... setStep('category') ...); }, [effectiveSkill]);`  
  - **app/training/idiom/page.tsx**: 同様の `effectiveSkill` と useEffect で `setStep('category')`（行番は idiom で 62–84 付近）。  
  - **app/training/lexicon/page.tsx**: 同様（62–84 付近）。
- **結果**: 初回マウント時、`effectiveSkill` は常に `'speaking'`（URL に skill が無い場合）。useEffect が同期的にスケジュールされ、fetch が成功すると `setStep('category')` が呼ばれるため、**最初から step が 'category' になり、step === 'skill' のブロックが表示されない**。

### 5.2 4技能選択UIの有無と、見えない理由

- **有無**: **4技能選択UIは存在する**。`app/training/vocab/page.tsx` の 354–408 行で `{step === 'skill' && (...)}` のブロック内に「スキルを選択」と Reading/Listening（Coming soon）/ Speaking / Writing の 4 カードが定義されている。
- **見えない理由**: 上記の通り、**初回レンダー前に useEffect が動き、fetch 成功で `setStep('category')` される**ため、`step` が一度も `'skill'` のままにならず、4技能選択が画面に出ない。リダイレクトや別ルートへの遷移は関係ない。

### 5.3 ルーティング・リダイレクトの確認結果

- **middleware.ts**: `/vocab` を `/training/vocab`（必要なら `?skill=` 付き）に 308 リダイレクトする記述のみ。`/training/vocab` 自体のリダイレクトは無い。
- **page.tsx 内**: `app/training/vocab/page.tsx`（および idiom/lexicon）に `router.replace` / `redirect()` は無い。**URL は書き換えていない**。
- **結論**: 「勝手に speaking のカテゴリ/モード選択に飛ぶ」のは、**URL やリダイレクトではなく、初期 state と useEffect による step の即時変更**が原因。

---

## 6. T3: 4技能選択ページを必ず出すための最小修正案（まだ実装しない）

- **ページ構成**: 現状の 1 page 内で step を 'skill' | 'category' | 'quiz' で切り替える構成は維持してよい。変更するのは「**URL に skill が無いときは、useEffect で fetch しない（step を 'skill' のままにする）**」部分のみ。
- **具体的な分岐案**:
  - **URL に `?skill=speaking` または `?skill=writing` がある場合**: 従来どおり `effectiveSkill = urlSkill` とし、useEffect で fetch → 成功時 `setStep('category')`。このときは「直接カテゴリ/モード選択に飛ぶ」挙動でよい（互換維持）。
  - **URL に `?skill=` が無い（または reading/listening 等）場合**:  
    - `effectiveSkill` は内部用に `'speaking'` のままでもよいが、**useEffect では fetch を実行しない**。  
    - 初期 `step` を `'skill'` に固定し、**ユーザーが Speaking / Writing のいずれかをクリックしたときだけ** `handleSkillSelect` 経由で fetch し、成功時に `setStep('category')` する。  
  - 実装では「useEffect の依存配列に `urlSkill` を入れ、`urlSkill === 'speaking' || urlSkill === 'writing'` のときだけ fetch と setStep('category') を行う」ようにすれば、クエリ無しで開いた場合は step が 'skill' のままになり、4技能選択が表示される。
- **既存URL互換**: `?skill=speaking` / `?skill=writing` でアクセスした場合は従来どおり即カテゴリ/モード選択に進むようにする。推奨: 維持。

---

## 7. 実装に入る前の追加確認事項（優先度順）

1. **T2**: `/training/speaking` 以外に「選択中に `bg-indigo-50` 等を直書きしている」ページが他に無いか、`bg-indigo-50` / `bg-white` と「選択・active」が同居する箇所を再度 grep で確認する。
2. **T1**: 選択中を「枠線＋ring」で強調する場合、既存の `selectableSelected` に `ring-*` を足すと `/task/select` の見た目が変わる。デザイン上許容するか、または「speaking のみ別スタイル」とするか方針を決める。
3. **T3**: vocab/idiom/lexicon の 3 ファイルで「URL に skill が無いときは fetch しない」条件を同じロジックで揃えるか（共通フックやユーティリティに切り出すか）を決める。
4. **T3**: `?skill=reading` / `?skill=listening` でアクセスした場合、現状は `ComingSoonSkillsView` が表示される。effectiveSkill を 'speaking' にしない場合、reading/listening では fetch しないことで、この表示が維持されるか確認する。
5. **Header**: ドロップダウン「開いている」状態を「選択中」とみなすか、単に「開いているだけ」とするか。デザイン上 `bg-surface-2` で十分か、`selectable-selected` 系を使うか決める。
6. **home**: Input カード内のリンク（`bg-indigo-50`）は「選択中」ではなく「クリック可能な CTA」のスタイル。ダークで見づらければトークンに寄せるが、T1/T2 の「選択中」とは別扱いでよいか確認する。
7. **accessibility**: 選択中ボタンに `aria-selected="true"` 等を付与するか。現状は未使用のため、統一コンポーネント化する際に検討する。
8. **E2E/手動**: T3 修正後、`/training/vocab` をクエリ無しで開き、4技能選択が表示され、Speaking 選択でカテゴリ/モード選択に進むことを確認する手順を用意する。
9. **既存ブックマーク**: `?skill=writing` 等でブックマークしているユーザーがいる想定なら、そのまま「即カテゴリ表示」が維持されることをテストする。
10. **idiom/lexicon**: vocab と同一の step 制御にする場合、3 ファイルの差分が小さくなるよう、共通化するかどうか（カスタムフック等）を決める。

---

## 8. 影響範囲（修正対象ファイル候補リスト）

| テーマ | ファイルパス | 想定変更内容（実装は行わない） |
|--------|--------------|--------------------------------|
| T1/T2 | `lib/ui/theme.ts` | selectableSelected に ring/outline を追加する場合 |
| T2 | `app/training/speaking/page.tsx` | Task 選択ボタンを selectableSelected/Unselected に変更；カテゴリは必要に応じてトークン化 |
| T2 | `components/layout/Header.tsx` | ドロップダウン開時の `bg-indigo-50` をトークンに変更 |
| T1（任意） | `app/home/page.tsx` | Input/Output のカード・リンクの `bg-indigo-50` をトークンに変更（CTA としての見た目調整） |
| T3 | `app/training/vocab/page.tsx` | URL に skill が無いときは useEffect で fetch しない条件分岐を追加 |
| T3 | `app/training/idiom/page.tsx` | 上記と同様 |
| T3 | `app/training/lexicon/page.tsx` | 上記と同様 |
| ドキュメント | `docs/現状分析レポート_選択状態UI_4技能導線.md` | 本レポート（修正後は「対応済み」等の追記候補） |

---

以上。コード変更は行っておらず、根拠はすべて該当ファイルの検索・読み取りに基づく。
