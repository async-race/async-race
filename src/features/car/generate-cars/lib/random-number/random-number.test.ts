import { describe, it, expect } from 'vitest';
import { getRandomInt } from './random-number';

describe('getRandomInt', () => {
  it('should return a number', () => {
    const generatedValue: number = getRandomInt(1, 10);

    expect(typeof generatedValue).toBe('number');
  });

  it('should always return a value within the given range', () => {
    const minimumValue: number = 5;
    const maximumValue: number = 15;
    for (let iterationIndex = 0; iterationIndex < 100; iterationIndex++) {
      const generatedValue: number = getRandomInt(minimumValue, maximumValue);

      expect(generatedValue).toBeGreaterThanOrEqual(minimumValue);
      expect(generatedValue).toBeLessThanOrEqual(maximumValue);
    }
  });

  it('should include both minimum and maximum boundaries', () => {
    const minimumValue: number = 1;
    const maximumValue: number = 1;
    const generatedValue: number = getRandomInt(minimumValue, maximumValue);

    expect(generatedValue).toBe(1);
  });

  it('should handle negative ranges correctly', () => {
    const minimumValue: number = -5;
    const maximumValue: number = -1;
    for (let iterationIndex = 0; iterationIndex < 50; iterationIndex++) {
      const generatedValue: number = getRandomInt(minimumValue, maximumValue);

      expect(generatedValue).toBeGreaterThanOrEqual(minimumValue);
      expect(generatedValue).toBeLessThanOrEqual(maximumValue);
    }
  });
});
