/**
 * Reading Idiom v1 Seed
 * Inserts into lexicon_questions only (skill=reading, module=idiom). SRS via reading_srs_state.
 */

import { createClient } from '@supabase/supabase-js';
import { READING_IDIOM_SEED, validateReadingIdiomSeed } from '../data/idiom/reading';

const validation = validateReadingIdiomSeed(READING_IDIOM_SEED);
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

async function seedReadingIdiom() {
  console.log('Starting Reading Idiom seed...');
  console.log(`Total questions: ${READING_IDIOM_SEED.length} (validation passed)`);

  const questions = READING_IDIOM_SEED.map((q) => ({
    skill: 'reading' as const,
    category: q.category,
    mode: q.mode,
    module: 'idiom' as const,
    question_type: null,
    prompt: q.prompt,
    correct_expression: q.correct_expression,
    choices: q.choices,
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
    .eq('skill', 'reading')
    .eq('module', 'idiom');

  const { error } = await supabase.from('lexicon_questions').insert(questions);

  if (error) {
    console.error('Error inserting reading idiom questions:', error.message);
    process.exit(1);
  }

  console.log('Reading Idiom seed completed.');
  const { count } = await supabase
    .from('lexicon_questions')
    .select('*', { count: 'exact', head: true })
    .eq('skill', 'reading')
    .eq('module', 'idiom');
  console.log(`Total reading idiom questions in DB: ${count}`);
}

seedReadingIdiom();
