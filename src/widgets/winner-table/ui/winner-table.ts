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
    extraClasses:
      'grid grid-cols-[1fr_1fr_1fr_1fr_1fr] font-bold bg-gray-200 p-0',
  });

  const winsHeader = winnerTableHeader({
    text: 'Wins',
    headerField: 'wins',
    sort,
    order,
    onSortChange,
  });

  const timeHeader = winnerTableHeader({
    text: 'Best time',
    headerField: 'time',
    sort,
    order,
    onSortChange,
  });

  headerRow.append(
    BlockComponent({
      tagName: 'div',
      extraClasses: 'grid place-items-center',
      textContent: 'Number',
    }),
    BlockComponent({
      tagName: 'div',
      extraClasses: 'grid place-items-center',
      textContent: 'Car',
    }),
    BlockComponent({
      tagName: 'div',
      extraClasses: 'grid place-items-center',
      textContent: 'Name',
    }),
    BlockComponent({
      tagName: 'div',
      extraClasses: 'grid place-items-center',
      children: [winsHeader],
    }),
    BlockComponent({
      tagName: 'div',
      extraClasses: 'grid place-items-center',
      children: [timeHeader],
    }),
  );
  container.append(headerRow);

  const start = (page - 1) * pageSize;
  winners.forEach((winner, index) => {
    const row = BlockComponent({
      tagName: 'div',
      extraClasses: 'grid grid-cols-[1fr_1fr_1fr_1fr_1fr] px-2',
    });

    row.append(
      BlockComponent({
        tagName: 'div',
        extraClasses: 'grid place-items-center',
        textContent: String(start + index + 1),
      }),
      BlockComponent({
        tagName: 'div',
        extraClasses: 'grid place-items-center',
        children: [
          (() => {
            const svg = carSvg({ color: winner.color, size: 35 });
            svg.classList.add('block');
            return svg;
          })(),
        ],
      }),
      BlockComponent({
        tagName: 'div',
        extraClasses:
          'grid place-items-center truncate overflow-hidden min-w-[50px]',
        textContent: winner.name,
      }),
      BlockComponent({
        tagName: 'div',
        extraClasses: 'grid place-items-center',
        textContent: String(winner.wins),
      }),
      BlockComponent({
        tagName: 'div',
        extraClasses: 'grid place-items-center',
        textContent: winner.time.toFixed(2),
      }),
    );

    container.append(row);
  });

  return container;
}
