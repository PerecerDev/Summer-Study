import type { LevelUpDto, UnlockedBadgeDto } from './gamification';

export type SubjectCode = 'math' | 'language' | 'english' | 'valencian' | 'medi';

export type ExerciseType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'short_answer';

export interface ExerciseDto {
  id: string;
  orderIndex: number;
  type: ExerciseType;
  question: string;
  options?: string[];
  explanation?: string;
  subjectCode: SubjectCode;
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
  subjectCode: SubjectCode;
  status: string;
  exerciseCount: number;
  correctCount: number;
  scorePercent: number;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
  promptVersion?: string;
}

export interface GenerateRoundResponse {
  roundId: string;
  exercises: ExerciseDto[];
  promptVersion: string;
}

export interface SubmitAttemptResponse {
  isCorrect: boolean;
  correctAnswer: string | string[];
  explanation?: string;
  roundProgress: { answered: number; total: number };
}

export interface CompleteRoundResponse {
  roundId: string;
  correctCount: number;
  scorePercent: number;
  durationSeconds: number;
  rewards: Array<{ type: string; amount: number }>;
  xpGained: number;
  starsEarned: number;
  levelUp?: LevelUpDto | null;
  newBadges?: UnlockedBadgeDto[];
}

export interface ActiveRoundResponse {
  round: RoundDto;
  exercises: ExerciseDto[];
}

export interface RoundDetailResponse {
  round: RoundDto;
  exercises: ExerciseDto[];
  attempts: Array<{
    id: string;
    exerciseId: string;
    isCorrect: boolean;
    skipped: boolean;
    userAnswer?: string | string[] | null;
    answeredAt: string;
  }>;
}

export interface HistoryRoundsResponse {
  rounds: RoundDto[];
  total: number;
}
