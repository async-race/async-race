import { describe, it, expect, vi } from 'vitest';
import type { Winner } from '@/entities/winner/model/types';
import type { Car } from '@/entities/car/model/types';
import { getWinnersWithCars } from './get-winners-with-cars';
import * as carApi from '@/entities/car/api/car.api';

describe('getWinnersWithCars', () => {
  it('returns an array of WinnersWithCars with correct name and color', () => {
    const winners: Winner[] = [
      { id: 1, wins: 3, time: 120 },
      { id: 2, wins: 5, time: 110 },
    ];

    const mockCars: { data: Car }[] = [
      { data: { id: 1, name: 'BMW', color: 'black' } },
      { data: { id: 2, name: 'Audi', color: 'red' } },
    ];

    vi.spyOn(carApi, 'getCar').mockImplementation((id: number) => {
      const car = mockCars.find((c) => c.data.id === id);
      return Promise.resolve(car ?? { data: { id, name: '', color: '' } });
    });

    return expect(getWinnersWithCars(winners)).resolves.toEqual([
      { id: 1, wins: 3, time: 120, name: 'BMW', color: 'black' },
      { id: 2, wins: 5, time: 110, name: 'Audi', color: 'red' },
    ]);
  });

  it('sets empty strings if the car is not found', async () => {
    const winners: Winner[] = [{ id: 3, wins: 1, time: 150 }];
    const mockCar: { data: Car } = { data: { id: 99, name: '', color: '' } };

    vi.spyOn(carApi, 'getCar').mockResolvedValue(mockCar);

    const result = await getWinnersWithCars(winners);

    expect(result).toEqual([
      { id: 3, wins: 1, time: 150, name: '', color: '' },
    ]);
  });

  it('throws an error if fetching cars fails', async () => {
    const winners: Winner[] = [{ id: 1, wins: 2, time: 100 }];

    vi.spyOn(carApi, 'getCar').mockRejectedValue(new Error('Network error'));

    await expect(getWinnersWithCars(winners)).rejects.toThrow(
      "Winners aren't fetched!",
    );
  });
});
