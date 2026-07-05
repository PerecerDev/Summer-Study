import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/shared/components/ui/Button';
import { queryKeys } from '@/shared/lib/query-keys';
import {
  formatDuration,
  formatRoundDate,
  SUBJECT_COLOR_CLASS,
  SUBJECT_LABELS,
} from '@/shared/lib/subjects';
import type { CompleteRoundResponse } from '@/shared/types/api/rounds';
import { getRoundDetail } from '../services/roundService';

function formatAnswer(value: string | string[] | null | undefined): string {
  if (value === null || value === undefined) return '—';
  if (Array.isArray(value)) return value.join(', ');
  if (value === 'true') return 'Verdadero';
  if (value === 'false') return 'Falso';
  return value;
}

export function ResultsPage() {
  const { roundId } = useParams<{ roundId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const completeState = location.state as { completeResult?: CompleteRoundResponse } | null;
  const [showBreakdown, setShowBreakdown] = useState(false);

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
  const wrongExercises = exercises.filter((exercise) => exercise.isCorrect === false);

  const scorePercent = completeState?.completeResult?.scorePercent ?? round?.scorePercent ?? 0;
  const correctCount = completeState?.completeResult?.correctCount ?? round?.correctCount ?? 0;
  const exerciseCount = round?.exerciseCount ?? 20;
  const durationSeconds =
    completeState?.completeResult?.durationSeconds ?? round?.durationSeconds ?? 0;
  const stars =
    completeState?.completeResult?.rewards.find((reward) => reward.type === 'star')?.amount ?? 0;

  if (detailQuery.isLoading) {
    return <p className="p-6 text-lg text-text-muted">Cargando resultados…</p>;
  }

  if (!round || round.status !== 'completed') {
    return (
      <div className="space-y-4 p-6">
        <p className="text-lg text-text-muted">No hay resultados para esta ronda.</p>
        <Button
          type="button"
          onClick={() => {
            navigate('/');
          }}
        >
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col gap-8 p-6">
      <header className="space-y-3 text-center">
        <p className="text-2xl font-extrabold text-primary">¡Ronda completada! 🎉</p>
        <p className="text-lg text-text-muted">
          {SUBJECT_LABELS[round.subjectCode]} · {formatRoundDate(round.completedAt)}
        </p>
      </header>

      <div
        className={[
          'rounded-3xl border-l-8 bg-surface p-8 text-center shadow-sm',
          SUBJECT_COLOR_CLASS[round.subjectCode],
        ].join(' ')}
      >
        <p className="text-6xl font-extrabold text-primary">{scorePercent}%</p>
        <p className="mt-3 text-2xl font-bold text-text-primary">
          ¡Has acertado {correctCount} de {exerciseCount}!
        </p>
        <p className="mt-2 text-lg text-text-muted">Tiempo: {formatDuration(durationSeconds)}</p>
        {stars > 0 && (
          <p className="mt-4 text-xl font-bold text-reward-gold">⭐ {stars} estrellas</p>
        )}
      </div>

      {wrongExercises.length > 0 && (
        <div className="space-y-3">
          <button
            type="button"
            className="w-full rounded-2xl border border-black/10 bg-surface px-4 py-3 text-left text-lg font-semibold text-text-primary"
            onClick={() => {
              setShowBreakdown((value) => !value);
            }}
          >
            {showBreakdown ? 'Ocultar repaso' : `Ver repaso (${String(wrongExercises.length)} fallos)`}
          </button>

          {showBreakdown && (
            <ul className="space-y-3">
              {wrongExercises.map((exercise) => (
                <li
                  key={exercise.id}
                  className="rounded-2xl border border-correction/30 bg-correction/5 p-4"
                >
                  <p className="font-semibold text-text-primary">{exercise.question}</p>
                  <p className="mt-2 text-sm text-text-muted">
                    Tu respuesta: {formatAnswer(exercise.userAnswer)}
                  </p>
                  <p className="text-sm text-text-muted">
                    Correcta: {formatAnswer(exercise.correctAnswer)}
                  </p>
                  {exercise.explanation && (
                    <p className="mt-2 text-sm text-text-muted">{exercise.explanation}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div className="mt-auto space-y-3">
        <Button
          type="button"
          className="w-full"
          onClick={() => {
            navigate('/');
          }}
        >
          Volver al inicio
        </Button>
        <Link
          to={`/history/${round.id}`}
          className="block text-center text-lg font-semibold text-primary"
        >
          Ver en historial
        </Link>
      </div>
    </div>
  );
}
