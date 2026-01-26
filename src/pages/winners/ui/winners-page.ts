import { winnersStore, winnersQueryStore, WINNERS_ON_PAGE } from '@/entities';
import { BlockComponent } from '@/shared';
import { createPagination, winnerTable } from '@/widgets';
import { initWinners } from '../model/init';
import { winners } from '@/features';
import type { WinnersWithCars } from '@/features';

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
    extraClasses: 'flex flex-col flex-1 w-full max-w-5xl pt-0',
  });

  const contentContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex-1 flex flex-col',
  });

  const tableElement = BlockComponent({ tagName: 'div' });

  void initWinners();
  const pagination = initPagination();

  contentContainer.append(tableElement);
  winnerPage.append(contentContainer, pagination.element);

  function initPagination() {
    const onPageChange = (page: number) => {
      winnersQueryStore.set({ page });
      void initWinners();
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
    pagination.update();
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
