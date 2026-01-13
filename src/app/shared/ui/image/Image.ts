import { baseClasses } from '../base-classes';

export function Image({
  source,
  alt = '',
  extraClasses = '',
}: {
  source: string;
  alt?: string;
  extraClasses?: string;
}): HTMLImageElement {
  const base = baseClasses['img'];
  const image = document.createElement('img');
  image.className = `${base} ${extraClasses}`.trim();
  image.src = source;
  image.alt = alt;

  return image;
}
