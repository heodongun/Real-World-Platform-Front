'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminGuard } from './admin-guard';
import { AdminPageFrame } from './admin-page-frame';
import { useAuth } from '@/components/providers/auth-provider';
import { fetchAllSubmissions } from '@/lib/api';
import type { Submission, SubmissionStatus } from '@/lib/types';

export function AdminSubmissionsClient() {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSubmissions = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await fetchAllSubmissions(token);
      setSubmissions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const getStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'RUNNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const panelClass =
    'rounded-3xl border border-slate-100 bg-white/95 text-slate-900 shadow-xl shadow-slate-900/5 backdrop-blur';

  return (
    <AdminGuard>
      <AdminPageFrame
        title="Submission Management"
        description="실시간 제출 현황을 확인하고 채점 상태를 빠르게 파악하세요."
      >
        {loading && (
          <div className={`${panelClass} flex flex-col items-center gap-4 px-6 py-12 text-center`}>
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
            <p className="text-slate-600">제출 내역을 불러오는 중입니다...</p>
          </div>
        )}

        {!loading && error && (
          <div className={`${panelClass} border border-red-200 bg-red-50/80 text-red-900`}>
            {error}
          </div>
        )}

        {!loading && !error && (
          <section className={`${panelClass} overflow-hidden`}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-3">User ID</th>
                    <th className="px-6 py-3">Problem ID</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Submitted At</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="transition hover:bg-indigo-50/30">
                      <td className="px-6 py-4 whitespace-nowrap">{submission.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{submission.problemId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusColor(
                            submission.status,
                          )}`}
                        >
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900">{submission.score}</div>
                        {submission.feedback && (
                          <div className="text-xs text-slate-500">
                            {submission.feedback.passedTests}/{submission.feedback.totalTests} tests
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(submission.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {submissions.length === 0 && (
                <div className="px-6 py-8 text-center text-slate-500">제출 내역이 없습니다.</div>
              )}
            </div>
          </section>
        )}
      </AdminPageFrame>
    </AdminGuard>
  );
}
