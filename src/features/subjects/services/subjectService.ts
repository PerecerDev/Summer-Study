import { apiFetch } from '@/shared/lib/api-client';
import type { ParentSubjectsResponse, SubjectsResponse } from '@/shared/types/api/subjects';

export function getSubjects(): Promise<SubjectsResponse> {
  return apiFetch<SubjectsResponse>('/subjects');
}

export function getParentSubjects(parentToken: string): Promise<ParentSubjectsResponse> {
  return apiFetch<ParentSubjectsResponse>('/parent/subjects', {
    headers: { 'X-Parent-Token': parentToken },
  });
}

export function setParentSubjectApproval(
  parentToken: string,
  code: string,
  approved: boolean,
): Promise<{ subject: ParentSubjectsResponse['subjects'][number] }> {
  return apiFetch(`/parent/subjects/${code}`, {
    method: 'PATCH',
    headers: { 'X-Parent-Token': parentToken },
    body: JSON.stringify({ approved }),
  });
}
