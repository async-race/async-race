import { winnersStore, winnersQueryStore, WINNERS_ON_PAGE } from '@/entities';
import { BlockComponent } from '@/shared';
import { createPagination, winnerTable } from '@/widgets';
import { initWinners } from '../model/init';
import { winners } from '@/features';
import type { WinnersWithCars } from '@/features';

export function createWinnersPage() {
  const winnerPage = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex flex-col',
  });

  const indexPage = BlockComponent({
    tagName: 'h4',
    textContent: `Page # ${String(winnersQueryStore.get().page)}`,
  });

  const tableElement = BlockComponent({ tagName: 'div' });

  void initWinners();
  const pagination = initPagination();

  winnerPage.append(indexPage, tableElement, pagination.element);

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
      indexPage.textContent = `Page # ${String(page)}`;
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
      const winnersWithCars = await winners.getWinnersWithCars(
        winnersStore.get().items,
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
