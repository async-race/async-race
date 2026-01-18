import type { Car } from '@/entities';
import { BlockComponent, carSvg } from '@/shared';
import { createCarControls } from '@/widgets';
import type { CarListProps } from '../model/types';

export function carList(
  cars: Car[],
  total: number,
  { onEdit, onDelete, onStart, onStop }: CarListProps,
) {
  const widgetContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'car-list',
  });
  const totalLabel = BlockComponent({
    tagName: 'p',
    textContent: `Garage (${total.toString()})`,
    extraClasses: 'text-center',
  });
  widgetContainer.append(totalLabel);
  const items = new Map<string, HTMLElement>();
  cars.forEach((car) => {
    const carContainer = BlockComponent({
      tagName: 'div',
      extraClasses: 'flex',
    });
    const roadContainer = BlockComponent({
      tagName: 'div',
      extraClasses: 'flex flex-1 flex-col border-b-4',
    });

    const controls = createCarControls({
      onEdit: () => {
        const dto = { name: car.name, color: car.color };
        onEdit(car.id, dto);
      },
      onDelete: () => {
        onDelete(car.id);
      },
      onStart: () => {
        onStart(car.id);
      },
      onStop: () => {
        onStop(car.id);
      },
    });

    const label = BlockComponent({ tagName: 'p', textContent: car.name });
    const newCar = carSvg(car);
    roadContainer.append(label, newCar);
    carContainer.append(controls, roadContainer);
    widgetContainer.append(carContainer);
    items.set(String(car.id), carContainer);
  });
  return widgetContainer;
}
