import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { Input } from '@/shared/ui/input/input';
import { Button } from '@/shared/ui/button/button';
import type { UpdateCarDto } from '@/entities/car/model/types';

const createInputs = () => ({
  carName: Input({
    id: 'car-model',
    name: 'car-model',
  }),
  carColor: Input({
    type: 'color',
    id: 'car-color',
    name: 'car-color',
    extraClasses: 'w-15 h-12',
  }),
});

export function carPanel(
  type: 'create' | 'update',
  onSubmit: ({ name, color }: UpdateCarDto) => void,
) {
  const widgetContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex gap-2',
  });
  const input = createInputs();
  const button = Button({
    textContent: type.toUpperCase(),
    onClick() {
      onSubmit({ name: input.carName.value, color: input.carColor.value });
      resetValues();
    },
  });

  function resetValues() {
    input.carName.value = '';
    input.carColor.value = '#000000';
  }

  function setDisabled(isDisabled: boolean) {
    if (isDisabled) resetValues();
    input.carName.disabled = isDisabled;
    input.carColor.disabled = isDisabled;
    button.disabled = isDisabled;
  }

  function setValues(values: UpdateCarDto) {
    input.carName.value = values.name;
    input.carColor.value = values.color;
  }

  widgetContainer.append(input.carName, input.carColor, button);

  return { element: widgetContainer, setDisabled, setValues };
}
