import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiClientError } from '@/shared/lib/api-client';
import { queryKeys } from '@/shared/lib/query-keys';
import type { SessionResponse } from '@/shared/types/api/auth';
import { authService } from '../services/authService';

export function useSession() {
  return useQuery<SessionResponse | null>({
    queryKey: queryKeys.session,
    queryFn: async () => {
      try {
        return await authService.getSession();
      } catch (error) {
        if (error instanceof ApiClientError && error.status === 401) {
          return null;
        }
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      authService.login(username, password),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.session, {
        user: data.user,
        isAuthenticated: true,
      });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.session, null);
      queryClient.removeQueries({ queryKey: queryKeys.session });
    },
  });
}

export function useVerifyParentPassword() {
  return useMutation({
    mutationFn: (password: string) => authService.verifyParentPassword(password),
  });
}
