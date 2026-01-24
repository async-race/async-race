import type { Winner, Car } from '@/entities';
import { car } from '@/entities';

export type WinnersWithCars = Winner & Pick<Car, 'name' | 'color'>;

export function getWinnersWithCars(
  winners: Winner[],
): Promise<WinnersWithCars[]> {
  const winnersIds = winners.map((winner) => winner.id);
  const cars = winnersIds.map((id) => car.getCar(id));
  return Promise.all(cars)
    .then((responses) => {
      return winners.map((winner: Winner) => {
        const car = responses.find((value) => value.data.id === winner.id);
        return {
          ...winner,
          name: car?.data.name ?? '',
          color: car?.data.color ?? '',
        };
      });
    })
    .catch(() => {
      throw new Error("Winners aren't fetched!");
    });
}
