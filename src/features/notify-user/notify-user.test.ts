import { notifyUser } from './notify-user';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('notifyUser function', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates an instance with provided styles', () => {
    const notifier = notifyUser('your message');

    expect(notifier).toBeInstanceOf(HTMLSpanElement);
    expect(notifier.textContent).toBe('your message');
  });

  it('should execute after advancing timers ', () => {
    const spy = vi.spyOn(globalThis, 'setTimeout');
    notifyUser('your message');
    vi.advanceTimersByTime(3000);

    expect(spy).toHaveBeenCalledWith(expect.any(Function), 3000);

    vi.advanceTimersByTime(300);

    expect(spy).toHaveBeenCalledWith(expect.any(Function), 300);
    expect(spy).toHaveBeenCalledTimes(2);
  });
});
