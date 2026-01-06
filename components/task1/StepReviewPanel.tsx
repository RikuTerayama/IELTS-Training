/**
 * Step Review Panel
 * Step1-5のレビュー結果を表示
 */

'use client';

import { useState } from 'react';
import type { Task1StepReviewFeedback } from '@/lib/domain/types';

interface StepReviewPanelProps {
  feedback: Task1StepReviewFeedback;
  originalSteps: Record<number, string>; // 元のStep内容（フォールバック用）
  onApply: (fixedSteps: Record<string, string>) => void;
}

export function StepReviewPanel({ feedback, originalSteps, onApply }: StepReviewPanelProps) {
  const [fixedSteps, setFixedSteps] = useState<Record<string, string>>({});

  const handleApply = () => {
    // 修正を適用する前に、各Stepの修正版をfixedStepsに設定
    const appliedSteps: Record<string, string> = {};
    feedback.step_feedbacks.forEach((stepFeedback) => {
      if (!stepFeedback.is_valid && stepFeedback.issues.length > 0) {
        // 最初のissueのexample_afterがあれば使用、なければ元のテキスト
        const fixedText = stepFeedback.issues[0]?.example_after || originalSteps[stepFeedback.step_index] || '';
        // 空文字列でない場合のみ追加
        if (fixedText && fixedText.trim().length > 0) {
          appliedSteps[String(stepFeedback.step_index)] = fixedText;
        }
      }
    });
    onApply(appliedSteps);
  };

  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">Step レビュー結果</h3>

      <div className="space-y-4">
        {feedback.step_feedbacks.map((stepFeedback) => (
          <div
            key={stepFeedback.step_index}
            className="rounded border border-gray-200 bg-white p-4"
          >
            <h4 className="mb-2 font-semibold">
              Step {stepFeedback.step_index}
              {stepFeedback.is_valid ? (
                <span className="ml-2 text-green-600">✓ 良好</span>
              ) : (
                <span className="ml-2 text-red-600">⚠ 要修正</span>
              )}
            </h4>

            {stepFeedback.issues.length > 0 && (
              <div className="mb-2">
                <p className="text-sm font-medium text-gray-700">指摘事項:</p>
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {stepFeedback.issues.map((issue, idx) => (
                    <li key={idx}>
                      <span className="font-medium">[{issue.category}]</span> {issue.description}
                      {issue.suggestion && (
                        <div className="mt-1 text-gray-500">
                          提案: {issue.suggestion}
                        </div>
                      )}
                      {issue.example_before && issue.example_after && (
                        <div className="mt-1 text-xs text-gray-500">
                          例: {issue.example_before} → {issue.example_after}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {stepFeedback.strengths && stepFeedback.strengths.length > 0 && (
              <div>
                <p className="text-sm font-medium text-green-700">良い点:</p>
                <ul className="list-disc pl-5 text-sm text-green-600">
                  {stepFeedback.strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 最重要修正点 */}
      {feedback.top_priority_fix && (
        <div className="mt-4 rounded border-2 border-red-300 bg-red-50 p-4">
          <h4 className="mb-2 font-semibold text-red-800">最重要修正点</h4>
          <p className="text-sm text-red-700">
            Step {feedback.top_priority_fix.step_index}: {feedback.top_priority_fix.issue}
          </p>
          <p className="mt-2 text-sm text-red-600">
            {feedback.top_priority_fix.fix_guidance}
          </p>
        </div>
      )}

      <button
        onClick={handleApply}
        className="mt-4 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        修正を適用してStep 6へ進む
      </button>
    </div>
  );
}

