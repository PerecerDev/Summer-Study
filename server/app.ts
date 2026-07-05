import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authRoutes } from './routes/auth.js';
import { historyRoutes } from './routes/history.js';
import { isLlmConfigured } from './services/llmClient.js';
import { progressRoutes } from './routes/progress.js';
import { roundRoutes } from './routes/rounds.js';
import { subjectRoutes } from './routes/subjects.js';
import { ApiError, errorResponse } from './lib/errors.js';

export function createApp() {
  const app = new Hono().basePath('/api/v1');

  app.use(
    '*',
    cors({
      origin: (origin) => origin ?? '*',
      credentials: true,
    }),
  );

  app.use('*', async (c, next) => {
    if (!process.env.DATABASE_URL && !c.req.path.endsWith('/health')) {
      throw new ApiError(
        'SERVICE_UNAVAILABLE',
        503,
        'Servicio no disponible. Configura la base de datos.',
      );
    }

    await next();
  });

  app.get('/health', (c) =>
    c.json({
      status: 'ok',
      db: process.env.DATABASE_URL ? 'configured' : 'missing',
      llm: process.env.MOCK_LLM === 'true' ? 'mock' : isLlmConfigured() ? 'groq' : 'missing',
      version: '0.1.0',
    }),
  );

  app.route('/auth', authRoutes);
  app.route('/subjects', subjectRoutes);
  app.route('/rounds', roundRoutes);
  app.route('/history', historyRoutes);
  app.route('/', progressRoutes);

  app.onError((err, c) => {
    if (err instanceof ApiError) {
      return errorResponse(c, err);
    }

    console.error(err);

    return errorResponse(
      c,
      new ApiError('INTERNAL_ERROR', 500, 'Ha ocurrido un error. Inténtalo de nuevo.'),
    );
  });

  return app;
}

export const app = createApp();

export default app;
