import type { WinnersQuery } from './types';
import { createQueryStore } from '@/shared/store/create-query-store';

export const WINNERS_ON_PAGE = 10;

export const winnersQueryStore = createQueryStore<WinnersQuery>({
  page: 1,
  limit: WINNERS_ON_PAGE,
  sort: '',
  order: 'DESC',
});
