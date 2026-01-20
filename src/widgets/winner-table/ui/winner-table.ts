import type { WinnersWithCars } from '@/pages/model/types';
import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { carSvg } from '@/shared/ui/car-template/car.template';

type WinnerTableProps = {
  winners: WinnersWithCars[];
  page: number;
  pageSize: number;
  sort: string;
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
    extraClasses: 'flex flex-col min-h-[400px]',
  });

  const headerRow = BlockComponent({
    tagName: 'div',
    extraClasses: 'grid grid-cols-5 font-bold bg-gray-200 py-1 px-2',
  });

  const winsHeader = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex items-center gap-1 cursor-pointer',
    textContent:
      'Wins' + (sort === 'wins' ? (order === 'ASC' ? ' ▲' : ' ▼') : ''),
    onClick: () => {
      const newOrder = sort === 'wins' && order === 'ASC' ? 'DESC' : 'ASC';
      onSortChange('wins', newOrder);
    },
  });

  const timeHeader = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex items-center gap-1 cursor-pointer',
    textContent:
      'Best time (s)' +
      (sort === 'time' ? (order === 'ASC' ? ' ▲' : ' ▼') : ''),
    onClick: () => {
      const newOrder = sort === 'time' && order === 'ASC' ? 'DESC' : 'ASC';
      onSortChange('time', newOrder);
    },
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
      BlockComponent({ tagName: 'div', textContent: `${start + index + 1}` }),
      carSvg({ color: winner.color }),
      BlockComponent({ tagName: 'div', textContent: winner.name }),
      BlockComponent({ tagName: 'div', textContent: `${winner.wins}` }),
      BlockComponent({ tagName: 'div', textContent: `${winner.time}` }),
    );

    container.append(row);
  });

  return container;
}
