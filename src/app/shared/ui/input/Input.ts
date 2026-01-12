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
  const baseClasses = `
  w-full sm:w-1/2 md:w-1/3 px-3 py-2
  border rounded-md shadow-sm
  text-sm
  focus:outline-none focus:ring-2 focus:ring-blue-400
  hover:shadow-md
  bg-gray-50
  sm:text-base sm:px-4 sm:py-2
  md:text-lg md:px-5 md:py-3
  `;

  const input = document.createElement('input');
  input.className = `${baseClasses} ${extraClasses}`.trim();
  input.id = id;
  if (name) input.name = name;
  if (placeholder) input.placeholder = placeholder;
  input.type = type;

  return input;
}
