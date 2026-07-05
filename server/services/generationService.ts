import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  generateRoundResponseSchema,
  type GeneratedExercise,
} from '../schemas/rounds.js';
import { generateMockMathExercises } from './mockExerciseGenerator.js';
import { chatCompletionJson, isLlmConfigured, parseLlmJson } from './llmClient.js';
import { ApiError } from '../lib/errors.js';

const PROMPT_VERSION = '1.0.0';
const __dirname = dirname(fileURLToPath(import.meta.url));
const PROMPTS_DIR = resolve(__dirname, '../prompts');

export function shouldUseMockLlm(): boolean {
  return process.env.MOCK_LLM === 'true' || !isLlmConfigured();
}

async function loadPrompt(relativePath: string): Promise<string> {
  return readFile(resolve(PROMPTS_DIR, relativePath), 'utf-8');
}

function buildGenerationPrompt(subjectCode: string, exerciseCount: number): string {
  if (subjectCode !== 'math') {
    throw new ApiError('SUBJECT_UNAVAILABLE', 400, 'Esta materia aún no está disponible');
  }

  const lastIndex = exerciseCount - 1;

  return `Genera exactamente ${exerciseCount} ejercicios de matemáticas (4º Primaria, España).

Requisitos:
- orderIndex de 0 a ${lastIndex}, sin saltos ni duplicados
- Tipos: multiple_choice, true_false, fill_blank, short_answer
- topicTag: numeros_operaciones | fracciones_basicas | geometria_plana | medidas | problemas_aritmeticos
- difficulty: easy | medium | hard (mezcla: 40% easy, 40% medium, 20% hard)
- Preguntas distintas entre sí
- promptVersion: "${PROMPT_VERSION}"

Responde SOLO con JSON válido:
{
  "exercises": [
    {
      "orderIndex": 0,
      "type": "multiple_choice",
      "question": "¿Cuánto es 12 + 8?",
      "options": ["18", "20", "22", "19"],
      "correctAnswer": "20",
      "explanation": "12 + 8 = 20",
      "topicTag": "numeros_operaciones",
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
  const subjectPrompt = await loadPrompt(`versions/v1.0.0/${subjectCode}.md`);
  const userPrompt = `${subjectPrompt}\n\n${buildGenerationPrompt(subjectCode, exerciseCount)}`;

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
  if (subjectCode !== 'math') {
    throw new ApiError('SUBJECT_UNAVAILABLE', 400, 'Esta materia aún no está disponible');
  }

  if (shouldUseMockLlm()) {
    if (process.env.NODE_ENV === 'production' && !isLlmConfigured()) {
      throw new ApiError(
        'GENERATION_FAILED',
        503,
        'Generación no disponible. Configura GROQ_API_KEY en el servidor.',
      );
    }

    return {
      exercises: generateMockMathExercises(exerciseCount),
      promptVersion: PROMPT_VERSION,
    };
  }

  return generateWithRetries(subjectCode, exerciseCount);
}
