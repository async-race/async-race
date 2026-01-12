import { baseClasses } from '../baseClasses';

export function Button({
  textContent,
  disabled = false,
  onClick,
  extraClasses = '',
}: {
  textContent: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent | KeyboardEvent) => void;
  extraClasses?: string;
}): HTMLButtonElement {
  const base = baseClasses['button'];
  const button = document.createElement('button');
  button.className = `${base} ${extraClasses}`.trim();
  button.textContent = textContent;
  button.disabled = disabled;
  if (onClick) {
    button.addEventListener('click', onClick);
  }

  return button;
}
