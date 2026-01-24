import { winnersStore, winnersQueryStore, WINNERS_ON_PAGE } from '@/entities';
import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { createPagination } from '@/widgets/pagination/ui/pagination';
import { winnerTable } from '@/widgets/winner-table/ui/winner-table';
import { initWinners } from '@/pages/model/init';
import { getWinnersWithCars } from '@/features/get-winners-with-cars/get-winners-with-cars';
import type { WinnersWithCars } from '@/pages/model/types';

export function createWinnersPage() {
  const winnerPage = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex flex-col',
  });

  const tableElement = BlockComponent({ tagName: 'div' });

  void initWinners();
  const pagination = initPagination();

  winnerPage.append(tableElement, pagination.element);

  function renderTable(winnersWithCars: WinnersWithCars[]): HTMLElement {
    const { sort, order, page } = winnersQueryStore.get();
    return winnerTable({
      winners: winnersWithCars,
      page: page,
      pageSize: WINNERS_ON_PAGE,
      sort: sort === 'id' ? '' : sort,
      order,
      onSortChange: (field, newOrder) => {
        winnersQueryStore.set({ sort: field, order: newOrder });
      },
    });
  }

  function initPagination() {
    const onPageChange = (page: number) => {
      winnersQueryStore.set({ page });
      paginationElement.update();
    };

    const paginationElement = createPagination({
      getPage: () => {
        const { page } = winnersQueryStore.get();
        return page;
      },
      getTotal: () => {
        const { total } = winnersStore.get();
        return total;
      },
      pageSize: WINNERS_ON_PAGE,
      onChange: onPageChange,
    });

    return paginationElement;
  }

  winnersStore.subscribe(() => {
    void (async () => {
      const winnersWithCars = await getWinnersWithCars(
        winnersStore.get().winners,
      );
      const newTable = renderTable(winnersWithCars);
      tableElement.innerHTML = '';
      tableElement.append(newTable);
    })();
  });

  return {
    element: winnerPage,
    show() {
      winnerPage.classList.remove('hidden');
    },
    hide() {
      winnerPage.classList.add('hidden');
    },
  };
}
