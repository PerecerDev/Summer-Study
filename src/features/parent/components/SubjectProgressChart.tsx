import type { ParentSubjectBreakdownDto } from '@/shared/types/api/parent';
import { SUBJECT_COLOR_CLASS } from '@/shared/lib/subjects';
import type { SubjectCode } from '@/shared/types/api/rounds';

interface SubjectProgressChartProps {
  subjects: ParentSubjectBreakdownDto[];
}

export function SubjectProgressChart({ subjects }: SubjectProgressChartProps) {
  const maxRounds = Math.max(1, ...subjects.map((subject) => subject.roundsCompleted));

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-text-primary">Progreso por materia</h2>
      <ul className="space-y-4">
        {subjects.map((subject) => {
          const widthPercent = Math.round((subject.roundsCompleted / maxRounds) * 100);
          const colorClass = SUBJECT_COLOR_CLASS[subject.subjectCode as SubjectCode];

          return (
            <li key={subject.subjectCode} className="space-y-2">
              <div className="flex items-center justify-between gap-3 text-base">
                <span className="font-semibold text-text-primary">{subject.subjectName}</span>
                <span className="text-text-muted">
                  {subject.roundsCompleted} rondas · {subject.accuracyPercent}%
                </span>
              </div>
              <div className="h-4 overflow-hidden rounded-full bg-black/10">
                <div
                  className={['h-full rounded-full border-l-8 bg-primary/70', colorClass].join(' ')}
                  style={{ width: `${String(widthPercent)}%` }}
                  role="presentation"
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
