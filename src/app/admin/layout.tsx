import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin - Coding Challenge Platform',
  description: 'Admin dashboard for managing problems, users, and submissions',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
