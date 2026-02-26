-- Lexicon基盤: lexicon_items と lexicon_logs テーブル作成

-- 1. lexicon_items（語彙・熟語・定型表現のマスタ）
CREATE TABLE lexicon_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill TEXT NOT NULL CHECK (skill IN ('writing', 'speaking')),
  category TEXT NOT NULL,
  expression TEXT NOT NULL,
  normalized TEXT NOT NULL,
  typing_enabled BOOLEAN NOT NULL DEFAULT true,
  source TEXT NOT NULL DEFAULT 'ws_note_v1',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(normalized, skill, category)
);

CREATE INDEX idx_lexicon_items_skill ON lexicon_items(skill);
CREATE INDEX idx_lexicon_items_category ON lexicon_items(category);
CREATE INDEX idx_lexicon_items_skill_category ON lexicon_items(skill, category);
CREATE INDEX idx_lexicon_items_typing_enabled ON lexicon_items(typing_enabled);

-- 2. lexicon_logs（学習ログ）
CREATE TABLE lexicon_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  item_id UUID NOT NULL REFERENCES lexicon_items(id) ON DELETE CASCADE,
  mode TEXT NOT NULL CHECK (mode IN ('click', 'typing')),
  is_correct BOOLEAN NOT NULL,
  user_answer TEXT,
  time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_lexicon_logs_user_id ON lexicon_logs(user_id);
CREATE INDEX idx_lexicon_logs_item_id ON lexicon_logs(item_id);
CREATE INDEX idx_lexicon_logs_user_item ON lexicon_logs(user_id, item_id);
CREATE INDEX idx_lexicon_logs_created_at ON lexicon_logs(created_at);

-- 3. RLS (Row Level Security)
ALTER TABLE lexicon_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lexicon_logs ENABLE ROW LEVEL SECURITY;

-- lexicon_items: 全員閲覧可能
CREATE POLICY "Anyone can view lexicon items" ON lexicon_items
  FOR SELECT USING (true);

-- lexicon_logs: 本人のみ閲覧・挿入可能
CREATE POLICY "Users can view own lexicon logs" ON lexicon_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lexicon logs" ON lexicon_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);
