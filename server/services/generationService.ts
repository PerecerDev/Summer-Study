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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

async function buildGenerationPrompt(
  subjectCode: string,
  exerciseCount: number,
  orderOffset = 0,
): Promise<string> {
  assertSupportedSubject(subjectCode);

  const lastIndex = orderOffset + exerciseCount - 1;
  let subjectPrompt = await loadPrompt(`versions/v1.0.0/${subjectCode}.md`);

  subjectPrompt = subjectPrompt
    .replaceAll('{{exerciseCount}}', String(exerciseCount))
    .replaceAll('{{lastIndex}}', String(lastIndex));

  if (orderOffset > 0) {
    subjectPrompt = subjectPrompt.replace(
      'orderIndex debe ir de 0 a',
      `orderIndex debe ir de ${orderOffset} a`,
    );
  }

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

const GENERATION_BATCH_SIZE = 10;
const MAX_GENERATION_ATTEMPTS = 4;

function remapOrderIndex(
  exercises: GeneratedExercise[],
  orderOffset: number,
): GeneratedExercise[] {
  return exercises.map((exercise, index) => ({
    ...exercise,
    orderIndex: orderOffset + index,
  }));
}

function getRateLimitDelayMs(error: unknown): number | null {
  if (!(error instanceof ApiError) || error.code !== 'GENERATION_RATE_LIMIT') {
    return null;
  }

  const details = error.details;

  if (details && typeof details === 'object' && 'retryAfterMs' in details) {
    const retryAfterMs = (details as { retryAfterMs?: unknown }).retryAfterMs;

    if (typeof retryAfterMs === 'number' && Number.isFinite(retryAfterMs)) {
      return retryAfterMs;
    }
  }

  return 20_000;
}

async function generateBatchWithRetries(
  subjectCode: string,
  exerciseCount: number,
  orderOffset: number,
): Promise<GeneratedExercise[]> {
  const systemPrompt = await loadPrompt('versions/v1.0.0/system.md');
  const userPrompt = await buildGenerationPrompt(subjectCode, exerciseCount, orderOffset);
  const maxTokens = exerciseCount <= 10 ? 4096 : 8192;

  let lastError: unknown;

  for (let attempt = 0; attempt < MAX_GENERATION_ATTEMPTS; attempt += 1) {
    try {
      const raw = await chatCompletionJson(
        systemPrompt,
        attempt > 0
          ? `${userPrompt}\n\nIMPORTANTE: Responde únicamente con JSON válido. Genera exactamente ${exerciseCount} ejercicios con orderIndex de ${orderOffset} a ${orderOffset + exerciseCount - 1}.`
          : userPrompt,
        maxTokens,
      );
      const parsed = generateRoundResponseSchema.parse(parseLlmJson(raw));

      if (parsed.exercises.length !== exerciseCount) {
        throw new Error('Invalid exercise count');
      }

      const exercises = remapOrderIndex(parsed.exercises, orderOffset);

      if (!deduplicateQuestions(exercises)) {
        throw new Error('Duplicate questions');
      }

      return exercises;
    } catch (error) {
      lastError = error;

      const retryDelayMs = getRateLimitDelayMs(error);

      if (retryDelayMs !== null && attempt < MAX_GENERATION_ATTEMPTS - 1) {
        await sleep(retryDelayMs);
      }
    }
  }

  console.error('Generation failed after retries:', lastError);

  if (lastError instanceof ApiError) {
    throw lastError;
  }

  throw new ApiError(
    'GENERATION_FAILED',
    503,
    'No se pudieron generar los ejercicios. Inténtalo más tarde.',
  );
}

async function generateWithRetries(
  subjectCode: string,
  exerciseCount: number,
): Promise<{ exercises: GeneratedExercise[]; promptVersion: string }> {
  if (exerciseCount <= GENERATION_BATCH_SIZE) {
    const exercises = await generateBatchWithRetries(subjectCode, exerciseCount, 0);
    return { exercises, promptVersion: PROMPT_VERSION };
  }

  const exercises: GeneratedExercise[] = [];
  let orderOffset = 0;

  while (orderOffset < exerciseCount) {
    const batchSize = Math.min(GENERATION_BATCH_SIZE, exerciseCount - orderOffset);
    const batch = await generateBatchWithRetries(subjectCode, batchSize, orderOffset);
    exercises.push(...batch);
    orderOffset += batchSize;

    if (orderOffset < exerciseCount) {
      await sleep(1500);
    }
  }

  if (!deduplicateQuestions(exercises)) {
    throw new ApiError(
      'GENERATION_FAILED',
      503,
      'No se pudieron generar los ejercicios. Inténtalo más tarde.',
    );
  }

  return { exercises, promptVersion: PROMPT_VERSION };
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
