/**
 * POST /api/speaking/evaluations
 * 瞬間英作文評価生成
 */

import { createClient } from '@/lib/supabase/server';
import { buildSpeakingEvaluationPrompt } from '@/lib/llm/prompts/speaking_evaluation';
import { callLLM } from '@/lib/llm/client';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { SpeakingEvaluationResponse } from '@/lib/domain/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request): Promise<Response> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    const { attempt_id, user_response, prompt, metrics } = await request.json();

    if (!attempt_id || !user_response || !prompt) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Missing required fields: attempt_id, user_response, prompt'),
        { status: 400 }
      );
    }

    // LLMで評価生成
    const evaluationPrompt = buildSpeakingEvaluationPrompt(
      user_response,
      prompt,
      metrics || {
        word_count: user_response.split(/\s+/).length,
      }
    );

    let evaluationData: SpeakingEvaluationResponse;
    try {
      const llmResponse = await callLLM(evaluationPrompt, {
        response_format: { type: 'json_object' },
        temperature: 0.3, // 評価は低温度で一貫性重視
        max_tokens: 2000,
      });
      const parsed = JSON.parse(llmResponse);
      if (!parsed.schema_version) {
        throw new Error('Missing schema_version in LLM response');
      }
      evaluationData = parsed as SpeakingEvaluationResponse;
    } catch (llmError) {
      console.error('[Speaking Evaluation API] LLM error:', llmError);
      return Response.json(
        errorResponse('LLM_ERROR', llmError instanceof Error ? llmError.message : 'Failed to generate evaluation'),
        { status: 500 }
      );
    }

    // DBに保存
    const { data: savedFeedback, error: insertError } = await supabase
      .from('speaking_feedbacks')
      .insert({
        attempt_id,
        fluency_band: evaluationData.band_estimates.fluency,
        lexical_band: evaluationData.band_estimates.lexical,
        grammar_band: evaluationData.band_estimates.grammar,
        pronunciation_band: evaluationData.band_estimates.pronunciation,
        overall_band: evaluationData.band_estimates.overall,
        evidence: evaluationData.evidence,
        top_fixes: evaluationData.top_fixes,
        rewrite: evaluationData.rewrite,
        micro_drills: evaluationData.micro_drills,
        weakness_tags: evaluationData.weakness_tags,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Speaking Evaluation API] Database error:', insertError);
      return Response.json(
        errorResponse('DATABASE_ERROR', insertError.message || 'Failed to save feedback'),
        { status: 500 }
      );
    }

    return Response.json(successResponse(savedFeedback));
  } catch (error) {
    console.error('[Speaking Evaluation API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'An unexpected error occurred'),
      { status: 500 }
    );
  }
}

