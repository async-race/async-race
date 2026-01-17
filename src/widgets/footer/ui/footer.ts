import { BlockComponent } from '@/shared/ui/block-component/block-component';

export function createFooter() {
  const footer = BlockComponent({
    tagName: 'div',
    extraClasses: 'flex gap-4',
    textContent: '2026',
  });

  return footer;
}
