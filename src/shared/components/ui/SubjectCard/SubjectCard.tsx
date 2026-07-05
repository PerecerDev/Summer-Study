interface SubjectCardProps {
  name: string;
  colorClass: string;
  subtitle?: string;
  disabled?: boolean;
  onSelect: () => void;
}

export function SubjectCard({
  name,
  colorClass,
  subtitle,
  disabled = false,
  onSelect,
}: SubjectCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={[
        'flex min-h-touch-lg w-full items-center justify-between rounded-2xl border-l-8 bg-surface p-6 text-left shadow-sm transition-transform active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60',
        colorClass,
      ].join(' ')}
      aria-label={`Empezar ronda de ${name}`}
    >
      <div>
        <span className="block text-xl font-bold text-text-primary">{name}</span>
        {subtitle && <span className="text-sm font-semibold text-text-muted">{subtitle}</span>}
      </div>
      <span className="text-lg font-semibold text-primary">{subtitle ? '🔒' : 'Empezar →'}</span>
    </button>
  );
}
