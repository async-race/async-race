import { carsQueryStore, carsStore, CARS_ON_PAGE } from '@/entities';
import { createPagination } from '@/widgets';

export function initGaragePagination() {
  const onPageChange = (page: number) => {
    carsQueryStore.set({ page });
    paginationElement.update();
  };

  const paginationElement = createPagination({
    getPage: () => carsQueryStore.get().page,
    getTotal: () => carsStore.get().total,
    pageSize: CARS_ON_PAGE,
    onChange: onPageChange,
  });

  return paginationElement;
}
