import { SubjectCard } from '@/shared/components/ui/SubjectCard';

const subjects = [
  { code: 'math', name: 'Matemáticas', colorClass: 'border-subject-math' },
  { code: 'language', name: 'Lengua', colorClass: 'border-subject-language' },
  { code: 'english', name: 'Inglés', colorClass: 'border-subject-english' },
  { code: 'valencian', name: 'Valenciano', colorClass: 'border-subject-valencian' },
  { code: 'medi', name: 'Medi', colorClass: 'border-subject-medi' },
] as const;

export function HomePage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <p className="text-lg text-text-muted">¡Hola!</p>
        <h1 className="text-3xl font-extrabold text-text-primary">¿Qué quieres practicar hoy?</h1>
        <p className="text-lg text-text-muted">Elige una materia para empezar una ronda de 20 ejercicios.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2" role="list">
        {subjects.map((subject) => (
          <SubjectCard
            key={subject.code}
            name={subject.name}
            colorClass={subject.colorClass}
            onSelect={() => {
              // Round engine — Epic E4
            }}
          />
        ))}
      </div>
    </div>
  );
}
