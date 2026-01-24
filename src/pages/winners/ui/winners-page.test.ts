import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { createWinnersPage } from './winners-page';
import { winnersStore, winnersQueryStore } from '@/entities';
import { winners, type WinnersWithCars } from '@/features';
import { createPagination, winnerTableHeader } from '@/widgets';
import type { PaginationProps } from '@/widgets/pagination/model/types';
import { initWinners } from '../model/init';

type PaginationInstance = {
  element: HTMLElement;
  update: () => void;
};

vi.mock('@/entities', () => ({
  winnersStore: {
    get: vi.fn(() => ({ items: [], total: 0 })),
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

vi.mock('../model/init', () => ({ initWinners: vi.fn() }));
vi.mock('@/features', () => ({
  winners: {
    getWinnersWithCars: vi.fn((items: WinnersWithCars[]) => items),
  },
}));

describe('createWinnersPage', () => {
  let page: ReturnType<typeof createWinnersPage>;

  beforeEach(() => {
    (winnersStore.get as Mock).mockReturnValue({
      items: [
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

    (winners.getWinnersWithCars as Mock).mockResolvedValue([
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

    (winnersQueryStore.get as Mock).mockReturnValue({
      page: 5,
      sort: 'wins',
      order: 'ASC',
    });

    expect(callArguments.getPage()).toBe(5);

    (winnersStore.get as Mock).mockReturnValue({
      items: [],
      total: 42,
    });

    expect(callArguments.getTotal()).toBe(42);
  });

  it('clears old table before appending new one', async () => {
    let callback: (() => Promise<void>) | undefined;
    (winnersStore.subscribe as Mock).mockImplementation(
      (calledFunction: () => Promise<void>) => {
        callback = calledFunction;
      },
    );

    const pageInstance = createWinnersPage();
    const tableElement = pageInstance.element.querySelector(
      'div.flex.flex-col > div:nth-child(2)',
    );
    if (!tableElement) throw new Error('tableElement is null');

    tableElement.innerHTML = '<p>Old content</p>';

    (winners.getWinnersWithCars as Mock).mockResolvedValue([
      { id: 4, name: 'Dave', color: 'yellow', wins: 2, time: 15 },
    ]);

    await callback?.();

    expect(tableElement.innerHTML).not.toContain('Old content');
    expect(tableElement.textContent).toContain('Dave');
  });

  it('calls onSortChange with ASC when clicking inactive header', () => {
    const onSortChange = vi.fn();
    const header = winnerTableHeader({
      text: 'Best time (s)',
      headerField: 'time',
      sort: 'wins',
      order: 'DESC',
      onSortChange,
    });

    header.click();

    expect(onSortChange).toHaveBeenCalledWith('time', 'ASC');
  });

  it('calls onSortChange with DESC when clicking active header with ASC order', () => {
    const onSortChange = vi.fn();
    const header = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'wins',
      order: 'ASC',
      onSortChange,
    });

    header.click();

    expect(onSortChange).toHaveBeenCalledWith('wins', 'DESC');
  });

  it('calls onSortChange with ASC when clicking active header with DESC order', () => {
    const onSortChange = vi.fn();
    const header = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'wins',
      order: 'DESC',
      onSortChange,
    });

    header.click();

    expect(onSortChange).toHaveBeenCalledWith('wins', 'ASC');
  });

  it('calls initWinners on page creation', () => {
    createWinnersPage();

    expect(initWinners).toHaveBeenCalled();
  });

  it('calls onSortChange with ASC when clicking arrow up', () => {
    const onSortChange = vi.fn();
    const header = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'wins',
      order: 'DESC',
      onSortChange,
    });
    const arrowUp = header.querySelectorAll('span')[1];

    arrowUp.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onSortChange).toHaveBeenCalledWith('wins', 'ASC');
  });

  it('calls onSortChange with DESC when clicking arrow down', () => {
    const onSortChange = vi.fn();
    const header = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'wins',
      order: 'ASC',
      onSortChange,
    });
    const arrowDown = header.querySelectorAll('span')[2];

    arrowDown.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onSortChange).toHaveBeenCalledWith('wins', 'DESC');
  });

  it('renders table when sort is id and passes empty string to winnerTable', async () => {
    (winnersQueryStore.get as Mock).mockReturnValue({
      page: 1,
      sort: 'id',
      order: 'ASC',
    });
    (winnersStore.get as Mock).mockReturnValue({
      items: [{ id: 1, name: 'TestUser', color: 'black', wins: 1, time: 1 }],
      total: 1,
    });
    (winnersStore.subscribe as Mock).mockImplementation(
      (callback: () => void) => {
        callback();
      },
    );
    const pageInstance = createWinnersPage();
    await Promise.resolve();
    const headerRowElement: HTMLElement | null =
      pageInstance.element.querySelector('.grid.grid-cols-5.font-bold');

    expect(headerRowElement).toBeTruthy();
  });
});
