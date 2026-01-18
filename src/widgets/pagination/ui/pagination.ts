import type { PaginationProps } from '../model/types';
import { Button } from '@/shared/ui/button/button';
import { BlockComponent } from '@/shared/ui/block-component/block-component';

export function createPagination({
  getPage,
  getTotal,
  pageSize,
  onChange,
}: PaginationProps) {
  function calculateTotalPages(): number {
    const total = getTotal();
    return Math.max(1, Math.ceil(total / pageSize));
  }

  const container = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex gap-4',
  });

  const previousButton = Button({
    textContent: '«',
    onClick: () => {
      const page = getPage();
      if (page > 1) onChange(page - 1);
    },
  });

  const nextButton = Button({
    textContent: '»',
    onClick: () => {
      const page = getPage();
      const totalPages = calculateTotalPages();
      if (page < totalPages) onChange(page + 1);
    },
  });

  const currentPage = Button({ textContent: '1' });

  container.append(previousButton, currentPage, nextButton);

  function update() {
    const page = getPage();
    const totalPages = calculateTotalPages();
    const isPreviousDisabled = page <= 1;
    const isNextDisabled = page >= totalPages;
    previousButton.disabled = isPreviousDisabled;
    nextButton.disabled = isNextDisabled;
    currentPage.textContent = page.toString();
  }

  update();

  return {
    element: container,
    update,
  };
}
