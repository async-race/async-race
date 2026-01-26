import '@/shared/test/mock';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createCarControls } from './car-controls';
import { BlockComponent, Button } from '@/shared';

describe('createCarControls', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a widget container using BlockComponent', () => {
    const controls = createCarControls({
      onEdit: () => {},
      onDelete: () => {},
      onStart: () => {},
      onStop: () => {},
    });

    expect(BlockComponent).toHaveBeenCalledWith({
      tagName: 'div',
      extraClasses: 'grid grid-cols-2 gap-1 w-42',
    });
    expect(controls.widgetContainer.tagName.toLowerCase()).toBe('div');
  });

  it('should create buttons with correct props and disabled state', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    const onStart = vi.fn();
    const onStop = vi.fn();

    const controls = createCarControls({ onEdit, onDelete, onStart, onStop });

    const { buttons } = controls;

    expect(Button).toHaveBeenCalledTimes(4);

    expect(buttons.selectButton.textContent).toBe('Edit');
    expect(buttons.deleteButton.textContent).toBe('Delete');
    expect(buttons.startButton.textContent).toBe('Start');
    expect(buttons.stopButton.textContent).toBe('Stop');

    expect(buttons.stopButton.disabled).toBe(true);

    buttons.selectButton.click();
    buttons.deleteButton.click();
    buttons.startButton.click();

    expect(onEdit).toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalled();
    expect(onStart).toHaveBeenCalled();
  });
});
