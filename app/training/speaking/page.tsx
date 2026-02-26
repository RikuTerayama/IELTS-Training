'use client';

import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, cardTitle, cardDesc, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';

type Step = 'topic' | 'input' | 'result';

interface RequiredItem {
  module: 'lexicon' | 'idiom' | 'vocab';
  item_id: string;
  skill: 'writing' | 'speaking';
  category: string;
  expression: string;
  ja_hint?: string;
}

interface InputItemsResponse {
  date: string;
  items: RequiredItem[];
}

interface SubmitResponse {
  used: Array<{ module: string; item_id: string; expression: string }>;
  missing: Array<{ module: string; item_id: string; expression: string }>;
  usage_rate: number;
}

// 固定のトピック候補
const TOPICS = [
  'Describe a person who has influenced you',
  'Talk about your favorite hobby',
  'Describe a place you would like to visit',
  'Talk about a memorable event',
  'Describe your ideal job',
  'Talk about a book or movie you enjoyed',
  'Describe a skill you would like to learn',
  'Talk about your hometown',
  'Describe a gift you received',
  'Talk about a goal you want to achieve',
];

export default function SpeakingPage() {
  const [step, setStep] = useState<Step>('topic');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [requiredItems, setRequiredItems] = useState<RequiredItem[]>([]);
  const [content, setContent] = useState('');
  const [submitResult, setSubmitResult] = useState<SubmitResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step A: topic選択
  const handleTopicSelect = async (topic: string) => {
    setSelectedTopic(topic);
    setLoading(true);
    setError(null);

    try {
      // Required Itemsを取得
      const response = await fetch('/api/input/items?skill=speaking&modules=vocab,idiom&limit=5');
      const data = await response.json();

      if (data.ok && data.data) {
        setRequiredItems(data.data.items);
        setStep('input');
      } else {
        setError(data.error?.message || 'Failed to fetch required items');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Step C: Submit
  const handleSubmit = async () => {
    if (!content.trim() || !selectedTopic) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/output/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          output_type: 'speaking',
          content: content.trim(),
          required_items: requiredItems.map(item => ({
            module: item.module,
            item_id: item.item_id,
            expression: item.expression,
          })),
          meta: {
            topic: selectedTopic,
          },
        }),
      });

      const data = await response.json();

      if (data.ok && data.data) {
        setSubmitResult(data.data);
        setStep('result');
      } else {
        setError(data.error?.message || 'Failed to submit');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className={cn('text-2xl font-bold mb-2', cardTitle)}>Speaking練習</h1>
          <p className={cn('text-sm', cardDesc)}>必須表現を使って話す練習をしましょう</p>
        </div>

        {error && (
          <div className={cn('mb-4 p-4 rounded-lg', cardBase, 'bg-danger/10 border-danger')}>
            <p className="text-danger">{error}</p>
          </div>
        )}

        {/* Step A: topic選択 */}
        {step === 'topic' && (
          <div className="space-y-4">
            <h2 className={cn('text-lg font-semibold mb-4', cardTitle)}>トピックを選択</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {TOPICS.map((topic, idx) => (
                <button
                  key={idx}
                  onClick={() => handleTopicSelect(topic)}
                  disabled={loading}
                  className={cn(
                    'p-4 rounded-lg border-2 border-border bg-surface-2 text-left',
                    'hover:border-primary hover:bg-accent-indigo/10',
                    'transition-all duration-200',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring',
                    loading && 'opacity-50 cursor-not-allowed'
                  )}
                >
                  <div className={cn('font-semibold', cardTitle)}>{topic}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step B: Required Items表示 + 入力 */}
        {step === 'input' && requiredItems.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => {
                  setStep('topic');
                  setSelectedTopic(null);
                  setRequiredItems([]);
                  setContent('');
                }}
                className={cn('text-sm', buttonSecondary)}
              >
                ← 戻る
              </button>
              <h2 className={cn('text-lg font-semibold', cardTitle)}>必須表現を使って回答</h2>
            </div>

            {/* Required Items表示 */}
            <div className={cn('p-4 rounded-lg', cardBase)}>
              <h3 className={cn('font-semibold mb-3', cardTitle)}>必須使用表現（{requiredItems.length}個）</h3>
              <div className="space-y-2">
                {requiredItems.map((item, idx) => (
                  <div key={idx} className={cn('text-sm', cardDesc)}>
                    <span className="font-semibold">{item.expression}</span>
                    {item.ja_hint && <span className="ml-2">（{item.ja_hint}）</span>}
                    <span className="ml-2 text-xs">[{item.module}]</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic表示 */}
            <div className={cn('p-4 rounded-lg', cardBase)}>
              <h3 className={cn('font-semibold mb-2', cardTitle)}>トピック</h3>
              <p className={cn('text-sm', cardDesc)}>{selectedTopic}</p>
            </div>

            {/* 入力欄 */}
            <div className={cn('p-4 rounded-lg', cardBase)}>
              <h3 className={cn('font-semibold mb-2', cardTitle)}>回答</h3>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                disabled={loading}
                rows={10}
                className={cn(
                  'w-full px-4 py-2 rounded-lg border border-border bg-surface-2 text-text',
                  'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                  'disabled:opacity-50',
                  'transition-all duration-200'
                )}
                placeholder="必須表現を使って回答を入力してください..."
              />
            </div>

            {/* Submitボタン */}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={loading || !content.trim()}
                className={cn('px-6 py-3', buttonPrimary, (loading || !content.trim()) && 'opacity-50 cursor-not-allowed')}
              >
                {loading ? '送信中...' : '提出'}
              </button>
            </div>
          </div>
        )}

        {/* Step C: 結果表示 */}
        {step === 'result' && submitResult && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => {
                  setStep('topic');
                  setSelectedTopic(null);
                  setRequiredItems([]);
                  setContent('');
                  setSubmitResult(null);
                }}
                className={cn('text-sm', buttonSecondary)}
              >
                ← 最初に戻る
              </button>
              <h2 className={cn('text-lg font-semibold', cardTitle)}>結果</h2>
            </div>

            {/* 使用率 */}
            <div className={cn('p-4 rounded-lg', cardBase)}>
              <h3 className={cn('font-semibold mb-2', cardTitle)}>使用率</h3>
              <div className="text-2xl font-bold mb-2">
                {Math.round(submitResult.usage_rate * 100)}%
              </div>
              <div className={cn('text-sm', cardDesc)}>
                使用: {submitResult.used.length} / {requiredItems.length} 個
              </div>
            </div>

            {/* 使用できた表現 */}
            {submitResult.used.length > 0 && (
              <div className={cn('p-4 rounded-lg', cardBase, 'bg-success/10 border-success')}>
                <h3 className={cn('font-semibold mb-2', cardTitle)}>✓ 使用できた表現</h3>
                <div className="space-y-1">
                  {submitResult.used.map((item, idx) => (
                    <div key={idx} className={cn('text-sm', cardDesc)}>
                      <span className="font-semibold">{item.expression}</span>
                      <span className="ml-2 text-xs">[{item.module}]</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 使用できなかった表現 */}
            {submitResult.missing.length > 0 && (
              <div className={cn('p-4 rounded-lg', cardBase, 'bg-danger/10 border-danger')}>
                <h3 className={cn('font-semibold mb-2', cardTitle)}>✗ 使用できなかった表現</h3>
                <div className="space-y-1">
                  {submitResult.missing.map((item, idx) => {
                    const requiredItem = requiredItems.find(ri => ri.item_id === item.item_id);
                    return (
                      <div key={idx} className={cn('text-sm', cardDesc)}>
                        <span className="font-semibold">{item.expression}</span>
                        {requiredItem?.ja_hint && <span className="ml-2">（{requiredItem.ja_hint}）</span>}
                        <span className="ml-2 text-xs">[{item.module}]</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {loading && step === 'topic' && (
          <div className="text-center text-text-muted">読み込み中...</div>
        )}
      </div>
    </Layout>
  );
}
