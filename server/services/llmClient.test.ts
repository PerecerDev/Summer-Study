import { describe, expect, it } from 'vitest';
import { parseLlmJson } from './llmClient.js';

describe('parseLlmJson', () => {
  it('parses raw JSON', () => {
    expect(parseLlmJson('{"ok":true}')).toEqual({ ok: true });
  });

  it('parses fenced JSON', () => {
    expect(parseLlmJson('```json\n{"ok":true}\n```')).toEqual({ ok: true });
  });
});
