import { getRaceControlsState } from '@/features/race/model/race-controls-rules';

export function applyRaceControlsState(
  controls: {
    start: HTMLButtonElement;
    reset: HTMLButtonElement;
    generate: HTMLButtonElement;
  },
  pagination: { update: () => void; disable: () => void },
  carControls: {
    setAddDisabled: (isDisabled: boolean) => void;
    setEditDisabled: (isDisabled: boolean) => void;
  },
) {
  const state = getRaceControlsState();

  controls.start.disabled = !state.start;
  controls.reset.disabled = !state.reset;
  controls.reset.textContent = state.resetting ? 'resetting…' : 'reset';
  controls.generate.disabled = !state.generate;

  pagination.update();
  carControls.setAddDisabled(false);
  if (!state.start) {
    pagination.disable();
    carControls.setAddDisabled(true);
    carControls.setEditDisabled(true);
  }
}
