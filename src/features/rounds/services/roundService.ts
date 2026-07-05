import { apiFetch } from '@/shared/lib/api-client';
import type {
  ActiveRoundResponse,
  CompleteRoundResponse,
  GenerateRoundResponse,
  SubjectCode,
  SubmitAttemptResponse,
} from '@/shared/types/api/rounds';

export function generateRound(subjectCode: SubjectCode): Promise<GenerateRoundResponse> {
  return apiFetch<GenerateRoundResponse>('/rounds/generate', {
    method: 'POST',
    body: JSON.stringify({ subjectCode, exerciseCount: 20, difficulty: 'mixed' }),
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
