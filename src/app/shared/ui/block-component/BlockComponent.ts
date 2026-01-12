import { baseClasses } from '../baseClasses';

export function BlockComponent({
  tagName = 'div',
  extraClasses = '',
  textContent = '',
}: {
  tagName: string;
  extraClasses?: string;
  textContent?: string;
}): HTMLElement {
  const base = baseClasses[tagName];
  const blockComponent = document.createElement(tagName);
  blockComponent.className = `${base} ${extraClasses}`.trim();
  blockComponent.textContent = textContent;

  return blockComponent;
}
