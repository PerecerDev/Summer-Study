import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/lib/query-keys';
import { getAchievements, getUserProgress } from '../services/gamificationService';

export function useUserProgress() {
  return useQuery({
    queryKey: queryKeys.progress.summary,
    queryFn: getUserProgress,
  });
}

export function useAchievements() {
  return useQuery({
    queryKey: queryKeys.achievements.list,
    queryFn: getAchievements,
  });
}
