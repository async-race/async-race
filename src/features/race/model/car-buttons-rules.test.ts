import { describe, it, expect, beforeEach } from 'vitest';
import { raceState } from './race-state';
import { applyCarButtonsState } from './car-buttons-rules';

function createButtons() {
  return {
    startButton: document.createElement('button'),
    stopButton: document.createElement('button'),
    deleteButton: document.createElement('button'),
    selectButton: document.createElement('button'),
  };
}

describe('applyCarButtonsState', () => {
  beforeEach(() => {
    raceState.reset();
  });

  it('enables start and generate buttons in idle mode', () => {
    raceState.set({ mode: 'idle' });
    const buttons = createButtons();
    applyCarButtonsState(1, buttons);

    expect(buttons.startButton.disabled).toBe(false);
    expect(buttons.stopButton.disabled).toBe(true);
    expect(buttons.deleteButton.disabled).toBe(false);
    expect(buttons.selectButton.disabled).toBe(false);
  });

  it('disables start button and enables stop button for active car in single mode', () => {
    raceState.set({ mode: 'single', activeCarIds: new Set([1]) });
    const buttons = createButtons();
    applyCarButtonsState(1, buttons);

    expect(buttons.startButton.disabled).toBe(true);
    expect(buttons.stopButton.disabled).toBe(false);
    expect(buttons.deleteButton.disabled).toBe(true);
    expect(buttons.selectButton.disabled).toBe(true);
  });

  it('enables start button and disables stop button for inactive car in single mode', () => {
    raceState.set({ mode: 'single', activeCarIds: new Set([2]) });
    const buttons = createButtons();
    applyCarButtonsState(1, buttons);

    expect(buttons.startButton.disabled).toBe(false);
    expect(buttons.stopButton.disabled).toBe(true);
    expect(buttons.deleteButton.disabled).toBe(true);
    expect(buttons.selectButton.disabled).toBe(true);
  });

  it('disables all buttons in all mode', () => {
    raceState.set({ mode: 'all' });
    const buttons = createButtons();
    applyCarButtonsState(1, buttons);

    expect(buttons.startButton.disabled).toBe(true);
    expect(buttons.stopButton.disabled).toBe(true);
    expect(buttons.deleteButton.disabled).toBe(true);
    expect(buttons.selectButton.disabled).toBe(true);
  });
});
