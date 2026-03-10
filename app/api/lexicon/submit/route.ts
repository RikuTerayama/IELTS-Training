/**
 * POST /api/lexicon/submit
 * 回答を送信して正誤判定・ログ保存
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import type { ReadingSrsStateRow } from '@/lib/db/reading-srs';
import { normalizeExpression } from '@/lib/lexicon/normalize';
import { updateSRSState } from '@/lib/lexicon/srs';
import { getTokyoDateString } from '@/lib/utils/dateTokyo';
import { z } from 'zod';

const SubmitRequestSchema = z.object({
  question_id: z.string().uuid(),
  user_answer: z.string().optional(),
  time_ms: z.number().int().min(0).optional(),
});

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    
    // バリデーション
    const validationResult = SubmitRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return Response.json(
        errorResponse('BAD_REQUEST', 'Invalid request body', validationResult.error.errors),
        { status: 400 }
      );
    }

    const { question_id, user_answer, time_ms } = validationResult.data;

    const supabase = await createClient();

    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    // 問題を取得（skill は Reading SRS 判定用）
    const { data: question, error: questionError } = await supabase
      .from('lexicon_questions')
      .select('id, mode, correct_expression, item_id, module, skill')
      .eq('id', question_id)
      .single();

    if (questionError || !question) {
      console.error('[POST /api/lexicon/submit] Question not found:', questionError);
      return Response.json(
        errorResponse('NOT_FOUND', 'Lexicon question not found'),
        { status: 404 }
      );
    }

    // 正誤判定
    let isCorrect = false;
    if (question.mode === 'click') {
      // clickモード: user_answerがcorrect_expressionと一致するか
      isCorrect = user_answer === question.correct_expression;
    } else if (question.mode === 'typing') {
      // typingモード: 正規化して比較
      if (user_answer) {
        const normalizedUserAnswer = normalizeExpression(user_answer);
        const normalizedCorrect = normalizeExpression(question.correct_expression);
        isCorrect = normalizedUserAnswer === normalizedCorrect;
      }
    }

    // moduleを取得（question.moduleから、無い場合は'lexicon'をデフォルト）
    const moduleName = question.module || 'lexicon';

    // item_idを取得（question.item_idが無い場合はcorrect_expressionで引く）
    let itemId = question.item_id;
    if (!itemId) {
      // correct_expressionからitemを検索
      const { data: item } = await supabase
        .from('lexicon_items')
        .select('id')
        .eq('expression', question.correct_expression)
        .eq('module', moduleName)
        .limit(1)
        .single();
      
      if (item) {
        itemId = item.id;
      }
    }

    // ログを保存。readingはitem_idなし・question_idで紐付け
    const logPayload: Record<string, unknown> = {
      user_id: user.id,
      mode: question.mode,
      module: moduleName,
      is_correct: isCorrect,
      user_answer: user_answer ?? null,
      time_ms: time_ms ?? null,
    };
    if (itemId) {
      logPayload.item_id = itemId;
    } else {
      logPayload.question_id = question_id;
    }
    const { error: logError } = await supabase
      .from('lexicon_logs')
      .insert(logPayload);

    if (logError) {
      console.error('[POST /api/lexicon/submit] Log insert error:', logError);
      return Response.json(
        errorResponse('DATABASE_ERROR', logError.message),
        { status: 500 }
      );
    }

    const today = getTokyoDateString();

    // SRS状態を更新（item_id あり → lexicon_srs_state / Reading → reading_srs_state）
    if (itemId) {
      const { data: currentState } = await supabase
        .from('lexicon_srs_state')
        .select('stage, next_review_on, last_review_on, correct_streak, total_correct, total_wrong')
        .eq('user_id', user.id)
        .eq('item_id', itemId)
        .eq('mode', question.mode)
        .eq('module', moduleName)
        .single();

      const updatedState = updateSRSState(currentState, isCorrect, today);

      const { error: srsError } = await supabase
        .from('lexicon_srs_state')
        .upsert(
          {
            user_id: user.id,
            item_id: itemId,
            mode: question.mode,
            module: moduleName,
            stage: updatedState.stage,
            next_review_on: updatedState.next_review_on,
            last_review_on: updatedState.last_review_on,
            correct_streak: updatedState.correct_streak,
            total_correct: updatedState.total_correct,
            total_wrong: updatedState.total_wrong,
          },
          { onConflict: 'user_id,item_id,mode' }
        );

      if (srsError) {
        console.error('[POST /api/lexicon/submit] SRS update error:', srsError);
      }
    } else if (question.skill === 'reading') {
      // Reading: question_id ベースで reading_srs_state を更新
      const { data: currentState } = await supabase
        .from('reading_srs_state')
        .select('stage, next_review_on, last_review_on, correct_streak, total_correct, total_wrong')
        .eq('user_id', user.id)
        .eq('question_id', question_id)
        .eq('mode', question.mode)
        .single();

      const updatedState = updateSRSState(
        currentState as Pick<ReadingSrsStateRow, 'stage' | 'next_review_on' | 'last_review_on' | 'correct_streak' | 'total_correct' | 'total_wrong'> | null,
        isCorrect,
        today
      );

      const { error: srsError } = await supabase
        .from('reading_srs_state')
        .upsert(
          {
            user_id: user.id,
            question_id: question_id,
            mode: question.mode,
            stage: updatedState.stage,
            next_review_on: updatedState.next_review_on,
            last_review_on: updatedState.last_review_on,
            correct_streak: updatedState.correct_streak,
            total_correct: updatedState.total_correct,
            total_wrong: updatedState.total_wrong,
          },
          { onConflict: 'user_id,question_id,mode' }
        );

      if (srsError) {
        console.error('[POST /api/lexicon/submit] Reading SRS update error:', srsError);
      }
    }

    return Response.json(
      successResponse({
        is_correct: isCorrect,
        correct_expression: question.correct_expression,
      })
    );
  } catch (error) {
    console.error('[POST /api/lexicon/submit] Unexpected error:', error);
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}
