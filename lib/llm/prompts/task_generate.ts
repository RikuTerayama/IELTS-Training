/**
 * タスク生成プロンプト
 * 07_LLMプロンプトテンプレート.md の task_generate に準拠
 * 
 * Task1: アセット先行方式（質問文はアセットから決定、LLMは語彙とprep_guideのみ生成）
 * Task2: 従来通り（LLMが質問文も生成）
 */

import type { TaskGenerationResponse } from '@/lib/domain/types';
import type { Task1Asset } from '@/lib/task1/assets';
import { callLLM } from '../client';
import { parseLLMResponseWithRetry } from '../parse';

export function buildTaskGeneratePrompt(
  level: 'beginner' | 'intermediate' | 'advanced',
  taskType: 'Task 1' | 'Task 2',
  genre: string | null
): string {
  if (taskType === 'Task 1') {
    return buildTask1Prompt(level, genre);
  } else {
    return buildTask2Prompt(level, genre);
  }
}

function buildTask1Prompt(
  level: 'beginner' | 'intermediate' | 'advanced',
  genre: string | null
): string {
  const genreDescriptions: Record<string, string> = {
    line_chart: 'ラインチャート（時系列データの変化を表す線グラフ）',
    bar_chart: '棒グラフ（カテゴリー間の比較を表す棒グラフ）',
    pie_chart: '円グラフ（割合や構成比を表す円グラフ）',
    table: '表（テーブル）',
    multiple_charts: '複数の図表（複数のグラフや表の組み合わせ）',
    diagram: 'ダイアグラム（プロセスや構造を表す図）',
    map: '地図（地理的な情報を表す地図）',
  };

  const genreInstruction = genre
    ? `Generate a ${genreDescriptions[genre] || genre} task.`
    : 'Generate a random Task 1 format (line chart, bar chart, pie chart, table, multiple charts, diagram, or map).';

  return `You are an IELTS Writing Task 1 question generator for Japanese learners.

Generate an IELTS Writing Task 1 question appropriate for the user's level.

User Level: ${level}
- beginner: Band 5.0-5.5 target
- intermediate: Band 6.0-6.5 target
- advanced: Band 6.5-7.0 target

Task Type: Task 1 (Graph/Chart/Diagram/Map description)
${genreInstruction}

Requirements:
1. Generate a realistic IELTS Task 1 question with appropriate data
2. Provide 3-5 required vocabulary words with:
   - word (English)
   - meaning (Japanese)
   - skill_tags (array of 'writing', 'speaking', 'reading', 'listening')
3. For beginner/intermediate levels, provide a simple guide structure

Output JSON format:
{
  "schema_version": "1.0",
  "level": "${level}",
  "question_type": "Task 1",
  "question": "IELTS Task 1 question text describing the graph/chart/diagram/map",
  "required_vocab": [
    {
      "word": "example",
      "meaning": "例",
      "skill_tags": ["writing", "speaking"]
    }
  ],
  "prep_guide": {
    "point": "Describe the main features",
    "reason": "Provide specific data points",
    "example": "Include comparisons",
    "point_again": "Summarize the key trends",
    "structure": ["Introduction", "Overview", "Details"]
  }
}

Note: For advanced level, prep_guide can be null or minimal.`;
}

function buildTask2Prompt(
  level: 'beginner' | 'intermediate' | 'advanced',
  genre: string | null
): string {
  const genreDescriptions: Record<string, string> = {
    discussion: 'Discussion essay: "Discuss both these views." or "Discuss both these views and give your own opinion."',
    opinion: 'Opinion essay: "What is your opinion?" / "Do you agree or disagree?" / "To what extent do you agree or disagree with this statement?" / "Is this a positive or negative development?"',
    cause_solution: 'Cause & Solution essay: "Why is this the case? What can be done about this problem?" or "What do you think are the causes of these problems and what measures could be taken to solve this problem?"',
    direct_question: 'Direct Question essay: "What factors contribute to...? How realistic is...?"',
    advantage_disadvantage: 'Advantage & Disadvantage essay: "What are the advantages and disadvantages?" or "Do you think the advantages outweigh the disadvantages?"',
  };

  const genreInstruction = genre
    ? `Generate a ${genreDescriptions[genre] || genre} task.`
    : 'Generate a random Task 2 essay type (discussion, opinion, cause & solution, direct question, or advantage & disadvantage).';

  return `You are an IELTS Writing Task 2 question generator for Japanese learners.

Generate an IELTS Writing Task 2 question appropriate for the user's level.

User Level: ${level}
- beginner: Band 5.0-5.5 target
- intermediate: Band 6.0-6.5 target
- advanced: Band 6.5-7.0 target

Task Type: Task 2 (Essay)
${genreInstruction}

Requirements:
1. Generate a question that is IELTS-like but applicable to general English learning
2. Provide 3-5 required vocabulary words with:
   - word (English)
   - meaning (Japanese)
   - skill_tags (array of 'writing', 'speaking', 'reading', 'listening')
3. For beginner/intermediate levels, provide PREP guide structure:
   - point: Explanation of P (Point)
   - reason: Explanation of R (Reason)
   - example: Explanation of E (Example)
   - point_again: Explanation of P (Point again)
   - structure: Array of paragraph structure suggestions

Output JSON format:
{
  "schema_version": "1.0",
  "level": "${level}",
  "question_type": "Task 2",
  "question": "IELTS Task 2 question text (at least 250 words requirement)",
  "required_vocab": [
    {
      "word": "example",
      "meaning": "例",
      "skill_tags": ["writing", "speaking"]
    }
  ],
  "prep_guide": {
    "point": "Your opinion should be clear",
    "reason": "Provide 2-3 reasons",
    "example": "Include one concrete example",
    "point_again": "Restate your opinion in conclusion",
    "structure": ["Introduction", "Body 1", "Body 2", "Conclusion"]
  }
}

Note: For advanced level, prep_guide can be null or minimal.`;
}

/**
 * Task1の質問文をアセットから決定生成
 * LLMを使わず、アセットメタデータからIELTS定型文を組み立てる
 */
export function buildTask1QuestionFromAsset(asset: Task1Asset): string {
  // グラフ種別に応じた表現を選択
  const chartTypeMap: Record<Task1Asset['genre'], string> = {
    line_chart: 'graph',
    bar_chart: 'bar chart',
    pie_chart: 'pie chart',
    table: 'table',
    multiple_charts: 'charts',
    diagram: 'diagram',
    map: 'map',
  };
  
  const chartType = chartTypeMap[asset.genre] || 'chart';
  
  // IELTS定型文を組み立て
  const question = `The ${chartType} below shows ${asset.title.toLowerCase()}${
    asset.time_period ? ` from ${asset.time_period}` : ''
  }.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`;

  return question;
}

/**
 * Task1の語彙とprep_guideのみをLLMで生成
 * 質問文はアセットから決定的に生成されるため、LLMには語彙生成のみを依頼
 */
function buildTask1VocabPrompt(
  level: 'beginner' | 'intermediate' | 'advanced',
  asset: Task1Asset
): string {
  return `You are an IELTS Writing Task 1 vocabulary and guide generator for Japanese learners.

Generate vocabulary words and a preparation guide for an IELTS Task 1 task.

Task Information:
- Level: ${level}
- Genre: ${asset.genre}
- Title: ${asset.title}
- Time Period: ${asset.time_period}
- Unit: ${asset.unit}
- Categories: ${asset.categories.join(', ')}
- Description: ${asset.description}

User Level: ${level}
- beginner: Band 5.0-5.5 target
- intermediate: Band 6.0-6.5 target
- advanced: Band 6.5-7.0 target

IMPORTANT CONSTRAINTS:
1. DO NOT generate the question text. The question is already determined from the asset metadata.
2. DO NOT modify or suggest changes to the asset data (title, time period, unit, categories).
3. ONLY generate required_vocab and prep_guide.

Requirements:
1. Provide 3-5 required vocabulary words that are appropriate for describing this ${asset.genre}:
   - word (English)
   - meaning (Japanese)
   - skill_tags (array of 'writing', 'speaking', 'reading', 'listening')
2. For beginner/intermediate levels, provide a simple guide structure (prep_guide)
3. For advanced level, prep_guide can be null or minimal

Output JSON format:
{
  "schema_version": "1.0",
  "required_vocab": [
    {
      "word": "example",
      "meaning": "例",
      "skill_tags": ["writing", "speaking"]
    }
  ],
  "prep_guide": {
    "point": "Describe the main features",
    "reason": "Provide specific data points",
    "example": "Include comparisons",
    "point_again": "Summarize the key trends",
    "structure": ["Introduction", "Overview", "Details"]
  }
}

Note: For advanced level, prep_guide can be null or minimal.`;
}

/**
 * Task1の語彙とprep_guideのみをLLMで生成
 */
export async function generateTask1VocabOnly(
  level: 'beginner' | 'intermediate' | 'advanced',
  asset: Task1Asset
): Promise<{ required_vocab: TaskGenerationResponse['required_vocab']; prep_guide?: TaskGenerationResponse['prep_guide'] }> {
  const prompt = buildTask1VocabPrompt(level, asset);
  
  try {
    console.log('[generateTask1VocabOnly] Calling LLM with level:', level, 'asset:', asset.id);
    const parsed = await parseLLMResponseWithRetry(async () => {
      return await callLLM(prompt, {
        response_format: { type: 'json_object' },
        temperature: 0.2, // 低温度で一貫性を保つ
      });
    });

    console.log('[generateTask1VocabOnly] LLM response parsed successfully');
    
    // バリデーション: required_vocabが3-5語であることを確認
    const vocab = (parsed as any).required_vocab;
    if (!Array.isArray(vocab) || vocab.length < 3 || vocab.length > 5) {
      console.warn('[generateTask1VocabOnly] Invalid vocab count:', vocab?.length, 'expected 3-5');
    }
    
    return {
      required_vocab: vocab || [],
      prep_guide: (parsed as any).prep_guide,
    };
  } catch (error) {
    console.error('[generateTask1VocabOnly] Error:', error);
    throw new Error(
      `Failed to generate Task1 vocab: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

export async function generateTask(
  level: 'beginner' | 'intermediate' | 'advanced',
  taskType: 'Task 1' | 'Task 2' = 'Task 2',
  genre: string | null = null
): Promise<TaskGenerationResponse> {
  // Task1の場合はアセット先行方式を使うため、この関数は呼ばれない想定
  // しかし後方互換性のために残しておく（将来削除予定）
  if (taskType === 'Task 1') {
    throw new Error('Task1 generation should use generateTask1WithAsset() instead');
  }
  
  const prompt = buildTaskGeneratePrompt(level, taskType, genre);
  
  try {
    console.log('[generateTask] Calling LLM with level:', level);
    const parsed = await parseLLMResponseWithRetry(async () => {
      return await callLLM(prompt, {
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });
    });

    console.log('[generateTask] LLM response parsed successfully');
    return parsed as TaskGenerationResponse;
  } catch (error) {
    console.error('[generateTask] Error:', error);
    throw new Error(
      `Failed to generate task: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

