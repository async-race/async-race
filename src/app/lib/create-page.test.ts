import { describe, it, expect, vi } from 'vitest';
import { createPage } from './create-page';
import { createGaragePage } from '@/pages/garage/ui/garage-page';
import { createWinnersPage } from '@/pages/winners/ui/winners-page';

vi.mock('@/pages/garage/ui/garage-page', () => ({
  createGaragePage: vi.fn(() => 'garage-page-element'),
}));

vi.mock('@/pages/winners/ui/winners-page', () => ({
  createWinnersPage: vi.fn(() => 'winners-page-element'),
}));

describe('createPage', () => {
  it('should call createGaragePage for "garage" route', () => {
    const result = createPage('garage');

    expect(createGaragePage).toHaveBeenCalled();
    expect(result).toBe('garage-page-element');
  });

  it('should call createWinnersPage for "winners" route', () => {
    const result = createPage('winners');

    expect(createWinnersPage).toHaveBeenCalled();
    expect(result).toBe('winners-page-element');
  });
});
