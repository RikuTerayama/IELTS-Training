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
          <div className="text-center text-slate-300">読み込み中...</div>
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
            <div className="rounded-lg border border-slate-300/50 bg-slate-800/50 backdrop-blur-sm p-6 shadow-lg">
              <h2 className="mb-4 text-lg font-semibold text-slate-100">弱点タグ</h2>
              <p className="text-slate-300">
                最近は{summary.weakness_tags.join(', ')}が弱め
              </p>
            </div>
          )}

          {/* Trainingセクション */}
          <div className="rounded-lg border border-slate-300/50 bg-slate-800/50 backdrop-blur-sm p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-slate-100">📚 Training</h2>
            <div className="space-y-4">
              {/* Writing */}
              <div>
                <h3 className="mb-3 text-md font-semibold text-slate-200">Writing</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push('/training/writing/task1')}
                    className="p-4 rounded-lg border-2 border-slate-600/50 bg-slate-700/30 hover:border-indigo-400/60 hover:bg-indigo-500/20 transition-all text-left"
                  >
                    <div className="font-semibold text-lg mb-1 text-slate-100">Task 1</div>
                    <div className="text-sm text-slate-400">グラフ・図表・地図の説明</div>
                  </button>
                  <button
                    onClick={() => router.push('/training/writing/task2')}
                    className="p-4 rounded-lg border-2 border-slate-600/50 bg-slate-700/30 hover:border-indigo-400/60 hover:bg-indigo-500/20 transition-all text-left"
                  >
                    <div className="font-semibold text-lg mb-1 text-slate-100">Task 2</div>
                    <div className="text-sm text-slate-400">エッセイライティング</div>
                  </button>
                </div>
              </div>

              {/* Speaking */}
              <div>
                <h3 className="mb-3 text-md font-semibold text-slate-200">Speaking（瞬間英作文）</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <button
                    onClick={() => router.push('/training/speaking/task1')}
                    className="p-4 rounded-lg border-2 border-slate-600/50 bg-slate-700/30 hover:border-violet-400/60 hover:bg-violet-500/20 transition-all text-left"
                  >
                    <div className="font-semibold text-lg mb-1 text-slate-100">Task 1</div>
                    <div className="text-sm text-slate-400">基本的な質問・自己紹介</div>
                  </button>
                  <button
                    onClick={() => router.push('/training/speaking/task2')}
                    className="p-4 rounded-lg border-2 border-slate-600/50 bg-slate-700/30 hover:border-violet-400/60 hover:bg-violet-500/20 transition-all text-left"
                  >
                    <div className="font-semibold text-lg mb-1 text-slate-100">Task 2</div>
                    <div className="text-sm text-slate-400">スピーチ・説明</div>
                  </button>
                  <button
                    onClick={() => router.push('/training/speaking/task3')}
                    className="p-4 rounded-lg border-2 border-slate-600/50 bg-slate-700/30 hover:border-violet-400/60 hover:bg-violet-500/20 transition-all text-left"
                  >
                    <div className="font-semibold text-lg mb-1 text-slate-100">Task 3</div>
                    <div className="text-sm text-slate-400">抽象的議論・意見</div>
                  </button>
                </div>
              </div>

              {/* Vocabulary */}
              <div>
                <h3 className="mb-3 text-md font-semibold text-slate-200">Vocabulary</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push('/training/vocabulary')}
                    className="p-4 rounded-lg border-2 border-slate-600/50 bg-slate-700/30 hover:border-emerald-400/60 hover:bg-emerald-500/20 transition-all text-left"
                  >
                    <div className="font-semibold text-lg mb-1 text-slate-100">単語練習</div>
                    <div className="text-sm text-slate-400">語彙力を向上させましょう</div>
                  </button>
                  <button
                    onClick={() => router.push('/training/vocabulary/review')}
                    className="p-4 rounded-lg border-2 border-slate-600/50 bg-slate-700/30 hover:border-emerald-400/60 hover:bg-emerald-500/20 transition-all text-left"
                  >
                    <div className="font-semibold text-lg mb-1 text-slate-100">復習</div>
                    <div className="text-sm text-slate-400">間違えた問題を復習</div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Blogセクション */}
          <div className="rounded-lg border border-slate-300/50 bg-slate-800/50 backdrop-blur-sm p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-slate-100">📝 Blog</h2>
            <p className="mb-4 text-slate-300">
              IELTS学習に役立つ記事や最新情報をお届けします
            </p>
            <a
              href="https://ieltsconsult.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-md bg-emerald-600/80 px-4 py-2 text-white hover:bg-emerald-600 transition-colors"
            >
              Blogを読む →
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}

