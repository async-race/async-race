import { updateCar } from '@/entities/car/api/car.api';

export async function handleUpdate(id: number, name: string, color: string) {
  const updatedCar = await updateCar(id, { name, color });
  return updatedCar;
}

export function CarUpdate() {
  return { handleUpdate };
}
