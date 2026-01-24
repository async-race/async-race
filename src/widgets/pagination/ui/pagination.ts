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
    extraClasses:
      'absolute bottom-2 left-0 w-full flex gap-4 justify-center pt-4',
  });

  const className = 'min-w-10';

  const previousButton = Button({
    textContent: '«',
    onClick: () => {
      const page = getPage();
      if (page > 1) onChange(page - 1);
    },
    extraClasses: `${className} bg-sky-400 hover:bg-sky-700 text-white h-9 px-3`,
  });

  const nextButton = Button({
    textContent: '»',
    onClick: () => {
      const page = getPage();
      const totalPages = calculateTotalPages();
      if (page < totalPages) onChange(page + 1);
    },
    extraClasses: `${className} bg-sky-400 hover:bg-sky-700 text-white h-9 px-3`,
  });

  const currentPage = Button({
    textContent: '1',
    disabled: true,
    extraClasses: `${className} h-9 px-3`,
  });

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

  function disable() {
    previousButton.disabled = true;
    nextButton.disabled = true;
  }

  update();

  return {
    element: container,
    update,
    disable,
  };
}
