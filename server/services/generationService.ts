import { existsSync } from 'node:fs';
import { readFile as readFileAsync } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  generateRoundResponseSchema,
  subjectCodeSchema,
  type GeneratedExercise,
} from '../schemas/rounds.js';
import { generateMockExercises, type SubjectCode } from './mockSubjectExercises.js';
import { chatCompletionJson, isLlmConfigured, parseLlmJson } from './llmClient.js';
import { ApiError } from '../lib/errors.js';

const PROMPT_VERSION = '1.0.0';
const __dirname = dirname(fileURLToPath(import.meta.url));

function getPromptsDir(): string {
  const candidates = [
    resolve(__dirname, 'prompts'),
    resolve(__dirname, '../prompts'),
  ];

  for (const dir of candidates) {
    if (existsSync(dir)) return dir;
  }

  return candidates[1] ?? candidates[0];
}

export function shouldUseMockLlm(): boolean {
  return process.env.MOCK_LLM === 'true' || !isLlmConfigured();
}

function assertSupportedSubject(subjectCode: string): void {
  const parsed = subjectCodeSchema.safeParse(subjectCode);

  if (!parsed.success) {
    throw new ApiError('VALIDATION_ERROR', 400, 'Materia no válida');
  }
}

async function loadPrompt(relativePath: string): Promise<string> {
  const promptsDir = getPromptsDir();

  try {
    return await readFileAsync(resolve(promptsDir, relativePath), 'utf-8');
  } catch (error) {
    const code =
      error && typeof error === 'object' && 'code' in error
        ? String((error as NodeJS.ErrnoException).code)
        : undefined;

    if (code === 'ENOENT') {
      console.error('Prompt file missing:', relativePath, 'from', promptsDir);
      throw new ApiError(
        'GENERATION_FAILED',
        503,
        'No se pudieron generar los ejercicios. Inténtalo más tarde.',
      );
    }

    throw error;
  }
}

async function buildGenerationPrompt(subjectCode: string, exerciseCount: number): Promise<string> {
  assertSupportedSubject(subjectCode);

  const lastIndex = exerciseCount - 1;
  let subjectPrompt = await loadPrompt(`versions/v1.0.0/${subjectCode}.md`);

  subjectPrompt = subjectPrompt
    .replaceAll('{{exerciseCount}}', String(exerciseCount))
    .replaceAll('{{lastIndex}}', String(lastIndex));

  return `${subjectPrompt}

Responde SOLO con JSON válido:
{
  "exercises": [
    {
      "orderIndex": 0,
      "type": "multiple_choice",
      "question": "Pregunta de ejemplo",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Breve explicación",
      "topicTag": "tema",
      "difficulty": "easy"
    }
  ],
  "promptVersion": "${PROMPT_VERSION}"
}`;
}

function deduplicateQuestions(exercises: GeneratedExercise[]): boolean {
  const seen = new Set<string>();

  for (const exercise of exercises) {
    const key = exercise.question.trim().toLowerCase();

    if (seen.has(key)) return false;
    seen.add(key);
  }

  return true;
}

async function generateWithRetries(
  subjectCode: string,
  exerciseCount: number,
): Promise<{ exercises: GeneratedExercise[]; promptVersion: string }> {
  const systemPrompt = await loadPrompt('versions/v1.0.0/system.md');
  const userPrompt = await buildGenerationPrompt(subjectCode, exerciseCount);

  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const raw = await chatCompletionJson(
        systemPrompt,
        attempt > 0
          ? `${userPrompt}\n\nIMPORTANTE: Responde únicamente con JSON válido. Genera exactamente ${exerciseCount} ejercicios.`
          : userPrompt,
      );
      const parsed = generateRoundResponseSchema.parse(parseLlmJson(raw));

      if (parsed.exercises.length !== exerciseCount) {
        throw new Error('Invalid exercise count');
      }

      if (!deduplicateQuestions(parsed.exercises)) {
        throw new Error('Duplicate questions');
      }

      return { exercises: parsed.exercises, promptVersion: PROMPT_VERSION };
    } catch (error) {
      lastError = error;
    }
  }

  console.error('Generation failed after retries:', lastError);
  throw new ApiError(
    'GENERATION_FAILED',
    503,
    'No se pudieron generar los ejercicios. Inténtalo más tarde.',
  );
}

export async function generateExercises(
  subjectCode: string,
  exerciseCount: number,
): Promise<{ exercises: GeneratedExercise[]; promptVersion: string }> {
  assertSupportedSubject(subjectCode);

  if (shouldUseMockLlm()) {
    if (process.env.NODE_ENV === 'production' && !isLlmConfigured()) {
      throw new ApiError(
        'GENERATION_FAILED',
        503,
        'Generación no disponible. Configura GROQ_API_KEY en el servidor.',
      );
    }

    return {
      exercises: generateMockExercises(subjectCode as SubjectCode, exerciseCount),
      promptVersion: PROMPT_VERSION,
    };
  }

  return generateWithRetries(subjectCode, exerciseCount);
}
