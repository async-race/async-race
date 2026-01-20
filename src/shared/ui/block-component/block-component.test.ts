import { BlockComponent } from './block-component';
import { describe, expect, it, vi } from 'vitest';

describe('BlockComponent', () => {
  it('creates an instance of BlockComponent with given tag', () => {
    const element = BlockComponent({ tagName: 'div' });

    expect(element.tagName.toLowerCase()).toBe('div');
  });

  it('adds base style', () => {
    const element = BlockComponent({ tagName: 'h1' });

    expect(element.className).toContain('md:text-4xl');
  });

  it('adds extraClasses', () => {
    const element = BlockComponent({ tagName: 'p', extraClasses: 'custom' });

    expect(element.className).toContain('custom');
  });

  it('adds given textContent', () => {
    const element = BlockComponent({
      tagName: 'h2',
      textContent: 'async-race',
    });

    expect(element.textContent).toBe('async-race');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    const element = BlockComponent({
      tagName: 'button',
      textContent: 'Click me',
      onClick: handleClick,
    });

    element.click();

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
