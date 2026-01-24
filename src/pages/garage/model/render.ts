import { carsStore, type CreateCarDto } from '@/entities';
import { cars as carsAPI } from '@/features';
import { carList } from '@/widgets';
import { createGarageCarHandlers } from './handlers';
import type { CarItem } from './types';
import { raceState } from '@/features/race/model/race-state';
import { applyCarButtonsState } from '@/features/race/model/car-buttons-rules';
import { applyRaceControlsState } from './apply-controls-state';

export function renderGarageCarList(parameters: {
  raceControls: {
    start: HTMLButtonElement;
    reset: HTMLButtonElement;
    generate: HTMLButtonElement;
  };
  tableContainer: HTMLElement;
  pagination: {
    update: () => void;
    disable: () => void;
  };
  controls: {
    setAddDisabled: (value: boolean) => void;
    setEditDisabled: (value: boolean) => void;
    setEditValues: (data: CreateCarDto) => void;
  };
  carItemsRef: {
    get: () => Map<string, CarItem>;
    set: (items: Map<string, CarItem>) => void;
  };
  setSelectedCarId: (id: number | null) => void;
  getSelectedCarId: () => number | null;
}) {
  const { items: cars, total } = carsStore.get();

  const carHandlers = createGarageCarHandlers({
    getCarItems: parameters.carItemsRef.get,
  });

  const result = carList(cars, total, {
    onEdit: (id, data) => {
      parameters.setSelectedCarId(id);
      parameters.controls.setEditDisabled(false);
      parameters.controls.setEditValues(data);
    },
    onDelete: (id) => {
      void carsAPI.deleteCar(id);
      if (parameters.getSelectedCarId() === id) {
        parameters.controls.setEditDisabled(true);
        parameters.setSelectedCarId(null);
      }
    },
    onStart: (id) => {
      carHandlers.onStart(id);
    },
    onStop: (id) => {
      carHandlers.onStop(id);
    },
  });

  parameters.carItemsRef.set(result.items);
  raceState.subscribe(() => {
    applyRaceControlsState(
      parameters.raceControls,
      parameters.pagination,
      parameters.controls,
    );
    parameters.carItemsRef.get().forEach((item, id) => {
      applyCarButtonsState(Number(id), item.buttons);
    });
  });
  parameters.tableContainer.replaceChildren(result.widgetContainer);
  parameters.pagination.update();
}
