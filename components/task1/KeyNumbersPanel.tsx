/**
 * 数字登録パネル
 */

'use client';

import { useState } from 'react';
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
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-semibold">登録した数字</h3>

      {/* 登録フォーム */}
      <div className="mb-4 space-y-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="数字（例: 50）"
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
        />
        <input
          type="text"
          value={unit}
          onChange={(e) => setUnit(e.target.value)}
          placeholder="単位（例: million, %）"
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
        />
        <input
          type="text"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="文脈（例: Population in 2020）"
          className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
        />
        <button
          onClick={handleAdd}
          className="w-full rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
        >
          追加
        </button>
      </div>

      {/* 登録済み数字リスト */}
      <div className="space-y-2">
        {keyNumbers.map((kn, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded border border-gray-200 bg-gray-50 p-2"
          >
            <div className="text-sm">
              <span className="font-medium">{kn.value}</span>
              {kn.unit && <span className="text-gray-600"> {kn.unit}</span>}
              <span className="text-gray-500"> - {kn.context}</span>
            </div>
            <button
              onClick={() => handleRemove(index)}
              className="text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

