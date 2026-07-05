export const MADRID_TIMEZONE = 'Europe/Madrid';

export const XP_PER_CORRECT = 10;
export const XP_ROUND_COMPLETE = 50;
export const XP_DAILY_FIRST_ROUND = 25;

export function getMadridDateString(date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: MADRID_TIMEZONE }).format(date);
}

export function getYesterdayDateString(date = new Date()): string {
  const yesterday = new Date(date);
  yesterday.setDate(yesterday.getDate() - 1);
  return getMadridDateString(yesterday);
}

export function calculateStars(
  scorePercent: number,
  correctCount: number,
  exerciseCount: number,
): number {
  let stars = 1;
  if (scorePercent >= 80) {
    stars = 3;
  } else if (scorePercent > 50) {
    stars = 2;
  }

  if (correctCount === exerciseCount) {
    stars += 2;
  }

  return stars;
}

export function calculateRoundXp(correctCount: number, dailyFirstBonus: boolean): number {
  return (
    correctCount * XP_PER_CORRECT + XP_ROUND_COMPLETE + (dailyFirstBonus ? XP_DAILY_FIRST_ROUND : 0)
  );
}

export function calculateLevel(totalXp: number): number {
  return Math.floor(Math.sqrt(totalXp / 100)) + 1;
}

export function getXpProgress(totalXp: number): {
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
} {
  const level = calculateLevel(totalXp);
  const xpAtLevelStart = Math.pow(level - 1, 2) * 100;
  const xpAtNextLevel = Math.pow(level, 2) * 100;

  return {
    level,
    xpInLevel: totalXp - xpAtLevelStart,
    xpForNextLevel: xpAtNextLevel - xpAtLevelStart,
  };
}

export function resolveStreak(
  currentStreak: number,
  lastPracticeDate: string | null | undefined,
  today: string,
  yesterday: string,
): number {
  if (lastPracticeDate === today) {
    return currentStreak;
  }

  if (lastPracticeDate === yesterday) {
    return currentStreak + 1;
  }

  return 1;
}
