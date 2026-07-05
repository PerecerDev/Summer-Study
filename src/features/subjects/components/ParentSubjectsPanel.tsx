import { SUBJECT_COLOR_CLASS } from '@/shared/lib/subjects';
import type { ParentSubjectDto } from '@/shared/types/api/subjects';
import { useParentSubjects, useSetParentSubjectApproval } from '../hooks/useSubjects';

export function ParentSubjectsPanel() {
  const subjectsQuery = useParentSubjects();
  const approvalMutation = useSetParentSubjectApproval();

  if (subjectsQuery.isLoading) {
    return <p className="text-lg text-text-muted">Cargando materias…</p>;
  }

  const subjects = subjectsQuery.data ?? [];

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-text-primary">Materias del estudiante</h2>
        <p className="text-base text-text-muted">
          Activa cada materia después de revisar que los ejercicios son adecuados.
        </p>
      </div>

      <ul className="space-y-3">
        {subjects.map((subject) => (
          <ParentSubjectRow
            key={subject.code}
            subject={subject}
            disabled={approvalMutation.isPending || !subject.isActive}
            onToggle={(approved) => {
              approvalMutation.mutate({ code: subject.code, approved });
            }}
          />
        ))}
      </ul>
    </div>
  );
}

function ParentSubjectRow({
  subject,
  disabled,
  onToggle,
}: {
  subject: ParentSubjectDto;
  disabled: boolean;
  onToggle: (approved: boolean) => void;
}) {
  const colorClass = SUBJECT_COLOR_CLASS[subject.code];

  return (
    <li
      className={[
        'flex items-center justify-between gap-4 rounded-2xl border-l-8 bg-surface p-4 shadow-sm',
        colorClass,
        subject.isActive ? '' : 'opacity-60',
      ].join(' ')}
    >
      <div>
        <p className="text-lg font-bold text-text-primary">{subject.name}</p>
        <p className="text-sm text-text-muted">
          {subject.isActive
            ? subject.parentApproved
              ? 'Activa para el estudiante'
              : 'Pendiente de activar'
            : 'Próximamente'}
        </p>
      </div>

      <button
        type="button"
        className={[
          'min-h-touch rounded-xl px-4 text-sm font-bold transition-colors',
          subject.parentApproved
            ? 'bg-primary text-white'
            : 'border-2 border-primary/30 bg-background text-primary',
        ].join(' ')}
        disabled={disabled || !subject.isActive}
        aria-pressed={subject.parentApproved}
        onClick={() => {
          onToggle(!subject.parentApproved);
        }}
      >
        {subject.parentApproved ? 'Activa' : 'Activar'}
      </button>
    </li>
  );
}
