import { apiFetch } from '@/shared/lib/api-client';
import type { ParentOverviewDto } from '@/shared/types/api/parent';
import type { HistoryRoundsResponse } from '@/shared/types/api/rounds';

export function getParentOverview(parentToken: string): Promise<ParentOverviewDto> {
  return apiFetch<ParentOverviewDto>('/parent/overview', {
    headers: { 'X-Parent-Token': parentToken },
  });
}

export function getParentHistory(
  parentToken: string,
  params?: { subjectCode?: string; limit?: number; offset?: number },
): Promise<HistoryRoundsResponse> {
  const search = new URLSearchParams();

  if (params?.subjectCode) search.set('subjectCode', params.subjectCode);
  if (params?.limit !== undefined) search.set('limit', String(params.limit));
  if (params?.offset !== undefined) search.set('offset', String(params.offset));

  const query = search.toString();
  const path = query ? `/parent/history/rounds?${query}` : '/parent/history/rounds';

  return apiFetch<HistoryRoundsResponse>(path, {
    headers: { 'X-Parent-Token': parentToken },
  });
}
