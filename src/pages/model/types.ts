import type { Car } from '@/entities/car/model/types';
import type { Winner } from '@/entities';

export type PageInstance = {
  element: HTMLElement;
  show: () => void;
  hide: () => void;
};

export type WinnersWithCars = Winner & Pick<Car, 'name' | 'color'>;
