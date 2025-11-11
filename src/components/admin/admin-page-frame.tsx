'use client';

import type { ReactNode } from 'react';
import { AdminNav } from './admin-nav';

interface AdminPageFrameProps {
  title: string;
  description?: string;
  actionSlot?: ReactNode;
  children: ReactNode;
}

export function AdminPageFrame({ title, description, actionSlot, children }: AdminPageFrameProps) {
  return (
    <div className="relative min-h-screen bg-slate-950">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-indigo-600/30 via-transparent to-transparent"></div>
        <div className="absolute right-[-10%] top-16 h-80 w-80 rounded-full bg-blue-500/20 blur-[120px]"></div>
        <div className="absolute left-[-15%] top-1/2 h-96 w-96 rounded-full bg-purple-500/20 blur-[160px]"></div>
      </div>
      <div className="relative z-10">
        <AdminNav />
        <div className="mx-auto max-w-7xl px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
          <div className="mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-900 p-8 text-white shadow-[0_25px_80px_rgba(15,23,42,0.45)]">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">Admin Console</p>
                <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h1>
                {description && <p className="mt-3 max-w-2xl text-white/80">{description}</p>}
              </div>
              {actionSlot && <div className="shrink-0">{actionSlot}</div>}
            </div>
          </div>
          <div className="space-y-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
