export function Input({
  type = 'text',
  id,
  name,
  placeholder,
  extraClasses = '',
}: {
  type?: string;
  id: string;
  name?: string;
  placeholder?: string;
  extraClasses?: string;
}): HTMLInputElement {
  const baseClasses = 'input-base';
  const input = document.createElement('input');
  input.className = `${baseClasses} ${extraClasses}`.trim();
  input.id = id;
  if (name) input.name = name;
  if (placeholder) input.placeholder = placeholder;
  input.type = type;

  return input;
}
