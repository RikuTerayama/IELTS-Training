/**
 * 数字ガードコンポーネント
 * 本文中の数字と登録数字を突合して警告を表示
 */

'use client';

import { useState, useEffect } from 'react';
import type { Task1KeyNumber } from '@/lib/domain/types';
import { extractNumbers } from '@/lib/utils/task1Helpers';

interface NumberGuardProps {
  text: string;
  keyNumbers: Task1KeyNumber[];
  onOverride?: () => void;
}

export function NumberGuard({ text, keyNumbers, onOverride }: NumberGuardProps) {
  const [mismatches, setMismatches] = useState<Array<{ extracted: string; registered?: string }>>([]);
  const [showOverride, setShowOverride] = useState(false);

  useEffect(() => {
    if (!text || keyNumbers.length === 0) {
      setMismatches([]);
      return;
    }

    const extracted = extractNumbers(text);
    const registered = keyNumbers.map(kn => ({
      value: String(kn.value) + (kn.unit || ''),
      context: kn.context,
    }));

    // 突合（簡易版：値が完全一致または部分一致するかチェック）
    const mismatches: Array<{ extracted: string; registered?: string }> = [];
    
    extracted.forEach((ext) => {
      const matched = registered.find((reg) => {
        // 値の部分一致をチェック（例: "50" と "50 million"）
        const extValue = ext.value.replace(/[^0-9.]/g, '');
        const regValue = reg.value.replace(/[^0-9.]/g, '');
        return extValue === regValue || reg.value.includes(ext.value) || ext.value.includes(reg.value);
      });

      if (!matched) {
        mismatches.push({ extracted: ext.value, registered: undefined });
      }
    });

    setMismatches(mismatches);
  }, [text, keyNumbers]);

  if (mismatches.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 rounded-lg border-2 border-red-300 bg-red-50 p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="font-semibold text-red-800">⚠️ 数字の不一致</h4>
        {onOverride && (
          <button
            onClick={() => {
              setShowOverride(true);
              onOverride();
            }}
            className="text-xs text-red-600 hover:text-red-800"
          >
            無視する
          </button>
        )}
      </div>
      <p className="mb-2 text-sm text-red-700">
        本文中に以下の数字が見つかりましたが、登録した数字と一致しません：
      </p>
      <ul className="list-disc pl-5 text-sm text-red-600">
        {mismatches.map((m, idx) => (
          <li key={idx}>
            {m.extracted} {m.registered && `(登録: ${m.registered})`}
          </li>
        ))}
      </ul>
      {showOverride && (
        <p className="mt-2 text-xs text-red-600">警告を無視しました</p>
      )}
    </div>
  );
}

