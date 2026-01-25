import { BlockComponent } from '@/shared/ui/block-component/block-component';

export function createFooter() {
  const footer = BlockComponent({
    tagName: 'p',
    extraClasses: 'font-bold p-1 pl-4',
  });
  const link = document.createElement('a');
  link.href = 'https://github.com/async-race/async-race';
  link.textContent = 'Developed by Team .by in 2026';
  link.className = 'text-blue-800 hover:text-blue-900 font-semibold underline';
  footer.append(link);

  return footer;
}
