import { and, asc, count, desc, eq, inArray } from 'drizzle-orm';
import { getDb } from '../db/index.js';
import { exerciseAttempts, exercises, rounds } from '../db/schema.js';
import type { GeneratedExercise } from '../schemas/rounds.js';
import { generateExercises } from './generationService.js';
import { getSubjectByCode } from './subjectService.js';
import { ApiError } from '../lib/errors.js';

export interface ExerciseDto {
  id: string;
  orderIndex: number;
  type: string;
  question: string;
  options?: string[];
  explanation?: string;
  subjectCode: string;
  topicTag?: string;
  difficulty: string;
  answered?: boolean;
  isCorrect?: boolean;
  userAnswer?: string | string[] | null;
  correctAnswer?: string | string[];
  skipped?: boolean;
}

export interface RoundDto {
  id: string;
  subjectCode: string;
  status: string;
  exerciseCount: number;
  correctCount: number;
  scorePercent: number;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  promptVersion?: string;
}

function toRoundDto(row: typeof rounds.$inferSelect): RoundDto {
  return {
    id: row.id,
    subjectCode: row.subjectCode,
    status: row.status,
    exerciseCount: row.exerciseCount,
    correctCount: row.correctCount,
    scorePercent: row.scorePercent,
    startedAt: row.startedAt.toISOString(),
    completedAt: row.completedAt?.toISOString(),
    durationSeconds: row.durationSeconds ?? undefined,
    promptVersion: row.promptVersion ?? undefined,
  };
}

function toExerciseDto(
  row: typeof exercises.$inferSelect,
  attempt?: typeof exerciseAttempts.$inferSelect,
  includeAnswers = false,
): ExerciseDto {
  return {
    id: row.id,
    orderIndex: row.orderIndex,
    type: row.type,
    question: row.question,
    options: row.options ?? undefined,
    explanation: row.explanation ?? undefined,
    subjectCode: row.subjectCode,
    topicTag: row.topicTag ?? undefined,
    difficulty: row.difficulty,
    answered: attempt !== undefined,
    isCorrect: attempt?.isCorrect,
    userAnswer: attempt?.userAnswer ?? undefined,
    skipped: attempt?.skipped,
    ...(includeAnswers ? { correctAnswer: row.correctAnswer } : {}),
  };
}

function normalizeAnswer(value: string | string[] | null | undefined): string {
  if (Array.isArray(value)) return value.map((v) => v.trim().toLowerCase()).join('|');
  return String(value ?? '').trim().toLowerCase();
}

function checkAnswer(
  correctAnswer: string | string[],
  userAnswer: string | string[] | null | undefined,
): boolean {
  if (userAnswer === null || userAnswer === undefined) return false;
  return normalizeAnswer(correctAnswer) === normalizeAnswer(userAnswer);
}

export async function getActiveRound(userId: string) {
  const db = getDb();
  const [round] = await db
    .select()
    .from(rounds)
    .where(and(eq(rounds.userId, userId), eq(rounds.status, 'in_progress')))
    .limit(1);

  if (!round) return null;

  const exerciseRows = await db
    .select()
    .from(exercises)
    .where(eq(exercises.roundId, round.id))
    .orderBy(asc(exercises.orderIndex));

  const attemptRows = await db
    .select()
    .from(exerciseAttempts)
    .where(eq(exerciseAttempts.roundId, round.id));

  const attemptByExercise = new Map(attemptRows.map((a) => [a.exerciseId, a]));

  return {
    round: toRoundDto(round),
    exercises: exerciseRows.map((row) => toExerciseDto(row, attemptByExercise.get(row.id))),
  };
}

export async function generateRound(
  userId: string,
  subjectCode: string,
  exerciseCount: number,
) {
  const db = getDb();

  const active = await getActiveRound(userId);

  if (active) {
    throw new ApiError('ROUND_IN_PROGRESS', 409, 'Ya tienes una ronda en curso');
  }

  const subject = await getSubjectByCode(subjectCode);

  if (!subject || !subject.isActive) {
    throw new ApiError('SUBJECT_UNAVAILABLE', 400, 'Esta materia no está disponible');
  }

  if (subjectCode !== 'math') {
    throw new ApiError('SUBJECT_UNAVAILABLE', 400, 'Esta materia aún no está disponible');
  }

  const { exercises: generated, promptVersion } = await generateExercises(
    subjectCode,
    exerciseCount,
  );

  const [round] = await db
    .insert(rounds)
    .values({
      userId,
      subjectId: subject.id,
      subjectCode,
      exerciseCount,
      promptVersion,
    })
    .returning();

  if (!round) {
    throw new ApiError('GENERATION_FAILED', 503, 'No se pudo crear la ronda');
  }

  const exerciseRows = await db
    .insert(exercises)
    .values(
      generated.map((item: GeneratedExercise) => ({
        roundId: round.id,
        orderIndex: item.orderIndex,
        type: item.type,
        question: item.question,
        options: item.options,
        correctAnswer: item.correctAnswer,
        explanation: item.explanation,
        subjectCode,
        topicTag: item.topicTag,
        difficulty: item.difficulty,
      })),
    )
    .returning();

  return {
    roundId: round.id,
    promptVersion,
    exercises: exerciseRows.map((row) => toExerciseDto(row)),
  };
}

export async function getRoundDetail(userId: string, roundId: string) {
  const db = getDb();
  const [round] = await db
    .select()
    .from(rounds)
    .where(and(eq(rounds.id, roundId), eq(rounds.userId, userId)))
    .limit(1);

  if (!round) {
    throw new ApiError('NOT_FOUND', 404, 'Ronda no encontrada');
  }

  const exerciseRows = await db
    .select()
    .from(exercises)
    .where(eq(exercises.roundId, roundId))
    .orderBy(asc(exercises.orderIndex));

  const attemptRows = await db
    .select()
    .from(exerciseAttempts)
    .where(eq(exerciseAttempts.roundId, roundId));

  const attemptByExercise = new Map(attemptRows.map((a) => [a.exerciseId, a]));

  return {
    round: toRoundDto(round),
    exercises: exerciseRows.map((row) =>
      toExerciseDto(row, attemptByExercise.get(row.id), round.status !== 'in_progress'),
    ),
    attempts: attemptRows.map((a) => ({
      id: a.id,
      exerciseId: a.exerciseId,
      isCorrect: a.isCorrect,
      skipped: a.skipped,
      userAnswer: a.userAnswer,
      answeredAt: a.answeredAt.toISOString(),
    })),
  };
}

export async function listRoundHistory(
  userId: string,
  options: { subjectCode?: string; limit: number; offset: number },
) {
  const db = getDb();

  const conditions = [
    eq(rounds.userId, userId),
    inArray(rounds.status, ['completed', 'abandoned']),
  ];

  if (options.subjectCode) {
    conditions.push(eq(rounds.subjectCode, options.subjectCode));
  }

  const where = and(...conditions);

  const [{ total }] = await db.select({ total: count() }).from(rounds).where(where);

  const rows = await db
    .select()
    .from(rounds)
    .where(where)
    .orderBy(desc(rounds.completedAt), desc(rounds.startedAt))
    .limit(options.limit)
    .offset(options.offset);

  return {
    rounds: rows.map(toRoundDto),
    total: Number(total),
  };
}

export async function submitAttempt(
  userId: string,
  roundId: string,
  exerciseId: string,
  userAnswer: string | string[] | undefined,
  timeSpentSeconds: number | undefined,
  skipped: boolean,
) {
  const db = getDb();

  const [round] = await db
    .select()
    .from(rounds)
    .where(and(eq(rounds.id, roundId), eq(rounds.userId, userId)))
    .limit(1);

  if (!round) {
    throw new ApiError('NOT_FOUND', 404, 'Ronda no encontrada');
  }

  if (round.status !== 'in_progress') {
    throw new ApiError('ROUND_NOT_ACTIVE', 400, 'Esta ronda ya ha terminado');
  }

  const [exercise] = await db
    .select()
    .from(exercises)
    .where(and(eq(exercises.id, exerciseId), eq(exercises.roundId, roundId)))
    .limit(1);

  if (!exercise) {
    throw new ApiError('NOT_FOUND', 404, 'Ejercicio no encontrado');
  }

  const [existing] = await db
    .select()
    .from(exerciseAttempts)
    .where(
      and(eq(exerciseAttempts.exerciseId, exerciseId), eq(exerciseAttempts.userId, userId)),
    )
    .limit(1);

  if (existing) {
    throw new ApiError('ALREADY_ANSWERED', 400, 'Ya has respondido este ejercicio');
  }

  const isCorrect = skipped ? false : checkAnswer(exercise.correctAnswer, userAnswer);

  await db.insert(exerciseAttempts).values({
    exerciseId,
    roundId,
    userId,
    userAnswer: skipped ? null : (userAnswer ?? null),
    isCorrect,
    skipped,
    timeSpentSeconds,
  });

  const [{ answered }] = await db
    .select({ answered: count() })
    .from(exerciseAttempts)
    .where(eq(exerciseAttempts.roundId, roundId));

  return {
    isCorrect,
    correctAnswer: exercise.correctAnswer,
    explanation: exercise.explanation ?? undefined,
    roundProgress: {
      answered: Number(answered),
      total: round.exerciseCount,
    },
  };
}

export async function completeRound(userId: string, roundId: string) {
  const db = getDb();

  const [round] = await db
    .select()
    .from(rounds)
    .where(and(eq(rounds.id, roundId), eq(rounds.userId, userId)))
    .limit(1);

  if (!round) {
    throw new ApiError('NOT_FOUND', 404, 'Ronda no encontrada');
  }

  if (round.status !== 'in_progress') {
    throw new ApiError('ROUND_NOT_ACTIVE', 400, 'Esta ronda ya ha terminado');
  }

  const [{ correct }] = await db
    .select({ correct: count() })
    .from(exerciseAttempts)
    .where(and(eq(exerciseAttempts.roundId, roundId), eq(exerciseAttempts.isCorrect, true)));

  const correctCount = Number(correct);
  const scorePercent = Math.round((correctCount / round.exerciseCount) * 100);
  const completedAt = new Date();
  const durationSeconds = Math.round(
    (completedAt.getTime() - round.startedAt.getTime()) / 1000,
  );

  await db
    .update(rounds)
    .set({
      status: 'completed',
      correctCount,
      scorePercent,
      completedAt,
      durationSeconds,
      updatedAt: completedAt,
    })
    .where(eq(rounds.id, roundId));

  return {
    roundId,
    correctCount,
    scorePercent,
    durationSeconds,
    rewards: [{ type: 'star' as const, amount: Math.max(1, Math.floor(scorePercent / 25)) }],
  };
}

export async function abandonRound(userId: string, roundId: string) {
  const db = getDb();

  const [round] = await db
    .select()
    .from(rounds)
    .where(and(eq(rounds.id, roundId), eq(rounds.userId, userId)))
    .limit(1);

  if (!round) {
    throw new ApiError('NOT_FOUND', 404, 'Ronda no encontrada');
  }

  if (round.status !== 'in_progress') {
    throw new ApiError('ROUND_NOT_ACTIVE', 400, 'Esta ronda ya ha terminado');
  }

  await db
    .update(rounds)
    .set({ status: 'abandoned', updatedAt: new Date() })
    .where(eq(rounds.id, roundId));

  return { status: 'abandoned' as const };
}
