import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/app', () => ({
  startApp: vi.fn(),
}));

describe('index.ts', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.resetModules();
  });

  it('should throw if #root is not found', async () => {
    const index = import('./index.ts');
    await expect(index).rejects.toThrow('#root not found in DOM');
  });

  it('should call startApp with root element', async () => {
    document.body.innerHTML = '<div id="root"></div>';
    const { startApp } = await import('@/app');

    await import('./index');

    expect(startApp).toHaveBeenCalledTimes(1);
    expect(startApp).toHaveBeenCalledWith(document.querySelector('#root'));
  });
});
