-- Lexicon Listening support: skill=listening for lexicon_questions (Listening Vocab)

ALTER TABLE lexicon_items DROP CONSTRAINT IF EXISTS lexicon_items_skill_check;
ALTER TABLE lexicon_items ADD CONSTRAINT lexicon_items_skill_check
  CHECK (skill IN ('writing', 'speaking', 'reading', 'listening'));

ALTER TABLE lexicon_questions DROP CONSTRAINT IF EXISTS lexicon_questions_skill_check;
ALTER TABLE lexicon_questions ADD CONSTRAINT lexicon_questions_skill_check
  CHECK (skill IN ('writing', 'speaking', 'reading', 'listening'));
