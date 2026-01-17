import type { Car } from '@/entities/car/model/types';
import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { carSvg } from '@/shared/ui/car-template/car.template';

export function carList(cars: Car[]) {
  const container = BlockComponent({
    tagName: 'div',
    extraClasses: 'car-list',
  });

  const items = new Map<string, HTMLElement>();
  cars.forEach((car) => {
    const carContainer = BlockComponent({
      tagName: 'div',
      id: String(car.id),
    });
    const newCar = carSvg(car);
    const label = BlockComponent({ tagName: 'p', textContent: car.name });
    carContainer.append(newCar, label);
    items.set(carContainer.id, carContainer);
    container.append(carContainer);
    items.set(String(car.id), carContainer);
  });
  return { container, items };
}
