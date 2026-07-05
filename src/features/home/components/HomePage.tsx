import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/features/auth/hooks/useAuth';
import { generateRound, getActiveRound } from '@/features/rounds/services/roundService';
import { SubjectCard } from '@/shared/components/ui/SubjectCard';
import { Button } from '@/shared/components/ui/Button';
import { queryKeys } from '@/shared/lib/query-keys';
import type { SubjectCode } from '@/shared/types/api/rounds';

const subjects = [
  { code: 'math' as const, name: 'Matemáticas', colorClass: 'border-subject-math', available: true },
  {
    code: 'language' as const,
    name: 'Lengua',
    colorClass: 'border-subject-language',
    available: false,
  },
  {
    code: 'english' as const,
    name: 'Inglés',
    colorClass: 'border-subject-english',
    available: false,
  },
  {
    code: 'valencian' as const,
    name: 'Valenciano',
    colorClass: 'border-subject-valencian',
    available: false,
  },
  { code: 'medi' as const, name: 'Medi', colorClass: 'border-subject-medi', available: false },
];

export function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const sessionQuery = useSession();
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

  const handleSelect = (code: SubjectCode, available: boolean) => {
    if (!available) return;
    generateMutation.mutate(code);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-lg text-text-muted">¡Hola, {displayName}!</p>
        <h1 className="text-3xl font-extrabold text-text-primary">¿Qué quieres practicar hoy?</h1>
        <p className="text-lg text-text-muted">Elige una materia para empezar una ronda de 20 ejercicios.</p>
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
          No se pudo empezar la ronda. Inténtalo de nuevo.
        </p>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2" role="list">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.code}
            name={subject.name}
            colorClass={subject.colorClass}
            disabled={!subject.available || generateMutation.isPending}
            subtitle={subject.available ? undefined : 'Próximamente'}
            onSelect={() => {
              handleSelect(subject.code, subject.available);
            }}
          />
        ))}
      </div>
    </div>
  );
}
