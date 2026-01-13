import { baseClasses } from '../base-classes';

export function Link({
  href,
  target = '',
  title = '',
  extraClasses = '',
}: {
  href: string;
  target?: string;
  title?: string;
  extraClasses?: string;
}): HTMLAnchorElement {
  const base = baseClasses['a'];
  const link = document.createElement('a');
  link.className = `${base} ${extraClasses}`.trim();
  link.href = href;
  link.target = target;
  link.title = title;

  return link;
}
