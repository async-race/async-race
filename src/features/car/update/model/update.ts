import { car } from '@/entities';
import { type CreateCarDto } from '@/entities';
import { loadCars } from '../../load/model/load';

export async function updateCar(id: number, dto: CreateCarDto) {
  try {
    await car.updateCar(id, dto);
    await loadCars();
  } catch {
    return;
  }
}
