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
    extraClasses: 'car-list flex flex-col gap-2 p-0',
  });
  const totalLabel = BlockComponent({
    tagName: 'h4',
    textContent: `Garage (${total.toString()})`,
    extraClasses: 'text-center p-0',
  });
  widgetContainer.append(totalLabel);
  const items = new Map<string, HTMLElement>();
  cars.forEach((car) => {
    const carContainer = BlockComponent({
      tagName: 'p',
      extraClasses: 'flex items-center my-0',
    });
    const roadContainer = BlockComponent({
      tagName: 'p',
      extraClasses:
        'flex flex-1 flex-col justify-start border-b-4 border-dashed p-0',
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

    const label = BlockComponent({
      tagName: 'p',
      textContent: car.name,
      extraClasses: 'font-bold',
    });
    const newCar = carSvg({ color: car.color, size: 45 });
    roadContainer.append(label, newCar);
    carContainer.append(controls, roadContainer);
    widgetContainer.append(carContainer);
    items.set(String(car.id), carContainer);
  });
  return widgetContainer;
}
