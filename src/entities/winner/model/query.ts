import type { WinnersQuery } from './types';

const WINNERS_ON_PAGE = 7;

let query: WinnersQuery = {
  page: 1,
  limit: WINNERS_ON_PAGE,
  sort: 'wins',
  order: 'DESC',
};

const listeners = new Set<() => void>();

export const winnersQueryStore = {
  get() {
    return query;
  },

  set(patch: Partial<WinnersQuery>) {
    query = { ...query, ...patch };
    listeners.forEach((listener) => {
      listener();
    });
  },

  subscribe(callback: () => void) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
};
