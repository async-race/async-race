import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteWinners } from './delete';
import { winner } from '@/entities';
import { loadWinners } from '../../load/model/load';
import type { WinnerId } from '@/entities';

vi.mock('@/entities', () => ({
  winner: {
    deleteWinner: vi.fn(),
  },
}));

vi.mock('../../load/model/load', () => ({
  loadWinners: vi.fn(),
}));

const deleteWinner = () => vi.mocked(winner).deleteWinner;
const load = () => vi.mocked(loadWinners);

describe('deleteWinners', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deletes winner and reloads winners list', async () => {
    const id: WinnerId = 1;
    deleteWinner().mockResolvedValue();

    await deleteWinners(id);

    expect(deleteWinner()).toHaveBeenCalledWith(id);
    expect(load()).toHaveBeenCalled();
  });

  it('does nothing if deleteWinner throws', async () => {
    const id: WinnerId = 2;
    deleteWinner().mockRejectedValue(new Error('Network error'));

    await deleteWinners(id);

    expect(deleteWinner()).toHaveBeenCalledWith(id);
    expect(load()).not.toHaveBeenCalled();
  });
});
