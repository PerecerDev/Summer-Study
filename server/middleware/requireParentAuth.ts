import type { MiddlewareHandler } from 'hono';
import { getCookie } from 'hono/cookie';
import { getSessionUser, validateParentToken } from '../services/authService.js';
import { ApiError, SESSION_COOKIE } from '../lib/errors.js';

export type ParentAuthVariables = {
  userId: string;
};

export const PARENT_TOKEN_HEADER = 'x-parent-token';

export const requireParentAuth: MiddlewareHandler<{ Variables: ParentAuthVariables }> = async (
  c,
  next,
) => {
  const sessionToken = getCookie(c, SESSION_COOKIE);
  const user = await getSessionUser(sessionToken);

  if (!user) {
    throw new ApiError('UNAUTHORIZED', 401, 'Inicia sesión para continuar');
  }

  const parentToken = c.req.header(PARENT_TOKEN_HEADER);
  const isValid = await validateParentToken(user.id, parentToken);

  if (!isValid) {
    throw new ApiError('PARENT_AUTH_REQUIRED', 403, 'Se requiere acceso de papá/mamá');
  }

  c.set('userId', user.id);
  await next();
};
