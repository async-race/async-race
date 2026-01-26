import { describe, it, expect, beforeEach } from 'vitest';
import { raceState } from './race-state';

describe('raceState', () => {
  beforeEach(() => {
    raceState.reset();
  });

  it('returns initial state', () => {
    const currentState = raceState.get();

    expect(currentState.mode).toBe('idle');
    expect(currentState.phase).toBe('ready');
    expect(currentState.activeCarIds.size).toBe(0);
  });

  it('updates state using set', () => {
    raceState.set({ mode: 'single', phase: 'running' });
    const currentState = raceState.get();

    expect(currentState.mode).toBe('single');
    expect(currentState.phase).toBe('running');
  });

  it('updates activeCarIds using set', () => {
    raceState.set({ activeCarIds: new Set([1, 2]) });
    const currentState = raceState.get();

    expect(currentState.activeCarIds.has(1)).toBe(true);
    expect(currentState.activeCarIds.has(2)).toBe(true);
  });

  it('adds active car', () => {
    raceState.addActiveCar(5);
    const currentState = raceState.get();

    expect(currentState.activeCarIds.has(5)).toBe(true);
  });

  it('deletes active car', () => {
    raceState.addActiveCar(10);
    raceState.removeActiveCar(10);
    const currentState = raceState.get();

    expect(currentState.activeCarIds.has(10)).toBe(false);
  });

  it('drops state', () => {
    raceState.set({
      mode: 'all',
      phase: 'finished',
      activeCarIds: new Set([3]),
    });
    raceState.reset();
    const currentState = raceState.get();

    expect(currentState.mode).toBe('idle');
    expect(currentState.phase).toBe('ready');
    expect(currentState.activeCarIds.size).toBe(0);
  });

  it('notifies subscribers about state changes', () => {
    let notified = false;
    const unsubscribe = raceState.subscribe(() => {
      notified = true;
    });

    raceState.set({ mode: 'single' });

    expect(notified).toBe(true);

    unsubscribe();
  });

  it('deletes subscribers after calling unsubscribe', () => {
    let callCount = 0;
    const unsubscribe = raceState.subscribe(() => {
      callCount += 1;
    });

    raceState.set({ mode: 'single' });

    expect(callCount).toBe(1);

    unsubscribe();
    raceState.set({ mode: 'all' });

    expect(callCount).toBe(1);
  });
});
