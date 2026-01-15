import { describe, it, expect, beforeEach } from 'vitest';
import { carList } from './car-list';
import type { Car } from '@/entities/car/model/types';

const mockCar = ({ id, name, color }: Car) => ({
  id,
  name,
  color,
});

describe('carList component', () => {
  let list: ReturnType<typeof carList>;
  beforeEach(() => {
    list = carList();
  });

  it('should add a car', () => {
    const car = mockCar({ id: 1, name: 'lada', color: '#ff0000' });

    list.addCar(car);
    const carContainer = list.element.querySelector(`[id="${String(car.id)}"]`);
    const label = carContainer?.querySelector('p');
    const carSvg = carContainer?.querySelector('svg');

    expect(carContainer).toBeTruthy();
    expect(label?.textContent).toBe('lada');
    expect(carSvg?.getAttribute('fill')).toBe('#ff0000');
  });

  it('should update a car', () => {
    const car = mockCar({ id: 1, name: 'lada', color: '#ff0000' });
    list.addCar(car);
    const updatedCar = { ...car, name: 'Audi Updated', color: '#000000' };

    list.updateCar(updatedCar);
    const carContainer = list.element.querySelector(`[id="${String(car.id)}"]`);
    const label = carContainer?.querySelector('p');
    const carSvg = carContainer?.querySelector('svg');

    expect(label?.textContent).toBe('Audi Updated');
    expect(carSvg?.getAttribute('fill')).toBe('#000000');
  });

  it('sould delete a car-container with a required car', () => {
    const car = mockCar({ id: 1, name: 'lada', color: '#ff0000' });
    list.addCar(car);

    list.deleteCar(car.id);
    const carContainer = list.element.querySelector(`[id="${String(car.id)}"]`);

    expect(carContainer).toBeNull();
  });

  it('should initialize with empty container', () => {
    expect(list.element.className).toContain('car-list');
    expect(list.element.children.length).toBe(0);
  });

  it('should not update non-existent car', () => {
    const ghostCar = mockCar({ id: 99, name: 'ghost', color: '#123456' });

    list.updateCar(ghostCar);

    expect(list.element.children.length).toBe(0);
  });

  it('should not throw when deleting non-existent car', () => {
    expect(() => {
      list.deleteCar(999);
    }).not.toThrow();
    expect(list.element.children.length).toBe(0);
  });
});
