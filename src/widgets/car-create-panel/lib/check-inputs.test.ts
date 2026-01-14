import { resolveColor, resolveName } from './check-inputs';
import { describe, it, expect } from 'vitest';

describe('resolveName, resolveColor functions', () => {
  it('resolveName returns given string', () => {
    const result = resolveName('mercedes');

    expect(result).toBe('mercedes');
  });

  it("resolveName returns default 'tesla' with no arguments given", () => {
    const result = resolveName();

    expect(result).toBe('tesla');
  });

  it('resolveColor returns given color', () => {
    const result = resolveColor('#ff0000');

    expect(result).toBe('#ff0000');
  });

  it("resolveColor returns default '#000000' with no arguments given", () => {
    const result = resolveColor();

    expect(result).toBe('#000000');
  });
});
