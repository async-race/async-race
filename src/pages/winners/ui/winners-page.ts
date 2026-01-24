import { winnersStore, winnersQueryStore, WINNERS_ON_PAGE } from '@/entities';
import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { createPagination } from '@/widgets/pagination/ui/pagination';
import { winnerTable } from '@/widgets/winner-table/ui/winner-table';
import { initWinners } from '@/pages/model/init';
import { getWinnersWithCars } from '@/features/get-winners-with-cars/get-winners-with-cars';
import type { WinnersWithCars } from '@/pages/model/types';

function renderTable(
  winnersWithCars: WinnersWithCars[],
  sort: '' | 'wins' | 'time',
  order: 'ASC' | 'DESC',
  page: number,
  onSortChange: (field: 'wins' | 'time', order: 'ASC' | 'DESC') => void,
): HTMLElement {
  return winnerTable({
    winners: winnersWithCars,
    page,
    pageSize: WINNERS_ON_PAGE,
    sort,
    order,
    onSortChange,
  });
}

export function createWinnersPage() {
  const winnerPage = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex flex-col',
  });

  const tableElement = BlockComponent({ tagName: 'div' });

  void initWinners();
  const pagination = initPagination();

  winnerPage.append(tableElement, pagination.element);

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
      const { sort, order, page } = winnersQueryStore.get();

      const newTable = renderTable(
        winnersWithCars,
        sort === 'id' ? '' : sort,
        order,
        page,
        (field, newOrder) => {
          winnersQueryStore.set({ sort: field, order: newOrder });
        },
      );

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
