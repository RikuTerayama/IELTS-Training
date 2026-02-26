# 学習体験の契約（Learning Contract）

## 目的

このドキュメントは、IELTS Trainingアプリケーションの学習体験を「Input」と「Output」に再構造化する前提を、コードとドキュメントの「契約」として固定するものです。

Step0では、データモデルとAPIの形（インターフェース）を先に確定させ、Step1以降で機能を積むための土台を構築します。

---

## 1. Input と Output の概念

### 1.1 Input（定着: 認知と想起）

**目的**: 語彙・熟語・表現を「覚える」「思い出す」こと

- **学習コンテンツ**:
  - `vocab`: 語彙（単語）
  - `idiom`: 熟語
  - `lexicon`: 表現バンク（よく使う表現）

- **学習モード**:
  - `click`: 選択式（複数選択肢から選ぶ）
  - `typing`: 入力式（タイピングで回答）

- **評価基準**: 正答率、定着度（忘却曲線ベース）

### 1.2 Output（運用: 使わせる制約）

**目的**: 覚えた語彙・表現を「実際に使う」こと

- **学習コンテンツ**:
  - `writing_task1`: Writing Task 1（グラフ・図表・地図の説明）
  - `writing_task2`: Writing Task 2（エッセイ）
  - `speaking`: Speaking練習（瞬間英作文）

- **評価基準**: Band推定、4次元評価（TR/CC/LR/GRA）、Band-up actions

---

## 2. レベルと経験値（Lv/Exp）の2系統

### 2.1 Input Level と Output Level は分離

- **Input Level**: Inputモジュール（vocab, idiom, lexicon）の学習で上昇
- **Output Level**: Outputモジュール（writing_task1, writing_task2, speaking）の学習で上昇

### 2.2 経験値（Exp）付与は「イベント」に対して行う

- **Input Exp 付与イベント**:
  - `click`正答: +10exp
  - `typing`正答: +20exp（入力式の方が難易度が高いため）
  - 復習正答: +5exp（忘却曲線に基づく復習）

- **Output Exp 付与イベント**:
  - タスク提出: +50exp
  - 書き直し完了: +30exp
  - Band向上: +100exp（前回よりBandが上がった場合）

### 2.3 レベル計算（Step0はダミー、Step2で忘却曲線ベースに差し替え）

- **Step0（現在）**: ダミー計算（`nextLevelExp = 100 + level * 50`）
- **Step2（予定）**: 忘却曲線に基づく計算

---

## 3. 今日のメニュー（Today Menu）

### 3.1 API Contract

**エンドポイント**: `GET /api/menu/today`

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

### 3.2 表示場所

- **Home画面**: InputセクションとOutputセクションを表示
- **各学習画面**: Lv/Expを常時表示（Step5で実装予定）

---

## 4. Progress画面の廃止

### 4.1 方針

- **Step0**: Progress画面への導線をUI上から外す（リンクを非表示）
- **後工程**: Progress画面自体を削除

### 4.2 代替表示

- **Home画面**: 今日のメニューとLv/Expを表示
- **各学習画面**: その画面のLv/Expを表示

---

## 5. 後続Stepの方針

### Step1: 表現バンク（Lexicon）
- Inputモジュール「lexicon」を実装
- よく使う表現を登録・学習できるようにする

### Step2: 忘却曲線
- 忘却曲線に基づく出題ロジックを実装
- レベル計算を忘却曲線ベースに差し替え

### Step3: Idiom（熟語）
- Inputモジュール「idiom」を実装
- 熟語の登録・学習機能を追加

### Step4: Speaking/Writing連動
- Outputモジュール間の連動機能を実装
- Writingで学んだ表現をSpeakingで使う、など

### Step5: Lv/Exp表示
- 各学習画面にLv/Expを常時表示
- レベルアップ時の通知機能

### Step6: 通知
- 今日のメニュー更新通知
- レベルアップ通知
- 復習タイミング通知

---

## 6. データモデル（将来拡張予定）

### 6.1 学習ログ（Learning Logs）
- Input学習ログ: `input_learning_logs` テーブル（将来追加）
- Output学習ログ: `output_learning_logs` テーブル（将来追加）

### 6.2 経験値履歴（XP History）
- `xp_history` テーブル（将来追加）
- イベントごとのExp付与履歴を記録

---

## 7. 制約事項

### 7.1 Step0では実装しない
- 忘却曲線に基づく出題ロジック
- 語彙や熟語の大量投入、seedの作成
- Writing/Speakingの出題UIの本実装
- Progressページの完全削除（削除は後工程）

### 7.2 Step0で実装する
- ドメイン定義（Input/Output、モジュール、モード）
- レベルと経験値の型定義（ダミー実装）
- 今日のメニューAPI（スタブ）
- Home画面の受け皿（最小UI）
- Progress依存の遮断（UI上の導線を非表示）

---

## 8. 受け入れ条件（Step0の完了定義）

- ✅ `docs/learning-contract.md` が存在し、Input/Outputの目的と境界、Lv/Expの2系統、後続Stepの方針が明文化されている
- ✅ `GET /api/menu/today` が200で返り、Zodバリデーションを通過する
- ✅ Homeで Input と Output のセクションが表示され、CTAリンクが存在する
- ✅ Progressへの導線がUI上から外れている（ページが残っていてもOK）
- ✅ Step1以降で、lexiconやidiomなどを追加しても壊れない型とcontractになっている

---

**最終更新**: Step0実装時
