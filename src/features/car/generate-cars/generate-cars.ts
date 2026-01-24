import { getRandomColor } from './lib/random-color/random-color';
import { getRandomInt } from './lib/random-number/random-number';
import type { Car } from '@/entities';
import { randomCar } from './model/types';
import { createCar } from '@/entities/car/api/car.api';

export function generateCars(count = 100) {
  const carsRandomCollection: Pick<Car, 'name' | 'color'>[] = [];

  for (let index = 0; index < count; index += 1) {
    const carIndex = getRandomInt(0, randomCar.length - 1);
    const color = getRandomColor();
    carsRandomCollection.push({ name: randomCar[carIndex], color: color });
  }

  const randomCarsRequest = carsRandomCollection.map((carProperty) =>
    createCar(carProperty),
  );
  return Promise.all(randomCarsRequest)
    .then((responses) => {
      const cars = responses.map((data) => data.data);
      return cars;
    })
    .catch(() => {
      throw new Error('Generation of cars is failed!');
    });
}
