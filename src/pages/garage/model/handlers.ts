import { race as raceApi } from '@/features';
import type { CarItem } from './types';
import { raceState } from '@/features/race/model/race-state';

export function createGarageCarHandlers(parameters: {
  getCarItems: () => Map<string, CarItem>;
}) {
  return {
    onStart(carId: number) {
      raceState.set({ mode: 'single' });
      raceState.addActiveCar(carId);

      const carItem = parameters.getCarItems().get(carId.toString());
      if (!carItem) throw new Error('Car not found');

      raceApi
        .startRaceForCar(carId, (velocity, distance) => {
          return raceApi.startCarAnimation(carItem, velocity, distance);
        })
        .catch(() => {});
    },

    onStop(carId: number) {
      void raceApi.stopRaceForCar(carId);
      raceState.removeActiveCar(carId);

      if (raceState.get().activeCarIds.size === 0) {
        raceState.reset();
      }

      const carItem = parameters.getCarItems().get(carId.toString());
      if (!carItem) throw new Error('Car not found');

      carItem.stopAnimation?.();
      carItem.car.style.transform = 'translateX(0)';
    },
  };
}
