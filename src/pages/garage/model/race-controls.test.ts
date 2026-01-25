import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { initGarageRaceControls } from './race-controls';
import { cars as carsAPI, race as raceApi } from '@/features';
import { carsStore, carsQueryStore } from '@/entities';
import { stoptRaceForAllCars } from '@/features/race/model/start-race-all';
import { startCarAnimation } from '@/features/race/model/car-animation';
import { raceState } from '@/features/race/model/race-state';
import type { CarItem } from './types';

vi.mock('@/widgets', () => ({
  raceControls: vi.fn(
    (callbacks: {
      onGenerate: () => Promise<void> | void;
      onReset: () => void;
      onStartRace: () => void;
    }) => {
      const element = document.createElement('div');
      const buttons = {
        generate: Object.assign(document.createElement('button'), {
          onclick: async () => {
            await callbacks.onGenerate();
          },
        }),
        reset: Object.assign(document.createElement('button'), {
          onclick: () => {
            callbacks.onReset();
          },
        }),
        start: Object.assign(document.createElement('button'), {
          onclick: () => {
            callbacks.onStartRace();
          },
        }),
      };
      return { element, buttons };
    },
  ),
}));

vi.mock('@/features', () => ({
  cars: { generateCars: vi.fn() },
  race: {
    raceController: { stop: vi.fn() },
    startRaceForAllCars: vi.fn(
      (
        raceCars: {
          id: number;
          animate: (velocity: number, distance: number) => void;
        }[],
        callback?: () => void,
      ) => {
        for (const car of raceCars) {
          car.animate(100, 500);
        }
        callback?.();
      },
    ),
  },
}));

vi.mock('@/features/race/model/start-race-all', () => ({
  stoptRaceForAllCars: vi.fn((_: unknown, callback: () => void) => {
    callback();
  }),
}));

vi.mock('@/features/race/model/car-animation', () => ({
  startCarAnimation: vi.fn(),
}));

vi.mock('@/entities', () => ({
  carsStore: {
    get: vi.fn<
      () => {
        items: { id: number; name: string; color: string }[];
        total: number;
      }
    >(() => ({
      items: [],
      total: 0,
    })),
  },
  carsQueryStore: {
    set: vi.fn<(value: { page: number }) => void>(),
  },
}));

vi.mock('@/features/race/model/race-state', () => ({
  raceState: {
    set: vi.fn<(value: { mode?: string; phase: string }) => void>(),
    reset: vi.fn<() => void>(),
  },
}));

describe('initGarageRaceControls', () => {
  let getCarItems: () => Map<string, CarItem>;

  beforeEach(() => {
    vi.clearAllMocks();
    getCarItems = vi.fn(() => new Map());
  });

  it('should render race controls element and buttons', () => {
    const { element, buttons } = initGarageRaceControls(getCarItems);

    expect(element).toBeInstanceOf(HTMLElement);
    expect(buttons.generate).toBeInstanceOf(HTMLButtonElement);
    expect(buttons.reset).toBeInstanceOf(HTMLButtonElement);
    expect(buttons.start).toBeInstanceOf(HTMLButtonElement);
  });

  it('should call generateCars and set carsQueryStore on generate', async () => {
    const { buttons } = initGarageRaceControls(getCarItems);

    await buttons.generate.onclick?.(new PointerEvent('click'));

    expect(carsAPI.generateCars).toHaveBeenCalled();
    expect(carsQueryStore.set).toHaveBeenCalledWith({ page: 1 });
  });

  it('should stop all races and reset cars on reset', () => {
    const carMock: CarItem = {
      stopAnimation: vi.fn(),
      car: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      buttons: {
        selectButton: document.createElement('button'),
        deleteButton: document.createElement('button'),
        startButton: document.createElement('button'),
        stopButton: document.createElement('button'),
      },
    };
    const getCarItemsMock = () => new Map([['1', carMock]]);
    (carsStore.get as Mock).mockReturnValue({
      items: [{ id: 1, name: 'test', color: '#000000' }],
      total: 1,
    });

    const { buttons } = initGarageRaceControls(getCarItemsMock);

    buttons.reset.onclick?.(new PointerEvent('click'));

    expect(raceApi.raceController.stop).toHaveBeenCalled();
    expect(stoptRaceForAllCars).toHaveBeenCalled();
    expect(carMock.stopAnimation).toHaveBeenCalled();
    expect(carMock.car.style.transform).toBe('translateX(0)');
    expect(raceState.reset).toHaveBeenCalled();
  });

  it('should start race for all cars and call startCarAnimation', () => {
    const carMock: CarItem = {
      stopAnimation: vi.fn(),
      car: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      buttons: {
        selectButton: document.createElement('button'),
        deleteButton: document.createElement('button'),
        startButton: document.createElement('button'),
        stopButton: document.createElement('button'),
      },
    };
    const getCarItemsMock = () => new Map([['1', carMock]]);
    (carsStore.get as Mock).mockReturnValue({
      items: [{ id: 1, name: 'test', color: '#000000' }],
      total: 1,
    });

    const { buttons } = initGarageRaceControls(getCarItemsMock);

    buttons.start.onclick?.(new PointerEvent('click'));

    expect(raceState.set).toHaveBeenCalledWith({
      mode: 'all',
      phase: 'running',
    });
    expect(startCarAnimation).toHaveBeenCalledWith(
      carMock,
      expect.any(Number),
      expect.any(Number),
    );
    expect(raceState.set).toHaveBeenCalledWith({ phase: 'finished' });
  });
});
