import { Link } from 'react-router-dom';
import { ParentSubjectsPanel } from '@/features/subjects';
import { ErrorPage, LoadingPage } from '@/shared/components/ui/PageState';
import {
  formatRoundDate,
  SUBJECT_COLOR_CLASS,
  SUBJECT_LABELS,
} from '@/shared/lib/subjects';
import { formatGradeLevel } from '@/shared/lib/grade';
import { useParentOverview } from '../hooks/useParent';
import { SubjectProgressChart } from './SubjectProgressChart';

export function ParentOverviewPage() {
  const overviewQuery = useParentOverview();

  if (overviewQuery.isLoading) {
    return <LoadingPage message="Cargando panel de padres…" />;
  }

  if (overviewQuery.isError || !overviewQuery.data) {
    return (
      <ErrorPage
        message="No se pudo cargar el panel de padres."
        onRetry={() => {
          void overviewQuery.refetch();
        }}
      />
    );
  }

  const { student, summary, subjectBreakdown, recentRounds } = overviewQuery.data;

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h2 className="text-2xl font-extrabold text-text-primary">{student.displayName}</h2>
        <p className="text-lg text-text-muted">
          {student.username} · {formatGradeLevel(student.gradeLevel)}
        </p>
      </section>

      <section className="grid grid-cols-2 gap-4">
        <StatCard label="Rondas completadas" value={String(summary.totalRoundsCompleted)} />
        <StatCard label="Precisión global" value={`${String(summary.accuracyPercent)}%`} />
        <StatCard label="Racha actual" value={`${String(summary.currentStreak)} días`} />
        <StatCard label="Mejor racha" value={`${String(summary.longestStreak)} días`} />
      </section>

      <section className="rounded-2xl bg-surface p-6 shadow-sm">
        <SubjectProgressChart subjects={subjectBreakdown} />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-text-primary">Rondas recientes</h2>
          <Link to="/history" className="text-base font-semibold text-primary">
            Ver historial
          </Link>
        </div>

        {recentRounds.length === 0 ? (
          <p className="text-lg text-text-muted">Todavía no hay rondas completadas.</p>
        ) : (
          <ul className="space-y-3">
            {recentRounds.map((round) => (
              <li key={round.id}>
                <Link
                  to={`/history/${round.id}`}
                  className={[
                    'flex items-center justify-between rounded-2xl border-l-8 bg-surface p-4 shadow-sm',
                    SUBJECT_COLOR_CLASS[round.subjectCode],
                  ].join(' ')}
                >
                  <div>
                    <p className="font-bold text-text-primary">
                      {SUBJECT_LABELS[round.subjectCode]}
                    </p>
                    <p className="text-sm text-text-muted">{formatRoundDate(round.completedAt)}</p>
                  </div>
                  <p className="text-xl font-extrabold text-primary">{round.scorePercent}%</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-2xl bg-surface p-6 shadow-sm">
        <ParentSubjectsPanel />
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface p-4 shadow-sm">
      <p className="text-sm font-semibold text-text-muted">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-text-primary">{value}</p>
    </div>
  );
}
