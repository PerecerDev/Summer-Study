import type { RoundDto } from '@/shared/types/api/rounds';

export interface ParentStudentDto {
  displayName: string;
  username: string;
  gradeLevel: string;
}

export interface ParentSummaryDto {
  totalRoundsCompleted: number;
  accuracyPercent: number;
  currentStreak: number;
  longestStreak: number;
  totalXp: number;
  level: number;
  totalStars: number;
}

export interface ParentSubjectBreakdownDto {
  subjectCode: string;
  subjectName: string;
  roundsCompleted: number;
  accuracyPercent: number;
  lastPlayedAt?: string;
}

export interface ParentOverviewDto {
  student: ParentStudentDto;
  summary: ParentSummaryDto;
  subjectBreakdown: ParentSubjectBreakdownDto[];
  recentRounds: RoundDto[];
}
