import { z } from 'zod';
import { subjectCodeSchema } from './rounds.js';

export const historyQuerySchema = z.object({
  subjectCode: subjectCodeSchema.optional(),
  limit: z.coerce.number().int().min(1).max(50).optional().default(20),
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export type HistoryQuery = z.infer<typeof historyQuerySchema>;
