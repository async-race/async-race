import { BlockComponent } from '@/shared';
import { carPanel } from '@/widgets';
import { cars as carsAPI } from '@/features';

export function initGarageControls(getSelectedCarId: () => number | null) {
  const controlsContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex flex-col justify-center items-center',
  });

  const carCreateControls = carPanel('create', (data) => {
    void carsAPI.createCar(data);
  });

  const carUpdateControls = carPanel('update', (data) => {
    const selectedId = getSelectedCarId();
    if (selectedId !== null) {
      void carsAPI.updateCar(selectedId, data);
    }
    carUpdateControls.setDisabled(true);
  });

  carUpdateControls.setDisabled(true);

  controlsContainer.append(
    carCreateControls.element,
    carUpdateControls.element,
  );

  return {
    element: controlsContainer,
    setEditValues: carUpdateControls.setValues,
    setEditDisabled: carUpdateControls.setDisabled,
    setAddDisabled: carCreateControls.setDisabled,
  };
}
