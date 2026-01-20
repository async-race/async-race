import type { Car } from './types';

let cars: Car[] = [];
let total = 0;

const listeners = new Set<() => void>();

export const carsStore = {
  get() {
    return { cars, total };
  },

  set(data: Car[], totalCount: number) {
    cars = data;
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
