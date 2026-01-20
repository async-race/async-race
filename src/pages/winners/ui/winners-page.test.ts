import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createWinnersPage } from './winners-page';
import type { WinnersWithCars } from '@/pages/model/types';
import { winnersStore, winnersQueryStore } from '@/entities';
import type { Mock } from 'vitest';
import { getWinnersWithCars } from '@/features/get-winners-with-cars/get-winners-with-cars';
import { createPagination } from '@/widgets';
import type { PaginationProps } from '@/widgets/pagination/model/types';

type PaginationInstance = {
  element: HTMLElement;
  update: () => void;
};

vi.mock('@/entities', () => ({
  winnersStore: {
    get: vi.fn(() => ({ winners: [], total: 0 })),
    subscribe: vi.fn(),
  },
  winnersQueryStore: {
    get: vi.fn(() => ({ page: 1, sort: 'wins', order: 'ASC' })),
    set: vi.fn(),
  },
  WINNERS_ON_PAGE: 10,
}));

vi.mock('@/widgets/pagination/ui/pagination', () => ({
  createPagination: vi.fn(() => ({
    element: document.createElement('div'),
    update: vi.fn(),
  })),
}));

vi.mock('@/pages/model/init', () => ({ initWinners: vi.fn() }));
vi.mock('@/features/get-winners-with-cars/get-winners-with-cars', () => ({
  getWinnersWithCars: vi.fn((winners: WinnersWithCars[]) => winners),
}));

describe('createWinnersPage', () => {
  let page: ReturnType<typeof createWinnersPage>;

  beforeEach(() => {
    (winnersStore.get as Mock).mockReturnValue({
      winners: [
        { id: 1, name: 'Alice', color: 'red', wins: 3, time: 12.5 },
        { id: 2, name: 'Bob', color: 'blue', wins: 5, time: 10.2 },
      ] as WinnersWithCars[],
      total: 2,
    });
    (winnersStore.subscribe as Mock).mockImplementation(
      (functionToCall: () => void) => {
        functionToCall();
      },
    );

    page = createWinnersPage();
  });

  it('renders table with headers and rows', () => {
    const headerRow = page.element.querySelector('.grid.grid-cols-5.font-bold');
    expect(headerRow).toBeTruthy();
    if (!headerRow) {
      throw new Error('headerRow is null');
    }
    const headerCells = headerRow.querySelectorAll('div');

    const texts = [...headerCells].map((element) => {
      const text = element.textContent || '';
      return text.replaceAll('▲▼', '').trim();
    });

    expect(texts).toEqual(['Number', 'Car', 'Name', 'Wins', 'Best time (s)']);

    const rows = page.element.querySelectorAll('.grid.grid-cols-5');
    expect(rows.length).toBeGreaterThan(1);
    expect(rows[1].textContent).toContain('Alice');
    expect(rows[2].textContent).toContain('Bob');
  });

  it('show() removes hidden class', () => {
    page.element.classList.add('hidden');
    page.show();
    expect(page.element.classList.contains('hidden')).toBe(false);
  });

  it('hide() adds hidden class', () => {
    page.hide();
    expect(page.element.classList.contains('hidden')).toBe(true);
  });

  it('updates indexPage text when page changes', () => {
    const header = page.element.querySelector('h4');
    expect(header?.textContent).toContain('Page # 1');

    (winnersQueryStore.get as Mock).mockReturnValue({
      page: 2,
      sort: 'wins',
      order: 'ASC',
    });

    if (!header) {
      throw new Error('header is null');
    }

    header.textContent = `Page # ${String(winnersQueryStore.get().page)}`;

    expect(header.textContent).toContain('Page # 2');
  });

  it('re-renders table when winnersStore.subscribe callback is triggered', async () => {
    let callback: (() => Promise<void>) | undefined;
    (winnersStore.subscribe as Mock).mockImplementation(
      (functionToCall: () => Promise<void>) => {
        callback = functionToCall;
      },
    );

    const pageInstance = createWinnersPage();
    const oldTable = pageInstance.element.querySelector('.grid.grid-cols-5');

    (getWinnersWithCars as Mock).mockResolvedValue([
      { id: 3, name: 'Carol', color: 'green', wins: 7, time: 9.8 },
    ]);

    await callback?.();

    const newTable = pageInstance.element.querySelector('.grid.grid-cols-5');
    expect(newTable).not.toBe(oldTable);
  });

  it('updates indexPage and calls set/update when pagination changes', () => {
    const header = page.element.querySelector('h4');
    expect(header).not.toBeNull();

    const callArguments = (createPagination as Mock).mock
      .calls[0][0] as PaginationProps;

    expect(callArguments).toBeTruthy();

    callArguments.onChange(2);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(winnersQueryStore.set).toHaveBeenCalledWith({ page: 2 });

    if (!header) {
      throw new Error('header is null');
    }

    expect(header.textContent).toContain('Page # 2');

    const paginationInstance = (createPagination as Mock).mock.results[0]
      .value as PaginationInstance;
    expect(paginationInstance.update).toHaveBeenCalled();
  });

  it('passes correct getPage and getTotal to pagination', () => {
    const callArguments = (createPagination as Mock).mock
      .calls[0][0] as PaginationProps;
    expect(callArguments).toBeTruthy();

    expect(callArguments).toBeTruthy();

    (winnersQueryStore.get as Mock).mockReturnValue({
      page: 5,
      sort: 'wins',
      order: 'ASC',
    });
    expect(callArguments.getPage()).toBe(5);

    (winnersStore.get as Mock).mockReturnValue({
      winners: [],
      total: 42,
    });
    expect(callArguments.getTotal()).toBe(42);
  });
});
