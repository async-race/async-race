import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderGarageCarList } from './render';
import { carsStore, type Car, type CreateCarDto } from '@/entities';
import { raceState } from '@/features/race/model/race-state';
import type { CarItem } from './types';
import * as widgets from '@/widgets';

vi.mock('@/widgets', () => ({
  carList: vi.fn(
    (
      cars: Car[],
      total: number,
      handlers: {
        onEdit: (id: number, dto: CreateCarDto) => void;
        onDelete: (id: number) => void;
        onStart: (id: number) => void;
        onStop: (id: number) => void;
      },
    ) => {
      const map = new Map<string, CarItem>();

      cars.forEach((car) => {
        map.set(car.id.toString(), {
          car: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
          buttons: {
            selectButton: document.createElement('button'),
            deleteButton: document.createElement('button'),
            startButton: document.createElement('button'),
            stopButton: document.createElement('button'),
          },
        });
      });

      return {
        items: map,
        widgetContainer: document.createElement('div'),
        handlers,
        total,
      };
    },
  ),
}));

vi.mock('@/features', async () => {
  const actual =
    await vi.importActual<typeof import('@/features')>('@/features');
  return {
    ...actual,
    cars: {
      ...actual.cars,
      deleteCar: vi.fn(),
    },
  };
});

describe('renderGarageCarList', () => {
  let tableContainer: HTMLElement;
  let pagination: {
    update: () => void;
    disable: () => void;
  };
  let controls: {
    setAddDisabled: (value: boolean) => void;
    setEditDisabled: (value: boolean) => void;
    setEditValues: (data: CreateCarDto) => void;
  };
  let carItems: Map<string, CarItem>;
  let selectedCarId: number | null;

  beforeEach(() => {
    tableContainer = document.createElement('div');

    pagination = {
      update: vi.fn(),
      disable: vi.fn(),
    };

    controls = {
      setAddDisabled: vi.fn(),
      setEditDisabled: vi.fn(),
      setEditValues: vi.fn(),
    };

    carItems = new Map();
    selectedCarId = null;

    raceState.reset();
    carsStore.set([{ id: 1, name: 'Car', color: '#000' }], 1);

    vi.clearAllMocks();
  });

  it('should render car list and update table container', () => {
    renderGarageCarList({
      raceControls: {
        start: document.createElement('button'),
        reset: document.createElement('button'),
        generate: document.createElement('button'),
      },
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

    expect(tableContainer.children.length).toBe(1);
    expect(carItems.size).toBe(1);
    expect(pagination.update).toHaveBeenCalled();
  });

  it('should update selected car and enable edit on edit handler', () => {
    renderGarageCarList({
      raceControls: {
        start: document.createElement('button'),
        reset: document.createElement('button'),
        generate: document.createElement('button'),
      },
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

    const calls = vi.mocked(widgets.carList).mock.calls;
    const handlers = calls[0][2];

    handlers.onEdit(1, { name: 'Updated', color: '#fff' });

    expect(selectedCarId).toBe(1);
    expect(controls.setEditDisabled).toHaveBeenCalledWith(false);
    expect(controls.setEditValues).toHaveBeenCalledWith({
      name: 'Updated',
      color: '#fff',
    });
  });

  it('should delete car and reset selection if deleted car was selected', () => {
    selectedCarId = 1;

    renderGarageCarList({
      raceControls: {
        start: document.createElement('button'),
        reset: document.createElement('button'),
        generate: document.createElement('button'),
      },
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

    const calls = vi.mocked(widgets.carList).mock.calls;
    const handlers = calls[0][2];

    handlers.onDelete(1);

    expect(controls.setEditDisabled).toHaveBeenCalledWith(true);
    expect(selectedCarId).toBeNull();
  });

  it('should apply race state changes to controls and pagination on subscribe', () => {
    renderGarageCarList({
      raceControls: {
        start: document.createElement('button'),
        reset: document.createElement('button'),
        generate: document.createElement('button'),
      },
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

    raceState.set({
      mode: 'single',
      phase: 'running',
      activeCarIds: new Set([1]),
    });

    expect(pagination.disable).toHaveBeenCalled();
    expect(controls.setAddDisabled).toHaveBeenCalled();
  });
});
