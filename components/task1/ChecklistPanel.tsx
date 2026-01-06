/**
 * チェックリストパネル
 */

'use client';

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
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-semibold">チェックリスト</h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.key} className="flex items-center gap-2">
            <div
              className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                item.checked
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              {item.checked && (
                <svg className="h-3 w-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <span className={`text-sm ${item.checked ? 'text-gray-700' : 'text-gray-400'}`}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* 語数・段落数表示 */}
      {(wordCount !== undefined || paragraphCount !== undefined) && (
        <div className="mt-4 border-t border-gray-200 pt-4">
          {wordCount !== undefined && (
            <p className="text-sm text-gray-600">
              語数: <span className="font-semibold">{wordCount}</span>
            </p>
          )}
          {paragraphCount !== undefined && (
            <p className="text-sm text-gray-600">
              段落数: <span className="font-semibold">{paragraphCount}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

