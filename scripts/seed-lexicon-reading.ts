/**
 * Reading Lexicon (Academic Reading Signal Bank) Seed
 * Inserts into lexicon_questions with skill=reading, module=lexicon
 */

import { createClient } from '@supabase/supabase-js';
import {
  READING_LEXICON_SEED,
  validateReadingLexiconSeed,
} from '../data/lexicon/reading';

const validation = validateReadingLexiconSeed(READING_LEXICON_SEED);
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

async function seedReadingLexicon() {
  console.log('Starting Reading Lexicon seed...');
  console.log(`Total questions: ${READING_LEXICON_SEED.length} (validation passed)`);

  const questions = READING_LEXICON_SEED.map((q) => ({
    skill: 'reading' as const,
    category: q.category,
    mode: q.mode,
    module: 'lexicon' as const,
    question_type: 'signal' as const,
    prompt: q.prompt,
    correct_expression: q.correct_expression,
    choices: q.choices ?? null,
    hint_first_char: q.hint_first_char ?? null,
    hint_length: q.hint_length ?? null,
    passage_excerpt: q.passage_excerpt ?? null,
    strategy: q.strategy ?? null,
    meta: q.meta ?? null,
    item_id: null,
  }));

  await supabase
    .from('lexicon_questions')
    .delete()
    .eq('skill', 'reading')
    .eq('module', 'lexicon');

  const { error } = await supabase.from('lexicon_questions').insert(questions);

  if (error) {
    console.error('Error inserting reading lexicon questions:', error.message);
    process.exit(1);
  }

  console.log('Reading Lexicon seed completed.');
  const { count } = await supabase
    .from('lexicon_questions')
    .select('*', { count: 'exact', head: true })
    .eq('skill', 'reading')
    .eq('module', 'lexicon');
  console.log(`Total reading lexicon questions in DB: ${count}`);
}

seedReadingLexicon();
