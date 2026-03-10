/**
 * Reading Academic v1 Seed
 * Inserts into lexicon_questions only (no lexicon_items for reading)
 */

import { createClient } from '@supabase/supabase-js';
import { READING_ACADEMIC_SEED, validateReadingSeed } from '../data/vocab/readingAcademic';

// Validate first (no DB required)
const validation = validateReadingSeed(READING_ACADEMIC_SEED);
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

async function seedReading() {
  console.log('Starting Reading Academic seed...');
  console.log(`Total questions: ${READING_ACADEMIC_SEED.length} (validation passed)`);

  const questions = READING_ACADEMIC_SEED.map((q) => ({
    skill: 'reading' as const,
    category: q.category,
    mode: q.mode,
    module: 'vocab' as const,
    question_type: q.question_type,
    prompt: q.prompt,
    correct_expression: q.correct_expression,
    choices: q.choices ?? null,
    hint_first_char: q.hint_first_char ?? null,
    hint_length: q.hint_length ?? null,
    passage_excerpt: q.passage_excerpt,
    strategy: q.strategy ?? null,
    meta: q.meta ?? null,
    item_id: null,
  }));

  // Delete existing reading vocab questions for idempotent re-seed
  await supabase
    .from('lexicon_questions')
    .delete()
    .eq('skill', 'reading')
    .eq('module', 'vocab');

  const { error } = await supabase.from('lexicon_questions').insert(questions);

  if (error) {
    console.error('Error inserting reading questions:', error.message);
    process.exit(1);
  }

  console.log('Reading Academic seed completed.');
  const { count } = await supabase
    .from('lexicon_questions')
    .select('*', { count: 'exact', head: true })
    .eq('skill', 'reading')
    .eq('module', 'vocab');
  console.log(`Total reading questions in DB: ${count}`);
}

seedReading();
