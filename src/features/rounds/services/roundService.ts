import { apiFetch } from '@/shared/lib/api-client';
import type {
  ActiveRoundResponse,
  CompleteRoundResponse,
  GenerateRoundResponse,
  HistoryRoundsResponse,
  RoundDetailResponse,
  SubjectCode,
  SubmitAttemptResponse,
} from '@/shared/types/api/rounds';

export function generateRound(subjectCode: SubjectCode): Promise<GenerateRoundResponse> {
  const exerciseCount = Number(import.meta.env.VITE_E2E_EXERCISE_COUNT) || 20;

  return apiFetch<GenerateRoundResponse>('/rounds/generate', {
    method: 'POST',
    body: JSON.stringify({ subjectCode, exerciseCount, difficulty: 'mixed' }),
  });
}

export function getActiveRound(): Promise<ActiveRoundResponse | null> {
  return apiFetch<ActiveRoundResponse | null>('/rounds/active');
}

export function submitAttempt(
  roundId: string,
  payload: {
    exerciseId: string;
    userAnswer?: string;
    timeSpentSeconds?: number;
    skipped?: boolean;
  },
): Promise<SubmitAttemptResponse> {
  return apiFetch<SubmitAttemptResponse>(`/rounds/${roundId}/attempts`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function completeRound(roundId: string): Promise<CompleteRoundResponse> {
  return apiFetch<CompleteRoundResponse>(`/rounds/${roundId}/complete`, {
    method: 'POST',
  });
}

export function abandonRound(roundId: string): Promise<{ status: string }> {
  return apiFetch<{ status: string }>(`/rounds/${roundId}/abandon`, {
    method: 'POST',
  });
}

export function getRoundDetail(roundId: string): Promise<RoundDetailResponse> {
  return apiFetch<RoundDetailResponse>(`/rounds/${roundId}`);
}

export function getRoundHistory(params?: {
  subjectCode?: SubjectCode;
  limit?: number;
  offset?: number;
}): Promise<HistoryRoundsResponse> {
  const search = new URLSearchParams();
  if (params?.subjectCode) search.set('subjectCode', params.subjectCode);
  if (params?.limit !== undefined) search.set('limit', String(params.limit));
  if (params?.offset !== undefined) search.set('offset', String(params.offset));
  const query = search.toString();

  return apiFetch<HistoryRoundsResponse>(`/history/rounds${query ? `?${query}` : ''}`);
}
