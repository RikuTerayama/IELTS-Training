-- Lexicon Reading support: skill=reading, question_type, passage_excerpt, lexicon_logs.question_id

-- 1. lexicon_items: skill に reading を追加
ALTER TABLE lexicon_items DROP CONSTRAINT IF EXISTS lexicon_items_skill_check;
ALTER TABLE lexicon_items ADD CONSTRAINT lexicon_items_skill_check
  CHECK (skill IN ('writing', 'speaking', 'reading'));

-- 2. lexicon_questions: skill に reading を追加、question_type/strategy/passage_excerpt/meta を追加
ALTER TABLE lexicon_questions DROP CONSTRAINT IF EXISTS lexicon_questions_skill_check;
ALTER TABLE lexicon_questions ADD CONSTRAINT lexicon_questions_skill_check
  CHECK (skill IN ('writing', 'speaking', 'reading'));

ALTER TABLE lexicon_questions ADD COLUMN IF NOT EXISTS question_type TEXT;
ALTER TABLE lexicon_questions ADD COLUMN IF NOT EXISTS strategy TEXT;
ALTER TABLE lexicon_questions ADD COLUMN IF NOT EXISTS passage_excerpt TEXT;
ALTER TABLE lexicon_questions ADD COLUMN IF NOT EXISTS meta JSONB;

CREATE INDEX IF NOT EXISTS idx_lexicon_questions_question_type
  ON lexicon_questions(question_type) WHERE question_type IS NOT NULL;

-- 3. lexicon_logs: question_id を追加、item_id を NULL 許可（reading は item なしでログ可能に）
ALTER TABLE lexicon_logs ADD COLUMN IF NOT EXISTS question_id UUID REFERENCES lexicon_questions(id) ON DELETE SET NULL;
ALTER TABLE lexicon_logs ALTER COLUMN item_id DROP NOT NULL;
-- item_id または question_id のいずれか必須（既存は item_id ありなので互換）
ALTER TABLE lexicon_logs ADD CONSTRAINT lexicon_logs_item_or_question_check
  CHECK (item_id IS NOT NULL OR question_id IS NOT NULL);

CREATE INDEX IF NOT EXISTS idx_lexicon_logs_question_id
  ON lexicon_logs(question_id) WHERE question_id IS NOT NULL;
