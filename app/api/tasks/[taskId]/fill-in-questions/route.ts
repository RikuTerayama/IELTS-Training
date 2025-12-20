/**
 * GET /api/tasks/:taskId/fill-in-questions
 * 穴埋め問題生成（弱点別、最大3問）
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { generateFillInQuestions as generateQuestions } from '@/lib/domain/fillInQuestions';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> | { taskId: string } }
): Promise<Response> {
  console.log('[Fill-in Questions API] Starting question generation...');
  
  try {
    // Next.js 15+ では params が Promise になる可能性がある
    const resolvedParams = params instanceof Promise ? await params : params;
    const taskId = resolvedParams.taskId;

    const { searchParams } = new URL(request.url);
    const attemptId = searchParams.get('attempt_id');

    if (!attemptId) {
      console.error('[Fill-in Questions API] Missing attempt_id');
      return Response.json(
        errorResponse('BAD_REQUEST', 'attempt_id is required'),
        { status: 400 }
      );
    }

    console.log('[Fill-in Questions API] Task ID:', taskId, 'Attempt ID:', attemptId);

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Fill-in Questions API] Authentication error:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[Fill-in Questions API] User authenticated:', user.email);

    // Attempt取得
    const { data: attempt, error: attemptError } = await supabase
      .from('attempts')
      .select('*')
      .eq('id', attemptId)
      .eq('user_id', user.id)
      .single();

    if (attemptError || !attempt) {
      console.error('[Fill-in Questions API] Attempt not found:', attemptError);
      return Response.json(
        errorResponse('NOT_FOUND', 'Attempt not found'),
        { status: 404 }
      );
    }

    console.log('[Fill-in Questions API] Attempt found, analyzing response...');

    // ユーザーの回答テキストを取得
    const userResponseText = attempt.draft_content?.final || attempt.draft_content?.fill_in || '';
    
    if (!userResponseText || userResponseText.trim().length === 0) {
      console.error('[Fill-in Questions API] User response text is empty');
      return Response.json(
        errorResponse('BAD_REQUEST', 'User response text is required'),
        { status: 400 }
      );
    }

    // 簡易ルールベースで弱点を分析し、問題を生成
    const questions = generateQuestions(userResponseText, attemptId, attempt.level);

    console.log('[Fill-in Questions API] Generated questions:', questions.length);

    return Response.json(successResponse(questions));
  } catch (error) {
    console.error('[Fill-in Questions API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}
