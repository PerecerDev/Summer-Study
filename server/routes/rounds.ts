import { Hono } from 'hono';
import { z } from 'zod';
import { requireAuth, type AuthVariables } from '../middleware/requireAuth.js';
import {
  abandonRound,
  completeRound,
  generateRound,
  getActiveRound,
  getRoundDetail,
  submitAttempt,
} from '../services/roundService.js';
import { generateRoundRequestSchema, submitAttemptSchema } from '../schemas/rounds.js';
import { ApiError } from '../lib/errors.js';

function parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    throw new ApiError('VALIDATION_ERROR', 400, 'Datos no válidos', parsed.error.flatten());
  }

  return parsed.data;
}

export const roundRoutes = new Hono<{ Variables: AuthVariables }>()
  .post('/generate', requireAuth, async (c) => {
    const user = c.get('user');
    const body = parseBody(generateRoundRequestSchema, await c.req.json());
    const result = await generateRound(user.id, body.subjectCode, body.exerciseCount ?? 20);

    return c.json(result, 201);
  })
  .get('/active', requireAuth, async (c) => {
    const user = c.get('user');
    const active = await getActiveRound(user.id);
    return c.json(active);
  })
  .get('/:roundId', requireAuth, async (c) => {
    const user = c.get('user');
    const roundId = c.req.param('roundId');
    const detail = await getRoundDetail(user.id, roundId);
    return c.json(detail);
  })
  .post('/:roundId/attempts', requireAuth, async (c) => {
    const user = c.get('user');
    const roundId = c.req.param('roundId');
    const body = parseBody(submitAttemptSchema, await c.req.json());
    const result = await submitAttempt(
      user.id,
      roundId,
      body.exerciseId,
      body.userAnswer,
      body.timeSpentSeconds,
      body.skipped ?? false,
    );

    return c.json(result);
  })
  .post('/:roundId/complete', requireAuth, async (c) => {
    const user = c.get('user');
    const roundId = c.req.param('roundId');
    const result = await completeRound(user.id, roundId);
    return c.json(result);
  })
  .post('/:roundId/abandon', requireAuth, async (c) => {
    const user = c.get('user');
    const roundId = c.req.param('roundId');
    const result = await abandonRound(user.id, roundId);
    return c.json(result);
  });
