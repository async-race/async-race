import { describe, it, expect, vi } from 'vitest';
import { CarCreate } from './car-create';
import * as carApi from '@/entities/car/api/car.api';

describe('CarCreate', () => {
  it('should call createCar with correct arguments and return result', async () => {
    const mockCar = { id: 1, name: 'Tesla', color: '#ff0000' };
    const spy = vi
      .spyOn(carApi, 'createCar')
      .mockResolvedValue({ data: mockCar });

    const { handleCreate } = CarCreate();
    const result = await handleCreate('Tesla', '#ff0000');

    expect(spy).toHaveBeenCalledWith({ name: 'Tesla', color: '#ff0000' });
    expect(result).toEqual({ data: mockCar });
  });
});
