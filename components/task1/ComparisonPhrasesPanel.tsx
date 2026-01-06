/**
 * 比較フレーズ集パネル（Trainingモードのみ）
 */

'use client';

import { useState } from 'react';
import { cn, cardBase, cardTitle, cardDesc } from '@/lib/ui/theme';

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
    <div className={cn('p-4', cardBase)}>
      <h3 className={cn('mb-3 font-semibold', cardTitle)}>比較フレーズ集</h3>
      <div className="grid grid-cols-2 gap-2">
        {COMPARISON_PHRASES.map((item) => (
          <button
            key={item.phrase}
            onClick={() => handleClick(item.phrase)}
            className={cn(
              'rounded border p-2 text-left text-sm transition-colors',
              selectedPhrase === item.phrase
                ? 'border-primary bg-accent-indigo/10'
                : 'border-border hover:bg-surface-2'
            )}
          >
            <div className={cn('font-medium', 'text-text')}>{item.phrase}</div>
            <div className={cn('text-xs', cardDesc)}>{item.translation}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

