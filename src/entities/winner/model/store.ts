import type { Winner } from './types';

let winners: Winner[] = [];
let total = 0;

const listeners = new Set<() => void>();

export const winnersStore = {
  get() {
    return { winners, total };
  },

  set(data: Winner[], totalCount: number) {
    winners = data;
    total = totalCount;
    listeners.forEach((listener) => {
      listener();
    });
  },

  subscribe(callback: () => void) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
};
