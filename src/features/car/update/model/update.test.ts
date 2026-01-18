import { describe, it, expect, vi, beforeEach } from 'vitest';
import { car } from '@/entities';
import { updateCar } from './update';
import * as loadModule from '../../load/model/load';

describe('CarCreate', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call car.createCar with correct args and then loadCars', async () => {
    const updateSpy = vi.spyOn(car, 'updateCar').mockResolvedValue({
      data: {
        id: 1,
        name: 'test',
        color: '#010101',
      },
    });

    const loadSpy = vi.spyOn(loadModule, 'loadCars').mockResolvedValue();

    await updateCar(1, { name: 'Tesla', color: '#ff0000' });

    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(updateSpy).toHaveBeenCalledWith(1, {
      name: 'Tesla',
      color: '#ff0000',
    });

    expect(loadSpy).toHaveBeenCalledTimes(1);
  });
});
