/**
 * Listening Lexicon v1 Seed
 * Inserts into lexicon_questions only (skill=listening, module=lexicon); SRS via listening_srs_state
 */

import { createClient } from '@supabase/supabase-js';
import { LISTENING_LEXICON_SEED, validateListeningLexiconSeed } from '../data/lexicon/listening';

const validation = validateListeningLexiconSeed(LISTENING_LEXICON_SEED);
if (!validation.ok) {
  console.error('Validation failed:');
  validation.errors.forEach((e) => console.error('  -', e));
  process.exit(1);
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seedListeningLexicon() {
  console.log('Starting Listening Lexicon seed...');
  console.log(`Total questions: ${LISTENING_LEXICON_SEED.length} (validation passed)`);

  const rows = LISTENING_LEXICON_SEED.map((q) => ({
    skill: 'listening' as const,
    category: q.category,
    mode: q.mode,
    module: 'lexicon' as const,
    question_type: 'signal' as const,
    prompt: q.prompt,
    correct_expression: q.correct_expression,
    choices: q.choices ?? null,
    hint_first_char: null,
    hint_length: null,
    passage_excerpt: q.passage_excerpt ?? null,
    strategy: q.strategy ?? null,
    meta: q.meta ?? null,
    item_id: null,
  }));

  await supabase
    .from('lexicon_questions')
    .delete()
    .eq('skill', 'listening')
    .eq('module', 'lexicon');

  const { error } = await supabase.from('lexicon_questions').insert(rows);

  if (error) {
    console.error('Error inserting listening lexicon questions:', error.message);
    process.exit(1);
  }

  console.log('Listening Lexicon seed completed.');
  const { count } = await supabase
    .from('lexicon_questions')
    .select('*', { count: 'exact', head: true })
    .eq('skill', 'listening')
    .eq('module', 'lexicon');
  console.log(`Total listening lexicon questions in DB: ${count}`);
}

seedListeningLexicon();
