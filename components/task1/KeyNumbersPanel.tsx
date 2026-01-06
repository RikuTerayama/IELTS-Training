/**
 * 数字登録パネル
 */

'use client';

import { useState } from 'react';
import { cn, cardBase, cardTitle, inputBase, buttonPrimary, badgeBase } from '@/lib/ui/theme';
import type { Task1KeyNumber } from '@/lib/domain/types';

interface KeyNumbersPanelProps {
  keyNumbers: Task1KeyNumber[];
  onNumbersChange?: (numbers: Task1KeyNumber[]) => void;
}

export function KeyNumbersPanel({ keyNumbers, onNumbersChange }: KeyNumbersPanelProps) {
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [context, setContext] = useState('');

  const handleAdd = () => {
    if (!value || !context) return;

    const newNumber: Task1KeyNumber = {
      value: value,
      unit: unit || undefined,
      context: context,
    };

    const updated = [...keyNumbers, newNumber];
    if (onNumbersChange) {
      onNumbersChange(updated);
    }

    // フォームをリセット
    setValue('');
    setUnit('');
    setContext('');
  };

  const handleRemove = (index: number) => {
    const updated = keyNumbers.filter((_, i) => i !== index);
    if (onNumbersChange) {
      onNumbersChange(updated);
    }
  };

  return (
    <div className={cn('p-4', cardBase)}>
      <h3 className={cn('mb-3 font-semibold', cardTitle)}>登録した数字</h3>

      {/* 登録フォーム */}
      <div className="mb-4 space-y-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="数字（例: 50）"
          className={cn(inputBase, 'px-2 py-1 text-sm')}
        />
        <input
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="単位（例: million, %）"
          className={cn(inputBase, 'px-2 py-1 text-sm')}
        />
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="文脈（例: Population in 2020）"
          className={cn(inputBase, 'px-2 py-1 text-sm')}
        />
        <button
          onClick={handleAdd}
          className={cn('w-full px-3 py-1 text-sm', buttonPrimary)}
        >
          追加
        </button>
      </div>

      {/* 登録済み数字リスト */}
      <div className="space-y-2">
        {keyNumbers.map((kn, index) => (
          <div
            key={index}
            className={cn('flex items-center justify-between rounded border border-border bg-surface-2 p-2')}
          >
            <div className="text-sm text-text">
              <span className="font-medium">{kn.value}</span>
              {kn.unit && <span className="text-text-muted"> {kn.unit}</span>}
              <span className="text-text-subtle"> - {kn.context}</span>
            </div>
            <button
              onClick={() => handleRemove(index)}
              className="text-danger hover:text-danger-hover"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

