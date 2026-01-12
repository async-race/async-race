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
  const baseClasses = 'button-base';

  const button = document.createElement('button');
  button.className = `${baseClasses} ${extraClasses}`.trim();
  button.textContent = textContent;
  button.disabled = disabled;
  if (onClick) {
    button.addEventListener('click', onClick);
  }

  return button;
}
