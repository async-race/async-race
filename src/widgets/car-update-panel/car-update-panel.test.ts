import { describe, it, expect, vi } from 'vitest';
import { CarUpdatePanel } from './car-update-panel';
import { CarCreatePanel } from '../car-create-panel/car-create-panel';
import * as CarUpdateFeature from '../../features/car-update/car-update';
import * as CarCreateFeature from '../../features/car-create/car-create';
import * as userNotification from '../../features/notify-user/notify-user';

describe('CarUpdatePanel Component', () => {
  it('should render form wrapper with inputs and button', () => {
    const panel = CarUpdatePanel();

    expect(panel).toBeInstanceOf(HTMLElement);
    expect(panel.querySelector('.car-model-input-update')).toBeTruthy();
    expect(panel.querySelector('.car-color-input-update')).toBeTruthy();
    expect(panel.querySelector('.button-update')).toBeTruthy();
  });

  it('should call handleUpdate and propagate error', async () => {
    const mockHandleUpdate = vi
      .fn()
      .mockRejectedValue(new Error('Updating a car error!'));
    vi.spyOn(CarUpdateFeature, 'CarUpdate').mockReturnValue({
      handleUpdate: mockHandleUpdate,
    });

    const panel = CarUpdatePanel();
    const buttonUpdate =
      panel.querySelector<HTMLButtonElement>('.button-update');

    buttonUpdate?.click();

    await vi.waitFor(() => {
      expect(mockHandleUpdate).toHaveBeenCalled();
    });

    await expect(mockHandleUpdate.mock.results[0].value).rejects.toThrow(
      'Updating a car error!',
    );
  });

  it('should handle success and update car', async () => {
    const mockHandleCreate = vi
      .fn()
      .mockResolvedValue({ data: { name: 'BMV', color: '#ff0000' } });
    vi.spyOn(CarCreateFeature, 'CarCreate').mockReturnValue({
      handleCreate: mockHandleCreate,
    });

    const panel1 = CarCreatePanel();
    const modelInput1 = panel1.querySelector<HTMLInputElement>(
      '.car-model-input-create',
    );
    const colorInput1 = panel1.querySelector<HTMLInputElement>(
      '.car-color-input-create',
    );
    const buttonCreate =
      panel1.querySelector<HTMLButtonElement>('.button-create');

    if (modelInput1) {
      modelInput1.value = 'BMV';
    }
    if (colorInput1) {
      colorInput1.value = '#ff0000';
    }

    buttonCreate?.click();

    await vi.waitFor(() => {
      expect(mockHandleCreate).toHaveBeenCalledWith('BMV', '#ff0000');
    });

    await expect(mockHandleCreate.mock.results[0].value).resolves.toEqual({
      data: { name: 'BMV', color: '#ff0000' },
    });

    const mockHandleUpdate = vi
      .fn()
      .mockResolvedValue({ id: 1, name: 'lada', color: '#000000' });
    vi.spyOn(CarUpdateFeature, 'CarUpdate').mockReturnValue({
      handleUpdate: mockHandleUpdate,
    });

    const panel2 = CarUpdatePanel();
    const modelInput2 = panel2.querySelector<HTMLInputElement>(
      '.car-model-input-update',
    );
    const colorInput2 = panel2.querySelector<HTMLInputElement>(
      '.car-color-input-update',
    );
    const buttonUpdate =
      panel2.querySelector<HTMLButtonElement>('.button-update');

    if (modelInput2) {
      modelInput2.value = 'lada';
    }
    if (colorInput2) {
      colorInput2.value = '#000000';
    }

    buttonUpdate?.click();

    await vi.waitFor(() => {
      expect(mockHandleUpdate).toHaveBeenCalledWith(1, 'lada', '#000000');
    });

    await expect(mockHandleUpdate.mock.results[0].value).resolves.toEqual({
      id: 1,
      name: 'lada',
      color: '#000000',
    });
  });

  it('should show unknown error alert when non-Error thrown', async () => {
    const mockHandleUpdate = vi.fn().mockRejectedValue('bad');
    vi.spyOn(CarUpdateFeature, 'CarUpdate').mockReturnValue({
      handleUpdate: mockHandleUpdate,
    });

    const notifyMock = vi.spyOn(userNotification, 'notifyUser');
    const panel = CarUpdatePanel();
    const buttonUpdate =
      panel.querySelector<HTMLButtonElement>('.button-update');

    buttonUpdate?.click();

    await vi.waitFor(() => {
      expect(notifyMock).toHaveBeenCalledWith(
        "The car wasn't updated! Unknown error",
      );
    });
  });
});
