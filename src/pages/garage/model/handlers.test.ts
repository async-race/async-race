import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGarageCarHandlers } from './handlers';
import { raceState } from '@/features/race/model/race-state';
import { race as raceApi } from '@/features';
import type { CarItem } from './types';

vi.mock('@/features', () => ({
  race: {
    startRaceForCar: vi.fn(() => Promise.resolve()),
    stopRaceForCar: vi.fn(() => Promise.resolve()),
    startCarAnimation: vi.fn(() => ({
      start: vi.fn(),
      stop: vi.fn(),
      getTime: vi.fn(),
    })),
  },
}));

describe('createGarageCarHandlers', () => {
  let carItem: CarItem;
  let carItems: Map<string, CarItem>;

  beforeEach(() => {
    raceState.reset();

    carItem = {
      car: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
      buttons: {
        selectButton: document.createElement('button'),
        deleteButton: document.createElement('button'),
        startButton: document.createElement('button'),
        stopButton: document.createElement('button'),
      },
      stopAnimation: vi.fn(),
    };

    carItems = new Map([['1', carItem]]);
  });

  it('onStart should sets race state and starts race for car', () => {
    const handlers = createGarageCarHandlers({
      getCarItems: () => carItems,
    });

    handlers.onStart(1);

    expect(raceState.get().mode).toBe('single');
    expect(raceState.get().activeCarIds.has(1)).toBe(true);
    expect(raceApi.startRaceForCar).toHaveBeenCalledWith(
      1,
      expect.any(Function),
    );
  });

  it('onStart should throws if car is not found', () => {
    const handlers = createGarageCarHandlers({
      getCarItems: () => new Map(),
    });

    expect(() => {
      handlers.onStart(1);
    }).toThrow('Car not found');
  });

  it('onStop should stops race, resets state and animation', () => {
    raceState.set({ mode: 'single' });
    raceState.addActiveCar(1);

    const handlers = createGarageCarHandlers({
      getCarItems: () => carItems,
    });

    handlers.onStop(1);

    expect(raceApi.stopRaceForCar).toHaveBeenCalledWith(1);
    expect(raceState.get().mode).toBe('idle');
    expect(raceState.get().activeCarIds.size).toBe(0);
    expect(carItem.stopAnimation).toHaveBeenCalled();
    expect(carItem.car.style.transform).toBe('translateX(0)');
  });

  it('onStop should throws if car is not found', () => {
    const handlers = createGarageCarHandlers({
      getCarItems: () => new Map(),
    });

    expect(() => {
      handlers.onStop(1);
    }).toThrow('Car not found');
  });
});
