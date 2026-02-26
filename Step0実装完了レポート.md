# Step0実装完了レポート

## 実装概要

学習体験をInputとOutputに再構造化するためのStep0を実装しました。データモデルとAPIの形（インターフェース）を先に確定させ、Step1以降で機能を積むための土台を構築しました。

---

## 実装したファイル

### 1. ドメイン定義

#### `lib/domain/learning.ts` (新規作成)
- `LearningArea`: "input" | "output"
- `Skill`: "writing" | "speaking"
- `ModuleKey`: "vocab" | "idiom" | "lexicon" | "writing_task1" | "writing_task2" | "speaking"
- `PracticeMode`: "click" | "typing"
- `InputModule`, `OutputModule` 型定義
- モジュール判定関数（`isInputModule`, `isOutputModule`, `getLearningArea`）

#### `lib/domain/xp.ts` (新規作成)
- `XPArea`: "input" | "output"
- `LevelState`: レベル、経験値、次のレベルまでの経験値
- `UserXPState`: Input/Output分離のXP状態
- ダミーのレベル計算関数（`calculateNextLevelExp`, `calculateLevelFromExp`）
- ダミーのLevelState生成関数（`createDummyLevelState`, `createDummyUserXPState`）

### 2. APIスキーマ

#### `lib/api/schemas/menuToday.ts` (新規作成)
- `TodayMenuSchema`: Zodスキーマ定義
- `TodayMenu`: TypeScript型定義
- Input/Outputモジュールカード、通知の型定義

### 3. API Route

#### `app/api/menu/today/route.ts` (新規作成)
- `GET /api/menu/today` エンドポイント
- スタブ実装（ダミーデータ）
- Zodバリデーション実装
- 統一APIレスポンス形式（`ApiResponse<T>`）を使用

### 4. UI更新

#### `app/home/page.tsx` (更新)
- 今日のメニューAPIを呼び出し
- InputセクションとOutputセクションを表示
- Lv/Expを小さめに表示（Step0はダミー）
- 既存のUIトークン（`cardBase`, `cardTitle`, `cardDesc`, `buttonPrimary`）を使用

#### `components/layout/Header.tsx` (更新)
- Progressへのリンクをコメントアウト（デスクトップ・モバイル両方）
- UI上からProgressへの導線を削除

#### `components/layout/Footer.tsx` (更新)
- Progressサマリーの取得をコメントアウト
- 進捗表示をコメントアウト

### 5. ドキュメント

#### `docs/learning-contract.md` (新規作成)
- Input/Outputの目的と境界を明文化
- Lv/Expの2系統（Input Level / Output Level）を説明
- 今日のメニューAPIの契約を定義
- Progress画面廃止の方針を記載
- 後続Stepの方針（Step1〜Step6）を記載

---

## 実装内容の詳細

### 1. ドメイン定義

#### Input/Outputの概念
- **Input**: 定着（認知と想起）- vocab, idiom, lexicon
- **Output**: 運用（使わせる制約）- writing_task1, writing_task2, speaking

#### レベルと経験値の2系統
- **Input Level**: Inputモジュールの学習で上昇
- **Output Level**: Outputモジュールの学習で上昇
- Step0はダミー実装（`nextLevelExp = 100 + level * 50`）
- Step2で忘却曲線ベースに差し替え予定

### 2. API Contract

#### `GET /api/menu/today`
**レスポンス構造**:
```typescript
{
  date: string; // YYYY-MM-DD
  xp: {
    input: { level: number; exp: number; nextLevelExp: number };
    output: { level: number; exp: number; nextLevelExp: number };
  };
  input: Array<{
    module: "vocab" | "idiom" | "lexicon";
    title: string;
    description: string;
    cta: { label: string; href: string };
  }>;
  output: Array<{
    module: "writing_task1" | "writing_task2" | "speaking";
    title: string;
    description: string;
    cta: { label: string; href: string };
  }>;
  notices?: Array<{
    type: "info" | "warning";
    message: string;
  }>;
}
```

**スタブデータ**:
- Input: vocab, idiom, lexicon（各3件）
- Output: writing_task1, writing_task2, speaking（各3件）
- XP: ダミー値（Lv1, Exp 50, NextLevelExp 150）

### 3. UI更新

#### Home画面
- InputセクションとOutputセクションを表示
- 各モジュールカードにCTAリンクを配置
- Lv/Expを小さめに表示（Step0はダミーのため）

#### Progress依存の遮断
- Header: Progressリンクをコメントアウト
- Footer: Progressサマリー取得をコメントアウト
- `/progress`ページ自体は残す（後工程で削除予定）

---

## 受け入れ条件の確認

- ✅ `docs/learning-contract.md` が存在し、Input/Outputの目的と境界、Lv/Expの2系統、後続Stepの方針が明文化されている
- ✅ `GET /api/menu/today` が200で返り、Zodバリデーションを通過する（スタブ実装）
- ✅ Homeで Input と Output のセクションが表示され、CTAリンクが存在する
- ✅ Progressへの導線がUI上から外れている（ページが残っていてもOK）
- ✅ Step1以降で、lexiconやidiomなどを追加しても壊れない型とcontractになっている

---

## 注意事項

### 既存のビルドエラー
- `lib/task1/assets.ts` に全角括弧「）」が含まれており、ビルドエラーが発生
- これはStep0の実装とは無関係の既存エラー
- 別途修正が必要

### 次のステップ
1. **Step1**: 表現バンク（Lexicon）の実装
2. **Step2**: 忘却曲線に基づく出題ロジック
3. **Step3**: Idiom（熟語）の実装
4. **Step4**: Speaking/Writing連動
5. **Step5**: Lv/Exp表示の実装
6. **Step6**: 通知機能

---

## 実装ファイル一覧

### 新規作成
- `lib/domain/learning.ts`
- `lib/domain/xp.ts`
- `lib/api/schemas/menuToday.ts`
- `app/api/menu/today/route.ts`
- `docs/learning-contract.md`

### 更新
- `app/home/page.tsx`
- `components/layout/Header.tsx`
- `components/layout/Footer.tsx`

---

**実装完了日**: Step0実装時
