'use client';

import { useEffect, useState } from 'react';
import type { ProgressSummary } from '@/lib/domain/types';

export function Footer() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    fetch('/api/progress/summary')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setSummary(data.data);
        }
      })
      .catch(() => {
        // エラーは無視
      });
  }, []);

  return (
    <footer className="border-t border-border bg-surface/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between text-sm text-text-muted">
          <div>
            {summary && (
              <>
                <span>今日の進捗: {summary.total_attempts}件完了</span>
                {summary.latest_band_estimate && (
                  <span className="ml-4">
                    最新Band: {summary.latest_band_estimate}
                  </span>
                )}
              </>
            )}
          </div>
          <div>次のおすすめ: タスクを続ける</div>
        </div>
      </div>
    </footer>
  );
}

