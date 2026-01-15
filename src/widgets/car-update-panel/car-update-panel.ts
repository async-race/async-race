import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { Input } from '@/shared/ui/input/input';
import { Button } from '@/shared/ui/button/button';
import { CarUpdate } from '@/features/car-update/car-update';
import { notifyUser } from '@/features/notify-user/notify-user';

export function CarUpdatePanel(): HTMLElement {
  const { handleUpdate } = CarUpdate();
  const updateFormWrapper = BlockComponent({
    tagName: 'div',
    extraClasses: 'update-form-wrapper',
  });
  const carModelInput = Input({
    id: 'car-model',
    name: 'car-model',
    extraClasses: 'car-model-input-update',
  });
  const carColorInput = Input({
    type: 'color',
    id: 'car-color',
    name: 'car-color',
    extraClasses: 'car-color-input-update',
  });
  const buttonCreate = Button({
    textContent: 'create',
    extraClasses: 'button-update',
    async onClick() {
      try {
        const name = carModelInput.value;
        const color = carColorInput.value;
        const id = 1;

        const updatedCar = await handleUpdate(id, name, color);
        notifyUser(
          `Your car is updated: ${updatedCar.data.name} (${updatedCar.data.color})`,
        );
      } catch (error: unknown) {
        notifyUser(
          error instanceof Error
            ? `The car wasn't updated! ${error.message}`
            : "The car wasn't updated! Unknown error",
        );
      }
    },
  });

  updateFormWrapper.append(carModelInput, carColorInput, buttonCreate);

  return updateFormWrapper;
}
