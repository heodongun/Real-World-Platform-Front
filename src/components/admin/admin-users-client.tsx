'use client';

import { useCallback, useEffect, useState } from 'react';
import { AdminGuard } from './admin-guard';
import { AdminPageFrame } from './admin-page-frame';
import { useAuth } from '@/components/providers/auth-provider';
import { fetchAllUsers, updateUserRole, deleteUser } from '@/lib/api';
import type { User, UserRole } from '@/lib/types';

export function AdminUsersClient() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await fetchAllUsers(token);
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!token) return;
    if (!confirm(`Change user role to ${newRole}?`)) return;

    try {
      await updateUserRole(token, userId, { role: newRole });
      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update user role');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!token) return;
    if (!confirm('Are you sure you want to delete this user? This will also delete all their submissions.')) {
      return;
    }

    try {
      await deleteUser(token, userId);
      await loadUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    }
  };

  const getRoleBadgeColor = (role: UserRole) => {
    return role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800';
  };

  const panelClass =
    'rounded-3xl border border-slate-100 bg-white/95 text-slate-900 shadow-xl shadow-slate-900/5 backdrop-blur';

  return (
    <AdminGuard>
      <AdminPageFrame
        title="User Management"
        description="사용자 계정을 조회하고 역할을 조정하거나, 필요 시 계정을 정리할 수 있습니다."
      >
        {loading && (
          <div className={`${panelClass} flex flex-col items-center gap-4 px-6 py-12 text-center`}>
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
            <p className="text-slate-600">사용자 목록을 불러오는 중입니다...</p>
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
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Created At</th>
                    <th className="px-6 py-3">Last Login</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-slate-600">
                  {users.map((user) => (
                    <tr key={user.id} className="transition hover:bg-indigo-50/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                        <div className="text-xs text-slate-500">{user.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getRoleBadgeColor(
                            user.role,
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                          className="mr-3 rounded-lg border border-slate-200 px-3 py-1 text-sm shadow-sm focus:border-indigo-500 focus:outline-none"
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="rounded-md px-3 py-1 text-red-600 transition hover:bg-red-50 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="px-6 py-8 text-center text-slate-500">등록된 사용자가 없습니다.</div>
              )}
            </div>
          </section>
        )}
      </AdminPageFrame>
    </AdminGuard>
  );
}
