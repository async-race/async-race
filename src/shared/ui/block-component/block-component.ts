import { baseClasses } from '../base-classes';

export function BlockComponent({
  tagName,
  extraClasses = '',
  textContent = '',
  onClick,
}: {
  tagName: string;
  extraClasses?: string;
  textContent?: string;
  onClick?: (event: MouseEvent | KeyboardEvent) => void;
}): HTMLElement {
  const base = baseClasses[tagName];
  const blockComponent = document.createElement(tagName);
  blockComponent.className = `${base} ${extraClasses}`.trim();
  blockComponent.textContent = textContent;
  if (onClick) {
    blockComponent.addEventListener('click', onClick);
  }

  return blockComponent;
}
