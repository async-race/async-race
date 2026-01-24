import { describe, it, expect, vi, type Mock } from 'vitest';
import { generateCars } from './generate-cars';
import { createCar } from '@/entities/car/api/car.api';
import type { Car } from '@/entities';

vi.mock('@/entities/car/api/car.api', () => ({
  createCar: vi.fn(),
}));

describe('generateCars', () => {
  it('should generate the specified number of cars', async () => {
    const mockCar: Car = { id: 1, name: 'TestCar', color: '#FFFFFF' };
    const mockedCreateCar = createCar as Mock;

    mockedCreateCar.mockResolvedValue({ data: mockCar });

    const generatedCars: Car[] = await generateCars(5);

    expect(generatedCars).toHaveLength(5);
    generatedCars.forEach((car) => {
      expect(car).toEqual(mockCar);
    });
  });

  it('should throw an error if createCar fails', async () => {
    const mockedCreateCar = createCar as Mock;

    mockedCreateCar.mockRejectedValue(new Error('API error'));

    await expect(generateCars(1)).rejects.toThrow(
      'Generation of cars is failed!',
    );
  });
});
