/**
 * Final Review Panel
 * Step6の最終レビュー結果を表示（文単位ハイライト）
 */

'use client';

import { cn, cardBase, cardTitle, cardDesc, badgeBase } from '@/lib/ui/theme';
import type { Task1FinalReviewFeedback } from '@/lib/domain/types';

interface FinalReviewPanelProps {
  feedback: Task1FinalReviewFeedback;
  finalResponse: string;
}

export function FinalReviewPanel({ feedback, finalResponse }: FinalReviewPanelProps) {
  // 文単位で分割
  const sentences = finalResponse.split(/[.!?]+/).filter(s => s.trim().length > 0);

  return (
    <div className={cn('p-6', cardBase, 'border-accent-indigo bg-accent-indigo/10')}>
      <h3 className={cn('mb-4 text-lg font-semibold', cardTitle)}>最終レビュー結果</h3>

      {/* Overall Band */}
      <div className={cn('mb-4 rounded border border-border bg-surface p-4')}>
        <h4 className={cn('font-semibold', cardTitle)}>Overall Band: {feedback.overall_band_range}</h4>
      </div>

      {/* 文単位ハイライト */}
      <div className="mb-4 space-y-2">
        <h4 className={cn('font-semibold', cardTitle)}>文単位フィードバック</h4>
        {feedback.sentence_highlights.map((highlight, index) => (
          <div
            key={index}
            className={cn('rounded border border-border bg-surface p-3')}
          >
            <div className="mb-1 flex items-center gap-2">
              {highlight.tags.map((tag) => (
                <span
                  key={tag}
                  className={cn(badgeBase, 
                    tag === 'TR' ? 'bg-accent-indigo/20 text-accent-indigo-foreground' :
                    tag === 'CC' ? 'bg-success-bg text-success' :
                    tag === 'LR' ? 'bg-warning-bg text-warning' :
                    'bg-accent-violet/20 text-accent-violet-foreground'
                  )}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className={cn('text-sm', 'text-text')}>{highlight.sentence_text}</p>
            <p className={cn('mt-1 text-xs', cardDesc)}>{highlight.comment}</p>
            {highlight.suggested_rewrite && (
              <div className={cn('mt-2 rounded bg-surface-2 p-2')}>
                <p className={cn('text-xs', 'text-text-subtle')}>提案:</p>
                <p className={cn('text-sm', 'text-text')}>{highlight.suggested_rewrite}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 4次元評価 */}
      <div className="mb-4">
        <h4 className={cn('mb-2 font-semibold', cardTitle)}>4次元評価</h4>
        <div className="space-y-2">
          {feedback.dimensions.map((dim) => (
            <div key={dim.dimension} className={cn('rounded border border-border bg-surface p-2')}>
              <p className={cn('text-sm', 'text-text')}>
                <span className="font-semibold">{dim.dimension}</span>: {dim.short_comment} (Band: {dim.band_estimate})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Band-up Actions */}
      <div className="mb-4">
        <h4 className={cn('mb-2 font-semibold', cardTitle)}>Band向上のためのアクション</h4>
        <div className="space-y-2">
          {feedback.band_up_actions.map((action) => (
            <div key={action.priority} className={cn('rounded border border-border bg-surface p-3')}>
              <h5 className={cn('font-semibold', cardTitle)}>
                {action.priority}. {action.title}
              </h5>
              <p className={cn('mt-1 text-sm', cardDesc)}>{action.why}</p>
              <p className={cn('mt-1 text-sm', cardDesc)}>{action.how}</p>
              <p className={cn('mt-2 text-sm', 'text-text')}>{action.example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 数字検証結果 */}
      {feedback.number_validation && feedback.number_validation.has_mismatch && (
        <div className={cn('mb-4 rounded border-2 border-danger bg-danger/10 p-4')}>
          <h4 className={cn('mb-2 font-semibold', 'text-danger')}>数字の不一致</h4>
          <p className={cn('text-sm', 'text-danger')}>
            本文中の数字と登録した数字に不一致があります。確認してください。
          </p>
        </div>
      )}
    </div>
  );
}

