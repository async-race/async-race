import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input component', () => {
  it('creates an instance of input with default type', () => {
    const input = Input({ id: 'round' });

    expect(input.type).toBe('text');
  });

  it('adds baseClasses', () => {
    const input = Input({ id: 'round' });

    expect(input.className).toContain('bg-gray-50');
    expect(input.className).toContain('md:text-lg');
  });

  it('adds extraClasses', () => {
    const input = Input({ id: 'round', extraClasses: 'custom' });

    expect(input.className).toContain('custom');
  });

  it('adds given id', () => {
    const input = Input({ id: 'round' });

    expect(input.id).toBe('round');
  });

  it('adds given placeholder', () => {
    const input = Input({ id: 'round', placeholder: 'put in your choice' });

    expect(input.placeholder).toContain('put in your choice');
  });

  it('adds given name', () => {
    const input = Input({ id: 'round', name: 'winner' });

    expect(input.name).toBe('winner');
  });
});
