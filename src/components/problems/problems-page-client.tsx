'use client';

import { useEffect, useState } from 'react';

import { fetchProblems } from '@/lib/api';
import { Problem } from '@/lib/types';
import { ProblemsClient } from '@/components/problems/problems-client';

export const ProblemsPageClient = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const list = await fetchProblems();
        if (!active) return;
        setProblems(list);
      } catch (error) {
        console.error(error);
        if (!active) return;
        setProblems([]);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="mt-10 rounded-3xl border border-white/10 bg-slate-900/40 p-8 text-center text-sm text-slate-400">
        문제 목록을 불러오는 중입니다...
      </div>
    );
  }

  return <ProblemsClient problems={problems} />;
};
