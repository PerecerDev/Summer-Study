import { and, count, desc, eq, gte, lt, ne, sql } from 'drizzle-orm';
import {
  badges,
  rewardEvents,
  rounds,
  type SubjectStatJson,
  userBadges,
  userProgress,
} from '../db/schema.js';
import { getDb } from '../db/index.js';
import {
  calculateLevel,
  calculateRoundXp,
  calculateStars,
  getMadridDateString,
  getYesterdayDateString,
  getXpProgress,
  resolveStreak,
} from './rewardCalculations.js';

export interface RewardItem {
  type: 'star' | 'xp';
  amount: number;
}

export interface UnlockedBadge {
  code: string;
  name: string;
  icon: string;
}

export interface ProcessRoundRewardsResult {
  rewards: RewardItem[];
  xpGained: number;
  starsEarned: number;
  levelUp: { previousLevel: number; newLevel: number } | null;
  newBadges: UnlockedBadge[];
}

async function ensureUserProgress(userId: string) {
  const db = getDb();
  const [existing] = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.userId, userId))
    .limit(1);

  if (existing) {
    return existing;
  }

  const [created] = await db.insert(userProgress).values({ userId }).returning();
  if (!created) {
    throw new Error('Failed to create user progress');
  }

  return created;
}

async function hasCompletedRoundToday(userId: string, excludeRoundId: string): Promise<boolean> {
  const db = getDb();
  const today = getMadridDateString();
  const tomorrow = getMadridDateString(new Date(Date.now() + 86_400_000));

  const [{ total }] = await db
    .select({ total: count() })
    .from(rounds)
    .where(
      and(
        eq(rounds.userId, userId),
        eq(rounds.status, 'completed'),
        ne(rounds.id, excludeRoundId),
        gte(rounds.completedAt, sql`${today}::date`),
        lt(rounds.completedAt, sql`${tomorrow}::date`),
      ),
    );

  return Number(total) > 0;
}

function updateSubjectStats(
  stats: SubjectStatJson[],
  subjectCode: string,
  correctCount: number,
  exerciseCount: number,
  completedAt: Date,
): SubjectStatJson[] {
  const next = [...stats];
  const index = next.findIndex((stat) => stat.subjectCode === subjectCode);
  const accuracyPercent = Math.round((correctCount / exerciseCount) * 100);
  const playedAt = completedAt.toISOString();

  if (index >= 0) {
    const current = next[index];
    const roundsCompleted = current.roundsCompleted + 1;

    next[index] = {
      subjectCode,
      roundsCompleted,
      accuracyPercent: Math.round(
        (current.accuracyPercent * current.roundsCompleted + accuracyPercent) / roundsCompleted,
      ),
      lastPlayedAt: playedAt,
    };
    return next;
  }

  next.push({
    subjectCode,
    roundsCompleted: 1,
    accuracyPercent,
    lastPlayedAt: playedAt,
  });

  return next;
}

async function unlockBadge(
  userId: string,
  badgeCode: string,
  roundId: string,
): Promise<UnlockedBadge | null> {
  const db = getDb();

  const [badge] = await db.select().from(badges).where(eq(badges.code, badgeCode)).limit(1);
  if (!badge) return null;

  const [existing] = await db
    .select()
    .from(userBadges)
    .where(and(eq(userBadges.userId, userId), eq(userBadges.badgeId, badge.id)))
    .limit(1);

  if (existing) return null;

  await db.insert(userBadges).values({ userId, badgeId: badge.id });
  await db.insert(rewardEvents).values({
    userId,
    type: 'badge',
    badgeCode: badge.code,
    sourceRoundId: roundId,
    metadata: { name: badge.name },
  });

  return { code: badge.code, name: badge.name, icon: badge.icon };
}

async function evaluateBadges(
  userId: string,
  roundId: string,
  subjectCode: string,
  scorePercent: number,
  progress: typeof userProgress.$inferSelect,
): Promise<UnlockedBadge[]> {
  const db = getDb();
  const unlocked: UnlockedBadge[] = [];

  const checks: Array<Promise<UnlockedBadge | null>> = [];

  if (progress.totalRoundsCompleted === 1) {
    checks.push(unlockBadge(userId, 'first_round', roundId));
  }

  if (subjectCode === 'math') {
    const mathRounds =
      progress.subjectStats.find((stat) => stat.subjectCode === 'math')?.roundsCompleted ?? 0;
    if (mathRounds >= 5) {
      checks.push(unlockBadge(userId, 'math_5', roundId));
    }
  }

  if (progress.currentStreak >= 3) {
    checks.push(unlockBadge(userId, 'streak_3', roundId));
  }

  if (scorePercent === 100) {
    checks.push(unlockBadge(userId, 'perfect', roundId));
  }

  const subjectCodes = await db
    .selectDistinct({ subjectCode: rounds.subjectCode })
    .from(rounds)
    .where(and(eq(rounds.userId, userId), eq(rounds.status, 'completed')));

  const allSubjects = ['math', 'language', 'english', 'valencian', 'medi'];
  const completedSubjects = new Set(subjectCodes.map((row) => row.subjectCode));
  if (allSubjects.every((code) => completedSubjects.has(code))) {
    checks.push(unlockBadge(userId, 'all_subjects', roundId));
  }

  const results = await Promise.all(checks);
  for (const result of results) {
    if (result) unlocked.push(result);
  }

  return unlocked;
}

export async function processRoundRewards(
  userId: string,
  roundId: string,
  subjectCode: string,
  correctCount: number,
  exerciseCount: number,
  scorePercent: number,
  completedAt: Date,
): Promise<ProcessRoundRewardsResult> {
  const db = getDb();
  const progress = await ensureUserProgress(userId);

  const dailyFirstBonus = !(await hasCompletedRoundToday(userId, roundId));
  const starsEarned = calculateStars(scorePercent, correctCount, exerciseCount);
  const xpGained = calculateRoundXp(correctCount, dailyFirstBonus);
  const previousLevel = progress.level;

  const today = getMadridDateString(completedAt);
  const yesterday = getYesterdayDateString(completedAt);
  const newStreak = resolveStreak(
    progress.currentStreak,
    progress.lastPracticeDate,
    today,
    yesterday,
  );

  const totalCorrect = progress.totalCorrect + correctCount;
  const totalRoundsCompleted = progress.totalRoundsCompleted + 1;
  const totalXp = progress.totalXp + xpGained;
  const newLevel = calculateLevel(totalXp);
  const subjectStats = updateSubjectStats(
    progress.subjectStats,
    subjectCode,
    correctCount,
    exerciseCount,
    completedAt,
  );

  const totalAnswered = totalRoundsCompleted * exerciseCount;

  await db
    .update(userProgress)
    .set({
      totalRoundsCompleted,
      totalCorrect,
      accuracyPercent: Math.round((totalCorrect / totalAnswered) * 100),
      currentStreak: newStreak,
      longestStreak: Math.max(progress.longestStreak, newStreak),
      totalStars: progress.totalStars + starsEarned,
      totalXp,
      level: newLevel,
      lastPracticeDate: today,
      subjectStats,
      updatedAt: completedAt,
    })
    .where(eq(userProgress.userId, userId));

  await db.insert(rewardEvents).values([
    { userId, type: 'star', amount: starsEarned, sourceRoundId: roundId },
    {
      userId,
      type: 'xp',
      amount: xpGained,
      sourceRoundId: roundId,
      metadata: dailyFirstBonus ? { dailyFirstBonus: true } : undefined,
    },
  ]);

  const updatedProgress = {
    ...progress,
    totalRoundsCompleted,
    currentStreak: newStreak,
    subjectStats,
  };

  const newBadges = await evaluateBadges(
    userId,
    roundId,
    subjectCode,
    scorePercent,
    updatedProgress,
  );

  const rewards: RewardItem[] = [
    { type: 'star', amount: starsEarned },
    { type: 'xp', amount: xpGained },
  ];

  return {
    rewards,
    xpGained,
    starsEarned,
    levelUp:
      newLevel > previousLevel ? { previousLevel, newLevel } : null,
    newBadges,
  };
}

export async function getUserProgressDto(userId: string) {
  const progress = await ensureUserProgress(userId);
  const { xpInLevel, xpForNextLevel } = getXpProgress(progress.totalXp);

  return {
    userId: progress.userId,
    totalRoundsCompleted: progress.totalRoundsCompleted,
    totalCorrect: progress.totalCorrect,
    accuracyPercent: progress.accuracyPercent,
    currentStreak: progress.currentStreak,
    longestStreak: progress.longestStreak,
    totalStars: progress.totalStars,
    totalCoins: progress.totalCoins,
    totalXp: progress.totalXp,
    level: progress.level,
    xpInLevel,
    xpForNextLevel,
    subjectStats: progress.subjectStats,
    updatedAt: progress.updatedAt.toISOString(),
  };
}

export async function getRecentRewards(userId: string, limit = 20) {
  const db = getDb();

  const events = await db
    .select()
    .from(rewardEvents)
    .where(eq(rewardEvents.userId, userId))
    .orderBy(desc(rewardEvents.earnedAt))
    .limit(limit);

  const progress = await ensureUserProgress(userId);

  return {
    events: events.map((event) => ({
      id: event.id,
      type: event.type,
      amount: event.amount ?? undefined,
      badgeCode: event.badgeCode ?? undefined,
      earnedAt: event.earnedAt.toISOString(),
      sourceRoundId: event.sourceRoundId ?? undefined,
    })),
    totals: {
      stars: progress.totalStars,
      xp: progress.totalXp,
      coins: progress.totalCoins,
    },
  };
}

export async function getAchievements(userId: string) {
  const db = getDb();
  const allBadges = await db.select().from(badges).orderBy(badges.code);
  const unlocked = await db
    .select({
      badgeId: userBadges.badgeId,
      unlockedAt: userBadges.unlockedAt,
    })
    .from(userBadges)
    .where(eq(userBadges.userId, userId));

  const unlockedMap = new Map(unlocked.map((row) => [row.badgeId, row.unlockedAt]));

  return {
    badges: allBadges.map((badge) => ({
      code: badge.code,
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      unlocked: unlockedMap.has(badge.id),
      unlockedAt: unlockedMap.get(badge.id)?.toISOString(),
    })),
  };
}
