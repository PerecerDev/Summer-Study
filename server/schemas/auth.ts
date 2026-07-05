import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().trim().min(3).max(32),
  password: z.string().min(4).max(64),
});

export const parentPasswordSchema = z.object({
  password: z.string().min(4).max(64),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ParentPasswordInput = z.infer<typeof parentPasswordSchema>;
