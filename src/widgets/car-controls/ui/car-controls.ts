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
    extraClasses:
      'h-7 px-3 p-1 bg-indigo-700 hover:bg-indigo-900 text-white hover:bg-sky-800',
    onClick: onEdit,
  });
  const deleteButton = Button({
    textContent: 'Delete',
    extraClasses: 'h-7 px-3 p-1 bg-gray-800 text-white hover:bg-black',
    onClick: onDelete,
  });
  const startButton = Button({
    textContent: 'Start',
    extraClasses:
      'h-7 px-3 p-1 bg-teal-700 hover:bg-teal-900 text-white hover:bg-green-800',
    onClick: onStart,
  });
  const stopButton = Button({
    textContent: 'Stop',
    extraClasses: 'h-7 px-3 p-1 bg-red-600 text-white hover:bg-red-800',
    onClick: onStop,
    disabled: true,
  });
  widgetContainer.append(selectButton, startButton, deleteButton, stopButton);
  return {
    widgetContainer,
    buttons: { selectButton, deleteButton, startButton, stopButton },
  };
}
