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

    const { session_id, topic, part, level, mode, target_points, use_preset } = await request.json();

    if (!session_id || !mode || !topic) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Missing required fields: session_id, mode, topic'),
        { status: 400 }
      );
    }

    const finalLevel = level || 'B2';
    const finalPart = part || null;

    // 1. プリセットから取得を試みる（use_presetがtrue、または明示的にfalseでない場合）
    if (use_preset !== false) {
      const { data: presetPrompts, error: presetError } = await supabase
        .from('speaking_prompts')
        .select('*')
        .eq('mode', mode)
        .eq('topic', topic)
        .eq('level', finalLevel)
        .is('session_id', null) // プリセット（session_idがNULL）
        .limit(50);

      if (!presetError && presetPrompts && presetPrompts.length > 0) {
        // partでフィルタリング（partが指定されている場合）
        let filteredPresets = presetPrompts;
        if (finalPart) {
          filteredPresets = presetPrompts.filter(p => p.part === finalPart);
        }

        if (filteredPresets.length > 0) {
          // ランダムに1つ選択
          const randomPrompt = filteredPresets[Math.floor(Math.random() * filteredPresets.length)];
          
          // セッション用にコピー（session_idを設定）
          const { data: sessionPrompt, error: copyError } = await supabase
            .from('speaking_prompts')
            .insert({
              session_id,
              mode: randomPrompt.mode,
              part: randomPrompt.part,
              topic: randomPrompt.topic,
              level: randomPrompt.level,
              jp_intent: randomPrompt.jp_intent,
              expected_style: randomPrompt.expected_style,
              target_points: randomPrompt.target_points,
              model_answer: randomPrompt.model_answer,
              paraphrases: randomPrompt.paraphrases,
              cue_card: randomPrompt.cue_card,
              followup_question: randomPrompt.followup_question,
              time_limit: randomPrompt.time_limit,
            })
            .select()
            .single();

          if (!copyError && sessionPrompt) {
            console.log('[Speaking Prompt Generate API] Using preset prompt');
            return Response.json(successResponse(sessionPrompt));
          }
        }
      }
    }

    // 2. プリセットがない、またはuse_preset=falseの場合はLLMで生成
    console.log('[Speaking Prompt Generate API] Generating with LLM');
    const prompt = buildSpeakingPromptGeneratePrompt(
      topic,
      finalPart,
      finalLevel,
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

