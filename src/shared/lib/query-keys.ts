export const queryKeys = {
  session: ['session'] as const,
  progress: {
    summary: ['progress', 'summary'] as const,
  },
  achievements: {
    list: ['achievements', 'list'] as const,
  },
  subjects: {
    list: ['subjects', 'list'] as const,
    parent: ['subjects', 'parent'] as const,
  },
  parent: {
    overview: ['parent', 'overview'] as const,
  },
  rounds: {
    active: ['rounds', 'active'] as const,
    detail: (roundId: string) => ['rounds', 'detail', roundId] as const,
    results: (roundId: string) => ['rounds', 'results', roundId] as const,
  },
  history: {
    list: (subjectCode?: string) => ['history', 'rounds', subjectCode ?? 'all'] as const,
  },
};
