import { Button } from './Button';
import { describe, expect, it, vi } from 'vitest';

describe('Button component', () => {
  it('creates an instance of button with given text', () => {
    const btn = Button({ textContent: 'Press me' });

    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent).toBe('Press me');
  });

  it('adds base Classes', () => {
    const btn = Button({ textContent: 'Press me' });

    expect(btn.className).toContain('button-base');
  });

  it('adds extra Classes', () => {
    const btn = Button({ textContent: 'Press me', extraClasses: 'shadow-lg' });

    expect(btn.className).toContain('shadow-lg');
  });

  it('adds disabled', () => {
    const btn = Button({ textContent: 'Press me', disabled: true });

    expect(btn.disabled).toBe(true);
  });

  it('calls onClick callback function', () => {
    const onClick = vi.fn();
    const btn = Button({ textContent: 'Press me', onClick: onClick });

    btn.click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
