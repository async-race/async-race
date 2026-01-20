//import { getCars } from '@/entities/car/api/car.api';
import type { Winner } from '@/entities/winner/model/types';
import type { Car } from '@/entities/car/model/types';
import { getCars } from '@/entities/car/api/car.api';

export type WinnersWithCars = Winner & Pick<Car, 'name' | 'color'>;

export async function getWinnersWithCars(
  winners: Winner[],
): Promise<WinnersWithCars[]> {
  const { items: cars } = await getCars();

  const winnersAndCars = winners.map((winner: Winner) => {
    const car = cars.find((item: Car) => item.id === winner.id);
    return {
      ...winner,
      name: car?.name ?? '',
      color: car?.color ?? '',
    };
  });
  return winnersAndCars;
}
