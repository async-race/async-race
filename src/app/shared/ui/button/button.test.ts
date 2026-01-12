import { Button } from './Button';
import { describe, expect, it, vi } from 'vitest';

describe('Button component', () => {
  it('creates an instance of button with given text', () => {
    const btn = Button('Press me', false, vi.fn());

    expect(btn.tagName).toBe('BUTTON');
    expect(btn.textContent).toBe('Press me');
  });

  it('adds base Classes', () => {
    const btn = Button('Press me', false, vi.fn());

    expect(btn.className).toContain('bg-sky-400');
    expect(btn.className).toContain('rounded-2xl');
  });

  it('adds extra Classes', () => {
    const btn = Button('Press me', false, vi.fn(), 'shadow-lg');

    expect(btn.className).toContain('shadow-lg');
  });

  it('adds disabled', () => {
    const btn = Button('Press me', true, vi.fn());

    expect(btn.disabled).toBe(true);
  });

  it('calls onClick callback function', () => {
    const onClick = vi.fn();
    const btn = Button('Press me', false, onClick);

    btn.click();

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
