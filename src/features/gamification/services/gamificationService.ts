import { apiFetch } from '@/shared/lib/api-client';
import type { AchievementsResponse, UserProgressDto } from '@/shared/types/api/gamification';

export function getUserProgress(): Promise<UserProgressDto> {
  return apiFetch<UserProgressDto>('/progress');
}

export function getAchievements(): Promise<AchievementsResponse> {
  return apiFetch<AchievementsResponse>('/achievements');
}
