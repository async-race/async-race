export function BlockComponent({
  tagName = 'div',
  extraClasses = '',
  textContent = '',
}: {
  tagName: string;
  extraClasses?: string;
  textContent?: string;
}): HTMLElement {
  const baseClasses = `${tagName}-base`;
  const blockComponent = document.createElement(tagName);
  blockComponent.className = `${baseClasses} ${extraClasses}`.trim();
  blockComponent.textContent = textContent;

  return blockComponent;
}
