'use client';

import { useEffect, useState } from 'react';
import { AdminGuard } from './admin-guard';
import { AdminPageFrame } from './admin-page-frame';
import { useAuth } from '@/components/providers/auth-provider';
import { fetchProblems, createProblem, updateProblem, deleteProblem } from '@/lib/api';
import type { Problem, CreateProblemPayload, Difficulty } from '@/lib/types';
import { ProblemFormModal } from './problem-form-modal';

export function AdminProblemsClient() {
  const { token } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const loadProblems = async () => {
    try {
      setLoading(true);
      const data = await fetchProblems();
      setProblems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProblems();
  }, []);

  const handleCreate = async (payload: CreateProblemPayload) => {
    if (!token) return;
    try {
      setSubmitting(true);
      await createProblem(token, payload);
      setShowCreateModal(false);
      await loadProblems();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to create problem');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (problemId: string, payload: CreateProblemPayload) => {
    if (!token) return;
    try {
      setSubmitting(true);
      await updateProblem(token, problemId, payload);
      setEditingProblem(null);
      await loadProblems();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update problem');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (problemId: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this problem?')) return;

    try {
      await deleteProblem(token, problemId);
      await loadProblems();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete problem');
    }
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'EASY':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HARD':
        return 'bg-red-100 text-red-800';
    }
  };

  const panelClass =
    'rounded-3xl border border-slate-100 bg-white/95 text-slate-900 shadow-xl shadow-slate-900/5 backdrop-blur';

  return (
    <AdminGuard>
      <>
        <AdminPageFrame
          title="Problem Management"
          description="문제를 생성하고 난이도나 태그를 정리하여 더 나은 학습 경험을 제공하세요."
          actionSlot={
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-white/20"
            >
              <span aria-hidden="true">＋</span> Create Problem
            </button>
          }
        >
          {loading && (
            <div className={`${panelClass} flex flex-col items-center gap-4 px-6 py-12 text-center`}>
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
              <p className="text-slate-600">문제 목록을 불러오는 중입니다...</p>
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
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Slug</th>
                      <th className="px-6 py-3">Difficulty</th>
                      <th className="px-6 py-3">Language</th>
                      <th className="px-6 py-3">Tags</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                    {problems.map((problem) => (
                      <tr key={problem.id} className="transition hover:bg-indigo-50/30">
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-slate-900">{problem.title}</div>
                          <div className="text-xs text-slate-400">{problem.id}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{problem.slug}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getDifficultyColor(
                              problem.difficulty,
                            )}`}
                          >
                            {problem.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{problem.language}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {problem.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => setEditingProblem(problem)}
                            className="mr-3 rounded-md px-3 py-1 text-indigo-600 transition hover:bg-indigo-50 hover:text-indigo-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(problem.id)}
                            className="rounded-md px-3 py-1 text-red-600 transition hover:bg-red-50 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </AdminPageFrame>

        {showCreateModal && (
          <ProblemFormModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreate}
            submitting={submitting}
          />
        )}

        {editingProblem && (
          <ProblemFormModal
            problem={editingProblem}
            onClose={() => setEditingProblem(null)}
            onSubmit={(payload) => handleUpdate(editingProblem.id, payload)}
            submitting={submitting}
          />
        )}
      </>
    </AdminGuard>
  );
}
