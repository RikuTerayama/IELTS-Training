/**
 * Task1生成サンプル用スクリプト
 * ローカルで3つのサンプルを生成して確認用
 * 
 * 使い方:
 * npx tsx scripts/generate-task1-samples.ts
 */

import { selectAssetByWeight, type Task1Asset, type Task1Genre } from '../lib/task1/assets';
import { buildTask1QuestionFromAsset, generateTask1VocabOnly } from '../lib/llm/prompts/task_generate';

async function generateSample(level: 'beginner' | 'intermediate' | 'advanced', genre?: string) {
  console.log(`\n=== Sample: ${level}${genre ? ` (${genre})` : ''} ===\n`);
  
  // アセット選択
  const asset = selectAssetByWeight(level, (genre as Task1Genre) || undefined);
  if (!asset) {
    console.error('No asset found');
    return;
  }
  
  console.log('Asset:', {
    id: asset.id,
    level: asset.level,
    genre: asset.genre,
    image_path: asset.image_path,
    title: asset.title,
    time_period: asset.time_period,
    unit: asset.unit,
    categories: asset.categories,
  });
  
  // 質問文生成
  const question = buildTask1QuestionFromAsset(asset);
  console.log('\nQuestion:', question);
  
  // 語彙とprep_guide生成（実際にはLLMを呼ぶが、ここではスキップ）
  // const { required_vocab, prep_guide } = await generateTask1VocabOnly(level, asset);
  // console.log('\nRequired Vocab:', required_vocab);
  // console.log('\nPrep Guide:', prep_guide);
  
  console.log('\n---');
}

async function main() {
  console.log('Task1 Sample Generation\n');
  
  // サンプル1: beginner, line_chart
  await generateSample('beginner', 'line_chart');
  
  // サンプル2: intermediate, bar_chart
  await generateSample('intermediate', 'bar_chart');
  
  // サンプル3: advanced, pie_chart
  await generateSample('advanced', 'pie_chart');
  
  console.log('\nDone!');
}

// 実行
main().catch(console.error);

