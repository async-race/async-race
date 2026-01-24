import type { CarsQuery } from './types';
import { createQueryStore } from '@/shared/store/create-query-store';

export const CARS_ON_PAGE = 7;

export const carsQueryStore = createQueryStore<CarsQuery>({
  page: 1,
  limit: CARS_ON_PAGE,
});
