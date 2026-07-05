import { useUserProgress } from '../hooks/useGamification';
import { XpBar } from './XpBar';
import { LoadingPage } from '@/shared/components/ui/PageState';
import { SUBJECT_LABELS } from '@/shared/lib/subjects';
import type { SubjectCode } from '@/shared/types/api/rounds';

export function ProgressPage() {
  const progressQuery = useUserProgress();

  if (progressQuery.isLoading) {
    return <LoadingPage message="Cargando progreso…" />;
  }

  const progress = progressQuery.data;

  if (!progress) {
    return null;
  }

  return (
    <section className="space-y-8 py-4">
      <header className="space-y-2">
        <h1 className="text-3xl font-extrabold text-text-primary">Progreso</h1>
        <p className="text-lg text-text-muted">Tu avance en Summer Study</p>
      </header>

      <div className="rounded-2xl bg-surface p-6 shadow-sm">
        <XpBar
          level={progress.level}
          xpInLevel={progress.xpInLevel}
          xpForNextLevel={progress.xpForNextLevel}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Rondas" value={String(progress.totalRoundsCompleted)} />
        <StatCard label="Precisión" value={`${String(progress.accuracyPercent)}%`} />
        <StatCard label="Estrellas" value={`⭐ ${String(progress.totalStars)}`} />
        <StatCard label="Racha" value={`🔥 ${String(progress.currentStreak)}`} />
      </div>

      {progress.subjectStats.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-text-primary">Por materia</h2>
          <ul className="space-y-3">
            {progress.subjectStats.map((stat) => (
              <li key={stat.subjectCode} className="rounded-2xl bg-surface p-4 shadow-sm">
                <p className="font-bold text-text-primary">
                  {SUBJECT_LABELS[stat.subjectCode as SubjectCode]}
                </p>
                <p className="text-base text-text-muted">
                  {stat.roundsCompleted} rondas · {stat.accuracyPercent}% aciertos
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface p-4 text-center shadow-sm">
      <p className="text-sm font-semibold text-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-text-primary">{value}</p>
    </div>
  );
}
