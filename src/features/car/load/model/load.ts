import { car, carsQueryStore, carsStore } from '@/entities';

export async function loadCars() {
  const query = carsQueryStore.get();
  const { items, total } = await car.getCars(query);
  carsStore.set(items, total);
}
