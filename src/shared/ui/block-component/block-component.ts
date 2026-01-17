import { baseClasses } from '../base-classes';

export function BlockComponent({
  tagName,
  extraClasses = '',
  textContent = '',
  id = '',
}: {
  tagName: string;
  extraClasses?: string;
  textContent?: string;
  id?: string;
}): HTMLElement {
  const base = baseClasses[tagName];
  const blockComponent = document.createElement(tagName);
  blockComponent.className = `${base} ${extraClasses}`.trim();
  blockComponent.textContent = textContent;
  blockComponent.id = id;

  return blockComponent;
}
