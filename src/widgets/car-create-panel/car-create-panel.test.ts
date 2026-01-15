import { CarCreatePanel } from './car-create-panel';
import { describe, it, expect, vi } from 'vitest';
import * as CarCreateFeature from '../../features/car-create/car-create';
import * as userNotification from '../../features/notify-user/notify-user';

describe('CarCreatePanel Component', () => {
  it('should render form wrapper with inputs and button', () => {
    const panel = CarCreatePanel();

    expect(panel).toBeInstanceOf(HTMLElement);
    expect(panel.querySelector('.car-model-input-create')).toBeTruthy();
    expect(panel.querySelector('.car-color-input-create')).toBeTruthy();
    expect(panel.querySelector('.button-create')).toBeTruthy();
  });

  it('should call handleCreate and propagate error', async () => {
    const mockHandleCreate = vi
      .fn()
      .mockRejectedValue(new Error('Creating a car error!'));
    vi.spyOn(CarCreateFeature, 'CarCreate').mockReturnValue({
      handleCreate: mockHandleCreate,
    });

    const panel = CarCreatePanel();
    const buttonCreate =
      panel.querySelector<HTMLButtonElement>('.button-create');

    buttonCreate?.click();

    await vi.waitFor(() => {
      expect(mockHandleCreate).toHaveBeenCalled();
    });

    await expect(mockHandleCreate.mock.results[0].value).rejects.toThrow(
      'Creating a car error!',
    );
  });

  it('should handle success and resolve car', async () => {
    const mockHandleCreate = vi
      .fn()
      .mockResolvedValue({ data: { name: 'BMV', color: '#ff0000' } });
    vi.spyOn(CarCreateFeature, 'CarCreate').mockReturnValue({
      handleCreate: mockHandleCreate,
    });

    const panel = CarCreatePanel();
    const modelInput = panel.querySelector<HTMLInputElement>(
      '.car-model-input-create',
    );
    const colorInput = panel.querySelector<HTMLInputElement>(
      '.car-color-input-create',
    );
    const buttonCreate =
      panel.querySelector<HTMLButtonElement>('.button-create');

    if (modelInput) {
      modelInput.value = 'BMV';
    }
    if (colorInput) {
      colorInput.value = '#ff0000';
    }

    buttonCreate?.click();

    await vi.waitFor(() => {
      expect(mockHandleCreate).toHaveBeenCalledWith('BMV', '#ff0000');
    });

    await expect(mockHandleCreate.mock.results[0].value).resolves.toEqual({
      data: { name: 'BMV', color: '#ff0000' },
    });
  });

  it('should show unknown error alert when non-Error thrown', async () => {
    const mockHandleCreate = vi.fn().mockRejectedValue('bad');
    vi.spyOn(CarCreateFeature, 'CarCreate').mockReturnValue({
      handleCreate: mockHandleCreate,
    });

    const notifyMock = vi.spyOn(userNotification, 'notifyUser');
    const panel = CarCreatePanel();
    const buttonCreate =
      panel.querySelector<HTMLButtonElement>('.button-create');

    buttonCreate?.click();

    await vi.waitFor(() => {
      expect(notifyMock).toHaveBeenCalledWith(
        "The car wasn't created! Unknown error",
      );
    });
  });
});
