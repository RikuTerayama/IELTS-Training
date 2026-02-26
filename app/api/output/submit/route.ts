/**
 * POST /api/output/submit
 * Output（Speaking/Writing）の提出と必須表現の使用チェック
 */

import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse } from '@/lib/api/response';
import { normalizeExpression } from '@/lib/lexicon/normalize';
import { z } from 'zod';

const SubmitRequestSchema = z.object({
  output_type: z.enum(['speaking', 'writing_task1', 'writing_task2']),
  content: z.string().min(1),
  required_items: z.array(
    z.object({
      module: z.enum(['lexicon', 'idiom', 'vocab']),
      item_id: z.string().uuid(),
      expression: z.string(),
    })
  ),
  meta: z.object({
    topic: z.string().optional(),
    task_id: z.string().optional(),
  }).optional(),
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

    const { output_type, content, required_items, meta } = validationResult.data;

    const supabase = await createClient();

    // 認証チェック
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return Response.json(
        errorResponse('UNAUTHORIZED', 'Not authenticated'),
        { status: 401 }
      );
    }

    // 使用チェック: 単純な文字列一致（case-insensitive、前後空白無視）
    const normalizedContent = normalizeExpression(content);
    const used: Array<{ module: string; item_id: string; expression: string }> = [];
    const missing: Array<{ module: string; item_id: string; expression: string }> = [];

    for (const item of required_items) {
      // expressionを正規化して比較
      const normalizedExpression = normalizeExpression(item.expression);
      
      // 単純な文字列一致（case-insensitive、前後空白無視）
      // ただし、idiomは表記ゆれが出るので、最初は exact match でOK
      if (normalizedContent.includes(normalizedExpression)) {
        used.push({
          module: item.module,
          item_id: item.item_id,
          expression: item.expression,
        });
      } else {
        missing.push({
          module: item.module,
          item_id: item.item_id,
          expression: item.expression,
        });
      }
    }

    const usage_rate = required_items.length > 0
      ? used.length / required_items.length
      : 0;

    // ログを保存（将来的にoutput_logsテーブルを作る想定、今はスキップ）

    return Response.json(
      successResponse({
        used,
        missing,
        usage_rate,
      })
    );
  } catch (error) {
    console.error('[POST /api/output/submit] Unexpected error:', error);
    return Response.json(
      errorResponse(
        'INTERNAL_ERROR',
        error instanceof Error ? error.message : 'Unknown error'
      ),
      { status: 500 }
    );
  }
}
