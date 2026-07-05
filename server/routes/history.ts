import { Hono } from 'hono';
import { z } from 'zod';
import { requireAuth, type AuthVariables } from '../middleware/requireAuth.js';
import { historyQuerySchema } from '../schemas/history.js';
import { listRoundHistory } from '../services/roundService.js';
import { ApiError } from '../lib/errors.js';

function parseQuery<T>(schema: z.ZodType<T>, query: Record<string, string>): T {
  const parsed = schema.safeParse(query);

  if (!parsed.success) {
    throw new ApiError('VALIDATION_ERROR', 400, 'Parámetros no válidos', parsed.error.flatten());
  }

  return parsed.data;
}

export const historyRoutes = new Hono<{ Variables: AuthVariables }>().get(
  '/rounds',
  requireAuth,
  async (c) => {
    const user = c.get('user');
    const query = parseQuery(historyQuerySchema, c.req.query());

    const result = await listRoundHistory(user.id, {
      subjectCode: query.subjectCode,
      limit: query.limit ?? 20,
      offset: query.offset ?? 0,
    });

    return c.json(result);
  },
);
