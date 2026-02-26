/**
 * Vocabシードスクリプト
 * data/vocab/master.ts から表現登録＋問題生成
 */

import { createClient } from '@supabase/supabase-js';
import { VOCAB_MASTER } from '../data/vocab/master';
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
 * 誤答を生成（同module同skill同categoryから優先、足りなければ同module同skill全体から）
 */
async function generateWrongAnswers(
  module: string,
  skill: string,
  category: string,
  correctExpression: string,
  allItems: Array<{ expression: string; category: string }>,
  count: number
): Promise<string[]> {
  // 同module同skill同categoryから取得
  const sameCategoryItems = allItems.filter(
    item => item.category === category && item.expression !== correctExpression
  );

  let wrongAnswers = sameCategoryItems
    .map(item => item.expression)
    .slice(0, count);

  // 足りなければ同module同skill全体から取得
  if (wrongAnswers.length < count) {
    const sameSkillItems = allItems.filter(
      item => item.category !== category && item.expression !== correctExpression
    );
    wrongAnswers.push(...sameSkillItems.map(item => item.expression).slice(0, count - wrongAnswers.length));
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
  item: typeof VOCAB_MASTER[0],
  allItems: Array<{ expression: string; category: string }>
): Promise<void> {
  const normalized = normalizeExpression(item.expression);
  const questions: any[] = [];

  // 1. Click問題（全アイテム対象、最低1問/表現）
  const clickPrompt = `${item.ja_hint}（${getCategoryUsage(item.category)}）`;
  
  // 誤答を生成（既に登録済みのitemsから）
  const wrongAnswers = await generateWrongAnswers(
    'vocab',
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
      module: 'vocab',
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
      module: 'vocab',
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
        'vocab',
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
          module: 'vocab',
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
          module: 'vocab',
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
  if (category.includes('task1')) return 'Task1単語';
  if (category.includes('task2')) return 'Task2単語';
  if (category.includes('speaking')) return 'Speaking単語';
  if (category.includes('general')) return '汎用単語';
  return '単語';
}

async function seedVocab() {
  try {
    console.log('Starting Vocab seed...');
    console.log(`Total items in master: ${VOCAB_MASTER.length}`);

    let itemsSuccessCount = 0;
    let itemsErrorCount = 0;
    let questionsCount = 0;

    // 1. 表現を登録（lexicon_items）
    console.log('\n=== Step 1: Registering expressions ===');
    
    const registeredItems: Array<{ id: string; expression: string; category: string }> = [];
    
    for (const item of VOCAB_MASTER) {
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
              module: 'vocab',
              source: 'master_v1',
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
                  module: 'vocab',
                  source: 'master_v1',
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

    for (const item of VOCAB_MASTER) {
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

    console.log('\n=== Seed Summary ===');
    console.log(`Items - Success: ${itemsSuccessCount}, Errors: ${itemsErrorCount}`);
    console.log(`Questions generated: ${questionsCount}`);

    // 問題数の確認
    const { data: questionStats } = await supabase
      .from('lexicon_questions')
      .select('id', { count: 'exact' })
      .eq('module', 'vocab');

    console.log(`Total vocab questions in database: ${questionStats?.length || 0}`);

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
seedVocab();
