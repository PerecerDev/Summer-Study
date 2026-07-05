import { Hono } from 'hono';
import { listActiveSubjects } from '../services/subjectService.js';
import { requireAuth } from '../middleware/requireAuth.js';

export const subjectRoutes = new Hono().get('/', requireAuth, async (c) => {
  const subjects = await listActiveSubjects();
  return c.json({ subjects });
});
