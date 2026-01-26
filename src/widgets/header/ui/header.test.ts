import '@/shared/test/mock';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createHeader } from './header';
import { BlockComponent, Button } from '@/shared';
import * as router from '@/app/router/router';

vi.mock('@/app/router/router', () => ({
  navigate: vi.fn(),
}));

describe('createHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a header element using BlockComponent', () => {
    const header = createHeader();

    expect(BlockComponent).toHaveBeenCalledWith({
      tagName: 'header',
      extraClasses: 'flex gap-4 pb-0',
    });

    expect(header.tagName.toLowerCase()).toBe('header');
  });

  it('should create garage and winners buttons', () => {
    const header = createHeader();

    expect(Button).toHaveBeenCalledWith(
      expect.objectContaining({ textContent: 'Garage' }),
    );
    expect(Button).toHaveBeenCalledWith(
      expect.objectContaining({ textContent: 'Winners' }),
    );

    const garageButton = [...header.children].find(
      (button) => button.textContent === 'Garage',
    );
    const winnersButton = [...header.children].find(
      (button) => button.textContent === 'Winners',
    );

    expect(garageButton).toBeTruthy();
    expect(winnersButton).toBeTruthy();
  });

  it('should call navigate when buttons are clicked', () => {
    const navigateSpy = router.navigate;

    const header = createHeader();

    const garageButton = [...header.children].find(
      (button) => button.textContent === 'Garage',
    ) as HTMLButtonElement;
    const winnersButton = [...header.children].find(
      (button) => button.textContent === 'Winners',
    ) as HTMLButtonElement;

    garageButton.click();
    winnersButton.click();

    expect(navigateSpy).toHaveBeenCalledWith('garage');
    expect(navigateSpy).toHaveBeenCalledWith('winners');
  });
});
