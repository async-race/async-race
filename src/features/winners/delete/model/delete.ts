import { winner } from '@/entities';
import type { WinnerId } from '@/entities';
import { loadWinners } from '../../load/model/load';

export async function deleteWinners(id: WinnerId) {
  try {
    await winner.deleteWinner(id);
    await loadWinners();
  } catch {
    return;
  }
}
