/**
 * POST /api/speaking/evaluations
 * Speaking evaluation generation
 */

import { createClient } from '@/lib/supabase/server';
import { buildSpeakingEvaluationPrompt } from '@/lib/llm/prompts/speaking_evaluation';
import { callLLM } from '@/lib/llm/client';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { SpeakingEvaluationResponse } from '@/lib/domain/types';

export const dynamic = 'force-dynamic';

type EvaluationPromptPayload = {
  part?: string;
  question_text?: string;
  jp_intent: string;
  model_answer?: string;
  expected_style?: string;
  time_limit?: number;
};

type EvaluationMetricsPayload = {
  word_count: number;
  wpm?: number;
  filler_count?: number;
  long_pause_count?: number;
  has_audio_transcript?: boolean;
};

function normalizeEvaluationPrompt(prompt: unknown): EvaluationPromptPayload | null {
  if (typeof prompt === 'string' && prompt.trim()) {
    return {
      jp_intent: prompt.trim(),
      question_text: prompt.trim(),
    };
  }

  if (!prompt || typeof prompt !== 'object') {
    return null;
  }

  const candidate = prompt as Record<string, unknown>;
  const jpIntent =
    typeof candidate.jp_intent === 'string' && candidate.jp_intent.trim()
      ? candidate.jp_intent.trim()
      : typeof candidate.question_text === 'string' && candidate.question_text.trim()
        ? candidate.question_text.trim()
        : null;

  if (!jpIntent) {
    return null;
  }

  return {
    jp_intent: jpIntent,
    part:
      typeof candidate.part === 'string' && candidate.part.trim()
        ? candidate.part.trim()
        : undefined,
    question_text:
      typeof candidate.question_text === 'string' && candidate.question_text.trim()
        ? candidate.question_text.trim()
        : undefined,
    model_answer:
      typeof candidate.model_answer === 'string' && candidate.model_answer.trim()
        ? candidate.model_answer.trim()
        : undefined,
    expected_style:
      typeof candidate.expected_style === 'string' && candidate.expected_style.trim()
        ? candidate.expected_style.trim()
        : undefined,
    time_limit:
      typeof candidate.time_limit === 'number' && Number.isFinite(candidate.time_limit)
        ? candidate.time_limit
        : undefined,
  };
}

function normalizeEvaluationMetrics(
  metrics: unknown,
  userResponse: string
): EvaluationMetricsPayload {
  if (!metrics || typeof metrics !== 'object') {
    return {
      word_count: userResponse.split(/\s+/).filter(Boolean).length,
    };
  }

  const candidate = metrics as Record<string, unknown>;

  return {
    word_count:
      typeof candidate.word_count === 'number' && Number.isFinite(candidate.word_count)
        ? candidate.word_count
        : userResponse.split(/\s+/).filter(Boolean).length,
    wpm:
      typeof candidate.wpm === 'number' && Number.isFinite(candidate.wpm)
        ? candidate.wpm
        : undefined,
    filler_count:
      typeof candidate.filler_count === 'number' && Number.isFinite(candidate.filler_count)
        ? candidate.filler_count
        : undefined,
    long_pause_count:
      typeof candidate.long_pause_count === 'number' && Number.isFinite(candidate.long_pause_count)
        ? candidate.long_pause_count
        : undefined,
    has_audio_transcript: Boolean(candidate.has_audio_transcript),
  };
}

export async function POST(request: Request): Promise<Response> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(errorResponse('UNAUTHORIZED', 'Not authenticated'), { status: 401 });
    }

    const { attempt_id, user_response, prompt, metrics } = await request.json();
    const normalizedUserResponse = typeof user_response === 'string' ? user_response.trim() : '';
    const normalizedPrompt = normalizeEvaluationPrompt(prompt);

    if (!attempt_id || !normalizedUserResponse || !normalizedPrompt) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Missing required fields: attempt_id, user_response, prompt'),
        { status: 400 }
      );
    }

    const normalizedMetrics = normalizeEvaluationMetrics(metrics, normalizedUserResponse);
    const evaluationPrompt = buildSpeakingEvaluationPrompt(
      normalizedUserResponse,
      normalizedPrompt,
      normalizedMetrics
    );

    let evaluationData: SpeakingEvaluationResponse;
    try {
      const llmResponse = await callLLM(evaluationPrompt, {
        response_format: { type: 'json_object' },
        temperature: 0.3,
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
        errorResponse(
          'LLM_ERROR',
          llmError instanceof Error ? llmError.message : 'Failed to generate evaluation'
        ),
        { status: 500 }
      );
    }

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