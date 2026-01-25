import { navigate } from '@/app/router/router';
import { BlockComponent, Button } from '@/shared';

export function createHeader() {
  const header = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex gap-4 pb-0',
  });

  const garageButton = Button({
    textContent: 'Garage',
    extraClasses: 'h-8 px-3 bg-sky-400 hover:bg-sky-700 text-sm',
    onClick: () => {
      navigate('garage');
    },
  });

  const winnerButton = Button({
    textContent: 'Winners',
    extraClasses: 'h-8 px-3 bg-sky-400 hover:bg-sky-700 text-sm',
    onClick: () => {
      navigate('winners');
    },
  });

  header.append(garageButton, winnerButton);
  return header;
}
