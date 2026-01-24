import { describe, it, expect } from 'vitest';
import { getRandomColor } from './random-color';

describe('getRandomColor', () => {
  it('should return a string', () => {
    const generatedColor: string = getRandomColor();

    expect(typeof generatedColor).toBe('string');
  });

  it('should start with #', () => {
    const generatedColor: string = getRandomColor();

    expect(generatedColor.startsWith('#')).toBe(true);
  });

  it('should have a length of 7 characters', () => {
    const generatedColor: string = getRandomColor();

    expect(generatedColor).toHaveLength(7);
  });

  it('should contain only valid HEX characters', () => {
    const generatedColor: string = getRandomColor();
    const hexCharactersPattern: RegExp = /^#[0-9A-F]{6}$/;

    expect(hexCharactersPattern.test(generatedColor)).toBe(true);
  });

  it('should generate different values on multiple calls', () => {
    const firstGeneratedColor: string = getRandomColor();
    const secondGeneratedColor: string = getRandomColor();

    expect(firstGeneratedColor).not.toBe(secondGeneratedColor);
  });
});
