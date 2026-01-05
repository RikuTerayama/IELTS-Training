'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import type { ProgressSummary } from '@/lib/domain/types';

export default function HomePage() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 進捗サマリー取得
    fetch('/api/progress/summary')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setSummary(data.data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-text-muted">読み込み中...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* カード2: 弱点タグ */}
          {summary && summary.weakness_tags.length > 0 && (
            <div className="rounded-lg border border-border bg-surface p-6 shadow-theme-lg backdrop-blur-sm">
              <h2 className="mb-4 text-lg font-semibold text-text">弱点タグ</h2>
              <p className="text-text-muted">
                最近は{summary.weakness_tags.join(', ')}が弱め
              </p>
            </div>
          )}

          {/* Trainingセクション */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-theme-lg backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-text">📚 Training</h2>
            <div className="space-y-4">
              {/* Writing */}
              <div>
                <h3 className="mb-3 text-md font-semibold text-text">Writing</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push('/training/writing/task1')}
                    className="p-4 rounded-lg border-2 border-border bg-surface-2 hover:border-accent-indigo hover:bg-accent-indigo/10 transition-all duration-200 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    <div className="font-semibold text-lg mb-1 text-text">Task 1</div>
                    <div className="text-sm text-text-muted">グラフ・図表・地図の説明</div>
                  </button>
                  <button
                    onClick={() => router.push('/training/writing/task2')}
                    className="p-4 rounded-lg border-2 border-border bg-surface-2 hover:border-accent-indigo hover:bg-accent-indigo/10 transition-all duration-200 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    <div className="font-semibold text-lg mb-1 text-text">Task 2</div>
                    <div className="text-sm text-text-muted">エッセイライティング</div>
                  </button>
                </div>
              </div>

              {/* Speaking */}
              <div>
                <h3 className="mb-3 text-md font-semibold text-text">Speaking（瞬間英作文）</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <button
                    onClick={() => router.push('/training/speaking/task1')}
                    className="p-4 rounded-lg border-2 border-border bg-surface-2 hover:border-accent-violet hover:bg-accent-violet/10 transition-all duration-200 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    <div className="font-semibold text-lg mb-1 text-text">Task 1</div>
                    <div className="text-sm text-text-muted">基本的な質問・自己紹介</div>
                  </button>
                  <button
                    onClick={() => router.push('/training/speaking/task2')}
                    className="p-4 rounded-lg border-2 border-border bg-surface-2 hover:border-accent-violet hover:bg-accent-violet/10 transition-all duration-200 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    <div className="font-semibold text-lg mb-1 text-text">Task 2</div>
                    <div className="text-sm text-text-muted">スピーチ・説明</div>
                  </button>
                  <button
                    onClick={() => router.push('/training/speaking/task3')}
                    className="p-4 rounded-lg border-2 border-border bg-surface-2 hover:border-accent-violet hover:bg-accent-violet/10 transition-all duration-200 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    <div className="font-semibold text-lg mb-1 text-text">Task 3</div>
                    <div className="text-sm text-text-muted">抽象的議論・意見</div>
                  </button>
                </div>
              </div>

              {/* Vocabulary */}
              <div>
                <h3 className="mb-3 text-md font-semibold text-text">Vocabulary</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push('/training/vocabulary')}
                    className="p-4 rounded-lg border-2 border-border bg-surface-2 hover:border-accent-emerald hover:bg-accent-emerald/10 transition-all duration-200 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    <div className="font-semibold text-lg mb-1 text-text">単語練習</div>
                    <div className="text-sm text-text-muted">語彙力を向上させましょう</div>
                  </button>
                  <button
                    onClick={() => router.push('/training/vocabulary/review')}
                    className="p-4 rounded-lg border-2 border-border bg-surface-2 hover:border-accent-emerald hover:bg-accent-emerald/10 transition-all duration-200 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                  >
                    <div className="font-semibold text-lg mb-1 text-text">復習</div>
                    <div className="text-sm text-text-muted">間違えた問題を復習</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Blogセクション */}
          <div className="rounded-lg border border-border bg-surface p-6 shadow-theme-lg backdrop-blur-sm">
            <h2 className="mb-4 text-lg font-semibold text-text">📝 Blog</h2>
            <p className="mb-4 text-text-muted">
              IELTS学習に役立つ記事や最新情報をお届けします
            </p>
            <a
              href="https://ieltsconsult.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md bg-accent-emerald px-4 py-2 text-accent-emerald-foreground hover:bg-accent-emerald-hover transition-colors duration-200"
            >
              Blogを読む →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

