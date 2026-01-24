import { BlockComponent } from '@/shared';
import type { WinnerTableProps } from '@/widgets/winner-table/ui/winner-table';

type HeaderProps = {
  text: 'Wins' | 'Best time';
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
    extraClasses:
      'flex items-center justify-center gap-2 cursor-pointer select-none',
    onClick: () => {
      if (!isActive) {
        onSortChange(headerField, 'ASC');
        return;
      }
      const newOrder = order === 'ASC' ? 'DESC' : 'ASC';
      onSortChange(headerField, newOrder);
    },
  });

  const label = BlockComponent({ tagName: 'span', textContent: text });

  const arrowUp = BlockComponent({
    tagName: 'span',
    textContent: '▲',
    extraClasses: `text-xs transition-opacity ${isActive && order === 'ASC' ? 'opacity-100' : 'opacity-30'}`,
    onClick: (event: Event) => {
      event.stopPropagation();
      onSortChange(headerField, 'ASC');
    },
  });

  const arrowDown = BlockComponent({
    tagName: 'span',
    textContent: '▼',
    extraClasses: `text-xs transition-opacity ${isActive && order === 'DESC' ? 'opacity-100' : 'opacity-30'}`,
    onClick: (event: Event) => {
      event.stopPropagation();
      onSortChange(headerField, 'DESC');
    },
  });

  header.append(label, arrowUp, arrowDown);
  return header;
}
