import type { Car } from './types';
import { createListStore } from '@/shared/store/create-list-store';

export const carsStore = createListStore<Car>();
