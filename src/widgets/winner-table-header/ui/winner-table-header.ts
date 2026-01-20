import { BlockComponent } from '@/shared';
import type { WinnerTableProps } from '@/widgets/winner-table/ui/winner-table';

type HeaderProps = {
  text: 'Wins' | 'Best time (s)';
  headerField: 'wins' | 'time';
};

type WinnerTableHeaderProps = HeaderProps &
  Pick<WinnerTableProps, 'sort' | 'order' | 'onSortChange'>;

export function winnerTableHeader({
  text,
  headerField,
  order,
  sort,
  onSortChange,
}: WinnerTableHeaderProps): HTMLElement {
  const isActive = sort === headerField;

  const header = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex items-center gap-3 cursor-pointer select-none',
    onClick: () => {
      const newOrder = isActive && order === 'ASC' ? 'DESC' : 'ASC';
      onSortChange(headerField, newOrder);
    },
  });

  const label = BlockComponent({
    tagName: 'span',
    textContent: text,
  });

  const arrowUp = BlockComponent({
    tagName: 'span',
    textContent: '▲',
    extraClasses: `text-xs transition-opacity ${
      isActive && order === 'ASC' ? 'opacity-100' : 'opacity-30'
    }`,
  });

  const arrowDown = BlockComponent({
    tagName: 'span',
    textContent: '▼',
    extraClasses: `text-xs transition-opacity ${
      isActive && order === 'DESC' ? 'opacity-100' : 'opacity-30'
    }`,
  });

  header.append(label, arrowUp, arrowDown);
  return header;
}
