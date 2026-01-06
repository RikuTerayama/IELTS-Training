/**
 * チェックリストパネル
 */

'use client';

import { cn, cardBase, cardTitle, cardDesc } from '@/lib/ui/theme';

interface ChecklistPanelProps {
  checklist: {
    has_overview?: boolean;
    has_comparison?: boolean;
    has_numbers?: boolean;
    has_paragraphs?: boolean;
    word_count_ok?: boolean;
    tense_consistent?: boolean;
  };
  wordCount?: number;
  paragraphCount?: number;
}

export function ChecklistPanel({ checklist, wordCount, paragraphCount }: ChecklistPanelProps) {
  const items = [
    { key: 'has_overview', label: 'Overviewがある', checked: checklist.has_overview },
    { key: 'has_comparison', label: '比較表現がある', checked: checklist.has_comparison },
    { key: 'has_numbers', label: '数字の根拠がある', checked: checklist.has_numbers },
    { key: 'has_paragraphs', label: '段落がある（2段落以上）', checked: checklist.has_paragraphs },
    { key: 'word_count_ok', label: '語数が適切（100-250語）', checked: checklist.word_count_ok },
    { key: 'tense_consistent', label: '時制が一貫している', checked: checklist.tense_consistent },
  ];

  return (
    <div className={cn('p-4', cardBase)}>
      <h3 className={cn('mb-3 font-semibold', cardTitle)}>チェックリスト</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <div
              className={cn('h-5 w-5 rounded border-2 flex items-center justify-center', 
                item.checked
                  ? 'border-success bg-success-bg'
                  : 'border-border bg-surface-2'
              )}
            >
              {item.checked && (
                <svg className={cn('h-3 w-3', 'text-success')} fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className={cn('text-sm', item.checked ? 'text-text' : 'text-text-subtle')}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* 語数・段落数表示 */}
      {(wordCount !== undefined || paragraphCount !== undefined) && (
        <div className={cn('mt-4 border-t border-border pt-4')}>
          {wordCount !== undefined && (
            <p className={cardDesc}>
              語数: <span className="font-semibold text-text">{wordCount}</span>
            </p>
          )}
          {paragraphCount !== undefined && (
            <p className={cardDesc}>
              段落数: <span className="font-semibold text-text">{paragraphCount}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

