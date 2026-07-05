import { Hono } from 'hono';
import { z } from 'zod';
import type { ParentAuthVariables } from '../middleware/requireParentAuth.js';
import { requireParentAuth } from '../middleware/requireParentAuth.js';
import type { AuthVariables } from '../middleware/requireAuth.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { ApiError } from '../lib/errors.js';
import {
  listSubjectsForParent,
  listSubjectsForUser,
  setSubjectApproval,
} from '../services/subjectService.js';

const approvalSchema = z.object({
  approved: z.boolean(),
});

export const parentRoutes = new Hono<{ Variables: ParentAuthVariables }>()
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

export const subjectRoutes = new Hono<{ Variables: AuthVariables }>().get('/', requireAuth, async (c) => {
  const user = c.get('user');
  const subjects = await listSubjectsForUser(user.id);
  return c.json({ subjects });
});
