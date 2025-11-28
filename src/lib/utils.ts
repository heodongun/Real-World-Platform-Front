import type { Language } from './types';

export const cn = (...classes: Array<string | undefined | null | false>) =>
  classes.filter(Boolean).join(' ');

export const difficultyBadgeColor = (difficulty: string) => {
  switch (difficulty) {
    case 'EASY':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'HARD':
      return 'bg-rose-100 text-rose-700 border border-rose-200';
    default:
      return 'bg-amber-100 text-amber-700 border border-amber-200';
  }
};

export const languageColor = (language: Language | string) =>
  ({
    PYTHON: 'text-sky-600',
    JAVA: 'text-rose-600',
    SPRING_BOOT_JAVA: 'text-amber-600',
    SPRING_BOOT_KOTLIN: 'text-emerald-700',
    KOTLIN: 'text-indigo-600',
  }[language] ?? 'text-slate-600');

export const languageLabel = (language: Language | string) => {
  switch (language) {
    case 'SPRING_BOOT_KOTLIN':
      return 'Spring Boot (Kotlin)';
    case 'SPRING_BOOT_JAVA':
      return 'Spring Boot (Java)';
    case 'KOTLIN':
      return 'Kotlin';
    case 'JAVA':
      return 'Java';
    case 'PYTHON':
      return 'Python';
    default:
      return language;
  }
};

export const formatDateTime = (value?: string | null) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};
