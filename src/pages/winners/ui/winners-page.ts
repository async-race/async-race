import { winnersStore, winnersQueryStore, WINNERS_ON_PAGE } from '@/entities';
import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { createPagination } from '@/widgets/pagination/ui/pagination';
import { winnerTable } from '@/widgets/winner-table/winner-table';
import { initWinners } from '@/pages/model/init';
import { getWinnersWithCars } from '@/features/get-winners-with-cars/get-winners-with-cars';
import type { WinnersWithCars } from '@/pages/model/types';

export function createWinnersPage() {
  const winnerPage = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex flex-col',
  });

  let currentPage = 1;

  const indexPage = BlockComponent({
    tagName: 'h4',
    textContent: `Page # ${currentPage}`,
  });

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

  let tableElement = BlockComponent({ tagName: 'div' });

  const onPageChange = async (pageNum: number) => {
    currentPage = pageNum;
    winnersQueryStore.set({ page: pageNum });
    pagination.update();
    indexPage.textContent = `Page # ${currentPage}`;
    const winnersWithCars = await getWinnersWithCars(
      winnersStore.get().winners,
    );
    const newTable = renderTable(winnersWithCars);
    winnerPage.replaceChild(newTable, tableElement);
    tableElement = newTable;
  };

  const pagination = createPagination({
    getPage: () => currentPage,
    pageSize: WINNERS_ON_PAGE,
    onChange: onPageChange,
    getTotal: () => winnersStore.get().total,
  });

  void initWinners();

  winnersStore.subscribe(async () => {
    const winnersWithCars = await getWinnersWithCars(
      winnersStore.get().winners,
    );
    const newTable = renderTable(winnersWithCars);
    winnerPage.replaceChild(newTable, tableElement);
    tableElement = newTable;
  });

  winnerPage.append(indexPage, tableElement, pagination.element);

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
