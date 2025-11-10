import type { Metadata } from 'next';

import { DashboardPageClient } from '@/components/dashboard/dashboard-page-client';

export const metadata: Metadata = {
  title: '대시보드 · Real-World Coding Platform',
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
