'use client';

import { useEffect, useState, useCallback, Fragment } from 'react';
import { Layout } from '@/components/layout/Layout';
import { cn, cardBase, buttonPrimary, buttonSecondary } from '@/lib/ui/theme';
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

const MAX_REASON_LENGTH = 80;

function truncate(s: string | null, max: number): string {
  if (!s) return '-';
  if (s.length <= max) return s;
  return s.slice(0, max) + '...';
}

export default function AdminProRequestsPage() {
  const [rows, setRows] = useState<ProRequestRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<Record<string, string>>({});
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/pro-requests');
      const data = (await res.json()) as ApiResponse<ProRequestRow[]>;
      if (res.status === 401 || res.status === 403) {
        setError('Not authorized');
        setRows([]);
      } else if (data.ok && Array.isArray(data.data)) {
        setRows(data.data);
      } else {
        setError(data.error?.message || 'Failed to load');
      }
    } catch {
      setError('Network error');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
    setActioningId(requestId);
    setActionError((prev) => ({ ...prev, [requestId]: '' }));
    try {
      const res = await fetch(`/api/admin/pro-requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setRows((prev) => prev.filter((r) => r.id !== requestId));
      } else {
        setActionError((prev) => ({
          ...prev,
          [requestId]: data.error?.message || `Failed to ${action}`,
        }));
      }
    } catch {
      setActionError((prev) => ({
        ...prev,
        [requestId]: 'Network error',
      }));
    } finally {
      setActioningId(null);
    }
  };

  const copyUserId = (userId: string) => {
    navigator.clipboard.writeText(userId);
  };

  if (loading && rows.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-text-muted">Loading...</div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className={cn('p-6 rounded-2xl', cardBase, 'border-red-200 bg-red-50')}>
            <h2 className="mb-2 text-lg font-semibold text-red-800">Pro Requests</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-text">Pro Requests (pending)</h1>
          <button
            type="button"
            onClick={() => fetchList()}
            className={cn(buttonSecondary)}
          >
            Refresh
          </button>
        </div>

        {rows.length === 0 ? (
          <div className={cn('p-6 rounded-2xl', cardBase)}>
            <p className="text-text-muted">No pending requests.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse rounded-2xl border border-border bg-surface text-left text-sm shadow-sm">
              <thead>
                <tr className="border-b border-border bg-surface-2">
                  <th className="px-4 py-3 font-semibold text-text">Requested at</th>
                  <th className="px-4 py-3 font-semibold text-text">user_id</th>
                  <th className="px-4 py-3 font-semibold text-text">expected_usage</th>
                  <th className="px-4 py-3 font-semibold text-text">reason</th>
                  <th className="px-4 py-3 font-semibold text-text">status</th>
                  <th className="px-4 py-3 font-semibold text-text">actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <Fragment key={row.id}>
                    <tr className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                        {new Date(row.created_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="break-all font-mono text-xs text-text">{row.user_id}</span>
                        <button
                          type="button"
                          onClick={() => copyUserId(row.user_id)}
                          className="ml-2 rounded border border-border px-2 py-0.5 text-xs hover:bg-surface-2"
                        >
                          Copy
                        </button>
                      </td>
                      <td className="px-4 py-3 text-text">{row.expected_usage ?? '-'}</td>
                      <td className="max-w-[200px] px-4 py-3 text-text-muted" title={row.reason ?? undefined}>
                        {truncate(row.reason, MAX_REASON_LENGTH)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-amber-100 px-2 py-0.5 text-amber-800 text-xs font-medium">
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleAction(row.id, 'approve')}
                            disabled={actioningId === row.id}
                            className={cn(buttonPrimary, '!bg-green-600 hover:!bg-green-700', actioningId === row.id && 'opacity-50')}
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAction(row.id, 'reject')}
                            disabled={actioningId === row.id}
                            className={cn(buttonSecondary, actioningId === row.id && 'opacity-50')}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                    {actionError[row.id] && (
                      <tr className="border-b border-border bg-red-50/50">
                        <td colSpan={6} className="px-4 py-2 text-sm text-red-700">
                          {actionError[row.id]}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
