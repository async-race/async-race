import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { getCars, getCar, createCar, updateCar, deleteCar } from './car.api';
import type { Car } from '../model/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('car.api', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getCars should returns items and total count', async () => {
    const cars: Car[] = [{ id: 1, name: 'Tesla', color: '#fff' }];

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(cars, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Total-Count': '1',
        },
      }),
    );

    const result = await getCars({ page: 1, limit: 7 });

    expect(result.items).toEqual(cars);
    expect(result.total).toBe(1);
  });

  it('should not adds page and limit query parameters to getCars request', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json([], { status: 200 }));

    await getCars();

    const calls = fetchMock.mock.calls;
    const [url] = calls[0];

    expect(url).not.toContain('_page');
    expect(url).not.toContain('_limit');
  });

  it('getCars should returns zero total if X-Total-Count not returned', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json([], {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    const result = await getCars();
    expect(result.total).toBe(0);
  });

  it('getCar should returns single car', async () => {
    const car: Car = { id: 1, name: 'BMW', color: '#000' };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(car, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await getCar(1);

    expect(result.data).toEqual(car);
  });

  it('createCar should sends POST request', async () => {
    const car: Car = { id: 2, name: 'Audi', color: '#111' };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(car, {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await createCar({
      name: 'Audi',
      color: '#111',
    });

    expect(result.data).toEqual(car);
  });

  it('deleteCar should resolves without data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, {
        status: 200,
      }),
    );

    await expect(deleteCar(1)).resolves.toBeUndefined();
  });

  it('updateCar should sends PUT request', async () => {
    const updated: Car = {
      id: 3,
      name: 'Ford',
      color: '#222',
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(updated, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await updateCar(3, {
      name: 'Ford',
      color: '#222',
    });

    expect(result.data).toEqual(updated);
  });
});
