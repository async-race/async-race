import { baseClasses } from '../baseClasses';

export function Image({
  src = '',
  alt = '',
  extraClasses = '',
}: {
  src: string;
  alt?: string;
  extraClasses?: string;
}): HTMLImageElement {
  const base = baseClasses['img'];
  const image = document.createElement('img');
  image.className = `${base} ${extraClasses}`.trim();
  image.src = src;
  image.alt = alt;

  return image;
}
