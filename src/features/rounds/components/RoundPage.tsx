import { useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { RoundLayout } from '@/app/layouts/RoundLayout';
import { Button } from '@/shared/components/ui/Button';
import { ErrorPage, LoadingPage } from '@/shared/components/ui/PageState';
import { SUBJECT_LABELS } from '@/shared/lib/subjects';
import { queryKeys } from '@/shared/lib/query-keys';
import type { SubmitAttemptResponse } from '@/shared/types/api/rounds';
import {
  abandonRound,
  completeRound,
  getActiveRound,
  submitAttempt,
} from '../services/roundService';
import { ExerciseView, FeedbackPanel } from './ExerciseView';
import { ProgressBar } from './ProgressBar';
import { DeferModal, SkipModal } from './RoundModals';

export function RoundPage() {
  const { roundId } = useParams<{ roundId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [feedback, setFeedback] = useState<SubmitAttemptResponse | null>(null);
  const [showSkip, setShowSkip] = useState(false);
  const [showDefer, setShowDefer] = useState(false);
  const [exerciseStartedAt, setExerciseStartedAt] = useState(() => Date.now());

  const roundQuery = useQuery({
    queryKey: queryKeys.rounds.active,
    queryFn: getActiveRound,
    enabled: Boolean(roundId),
  });

  const exercises = useMemo(() => roundQuery.data?.exercises ?? [], [roundQuery.data?.exercises]);
  const round = roundQuery.data?.round;

  useEffect(() => {
    const firstUnanswered = exercises.findIndex((exercise) => !exercise.answered);
    if (firstUnanswered >= 0) {
      setCurrentIndex(firstUnanswered);
    }
  }, [exercises]);

  useEffect(() => {
    if (round?.status === 'completed' && roundId) {
      navigate(`/round/${roundId}/results`, { replace: true });
    }
  }, [round?.status, roundId, navigate]);

  const answeredCount = exercises.filter((exercise) => exercise.answered).length;
  const currentExercise = exercises[currentIndex];

  const attemptMutation = useMutation({
    mutationFn: (payload: { exerciseId: string; userAnswer?: string; skipped?: boolean }) => {
      if (!roundId) throw new Error('Missing round');
      const timeSpentSeconds = Math.max(1, Math.round((Date.now() - exerciseStartedAt) / 1000));
      return submitAttempt(roundId, { ...payload, timeSpentSeconds });
    },
    onSuccess: async (data) => {
      setFeedback(data);
      await queryClient.invalidateQueries({ queryKey: queryKeys.rounds.active });
    },
  });

  const completeMutation = useMutation({
    mutationFn: () => {
      if (!roundId) throw new Error('Missing round');
      return completeRound(roundId);
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.rounds.active });
      void queryClient.invalidateQueries({ queryKey: queryKeys.history.list() });
      void queryClient.invalidateQueries({ queryKey: queryKeys.progress.summary });
      void queryClient.invalidateQueries({ queryKey: queryKeys.achievements.list });
      if (roundId) {
        navigate(`/round/${roundId}/results`, {
          state: { completeResult: data },
        });
      }
    },
  });

  const abandonMutation = useMutation({
    mutationFn: () => {
      if (!roundId) throw new Error('Missing round');
      return abandonRound(roundId);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.rounds.active });
      navigate('/');
    },
  });

  const handleContinue = () => {
    setFeedback(null);
    setSelectedAnswer('');
    setExerciseStartedAt(Date.now());

    const nextIndex = exercises.findIndex(
      (exercise, index) => index > currentIndex && !exercise.answered,
    );

    if (nextIndex >= 0) {
      setCurrentIndex(nextIndex);
      return;
    }

    const remaining = exercises.findIndex((exercise) => !exercise.answered);

    if (remaining >= 0) {
      setCurrentIndex(remaining);
      return;
    }

    void completeMutation.mutateAsync();
  };

  const subjectLabel = round ? SUBJECT_LABELS[round.subjectCode] : 'Ronda';

  if (roundQuery.isLoading) {
    return (
      <RoundLayout>
        <LoadingPage message="Cargando ronda…" />
      </RoundLayout>
    );
  }

  if (roundQuery.isError) {
    return (
      <RoundLayout>
        <div className="p-6">
          <ErrorPage
            message="No se pudo cargar la ronda."
            onRetry={() => {
              void roundQuery.refetch();
            }}
          />
        </div>
      </RoundLayout>
    );
  }

  if (!round || round.id !== roundId) {
    return (
      <RoundLayout>
        <div className="space-y-4 p-6">
          <ErrorPage message="No se encontró la ronda." />
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

  const allAnswered = answeredCount >= round.exerciseCount;

  return (
    <RoundLayout
      header={
        <header className="flex items-center justify-between gap-4 px-6 pt-6">
          <button
            type="button"
            className="min-h-touch rounded-xl px-3 text-lg font-semibold text-primary"
            onClick={() => {
              setShowDefer(true);
            }}
          >
            ← Salir
          </button>
          <span className="text-sm font-semibold uppercase tracking-wide text-text-muted">
            {subjectLabel}
          </span>
          <button
            type="button"
            className="min-h-touch rounded-xl px-3 text-lg font-semibold text-primary"
            onClick={() => {
              setShowSkip(true);
            }}
          >
            Saltar
          </button>
        </header>
      }
    >
      <div className="flex flex-col gap-6 p-6">

      <ProgressBar current={answeredCount} total={round.exerciseCount} />

      {allAnswered && !feedback ? (
        <div className="space-y-4">
          <p className="text-xl text-text-primary">Has respondido todos los ejercicios.</p>
          <Button
            type="button"
            className="w-full"
            onClick={() => {
              completeMutation.mutate();
            }}
            disabled={completeMutation.isPending}
            isLoading={completeMutation.isPending}
          >
            Ver resultados
          </Button>
        </div>
      ) : feedback ? (
        <FeedbackPanel
          isCorrect={feedback.isCorrect}
          explanation={feedback.explanation}
          correctAnswer={feedback.correctAnswer}
          onContinue={handleContinue}
        />
      ) : (
        <ExerciseView
          exercise={currentExercise}
          selectedAnswer={selectedAnswer}
          onSelectAnswer={setSelectedAnswer}
          isSubmitting={attemptMutation.isPending}
          disabled={attemptMutation.isPending}
          onSubmit={() => {
            attemptMutation.mutate({
              exerciseId: currentExercise.id,
              userAnswer: selectedAnswer,
            });
          }}
        />
      )}

      <SkipModal
        isOpen={showSkip}
        onClose={() => {
          setShowSkip(false);
        }}
        onConfirm={() => {
          setShowSkip(false);
          attemptMutation.mutate({ exerciseId: currentExercise.id, skipped: true });
        }}
      />

      <DeferModal
        isOpen={showDefer}
        onClose={() => {
          setShowDefer(false);
        }}
        onConfirm={() => {
          abandonMutation.mutate();
        }}
      />
      </div>
    </RoundLayout>
  );
}
