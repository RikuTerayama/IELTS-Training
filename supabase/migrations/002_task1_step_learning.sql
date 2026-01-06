-- Task 1 Step Learning機能のためのデータモデル拡張
-- 既存のattemptsテーブルを拡張し、user_skill_statsテーブルを追加

-- ==================== attemptsテーブルの拡張 ====================
-- 既存のフィールドは維持し、Task 1用のフィールドを追加

ALTER TABLE attempts
  ADD COLUMN IF NOT EXISTS task_type TEXT CHECK (task_type IN ('Task 1', 'Task 2')),
  ADD COLUMN IF NOT EXISTS mode TEXT CHECK (mode IN ('training', 'exam')),
  ADD COLUMN IF NOT EXISTS step_state JSONB,
  ADD COLUMN IF NOT EXISTS review_state JSONB;

-- task_typeのデフォルト値を設定（既存データは'Task 2'とみなす）
UPDATE attempts SET task_type = 'Task 2' WHERE task_type IS NULL;
ALTER TABLE attempts ALTER COLUMN task_type SET DEFAULT 'Task 2';

-- インデックス追加（Task 1のattempt検索用）
CREATE INDEX IF NOT EXISTS idx_attempts_task_type ON attempts(task_type);
CREATE INDEX IF NOT EXISTS idx_attempts_mode ON attempts(mode);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON attempts(status);

-- ==================== user_skill_statsテーブルの作成 ====================
CREATE TABLE IF NOT EXISTS user_skill_stats (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  counters JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_skill_stats_user_id ON user_skill_stats(user_id);

-- ==================== RLS設定 ====================
ALTER TABLE user_skill_stats ENABLE ROW LEVEL SECURITY;

-- user_skill_stats: 自分のみ
CREATE POLICY "Users can manage own skill stats" ON user_skill_stats
  FOR ALL USING (auth.uid() = user_id);

-- ==================== コメント追加 ====================
COMMENT ON COLUMN attempts.task_type IS 'Task 1 or Task 2';
COMMENT ON COLUMN attempts.mode IS 'training or exam mode';
COMMENT ON COLUMN attempts.step_state IS 'Task 1 step learning state: {step1-6: string, step1_fixed-step5_fixed: string, observations: array, key_numbers: array, checklist: object, timers: object}';
COMMENT ON COLUMN attempts.review_state IS 'Task 1 review state: {step_review: {status, feedback_payload, updated_at}, final_review: {status, feedback_payload, updated_at}}';
COMMENT ON TABLE user_skill_stats IS 'User skill statistics for Task 1: counters for overview_missing, comparison_missing, tense_inconsistent, article_errors, number_mismatch, etc.';

