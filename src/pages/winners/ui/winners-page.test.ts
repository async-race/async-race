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
        { id: 1, name: 'BMW', color: '#000000', wins: 3, time: 12.5 },
        { id: 2, name: 'Tesla', color: '#ff0000', wins: 5, time: 10.2 },
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
    const headerRowElement = [
      ...page.element.querySelectorAll('.grid.font-bold'),
    ].find((element) =>
      element.classList.contains('grid-cols-[1fr_1fr_1fr_1fr_1fr]'),
    );

    expect(headerRowElement).toBeTruthy();
    if (!headerRowElement) throw new Error('headerRowElement is null');

    const headerCells = headerRowElement.querySelectorAll(':scope > div');
    const headerTexts = [...headerCells].map((cell) =>
      (cell.textContent || '').replaceAll('▲▼', '').trim(),
    );

    expect(headerTexts).toEqual(['Number', 'Car', 'Name', 'Wins', 'Best time']);

    const rowElements = [...page.element.querySelectorAll('.grid')].filter(
      (element) =>
        element.classList.contains('grid-cols-[1fr_1fr_1fr_1fr_1fr]'),
    );

    expect(rowElements.length).toBeGreaterThan(1);
    expect(
      rowElements.some((row) => (row.textContent || '').includes('BMW')),
    ).toBe(true);
    expect(
      rowElements.some((row) => (row.textContent || '').includes('Tesla')),
    ).toBe(true);
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

  it('updates winners header text when data changes', () => {
    const headerElement = page.element.querySelector('h4');
    expect(headerElement?.textContent).toContain('Winners (2)');

    (winnersStore.get as Mock).mockReturnValue({
      items: [{ id: 3, name: 'Carol', color: 'green', wins: 7, time: 9.8 }],
      total: 1,
    });

    if (!headerElement) throw new Error('headerElement is null');
    headerElement.textContent = `Winners (${String(winnersStore.get().items.length)})`;

    expect(headerElement.textContent).toContain('Winners (1)');
  });

  it('re-renders table when winnersStore.subscribe callback is triggered', async () => {
    let callback: (() => Promise<void>) | undefined;

    (winnersStore.subscribe as Mock).mockImplementation(
      (functionToCall: () => Promise<void>) => {
        callback = functionToCall;
      },
    );

    const pageInstance = createWinnersPage();

    const oldTableElement = [
      ...pageInstance.element.querySelectorAll('.grid'),
    ].find((element) =>
      element.classList.contains('grid-cols-[1fr_1fr_1fr_1fr_1fr]'),
    );

    (winners.getWinnersWithCars as Mock).mockResolvedValue([
      { id: 3, name: 'Carol', color: 'green', wins: 7, time: 9.8 },
    ]);

    await callback?.();

    const newTableElement = [
      ...pageInstance.element.querySelectorAll('.grid'),
    ].find((element) =>
      element.classList.contains('grid-cols-[1fr_1fr_1fr_1fr_1fr]'),
    );

    expect(newTableElement).toBeTruthy();
    expect(newTableElement).not.toBe(oldTableElement);
  });

  it('updates winners header and calls set/update when pagination changes', () => {
    const headerElement = page.element.querySelector('h4');
    expect(headerElement).not.toBeNull();

    const callArguments = (createPagination as Mock).mock
      .calls[0][0] as PaginationProps;
    expect(callArguments).toBeTruthy();

    callArguments.onChange(2);
    expect(winnersQueryStore.set).toHaveBeenCalledWith({ page: 2 });

    if (!headerElement) throw new Error('headerElement is null');

    expect(headerElement.textContent).toContain('Winners (2)');

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
    let subscribeCallback: (() => Promise<void>) | undefined;

    (winnersStore.subscribe as Mock).mockImplementation(
      (functionToCall: () => Promise<void>) => {
        subscribeCallback = functionToCall;
      },
    );

    (winnersStore.get as Mock).mockReturnValue({
      items: [
        { id: 1, name: 'BMW', color: '#000000', wins: 3, time: 12.5 },
        { id: 2, name: 'Tesla', color: '#ff0000', wins: 5, time: 10.2 },
      ] as WinnersWithCars[],
      total: 2,
    });

    const pageInstance = createWinnersPage();

    await subscribeCallback?.();

    const headerRowElement = [
      ...pageInstance.element.querySelectorAll('.grid'),
    ].find(
      (element) =>
        element.classList.contains('grid-cols-[1fr_1fr_1fr_1fr_1fr]') &&
        element.classList.contains('font-bold'),
    );

    expect(headerRowElement).toBeTruthy();
    if (!headerRowElement) throw new Error('headerRowElement is null');

    const headerCells = headerRowElement.querySelectorAll(':scope > div');
    const headerTexts = [...headerCells].map((cell) =>
      (cell.textContent || '').replaceAll('▲▼', '').trim(),
    );

    expect(headerTexts).toEqual(['Number', 'Car', 'Name', 'Wins', 'Best time']);
  });
});
