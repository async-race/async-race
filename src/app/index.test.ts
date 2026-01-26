import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { startApp } from './index';
import { BlockComponent } from '@/shared/ui/block-component/block-component';
import { createHeader } from '@/widgets/header/ui/header';
import { createFooter } from '@/widgets/footer/ui/footer';
import { createRouter, initRouter } from './router/router';

vi.mock('@/shared/ui/block-component/block-component', () => ({
  BlockComponent: vi.fn(() => document.createElement('div')),
}));

vi.mock('@/widgets/header/ui/header', () => ({
  createHeader: vi.fn(() => document.createElement('header')),
}));

vi.mock('@/widgets/footer/ui/footer', () => ({
  createFooter: vi.fn(() => document.createElement('footer')),
}));

vi.mock('./lib/create-page', () => ({
  createPage: vi.fn(),
}));

vi.mock('./router/router', () => {
  const navigateMock = vi.fn();
  return {
    createRouter: vi.fn(() => ({
      start: vi.fn(),
      navigate: navigateMock,
    })),
    initRouter: vi.fn(),
  };
});

describe('startApp', () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.append(root);
    vi.clearAllMocks();
  });

  afterEach(() => {
    root.remove();
  });

  it('should add "app-root" class to root element', () => {
    startApp(root);
    expect(root.classList.contains('app-root')).toBe(true);
  });

  it('should append header, main, and footer elements', () => {
    startApp(root);

    expect(createHeader).toHaveBeenCalled();
    expect(BlockComponent).toHaveBeenCalledWith({
      tagName: 'main',
      extraClasses: 'flex flex-1 justify-center',
    });
    expect(createFooter).toHaveBeenCalled();

    const [header, main, footer] = [...root.children];
    expect(header.tagName.toLowerCase()).toBe('header');
    expect(main.tagName.toLowerCase()).toBe('div');
    expect(footer.tagName.toLowerCase()).toBe('footer');
  });

  it('should initialize and start router', () => {
    startApp(root);

    const mockedCreateRouter = vi.mocked(createRouter);
    const mockedInitRouter = vi.mocked(initRouter);

    expect(mockedCreateRouter).toHaveBeenCalled();
    expect(mockedInitRouter).toHaveBeenCalled();

    const routerInstance = mockedCreateRouter.mock.results[0].value as {
      start: () => void;
      navigate: (path: string) => void;
    };
    expect(routerInstance.start).toHaveBeenCalled();
  });
});
