import { navigate } from '@/app/router/router';
import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { Button } from '@/shared/ui/button/button';

export function createHeader() {
  const header = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex gap-4',
  });

  const garageButton = Button({
    textContent: 'Garage',
    extraClasses: 'bg-sky-400 hover:bg-sky-700',
    onClick: () => {
      navigate('garage');
    },
  });

  const winnerButton = Button({
    textContent: 'Winners',
    extraClasses: 'bg-sky-400 hover:bg-sky-700',
    onClick: () => {
      navigate('winners');
    },
  });

  header.append(garageButton, winnerButton);
  return header;
}
