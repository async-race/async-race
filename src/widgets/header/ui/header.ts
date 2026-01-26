import { navigate } from '@/app/router/router';
import { BlockComponent, Button } from '@/shared';

export function createHeader() {
  const header = BlockComponent({
    tagName: 'header',
    extraClasses: 'flex gap-4 p-4',
  });

  const garageButton = Button({
    textContent: 'Garage',
    extraClasses:
      'h-8 bg-indigo-700 hover:bg-indigo-900 text-white font-semibold text-sm',
    onClick: () => {
      navigate('garage');
    },
  });

  const winnerButton = Button({
    textContent: 'Winners',
    extraClasses:
      'h-8 px-3 bg-indigo-700 hover:bg-indigo-900 text-white font-semibold text-sm',
    onClick: () => {
      navigate('winners');
    },
  });

  header.append(garageButton, winnerButton);
  return header;
}
