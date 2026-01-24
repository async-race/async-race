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

  function setRaceButtonState(isDisabled: boolean) {
    buttonStartRace.disabled = isDisabled;
  }

  function setResetButtonState(isDisabled: boolean) {
    buttonResetRace.disabled = isDisabled;
  }

  function setResetLoading(isLoading: boolean) {
    buttonResetRace.disabled = isLoading;
    buttonResetRace.textContent = isLoading ? 'resetting…' : 'reset';
  }

  function setGenerateButtonState(isDisabled: boolean) {
    buttonGenerateCars.disabled = isDisabled;
  }

  return {
    element: controlsContainer,
    setRaceButtonState,
    setResetButtonState,
    setResetLoading,
    setGenerateButtonState,
  };
}
