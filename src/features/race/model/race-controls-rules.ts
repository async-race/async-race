import { raceState } from './race-state';

export function getRaceControlsState() {
  const { mode, phase } = raceState.get();

  return {
    start: phase === 'ready' && mode === 'idle',
    reset: phase === 'finished' || (mode === 'single' && phase !== 'resetting'),
    resetting: phase === 'resetting',
    generate: phase === 'ready' && mode === 'idle',
  };
}
