import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 32 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  displayName: varchar('display_name', { length: 64 }).notNull(),
  avatarUrl: text('avatar_url'),
  gradeLevel: varchar('grade_level', { length: 32 }).notNull().default('4_primaria'),
  locale: varchar('locale', { length: 10 }).notNull().default('es-ES'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const parents = pgTable('parents', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  passwordHash: text('password_hash').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  lastActiveAt: timestamp('last_active_at', { withTimezone: true }).notNull().defaultNow(),
  userAgent: text('user_agent'),
});

export const parentTokens = pgTable('parent_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const subjects = pgTable('subjects', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 32 }).notNull().unique(),
  name: varchar('name', { length: 64 }).notNull(),
  icon: varchar('icon', { length: 32 }),
  sortOrder: integer('sort_order').notNull(),
  isActive: boolean('is_active').notNull().default(true),
});

export const rounds = pgTable('rounds', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  subjectId: uuid('subject_id')
    .notNull()
    .references(() => subjects.id),
  subjectCode: varchar('subject_code', { length: 32 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('in_progress'),
  exerciseCount: integer('exercise_count').notNull().default(20),
  correctCount: integer('correct_count').notNull().default(0),
  scorePercent: integer('score_percent').notNull().default(0),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  durationSeconds: integer('duration_seconds'),
  promptVersion: varchar('prompt_version', { length: 20 }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const exercises = pgTable(
  'exercises',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    roundId: uuid('round_id')
      .notNull()
      .references(() => rounds.id, { onDelete: 'cascade' }),
    orderIndex: integer('order_index').notNull(),
    type: varchar('type', { length: 32 }).notNull(),
    question: text('question').notNull(),
    options: jsonb('options').$type<string[]>(),
    correctAnswer: jsonb('correct_answer').$type<string | string[]>().notNull(),
    explanation: text('explanation'),
    subjectCode: varchar('subject_code', { length: 32 }).notNull(),
    topicTag: varchar('topic_tag', { length: 64 }),
    difficulty: varchar('difficulty', { length: 16 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('exercises_round_order_idx').on(table.roundId, table.orderIndex)],
);

export const exerciseAttempts = pgTable('exercise_attempts', {
  id: uuid('id').primaryKey().defaultRandom(),
  exerciseId: uuid('exercise_id')
    .notNull()
    .references(() => exercises.id, { onDelete: 'cascade' }),
  roundId: uuid('round_id')
    .notNull()
    .references(() => rounds.id, { onDelete: 'cascade' }),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  userAnswer: jsonb('user_answer').$type<string | string[] | null>(),
  isCorrect: boolean('is_correct').notNull(),
  skipped: boolean('skipped').notNull().default(false),
  answeredAt: timestamp('answered_at', { withTimezone: true }).notNull().defaultNow(),
  timeSpentSeconds: integer('time_spent_seconds'),
});

export interface SubjectStatJson {
  subjectCode: string;
  roundsCompleted: number;
  accuracyPercent: number;
  lastPlayedAt?: string;
}

export const userProgress = pgTable('user_progress', {
  userId: uuid('user_id')
    .primaryKey()
    .references(() => users.id, { onDelete: 'cascade' }),
  totalRoundsCompleted: integer('total_rounds_completed').notNull().default(0),
  totalCorrect: integer('total_correct').notNull().default(0),
  accuracyPercent: integer('accuracy_percent').notNull().default(0),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  totalStars: integer('total_stars').notNull().default(0),
  totalCoins: integer('total_coins').notNull().default(0),
  totalXp: integer('total_xp').notNull().default(0),
  level: integer('level').notNull().default(1),
  lastPracticeDate: varchar('last_practice_date', { length: 10 }),
  subjectStats: jsonb('subject_stats').$type<SubjectStatJson[]>().notNull().default([]),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const rewardEvents = pgTable('reward_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 32 }).notNull(),
  amount: integer('amount'),
  badgeCode: varchar('badge_code', { length: 64 }),
  metadata: jsonb('metadata').$type<Record<string, unknown>>(),
  sourceRoundId: uuid('source_round_id').references(() => rounds.id, { onDelete: 'set null' }),
  earnedAt: timestamp('earned_at', { withTimezone: true }).notNull().defaultNow(),
});

export const badges = pgTable('badges', {
  id: uuid('id').primaryKey().defaultRandom(),
  code: varchar('code', { length: 64 }).notNull().unique(),
  name: varchar('name', { length: 64 }).notNull(),
  description: text('description').notNull(),
  icon: varchar('icon', { length: 16 }).notNull().default('🏅'),
});

export const userBadges = pgTable(
  'user_badges',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    badgeId: uuid('badge_id')
      .notNull()
      .references(() => badges.id, { onDelete: 'cascade' }),
    unlockedAt: timestamp('unlocked_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('user_badges_user_badge_idx').on(table.userId, table.badgeId)],
);

export const userSubjectAccess = pgTable(
  'user_subject_access',
  {
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    subjectId: uuid('subject_id')
      .notNull()
      .references(() => subjects.id, { onDelete: 'cascade' }),
    parentApproved: boolean('parent_approved').notNull().default(false),
    approvedAt: timestamp('approved_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.subjectId] }),
  }),
);

export const usersRelations = relations(users, ({ one, many }) => ({
  parent: one(parents, { fields: [users.id], references: [parents.userId] }),
  sessions: many(sessions),
  parentTokens: many(parentTokens),
  rounds: many(rounds),
  exerciseAttempts: many(exerciseAttempts),
  progress: one(userProgress, { fields: [users.id], references: [userProgress.userId] }),
  rewardEvents: many(rewardEvents),
  userBadges: many(userBadges),
  subjectAccess: many(userSubjectAccess),
}));

export const parentsRelations = relations(parents, ({ one }) => ({
  user: one(users, { fields: [parents.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  rounds: many(rounds),
  userAccess: many(userSubjectAccess),
}));

export const roundsRelations = relations(rounds, ({ one, many }) => ({
  user: one(users, { fields: [rounds.userId], references: [users.id] }),
  subject: one(subjects, { fields: [rounds.subjectId], references: [subjects.id] }),
  exercises: many(exercises),
  attempts: many(exerciseAttempts),
}));

export const exercisesRelations = relations(exercises, ({ one, many }) => ({
  round: one(rounds, { fields: [exercises.roundId], references: [rounds.id] }),
  attempts: many(exerciseAttempts),
}));

export const exerciseAttemptsRelations = relations(exerciseAttempts, ({ one }) => ({
  exercise: one(exercises, { fields: [exerciseAttempts.exerciseId], references: [exercises.id] }),
  round: one(rounds, { fields: [exerciseAttempts.roundId], references: [rounds.id] }),
  user: one(users, { fields: [exerciseAttempts.userId], references: [users.id] }),
}));

export type DbUser = typeof users.$inferSelect;
export type DbSession = typeof sessions.$inferSelect;
export type DbSubject = typeof subjects.$inferSelect;
export type DbRound = typeof rounds.$inferSelect;
export type DbExercise = typeof exercises.$inferSelect;
export type DbExerciseAttempt = typeof exerciseAttempts.$inferSelect;
export type DbUserProgress = typeof userProgress.$inferSelect;
export type DbRewardEvent = typeof rewardEvents.$inferSelect;
export type DbBadge = typeof badges.$inferSelect;
export type DbUserBadge = typeof userBadges.$inferSelect;
export type DbUserSubjectAccess = typeof userSubjectAccess.$inferSelect;
