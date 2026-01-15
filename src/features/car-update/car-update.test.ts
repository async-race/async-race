import { describe, it, expect, vi } from 'vitest';
import { CarUpdate } from './car-update';
import { CarCreate } from '../car-create/car-create';
import * as carApi from '@/entities/car/api/car.api';

describe('CarUpdate', () => {
  it('should update a car with given arguments and reutn result', async () => {
    const mockCar = { id: 1, name: 'Tesla', color: '#ff0000' };
    const mockCar2 = { id: 1, name: 'lada', color: '#000000' };
    const spy = vi
      .spyOn(carApi, 'createCar')
      .mockResolvedValue({ data: mockCar });

    const { handleCreate } = CarCreate();
    const result = await handleCreate('Tesla', '#ff0000');

    expect(spy).toHaveBeenCalledWith({ name: 'Tesla', color: '#ff0000' });
    expect(result).toEqual({ data: mockCar });

    const spy2 = vi
      .spyOn(carApi, 'updateCar')
      .mockResolvedValue({ data: mockCar2 });

    const { handleUpdate } = CarUpdate();
    const result2 = await handleUpdate(1, 'lada', '#000000');

    expect(spy2).toHaveBeenCalledWith(1, { name: 'lada', color: '#000000' });
    expect(result2).toEqual({ data: mockCar2 });
  });
});
