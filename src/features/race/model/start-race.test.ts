import { describe, it, expect, vi, beforeEach } from 'vitest';
import { startRaceForCar, stopRaceForCar } from './start-race';
import type { RaceResult } from './start-race';
import { engine } from '@/entities';

describe('race-controls', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should start race and return RaceResult when drive succeeds', async () => {
    const mockStartEngineResponse = { data: { velocity: 100, distance: 500 } };

    vi.spyOn(engine, 'startEngine').mockResolvedValue(mockStartEngineResponse);
    vi.spyOn(engine, 'driveEngine').mockResolvedValue({
      data: { success: true },
    });

    const mockAnimation = {
      start: vi.fn(),
      stop: vi.fn(),
      getTime: vi.fn().mockReturnValue(2000),
    };

    const result: RaceResult = await startRaceForCar(1, () => mockAnimation);

    expect(result.carId).toBe(1);
    expect(result.time).toBe(2);
    expect(mockAnimation.start).toHaveBeenCalled();
  });

  it('should throw Race error if driveEngine fails', async () => {
    const mockStartEngineResponse = { data: { velocity: 100, distance: 500 } };

    vi.spyOn(engine, 'startEngine').mockResolvedValue(mockStartEngineResponse);
    vi.spyOn(engine, 'driveEngine').mockRejectedValue(
      new Error('Drive failed'),
    );

    const mockAnimation = {
      start: vi.fn(),
      stop: vi.fn(),
      getTime: vi.fn().mockReturnValue(2000),
    };

    await expect(startRaceForCar(1, () => mockAnimation)).rejects.toThrow(
      'Race error',
    );

    expect(mockAnimation.stop).toHaveBeenCalled();
  });

  it('should throw AbortError if signal is aborted before start', async () => {
    const abortController = new AbortController();
    abortController.abort();

    const mockAnimation = {
      start: vi.fn(),
      stop: vi.fn(),
      getTime: vi.fn().mockReturnValue(2000),
    };

    await expect(
      startRaceForCar(1, () => mockAnimation, abortController.signal),
    ).rejects.toThrowError(DOMException);
  });

  it('should call stopEngine in stopRaceForCar', async () => {
    const mockStopEngine = vi.spyOn(engine, 'stopEngine').mockResolvedValue();

    await stopRaceForCar(1);

    expect(mockStopEngine).toHaveBeenCalledWith(1);
  });

  it('should not throw if stopEngine fails in stopRaceForCar', async () => {
    vi.spyOn(engine, 'stopEngine').mockRejectedValue(new Error('Stop failed'));

    await expect(stopRaceForCar(1)).resolves.toBeUndefined();
  });
});
