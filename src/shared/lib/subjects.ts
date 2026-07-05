import type { SubjectCode } from '@/shared/types/api/rounds';

export const SUBJECT_LABELS: Record<SubjectCode, string> = {
  math: 'Matemáticas',
  language: 'Lengua',
  english: 'Inglés',
  valencian: 'Valenciano',
  medi: 'Medi',
};

export const SUBJECT_COLOR_CLASS: Record<SubjectCode, string> = {
  math: 'border-subject-math',
  language: 'border-subject-language',
  english: 'border-subject-english',
  valencian: 'border-subject-valencian',
  medi: 'border-subject-medi',
};

export function formatDuration(seconds?: number): string {
  if (seconds === undefined) return '—';
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  if (minutes === 0) return `${String(remainder)} s`;
  return `${String(minutes)} min ${String(remainder)} s`;
}

export function formatRoundDate(iso?: string): string {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(iso));
}
