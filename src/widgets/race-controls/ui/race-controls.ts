import { BlockComponent } from '@/shared';
import { Button } from '@/shared';

export function raceControls(): HTMLElement {
  const controlsContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex gap-2',
  });

  const buttonStartRace = Button({
    textContent: 'race',
    extraClasses: 'min-w-[100px]',
    onClick() {
      console.log('race starts');
    },
  });

  const buttonResetRace = Button({
    textContent: 'reset',
    extraClasses: 'min-w-[100px]',
    onClick() {
      console.log('race stops');
    },
  });

  const buttonGenerateCars = Button({
    textContent: 'generate',
    extraClasses: 'min-w-[100px]',
    onClick() {
      console.log('100 cars');
    },
  });

  controlsContainer.append(
    buttonStartRace,
    buttonResetRace,
    buttonGenerateCars,
  );

  return controlsContainer;
}
