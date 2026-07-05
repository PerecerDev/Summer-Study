import { getCookie } from 'hono/cookie';
import type { MiddlewareHandler } from 'hono';
import { getSessionUser, type UserDto } from '../services/authService.js';
import { ApiError, SESSION_COOKIE } from '../lib/errors.js';

export type AuthVariables = {
  user: UserDto;
};

export const requireAuth: MiddlewareHandler<{ Variables: AuthVariables }> = async (c, next) => {
  const sessionToken = getCookie(c, SESSION_COOKIE);
  const user = await getSessionUser(sessionToken);

  if (!user) {
    throw new ApiError('UNAUTHORIZED', 401, 'Inicia sesión para continuar');
  }

  c.set('user', user);
  await next();
};
