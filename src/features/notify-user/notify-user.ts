import { BlockComponent } from '@/shared/ui/block-component/block-component';

export function notifyUser(message: string, duration = 3000): HTMLSpanElement {
  const notifier = BlockComponent({
    tagName: 'span',
    textContent: message,
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
