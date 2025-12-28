/**
 * POST /api/llm/prep-evaluation
 * 日本語PREP評価（LLM呼び出し）
 */

import { createClient } from '@/lib/supabase/server';
import { buildPrepEvaluationPrompt } from '@/lib/llm/prompts/prep_evaluation';
import { callLLM } from '@/lib/llm/client';
import { parseLLMResponseWithRetry } from '@/lib/llm/parse';
import { successResponse, errorResponse } from '@/lib/api/response';

interface PrepEvaluationResponse {
  schema_version: string;
  is_valid_prep: boolean;
  score_estimate: string;
  missing_points: string[];
  feedback: string;
}

export async function POST(request: Request): Promise<Response> {
  console.log('[PREP Evaluation API] Starting evaluation...');
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[PREP Evaluation API] Authentication error:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    const requestBody = await request.json();
    const {
      task_question,
      task_type,
      prep_answers,
      level,
    }: {
      task_question: string;
      task_type?: 'Task 1' | 'Task 2';
      prep_answers: {
        point: string;
        reason?: string;
        example: string;
        point_again?: string;
      };
      level: 'beginner' | 'intermediate' | 'advanced';
    } = requestBody;

    if (!task_question || !prep_answers || !level) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Missing required fields'),
        { status: 400 }
      );
    }

    // task_typeが指定されていない場合は、Task 2をデフォルトとする（後方互換性のため）
    const taskType = task_type || 'Task 2';

    console.log('[PREP Evaluation API] Calling LLM to evaluate structure...', { taskType });
    const prompt = buildPrepEvaluationPrompt(task_question, taskType, prep_answers, level);
    
    let evaluationData: PrepEvaluationResponse;
    try {
      const llmResponse = await callLLM(prompt, {
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1000,
      });
      const parsed = JSON.parse(llmResponse);
      if (!parsed.schema_version) {
        throw new Error('Missing schema_version in LLM response');
      }
      evaluationData = parsed as PrepEvaluationResponse;
      console.log('[PREP Evaluation API] Evaluation generated successfully');
    } catch (llmError) {
      console.error('[PREP Evaluation API] LLM error:', llmError);
      return Response.json(
        errorResponse('LLM_ERROR', llmError instanceof Error ? llmError.message : 'Failed to generate evaluation'),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse(evaluationData)
    );
  } catch (error) {
    console.error('[PREP Evaluation API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'An unexpected error occurred'),
      { status: 500 }
    );
  }
}

