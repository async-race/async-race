import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { Input } from '@/shared/ui/input/input';
import { Button } from '@/shared/ui/button/button';
import type { UpdateCarDto } from '@/entities/car/model/types';

export function carPanel(
  type: 'create' | 'update',
  onSubmit: ({ name, color }: UpdateCarDto) => void,
): HTMLElement {
  const createFormWrapper = BlockComponent({
    tagName: 'div',
  });
  const carModelInput = Input({
    id: 'car-model',
    name: 'car-model',
  });
  const carColorInput = Input({
    type: 'color',
    id: 'car-color',
    name: 'car-color',
  });
  const buttonCreate = Button({
    textContent: type,
    onClick() {
      onSubmit({ name: carModelInput.value, color: carColorInput.value });
    },
  });

  createFormWrapper.append(carModelInput, carColorInput, buttonCreate);

  return createFormWrapper;
}
