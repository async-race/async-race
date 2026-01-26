import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadCars } from './load';
import { car, carsQueryStore, carsStore } from '@/entities';
import type { Car } from '@/entities';

vi.mock('@/entities', () => ({
  car: {
    getCars: vi.fn(),
  },
  carsQueryStore: {
    get: vi.fn(),
  },
  carsStore: {
    set: vi.fn(),
  },
}));
// eslint-disable-next-line @typescript-eslint/unbound-method
const get = () => vi.mocked(carsQueryStore).get;
const getCars = () => vi.mocked(car).getCars;
// eslint-disable-next-line @typescript-eslint/unbound-method
const set = () => vi.mocked(carsStore).set;

describe('loadCars', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls car.getCars with query from carsQueryStore', async () => {
    const query = { page: 1, limit: 10 };
    get().mockReturnValue(query);
    getCars().mockResolvedValue({ items: [], total: 0 });

    await loadCars();

    expect(get()).toHaveBeenCalled();
    expect(getCars()).toHaveBeenCalledWith(query);
  });

  it('sets items and total in carsStore after fetching cars', async () => {
    const query = { page: 2, limit: 5 };
    const items: Car[] = [
      { id: 1, name: 'BMW', color: '#000000' },
      { id: 2, name: 'Audi', color: '#ffffff' },
    ];
    const total = items.length;

    get().mockReturnValue(query);
    getCars().mockResolvedValue({ items, total });

    await loadCars();

    expect(set()).toHaveBeenCalledWith(items, total);
  });

  it('propagates errors from car.getCars', async () => {
    const query = { page: 1, limit: 10 };
    get().mockReturnValue(query);
    getCars().mockRejectedValue(new Error('Network error'));

    await expect(loadCars()).rejects.toThrow('Network error');
  });

  it('handles empty result correctly', async () => {
    const query = { page: 3, limit: 10 };
    get().mockReturnValue(query);
    getCars().mockResolvedValue({ items: [], total: 0 });

    await loadCars();

    expect(set()).toHaveBeenCalledWith([], 0);
  });
});
