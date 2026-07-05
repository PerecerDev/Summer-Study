import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { queryKeys } from '@/shared/lib/query-keys';
import {
  formatDuration,
  formatRoundDate,
  SUBJECT_COLOR_CLASS,
  SUBJECT_LABELS,
} from '@/shared/lib/subjects';
import type { SubjectCode } from '@/shared/types/api/rounds';
import { getRoundHistory } from '@/features/rounds/services/roundService';

const FILTERS: Array<{ id: 'all' | SubjectCode; label: string }> = [
  { id: 'all', label: 'Todas' },
  { id: 'math', label: 'Matemáticas' },
];

export function HistoryPage() {
  const [filter, setFilter] = useState<'all' | SubjectCode>('all');

  const historyQuery = useQuery({
    queryKey: queryKeys.history.list(filter === 'all' ? undefined : filter),
    queryFn: () =>
      getRoundHistory({
        subjectCode: filter === 'all' ? undefined : filter,
        limit: 50,
      }),
  });

  const rounds = historyQuery.data?.rounds ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-text-primary">Historial</h1>
        <p className="text-lg text-text-muted">Tus rondas completadas</p>
      </header>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filtrar por materia">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            onClick={() => {
              setFilter(item.id);
            }}
            className={[
              'min-h-touch rounded-full px-4 text-sm font-bold transition-colors',
              filter === item.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-surface text-text-primary border border-black/10',
            ].join(' ')}
          >
            {item.label}
          </button>
        ))}
      </div>

      {historyQuery.isLoading && <p className="text-lg text-text-muted">Cargando historial…</p>}

      {historyQuery.isError && (
        <div className="space-y-3 rounded-2xl bg-correction/10 p-4">
          <p className="text-lg text-text-primary">No se pudo cargar el historial.</p>
          <Button
            type="button"
            onClick={() => {
              void historyQuery.refetch();
            }}
          >
            Reintentar
          </Button>
        </div>
      )}

      {!historyQuery.isLoading && !historyQuery.isError && rounds.length === 0 && (
        <div className="rounded-2xl bg-surface p-8 text-center shadow-sm">
          <p className="text-xl font-semibold text-text-primary">
            Aún no has completado ninguna ronda.
          </p>
          <p className="mt-2 text-lg text-text-muted">¡Empieza una desde el inicio!</p>
          <Link to="/" className="mt-6 inline-block text-lg font-bold text-primary">
            Ir al inicio →
          </Link>
        </div>
      )}

      <ul className="space-y-3">
        {rounds.map((round) => (
          <li key={round.id}>
            <Link
              to={`/history/${round.id}`}
              className={[
                'flex min-h-touch-lg items-center justify-between rounded-2xl border-l-8 bg-surface p-4 shadow-sm transition-transform active:scale-[0.99]',
                SUBJECT_COLOR_CLASS[round.subjectCode],
              ].join(' ')}
            >
              <div>
                <p className="text-lg font-bold text-text-primary">
                  {SUBJECT_LABELS[round.subjectCode]}
                </p>
                <p className="text-sm text-text-muted">{formatRoundDate(round.completedAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-primary">{round.scorePercent}%</p>
                <p className="text-sm text-text-muted">{formatDuration(round.durationSeconds)}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
