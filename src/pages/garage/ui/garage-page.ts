import { carsStore } from '@/entities';
import { BlockComponent } from '@/shared';
import { initCars } from '../model/init';
import { initGaragePagination } from '../model/pagination';
import { initGarageControls } from '../model/controls';
import { initGarageRaceControls } from '../model/race-controls';
import { renderGarageCarList } from '../model/render';
import type { CarItem } from '../model/types';

export function createGaragePage() {
  let selectedCarId: number | null = null;
  let carItems: Map<string, CarItem> = new Map();

  void initCars();

  const pagination = initGaragePagination();
  const controls = initGarageControls(() => selectedCarId);

  const controlsContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex flex-col items-center ml-[20px] pt-0 pb-0',
  });

  const raceControls = initGarageRaceControls(() => carItems);

  controlsContainer.append(controls.element, raceControls.element);

  const pageContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'relative flex flex-col w-full max-w-5xl pt-0',
  });

  const tableContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex flex-col',
  });

  pageContainer.append(controlsContainer, tableContainer, pagination.element);

  carsStore.subscribe(() => {
    renderGarageCarList({
      raceControls: raceControls.buttons,
      tableContainer,
      pagination,
      controls,
      carItemsRef: {
        get: () => carItems,
        set: (items) => {
          carItems = items;
        },
      },
      setSelectedCarId: (id) => {
        selectedCarId = id;
      },
      getSelectedCarId: () => selectedCarId,
    });
  });

  return {
    element: pageContainer,
    show() {
      pageContainer.classList.remove('hidden');
    },
    hide() {
      pageContainer.classList.add('hidden');
    },
  };
}
