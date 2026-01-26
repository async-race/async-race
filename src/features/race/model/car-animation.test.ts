import { describe, it, expect, vi, beforeEach } from 'vitest';
import { startCarAnimation } from './car-animation';
import { animateCarMovement } from '@/pages/garage/model/animation';
import type { CarItem } from '@/pages/garage/model/types';

vi.mock('@/pages/garage/model/animation', () => ({
  animateCarMovement: vi.fn(),
}));

function createCarItem(): CarItem {
  return {
    car: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
    buttons: {
      startButton: document.createElement('button'),
      stopButton: document.createElement('button'),
      deleteButton: document.createElement('button'),
      selectButton: document.createElement('button'),
    },
    stopAnimation: undefined,
  };
}

describe('startCarAnimation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls animateCarMovement with correct arguments', () => {
    const mockedAnimateCarMovement = vi.mocked(animateCarMovement);
    const stopHandler = vi.fn();
    const animationObject = {
      start: vi.fn(),
      stop: stopHandler,
      getTime: vi.fn(() => 0),
    };
    mockedAnimateCarMovement.mockReturnValue(animationObject);

    const carItem = createCarItem();
    const result = startCarAnimation(carItem, 100, 500);

    expect(mockedAnimateCarMovement).toHaveBeenCalledWith(
      100,
      500,
      carItem.car,
    );
    expect(result).toBe(animationObject);
  });

  it('assigns stopAnimation to carItem', () => {
    const mockedAnimateCarMovement = vi.mocked(animateCarMovement);
    const stopHandler = vi.fn();
    mockedAnimateCarMovement.mockReturnValue({
      start: vi.fn(),
      stop: stopHandler,
      getTime: vi.fn(() => 0),
    });

    const carItem = createCarItem();
    startCarAnimation(carItem, 200, 1000);

    expect(carItem.stopAnimation).toBe(stopHandler);
  });

  it('overwrites stopAnimation when called again', () => {
    const mockedAnimateCarMovement = vi.mocked(animateCarMovement);

    const firstStopHandler = vi.fn();
    mockedAnimateCarMovement.mockReturnValue({
      start: vi.fn(),
      stop: firstStopHandler,
      getTime: vi.fn(() => 0),
    });

    const carItem = createCarItem();
    startCarAnimation(carItem, 150, 600);
    expect(carItem.stopAnimation).toBe(firstStopHandler);

    const secondStopHandler = vi.fn();
    mockedAnimateCarMovement.mockReturnValue({
      start: vi.fn(),
      stop: secondStopHandler,
      getTime: vi.fn(() => 0),
    });

    startCarAnimation(carItem, 300, 1200);
    expect(carItem.stopAnimation).toBe(secondStopHandler);
  });

  it('stopAnimation function can be called', () => {
    const mockedAnimateCarMovement = vi.mocked(animateCarMovement);
    const stopHandler = vi.fn();
    mockedAnimateCarMovement.mockReturnValue({
      start: vi.fn(),
      stop: stopHandler,
      getTime: vi.fn(() => 0),
    });

    const carItem = createCarItem();
    startCarAnimation(carItem, 400, 1600);

    carItem.stopAnimation?.();
    expect(stopHandler).toHaveBeenCalled();
  });
});
