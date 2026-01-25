import '@/shared/test/mock';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initGarageControls } from './controls';
import { BlockComponent } from '@/shared';
import { carPanel } from '@/widgets';
import { cars as carsAPI } from '@/features';
import type { UpdateCarDto } from '@/entities';

type CarPanelControl =
  | {
      type: 'create';
      onSubmit: (data: UpdateCarDto) => void;
      setDisabled: (value: boolean) => void;
    }
  | {
      type: 'update';
      onSubmit: (data: UpdateCarDto) => void;
      setDisabled: (value: boolean) => void;
    };

vi.mock('@/widgets', () => ({
  carPanel: vi.fn(
    (
      type: 'create' | 'update',
      onSubmit: ({ name, color }: UpdateCarDto) => void,
    ) => {
      return {
        element: document.createElement('div'),
        setDisabled: vi.fn(),
        setValues: vi.fn(),
        type,
        onSubmit,
      };
    },
  ),
}));

vi.mock('@/features', () => ({
  cars: {
    createCar: vi.fn(),
    updateCar: vi.fn(),
  },
}));

describe('initGarageControls', () => {
  let getSelectedCarId: () => number | null;

  beforeEach(() => {
    vi.clearAllMocks();
    getSelectedCarId = vi.fn(() => 1);
  });

  it('should create container using BlockComponent', () => {
    const controls = initGarageControls(getSelectedCarId);

    expect(BlockComponent).toHaveBeenCalledWith({
      tagName: 'div',
      extraClasses: 'flex flex-col justify-center items-center',
    });
    expect(controls.element.tagName.toLowerCase()).toBe('div');
  });

  it('should initialize create and update controls', () => {
    const controls = initGarageControls(getSelectedCarId);

    expect(carPanel).toHaveBeenCalledWith('create', expect.any(Function));
    expect(carPanel).toHaveBeenCalledWith('update', expect.any(Function));

    expect(controls.setEditDisabled).toBeTypeOf('function');
    expect(controls.setAddDisabled).toBeTypeOf('function');
    expect(controls.setEditValues).toBeTypeOf('function');
  });

  it('should call createCar when create callback is triggered', () => {
    initGarageControls(getSelectedCarId);

    const mockedCarPanel = vi.mocked(carPanel);

    const createControl = mockedCarPanel.mock.results
      .map((result) => result.value as CarPanelControl)
      .find(
        (
          control,
        ): control is {
          type: 'create';
          onSubmit: (data: UpdateCarDto) => void;
          setDisabled: (value: boolean) => void;
        } => control.type === 'create',
      );

    if (!createControl) throw new Error('Create control not found');

    createControl.onSubmit({ name: 'Car1', color: '#fff' });

    expect(carsAPI.createCar).toHaveBeenCalledWith({
      name: 'Car1',
      color: '#fff',
    });
  });

  it('should call updateCar when update callback is triggered and a car is selected', () => {
    initGarageControls(getSelectedCarId);

    const mockedCarPanel = vi.mocked(carPanel);

    const updateControl = mockedCarPanel.mock.results
      .map((result) => result.value as CarPanelControl)
      .find(
        (
          control,
        ): control is {
          type: 'update';
          onSubmit: (data: UpdateCarDto) => void;
          setDisabled: (value: boolean) => void;
        } => control.type === 'update',
      );

    if (!updateControl) throw new Error('Update control not found');

    updateControl.onSubmit({ name: 'Car2', color: '#000' });

    expect(carsAPI.updateCar).toHaveBeenCalledWith(1, {
      name: 'Car2',
      color: '#000',
    });
    expect(updateControl.setDisabled).toHaveBeenCalledWith(true);
  });

  it('should not call updateCar if no car is selected', () => {
    getSelectedCarId = vi.fn(() => null);
    initGarageControls(getSelectedCarId);

    const mockedCarPanel = vi.mocked(carPanel);

    const updateControl = mockedCarPanel.mock.results
      .map((result) => result.value as CarPanelControl)
      .find(
        (
          control,
        ): control is {
          type: 'update';
          onSubmit: (data: UpdateCarDto) => void;
          setDisabled: (value: boolean) => void;
        } => control.type === 'update',
      );

    if (!updateControl) throw new Error('Update control not found');

    updateControl.onSubmit({ name: 'Car3', color: '#123' });

    expect(carsAPI.updateCar).not.toHaveBeenCalled();
    expect(updateControl.setDisabled).toHaveBeenCalledWith(true);
  });
});
