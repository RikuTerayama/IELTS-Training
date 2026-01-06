/**
 * Step Review Panel
 * Step1-5のレビュー結果を表示
 */

'use client';

import { useState } from 'react';
import { cn, cardBase, cardTitle, cardDesc, buttonPrimary } from '@/lib/ui/theme';
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
    <div className={cn('p-6', cardBase, 'border-accent-indigo bg-accent-indigo/10')}>
      <h3 className={cn('mb-4 text-lg font-semibold', cardTitle)}>Step レビュー結果</h3>

      <div className="space-y-4">
        {feedback.step_feedbacks.map((stepFeedback) => (
          <div
            key={stepFeedback.step_index}
            className={cn('rounded border border-border bg-surface p-4')}
          >
            <h4 className={cn('mb-2 font-semibold', cardTitle)}>
              Step {stepFeedback.step_index}
              {stepFeedback.is_valid ? (
                <span className={cn('ml-2', 'text-success')}>✓ 良好</span>
              ) : (
                <span className={cn('ml-2', 'text-danger')}>⚠ 要修正</span>
              )}
            </h4>

            {stepFeedback.issues.length > 0 && (
              <div className="mb-2">
                <p className={cn('text-sm font-medium', cardTitle)}>指摘事項:</p>
                <ul className={cn('list-disc pl-5 text-sm', cardDesc)}>
                  {stepFeedback.issues.map((issue, idx) => (
                    <li key={idx}>
                      <span className="font-medium">[{issue.category}]</span> {issue.description}
                      {issue.suggestion && (
                        <div className={cn('mt-1', 'text-text-subtle')}>
                          提案: {issue.suggestion}
                        </div>
                      )}
                      {issue.example_before && issue.example_after && (
                        <div className={cn('mt-1 text-xs', 'text-text-subtle')}>
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
                <p className={cn('text-sm font-medium', 'text-success')}>良い点:</p>
                <ul className={cn('list-disc pl-5 text-sm', 'text-success')}>
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
        <div className={cn('mt-4 rounded border-2 border-danger bg-danger/10 p-4')}>
          <h4 className={cn('mb-2 font-semibold', 'text-danger')}>最重要修正点</h4>
          <p className={cn('text-sm', 'text-danger')}>
            Step {feedback.top_priority_fix.step_index}: {feedback.top_priority_fix.issue}
          </p>
          <p className={cn('mt-2 text-sm', 'text-danger')}>
            {feedback.top_priority_fix.fix_guidance}
          </p>
        </div>
      )}

      <button
        onClick={handleApply}
        className={cn('mt-4 px-4 py-2', buttonPrimary, 'bg-success hover:bg-success-hover')}
      >
        修正を適用してStep 6へ進む
      </button>
    </div>
  );
}

