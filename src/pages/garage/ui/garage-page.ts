import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { createPagination } from '@/widgets/pagination/ui/pagination';

const CARS_ON_PAGE = 7;

export function createGaragePage() {
  const page = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex flex-col',
    textContent: 'Garage',
  });

  let currentPage = 1;

  const onPageChange = (page: number) => {
    currentPage = page;
    pagination.update();
  };

  const pagination = createPagination({
    getPage: () => currentPage,
    total: 100,
    pageSize: CARS_ON_PAGE,
    onChange: onPageChange,
  });

  page.append(pagination.element);

  return {
    element: page,
    show() {
      page.classList.remove('hidden');
    },
    hide() {
      page.classList.add('hidden');
    },
  };
}
