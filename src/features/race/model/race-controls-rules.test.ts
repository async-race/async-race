import { describe, it, expect, beforeEach } from 'vitest';
import { raceState } from './race-state';
import { getRaceControlsState } from './race-controls-rules';

describe('getRaceControlsState', () => {
  beforeEach(() => {
    raceState.reset();
  });

  it('returns start and generate as true when phase is ready and mode is idle', () => {
    raceState.set({ mode: 'idle', phase: 'ready' });
    const controls = getRaceControlsState();

    expect(controls.start).toBe(true);
    expect(controls.generate).toBe(true);
    expect(controls.reset).toBe(false);
    expect(controls.resetting).toBe(false);
  });

  it('returns reset as true when phase is finished', () => {
    raceState.set({ mode: 'all', phase: 'finished' });
    const controls = getRaceControlsState();

    expect(controls.reset).toBe(true);
    expect(controls.start).toBe(false);
    expect(controls.generate).toBe(false);
    expect(controls.resetting).toBe(false);
  });

  it('returns reset as true when mode is single and phase is not resetting', () => {
    raceState.set({ mode: 'single', phase: 'running' });
    const controls = getRaceControlsState();

    expect(controls.reset).toBe(true);
    expect(controls.start).toBe(false);
    expect(controls.generate).toBe(false);
    expect(controls.resetting).toBe(false);
  });

  it('returns resetting as true when phase is resetting', () => {
    raceState.set({ mode: 'single', phase: 'resetting' });
    const controls = getRaceControlsState();

    expect(controls.resetting).toBe(true);
    expect(controls.reset).toBe(false);
    expect(controls.start).toBe(false);
    expect(controls.generate).toBe(false);
  });

  it('returns all flags as false when phase is running and mode is all', () => {
    raceState.set({ mode: 'all', phase: 'running' });
    const controls = getRaceControlsState();

    expect(controls.start).toBe(false);
    expect(controls.reset).toBe(false);
    expect(controls.generate).toBe(false);
    expect(controls.resetting).toBe(false);
  });
});
