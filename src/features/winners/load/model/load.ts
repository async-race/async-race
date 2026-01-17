import { winner, winnersQueryStore, winnersStore } from '@/entities';

export async function loadWinners() {
  const query = winnersQueryStore.get();
  const { items, total } = await winner.getWinners(query);
  winnersStore.set(items, total);
}
