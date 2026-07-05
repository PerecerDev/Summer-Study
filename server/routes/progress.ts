import { Hono } from 'hono';
import type { AuthVariables } from '../middleware/requireAuth.js';
import { requireAuth } from '../middleware/requireAuth.js';
import {
  getAchievements,
  getRecentRewards,
  getUserProgressDto,
} from '../services/rewardService.js';

export const progressRoutes = new Hono<{ Variables: AuthVariables }>()
  .get('/progress', requireAuth, async (c) => {
    const user = c.get('user');
    const progress = await getUserProgressDto(user.id);
    return c.json(progress);
  })
  .get('/rewards', requireAuth, async (c) => {
    const user = c.get('user');
    const rewards = await getRecentRewards(user.id);
    return c.json(rewards);
  })
  .get('/achievements', requireAuth, async (c) => {
    const user = c.get('user');
    const achievements = await getAchievements(user.id);
    return c.json(achievements);
  });
