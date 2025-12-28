/**
 * POST /api/llm/prep-to-essay
 * PREPから英語エッセイ生成（LLM呼び出し）
 */

import { createClient } from '@/lib/supabase/server';
import { buildPrepToEssayPrompt } from '@/lib/llm/prompts/prep_to_essay';
import { callLLM } from '@/lib/llm/client';
import { parseLLMResponseWithRetry } from '@/lib/llm/parse';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { RequiredVocab } from '@/lib/domain/types';

interface EssayGenerationResponse {
  schema_version: string;
  essay: string;
  word_count: number;
}

export async function POST(request: Request): Promise<Response> {
  console.log('[PREP to Essay API] Starting essay generation...');
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[PREP to Essay API] Authentication error:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    const requestBody = await request.json();
    const {
      task_question,
      prep_answers,
      japanese_evaluation,
      level,
      required_vocab,
    }: {
      task_question: string;
      prep_answers: {
        point: string;
        reason: string;
        example: string;
        point_again: string;
      };
      japanese_evaluation: {
        is_valid_prep: boolean;
        score_estimate: string;
        missing_points: string[];
        feedback: string;
      };
      level: 'beginner' | 'intermediate' | 'advanced';
      required_vocab: RequiredVocab[];
    } = requestBody;

    if (!task_question || !prep_answers || !japanese_evaluation || !level) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Missing required fields'),
        { status: 400 }
      );
    }

    console.log('[PREP to Essay API] Calling LLM to generate essay...');
    const prompt = buildPrepToEssayPrompt(
      task_question,
      prep_answers,
      japanese_evaluation,
      level,
      required_vocab || []
    );
    
    let essayData: EssayGenerationResponse;
    try {
      const llmResponse = await callLLM(prompt, {
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 2000,
      });
      const parsed = JSON.parse(llmResponse);
      if (!parsed.schema_version) {
        throw new Error('Missing schema_version in LLM response');
      }
      essayData = parsed as EssayGenerationResponse;
      console.log('[PREP to Essay API] Essay generated successfully');
    } catch (llmError) {
      console.error('[PREP to Essay API] LLM error:', llmError);
      return Response.json(
        errorResponse('LLM_ERROR', llmError instanceof Error ? llmError.message : 'Failed to generate essay'),
        { status: 500 }
      );
    }

    return Response.json(
      successResponse(essayData)
    );
  } catch (error) {
    console.error('[PREP to Essay API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'An unexpected error occurred'),
      { status: 500 }
    );
  }
}

