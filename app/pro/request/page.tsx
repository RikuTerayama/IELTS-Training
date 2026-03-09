'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, cardTitle, textareaBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';
import type { ApiResponse } from '@/lib/api/response';

type ProRequestRow = {
  id: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  reason: string | null;
  expected_usage: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const INTENDED_USAGE_OPTIONS = [
  { value: 'light', label: 'Light - a few times per week' },
  { value: 'weekly', label: 'Weekly - regular practice' },
  { value: 'daily', label: 'Daily - intensive preparation' },
] as const;

export default function ProRequestPage() {
  const [existingRequest, setExistingRequest] = useState<ProRequestRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);
  const [intendedUsage, setIntendedUsage] = useState<string>('weekly');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/pro/requests')
      .then((res) => {
        if (res.status === 401) {
          setUnauthorized(true);
          return null;
        }
        return res.json();
      })
      .then((data: ApiResponse<ProRequestRow | null> | null) => {
        if (data && data.ok && data.data) {
          setExistingRequest(data.data);
        }
      })
      .catch(() => setUnauthorized(true))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/pro/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expected_usage: intendedUsage,
          reason: reason.trim() || undefined,
          notes: notes.trim() || undefined,
        }),
      });

      const data = (await res.json()) as ApiResponse<ProRequestRow> & { error?: { code?: string } };
      if (data.ok && data.data) {
        setExistingRequest(data.data);
        setSubmitSuccess(true);
      } else if (data.error?.code === 'ALREADY_REQUESTED') {
        setSubmitError('A pending request already exists. Please wait for approval.');
      } else if (res.status === 401) {
        setUnauthorized(true);
      } else {
        setSubmitError(data.error?.message || 'Failed to submit request.');
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isPending = existingRequest?.status === 'pending';

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-xl">
          <div className="text-center text-text-muted">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (unauthorized) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 max-w-xl">
          <div className={cn('p-6 rounded-2xl', cardBase)}>
            <h2 className={cn('mb-4 text-lg font-semibold', cardTitle)}>Request Pro</h2>
            <p className="mb-4 text-sm text-text-muted">
              Please log in to submit a Pro request.
            </p>
            <Link href="/login" className={cn(buttonPrimary, 'inline-flex')}>
              Go to Login
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-xl">
        <div className="space-y-6">
          <div>
            <h1 className={cn('mb-2 text-2xl font-bold', cardTitle)}>Request Pro</h1>
            <p className="text-sm text-text-muted">
              Pro removes daily limits and unlocks full features.
            </p>
          </div>

          {isPending && (
            <div className={cn('p-6 rounded-2xl', cardBase, 'border-amber-200 bg-amber-50/80')}>
              <h3 className="mb-2 font-semibold text-amber-900">Application pending</h3>
              <p className="text-sm text-amber-800">
                Your Pro request has been submitted. We will review it and get back to you shortly.
              </p>
              <p className="mt-2 text-xs text-amber-700">
                Requested at: {new Date(existingRequest!.created_at).toLocaleString()}
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/home" className={cn(buttonSecondary, 'inline-flex')}>
                  Back to Home
                </Link>
              </div>
            </div>
          )}

          {submitSuccess && !isPending && (
            <div className={cn('p-6 rounded-2xl', cardBase, 'border-green-200 bg-green-50/80')}>
              <h3 className="mb-2 font-semibold text-green-900">Request submitted</h3>
              <p className="text-sm text-green-800">
                Your Pro request has been submitted. We will review it and get back to you shortly.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/home" className={cn(buttonPrimary, 'inline-flex')}>
                  Back to Home
                </Link>
              </div>
            </div>
          )}

          {!isPending && !submitSuccess && (
            <form onSubmit={handleSubmit} className={cn('p-6 rounded-2xl space-y-4', cardBase)}>
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Intended usage
                </label>
                <select
                  value={intendedUsage}
                  onChange={(e) => setIntendedUsage(e.target.value)}
                  className="w-full rounded-lg border border-border bg-surface text-text px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                >
                  {INTENDED_USAGE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Reason <span className="text-text-muted">(optional)</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className={textareaBase}
                  placeholder="Why do you need Pro? (e.g. exam date, usage goals)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Notes <span className="text-text-muted">(optional)</span>
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className={textareaBase}
                  placeholder="Additional information"
                />
              </div>
              {submitError && (
                <p className="text-sm text-red-600">{submitError}</p>
              )}
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className={cn(buttonPrimary, submitting && 'opacity-50 cursor-not-allowed')}
                >
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
                <Link href="/home" className={cn(buttonSecondary, 'inline-flex')}>
                  Back to Home
                </Link>
              </div>
            </form>
          )}

          {existingRequest && existingRequest.status !== 'pending' && !submitSuccess && (
            <div className="text-sm text-text-muted">
              Previous status: {existingRequest.status}. You can submit a new request above.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

