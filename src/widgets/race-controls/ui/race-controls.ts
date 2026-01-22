import { BlockComponent } from '@/shared';
import { Button } from '@/shared';
import type { RaceControlProps } from '../model/types';

export function raceControls({
  onGenerate,
  onReset,
  onStartRace,
}: RaceControlProps): HTMLElement {
  const controlsContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex gap-2',
  });

  const buttonStartRace = Button({
    textContent: 'race',
    extraClasses: 'min-w-[110px]',
    onClick: () => {
      onStartRace();
    },
  });

  const buttonResetRace = Button({
    textContent: 'reset',
    extraClasses: 'min-w-[110px]',
    onClick: () => {
      onReset();
    },
  });

  const buttonGenerateCars = Button({
    textContent: 'generate cars',
    extraClasses: 'min-w-[110px]',
    onClick: () => {
      onGenerate();
    },
  });

  controlsContainer.append(
    buttonStartRace,
    buttonResetRace,
    buttonGenerateCars,
  );

  return controlsContainer;
}
