/**
 * Lexiconシードスクリプト
 * data/note/ws_note.md を読み込み → parse → normalize → lexicon_items に upsert
 * 続けて lexicon_items から lexicon_questions（click / typing）を生成
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseNote } from '../lib/lexicon/noteParser';
import { normalizeExpression, getHintFirstChar, calculateHintLength } from '../lib/lexicon/normalize';

const MODULE_NAME = 'lexicon';

// 環境変数からSupabase接続情報を取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

// Service Role Keyを使用してSupabaseクライアントを作成
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function seedLexicon() {
  try {
    console.log('Reading ws_note.md...');
    
    // data/note/ws_note.md を読み込み
    const notePath = join(process.cwd(), 'data', 'note', 'ws_note.md');
    const noteContent = readFileSync(notePath, 'utf-8');
    
    console.log('Parsing note content...');
    
    // パース
    const parsedItems = parseNote(noteContent);
    console.log(`Parsed ${parsedItems.length} items`);
    
    // 正規化してupsert
    console.log('Normalizing and upserting to database...');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const item of parsedItems) {
      const normalized = normalizeExpression(item.expression);
      
      try {
        const { error } = await supabase
          .from('lexicon_items')
          .upsert(
            {
              module: MODULE_NAME,
              skill: item.skill,
              category: item.category,
              expression: item.expression,
              normalized,
              typing_enabled: item.typing_enabled,
              source: 'ws_note_v1',
            },
            {
              onConflict: 'normalized,skill,category',
            }
          );
        
        if (error) {
          console.error(`Error upserting item "${item.expression}":`, error.message);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (err) {
        console.error(`Error processing item "${item.expression}":`, err);
        errorCount++;
      }
    }
    
    console.log('\n=== Seed Summary (items) ===');
    console.log(`Total items: ${parsedItems.length}`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);

    // Step 2: lexicon_items から lexicon_questions を生成（Writing/Speaking のみ）
    const { data: dbItems, error: selectItemsError } = await supabase
      .from('lexicon_items')
      .select('id, skill, category, expression, normalized, typing_enabled')
      .eq('module', MODULE_NAME)
      .in('skill', ['writing', 'speaking']);

    if (selectItemsError) {
      console.error('Error fetching items for questions:', selectItemsError.message);
      throw selectItemsError;
    }

    const items = dbItems || [];
    if (items.length === 0) {
      console.log('No writing/speaking items found, skipping question generation.');
    } else {
      const { data: existingQuestions } = await supabase
        .from('lexicon_questions')
        .select('item_id, mode')
        .eq('module', MODULE_NAME)
        .not('item_id', 'is', null);

      const hasClick = new Set<string>();
      const hasTyping = new Set<string>();
      for (const q of existingQuestions || []) {
        if (q.item_id) {
          if (q.mode === 'click') hasClick.add(q.item_id);
          if (q.mode === 'typing') hasTyping.add(q.item_id);
        }
      }

      const bySkillCategory: Record<string, typeof items> = {};
      for (const it of items) {
        const key = `${it.skill}:${it.category}`;
        if (!bySkillCategory[key]) bySkillCategory[key] = [];
        bySkillCategory[key].push(it);
      }

      const questionsToInsert: Array<{
        skill: string;
        category: string;
        mode: 'click' | 'typing';
        module: string;
        prompt: string;
        correct_expression: string;
        choices?: string[];
        hint_first_char?: string;
        hint_length?: number;
        item_id: string;
      }> = [];

      for (const item of items) {
        const key = `${item.skill}:${item.category}`;
        const pool = bySkillCategory[key] || [];
        const others = pool.filter((o) => o.id !== item.id).map((o) => o.expression);

        if (!hasClick.has(item.id)) {
          const wrongs = others.slice(0, 3);
          const choices = [item.expression, ...wrongs];
          for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
          }
          questionsToInsert.push({
            skill: item.skill,
            category: item.category,
            mode: 'click',
            module: MODULE_NAME,
            prompt: '正しい表現を選んでください',
            correct_expression: item.expression,
            choices,
            item_id: item.id,
          });
        }

        if (item.typing_enabled && !hasTyping.has(item.id)) {
          questionsToInsert.push({
            skill: item.skill,
            category: item.category,
            mode: 'typing',
            module: MODULE_NAME,
            prompt: '表現を英語で入力してください',
            correct_expression: item.expression,
            hint_first_char: getHintFirstChar(item.normalized),
            hint_length: calculateHintLength(item.normalized),
            item_id: item.id,
          });
        }
      }

      if (questionsToInsert.length > 0) {
        const { error: questionsError } = await supabase
          .from('lexicon_questions')
          .insert(questionsToInsert);
        if (questionsError) {
          console.error('Error inserting lexicon_questions:', questionsError.message);
        } else {
          console.log(`\n=== Questions ===`);
          console.log(`Inserted ${questionsToInsert.length} questions (click + typing) for writing/speaking items.`);
        }
      }
    }

    if (errorCount === 0) {
      console.log('\n✅ Seed completed successfully!');
    } else {
      console.log(`\n⚠️ Seed completed with ${errorCount} errors`);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// 実行
seedLexicon();
