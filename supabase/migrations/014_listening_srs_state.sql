-- Listening SRS: question_id ベースの復習状態（Listening Vocab 用）

CREATE TABLE listening_srs_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES lexicon_questions(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('click', 'typing')),
  stage INTEGER NOT NULL DEFAULT 0,
  next_review_on DATE NOT NULL,
  last_review_on DATE,
  correct_streak INTEGER NOT NULL DEFAULT 0,
  total_correct INTEGER NOT NULL DEFAULT 0,
  total_wrong INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_id, mode)
);

CREATE INDEX idx_listening_srs_state_user_mode_next ON listening_srs_state(user_id, mode, next_review_on);
CREATE INDEX idx_listening_srs_state_user_question_mode ON listening_srs_state(user_id, question_id, mode);
CREATE INDEX idx_listening_srs_state_next_review_on ON listening_srs_state(next_review_on);

ALTER TABLE listening_srs_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own listening srs state" ON listening_srs_state
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own listening srs state" ON listening_srs_state
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own listening srs state" ON listening_srs_state
  FOR UPDATE USING (auth.uid() = user_id);
