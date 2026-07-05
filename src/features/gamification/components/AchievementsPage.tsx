import { useAchievements } from '../hooks/useGamification';
import { LoadingPage, ErrorPage } from '@/shared/components/ui/PageState';

export function AchievementsPage() {
  const achievementsQuery = useAchievements();

  if (achievementsQuery.isLoading) {
    return <LoadingPage message="Cargando logros…" />;
  }

  if (achievementsQuery.isError) {
    return (
      <ErrorPage
        message="No se pudieron cargar los logros."
        onRetry={() => {
          void achievementsQuery.refetch();
        }}
      />
    );
  }

  const badges = achievementsQuery.data?.badges ?? [];
  const unlockedCount = badges.filter((badge) => badge.unlocked).length;

  return (
    <section className="space-y-8 py-4">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-text-primary">Logros</h1>
        <p className="text-lg text-text-muted">
          {unlockedCount} de {badges.length} insignias desbloqueadas
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {badges.map((badge) => (
          <li
            key={badge.code}
            className={[
              'rounded-2xl border-2 p-5 shadow-sm transition-opacity',
              badge.unlocked
                ? 'border-primary/30 bg-primary/5'
                : 'border-black/5 bg-surface opacity-60',
            ].join(' ')}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl" aria-hidden="true">
                {badge.icon}
              </span>
              <div className="space-y-1">
                <p className="text-lg font-bold text-text-primary">{badge.name}</p>
                <p className="text-base text-text-muted">{badge.description}</p>
                {badge.unlocked && badge.unlockedAt ? (
                  <p className="text-sm font-semibold text-success">¡Desbloqueada!</p>
                ) : (
                  <p className="text-sm font-semibold text-text-muted">Bloqueada</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
