import { BlockComponent } from '@/shared';
import { Button } from '@/shared';
import type { RaceControlProps } from '../model/types';

export function raceControls({
  onGenerate,
  onReset,
  onStartRace,
}: RaceControlProps) {
  const controlsContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex gap-2',
  });

  const buttonStartRace = Button({
    textContent: 'race',
    extraClasses:
      'h-8 px-3 bg-green-500 hover:bg-green-700 text-white text-sm flex items-center',
    onClick: () => {
      onStartRace();
    },
  });

  const buttonResetRace = Button({
    textContent: 'reset',
    extraClasses:
      'h-8 px-3 bg-red-500 hover:bg-red-700 text-white text-sm flex items-center',
    onClick: () => {
      onReset();
    },
  });

  const buttonGenerateCars = Button({
    textContent: 'generate cars',
    extraClasses:
      'h-8 px-3 bg-sky-400 hover:bg-sky-700 text-white text-sm flex items-center',
    onClick: () => {
      onGenerate();
    },
  });

  controlsContainer.append(
    buttonStartRace,
    buttonResetRace,
    buttonGenerateCars,
  );

  return {
    element: controlsContainer,
    buttons: {
      start: buttonStartRace,
      reset: buttonResetRace,
      generate: buttonGenerateCars,
    },
  };
}
