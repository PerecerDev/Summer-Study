export interface SubjectStatDto {
  subjectCode: string;
  roundsCompleted: number;
  accuracyPercent: number;
  lastPlayedAt?: string;
}

export interface UserProgressDto {
  userId: string;
  totalRoundsCompleted: number;
  totalCorrect: number;
  accuracyPercent: number;
  currentStreak: number;
  longestStreak: number;
  totalStars: number;
  totalCoins: number;
  totalXp: number;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  subjectStats: SubjectStatDto[];
  updatedAt: string;
}

export interface BadgeDto {
  code: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface AchievementsResponse {
  badges: BadgeDto[];
}

export interface LevelUpDto {
  previousLevel: number;
  newLevel: number;
}

export interface UnlockedBadgeDto {
  code: string;
  name: string;
  icon: string;
}
