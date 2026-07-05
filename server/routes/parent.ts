import { Hono } from 'hono';
import { z } from 'zod';
import type { ParentAuthVariables } from '../middleware/requireParentAuth.js';
import { requireParentAuth } from '../middleware/requireParentAuth.js';
import { ApiError } from '../lib/errors.js';
import { historyQuerySchema } from '../schemas/history.js';
import { getParentOverview } from '../services/parentService.js';
import { listRoundHistory } from '../services/roundService.js';
import {
  listSubjectsForParent,
  setSubjectApproval,
} from '../services/subjectService.js';

const approvalSchema = z.object({
  approved: z.boolean(),
});

function parseQuery<T>(schema: z.ZodType<T>, query: Record<string, string>): T {
  const parsed = schema.safeParse(query);

  if (!parsed.success) {
    throw new ApiError('VALIDATION_ERROR', 400, 'Parámetros no válidos', parsed.error.flatten());
  }

  return parsed.data;
}

export const parentRoutes = new Hono<{ Variables: ParentAuthVariables }>()
  .get('/overview', requireParentAuth, async (c) => {
    const userId = c.get('userId');
    const overview = await getParentOverview(userId);
    return c.json(overview);
  })
  .get('/history/rounds', requireParentAuth, async (c) => {
    const userId = c.get('userId');
    const query = parseQuery(historyQuerySchema, c.req.query());

    const result = await listRoundHistory(userId, {
      subjectCode: query.subjectCode,
      limit: query.limit ?? 20,
      offset: query.offset ?? 0,
    });

    return c.json(result);
  })
  .get('/subjects', requireParentAuth, async (c) => {
    const userId = c.get('userId');
    const subjects = await listSubjectsForParent(userId);
    return c.json({ subjects });
  })
  .patch('/subjects/:code', requireParentAuth, async (c) => {
    const userId = c.get('userId');
    const code = c.req.param('code');
    const body = approvalSchema.safeParse(await c.req.json());

    if (!body.success) {
      throw new ApiError('VALIDATION_ERROR', 400, 'Datos no válidos', body.error.flatten());
    }

    const subject = await setSubjectApproval(userId, code, body.data.approved);
    return c.json({ subject });
  });
