/**
 * GET /api/progress/speaking-history
 * Speaking AI Interviewer (text beta) history (latest 5)
 */

export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';

type SpeakingHistoryItem = {
  id: string;
  created_at: string;
  topic: string | null;
  part: string | null;
  question_preview: string;
  word_count: number | null;
  overall_band: number | string | null;
};

type AttemptRow = {
  id: string;
  session_id: string | null;
  prompt_id: string | null;
  word_count: number | null;
  created_at: string;
};

type PromptRow = {
  id: string;
  topic: string | null;
  part: string | null;
  followup_question: string | null;
  question: string | null;
  jp_intent: string | null;
};

type SessionRow = {
  id: string;
  topic: string | null;
  part: string | null;
};

type FeedbackRow = {
  attempt_id: string;
  overall_band: number | string | null;
  created_at: string;
};

function normalizeQuestionPreview(prompt: PromptRow | undefined): string {
  if (!prompt) return '';
  const candidate = prompt.followup_question || prompt.question || prompt.jp_intent || '';
  return String(candidate).trim();
}

export async function GET(): Promise<Response> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(errorResponse('UNAUTHORIZED', 'Not authenticated'), {
        status: 401,
      });
    }

    const attemptColumns = 'id, session_id, prompt_id, word_count, created_at';
    let attempts: AttemptRow[] = [];

    // Primary path: scope attempts by user_id on speaking_attempts.
    const { data: directAttempts, error: directError } = await supabase
      .from('speaking_attempts')
      .select(attemptColumns)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!directError) {
      attempts = (directAttempts || []) as AttemptRow[];
    } else if (/user_id/i.test(directError.message || '')) {
      // Fallback for schemas where speaking_attempts has no user_id.
      const { data: userSessions, error: sessionsError } = await supabase
        .from('speaking_sessions')
        .select('id')
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .limit(100);

      if (sessionsError) {
        throw sessionsError;
      }

      const sessionIds = (userSessions || [])
        .map((row: { id: string }) => row.id)
        .filter(Boolean);

      if (sessionIds.length === 0) {
        return Response.json(successResponse([] as SpeakingHistoryItem[]));
      }

      const { data: scopedAttempts, error: scopedError } = await supabase
        .from('speaking_attempts')
        .select(attemptColumns)
        .in('session_id', sessionIds)
        .order('created_at', { ascending: false })
        .limit(5);

      if (scopedError) {
        throw scopedError;
      }

      attempts = (scopedAttempts || []) as AttemptRow[];
    } else {
      throw directError;
    }

    if (!attempts.length) {
      return Response.json(successResponse([] as SpeakingHistoryItem[]));
    }

    const promptIds = Array.from(new Set(attempts.map((a) => a.prompt_id).filter((id): id is string => !!id)));
    const sessionIds = Array.from(new Set(attempts.map((a) => a.session_id).filter((id): id is string => !!id)));
    const attemptIds = attempts.map((a) => a.id);

    let promptsResult:
      | { data: PromptRow[]; error: null }
      | { data: PromptRow[] | null; error: { message?: string } | null };

    if (promptIds.length) {
      const promptCols = 'id, topic, part, followup_question, question, jp_intent';
      const promptColsNoQuestion = 'id, topic, part, followup_question, jp_intent';
      const promptQuery = await supabase
        .from('speaking_prompts')
        .select(promptCols)
        .in('id', promptIds);

      if (!promptQuery.error) {
        promptsResult = promptQuery as typeof promptsResult;
      } else if (/question/i.test(promptQuery.error.message || '')) {
        const fallbackPromptQuery = await supabase
          .from('speaking_prompts')
          .select(promptColsNoQuestion)
          .in('id', promptIds);

        if (fallbackPromptQuery.error) {
          throw fallbackPromptQuery.error;
        }

        promptsResult = {
          data: ((fallbackPromptQuery.data || []) as Array<Omit<PromptRow, 'question'>>).map(
            (prompt) => ({
              ...prompt,
              question: null,
            })
          ),
          error: null,
        };
      } else {
        throw promptQuery.error;
      }
    } else {
      promptsResult = { data: [] as PromptRow[], error: null };
    }

    const [sessionsResult, feedbacksResult] = await Promise.all([
      sessionIds.length
        ? supabase.from('speaking_sessions').select('id, topic, part').in('id', sessionIds)
        : Promise.resolve({ data: [] as SessionRow[], error: null }),
      attemptIds.length
        ? supabase
            .from('speaking_feedbacks')
            .select('attempt_id, overall_band, created_at')
            .in('attempt_id', attemptIds)
            .order('created_at', { ascending: false })
        : Promise.resolve({ data: [] as FeedbackRow[], error: null }),
    ]);

    if (promptsResult.error) throw promptsResult.error;
    if (sessionsResult.error) throw sessionsResult.error;
    if (feedbacksResult.error) throw feedbacksResult.error;

    const promptById = new Map<string, PromptRow>();
    for (const prompt of (promptsResult.data || []) as PromptRow[]) {
      promptById.set(prompt.id, prompt);
    }

    const sessionById = new Map<string, SessionRow>();
    for (const session of (sessionsResult.data || []) as SessionRow[]) {
      sessionById.set(session.id, session);
    }

    // created_at desc: first one is treated as latest feedback per attempt.
    const latestFeedbackByAttemptId = new Map<string, FeedbackRow>();
    for (const feedback of (feedbacksResult.data || []) as FeedbackRow[]) {
      if (!latestFeedbackByAttemptId.has(feedback.attempt_id)) {
        latestFeedbackByAttemptId.set(feedback.attempt_id, feedback);
      }
    }

    const history: SpeakingHistoryItem[] = attempts.map((attempt) => {
      const prompt = attempt.prompt_id ? promptById.get(attempt.prompt_id) : undefined;
      const session = attempt.session_id ? sessionById.get(attempt.session_id) : undefined;
      const feedback = latestFeedbackByAttemptId.get(attempt.id);

      return {
        id: attempt.id,
        created_at: attempt.created_at,
        topic: prompt?.topic ?? session?.topic ?? null,
        part: prompt?.part ?? session?.part ?? null,
        question_preview: normalizeQuestionPreview(prompt),
        word_count: attempt.word_count ?? null,
        overall_band: feedback?.overall_band ?? null,
      };
    });

    return Response.json(successResponse(history));
  } catch (error) {
    console.error('[speaking-history] Unexpected error:', error);
    return Response.json(
      errorResponse('INTERNAL_ERROR', 'スピーキング面接履歴の取得に失敗しました。時間をおいて再度お試しください。'),
      { status: 500 }
    );
  }
}
