import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { animateCarMovement } from './animation';

describe('animateCarMovement', () => {
  let carElement: SVGSVGElement;
  let parentElement: HTMLElement;

  let rafCallbacks: Map<number, FrameRequestCallback>;
  let nextRafId: number;

  beforeEach(() => {
    parentElement = document.createElement('div');
    parentElement.style.position = 'relative';
    document.body.append(parentElement);

    carElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    parentElement.append(carElement);

    Object.defineProperty(parentElement, 'clientWidth', { value: 100 });
    Object.defineProperty(carElement, 'clientWidth', { value: 10 });

    rafCallbacks = new Map();
    nextRafId = 1;

    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation(
      (callback) => {
        const id = nextRafId++;
        rafCallbacks.set(id, callback);
        return id;
      },
    );

    vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation((id) => {
      rafCallbacks.delete(id);
    });
  });

  afterEach(() => {
    parentElement.remove();
    vi.restoreAllMocks();
  });

  it('should return correct animation time', () => {
    const velocity = 10;
    const distance = 50;
    const animation = animateCarMovement(velocity, distance, carElement);

    expect(animation.getTime()).toBe(distance / velocity);
  });

  it('should start animation and move car element', () => {
    const velocity = 10;
    const distance = 50;
    const animation = animateCarMovement(velocity, distance, carElement);

    animation.start();

    const frameCallback = [...rafCallbacks.values()][0];
    frameCallback(performance.now() + 50);

    const transform = carElement.style.transform;
    expect(transform).toMatch(/translateX\(\d+(\.\d+)?px\)/);
  });

  it('should stop animation and cancel requestAnimationFrame', () => {
    const animation = animateCarMovement(10, 50, carElement);

    animation.start();
    const rafId = [...rafCallbacks.keys()][0];
    animation.stop();

    expect(rafCallbacks.has(rafId)).toBe(false);
  });

  it('should move car to the end when elapsedTime >= animationTime', () => {
    const distance = 50;
    const velocity = 10;
    const animation = animateCarMovement(velocity, distance, carElement);
    animation.start();

    const frameCallback = [...rafCallbacks.values()][0];

    frameCallback(performance.now() + (distance / velocity) * 1000 + 1);

    expect(carElement.style.transform).toBe('translateX(90px)');
  });
});
