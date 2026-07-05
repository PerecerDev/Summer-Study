import { apiFetch } from '@/shared/lib/api-client';
import type { SessionResponse, UserDto } from '@/shared/types/api/auth';

export const authService = {
  login(username: string, password: string): Promise<{ user: UserDto }> {
    return apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  logout(): Promise<void> {
    return apiFetch('/auth/logout', { method: 'POST' });
  },

  getSession(): Promise<SessionResponse> {
    return apiFetch('/auth/session');
  },

  verifyParentPassword(password: string): Promise<{ parentToken: string; expiresAt: string }> {
    return apiFetch('/auth/parent/verify', {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  },
};
