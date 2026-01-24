import { describe, it, expect, vi } from 'vitest';
import { winnerTable } from './winner-table';
import type { WinnersWithCars } from '@/pages/model/types';

const mockWinners: WinnersWithCars[] = [
  { id: 1, name: 'BMW', color: '#000000', wins: 3, time: 12.5 },
  { id: 2, name: 'Tesla', color: '#ff0000', wins: 5, time: 10.2 },
];

describe('winnerTable', () => {
  it('renders table headers', () => {
    const tableElement = winnerTable({
      winners: mockWinners,
      page: 1,
      pageSize: 10,
      sort: 'wins',
      order: 'ASC',
      onSortChange: vi.fn(),
    });

    const headerRowElement = [
      ...tableElement.querySelectorAll('.grid.font-bold'),
    ].find((element) =>
      element.classList.contains('grid-cols-[1fr_1fr_1fr_1fr_1fr]'),
    );

    expect(headerRowElement).toBeTruthy();
    if (!headerRowElement) throw new Error('headerRowElement is null');

    const headerCells = headerRowElement.querySelectorAll(':scope > div');
    const headerTexts = [...headerCells].map((cell) =>
      (cell.textContent || '').trim(),
    );

    expect(headerTexts.some((text) => text.includes('Wins'))).toBe(true);
    expect(headerTexts.some((text) => text.includes('Best time'))).toBe(true);
  });

  it('renders rows with correct numbering', () => {
    const tableElement = winnerTable({
      winners: mockWinners,
      page: 2,
      pageSize: 10,
      sort: 'wins',
      order: 'ASC',
      onSortChange: vi.fn(),
    });

    const rowElements = [...tableElement.querySelectorAll('.grid')].filter(
      (element) =>
        element.classList.contains('grid-cols-[1fr_1fr_1fr_1fr_1fr]'),
    );

    const dataRowElements = rowElements.slice(1);

    expect(dataRowElements[0].textContent).toContain('11');
    expect(dataRowElements[0].textContent).toContain('BMW');
    expect(dataRowElements[1].textContent).toContain('12');
    expect(dataRowElements[1].textContent).toContain('Tesla');
  });

  it('calls onSortChange when clicking header', () => {
    const onSortChange = vi.fn();
    const tableElement = winnerTable({
      winners: mockWinners,
      page: 1,
      pageSize: 10,
      sort: 'wins',
      order: 'ASC',
      onSortChange,
    });

    const headerRowElement = [...tableElement.querySelectorAll('.grid')].find(
      (element) =>
        element.classList.contains('grid-cols-[1fr_1fr_1fr_1fr_1fr]'),
    );
    if (!headerRowElement) throw new Error('headerRowElement is null');

    const winsHeaderElement = [
      ...headerRowElement.querySelectorAll('.cursor-pointer'),
    ].find((element) => (element.textContent || '').includes('Wins'));

    if (!winsHeaderElement) throw new Error('winsHeaderElement is null');

    winsHeaderElement.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onSortChange).toHaveBeenCalledWith('wins', 'DESC');
  });
});
