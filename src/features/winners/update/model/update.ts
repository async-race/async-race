import { winner } from '@/entities';
import type { Winner, WinnerId } from '@/entities';
import { loadWinners } from '../../load/model/load';

export async function updateWinners(id: WinnerId, time: number) {
  let newItem: Winner | null;
  try {
    const response = await winner.getWinner(id);
    newItem = response.data;
  } catch {
    newItem = null;
  }

  await (newItem
    ? winner.updateWinner(id, {
        wins: newItem.wins + 1,
        time: Math.min(time, newItem.time),
      })
    : winner.createWinner({ id, wins: 1, time }));
  await loadWinners();
}
