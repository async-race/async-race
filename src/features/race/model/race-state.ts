export type RaceMode = 'idle' | 'single' | 'all';
export type RacePhase = 'ready' | 'running' | 'finished' | 'resetting';

type RaceState = {
  mode: RaceMode;
  phase: RacePhase;
  activeCarIds: Set<number>;
};

let state: RaceState = {
  mode: 'idle',
  phase: 'ready',
  activeCarIds: new Set(),
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => {
    listener();
  });
}

export const raceState = {
  get() {
    return state;
  },

  set(patch: Partial<RaceState>) {
    state = {
      ...state,
      ...patch,
      activeCarIds: patch.activeCarIds
        ? new Set(patch.activeCarIds)
        : state.activeCarIds,
    };
    notify();
  },

  addActiveCar(id: number) {
    state = {
      ...state,
      activeCarIds: new Set(state.activeCarIds).add(id),
    };
    notify();
  },

  removeActiveCar(id: number) {
    const next = new Set(state.activeCarIds);
    next.delete(id);

    state = {
      ...state,
      activeCarIds: next,
    };
    notify();
  },

  reset() {
    state = {
      mode: 'idle',
      phase: 'ready',
      activeCarIds: new Set(),
    };
    notify();
  },

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
};
