import { carsQueryStore, carsStore } from '@/entities';
import { cars as carsAPI, race as raceApi } from '@/features';
import { raceControls } from '@/widgets';
import { stoptRaceForAllCars } from '@/features/race/model/start-race-all';
import { startCarAnimation } from '@/features/race/model/car-animation';
import type { CarItem } from './types';
import { raceState } from '@/features/race/model/race-state';

export function initGarageRaceControls(
  getCarItems: () => Map<string, CarItem>,
) {
  const { element, buttons } = raceControls({
    onGenerate: () => {
      void (async () => {
        await carsAPI.generateCars();
        carsQueryStore.set({ page: 1 });
      })();
    },

    onReset: () => {
      raceState.set({ phase: 'resetting' });
      raceApi.raceController.stop();

      const { items: cars } = carsStore.get();

      void stoptRaceForAllCars(cars, () => {
        // controls.setAddDisabled(false);

        getCarItems().forEach((item) => {
          item.stopAnimation?.();
          item.car.style.transform = 'translateX(0)';
        });
        raceState.reset();
      });
    },

    onStartRace: () => {
      // controls.setAddDisabled(true);
      // controls.setEditDisabled(true);
      raceState.set({ mode: 'all', phase: 'running' });
      const { items: cars } = carsStore.get();

      const raceCars = cars.map((car) => {
        const carItem = getCarItems().get(car.id.toString());
        if (!carItem) throw new Error('Car not found');

        return {
          id: car.id,
          animate: (velocity: number, distance: number) =>
            startCarAnimation(carItem, velocity, distance),
        };
      });

      void raceApi.startRaceForAllCars(raceCars, () => {
        raceState.set({ phase: 'finished' });
      });
    },
  });

  return { element, buttons };
}
