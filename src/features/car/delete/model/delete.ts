import { car } from '@/entities';
import { loadCars } from '../../load/model/load';

export async function deleteCar(id: number) {
  await car.deleteCar(id);
  await loadCars();
}
