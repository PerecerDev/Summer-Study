import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { getRoundDetail } from '@/features/rounds/services/roundService';
import { queryKeys } from '@/shared/lib/query-keys';
import {
  formatDuration,
  formatRoundDate,
  SUBJECT_COLOR_CLASS,
  SUBJECT_LABELS,
} from '@/shared/lib/subjects';

function formatAnswer(value: string | string[] | null | undefined): string {
  if (value === null || value === undefined) return '—';
  if (Array.isArray(value)) return value.join(', ');
  if (value === 'true') return 'Verdadero';
  if (value === 'false') return 'Falso';
  return value;
}

export function RoundDetailPage() {
  const { roundId } = useParams<{ roundId: string }>();
  const navigate = useNavigate();

  const detailQuery = useQuery({
    queryKey: queryKeys.rounds.detail(roundId ?? ''),
    queryFn: () => {
      if (!roundId) throw new Error('Missing round id');
      return getRoundDetail(roundId);
    },
    enabled: Boolean(roundId),
  });

  const round = detailQuery.data?.round;
  const exercises = detailQuery.data?.exercises ?? [];

  if (detailQuery.isLoading) {
    return <p className="text-lg text-text-muted">Cargando detalle…</p>;
  }

  if (!round) {
    return (
      <div className="space-y-4">
        <p className="text-lg text-text-muted">Ronda no encontrada.</p>
        <Button
          type="button"
          onClick={() => {
            navigate('/history');
          }}
        >
          Volver al historial
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link to="/history" className="text-lg font-semibold text-primary">
        ← Historial
      </Link>

      <header
        className={[
          'rounded-2xl border-l-8 bg-surface p-6 shadow-sm',
          SUBJECT_COLOR_CLASS[round.subjectCode],
        ].join(' ')}
      >
        <h1 className="text-2xl font-extrabold text-text-primary">
          {SUBJECT_LABELS[round.subjectCode]}
        </h1>
        <p className="mt-1 text-text-muted">{formatRoundDate(round.completedAt)}</p>
        <p className="mt-4 text-4xl font-extrabold text-primary">{round.scorePercent}%</p>
        <p className="text-lg text-text-muted">
          {round.correctCount} de {round.exerciseCount} correctas ·{' '}
          {formatDuration(round.durationSeconds)}
        </p>
      </header>

      <ol className="space-y-3">
        {exercises.map((exercise, index) => {
          const isCorrect = exercise.isCorrect === true;
          const skipped = exercise.skipped === true;

          return (
            <li
              key={exercise.id}
              className={[
                'rounded-2xl border p-4',
                isCorrect ? 'border-success/40 bg-success/5' : 'border-correction/40 bg-correction/5',
              ].join(' ')}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="font-bold text-text-primary">
                  {index + 1}. {exercise.question}
                </p>
                <span className="text-2xl" aria-hidden="true">
                  {isCorrect ? '✓' : skipped ? '⏭' : '✗'}
                </span>
              </div>
              <p className="mt-2 text-sm text-text-muted">
                Tu respuesta: {formatAnswer(exercise.userAnswer)}
              </p>
              {!isCorrect && (
                <p className="text-sm text-text-muted">
                  Correcta: {formatAnswer(exercise.correctAnswer)}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
