import { startRaceForCar, stopRaceForCar } from './start-race';
import { updateWinners } from '@/features/winners/update/model/update';
import { notifyUser } from '@/features/notify-user/notify-user';
import { carsStore } from '@/entities';
import { raceController } from './race-controller';

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
  const signal = raceController.start();

  try {
    const winner = await Promise.any(
      cars.map(({ id, animate }) => startRaceForCar(id, animate, signal)),
    );

    if (signal.aborted) return;

    onEnd();

    await updateWinners(winner.carId, winner.time);
    const winnerName = carsStore.getById(winner.carId)?.name;
    notifyUser(
      `Winner: car #${winner.carId.toString()} ${winnerName || ''} with (${winner.time.toFixed(2)}s)`,
    );
  } catch {
    if (!signal.aborted) {
      notifyUser('No winners');
    }
    onEnd();
  }
}

export async function stoptRaceForAllCars(
  cars: { id: number }[],
  onEnd: () => void,
) {
  try {
    await Promise.allSettled(cars.map(({ id }) => stopRaceForCar(id)));
    onEnd();
  } catch {
    /* empty */
  }
}
