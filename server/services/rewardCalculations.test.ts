import { describe, expect, it } from 'vitest';
import {
  calculateLevel,
  calculateRoundXp,
  calculateStars,
  getXpProgress,
  resolveStreak,
} from './rewardCalculations.js';

describe('calculateStars', () => {
  it('awards 1–3 stars by score band', () => {
    expect(calculateStars(40, 8, 20)).toBe(1);
    expect(calculateStars(60, 12, 20)).toBe(2);
    expect(calculateStars(85, 17, 20)).toBe(3);
  });

  it('adds perfect round bonus', () => {
    expect(calculateStars(100, 20, 20)).toBe(5);
  });
});

describe('calculateRoundXp', () => {
  it('sums correct answers, completion, and daily bonus', () => {
    expect(calculateRoundXp(10, false)).toBe(10 * 10 + 50);
    expect(calculateRoundXp(10, true)).toBe(10 * 10 + 50 + 25);
  });
});

describe('calculateLevel', () => {
  it('follows sqrt formula', () => {
    expect(calculateLevel(0)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(400)).toBe(3);
  });
});

describe('getXpProgress', () => {
  it('returns progress within current level', () => {
    expect(getXpProgress(150)).toEqual({ level: 2, xpInLevel: 50, xpForNextLevel: 300 });
  });
});

describe('resolveStreak', () => {
  it('extends streak on consecutive days', () => {
    expect(resolveStreak(2, '2026-07-04', '2026-07-05', '2026-07-04')).toBe(3);
  });

  it('keeps streak on same day', () => {
    expect(resolveStreak(3, '2026-07-05', '2026-07-05', '2026-07-04')).toBe(3);
  });

  it('resets streak after gap', () => {
    expect(resolveStreak(5, '2026-07-01', '2026-07-05', '2026-07-04')).toBe(1);
  });
});
