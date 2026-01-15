import { describe, it, expect, vi } from 'vitest';
import { carPanel } from './car-create-panel';

describe('carPanel', () => {
  it('should render wrapper with inputs and button', () => {
    const panel = carPanel('create', vi.fn());

    expect(panel).toBeInstanceOf(HTMLElement);

    const modelInput = panel.querySelector<HTMLInputElement>('#car-model');
    const colorInput = panel.querySelector<HTMLInputElement>('#car-color');
    const button = panel.querySelector<HTMLButtonElement>('button');

    expect(modelInput).toBeTruthy();
    expect(colorInput).toBeTruthy();
    expect(button).toBeTruthy();
    expect(button?.textContent).toBe('create');
  });

  it('should call onSubmit with values when type=create', () => {
    const mockOnSubmit = vi.fn();
    const panel = carPanel('create', mockOnSubmit);

    const modelInput = panel.querySelector<HTMLInputElement>('#car-model');
    const colorInput = panel.querySelector<HTMLInputElement>('#car-color');
    const button = panel.querySelector<HTMLButtonElement>('button');

    if (modelInput) modelInput.value = 'Lada';
    if (colorInput) colorInput.value = '#ff0000';

    button?.click();

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Lada',
      color: '#ff0000',
    });
  });

  it('should call onSubmit with values when type=update', () => {
    const mockOnSubmit = vi.fn();
    const panel = carPanel('update', mockOnSubmit);

    const modelInput = panel.querySelector<HTMLInputElement>('#car-model');
    const colorInput = panel.querySelector<HTMLInputElement>('#car-color');
    const button = panel.querySelector<HTMLButtonElement>('button');

    if (modelInput) modelInput.value = 'Audi';
    if (colorInput) colorInput.value = '#00ff00';

    button?.click();

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Audi',
      color: '#00ff00',
    });
    expect(button?.textContent).toBe('update');
  });

  it('should submit empty strings if inputs are not filled', () => {
    const mockOnSubmit = vi.fn();
    const panel = carPanel('create', mockOnSubmit);

    const button = panel.querySelector<HTMLButtonElement>('button');
    button?.click();

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: '',
      color: '#000000',
    });
  });
});
