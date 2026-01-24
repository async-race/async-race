import { getRandomColor } from './lib/random-color/random-color';
import { getRandomInt } from './lib/random-number/random-number';
import type { Car } from '@/entities';
import { randomCar } from './model/types';
import { createCar } from '@/entities/car/api/car.api';

export function generateCars(count = 100): Promise<Car[]> {
  const carsArray: Promise<Car>[] = [];

  for (let index = 0; index < count; index += 1) {
    const carIndex = getRandomInt(0, randomCar.length - 1);
    const color = getRandomColor();

    const randomCarRequest = createCar({
      name: randomCar[carIndex],
      color,
    }).then((response) => response.data);

    carsArray.push(randomCarRequest);
  }

  return Promise.all(carsArray)
    .then((responses) => {
      return responses;
    })
    .catch(() => {
      throw new Error('Generation of cars is failed!');
    });
}
