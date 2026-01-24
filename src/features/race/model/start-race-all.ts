import { startRaceForCar } from './start-race';
import { updateWinners } from '@/features/winners/update/model/update';
import { notifyUser } from '@/features/notify-user/notify-user';
import { carsStore } from '@/entities';

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
    const winnerName = carsStore.getById(winner.carId)?.name;
    notifyUser(
      `Winner: car #${winner.carId.toString()} ${winnerName || ''} with (${winner.time.toFixed(2)}s)`,
    );
  } catch {
    notifyUser('No winners');
    onEnd();
  }
}
