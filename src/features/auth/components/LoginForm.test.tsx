import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { LoginForm } from './LoginForm';

const mutateAsync = vi.fn();

vi.mock('../hooks/useAuth', () => ({
  useLogin: () => ({
    mutateAsync,
    isPending: false,
  }),
}));

function renderLoginForm() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <LoginForm />
    </QueryClientProvider>,
  );
}

describe('LoginForm', () => {
  it('renders fields and submit button', () => {
    renderLoginForm();

    expect(screen.getByLabelText(/usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('submits username and password', async () => {
    const user = userEvent.setup();
    mutateAsync.mockResolvedValueOnce({ user: { id: '1', username: 'estudiante' } });

    renderLoginForm();

    await user.type(screen.getByLabelText(/usuario/i), 'estudiante');
    await user.type(screen.getByLabelText(/contraseña/i), '1234');
    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(mutateAsync).toHaveBeenCalledWith({
      username: 'estudiante',
      password: '1234',
    });
  });
});
