/**
 * Final Review Panel
 * Step6の最終レビュー結果を表示（文単位ハイライト）
 */

'use client';

import type { Task1FinalReviewFeedback } from '@/lib/domain/types';

interface FinalReviewPanelProps {
  feedback: Task1FinalReviewFeedback;
  finalResponse: string;
}

export function FinalReviewPanel({ feedback, finalResponse }: FinalReviewPanelProps) {
  // 文単位で分割
  const sentences = finalResponse.split(/[.!?]+/).filter(s => s.trim().length > 0);

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">最終レビュー結果</h3>

      {/* Overall Band */}
      <div className="mb-4 rounded border border-gray-200 bg-white p-4">
        <h4 className="font-semibold">Overall Band: {feedback.overall_band_range}</h4>
      </div>

      {/* 文単位ハイライト */}
      <div className="mb-4 space-y-2">
        <h4 className="font-semibold">文単位フィードバック</h4>
        {feedback.sentence_highlights.map((highlight, index) => (
          <div
            key={index}
            className="rounded border border-gray-200 bg-white p-3"
          >
            <div className="mb-1 flex items-center gap-2">
              {highlight.tags.map((tag) => (
                <span
                  key={tag}
                  className={`rounded px-2 py-1 text-xs font-semibold ${
                    tag === 'TR'
                      ? 'bg-blue-100 text-blue-800'
                      : tag === 'CC'
                      ? 'bg-green-100 text-green-800'
                      : tag === 'LR'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-purple-100 text-purple-800'
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-700">{highlight.sentence_text}</p>
            <p className="mt-1 text-xs text-gray-600">{highlight.comment}</p>
            {highlight.suggested_rewrite && (
              <div className="mt-2 rounded bg-gray-50 p-2">
                <p className="text-xs text-gray-500">提案:</p>
                <p className="text-sm text-gray-700">{highlight.suggested_rewrite}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 4次元評価 */}
      <div className="mb-4">
        <h4 className="mb-2 font-semibold">4次元評価</h4>
        <div className="space-y-2">
          {feedback.dimensions.map((dim) => (
            <div key={dim.dimension} className="rounded border border-gray-200 bg-white p-2">
              <p className="text-sm">
                <span className="font-semibold">{dim.dimension}</span>: {dim.short_comment} (Band: {dim.band_estimate})
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Band-up Actions */}
      <div className="mb-4">
        <h4 className="mb-2 font-semibold">Band向上のためのアクション</h4>
        <div className="space-y-2">
          {feedback.band_up_actions.map((action) => (
            <div key={action.priority} className="rounded border border-gray-200 bg-white p-3">
              <h5 className="font-semibold">
                {action.priority}. {action.title}
              </h5>
              <p className="mt-1 text-sm text-gray-600">{action.why}</p>
              <p className="mt-1 text-sm text-gray-600">{action.how}</p>
              <p className="mt-2 text-sm text-gray-700">{action.example}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 数字検証結果 */}
      {feedback.number_validation && feedback.number_validation.has_mismatch && (
        <div className="mb-4 rounded border-2 border-red-300 bg-red-50 p-4">
          <h4 className="mb-2 font-semibold text-red-800">数字の不一致</h4>
          <p className="text-sm text-red-700">
            本文中の数字と登録した数字に不一致があります。確認してください。
          </p>
        </div>
      )}
    </div>
  );
}

