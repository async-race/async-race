import { describe, it, expect } from 'vitest';
import { carList } from './car-list';
import type { Car } from '@/entities/car/model/types';

const makeCars = (): Car[] => [
  { id: 1, name: 'Lada', color: '#ff0000' },
  { id: 2, name: 'Audi', color: '#000000' },
];

describe('carList', () => {
  it('should return container and items map', () => {
    const cars = makeCars();
    const result = carList(cars);

    expect(result).toHaveProperty('container');
    expect(result).toHaveProperty('items');
    expect(result.container).toBeInstanceOf(HTMLElement);
    expect(result.container.className).toContain('car-list');
    expect(result.items instanceof Map).toBe(true);
  });

  it('should render one car container per car with correct id', () => {
    const cars = makeCars();
    const { container } = carList(cars);

    expect(container.children.length).toBe(cars.length);

    for (const car of cars) {
      const carContainer = container.querySelector(`[id="${String(car.id)}"]`);
      expect(carContainer).toBeTruthy();
    }
  });

  it('should render correct label and svg fill for each car', () => {
    const cars = makeCars();
    const { container } = carList(cars);

    for (const car of cars) {
      const carContainer = container.querySelector(`[id="${String(car.id)}"]`);
      const label = carContainer?.querySelector('p');
      const svg = carContainer?.querySelector('svg');

      expect(label?.textContent).toBe(car.name);
      expect(svg?.getAttribute('fill')).toBe(car.color);
    }
  });

  it('should map items by car id to their own car container', () => {
    const cars = makeCars();
    const { container, items } = carList(cars);

    expect(items.size).toBe(cars.length);

    for (const car of cars) {
      const mapped = items.get(String(car.id));
      const carContainer = container.querySelector(`[id="${String(car.id)}"]`);
      expect(mapped).toBe(carContainer);
    }
  });

  it('should initialize empty when no cars provided', () => {
    const { container, items } = carList([]);
    expect(container.children.length).toBe(0);
    expect(items.size).toBe(0);
  });
});
