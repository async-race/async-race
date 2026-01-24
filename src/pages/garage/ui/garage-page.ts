import { carsQueryStore, carsStore, CARS_ON_PAGE } from '@/entities';
import { cars as carsAPI, race as raceApi } from '@/features';
import { BlockComponent } from '@/shared';
import { carList, createPagination, carPanel, raceControls } from '@/widgets';
import { initCars } from '../model/init';
import { animateCarMovement } from '../model/animation';
import type { CarItem } from '../model/types';
import { stoptRaceForAllCars } from '@/features/race/model/start-race-all';
import { race } from '@/features';

export function createGaragePage() {
  let selectedCarId: number | null = null;
  let carItems: Map<string, CarItem> = new Map();

  void initCars();
  const pagination = initPagination();
  const controls = initControls(() => selectedCarId);
  const controlsTotalBlock = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex flex-col items-center ml-[20px]',
  });

  const {
    element: raceControlsButtons,
    setRaceButtonState,
    setResetButtonState,
    setResetLoading,
    setGenerateButtonState,
  } = raceControls({
    onGenerate: () => {
      void (async () => {
        await carsAPI.generateCars();
        await initCars();
      })();
    },
    onReset: () => {
      setResetLoading(true);
      race.raceController.stop();

      const { items: cars } = carsStore.get();
      void stoptRaceForAllCars(cars, () => {
        controls.setAddDisabled(false);
        setResetLoading(false);
        setResetButtonState(true);
        setRaceButtonState(false);
        setGenerateButtonState(false);
        setGenerateButtonState(false);
        carItems.forEach((item) => {
          item.stopAnimation?.();
          item.car.style.transform = 'translateX(0)';
          item.buttons.startButton.disabled = false;
          item.buttons.stopButton.disabled = true;
          item.buttons.deleteButton.disabled = false;
          item.buttons.selectButton.disabled = false;
        });
      });
    },
    onStartRace: () => {
      controls.setAddDisabled(true);
      controls.setEditDisabled(true);
      setResetButtonState(true);
      setRaceButtonState(true);
      setGenerateButtonState(true);
      const { items: cars } = carsStore.get();
      cars.map((car) => {
        const carItem = carItems.get(car.id.toString());
        if (!carItem) throw new Error('Car not found');
        setAllControls(carItem.buttons, true);
      });

      const raceCars = cars.map((car) => {
        const carItem = carItems.get(car.id.toString());
        if (!carItem) throw new Error('Car not found');

        return {
          id: car.id,
          animate: (velocity: number, distance: number) => {
            const animation = animateCarMovement(
              velocity,
              distance,
              carItem.car,
            );
            carItem.stopAnimation = animation.stop;
            return animation;
          },
        };
      });

      void raceApi.startRaceForAllCars(raceCars, () => {
        setResetButtonState(false);
      });
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
    const { items: cars, total } = carsStore.get();
    const { widgetContainer: carListElement, items } = carList(cars, total, {
      onEdit: (id, dto) => {
        selectedCarId = id;
        controls.setEditDisabled(false);
        controls.setEditValues(dto);
      },
      onDelete: (id) => {
        void carsAPI.deleteCar(id);
        if (selectedCarId === id) {
          controls.setEditDisabled(true);
          selectedCarId = null;
        }
      },
      onStart: (id) => {
        const carItem = carItems.get(id.toString());
        if (!carItem) throw new Error('Car not found');
        raceApi
          .startRaceForCar(id, (velocity, distance) => {
            setControlsDisble(carItem.buttons);
            const animation = animateCarMovement(
              velocity,
              distance,
              carItem.car,
            );
            carItem.stopAnimation = animation.stop;
            return animation;
          })
          .catch((error: unknown) => {
            console.log(error);
          });
      },
      onStop: (id) => {
        void raceApi.stopRaceForCar(id);
        const carItem = carItems.get(id.toString());
        if (!carItem) throw new Error('Car not found');
        setControlsEnable(carItem.buttons);
        carItem.stopAnimation?.();
        carItem.car.style.transform = 'translateX(0)';
      },
    });
    carItems = items;
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
    setEditDisabled: carUpdateControls.setDisabled,
    setAddDisabled: carAddControls.setDisabled,
  };
};

const setControlsDisble = (buttons: CarItem['buttons']) => {
  buttons.deleteButton.disabled = true;
  buttons.selectButton.disabled = true;
  buttons.startButton.disabled = true;
  buttons.stopButton.disabled = false;
};

const setControlsEnable = (buttons: CarItem['buttons']) => {
  buttons.deleteButton.disabled = false;
  buttons.selectButton.disabled = false;
  buttons.startButton.disabled = false;
  buttons.stopButton.disabled = true;
};

const setAllControls = (buttons: CarItem['buttons'], isDisabled: boolean) => {
  Object.values(buttons).forEach((button) => {
    button.disabled = isDisabled;
  });
};
