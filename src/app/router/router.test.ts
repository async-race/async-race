import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createRouter, initRouter, navigate as globalNavigate } from './router';
import type { PageInstance } from '@/pages/model/types';
import type { RouteName } from './model/routes';
import { normalizeLocation, syncUrl } from './lib';

vi.mock('./lib', () => ({
  normalizeLocation: vi.fn(() => 'garage'),
  syncUrl: vi.fn(),
}));

describe('router', () => {
  let root: HTMLElement;
  let onPageChange: ReturnType<typeof vi.fn> &
    ((route: RouteName) => PageInstance);
  let pageMock: PageInstance;

  beforeEach(() => {
    root = document.createElement('div');
    pageMock = {
      element: document.createElement('div'),
      show: vi.fn(),
      hide: vi.fn(),
    };

    onPageChange = vi.fn(() => pageMock);
    vi.spyOn(globalThis.history, 'pushState').mockImplementation(() => {});
    vi.spyOn(globalThis, 'addEventListener').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('global navigate should throw if router not initialized', () => {
    expect(() => {
      globalNavigate('garage');
    }).toThrow('Router is not initialized');
  });

  it('should create router with navigate and start methods', () => {
    const router = createRouter(root, onPageChange);
    expect(typeof router.navigate).toBe('function');
    expect(typeof router.start).toBe('function');
  });

  it('should navigate to a new route and append page element', () => {
    const router = createRouter(root, onPageChange);

    router.navigate('garage');

    expect(onPageChange).toHaveBeenCalledWith('garage');
    expect(root.children).toContain(pageMock.element);
    expect(pageMock.show).toHaveBeenCalled();
    expect(pageMock.hide).toHaveBeenCalledTimes(1);
  });

  it('should hide previous page when navigating to another route', () => {
    const router = createRouter(root, onPageChange);
    const pageMock2: PageInstance = {
      element: document.createElement('div'),
      show: vi.fn(),
      hide: vi.fn(),
    };
    onPageChange.mockReturnValueOnce(pageMock).mockReturnValueOnce(pageMock2);

    router.navigate('garage');
    router.navigate('winners');

    expect(pageMock.hide).toHaveBeenCalled();
    expect(pageMock2.show).toHaveBeenCalled();
  });

  it('start should show current route and listen to popstate', () => {
    const router = createRouter(root, onPageChange);

    router.start();

    expect(normalizeLocation).toHaveBeenCalled();
    expect(syncUrl).toHaveBeenCalledWith('garage');
    expect(onPageChange).toHaveBeenCalledWith('garage');
  });

  it('initRouter and global navigate should work', () => {
    const router = createRouter(root, onPageChange);
    initRouter(router);

    globalNavigate('garage');

    expect(root.children).toContain(pageMock.element);
    expect(pageMock.show).toHaveBeenCalled();
  });
});
