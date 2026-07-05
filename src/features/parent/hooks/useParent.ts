import { useQuery } from '@tanstack/react-query';
import { useParentAuthStore } from '@/features/auth/stores/parentAuthStore';
import { queryKeys } from '@/shared/lib/query-keys';
import { getParentOverview } from '../services/parentService';

export function useParentOverview() {
  const parentToken = useParentAuthStore((state) => state.parentToken);
  const isParentAuthenticated = useParentAuthStore((state) => state.isParentAuthenticated);

  return useQuery({
    queryKey: queryKeys.parent.overview,
    queryFn: () => {
      if (!parentToken) throw new Error('Missing parent token');
      return getParentOverview(parentToken);
    },
    enabled: isParentAuthenticated() && Boolean(parentToken),
  });
}
