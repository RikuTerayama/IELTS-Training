'use client';

// Step0: Progress依存を断つため、進捗サマリーの取得をコメントアウト
// import { useEffect, useState } from 'react';
// import type { ProgressSummary } from '@/lib/domain/types';

export function Footer() {
  // Step0: Progress依存を断つため、進捗サマリーの取得をコメントアウト
  // const [summary, setSummary] = useState<ProgressSummary | null>(null);

  // useEffect(() => {
  //   fetch('/api/progress/summary')
  //     .then((res) => res.json())
  //     .then((data) => {
  //       if (data.ok) {
  //         setSummary(data.data);
  //       }
  //     })
  //     .catch(() => {
  //       // エラーは無視
  //     });
  // }, []);

  return (
    <footer className="border-t border-border bg-bg-secondary min-w-0">
      <div className="container mx-auto min-w-0 max-w-full px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-small text-text-muted">
          <div>
            {/* Step0: Progress依存を断つため、進捗表示をコメントアウト */}
            {/* {summary && (
              <>
                <span>今日の進捗: {summary.total_attempts}件完了</span>
                {summary.latest_band_estimate && (
                  <span className="ml-4">
                    最新Band: {summary.latest_band_estimate}
                  </span>
                )}
              </>
            )} */}
          </div>
          <div className="text-text-subtle">次のおすすめ: タスクを続ける</div>
        </div>
      </div>
    </footer>
  );
}

