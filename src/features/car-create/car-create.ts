import { createCar } from '@/entities/car/api/car.api';

export async function handleCreate(name: string, color: string) {
  const newCar = await createCar({ name, color });
  return newCar;
}

export function CarCreate() {
  return { handleCreate };
}
