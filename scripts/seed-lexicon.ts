/**
 * Lexiconシードスクリプト
 * data/note/ws_note.md を読み込み → parse → normalize → supabase に upsert
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { parseNote } from '../lib/lexicon/noteParser';
import { normalizeExpression } from '../lib/lexicon/normalize';

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
    
    console.log('\n=== Seed Summary ===');
    console.log(`Total items: ${parsedItems.length}`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    
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
