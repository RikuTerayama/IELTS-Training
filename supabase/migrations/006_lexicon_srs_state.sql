-- Lexicon SRS状態テーブル: 忘却曲線ベースの学習状態管理

-- lexicon_srs_state（SRS状態）
CREATE TABLE lexicon_srs_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES lexicon_items(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('click', 'typing')),
  stage INTEGER NOT NULL DEFAULT 0,
  next_review_on DATE NOT NULL,
  last_review_on DATE,
  correct_streak INTEGER NOT NULL DEFAULT 0,
  total_correct INTEGER NOT NULL DEFAULT 0,
  total_wrong INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, item_id, mode)
);

CREATE INDEX idx_lexicon_srs_state_user_mode_next ON lexicon_srs_state(user_id, mode, next_review_on);
CREATE INDEX idx_lexicon_srs_state_user_item_mode ON lexicon_srs_state(user_id, item_id, mode);
CREATE INDEX idx_lexicon_srs_state_next_review_on ON lexicon_srs_state(next_review_on);

-- RLS (Row Level Security)
ALTER TABLE lexicon_srs_state ENABLE ROW LEVEL SECURITY;

-- lexicon_srs_state: 本人のみ閲覧・挿入・更新可能
CREATE POLICY "Users can view own srs state" ON lexicon_srs_state
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own srs state" ON lexicon_srs_state
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own srs state" ON lexicon_srs_state
  FOR UPDATE USING (auth.uid() = user_id);
