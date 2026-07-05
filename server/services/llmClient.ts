import { ApiError } from '../lib/errors.js';

export const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';
export const DEFAULT_GROQ_MODEL = 'llama-3.3-70b-versatile';

export function getLlmApiKey(): string | undefined {
  return process.env.GROQ_API_KEY ?? process.env.LLM_API_KEY;
}

export function getLlmBaseUrl(): string {
  return process.env.LLM_BASE_URL ?? GROQ_BASE_URL;
}

export function getLlmModel(): string {
  return process.env.LLM_MODEL ?? DEFAULT_GROQ_MODEL;
}

export function isLlmConfigured(): boolean {
  return Boolean(getLlmApiKey()) && process.env.MOCK_LLM !== 'true';
}

export function parseLlmJson(raw: string): unknown {
  const trimmed = raw.trim();
  const fenceMatch = /^```(?:json)?\s*([\s\S]*?)```$/i.exec(trimmed);
  const jsonText = fenceMatch?.[1]?.trim() ?? trimmed;
  return JSON.parse(jsonText) as unknown;
}

export async function chatCompletionJson(
  systemPrompt: string,
  userPrompt: string,
): Promise<string> {
  const apiKey = getLlmApiKey();

  if (!apiKey) {
    throw new ApiError(
      'GENERATION_FAILED',
      503,
      'Generación no disponible. Configura GROQ_API_KEY.',
    );
  }

  const response = await fetch(`${getLlmBaseUrl()}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: getLlmModel(),
      temperature: 0.6,
      max_tokens: 8192,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
    signal: AbortSignal.timeout(90_000),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    console.error('Groq API error:', response.status, errorBody.slice(0, 500));
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
