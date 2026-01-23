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
  onDriveError?: (id: number) => void,
) {
  try {
    const {
      data: { velocity, distance },
    } = await engine.startEngine(id);

    const animation = onAnimationStart(velocity, distance);
    animation.start();

    try {
      await engine.driveEngine(id);
      const time = animation.getTime() / 1000;
      return { carId: id, time };
    } catch {
      if (onDriveError) onDriveError(id);
      animation.stop();
      throw new Error('Race error');
    }
  } catch {
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
