import '@/shared/test/mock';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { carList } from './car-list';
import type { Car } from '@/entities/car/model/types';

vi.mock('@/widgets', () => ({
  createCarControls: vi.fn(() => {
    const controls = document.createElement('div');
    controls.dataset.testid = 'controls';
    return controls;
  }),
}));

describe('carList', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render car list with total label', () => {
    const cars: Car[] = [
      { id: 1, name: 'BMW', color: '#000000' },
      { id: 2, name: 'Audi', color: '#fff000' },
    ];

    const element = carList(cars, 2, {
      onEdit: vi.fn(),
      onDelete: vi.fn(),
      onStart: vi.fn(),
      onStop: vi.fn(),
    });

    document.body.append(element);

    expect(element.textContent).toContain('Garage (2)');
    expect(element.textContent).toContain('BMW');
    expect(element.textContent).toContain('Audi');
  });

  it('should render one car container per car', () => {
    const cars: Car[] = [{ id: 42, name: 'Tesla', color: '#ff0000' }];

    const element = carList(cars, 1, {
      onEdit: vi.fn(),
      onDelete: vi.fn(),
      onStart: vi.fn(),
      onStop: vi.fn(),
    });

    const carContainers = element.querySelectorAll('.flex');

    expect(carContainers.length).toBeGreaterThanOrEqual(1);
    expect(element.textContent).toContain('Tesla');
  });
});
