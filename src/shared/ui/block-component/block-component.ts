import { baseClasses } from '../base-classes';

export function BlockComponent({
  tagName,
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
