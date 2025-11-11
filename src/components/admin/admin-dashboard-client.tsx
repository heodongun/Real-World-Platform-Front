'use client';

import { useEffect, useState } from 'react';
import { AdminGuard } from './admin-guard';
import { AdminPageFrame } from './admin-page-frame';
import { fetchDashboardStats, fetchLeaderboard } from '@/lib/api';
import type { DashboardStats, LeaderboardEntry } from '@/lib/types';

export function AdminDashboardClient() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [statsData, leaderboardData] = await Promise.all([
          fetchDashboardStats(),
          fetchLeaderboard(),
        ]);
        setStats(statsData);
        setLeaderboard(leaderboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const panelClass =
    'rounded-3xl border border-slate-100 bg-white/95 shadow-xl shadow-slate-900/5 backdrop-blur';
  const statusCardClass = `${panelClass} flex flex-col items-center justify-center gap-4 px-6 py-12 text-center`;

  const statCards = stats
    ? [
        {
          label: 'Total Users',
          value: stats.totalUsers.toLocaleString(),
          icon: '👥',
          accent: 'bg-blue-50 text-blue-600',
        },
        {
          label: 'Total Problems',
          value: stats.totalProblems.toLocaleString(),
          icon: '🧩',
          accent: 'bg-purple-50 text-purple-600',
        },
        {
          label: 'Total Submissions',
          value: stats.totalSubmissions.toLocaleString(),
          icon: '🚀',
          accent: 'bg-amber-50 text-amber-600',
        },
        {
          label: 'Success Rate',
          value: `${stats.successRate.toFixed(1)}%`,
          icon: '🎯',
          accent: 'bg-emerald-50 text-emerald-600',
        },
      ]
    : [];

  return (
    <AdminGuard>
      <AdminPageFrame
        title="Admin Dashboard"
        description="한 눈에 보는 플랫폼 지표와 리더보드 현황입니다."
      >
        {loading && (
          <div className={statusCardClass}>
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
            <p className="text-slate-600">대시보드 데이터를 불러오는 중입니다...</p>
          </div>
        )}

        {!loading && error && (
          <div className={`${panelClass} border border-red-200 bg-red-50/80 text-red-900`}>
            {error}
          </div>
        )}

        {!loading && !error && stats && (
          <>
            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {statCards.map((card) => (
                <div key={card.label} className={`${panelClass} rounded-2xl p-6`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-500">{card.label}</p>
                      <p className="mt-3 text-3xl font-semibold text-slate-900">{card.value}</p>
                    </div>
                    <span className={`rounded-2xl px-3 py-2 text-xl ${card.accent}`}>{card.icon}</span>
                  </div>
                </div>
              ))}
            </section>

            <section className={`${panelClass} p-0 overflow-hidden`}>
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-5">
                <h2 className="text-xl font-semibold text-slate-900">Leaderboard</h2>
                <p className="text-sm text-slate-500">상위 도전자들의 점수를 확인해 보세요.</p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
                  <thead className="bg-white/60 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-6 py-3">Rank</th>
                      <th className="px-6 py-3">User ID</th>
                      <th className="px-6 py-3">Name</th>
                      <th className="px-6 py-3 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                    {leaderboard.map((entry, index) => (
                      <tr key={entry.userId} className="transition hover:bg-indigo-50/30">
                        <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4">{entry.userId}</td>
                        <td className="px-6 py-4 font-medium text-slate-900">{entry.name}</td>
                        <td className="px-6 py-4 text-right text-base font-semibold text-indigo-600">
                          {entry.score}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </AdminPageFrame>
    </AdminGuard>
  );
}
