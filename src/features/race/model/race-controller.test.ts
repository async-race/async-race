import { describe, it, expect, beforeEach } from 'vitest';
import { raceController } from './race-controller';

describe('raceController', () => {
  beforeEach(() => {
    raceController.stop();
  });

  it('creates a new signal when start is called', () => {
    const signal = raceController.start();

    expect(signal).toBeInstanceOf(AbortSignal);
    expect(signal.aborted).toBe(false);
  });

  it('aborts the previous signal when start is called again', () => {
    const firstSignal = raceController.start();
    const secondSignal = raceController.start();

    expect(firstSignal.aborted).toBe(true);
    expect(secondSignal).toBeInstanceOf(AbortSignal);
    expect(secondSignal.aborted).toBe(false);
  });

  it('aborts the signal and clears controller when stop is called', () => {
    const signal = raceController.start();
    raceController.stop();

    expect(signal.aborted).toBe(true);
    expect(raceController.getSignal()).toBeUndefined();
  });

  it('returns the current signal with getSignal', () => {
    const signal = raceController.start();
    const retrievedSignal = raceController.getSignal();

    expect(retrievedSignal).toBe(signal);
  });

  it('returns undefined from getSignal when no controller exists', () => {
    raceController.stop();

    expect(raceController.getSignal()).toBeUndefined();
  });
});
