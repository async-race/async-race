import { carsQueryStore, carsStore, CARS_ON_PAGE } from '@/entities';
import { cars as carsAPI } from '@/features';
import { BlockComponent } from '@/shared';
import { carList, createPagination, carPanel, raceControls } from '@/widgets';
import { initCars } from '../model/init';
import { generateCars } from '@/features/generate-cars/generate-cars';

export function createGaragePage() {
  let selectedCarId: number | null = null;

  void initCars();
  const pagination = initPagination();
  const controls = initControls(() => selectedCarId);
  const controlsTotalBlock = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex flex-col items-center ml-[20px]',
  });

  const raceControlsButtons = raceControls({
    onGenerate: async () => {
      await generateCars();
      await initCars();
    },
    onReset: () => {
      console.log('Reset race');
    },
    onStartRace: () => {
      console.log('Start race');
    },
  });

  controlsTotalBlock.append(controls.element, raceControlsButtons);

  const pageContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex flex-col w-full max-w-5xl',
  });

  const tableContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex flex-col',
  });

  pageContainer.append(controlsTotalBlock, tableContainer, pagination.element);

  function render() {
    const { cars, total } = carsStore.get();
    const carListElement = carList(cars, total, {
      onEdit: (id, dto) => {
        selectedCarId = id;
        controls.setDisabled(false);
        controls.setEditValues(dto);
      },
      onDelete: (id) => {
        void carsAPI.deleteCar(id);
        if (selectedCarId === id) {
          controls.setDisabled(true);
          selectedCarId = null;
        }
      },
      onStart: (id) => {
        console.log('Start', id);
      },
      onStop: (id) => {
        console.log('Stop', id);
      },
    });
    tableContainer.replaceChildren(carListElement);
    pagination.update();
  }

  carsStore.subscribe(render);

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

const initPagination = () => {
  const onPageChange = (page: number) => {
    carsQueryStore.set({ page });
    paginationElement.update();
  };

  const paginationElement = createPagination({
    getPage: () => {
      const { page } = carsQueryStore.get();
      return page;
    },
    getTotal: () => {
      const { total } = carsStore.get();
      return total;
    },
    pageSize: CARS_ON_PAGE,
    onChange: onPageChange,
  });

  return paginationElement;
};

const initControls = (getSelectedId: () => number | null) => {
  const controlsContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex flex-col justify-center items-center',
  });

  const carAddControls = carPanel('create', (dto) => {
    void carsAPI.createCar(dto);
  });

  const carUpdateControls = carPanel('update', (dto) => {
    const id = getSelectedId();
    if (id !== null) {
      void carsAPI.updateCar(id, dto);
    }
    carUpdateControls.setDisabled(true);
  });

  carUpdateControls.setDisabled(true);
  controlsContainer.append(carAddControls.element, carUpdateControls.element);

  return {
    element: controlsContainer,
    setEditValues: carUpdateControls.setValues,
    setDisabled: carUpdateControls.setDisabled,
  };
};
