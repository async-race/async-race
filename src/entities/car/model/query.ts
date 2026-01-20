import type { CarsQuery } from './types';

export const CARS_ON_PAGE = 7;

let query: Required<CarsQuery> = {
  page: 1,
  limit: CARS_ON_PAGE,
};

const listeners = new Set<() => void>();

export const carsQueryStore = {
  get() {
    return query;
  },

  set(patch: Partial<CarsQuery>) {
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
