-- Lexicon問題バンク: lexicon_questions テーブル作成

-- lexicon_questions（問題バンク）
CREATE TABLE lexicon_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill TEXT NOT NULL CHECK (skill IN ('writing', 'speaking')),
  category TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('click', 'typing')),
  prompt TEXT NOT NULL,
  correct_expression TEXT NOT NULL,
  choices JSONB, -- clickのみ。4択を格納
  hint_first_char TEXT, -- typingのみ
  hint_length INTEGER, -- typingのみ。スペース除外
  item_id UUID REFERENCES lexicon_items(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lexicon_questions_skill ON lexicon_questions(skill);
CREATE INDEX idx_lexicon_questions_category ON lexicon_questions(category);
CREATE INDEX idx_lexicon_questions_mode ON lexicon_questions(mode);
CREATE INDEX idx_lexicon_questions_skill_category_mode ON lexicon_questions(skill, category, mode);
CREATE INDEX idx_lexicon_questions_item_id ON lexicon_questions(item_id);

-- RLS (Row Level Security)
ALTER TABLE lexicon_questions ENABLE ROW LEVEL SECURITY;

-- lexicon_questions: 全員閲覧可能（学習用コンテンツ）
CREATE POLICY "Anyone can view lexicon questions" ON lexicon_questions
  FOR SELECT USING (true);
