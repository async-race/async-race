import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { Input } from '@/shared/ui/input/input';
import { Button } from '@/shared/ui/button/button';
import { CarCreate } from '@/features/car-create/car-create';
import { resolveColor, resolveName } from './lib/check-inputs';

export function CarCreatePanel(): HTMLElement {
  const { handleCreate } = CarCreate();
  const createFormWrapper = BlockComponent({
    tagName: 'div',
    extraClasses: 'create-form-wrapper',
  });
  const carModelInput = Input({
    id: 'car-model',
    name: 'car-model',
    extraClasses: 'car-model-input',
  });
  const carColorInput = Input({
    type: 'color',
    id: 'car-color',
    name: 'car-color',
    extraClasses: 'car-color-input',
  });
  const buttonCreate = Button({
    textContent: 'create',
    async onClick() {
      try {
        const name = resolveName(carModelInput.value);
        const color = resolveColor(carColorInput.value);

        const newCar = await handleCreate(name, color);
        alert(`New car is created: ${newCar.data.name} (${newCar.data.color})`);
      } catch (error: unknown) {
        alert(
          error instanceof Error
            ? `The car wasn't created! ${error.message}`
            : "The car wasn't created! Unknown error",
        );
      }
    },
    extraClasses: 'button-create',
  });

  createFormWrapper.append(carModelInput, carColorInput, buttonCreate);

  return createFormWrapper;
}
