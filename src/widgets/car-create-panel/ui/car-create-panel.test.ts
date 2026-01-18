import '@/shared/test/mock';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { carPanel } from './car-create-panel';

describe('carPanel', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('should render wrapper with inputs and button', () => {
    const panel = carPanel('create', vi.fn());
    document.body.append(panel.element);

    const modelInput =
      panel.element.querySelector<HTMLInputElement>('#car-model');
    const colorInput =
      panel.element.querySelector<HTMLInputElement>('#car-color');
    const button = panel.element.querySelector<HTMLButtonElement>('button');

    expect(modelInput).toBeTruthy();
    expect(colorInput).toBeTruthy();
    expect(button).toBeTruthy();
    expect(button?.textContent).toBe('CREATE');
  });

  it('should call onSubmit with values when type=create', () => {
    const mockOnSubmit = vi.fn();
    const panel = carPanel('create', mockOnSubmit);
    document.body.append(panel.element);

    const modelInput =
      panel.element.querySelector<HTMLInputElement>('#car-model');
    const colorInput =
      panel.element.querySelector<HTMLInputElement>('#car-color');
    const button = panel.element.querySelector<HTMLButtonElement>('button');

    if (!modelInput || !colorInput || !button) {
      throw new Error('Elements not found');
    }

    modelInput.value = 'Lada';
    colorInput.value = '#ff0000';

    button.click();

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Lada',
      color: '#ff0000',
    });
  });

  it('should call onSubmit with values when type=update', () => {
    const mockOnSubmit = vi.fn();
    const panel = carPanel('update', mockOnSubmit);
    document.body.append(panel.element);

    const modelInput =
      panel.element.querySelector<HTMLInputElement>('#car-model');
    const colorInput =
      panel.element.querySelector<HTMLInputElement>('#car-color');
    const button = panel.element.querySelector<HTMLButtonElement>('button');

    if (!modelInput || !colorInput || !button) {
      throw new Error('Elements not found');
    }

    modelInput.value = 'Audi';
    colorInput.value = '#00ff00';

    button.click();

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: 'Audi',
      color: '#00ff00',
    });
    expect(button.textContent).toBe('UPDATE');
  });

  it('should submit empty values by default', () => {
    const mockOnSubmit = vi.fn();
    const panel = carPanel('create', mockOnSubmit);
    document.body.append(panel.element);

    const button = panel.element.querySelector<HTMLButtonElement>('button');
    if (!button) {
      throw new Error('Button not found');
    }

    button.click();

    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: '',
      color: '#000000',
    });
  });
});
