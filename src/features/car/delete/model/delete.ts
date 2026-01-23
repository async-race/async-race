import { car } from '@/entities';
import { loadCars } from '../../load/model/load';
import { deleteWinners } from '@/features/winners/delete/model/delete';

export async function deleteCar(id: number) {
  await car.deleteCar(id);
  await deleteWinners(id);
  await loadCars();
}
