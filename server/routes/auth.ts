import { Hono } from 'hono';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import { z } from 'zod';
import { loginSchema, parentPasswordSchema } from '../schemas/auth.js';
import {
  getSessionUser,
  login,
  logout,
  verifyParentPassword,
} from '../services/authService.js';
import { ApiError, SESSION_COOKIE, SESSION_TTL_MS } from '../lib/errors.js';

const isProduction = process.env.NODE_ENV === 'production';

function setSessionCookie(c: Parameters<typeof setCookie>[0], token: string) {
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  });
}

function clearSessionCookie(c: Parameters<typeof deleteCookie>[0]) {
  deleteCookie(c, SESSION_COOKIE, { path: '/' });
}

function parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new ApiError('VALIDATION_ERROR', 400, 'Datos no válidos', parsed.error.flatten());
  }

  return parsed.data;
}

export const authRoutes = new Hono()
  .post('/login', async (c) => {
    const body = parseBody(loginSchema, await c.req.json());
    const userAgent = c.req.header('user-agent');

    const { user, sessionToken } = await login(body.username, body.password, userAgent);
    setSessionCookie(c, sessionToken);

    return c.json({ user });
  })
  .post('/logout', async (c) => {
    const sessionToken = getCookie(c, SESSION_COOKIE);
    await logout(sessionToken);
    clearSessionCookie(c);

    return c.body(null, 204);
  })
  .get('/session', async (c) => {
    const sessionToken = getCookie(c, SESSION_COOKIE);
    const user = await getSessionUser(sessionToken);

    if (!user) {
      throw new ApiError('UNAUTHORIZED', 401, 'Inicia sesión para continuar');
    }

    return c.json({ user, isAuthenticated: true });
  })
  .post('/parent/verify', async (c) => {
    const sessionToken = getCookie(c, SESSION_COOKIE);
    const user = await getSessionUser(sessionToken);

    if (!user) {
      throw new ApiError('UNAUTHORIZED', 401, 'Inicia sesión para continuar');
    }

    const body = parseBody(parentPasswordSchema, await c.req.json());
    const result = await verifyParentPassword(user.id, body.password);

    return c.json(result);
  });
