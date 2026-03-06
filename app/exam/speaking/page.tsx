'use client';

import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';

/**
 * Speaking AI Interviewer のプレースホルダ。
 * Home の Exam Mode では CTA を disabled にしているが、直リンク用の受け皿。
 */
export default function ExamSpeakingPlaceholderPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-2xl text-center">
        <h1 className="text-xl font-bold text-text mb-4">Speaking AI Interviewer</h1>
        <p className="text-text-muted mb-6">Speaking AI Interviewer is coming soon.</p>
        <Link
          href="/home"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 text-white px-4 py-2 font-semibold hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Back to Home
        </Link>
      </div>
    </Layout>
  );
}
