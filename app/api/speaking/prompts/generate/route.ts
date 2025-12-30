/**
 * POST /api/speaking/prompts/generate
 * 瞬間英作文プロンプト生成
 */

import { createClient } from '@/lib/supabase/server';
import { buildSpeakingPromptGeneratePrompt } from '@/lib/llm/prompts/speaking_prompt_generate';
import { callLLM } from '@/lib/llm/client';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { InstantSpeakingPromptResponse } from '@/lib/domain/types';

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

    const { session_id, topic, part, level, mode, target_points } = await request.json();

    if (!session_id || !mode || !topic) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Missing required fields: session_id, mode, topic'),
        { status: 400 }
      );
    }

    // LLMでプロンプト生成
    const prompt = buildSpeakingPromptGeneratePrompt(
      topic,
      part || null,
      level || 'B2',
      mode,
      target_points
    );

    let promptData: InstantSpeakingPromptResponse;
    try {
      const llmResponse = await callLLM(prompt, {
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 1500,
      });
      const parsed = JSON.parse(llmResponse);
      if (!parsed.schema_version) {
        throw new Error('Missing schema_version in LLM response');
      }
      promptData = parsed as InstantSpeakingPromptResponse;
    } catch (llmError) {
      console.error('[Speaking Prompt Generate API] LLM error:', llmError);
      return Response.json(
        errorResponse('LLM_ERROR', llmError instanceof Error ? llmError.message : 'Failed to generate prompt'),
        { status: 500 }
      );
    }

    // DBに保存
    const { data: savedPrompt, error: insertError } = await supabase
      .from('speaking_prompts')
      .insert({
        session_id,
        mode,
        part: part || null,
        topic,
        level: level || 'B2',
        jp_intent: promptData.jp_intent,
        expected_style: promptData.expected_style,
        target_points: promptData.target_points,
        model_answer: promptData.model_answer,
        paraphrases: promptData.paraphrases,
        cue_card: promptData.cue_card || null,
        followup_question: promptData.followup_question || null,
        time_limit: promptData.time_limit,
      })
      .select()
      .single();

    if (insertError) {
      console.error('[Speaking Prompt Generate API] Database error:', insertError);
      return Response.json(
        errorResponse('DATABASE_ERROR', insertError.message || 'Failed to save prompt'),
        { status: 500 }
      );
    }

    return Response.json(successResponse(savedPrompt));
  } catch (error) {
    console.error('[Speaking Prompt Generate API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'An unexpected error occurred'),
      { status: 500 }
    );
  }
}

