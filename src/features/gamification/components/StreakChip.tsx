interface StreakChipProps {
  streak: number;
}

export function StreakChip({ streak }: StreakChipProps) {
  if (streak <= 0) {
    return null;
  }

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full bg-reward-gold/15 px-4 py-2 text-base font-bold text-text-primary"
      aria-label={`Racha de ${String(streak)} días`}
    >
      <span aria-hidden="true">🔥</span>
      <span>{streak} días</span>
    </div>
  );
}
