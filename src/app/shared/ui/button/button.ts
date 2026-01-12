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
  const baseClasses = `
    bg-sky-400 hover:bg-sky-700 
    p-2 
    w-18 sm:w-28 md:w-34
    text-base sm:text-lg md:text-xl 
    text-white 
    rounded-2xl transition-colors duration-300
    flex items-center justify-center
  `;

  const button = document.createElement('button');
  button.className = `${baseClasses} ${extraClasses}`.trim();
  button.textContent = textContent;
  button.disabled = disabled;
  if (onClick) {
    button.addEventListener('click', onClick);
  }

  return button;
}
