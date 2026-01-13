import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { startEngine, stopEngine, driveEngine } from './engine.api';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('engine.api', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('startEngine should returns velocity and distance', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(
        { velocity: 100, distance: 5000 },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    const result = await startEngine(1);

    expect(result.data.velocity).toBe(100);
    expect(result.data.distance).toBe(5000);
  });

  it('driveEngine should returns success true', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(
        { success: true },
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    const result = await driveEngine(1);

    expect(result.data.success).toBe(true);
  });

  it('stopEngine should resolves without data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 200,
      }),
    );

    await expect(stopEngine(1)).resolves.toBeUndefined();
  });

  it('driveEngine should throws on 500 error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 500,
        statusText: 'Engine failure',
      }),
    );

    await expect(driveEngine(1)).rejects.toThrow(
      'HTTP error: 500 Engine failure',
    );
  });
});
