import { describe, expect, it } from 'vitest';
import { generateToken, hashToken } from '../lib/crypto';

describe('crypto utils', () => {
  it('generates unique tokens', () => {
    const a = generateToken();
    const b = generateToken();

    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(20);
  });

  it('hashes tokens deterministically', () => {
    const token = 'test-token';
    expect(hashToken(token)).toBe(hashToken(token));
    expect(hashToken(token)).not.toBe(token);
  });
});
