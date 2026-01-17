import { describe, it, expect } from 'vitest';
import { carList } from './car-list';
import type { Car } from '@/entities/car/model/types';

describe('carList', () => {
  it('should render all card list', () => {
    const cars: Car[] = [
      { id: 1, name: 'BMW', color: '#000000' },
      { id: 2, name: 'Audi', color: '#fff000' },
    ];

    const { container } = carList(cars);

    expect(container.children).toHaveLength(2);
    expect(container.textContent).toContain('BMW');
    expect(container.textContent).toContain('Audi');
  });

  it('should save all elements in list using  car.id', () => {
    const cars: Car[] = [{ id: 42, name: 'Tesla', color: '#f00000' }];
    const { items } = carList(cars);

    expect(items.has('42')).toBe(true);
    expect(items.get('42')?.textContent).toContain('Tesla');
  });
});
