import { Hono } from 'hono';
import type { AuthVariables } from '../middleware/requireAuth.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { listSubjectsForUser } from '../services/subjectService.js';

export const subjectRoutes = new Hono<{ Variables: AuthVariables }>().get('/', requireAuth, async (c) => {
  const user = c.get('user');
  const subjects = await listSubjectsForUser(user.id);
  return c.json({ subjects });
});
