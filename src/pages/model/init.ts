import { winnersQueryStore } from '@/entities';
import { winners } from '@/features';

export async function initWinners() {
  await winners.loadWinners();

  return winnersQueryStore.subscribe(() => {
    void winners.loadWinners();
  });
}
