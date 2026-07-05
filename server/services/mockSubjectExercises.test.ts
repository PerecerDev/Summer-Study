import { describe, expect, it } from 'vitest';
import { generatedExerciseSchema } from '../schemas/rounds.js';
import { generateMockExercises } from './mockSubjectExercises.js';

const SUBJECTS = ['math', 'language', 'english', 'valencian', 'medi'] as const;

describe('generateMockExercises', () => {
  it.each(SUBJECTS)('generates valid exercises for %s', (subjectCode) => {
    const exercises = generateMockExercises(subjectCode, 20);

    expect(exercises).toHaveLength(20);

    for (const exercise of exercises) {
      expect(() => generatedExerciseSchema.parse(exercise)).not.toThrow();
    }
  });
});
