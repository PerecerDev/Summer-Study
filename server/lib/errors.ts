import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';

export class ApiError extends Error {
  constructor(
    public readonly code: string,
    public readonly status: ContentfulStatusCode,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function errorResponse(c: Context, error: ApiError) {
  return c.json(
    {
      error: {
        code: error.code,
        message: error.message,
        ...(process.env.NODE_ENV !== 'production' && error.details ? { details: error.details } : {}),
      },
    },
    error.status,
  );
}

export const SESSION_COOKIE = 'ss_session';
export const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const PARENT_TOKEN_TTL_MS = 15 * 60 * 1000;
