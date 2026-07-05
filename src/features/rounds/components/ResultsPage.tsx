import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { RoundLayout } from '@/app/layouts/RoundLayout';
import { Button } from '@/shared/components/ui/Button';
import { ErrorPage, LoadingPage } from '@/shared/components/ui/PageState';
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

  const result = completeState?.completeResult;
  const scorePercent = result?.scorePercent ?? round?.scorePercent ?? 0;
  const correctCount = result?.correctCount ?? round?.correctCount ?? 0;
  const exerciseCount = round?.exerciseCount ?? 20;
  const durationSeconds = result?.durationSeconds ?? round?.durationSeconds ?? 0;
  const starsEarned = result?.starsEarned ?? 0;
  const xpGained = result?.xpGained ?? 0;
  const levelUp = result?.levelUp;
  const newBadges = result?.newBadges ?? [];

  if (detailQuery.isLoading) {
    return (
      <RoundLayout>
        <LoadingPage message="Cargando resultados…" />
      </RoundLayout>
    );
  }

  if (detailQuery.isError) {
    return (
      <RoundLayout>
        <div className="p-6">
          <ErrorPage
            message="No se pudieron cargar los resultados."
            onRetry={() => {
              void detailQuery.refetch();
            }}
          />
        </div>
      </RoundLayout>
    );
  }

  if (!round || round.status !== 'completed') {
    return (
      <RoundLayout>
        <div className="space-y-4 p-6">
          <ErrorPage message="No hay resultados para esta ronda." />
          <Button
            type="button"
            onClick={() => {
              navigate('/');
            }}
          >
            Volver al inicio
          </Button>
        </div>
      </RoundLayout>
    );
  }

  return (
    <RoundLayout>
    <div className="flex min-h-screen flex-col gap-8 p-6">
      <header className="space-y-3 text-center">
        <p className="text-2xl font-extrabold text-primary" data-testid="results-page">
          ¡Ronda completada! 🎉
        </p>
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
      </div>

      {(starsEarned > 0 || xpGained > 0) && (
        <div className="rounded-2xl bg-reward-gold/10 p-6 text-center shadow-sm">
          <p className="text-lg font-bold text-text-primary">Recompensas de esta ronda</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xl font-extrabold">
            {starsEarned > 0 ? (
              <span className="text-reward-gold">⭐ +{starsEarned}</span>
            ) : null}
            {xpGained > 0 ? <span className="text-primary">✨ +{xpGained} XP</span> : null}
          </div>
          {levelUp ? (
            <p className="mt-3 text-lg font-bold text-success">
              ¡Has subido al nivel {levelUp.newLevel}! 🎉
            </p>
          ) : null}
          {newBadges.length > 0 ? (
            <ul className="mt-3 space-y-1 text-base font-semibold text-text-primary">
              {newBadges.map((badge) => (
                <li key={badge.code}>
                  {badge.icon} Nueva insignia: {badge.name}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )}

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
    </RoundLayout>
  );
}
