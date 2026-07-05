# Summer Study — Data Model

Version: 1.0  
Status: Active

---

# Purpose

Defines domain entities, TypeScript types, DTOs, relationships, and persistence conventions.

Precedence: `CONSTITUTION.md` > `PRODUCT_REQUIREMENTS.md` > this document.

---

# Conventions

- All IDs: `string` (UUID format)
- Timestamps: ISO 8601 strings (`createdAt`, `updatedAt`, `completedAt`)
- Enums: string unions in TypeScript, not numeric enums
- API DTOs mirror domain types unless mapping is required
- Single source of types per entity in feature or `shared/types/domain/`
- Database schema must align with these types (ORM TBD via ADR)

---

# Core Entities

## User (Student)

```typescript
interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  gradeLevel: '4_primaria'; // extensible
  locale: 'es-ES';
  createdAt: string;
  updatedAt: string;
}
```

## Parent (Admin)

```typescript
interface Parent {
  id: string;
  userId: string; // linked student
  passwordHash: string; // server only — never exposed to client
  createdAt: string;
}
```

## Subject

```typescript
type SubjectCode = 'math' | 'language' | 'english' | 'valencian' | 'medi';

interface Subject {
  id: string;
  code: SubjectCode;
  name: string; // display: Matemáticas, Lengua, etc.
  icon?: string;
  sortOrder: number;
  isActive: boolean;
}
```

## Round

A completed or in-progress session of 20 exercises.

```typescript
type RoundStatus = 'in_progress' | 'completed' | 'abandoned';

interface Round {
  id: string;
  userId: string;
  subjectId: string;
  subjectCode: SubjectCode;
  status: RoundStatus;
  exerciseCount: number; // default 20
  correctCount: number;
  scorePercent: number;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  promptVersion?: string; // AI prompt version used
  createdAt: string;
  updatedAt: string;
}
```

## Exercise

```typescript
type ExerciseType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'short_answer'
  | 'ordering'
  | 'matching';

interface Exercise {
  id: string;
  roundId: string;
  orderIndex: number; // 0–19
  type: ExerciseType;
  question: string;
  options?: string[]; // for multiple_choice, matching
  correctAnswer: string | string[];
  explanation?: string; // shown after answer
  subjectCode: SubjectCode;
  topicTag?: string; // future content map reference
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
}
```

## ExerciseAttempt

```typescript
interface ExerciseAttempt {
  id: string;
  exerciseId: string;
  roundId: string;
  userId: string;
  userAnswer: string | string[];
  isCorrect: boolean;
  answeredAt: string;
  timeSpentSeconds?: number;
}
```

## Reward (Extensible)

Architecture supports incremental implementation.

```typescript
type RewardType = 'star' | 'coin' | 'xp' | 'badge' | 'streak' | 'achievement';

interface RewardEvent {
  id: string;
  userId: string;
  type: RewardType;
  amount?: number;
  badgeId?: string;
  metadata?: Record<string, unknown>;
  earnedAt: string;
  sourceRoundId?: string;
}
```

## UserProgress (Aggregate)

```typescript
interface UserProgress {
  userId: string;
  totalRoundsCompleted: number;
  totalExercisesAnswered: number;
  totalCorrect: number;
  accuracyPercent: number;
  currentStreak: number;
  longestStreak: number;
  totalStars: number;
  totalCoins: number;
  totalXp: number;
  level: number;
  subjectStats: SubjectStat[];
  updatedAt: string;
}

interface SubjectStat {
  subjectCode: SubjectCode;
  roundsCompleted: number;
  accuracyPercent: number;
  averageTimeSeconds?: number;
  lastPlayedAt?: string;
}
```

## Badge (Future)

```typescript
interface Badge {
  id: string;
  code: string;
  name: string;
  description: string;
  iconUrl?: string;
  criteria: Record<string, unknown>;
}

interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  unlockedAt: string;
}
```

## Session

```typescript
interface Session {
  id: string;
  userId: string;
  tokenHash: string; // server only
  expiresAt: string;
  createdAt: string;
  lastActiveAt: string;
  userAgent?: string;
}
```

## AppConfiguration

Global and per-user settings (extensible).

```typescript
interface AppConfiguration {
  id: string;
  key: string;
  value: string | number | boolean | Record<string, unknown>;
  scope: 'global' | 'user';
  userId?: string; // when scope = user
  updatedAt: string;
}
```

Example keys: `daily_generation_limit`, `default_exercise_count`, `enabled_subjects`.

## PromptVersion (AI audit)

```typescript
interface PromptVersion {
  id: string;
  version: string; // semver e.g. 1.0.0
  subjectCode?: SubjectCode; // null = system prompt
  contentHash: string;
  changelog?: string;
  createdAt: string;
}
```

## DailyStats (Aggregate — optional materialized)

```typescript
interface DailyStats {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD Europe/Madrid
  roundsCompleted: number;
  exercisesAnswered: number;
  correctCount: number;
  totalTimeSeconds: number;
  subjectsPlayed: SubjectCode[];
}
```

---

# Relationships

```
User 1───* Round
Round 1───* Exercise
Round 1───* ExerciseAttempt
User 1───1 UserProgress
User 1───* RewardEvent
User 1───* Session
User 1───* UserBadge
User 1───* DailyStats
Parent 1───1 User (student)
Subject 1───* Round
Badge 1───* UserBadge
AppConfiguration (global | per-user)
PromptVersion (audit log)
```

---

# AI Generation DTO

Request/response shapes for exercise generation API.

```typescript
interface GenerateRoundRequest {
  userId: string;
  subjectCode: SubjectCode;
  exerciseCount?: number; // default 20
  difficulty?: 'mixed' | 'easy' | 'medium' | 'hard';
}

interface GeneratedExerciseDTO {
  orderIndex: number;
  type: ExerciseType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  topicTag?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface GenerateRoundResponse {
  roundId: string;
  exercises: GeneratedExerciseDTO[];
  promptVersion: string;
}
```

Validation: all generated exercises must pass Zod schema before persistence.

---

# History Queries (Supported)

The storage model must support:

- All rounds by user, ordered by date
- Rounds filtered by subject
- Accuracy percentage over time
- Favorite subjects (most played)
- Repeated incorrect exercises (via ExerciseAttempt)
- Response times per exercise
- Progress evolution (daily/weekly aggregates)

---

# Migration Strategy

- Schema migrations versioned in `server/db/migrations/`
- No breaking changes to history data without migration plan
- Seed data for development only (subjects, test user)

---

# Mock Data (Development)

Until API is live, mock services must implement the **same interfaces** as production API. See feature `mocks/` directories.
