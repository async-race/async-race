import '@/shared/test/mock';
import { describe, it, expect } from 'vitest';
import { createFooter } from './footer';
import { BlockComponent } from '@/shared';

describe('createFooter', () => {
  it('should create a footer element using BlockComponent', () => {
    const footer = createFooter();

    expect(BlockComponent).toHaveBeenCalledWith({
      tagName: 'p',
      extraClasses: 'font-bold p-1 pl-4',
    });
    expect(footer.tagName.toLowerCase()).toBe('p');
  });

  it('should append a link with correct href, text and classes', () => {
    const footer = createFooter();
    const link = footer.querySelector('a');

    expect(link).toBeTruthy();
    expect(link?.href).toBe('https://github.com/async-race/async-race');
    expect(link?.textContent).toBe('Developed by Team .by in 2026');
  });
});
