import { describe, it, expect, vi } from 'vitest';
import { raceControls } from './race-controls';
import type { RaceControlProps } from '../model/types';

describe('raceControls', () => {
  it('should return a container with three buttons', () => {
    const raceControlProperties: RaceControlProps = {
      onGenerate: vi.fn(),
      onReset: vi.fn(),
      onStartRace: vi.fn(),
    };

    const controlsContainer: HTMLElement = raceControls(raceControlProperties);

    expect(controlsContainer).toBeInstanceOf(HTMLElement);
    expect(controlsContainer.querySelectorAll('button')).toHaveLength(3);

    const buttonElements: NodeListOf<HTMLButtonElement> =
      controlsContainer.querySelectorAll('button');

    expect(buttonElements[0].textContent).toBe('race');
    expect(buttonElements[1].textContent).toBe('reset');
    expect(buttonElements[2].textContent).toBe('generate cars');
  });

  it('should call onStartRace when clicking the "race" button', () => {
    const raceControlProperties: RaceControlProps = {
      onGenerate: vi.fn(),
      onReset: vi.fn(),
      onStartRace: vi.fn(),
    };

    const controlsContainer: HTMLElement = raceControls(raceControlProperties);
    const buttonStartRace: HTMLButtonElement | null =
      controlsContainer.querySelector('button:first-child');

    expect(buttonStartRace).not.toBeNull();
    buttonStartRace?.click();

    expect(raceControlProperties.onStartRace).toHaveBeenCalledTimes(1);
  });

  it('should call onReset when clicking the "reset" button', () => {
    const raceControlProperties: RaceControlProps = {
      onGenerate: vi.fn(),
      onReset: vi.fn(),
      onStartRace: vi.fn(),
    };

    const controlsContainer: HTMLElement = raceControls(raceControlProperties);
    const buttonResetRace: HTMLButtonElement | null =
      controlsContainer.querySelectorAll('button')[1];

    expect(buttonResetRace).not.toBeNull();
    buttonResetRace.click();

    expect(raceControlProperties.onReset).toHaveBeenCalledTimes(1);
  });

  it('should call onGenerate when clicking the "generate cars" button', () => {
    const raceControlProperties: RaceControlProps = {
      onGenerate: vi.fn(),
      onReset: vi.fn(),
      onStartRace: vi.fn(),
    };

    const controlsContainer: HTMLElement = raceControls(raceControlProperties);
    const buttonGenerateCars: HTMLButtonElement | null =
      controlsContainer.querySelectorAll('button')[2];

    expect(buttonGenerateCars).not.toBeNull();
    buttonGenerateCars.click();

    expect(raceControlProperties.onGenerate).toHaveBeenCalledTimes(1);
  });
});
