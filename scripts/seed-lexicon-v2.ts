/**
 * Lexiconシードスクリプト v2
 * data/lexicon/master.ts から表現登録＋問題生成
 */

import { createClient } from '@supabase/supabase-js';
import { LEXICON_MASTER } from '../data/lexicon/master';
import { normalizeExpression, getHintFirstChar, calculateHintLength } from '../lib/lexicon/normalize';

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

/**
 * 誤答を生成（同skill同categoryから優先、足りなければ同skill全体から）
 */
async function generateWrongAnswers(
  skill: string,
  category: string,
  correctExpression: string,
  count: number
): Promise<string[]> {
  // 同skill同categoryから取得
  const { data: sameCategoryItems } = await supabase
    .from('lexicon_items')
    .select('expression')
    .eq('skill', skill)
    .eq('category', category)
    .neq('expression', correctExpression)
    .limit(count);

  const wrongAnswers: string[] = (sameCategoryItems || [])
    .map(item => item.expression)
    .filter(expr => expr !== correctExpression);

  // 足りなければ同skill全体から取得
  if (wrongAnswers.length < count) {
    const { data: sameSkillItems } = await supabase
      .from('lexicon_items')
      .select('expression')
      .eq('skill', skill)
      .neq('category', category)
      .neq('expression', correctExpression)
      .limit(count - wrongAnswers.length);

    if (sameSkillItems) {
      wrongAnswers.push(...sameSkillItems.map(item => item.expression));
    }
  }

  // シャッフル
  for (let i = wrongAnswers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [wrongAnswers[i], wrongAnswers[j]] = [wrongAnswers[j], wrongAnswers[i]];
  }

  return wrongAnswers.slice(0, count);
}

/**
 * 問題を生成
 */
async function generateQuestions(
  itemId: string,
  item: typeof LEXICON_MASTER[0],
  allItems: Array<{ expression: string; category: string }>
): Promise<void> {
  const normalized = normalizeExpression(item.expression);
  const questions: any[] = [];

  // 1. Click問題（全アイテム対象、最低1問/表現）
  const clickPrompt = `${item.ja_hint}（${getCategoryUsage(item.category)}）`;
  
  // 誤答を生成（既に登録済みのitemsから）
  const wrongAnswers = await generateWrongAnswers(
    item.skill,
    item.category,
    item.expression,
    allItems.filter(i => i.category === item.category || i.category.startsWith(item.category.split('_')[0])),
    3
  );
  
  if (wrongAnswers.length >= 3) {
    const choices = [item.expression, ...wrongAnswers.slice(0, 3)];
    // シャッフル
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }

    questions.push({
      skill: item.skill,
      category: item.category,
      mode: 'click',
      prompt: clickPrompt,
      correct_expression: item.expression,
      choices,
      item_id: itemId,
    });
  }

  // 2. Typing問題（typing_enabled=true のみ）
  if (item.typing_enabled) {
    const typingPrompt = `${item.ja_hint}を英語で入力してください`;
    const hintFirstChar = getHintFirstChar(normalized);
    const hintLength = calculateHintLength(normalized);

    questions.push({
      skill: item.skill,
      category: item.category,
      mode: 'typing',
      prompt: typingPrompt,
      correct_expression: item.expression,
      hint_first_char: hintFirstChar,
      hint_length: hintLength,
      item_id: itemId,
    });
  }

  // バリエーションがある場合も問題を生成
  if (item.variants && item.variants.length > 0) {
    for (const variant of item.variants) {
      const variantNormalized = normalizeExpression(variant);
      
      // Click問題
      const variantClickPrompt = `${item.ja_hint}（${getCategoryUsage(item.category)}）`;
      const variantWrongAnswers = await generateWrongAnswers(
        item.skill,
        item.category,
        variant,
        allItems,
        3
      );
      
      if (variantWrongAnswers.length >= 3) {
        const variantChoices = [variant, ...variantWrongAnswers.slice(0, 3)];
        for (let i = variantChoices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [variantChoices[i], variantChoices[j]] = [variantChoices[j], variantChoices[i]];
        }

        questions.push({
          skill: item.skill,
          category: item.category,
          mode: 'click',
          prompt: variantClickPrompt,
          correct_expression: variant,
          choices: variantChoices,
          item_id: itemId,
        });
      }

      // Typing問題（typing_enabled=true の場合）
      if (item.typing_enabled) {
        const variantTypingPrompt = `${item.ja_hint}を英語で入力してください`;
        const variantHintFirstChar = getHintFirstChar(variantNormalized);
        const variantHintLength = calculateHintLength(variantNormalized);

        questions.push({
          skill: item.skill,
          category: item.category,
          mode: 'typing',
          prompt: variantTypingPrompt,
          correct_expression: variant,
          hint_first_char: variantHintFirstChar,
          hint_length: variantHintLength,
          item_id: itemId,
        });
      }
    }
  }

  // 問題を一括挿入
  if (questions.length > 0) {
    const { error } = await supabase
      .from('lexicon_questions')
      .upsert(questions, {
        onConflict: 'id',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error(`Error inserting questions for "${item.expression}":`, error.message);
    }
  }
}

/**
 * categoryの用途を取得（プロンプト用）
 */
function getCategoryUsage(category: string): string {
  if (category.includes('graph')) return 'Task1グラフの動詞';
  if (category.includes('diagram')) return 'Task1ダイアグラム';
  if (category.includes('process')) return 'Task1プロセス';
  if (category.includes('phrases') && category.includes('task1')) return 'Task1定型表現';
  if (category.includes('phrases') && category.includes('task2')) return 'Task2定型表現';
  if (category.includes('cohesion')) return '接続詞';
  if (category.includes('fluency')) return '流暢さ';
  if (category.includes('chunks')) return 'チャンク';
  return '表現';
}

async function seedLexiconV2() {
  try {
    console.log('Starting Lexicon v2 seed...');
    console.log(`Total items in master: ${LEXICON_MASTER.length}`);

    let itemsSuccessCount = 0;
    let itemsErrorCount = 0;
    let questionsCount = 0;

    // 1. 表現を登録（lexicon_items）
    console.log('\n=== Step 1: Registering expressions ===');
    
    const registeredItems: Array<{ id: string; expression: string; category: string }> = [];
    
    for (const item of LEXICON_MASTER) {
      const normalized = normalizeExpression(item.expression);

      try {
        const { data: insertedItem, error } = await supabase
          .from('lexicon_items')
          .upsert(
            {
              skill: item.skill,
              category: item.category,
              expression: item.expression,
              normalized,
              typing_enabled: item.typing_enabled,
              source: 'master_v2',
            },
            {
              onConflict: 'normalized,skill,category',
            }
          )
          .select()
          .single();

        if (error) {
          console.error(`Error upserting item "${item.expression}":`, error.message);
          itemsErrorCount++;
          continue;
        }

        itemsSuccessCount++;
        if (insertedItem) {
          registeredItems.push({
            id: insertedItem.id,
            expression: item.expression,
            category: item.category,
          });
        }

        // バリエーションも登録
        if (item.variants && item.variants.length > 0) {
          for (const variant of item.variants) {
            const variantNormalized = normalizeExpression(variant);
            
            const { data: variantItem, error: variantError } = await supabase
              .from('lexicon_items')
              .upsert(
                {
                  skill: item.skill,
                  category: item.category,
                  expression: variant,
                  normalized: variantNormalized,
                  typing_enabled: item.typing_enabled,
                  source: 'master_v2',
                },
                {
                  onConflict: 'normalized,skill,category',
                }
              )
              .select()
              .single();

            if (!variantError && variantItem) {
              registeredItems.push({
                id: variantItem.id,
                expression: variant,
                category: item.category,
              });
            }
          }
        }
      } catch (err) {
        console.error(`Error processing item "${item.expression}":`, err);
        itemsErrorCount++;
      }
    }

    // 2. 問題を生成（lexicon_questions）- 全items登録後に実行
    console.log('\n=== Step 2: Generating questions ===');
    
    const allItemsForWrongAnswers = registeredItems.map(i => ({
      expression: i.expression,
      category: i.category,
    }));

    for (const item of LEXICON_MASTER) {
      const registeredItem = registeredItems.find(
        ri => ri.expression === item.expression && ri.category === item.category
      );
      
      if (registeredItem) {
        await generateQuestions(registeredItem.id, item, allItemsForWrongAnswers);
        questionsCount++;
      }

      // バリエーションも問題生成
      if (item.variants && item.variants.length > 0) {
        for (const variant of item.variants) {
          const variantRegisteredItem = registeredItems.find(
            ri => ri.expression === variant && ri.category === item.category
          );
          
          if (variantRegisteredItem) {
            await generateQuestions(
              variantRegisteredItem.id,
              { ...item, expression: variant },
              allItemsForWrongAnswers
            );
            questionsCount++;
          }
        }
      }
    }
      } catch (err) {
        console.error(`Error processing item "${item.expression}":`, err);
        itemsErrorCount++;
      }
    }

    console.log('\n=== Seed Summary ===');
    console.log(`Items - Success: ${itemsSuccessCount}, Errors: ${itemsErrorCount}`);
    console.log(`Questions generated: ${questionsCount}`);

    // 問題数の確認
    const { data: questionStats } = await supabase
      .from('lexicon_questions')
      .select('id', { count: 'exact' });

    console.log(`Total questions in database: ${questionStats?.length || 0}`);

    if (itemsErrorCount === 0) {
      console.log('\n✅ Seed completed successfully!');
    } else {
      console.log(`\n⚠️ Seed completed with ${itemsErrorCount} errors`);
    }
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// 実行
seedLexiconV2();
