import { getRandomColor } from './lib/random-color/random-color';
import { getRandomInt } from './lib/random-number/random-number';
import type { Car } from '@/entities';
import { randomCar } from './model/types';
import { createCar } from '@/entities/car/api/car.api';
import { carsStore } from '@/entities';

export async function generateCars(count = 100): Promise<Car[]> {
  const carsRandomCollection: Car[] = [];
  for (let index = 0; index < count; index += 1) {
    const carIndex = getRandomInt(0, randomCar.length - 1);
    const color = getRandomColor();
    try {
      const { data } = await createCar({
        name: randomCar[carIndex],
        color: color,
      });

      carsRandomCollection.push(data);
    } catch (error) {
      console.log(error);
    }
  }

  carsStore.set(carsRandomCollection, carsRandomCollection.length);

  return carsRandomCollection;
}
