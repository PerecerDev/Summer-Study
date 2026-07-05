import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  generateRoundResponseSchema,
  type GeneratedExercise,
} from '../schemas/rounds.js';
import { generateMockMathExercises } from './mockExerciseGenerator.js';
import { ApiError } from '../lib/errors.js';

const PROMPT_VERSION = '1.0.0';
const __dirname = dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = resolve(__dirname, '../prompts');

export function shouldUseMockLlm(): boolean {
  return process.env.MOCK_LLM === 'true' || !process.env.LLM_API_KEY;
}

async function loadPrompt(relativePath: string): Promise<string> {
  return readFile(resolve(PROMPTS_DIR, relativePath), 'utf-8');
}

function buildUserPrompt(subjectCode: string, exerciseCount: number): string {
  if (subjectCode !== 'math') {
    throw new ApiError('SUBJECT_UNAVAILABLE', 400, 'Esta materia aún no está disponible');
  }

  return `Genera ${exerciseCount} ejercicios de matemáticas. promptVersion: ${PROMPT_VERSION}`;
}

async function callOpenAi(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.LLM_API_KEY;
  const model = process.env.LLM_MODEL ?? 'gpt-4o-mini';
  const baseUrl = process.env.LLM_BASE_URL ?? 'https://api.openai.com/v1';

  if (!apiKey) {
    throw new ApiError('GENERATION_FAILED', 503, 'Generación no disponible');
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(60_000),
  });

  if (!response.ok) {
    throw new ApiError('GENERATION_FAILED', 503, 'No se pudieron generar los ejercicios');
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new ApiError('GENERATION_FAILED', 503, 'Respuesta vacía del modelo');
  }

  return content;
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
  const subjectPrompt = await loadPrompt(`versions/v1.0.0/${subjectCode}.md`);
  const userPrompt = `${subjectPrompt}\n\n${buildUserPrompt(subjectCode, exerciseCount)}`;

  let lastError: unknown;

  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      const raw = await callOpenAi(systemPrompt, userPrompt);
      const parsed = generateRoundResponseSchema.parse(JSON.parse(raw));

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
  throw new ApiError('GENERATION_FAILED', 503, 'No se pudieron generar los ejercicios. Inténtalo más tarde.');
}

export async function generateExercises(
  subjectCode: string,
  exerciseCount: number,
): Promise<{ exercises: GeneratedExercise[]; promptVersion: string }> {
  if (subjectCode !== 'math') {
    throw new ApiError('SUBJECT_UNAVAILABLE', 400, 'Esta materia aún no está disponible');
  }

  if (shouldUseMockLlm()) {
    return {
      exercises: generateMockMathExercises(exerciseCount),
      promptVersion: PROMPT_VERSION,
    };
  }

  return generateWithRetries(subjectCode, exerciseCount);
}
