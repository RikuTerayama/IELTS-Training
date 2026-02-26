-- Lexicon module対応: lexicon_* をInput共通として使うため、module列を追加

-- 1. lexicon_items に module 列を追加
ALTER TABLE lexicon_items
  ADD COLUMN module TEXT NOT NULL DEFAULT 'lexicon';

CREATE INDEX idx_lexicon_items_module_skill_category ON lexicon_items(module, skill, category);
CREATE INDEX idx_lexicon_items_module_skill ON lexicon_items(module, skill);

-- 2. lexicon_questions に module 列を追加
ALTER TABLE lexicon_questions
  ADD COLUMN module TEXT NOT NULL DEFAULT 'lexicon';

CREATE INDEX idx_lexicon_questions_module_skill_category_mode ON lexicon_questions(module, skill, category, mode);
CREATE INDEX idx_lexicon_questions_module_skill ON lexicon_questions(module, skill);

-- 3. lexicon_logs に module 列を追加
ALTER TABLE lexicon_logs
  ADD COLUMN module TEXT NOT NULL DEFAULT 'lexicon';

CREATE INDEX idx_lexicon_logs_module_user_id ON lexicon_logs(module, user_id);
CREATE INDEX idx_lexicon_logs_module_item_id ON lexicon_logs(module, item_id);

-- 4. lexicon_srs_state に module 列を追加
ALTER TABLE lexicon_srs_state
  ADD COLUMN module TEXT NOT NULL DEFAULT 'lexicon';

CREATE INDEX idx_lexicon_srs_state_module_user_mode_next ON lexicon_srs_state(module, user_id, mode, next_review_on);
CREATE INDEX idx_lexicon_srs_state_module_user_item_mode ON lexicon_srs_state(module, user_id, item_id, mode);
