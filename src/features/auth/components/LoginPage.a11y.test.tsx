import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from './LoginPage';

vi.mock('../hooks/useAuth', () => ({
  useSession: () => ({
    isLoading: false,
    data: { isAuthenticated: false },
  }),
  useLogin: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

function renderLoginPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe('LoginPage accessibility', () => {
  it('has no detectable a11y violations', async () => {
    const { container } = renderLoginPage();
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
