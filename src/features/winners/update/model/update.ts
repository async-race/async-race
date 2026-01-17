import { winner } from '@/entities';
import type { UpdateWinnerDto, Winner, WinnerId } from '@/entities';
import { loadWinners } from '../../load/model/load';

export async function updateWinners(id: WinnerId, dto: UpdateWinnerDto) {
  let newItem: Winner | null;
  try {
    const response = await winner.getWinner(id);
    newItem = response.data;
  } catch {
    newItem = null;
  }

  await (newItem
    ? winner.updateWinner(id, dto)
    : winner.createWinner({ id, ...dto }));
  await loadWinners();
}
