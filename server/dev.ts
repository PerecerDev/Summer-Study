import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import { app } from './app';

config();

const port = Number(process.env.API_PORT ?? 3001);

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Summer Study API listening on http://localhost:${info.port}`);
  },
);
