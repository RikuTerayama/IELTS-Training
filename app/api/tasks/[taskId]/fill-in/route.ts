/**
 * POST /api/tasks/:taskId/fill-in
 * 穴埋め回答送信
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> | { taskId: string } }
): Promise<Response> {
  console.log('[Fill-in Submit API] Starting submission...');
  
  try {
    // Next.js 15+ では params が Promise になる可能性がある
    const resolvedParams = params instanceof Promise ? await params : params;
    const taskId = resolvedParams.taskId;

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('[Fill-in Submit API] Authentication error:', authError);
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    console.log('[Fill-in Submit API] User authenticated:', user.email);

    const requestBody = await request.json();
    const { attempt_id, answers }: {
      attempt_id: string;
      answers: Array<{ question_id: string; user_answer: string }>;
    } = requestBody;

    if (!attempt_id || !answers || !Array.isArray(answers)) {
      console.error('[Fill-in Submit API] Invalid request body');
      return Response.json(
        errorResponse('BAD_REQUEST', 'attempt_id and answers are required'),
        { status: 400 }
      );
    }

    console.log('[Fill-in Submit API] Attempt ID:', attempt_id, 'Answers count:', answers.length);

    // Attemptがユーザーのものか確認
    const { data: attempt, error: attemptError } = await supabase
      .from('attempts')
      .select('*')
      .eq('id', attempt_id)
      .eq('user_id', user.id)
      .single();

    if (attemptError || !attempt) {
      console.error('[Fill-in Submit API] Attempt not found:', attemptError);
      return Response.json(
        errorResponse('NOT_FOUND', 'Attempt not found'),
        { status: 404 }
      );
    }

    // 穴埋め回答をattemptsテーブルのdraft_contentに保存
    const currentDraftContent = attempt.draft_content || {};
    const updatedDraftContent = {
      ...currentDraftContent,
      fill_in_answers: answers, // 穴埋め回答を保存
    };

    const { error: updateError } = await supabase
      .from('attempts')
      .update({
        draft_content: updatedDraftContent,
        updated_at: new Date().toISOString(),
      })
      .eq('id', attempt_id);

    if (updateError) {
      console.error('[Fill-in Submit API] Database update error:', updateError);
      return Response.json(
        errorResponse('DATABASE_ERROR', updateError.message || 'Failed to save answers', updateError),
        { status: 500 }
      );
    }

    console.log('[Fill-in Submit API] Answers saved successfully');

    return Response.json(
      successResponse({
        next_step: 'feedback',
      })
    );
  } catch (error) {
    console.error('[Fill-in Submit API] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}

