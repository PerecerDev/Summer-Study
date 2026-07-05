export const queryKeys = {
  session: ['session'] as const,
  rounds: {
    active: ['rounds', 'active'] as const,
    detail: (roundId: string) => ['rounds', 'detail', roundId] as const,
    results: (roundId: string) => ['rounds', 'results', roundId] as const,
  },
  history: {
    list: (subjectCode?: string) => ['history', 'rounds', subjectCode ?? 'all'] as const,
  },
};
