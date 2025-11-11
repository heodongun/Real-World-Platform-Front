'use client';

import { AdminGuard } from './admin-guard';
import { AdminNav } from './admin-nav';

export function AdminSubmissionsClient() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Submission Management</h1>

          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Admin Submission Management Coming Soon
            </h3>
            <p className="text-gray-600">
              Backend API for admin submission management needs to be implemented first.
              <br />
              This feature will allow you to:
            </p>
            <ul className="mt-4 text-left max-w-md mx-auto space-y-2 text-gray-600">
              <li>• View all submissions across all users</li>
              <li>• Filter by user, problem, or status</li>
              <li>• Review submission details and test results</li>
              <li>• Monitor system usage and patterns</li>
            </ul>
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
