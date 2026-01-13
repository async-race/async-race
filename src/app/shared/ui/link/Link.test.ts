import { Link } from './Link';
import { describe, expect, it } from 'vitest';

describe('Link component', () => {
  it('create an instance of link with given url', () => {
    const link = Link({ href: '/home' });

    expect(link.href).toContain('/home');
    expect(link.tagName.toLowerCase()).toBe('a');
  });

  it('adds target attribute', () => {
    const link = Link({ href: '/home', target: '_blank' });

    expect(link.target).toContain('_blank');
  });

  it('adds base Classes', () => {
    const link = Link({ href: '/home' });

    expect(link.className).toContain('text-white');
  });

  it('adds extra Classes', () => {
    const link = Link({ href: '/home', extraClasses: 'custom' });

    expect(link.className).toContain('custom');
  });

  it('adds title attribute', () => {
    const link = Link({ href: '/home', title: 'navigate to home page' });

    expect(link.title).toContain('navigate to home page');
  });
});
