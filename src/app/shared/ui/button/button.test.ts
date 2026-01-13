import { Button } from './button';
import { describe, expect, it, vi } from 'vitest';

describe('Button component', () => {
  it('creates an instance of button with given text', () => {
    const button = Button({ textContent: 'Press me' });

    expect(button.tagName).toBe('BUTTON');
    expect(button.textContent).toBe('Press me');
  });

  it('adds base Classes', () => {
    const button = Button({ textContent: 'Press me' });

    expect(button.className).toContain('hover:bg-sky-700');
  });

  it('adds extra Classes', () => {
    const button = Button({
      textContent: 'Press me',
      extraClasses: 'shadow-lg',
    });

    expect(button.className).toContain('shadow-lg');
  });

  it('adds disabled', () => {
    const button = Button({ textContent: 'Press me', disabled: true });

    expect(button.disabled).toBe(true);
  });

  it('calls onClick callback function', () => {
    const onClick = vi.fn();
    const button = Button({ textContent: 'Press me', onClick: onClick });

    button.click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
