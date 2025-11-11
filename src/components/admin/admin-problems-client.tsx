'use client';

import { useEffect, useState } from 'react';
import { AdminGuard } from './admin-guard';
import { AdminNav } from './admin-nav';
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

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Problem Management</h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Create Problem
            </button>
          </div>

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading problems...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Language
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {problems.map((problem) => (
                    <tr key={problem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{problem.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{problem.slug}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyColor(problem.difficulty)}`}
                        >
                          {problem.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {problem.language}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {problem.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setEditingProblem(problem)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(problem.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

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
    </AdminGuard>
  );
}
