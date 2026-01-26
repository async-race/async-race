import { baseClasses } from '../base-classes';

export function Input({
  type = 'text',
  id,
  name,
  placeholder,
  extraClasses = '',
  ariaLabel,
}: {
  type?: string;
  id: string;
  name?: string;
  placeholder?: string;
  extraClasses?: string;
  ariaLabel: string;
}): HTMLInputElement {
  const base = baseClasses['input'];
  const input = document.createElement('input');
  input.className = `${base} ${extraClasses}`.trim();
  input.id = id;
  if (name) input.name = name;
  if (placeholder) input.placeholder = placeholder;
  input.type = type;
  input.setAttribute('aria-label', ariaLabel);

  return input;
}
