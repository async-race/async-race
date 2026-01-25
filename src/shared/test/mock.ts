import { vi } from 'vitest';

vi.mock('@/shared', () => ({
  BlockComponent: vi.fn(
    ({
      tagName,
      textContent,
      extraClasses,
    }: {
      tagName: string;
      extraClasses?: string;
      textContent?: string;
    }) => {
      const element = document.createElement(tagName);
      if (textContent) element.textContent = textContent;
      if (extraClasses) element.className = extraClasses;
      return element;
    },
  ),
  carSvg: vi.fn(() => {
    const svg = document.createElement('div');
    svg.dataset.testid = 'car-svg';
    return svg;
  }),
  Button: vi.fn(
    ({
      textContent,
      disabled = false,
      onClick,
    }: {
      textContent: string;
      disabled?: boolean;
      onClick?: (event: MouseEvent | KeyboardEvent) => void;
      extraClasses?: string;
    }) => {
      const button = document.createElement('button');
      button.textContent = textContent;
      button.disabled = disabled;
      if (onClick) button.addEventListener('click', onClick);
      return button;
    },
  ),
  Input: vi.fn(
    ({
      id,
      name,
      type = 'text',
      extraClasses,
    }: {
      type?: string;
      id: string;
      name?: string;
      placeholder?: string;
      extraClasses?: string;
    }) => {
      const input = document.createElement('input');
      input.id = id;
      if (name) input.name = name;
      input.type = type;
      input.value = type === 'color' ? '#000000' : '';
      if (extraClasses) input.className = extraClasses;
      return input;
    },
  ),
}));
