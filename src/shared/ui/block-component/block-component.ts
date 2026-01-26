import { baseClasses } from '../base-classes';

export function BlockComponent({
  tagName,
  extraClasses = '',
  textContent = '',
  onClick,
  children = [],
}: {
  tagName: string;
  extraClasses?: string;
  textContent?: string;
  onClick?: (event: MouseEvent | KeyboardEvent) => void;
  children?: SVGSVGElement[] | HTMLElement[];
}): HTMLElement {
  const base = baseClasses[tagName] ?? '';
  const blockComponent = document.createElement(tagName);
  blockComponent.className = `${base} ${extraClasses}`.trim();

  if (textContent) {
    blockComponent.textContent = textContent;
  }

  if (children.length > 0) {
    blockComponent.append(...children);
  }

  if (onClick) {
    blockComponent.addEventListener('click', onClick);
  }

  return blockComponent;
}
