import { z } from 'zod';

export const subjectCodeSchema = z.enum(['math', 'language', 'english', 'valencian', 'medi']);

export const exerciseTypeSchema = z.enum([
  'multiple_choice',
  'true_false',
  'fill_blank',
  'short_answer',
]);

export const difficultySchema = z.enum(['easy', 'medium', 'hard']);

export const generatedExerciseSchema = z
  .object({
    orderIndex: z.number().int().min(0).max(19),
    type: exerciseTypeSchema,
    question: z.string().min(10).max(200),
    options: z.array(z.string().min(1).max(80)).min(2).max(4).optional(),
    correctAnswer: z.union([z.string(), z.array(z.string())]),
    explanation: z.string().max(300).optional(),
    topicTag: z.string().max(64).optional(),
    difficulty: difficultySchema,
  })
  .superRefine((exercise, ctx) => {
    if (exercise.type === 'multiple_choice') {
      if (!exercise.options || exercise.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'multiple_choice requires 2–4 options',
        });
        return;
      }

      const answer = String(exercise.correctAnswer);

      if (!exercise.options.includes(answer)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'correctAnswer must be one of the options',
        });
      }

      if (new Set(exercise.options).size !== exercise.options.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'options must be unique',
        });
      }
    }

    if (exercise.type === 'true_false') {
      const answer = String(exercise.correctAnswer).toLowerCase();

      if (answer !== 'true' && answer !== 'false') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'true_false correctAnswer must be "true" or "false"',
        });
      }
    }
  });

export const generateRoundResponseSchema = z.object({
  exercises: z.array(generatedExerciseSchema).min(1).max(20),
  promptVersion: z.string(),
});

export const generateRoundRequestSchema = z.object({
  subjectCode: subjectCodeSchema,
  exerciseCount: z.number().int().min(1).max(20).optional().default(20),
  difficulty: z.enum(['mixed', 'easy', 'medium', 'hard']).optional().default('mixed'),
});

export const submitAttemptSchema = z.object({
  exerciseId: z.string().uuid(),
  userAnswer: z.union([z.string().max(500), z.array(z.string())]).optional(),
  timeSpentSeconds: z.number().int().min(0).max(3600).optional(),
  skipped: z.boolean().optional().default(false),
});

export type GeneratedExercise = z.infer<typeof generatedExerciseSchema>;
export type GenerateRoundRequest = z.infer<typeof generateRoundRequestSchema>;
