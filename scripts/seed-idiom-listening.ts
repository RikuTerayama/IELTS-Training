/**
 * Listening Idiom v1 Seed
 * Inserts into lexicon_questions only (no lexicon_items; listening uses question_id + listening_srs_state)
 */

import { createClient } from '@supabase/supabase-js';
import { LISTENING_IDIOM_SEED, validateListeningIdiomSeed } from '../data/idiom/listening';

const validation = validateListeningIdiomSeed(LISTENING_IDIOM_SEED);
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

async function seedListeningIdiom() {
  console.log('Starting Listening Idiom seed...');
  console.log(`Total questions: ${LISTENING_IDIOM_SEED.length} (validation passed)`);

  const rows = LISTENING_IDIOM_SEED.map((q) => ({
    skill: 'listening' as const,
    category: q.category,
    mode: q.mode,
    module: 'idiom' as const,
    question_type: null,
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
    .eq('module', 'idiom');

  const { error } = await supabase.from('lexicon_questions').insert(rows);

  if (error) {
    console.error('Error inserting listening idiom questions:', error.message);
    process.exit(1);
  }

  console.log('Listening Idiom seed completed.');
  const { count } = await supabase
    .from('lexicon_questions')
    .select('*', { count: 'exact', head: true })
    .eq('skill', 'listening')
    .eq('module', 'idiom');
  console.log(`Total listening idiom questions in DB: ${count}`);
}

seedListeningIdiom();
