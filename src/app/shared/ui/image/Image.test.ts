import { Image } from './Image';
import { describe, expect, it } from 'vitest';

describe('Image Component', () => {
  it('creates an instance with given src', () => {
    const image = Image({ src: 'img_girl.jpg' });

    expect(image.tagName.toLowerCase()).toBe('img');
    expect(image.src).toContain('img_girl.jpg');
  });

  it('adds alt attribute', () => {
    const image = Image({ src: 'img_girl.jpg', alt: 'a girl on the bench' });

    expect(image.alt).toContain('a girl on the bench');
  });

  it('adds base Classes', () => {
    const image = Image({ src: 'img_girl.jpg' });

    expect(image.className).toContain('object-cover');
  });

  it('adds extra Classes', () => {
    const image = Image({ src: 'img_girl.jpg', extraClasses: 'custom' });

    expect(image.className).toContain('custom');
  });
});
