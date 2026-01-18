import { carsQueryStore } from '@/entities';
import { cars } from '@/features';

export async function initCars() {
  await cars.loadCars();

  return carsQueryStore.subscribe(() => {
    void cars.loadCars();
  });
}
