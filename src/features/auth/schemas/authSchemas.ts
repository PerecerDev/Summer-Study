import { z } from 'zod';

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'El usuario debe tener al menos 3 caracteres')
    .max(32, 'El usuario es demasiado largo'),
  password: z
    .string()
    .min(4, 'La contraseña debe tener al menos 4 caracteres')
    .max(64, 'La contraseña es demasiado larga'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const parentPasswordSchema = z.object({
  password: z
    .string()
    .min(4, 'La contraseña debe tener al menos 4 caracteres')
    .max(64, 'La contraseña es demasiado larga'),
});

export type ParentPasswordFormValues = z.infer<typeof parentPasswordSchema>;
