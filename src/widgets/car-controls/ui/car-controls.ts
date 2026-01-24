import { BlockComponent, Button } from '@/shared';
import type { CarControlsProps } from '../model/types';

export function createCarControls({
  onEdit,
  onDelete,
  onStart,
  onStop,
}: CarControlsProps) {
  const widgetContainer = BlockComponent({
    tagName: 'div',
    extraClasses: 'grid grid-cols-2 gap-2 w-42',
  });

  const selectButton = Button({ textContent: 'Edit', onClick: onEdit });
  const deleteButton = Button({ textContent: 'Delete', onClick: onDelete });
  const startButton = Button({ textContent: 'Start', onClick: onStart });
  const stopButton = Button({
    textContent: 'Stop',
    onClick: onStop,
    disabled: true,
  });
  widgetContainer.append(selectButton, startButton, deleteButton, stopButton);
  return {
    widgetContainer,
    buttons: { selectButton, deleteButton, startButton, stopButton },
  };
}
