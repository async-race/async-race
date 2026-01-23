import { startRaceForCar } from './start-race';
import { updateWinners } from '@/features/winners/update/model/update';
import { notifyUser } from '@/features/notify-user/notify-user';

export async function startRaceForAllCars(
  cars: {
    id: number;
    animate: (
      velocity: number,
      distance: number,
    ) => {
      start: () => void;
      stop: () => void;
      getTime: () => number;
    };
  }[],
  onEnd: () => void,
) {
  try {
    const winner = await Promise.any(
      cars.map(({ id, animate }) => startRaceForCar(id, animate)),
    );

    onEnd();

    await updateWinners(winner.carId, winner.time);
    notifyUser(
      `Winner: car #${winner.carId.toString()} (${winner.time.toFixed(2)}s)`,
    );
  } catch {
    notifyUser('No winners');
    onEnd();
  }
}
