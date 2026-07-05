import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { StreakChip, useUserProgress, XpBar } from '@/features/gamification';
import { useSession } from '@/features/auth/hooks/useAuth';
import { generateRound, getActiveRound } from '@/features/rounds/services/roundService';
import { useSubjects } from '@/features/subjects';
import { SubjectCard } from '@/shared/components/ui/SubjectCard';
import { Button } from '@/shared/components/ui/Button';
import { LoadingPage } from '@/shared/components/ui/PageState';
import { ApiClientError } from '@/shared/lib/api-client';
import { queryKeys } from '@/shared/lib/query-keys';
import { SUBJECT_COLOR_CLASS, SUBJECT_LABELS } from '@/shared/lib/subjects';
import type { SubjectCode } from '@/shared/types/api/rounds';

function getGenerateErrorMessage(error: Error): string {
  if (error instanceof ApiClientError) {
    if (error.code === 'GENERATION_RATE_LIMIT') {
      return 'Hay mucha demanda ahora. Espera un momento e inténtalo de nuevo.';
    }

    if (error.code === 'ROUND_IN_PROGRESS') {
      return 'Ya tienes una ronda en curso. Pulsa «Continuar ronda» para seguir.';
    }
  }

  return 'No se pudo empezar la ronda. Inténtalo de nuevo.';
}

export function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sessionQuery = useSession();
  const progressQuery = useUserProgress();
  const subjectsQuery = useSubjects();
  const displayName = sessionQuery.data?.user.displayName ?? 'estudiante';

  const activeRoundQuery = useQuery({
    queryKey: queryKeys.rounds.active,
    queryFn: getActiveRound,
  });

  const generateMutation = useMutation({
    mutationFn: (subjectCode: SubjectCode) => generateRound(subjectCode),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.rounds.active });
      navigate(`/round/${data.roundId}`);
    },
  });

  const activeRoundId = activeRoundQuery.data?.round.id;

  const handleSelect = (code: SubjectCode) => {
    if (activeRoundId) {
      navigate(`/round/${activeRoundId}`);
      return;
    }

    generateMutation.mutate(code);
  };

  if (subjectsQuery.isLoading) {
    return <LoadingPage message="Cargando materias…" />;
  }

  const approvedCodes = new Set(subjectsQuery.data?.map((subject) => subject.code) ?? []);

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-lg text-text-muted">¡Hola, {displayName}!</p>
        <h1 className="text-3xl font-extrabold text-text-primary">¿Qué quieres practicar hoy?</h1>
        <p className="text-lg text-text-muted">Elige una materia para empezar una ronda de 20 ejercicios.</p>
        {progressQuery.data ? (
          <div className="flex flex-wrap items-center gap-3">
            <StreakChip streak={progressQuery.data.currentStreak} />
            <div className="min-w-[12rem] flex-1">
              <XpBar
                compact
                level={progressQuery.data.level}
                xpInLevel={progressQuery.data.xpInLevel}
                xpForNextLevel={progressQuery.data.xpForNextLevel}
              />
            </div>
          </div>
        ) : null}
      </header>

      {activeRoundQuery.data?.round ? (
        <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-4">
          <p className="mb-3 text-lg font-semibold text-text-primary">Tienes una ronda en curso</p>
          <Button
            type="button"
            onClick={() => {
              const roundId = activeRoundQuery.data?.round.id;
              if (roundId) navigate(`/round/${roundId}`);
            }}
          >
            Continuar ronda
          </Button>
        </div>
      ) : null}

      {generateMutation.isError && (
        <p className="rounded-xl bg-correction/10 p-4 text-lg text-text-primary" role="alert">
          {getGenerateErrorMessage(generateMutation.error)}
        </p>
      )}

      {generateMutation.isPending && (
        <p className="rounded-xl bg-primary/10 p-4 text-lg text-text-primary" aria-live="polite">
          Preparando ejercicios…
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2" role="list">
        {(['math', 'language', 'english', 'valencian', 'medi'] as const).map((code) => {
          const subject = subjectsQuery.data?.find((item) => item.code === code);
          const available = approvedCodes.has(code);
          const name = subject?.name ?? SUBJECT_LABELS[code];

          return (
            <SubjectCard
              key={code}
              name={name}
              testId={`subject-${code}`}
              colorClass={SUBJECT_COLOR_CLASS[code]}
              disabled={!available || generateMutation.isPending || Boolean(activeRoundId)}
              subtitle={
                available ? undefined : 'Pide a papá o mamá que la active'
              }
              onSelect={() => {
                handleSelect(code);
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
