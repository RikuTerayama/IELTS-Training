/**
 * Health-check: 公開中 Input モジュール (vocab / idiom / lexicon) の
 * 各 skill について DB にデータが存在するかを確認する。
 * 1件でも EMPTY があれば exit 1 で終了する。
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const MODULES = ['vocab', 'idiom', 'lexicon'] as const;
const SKILLS = ['reading', 'listening', 'speaking', 'writing'] as const;

async function checkModuleSkill(
  module: string,
  skill: string
): Promise<'OK' | 'EMPTY'> {
  if (skill === 'reading' || skill === 'listening') {
    const { count, error } = await supabase
      .from('lexicon_questions')
      .select('*', { count: 'exact', head: true })
      .eq('skill', skill)
      .eq('module', module);
    if (error) {
      console.error(`  Error (${module}/${skill}):`, error.message);
      return 'EMPTY';
    }
    return (count ?? 0) > 0 ? 'OK' : 'EMPTY';
  }
  // speaking / writing: sets は lexicon_items または lexicon_questions のどちらかがあれば非空
  const { count: itemsCount, error: itemsError } = await supabase
    .from('lexicon_items')
    .select('*', { count: 'exact', head: true })
    .eq('skill', skill)
    .eq('module', module);
  if (!itemsError && (itemsCount ?? 0) > 0) return 'OK';
  const { count: questionsCount, error: questionsError } = await supabase
    .from('lexicon_questions')
    .select('*', { count: 'exact', head: true })
    .eq('skill', skill)
    .eq('module', module);
  if (questionsError) {
    console.error(`  Error (${module}/${skill}):`, questionsError.message);
    return 'EMPTY';
  }
  return (questionsCount ?? 0) > 0 ? 'OK' : 'EMPTY';
}

async function main() {
  console.log('Public Input health-check (module / skill)\n');
  let hasEmpty = false;
  for (const module of MODULES) {
    console.log(`[${module}]`);
    for (const skill of SKILLS) {
      const status = await checkModuleSkill(module, skill);
      const label = status === 'OK' ? 'OK' : 'EMPTY';
      if (status === 'EMPTY') hasEmpty = true;
      console.log(`  ${skill}: ${label}`);
    }
    console.log('');
  }
  if (hasEmpty) {
    console.log('One or more module/skill has no data. Run seed:public-input (or the relevant seed) and retry.');
    process.exit(1);
  }
  console.log('All public Input module/skills have data.');
}

main();
