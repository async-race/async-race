import { describe, it, expect, vi, beforeEach } from 'vitest';
import { loadWinners } from './load';
import { winner, winnersQueryStore, winnersStore } from '@/entities';
import type { Winner, WinnersQuery } from '@/entities';

vi.mock('@/entities', () => ({
  winner: { getWinners: vi.fn() },
  winnersQueryStore: { get: vi.fn() },
  winnersStore: { set: vi.fn() },
}));

const get = () => vi.mocked(winnersQueryStore).get;
const getWinners = () => vi.mocked(winner).getWinners;
const set = () => vi.mocked(winnersStore).set;

describe('loadWinners', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls winner.getWinners with query from winnersQueryStore', async () => {
    const query: Required<WinnersQuery> = {
      page: 1,
      limit: 10,
      sort: 'wins',
      order: 'ASC',
    };
    get().mockReturnValue(query);
    getWinners().mockResolvedValue({ items: [], total: 0 });

    await loadWinners();

    expect(get()).toHaveBeenCalled();
    expect(getWinners()).toHaveBeenCalledWith(query);
  });

  it('sets items and total in winnersStore after fetching winners', async () => {
    const query: Required<WinnersQuery> = {
      page: 2,
      limit: 5,
      sort: 'time',
      order: 'DESC',
    };
    const items: Winner[] = [
      { id: 1, wins: 10, time: 123 },
      { id: 2, wins: 5, time: 456 },
    ];
    const total = items.length;

    get().mockReturnValue(query);
    getWinners().mockResolvedValue({ items, total });

    await loadWinners();

    expect(set()).toHaveBeenCalledWith(items, total);
  });

  it('propagates errors from winner.getWinners', async () => {
    const query: Required<WinnersQuery> = {
      page: 1,
      limit: 10,
      sort: 'wins',
      order: 'ASC',
    };
    get().mockReturnValue(query);
    getWinners().mockRejectedValue(new Error('Network error'));

    await expect(loadWinners()).rejects.toThrow('Network error');
  });

  it('handles empty result correctly', async () => {
    const query: Required<WinnersQuery> = {
      page: 3,
      limit: 10,
      sort: 'time',
      order: 'DESC',
    };
    get().mockReturnValue(query);
    getWinners().mockResolvedValue({ items: [], total: 0 });

    await loadWinners();

    expect(set()).toHaveBeenCalledWith([], 0);
  });
});
