import { describe, expect, it } from 'vitest';
import { parseGroqRetryDelayMs, parseLlmJson } from './llmClient.js';

describe('parseLlmJson', () => {
  it('parses raw JSON', () => {
    expect(parseLlmJson('{"ok":true}')).toEqual({ ok: true });
  });

  it('parses fenced JSON', () => {
    expect(parseLlmJson('```json\n{"ok":true}\n```')).toEqual({ ok: true });
  });
});

describe('parseGroqRetryDelayMs', () => {
  it('parses retry delay from Groq error body', () => {
    const body = JSON.stringify({
      error: {
        message:
          'Rate limit reached ... Please try again in 18.82s. Need more tokens?',
      },
    });

    expect(parseGroqRetryDelayMs(body)).toBe(19_320);
  });

  it('falls back to 20 seconds when delay is missing', () => {
    expect(parseGroqRetryDelayMs('{"error":{"message":"Rate limit reached"}}')).toBe(20_000);
  });
});
