import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  getWinners,
  getWinner,
  createWinner,
  updateWinner,
  deleteWinner,
} from './winner.api';
import type { Winner } from '../model/types';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('winner.api', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('getWinners should returns list and total', async () => {
    const winners: Winner[] = [{ id: 1, wins: 2, time: 3.5 }];

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(winners, {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'X-Total-Count': '1',
        },
      }),
    );

    const result = await getWinners({ page: 1, limit: 10 });

    expect(result.items).toEqual(winners);
    expect(result.total).toBe(1);
  });

  it('should adds sort and order query parameters to getWinners request', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json([], { status: 200 }));

    await getWinners({ sort: 'wins', order: 'DESC' });

    const calls = fetchMock.mock.calls;
    const [url] = calls[0];

    expect(url).toContain('_sort=wins');
    expect(url).toContain('_order=DESC');
  });

  it('should not adds sort and order query parameters to getWinners request', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(Response.json([], { status: 200 }));

    await getWinners();

    const calls = fetchMock.mock.calls;
    const [url] = calls[0];

    expect(url).not.toContain('_sort');
    expect(url).not.toContain('_order');
  });

  it('getWinner should returns zero total if X-Total-Count not returned', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json([], {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    );

    const result = await getWinners();
    expect(result.total).toBe(0);
  });

  it('getWinner should returns single winner', async () => {
    const winner: Winner = {
      id: 2,
      wins: 1,
      time: 2.9,
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(winner, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await getWinner(2);

    expect(result.data).toEqual(winner);
  });

  it('createWinner should sends POST', async () => {
    const winner: Winner = {
      id: 3,
      wins: 1,
      time: 4,
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(winner, {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await createWinner(winner);

    expect(result.data).toEqual(winner);
  });

  it('updateWinner should updates wins and time', async () => {
    const updated: Winner = {
      id: 4,
      wins: 2,
      time: 3,
    };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      Response.json(updated, {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await updateWinner(4, {
      wins: 2,
      time: 3,
    });

    expect(result.data).toEqual(updated);
  });

  it('deleteWinner should resolves without data', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 200 }),
    );

    await expect(deleteWinner(1)).resolves.toBeUndefined();
  });
});
