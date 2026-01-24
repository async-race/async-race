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
    extraClasses: 'grid grid-cols-2 gap-1 w-42',
  });

  const selectButton = Button({
    textContent: 'Edit',
    extraClasses: 'h-7 px-3 p-1 bg-sky-400 hover:bg-sky-700',
    onClick: onEdit,
  });
  const deleteButton = Button({
    textContent: 'Delete',
    extraClasses: 'h-7 px-3 p-1 bg-gray-700 hover:bg-black',
    onClick: onDelete,
  });
  const startButton = Button({
    textContent: 'Start',
    extraClasses: 'h-7 px-3 p-1 bg-green-500 hover:bg-green-700',
    onClick: onStart,
  });
  const stopButton = Button({
    textContent: 'Stop',
    extraClasses: 'h-7 px-3 p-1 bg-red-500 hover:bg-red-700',
    onClick: onStop,
    disabled: true,
  });
  widgetContainer.append(selectButton, startButton, deleteButton, stopButton);
  return {
    widgetContainer,
    buttons: { selectButton, deleteButton, startButton, stopButton },
  };
}
