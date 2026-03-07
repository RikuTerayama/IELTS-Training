/**
 * GET /api/speaking/attempts/:attemptId/detail
 * Speaking attempt detail (question / answer / evaluation)
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';

type AttemptRow = {
  id: string;
  created_at: string;
  user_response: string;
  word_count: number | null;
  prompt_id: string | null;
  session_id: string | null;
  user_id?: string | null;
};

type PromptRow = {
  id: string;
  part: string | null;
  topic: string | null;
  followup_question: string | null;
  question: string | null;
  jp_intent: string | null;
  cue_card: { topic?: string; points?: string[] } | null;
  target_points: unknown;
  expected_style: string | null;
  model_answer: string | null;
  paraphrases: string[] | null;
  time_limit: number | null;
};

type SessionRow = {
  id: string;
  user_id: string;
  topic: string | null;
  part: string | null;
  level: string | null;
  started_at: string | null;
};

type FeedbackRow = {
  overall_band: number | null;
  fluency_band: number | null;
  lexical_band: number | null;
  grammar_band: number | null;
  pronunciation_band: number | null;
  evidence: unknown;
  top_fixes: unknown;
  rewrite: string | null;
  micro_drills: unknown;
  weakness_tags: unknown;
  created_at: string | null;
};

function buildCueCardText(cueCard: PromptRow['cue_card']): string | null {
  if (!cueCard || typeof cueCard !== 'object') return null;
  const topic = typeof cueCard.topic === 'string' ? cueCard.topic.trim() : '';
  const points = Array.isArray(cueCard.points)
    ? cueCard.points.map((p) => String(p).trim()).filter(Boolean)
    : [];

  if (!topic && points.length === 0) return null;

  const lines: string[] = [];
  if (topic) lines.push(topic);
  if (points.length > 0) {
    lines.push(...points.map((p) => `- ${p}`));
  }
  return lines.join('\n');
}

function buildQuestionText(prompt: PromptRow | null): string {
  if (!prompt) return '';

  if (prompt.part === 'part2') {
    const cueCardText = buildCueCardText(prompt.cue_card);
    if (cueCardText) return cueCardText;
  }

  if (prompt.followup_question && prompt.followup_question.trim()) {
    return prompt.followup_question.trim();
  }
  if (prompt.question && prompt.question.trim()) {
    return prompt.question.trim();
  }
  if (prompt.jp_intent && prompt.jp_intent.trim()) {
    return `(Intent) ${prompt.jp_intent.trim()}`;
  }
  return '';
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ attemptId: string }> | { attemptId: string } }
): Promise<Response> {
  try {
    const resolvedParams = params instanceof Promise ? await params : params;
    const attemptId = resolvedParams.attemptId;

    if (!attemptId || attemptId === 'undefined') {
      return Response.json(errorResponse('BAD_REQUEST', 'Invalid attempt ID'), { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json(errorResponse('UNAUTHORIZED', 'Not authenticated'), { status: 401 });
    }

    let attempt: AttemptRow | null = null;
    const attemptColsWithUserId =
      'id, created_at, user_response, word_count, prompt_id, session_id, user_id';
    const attemptColsNoUserId =
      'id, created_at, user_response, word_count, prompt_id, session_id';

    const {
      data: attemptWithUserId,
      error: attemptWithUserIdError,
    } = await supabase
      .from('speaking_attempts')
      .select(attemptColsWithUserId)
      .eq('id', attemptId)
      .maybeSingle();

    if (!attemptWithUserIdError) {
      attempt = (attemptWithUserId as AttemptRow | null) ?? null;
    } else if (/user_id/i.test(attemptWithUserIdError.message || '')) {
      const { data: attemptNoUserId, error: attemptNoUserIdError } = await supabase
        .from('speaking_attempts')
        .select(attemptColsNoUserId)
        .eq('id', attemptId)
        .maybeSingle();

      if (attemptNoUserIdError) {
        throw attemptNoUserIdError;
      }
      attempt = (attemptNoUserId as AttemptRow | null) ?? null;
    } else {
      throw attemptWithUserIdError;
    }

    if (!attempt) {
      return Response.json(errorResponse('NOT_FOUND', 'Attempt not found'), { status: 404 });
    }

    let session: SessionRow | null = null;
    if (attempt.session_id) {
      const { data: sessionRow, error: sessionError } = await supabase
        .from('speaking_sessions')
        .select('id, user_id, topic, part, level, started_at')
        .eq('id', attempt.session_id)
        .maybeSingle();

      if (sessionError) {
        throw sessionError;
      }
      session = (sessionRow as SessionRow | null) ?? null;
    }

    // Owner check: prefer attempt.user_id, fallback to session.user_id.
    if (attempt.user_id) {
      if (attempt.user_id !== user.id) {
        return Response.json(errorResponse('NOT_FOUND', 'Attempt not found'), { status: 404 });
      }
    } else {
      if (!session || session.user_id !== user.id) {
        return Response.json(errorResponse('NOT_FOUND', 'Attempt not found'), { status: 404 });
      }
    }

    let prompt: PromptRow | null = null;
    if (attempt.prompt_id) {
      const promptCols =
        'id, part, topic, followup_question, question, jp_intent, cue_card, target_points, expected_style, model_answer, paraphrases, time_limit';
      const promptColsNoQuestion =
        'id, part, topic, followup_question, jp_intent, cue_card, target_points, expected_style, model_answer, paraphrases, time_limit';

      const { data: promptRow, error: promptError } = await supabase
        .from('speaking_prompts')
        .select(promptCols)
        .eq('id', attempt.prompt_id)
        .maybeSingle();

      if (!promptError) {
        prompt = (promptRow as PromptRow | null) ?? null;
      } else if (/question/i.test(promptError.message || '')) {
        const { data: promptRowNoQuestion, error: promptNoQuestionError } = await supabase
          .from('speaking_prompts')
          .select(promptColsNoQuestion)
          .eq('id', attempt.prompt_id)
          .maybeSingle();

        if (promptNoQuestionError) {
          throw promptNoQuestionError;
        }
        prompt = promptRowNoQuestion
          ? ({ ...(promptRowNoQuestion as Omit<PromptRow, 'question'>), question: null } as PromptRow)
          : null;
      } else {
        throw promptError;
      }
    }

    const { data: feedbackRow, error: feedbackError } = await supabase
      .from('speaking_feedbacks')
      .select(
        'overall_band, fluency_band, lexical_band, grammar_band, pronunciation_band, evidence, top_fixes, rewrite, micro_drills, weakness_tags, created_at'
      )
      .eq('attempt_id', attempt.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (feedbackError) {
      throw feedbackError;
    }

    const cueCardText = buildCueCardText(prompt?.cue_card ?? null);
    const questionText = buildQuestionText(prompt);

    return Response.json(
      successResponse({
        attempt: {
          id: attempt.id,
          created_at: attempt.created_at,
          user_response: attempt.user_response,
          word_count: attempt.word_count ?? null,
          prompt_id: attempt.prompt_id ?? null,
          session_id: attempt.session_id ?? null,
        },
        prompt: prompt
          ? {
              id: prompt.id,
              part: prompt.part ?? null,
              topic: prompt.topic ?? null,
              followup_question: prompt.followup_question ?? null,
              question: prompt.question ?? null,
              jp_intent: prompt.jp_intent ?? null,
              cue_card: prompt.cue_card ?? null,
              target_points: prompt.target_points ?? null,
              expected_style: prompt.expected_style ?? null,
              model_answer: prompt.model_answer ?? null,
              paraphrases: prompt.paraphrases ?? null,
              time_limit: prompt.time_limit ?? null,
            }
          : null,
        session: session
          ? {
              id: session.id,
              topic: session.topic ?? null,
              part: session.part ?? null,
              level: session.level ?? null,
              started_at: session.started_at ?? null,
            }
          : null,
        feedback: feedbackRow
          ? {
              overall_band: (feedbackRow as FeedbackRow).overall_band ?? null,
              fluency_band: (feedbackRow as FeedbackRow).fluency_band ?? null,
              lexical_band: (feedbackRow as FeedbackRow).lexical_band ?? null,
              grammar_band: (feedbackRow as FeedbackRow).grammar_band ?? null,
              pronunciation_band: (feedbackRow as FeedbackRow).pronunciation_band ?? null,
              evidence: (feedbackRow as FeedbackRow).evidence ?? null,
              top_fixes: (feedbackRow as FeedbackRow).top_fixes ?? null,
              rewrite: (feedbackRow as FeedbackRow).rewrite ?? null,
              micro_drills: (feedbackRow as FeedbackRow).micro_drills ?? null,
              weakness_tags: (feedbackRow as FeedbackRow).weakness_tags ?? null,
              created_at: (feedbackRow as FeedbackRow).created_at ?? null,
            }
          : null,
        derived: {
          question_text: questionText,
          cue_card_text: cueCardText,
        },
      })
    );
  } catch (error) {
    return Response.json(
      errorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Unknown error'),
      { status: 500 }
    );
  }
}
