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

  const indexPage = BlockComponent({
    tagName: 'h4',
    textContent: `Page # ${winnersQueryStore.get().page ?? 1}`,
  });

  let tableElement = BlockComponent({ tagName: 'div' });

  void initWinners();
  const pagination = initPagination();

  winnerPage.append(indexPage, tableElement, pagination.element);

  function renderTable(winnersWithCars: WinnersWithCars[]): HTMLElement {
    const { sort = 'wins', order = 'DESC', page = 1 } = winnersQueryStore.get();
    return winnerTable({
      winners: winnersWithCars,
      page: page,
      pageSize: WINNERS_ON_PAGE,
      sort,
      order,
      onSortChange: (field, newOrder) => {
        winnersQueryStore.set({ sort: field, order: newOrder });
      },
    });
  }

  function initPagination() {
    const onPageChange = (page: number) => {
      winnersQueryStore.set({ page });
      indexPage.textContent = `Page # ${page}`;
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

  winnersStore.subscribe(async () => {
    const winnersWithCars = await getWinnersWithCars(
      winnersStore.get().winners,
    );
    const newTable = renderTable(winnersWithCars);
    winnerPage.replaceChild(newTable, tableElement);
    tableElement = newTable;
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
