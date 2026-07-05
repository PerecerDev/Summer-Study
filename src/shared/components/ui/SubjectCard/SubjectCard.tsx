interface SubjectCardProps {
  name: string;
  colorClass: string;
  onSelect: () => void;
}

export function SubjectCard({ name, colorClass, onSelect }: SubjectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        'flex min-h-touch-lg w-full items-center justify-between rounded-2xl border-l-8 bg-surface p-6 text-left shadow-sm transition-transform active:scale-[0.98]',
        colorClass,
      ].join(' ')}
      aria-label={`Empezar ronda de ${name}`}
    >
      <span className="text-xl font-bold text-text-primary">{name}</span>
      <span className="text-lg font-semibold text-primary">Empezar →</span>
    </button>
  );
}
