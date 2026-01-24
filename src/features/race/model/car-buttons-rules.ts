import type { CarItem } from '@/pages/garage/model/types';
import { raceState } from './race-state';

export function applyCarButtonsState(
  carId: number,
  buttons: CarItem['buttons'],
) {
  const { mode, activeCarIds } = raceState.get();

  const isActiveCar = activeCarIds.has(carId);

  if (mode === 'idle') {
    buttons.startButton.disabled = false;
    buttons.stopButton.disabled = true;
    buttons.deleteButton.disabled = false;
    buttons.selectButton.disabled = false;
    return;
  }

  if (mode === 'single') {
    buttons.startButton.disabled = isActiveCar;
    buttons.stopButton.disabled = !isActiveCar;
    buttons.deleteButton.disabled = true;
    buttons.selectButton.disabled = true;
    return;
  }

  Object.values(buttons).forEach((button) => {
    button.disabled = true;
  });
}
