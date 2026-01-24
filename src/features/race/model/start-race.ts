import { engine } from '@/entities';

export type RaceResult = {
  carId: number;
  time: number;
};

export async function startRaceForCar(
  id: number,
  onAnimationStart: (
    velocity: number,
    distance: number,
  ) => {
    start: () => void;
    stop: () => void;
    getTime: () => number;
  },
  signal?: AbortSignal,
) {
  if (signal?.aborted) {
    throw new DOMException('Aborted', 'AbortError');
  }

  const abortPromise = new Promise<never>((_, reject) => {
    signal?.addEventListener('abort', () => {
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

  try {
    const startResponse = await Promise.race([
      engine.startEngine(id),
      abortPromise,
    ]);

    const { velocity, distance } = startResponse.data;
    const animation = onAnimationStart(velocity, distance);
    animation.start();
    try {
      await Promise.race([engine.driveEngine(id), abortPromise]);
      const time = animation.getTime() / 1000;
      return { carId: id, time };
    } catch {
      animation.stop();
      throw new Error('Race error');
    }
  } catch (error) {
    if ((error as DOMException).name === 'AbortError') {
      throw error;
    }
    throw new Error('Race error');
  }
}

export async function stopRaceForCar(id: number): Promise<void> {
  try {
    await engine.stopEngine(id);
  } catch {
    /* empty */
  }
}
