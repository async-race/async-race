import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { Input } from '@/shared/ui/input/input';
import { Button } from '@/shared/ui/button/button';
import type { UpdateCarDto } from '@/entities/car/model/types';

const createInputs = () => ({
  carName: Input({
    id: 'car-model',
    name: 'car-model',
    extraClasses: 'h-7 px-2 text-xs',
  }),
  carColor: Input({
    type: 'color',
    id: 'car-color',
    name: 'car-color',
    extraClasses: 'w-8 h-7 p-0 appearance-none',
  }),
});

export function carPanel(
  type: 'create' | 'update',
  onSubmit: ({ name, color }: UpdateCarDto) => void,
) {
  const widgetContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex gap-2 items-center',
  });
  const input = createInputs();

  const carNameLabel = document.createElement('label');
  carNameLabel.htmlFor = 'car-model';
  carNameLabel.textContent = 'Car model:';
  carNameLabel.className = 'text-sm font-medium';

  const carColorLabel = document.createElement('label');
  carColorLabel.htmlFor = 'car-color';
  carColorLabel.textContent = 'Car color:';
  carColorLabel.className = 'text-sm font-medium';

  const button = Button({
    textContent: type.toUpperCase(),
    extraClasses:
      'h-7 px-2 bg-indigo-700 hover:bg-indigo-900 text-white font-semibold text-xs',
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

  widgetContainer.append(
    carNameLabel,
    input.carName,
    carColorLabel,
    input.carColor,
    button,
  );

  return { element: widgetContainer, setDisabled, setValues };
}
