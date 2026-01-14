import { describe, it, expect, vi } from 'vitest';
import { CarCreate } from './car-create';
import * as carApi from '@/entities/car/api/car.api';

describe('CarCreate', () => {
  it('should call createCar with correct arguments and return result', async () => {
    const mockCar = { id: 1, name: 'Tesla', color: 'red' };
    const spy = vi
      .spyOn(carApi, 'createCar')
      .mockResolvedValue({ data: mockCar });

    const { handleCreate } = CarCreate();
    const result = await handleCreate('Tesla', 'red');

    expect(spy).toHaveBeenCalledWith({ name: 'Tesla', color: 'red' });
    expect(result).toEqual({ data: mockCar });
  });
});
