import type { WinnersWithCars } from '@/pages/model/types';
import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { carSvg } from '@/shared/ui/car-template/car.template';
import { winnerTableHeader } from '@/widgets/winner-table-header/ui/winner-table-header';

export type WinnerTableProps = {
  winners: WinnersWithCars[];
  page: number;
  pageSize: number;
  sort: '' | 'wins' | 'time';
  order: 'ASC' | 'DESC';
  onSortChange: (field: 'wins' | 'time', order: 'ASC' | 'DESC') => void;
};

export function winnerTable({
  winners,
  page,
  pageSize,
  sort,
  order,
  onSortChange,
}: WinnerTableProps) {
  const container = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex flex-col',
  });

  const headerRow = BlockComponent({
    tagName: 'div',
    extraClasses: 'grid grid-cols-5 font-bold bg-gray-200 py-1 px-2',
  });

  const winsHeader = winnerTableHeader({
    text: 'Wins',
    headerField: 'wins',
    sort,
    order,
    onSortChange,
  });

  const timeHeader = winnerTableHeader({
    text: 'Best time (s)',
    headerField: 'time',
    sort,
    order,
    onSortChange,
  });

  headerRow.append(
    BlockComponent({ tagName: 'div', textContent: 'Number' }),
    BlockComponent({ tagName: 'div', textContent: 'Car' }),
    BlockComponent({ tagName: 'div', textContent: 'Name' }),
    winsHeader,
    timeHeader,
  );
  container.append(headerRow);

  const start = (page - 1) * pageSize;
  winners.forEach((winner, index) => {
    const row = BlockComponent({
      tagName: 'div',
      extraClasses: 'grid grid-cols-5',
    });

    row.append(
      BlockComponent({
        tagName: 'div',
        textContent: String(start + index + 1),
      }),
      carSvg({ color: winner.color, size: 35 }),
      BlockComponent({ tagName: 'div', textContent: winner.name }),
      BlockComponent({ tagName: 'div', textContent: String(winner.wins) }),
      BlockComponent({ tagName: 'div', textContent: String(winner.time) }),
    );

    container.append(row);
  });

  return container;
}
