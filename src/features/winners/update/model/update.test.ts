import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateWinners } from './update';
import { winner } from '@/entities';
import { loadWinners } from '../../load/model/load';
import type { Winner } from '@/entities';

vi.mock('@/entities', () => ({
  winner: {
    getWinner: vi.fn(),
    updateWinner: vi.fn(),
    createWinner: vi.fn(),
  },
}));

vi.mock('../../load/model/load', () => ({
  loadWinners: vi.fn(),
}));

const getWinner = () => vi.mocked(winner).getWinner;
const updateWinner = () => vi.mocked(winner).updateWinner;
const createWinner = () => vi.mocked(winner).createWinner;
const load = () => vi.mocked(loadWinners);

describe('updateWinners', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates existing winner with incremented wins and min time', async () => {
    const id = 1;
    const time = 50;
    const existing: Winner = { id, wins: 2, time: 100 };

    getWinner().mockResolvedValue({ data: existing });

    await updateWinners(id, time);

    expect(getWinner()).toHaveBeenCalledWith(id);
    expect(updateWinner()).toHaveBeenCalledWith(id, {
      wins: existing.wins + 1,
      time: Math.min(time, existing.time),
    });
    expect(load()).toHaveBeenCalled();
  });

  it('creates new winner if getWinner throws', async () => {
    const id = 2;
    const time = 200;

    getWinner().mockRejectedValue(new Error('Not found'));

    await updateWinners(id, time);

    expect(getWinner()).toHaveBeenCalledWith(id);
    expect(createWinner()).toHaveBeenCalledWith({ id, wins: 1, time });
    expect(load()).toHaveBeenCalled();
  });

  it('handles case where new time is greater than existing time', async () => {
    const id = 3;
    const time = 500;
    const existing: Winner = { id, wins: 5, time: 400 };

    getWinner().mockResolvedValue({ data: existing });

    await updateWinners(id, time);

    expect(updateWinner()).toHaveBeenCalledWith(id, {
      wins: existing.wins + 1,
      time: Math.min(time, existing.time),
    });
    expect(load()).toHaveBeenCalled();
  });
});
