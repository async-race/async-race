import { describe, it, expect, vi, beforeEach } from 'vitest';
import { car } from '@/entities';
import { createCar } from './create';
import * as loadModule from '../../load/model/load';

describe('CarCreate', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should call car.createCar with correct args and then loadCars', async () => {
    const createSpy = vi.spyOn(car, 'createCar').mockResolvedValue({
      data: {
        id: 1,
        name: 'test',
        color: '#010101',
      },
    });

    const loadSpy = vi.spyOn(loadModule, 'loadCars').mockResolvedValue();

    await createCar({ name: 'Tesla', color: '#ff0000' });

    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy).toHaveBeenCalledWith({
      name: 'Tesla',
      color: '#ff0000',
    });

    expect(loadSpy).toHaveBeenCalledTimes(1);
  });
});
