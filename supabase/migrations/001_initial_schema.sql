-- IELTS Training MVP データベーススキーマ
-- 05_DBテーブル設計_最小構成.md に準拠

-- ==================== テーブル作成 ====================

-- 1. profiles（ユーザープロファイル）
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  initial_level TEXT NOT NULL CHECK (initial_level IN ('beginner', 'intermediate', 'advanced')),
  current_level TEXT CHECK (current_level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_profiles_email ON profiles(email);

-- 2. tasks（タスク・お題）
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  question TEXT NOT NULL,
  question_type TEXT DEFAULT 'Task 2',
  required_vocab JSONB,
  prep_guide JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_cached BOOLEAN DEFAULT FALSE,
  cache_key TEXT
);

CREATE INDEX idx_tasks_level ON tasks(level);
CREATE INDEX idx_tasks_cache_key ON tasks(cache_key);

-- 3. attempts（ユーザーの回答）
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  draft_content JSONB,
  submitted_at TIMESTAMPTZ,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'rewritten')),
  rewrite_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_attempts_user_id ON attempts(user_id);
CREATE INDEX idx_attempts_task_id ON attempts(task_id);
CREATE INDEX idx_attempts_submitted_at ON attempts(submitted_at);

-- 4. feedbacks（フィードバック）
CREATE TABLE feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  overall_band_range TEXT NOT NULL,
  dimensions JSONB NOT NULL,
  strengths JSONB NOT NULL,
  band_up_actions JSONB NOT NULL,
  rewrite_targets JSONB NOT NULL,
  vocab_suggestions JSONB NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  parent_feedback_id UUID REFERENCES feedbacks(id),
  is_rewrite BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_feedbacks_attempt_id ON feedbacks(attempt_id);
CREATE INDEX idx_feedbacks_parent_id ON feedbacks(parent_feedback_id);

-- 5. revisions（書き直し履歴）
CREATE TABLE revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id UUID NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
  feedback_id UUID NOT NULL REFERENCES feedbacks(id) ON DELETE CASCADE,
  revised_content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_revisions_attempt_id ON revisions(attempt_id);
CREATE INDEX idx_revisions_feedback_id ON revisions(feedback_id);

-- 6. vocab_items（語彙マスタ）
CREATE TABLE vocab_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  meaning TEXT NOT NULL,
  skill_tags TEXT[] NOT NULL,
  example_sentence TEXT,
  collocations JSONB,
  level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(word)
);

CREATE INDEX idx_vocab_items_word ON vocab_items(word);
CREATE INDEX idx_vocab_items_level ON vocab_items(level);

-- 7. vocab_logs（語彙学習ログ）
CREATE TABLE vocab_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  vocab_id UUID NOT NULL REFERENCES vocab_items(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  questions JSONB NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_vocab_logs_user_id ON vocab_logs(user_id);
CREATE INDEX idx_vocab_logs_session_date ON vocab_logs(session_date);

-- 8. daily_state（今日の状態）
CREATE TABLE daily_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  recommended_task_id UUID REFERENCES tasks(id),
  required_vocab JSONB,
  weakness_tags TEXT[],
  latest_band_estimate TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_daily_state_user_date ON daily_state(user_id, date);

-- ==================== RLS (Row Level Security) ====================

-- 全テーブルでRLSを有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_state ENABLE ROW LEVEL SECURITY;

-- profiles: 自分のみ
CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

-- tasks: 全員閲覧可能（生成済みタスク）
CREATE POLICY "Anyone can view tasks" ON tasks
  FOR SELECT USING (true);

-- attempts: 自分のみ
CREATE POLICY "Users can manage own attempts" ON attempts
  FOR ALL USING (auth.uid() = user_id);

-- feedbacks: 自分のattemptに関連するもののみ
CREATE POLICY "Users can view own feedbacks" ON feedbacks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM attempts
      WHERE attempts.id = feedbacks.attempt_id
      AND attempts.user_id = auth.uid()
    )
  );

-- revisions: 自分のattemptに関連するもののみ
CREATE POLICY "Users can manage own revisions" ON revisions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM attempts
      WHERE attempts.id = revisions.attempt_id
      AND attempts.user_id = auth.uid()
    )
  );

-- vocab_items: 全員閲覧可能
CREATE POLICY "Anyone can view vocab items" ON vocab_items
  FOR SELECT USING (true);

-- vocab_logs: 自分のみ
CREATE POLICY "Users can manage own vocab logs" ON vocab_logs
  FOR ALL USING (auth.uid() = user_id);

-- daily_state: 自分のみ
CREATE POLICY "Users can manage own daily state" ON daily_state
  FOR ALL USING (auth.uid() = user_id);

