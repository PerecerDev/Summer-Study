import { describe, expect, it } from 'vitest';
import { generateMockMathExercises } from './mockExerciseGenerator.js';
import { generatedExerciseSchema } from '../schemas/rounds.js';

describe('generateMockMathExercises', () => {
  it('generates 20 valid unique exercises', () => {
    const exercises = generateMockMathExercises(20);

    expect(exercises).toHaveLength(20);

    const questions = new Set<string>();

    for (const exercise of exercises) {
      expect(() => generatedExerciseSchema.parse(exercise)).not.toThrow();
      questions.add(exercise.question);
    }

    expect(questions.size).toBe(20);
  });
});
