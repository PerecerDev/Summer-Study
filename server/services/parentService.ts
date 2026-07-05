import { asc, eq } from 'drizzle-orm';
import { getDb } from '../db/index.js';
import { subjects, users } from '../db/schema.js';
import { ApiError } from '../lib/errors.js';
import { getUserProgressDto } from './rewardService.js';
import { listRoundHistory } from './roundService.js';

export async function getParentOverview(userId: string) {
  const db = getDb();

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);

  if (!user) {
    throw new ApiError('NOT_FOUND', 404, 'Usuario no encontrado');
  }

  const progress = await getUserProgressDto(userId);
  const recent = await listRoundHistory(userId, { limit: 5, offset: 0 });
  const allSubjects = await db.select().from(subjects).orderBy(asc(subjects.sortOrder));
  const statsByCode = new Map(progress.subjectStats.map((stat) => [stat.subjectCode, stat]));

  return {
    student: {
      displayName: user.displayName,
      username: user.username,
      gradeLevel: user.gradeLevel,
    },
    summary: {
      totalRoundsCompleted: progress.totalRoundsCompleted,
      accuracyPercent: progress.accuracyPercent,
      currentStreak: progress.currentStreak,
      longestStreak: progress.longestStreak,
      totalXp: progress.totalXp,
      level: progress.level,
      totalStars: progress.totalStars,
    },
    subjectBreakdown: allSubjects.map((subject) => {
      const stat = statsByCode.get(subject.code);

      return {
        subjectCode: subject.code,
        subjectName: subject.name,
        roundsCompleted: stat?.roundsCompleted ?? 0,
        accuracyPercent: stat?.accuracyPercent ?? 0,
        lastPlayedAt: stat?.lastPlayedAt,
      };
    }),
    recentRounds: recent.rounds,
  };
}
