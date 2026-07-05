import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/lib/query-keys';
import { useParentAuthStore } from '@/features/auth/stores/parentAuthStore';
import {
  getParentSubjects,
  getSubjects,
  setParentSubjectApproval,
} from '../services/subjectService';

export function useSubjects() {
  return useQuery({
    queryKey: queryKeys.subjects.list,
    queryFn: async () => {
      const response = await getSubjects();
      return response.subjects;
    },
  });
}

export function useParentSubjects() {
  const parentToken = useParentAuthStore((state) => state.parentToken);
  const isParentAuthenticated = useParentAuthStore((state) => state.isParentAuthenticated);

  return useQuery({
    queryKey: queryKeys.subjects.parent,
    queryFn: async () => {
      if (!parentToken) throw new Error('Missing parent token');
      const response = await getParentSubjects(parentToken);
      return response.subjects;
    },
    enabled: isParentAuthenticated() && Boolean(parentToken),
  });
}

export function useSetParentSubjectApproval() {
  const queryClient = useQueryClient();
  const parentToken = useParentAuthStore((state) => state.parentToken);

  return useMutation({
    mutationFn: ({ code, approved }: { code: string; approved: boolean }) => {
      if (!parentToken) throw new Error('Missing parent token');
      return setParentSubjectApproval(parentToken, code, approved);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.subjects.parent });
      void queryClient.invalidateQueries({ queryKey: queryKeys.subjects.list });
    },
  });
}
