import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteCar } from './delete';
import { car } from '@/entities';
import { loadCars } from '../../load/model/load';
import { deleteWinners } from '@/features/winners/delete/model/delete';

vi.mock('@/entities', () => ({
  car: {
    deleteCar: vi.fn(),
  },
}));

vi.mock('../../load/model/load', () => ({
  loadCars: vi.fn(),
}));

vi.mock('@/features/winners/delete/model/delete', () => ({
  deleteWinners: vi.fn(),
}));

const deleteCarEntity = () => vi.mocked(car).deleteCar;
const deleteWinnerEntity = () => vi.mocked(deleteWinners);
const load = () => vi.mocked(loadCars);

describe('deleteCar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes car, deletes winner, and reloads cars list', async () => {
    const id = 1;
    deleteCarEntity().mockResolvedValue();
    deleteWinnerEntity().mockResolvedValue();
    load().mockResolvedValue();

    await deleteCar(id);

    expect(deleteCarEntity()).toHaveBeenCalledWith(id);
    expect(deleteWinnerEntity()).toHaveBeenCalledWith(id);
    expect(load()).toHaveBeenCalled();
  });

  it('still calls deleteWinners and loadCars if deleteCar succeeds', async () => {
    const id = 2;
    deleteCarEntity().mockResolvedValue();

    await deleteCar(id);

    expect(deleteCarEntity()).toHaveBeenCalledWith(id);
    expect(deleteWinnerEntity()).toHaveBeenCalledWith(id);
    expect(load()).toHaveBeenCalled();
  });

  it('throws if deleteCar fails', async () => {
    const id = 3;
    deleteCarEntity().mockRejectedValue(new Error('Network error'));

    await expect(deleteCar(id)).rejects.toThrow('Network error');

    expect(deleteCarEntity()).toHaveBeenCalledWith(id);
    expect(deleteWinnerEntity()).not.toHaveBeenCalled();
    expect(load()).not.toHaveBeenCalled();
  });
});
