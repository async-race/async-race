import { baseClasses } from '../base-classes';

export function Button<T>({
  textContent,
  disabled = false,
  onClick,
  extraClasses = '',
}: {
  textContent: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent | KeyboardEvent) => Promise<T>;
  extraClasses?: string;
}): HTMLButtonElement {
  const base = baseClasses['button'];
  const button = document.createElement('button');
  button.className = `${base} ${extraClasses}`.trim();
  button.textContent = textContent;
  button.disabled = disabled;
  if (onClick) {
    button.addEventListener('click', (event) => {
      void onClick(event);
    });
  }

  return button;
}
