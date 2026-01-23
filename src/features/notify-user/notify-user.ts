import { BlockComponent } from '@/shared/ui/block-component/block-component';

export function notifyUser(message: string, duration = 3000): HTMLSpanElement {
  const notifier = BlockComponent({
    tagName: 'span',
    textContent: message,
    extraClasses:
      'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-3 rounded-lg shadow-lg z-50',
  });

  document.body.append(notifier);
  requestAnimationFrame(() => {
    notifier.classList.add('opacity-100');
  });
  setTimeout(() => {
    notifier.classList.remove('opacity-100');
    setTimeout(() => {
      notifier.remove();
    }, 300);
  }, duration);

  return notifier;
}
