import type { Car } from '@/entities/car/model/types';
import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { carSvg } from '@/shared/ui/car-template/car.template';

export function carList() {
  const container = BlockComponent({
    tagName: 'div',
    extraClasses: 'car-list',
  });

  const items = new Map<string, HTMLElement>();

  function addCar(car: Car): void {
    const carContainer = BlockComponent({
      tagName: 'div',
      id: String(car.id),
    });
    const newCar = carSvg(car);
    const label = BlockComponent({ tagName: 'p', textContent: car.name });
    carContainer.append(newCar, label);
    items.set(carContainer.id, carContainer);
    container.append(carContainer);
  }

  function deleteCar(id: number): void {
    const carId = String(id);
    const carContainerToDelete = items.get(carId);

    if (carContainerToDelete) {
      carContainerToDelete.remove();
      items.delete(carId);
    }
  }

  function updateCar(car: Car): void {
    const carContainerToUpdate = items.get(String(car.id));

    if (carContainerToUpdate) {
      carContainerToUpdate.innerHTML = '';
      const newCar = carSvg(car);
      const label = BlockComponent({ tagName: 'p', textContent: car.name });
      carContainerToUpdate.append(newCar, label);
      items.set(String(car.id), carContainerToUpdate);
    }
  }

  return { element: container, addCar, deleteCar, updateCar };
}
