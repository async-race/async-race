import { car } from '@/entities';
import { type CreateCarDto } from '@/entities';
import { loadCars } from '../../load/model/load';

export async function createCar(dto: CreateCarDto) {
  await car.createCar(dto);
  await loadCars();
}
