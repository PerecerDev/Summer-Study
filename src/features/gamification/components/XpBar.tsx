interface XpBarProps {
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  compact?: boolean;
}

export function XpBar({ level, xpInLevel, xpForNextLevel, compact = false }: XpBarProps) {
  const percent = xpForNextLevel > 0 ? Math.min(100, Math.round((xpInLevel / xpForNextLevel) * 100)) : 0;

  return (
    <div className={compact ? 'space-y-1' : 'space-y-2'}>
      <div className="flex items-center justify-between text-sm font-bold text-text-primary">
        <span>Nivel {level}</span>
        <span className="text-text-muted">
          {xpInLevel} / {xpForNextLevel} XP
        </span>
      </div>
      <div
        className="h-3 overflow-hidden rounded-full bg-black/10"
        role="progressbar"
        aria-valuenow={xpInLevel}
        aria-valuemin={0}
        aria-valuemax={xpForNextLevel}
        aria-label={`Progreso de nivel ${String(level)}`}
      >
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${String(percent)}%` }}
        />
      </div>
    </div>
  );
}
