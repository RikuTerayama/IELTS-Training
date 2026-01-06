/**
 * 比較フレーズ集パネル（Trainingモードのみ）
 */

'use client';

import { useState } from 'react';

const COMPARISON_PHRASES = [
  { phrase: 'compared to', translation: 'と比較して' },
  { phrase: 'in contrast', translation: '対照的に' },
  { phrase: 'whereas', translation: '一方で' },
  { phrase: 'while', translation: '一方で' },
  { phrase: 'however', translation: 'しかし' },
  { phrase: 'on the other hand', translation: '一方で' },
  { phrase: 'similarly', translation: '同様に' },
  { phrase: 'likewise', translation: '同様に' },
  { phrase: 'more than', translation: 'より多い' },
  { phrase: 'less than', translation: 'より少ない' },
  { phrase: 'higher than', translation: 'より高い' },
  { phrase: 'lower than', translation: 'より低い' },
];

interface ComparisonPhrasesPanelProps {
  onInsert?: (phrase: string) => void;
}

export function ComparisonPhrasesPanel({ onInsert }: ComparisonPhrasesPanelProps) {
  const [selectedPhrase, setSelectedPhrase] = useState<string | null>(null);

  const handleClick = (phrase: string) => {
    setSelectedPhrase(phrase);
    if (onInsert) {
      onInsert(phrase);
    }
    // 選択状態をリセット
    setTimeout(() => setSelectedPhrase(null), 200);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-semibold">比較フレーズ集</h3>
      <div className="grid grid-cols-2 gap-2">
        {COMPARISON_PHRASES.map((item) => (
          <button
            key={item.phrase}
            onClick={() => handleClick(item.phrase)}
            className={`rounded border p-2 text-left text-sm transition-colors ${
              selectedPhrase === item.phrase
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{item.phrase}</div>
            <div className="text-xs text-gray-500">{item.translation}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

