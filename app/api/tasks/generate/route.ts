/**
 * POST /api/tasks/generate
 * タスク生成（LLM呼び出し）
 */

import { createClient } from '@/lib/supabase/server';
import { generateTask, generateTask1VocabOnly, buildTask1QuestionFromAsset } from '@/lib/llm/prompts/task_generate';
import { selectAssetByWeight } from '@/lib/task1/assets';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function POST(request: Request): Promise<Response> {
  try {
    console.log('[Generate API] Starting task generation...');
    
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('[Generate API] Authentication failed:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[Generate API] User authenticated:', user.email);

    const { level, task_type, genre } = await request.json();
    console.log('[Generate API] Requested params:', { level, task_type, genre });

    if (!level || !['beginner', 'intermediate', 'advanced'].includes(level)) {
      console.log('[Generate API] Invalid level:', level);
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid level'),
        { status: 400 }
      );
    }

    const taskType: 'Task 1' | 'Task 2' = task_type || 'Task 2';
    if (!['Task 1', 'Task 2'].includes(taskType)) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid task_type'),
        { status: 400 }
      );
    }

    // Task1の場合はアセット先行方式、Task2は従来通り
    let taskData;
    let assetId: string | undefined;
    let imagePath: string | undefined;
    
    if (taskType === 'Task 1') {
      // アセット先行方式: アセットを選択してから質問文を生成
      console.log('[Generate API] Task1: Selecting asset...');
      const asset = selectAssetByWeight(level, genre || undefined);
      
      if (!asset) {
        console.error('[Generate API] No asset found for level:', level, 'genre:', genre);
        return Response.json(
          errorResponse('ASSET_NOT_FOUND', 'No asset found for the specified level and genre'),
          { status: 404 }
        );
      }
      
      console.log('[Generate API] Asset selected:', asset.id);
      assetId = asset.id;
      imagePath = asset.image_path;
      
      // アセットから質問文を決定生成
      const question = buildTask1QuestionFromAsset(asset);
      
      // バリデーション: 必須フレーズチェック
      const requiredPhrases = [
        'shows',
        'Summarise',
        'Write at least 150 words',
      ];
      const missingPhrases = requiredPhrases.filter(phrase => !question.includes(phrase));
      if (missingPhrases.length > 0) {
        console.error('[Generate API] Missing required phrases:', missingPhrases);
        return Response.json(
          errorResponse('VALIDATION_ERROR', `Generated question missing required phrases: ${missingPhrases.join(', ')}`),
          { status: 500 }
        );
      }
      
      // LLMで語彙とprep_guideのみ生成
      console.log('[Generate API] Task1: Generating vocab and prep_guide...');
      try {
        const { required_vocab, prep_guide } = await generateTask1VocabOnly(level, asset);
        
        // バリデーション: required_vocabが3-5語であることを確認
        if (!Array.isArray(required_vocab) || required_vocab.length < 3 || required_vocab.length > 5) {
          console.warn('[Generate API] Invalid vocab count:', required_vocab.length, 'expected 3-5');
        }
        
        taskData = {
          schema_version: '1.0',
          level,
          question_type: 'Task 1' as const,
          question,
          required_vocab,
          prep_guide: level === 'advanced' ? undefined : prep_guide,
        };
        
        console.log('[Generate API] Task1 generated successfully:', {
          assetId: asset.id,
          questionLength: question.length,
          vocabCount: required_vocab.length,
          hasPrepGuide: !!prep_guide,
        });
      } catch (llmError) {
        console.error('[Generate API] LLM error (vocab generation):', llmError);
        return Response.json(
          errorResponse(
            'LLM_ERROR',
            llmError instanceof Error ? llmError.message : 'Failed to generate vocab and prep_guide'
          ),
          { status: 500 }
        );
      }
    } else {
      // Task2は従来通りLLMで質問文も生成
      console.log('[Generate API] Task2: Calling LLM to generate task...');
      try {
        taskData = await generateTask(level, taskType, genre || null);
        console.log('[Generate API] Task2 generated successfully:', {
          level: taskData.level,
          questionLength: taskData.question?.length || 0,
          vocabCount: taskData.required_vocab?.length || 0,
          hasPrepGuide: !!taskData.prep_guide,
        });
      } catch (llmError) {
        console.error('[Generate API] LLM error:', llmError);
        return Response.json(
          errorResponse(
            'LLM_ERROR',
            llmError instanceof Error ? llmError.message : 'Failed to generate task'
          ),
          { status: 500 }
        );
      }
    }

    // DBに保存
    console.log('[Generate API] Saving task to database...');
    const { data: task, error: insertError } = await supabase
      .from('tasks')
      .insert({
        level: taskData.level,
        question: taskData.question,
        question_type: taskData.question_type || taskType,
        required_vocab: taskData.required_vocab,
        prep_guide: taskData.prep_guide || null,
        asset_id: assetId || null, // Task1の場合のみ設定
        image_path: imagePath || null, // Task1の場合のみ設定
        is_cached: false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Generate API] Database insert error:', insertError);
      return Response.json(
        errorResponse(
          'DATABASE_ERROR',
          insertError.message || 'Failed to save task to database'
        ),
        { status: 500 }
      );
    }

    console.log('[Generate API] Task saved successfully, ID:', task.id);
    return Response.json(successResponse(task));
  } catch (error) {
    console.error('[Generate API] Unexpected error:', error);
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}

