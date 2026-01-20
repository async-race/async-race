import { describe, it, expect, vi } from 'vitest';
import { winnerTable } from './winner-table';
import type { WinnersWithCars } from '@/pages/model/types';

const mockWinners: WinnersWithCars[] = [
  { id: 1, name: 'Alice', color: 'red', wins: 3, time: 12.5 },
  { id: 2, name: 'Bob', color: 'blue', wins: 5, time: 10.2 },
];

describe('winnerTable', () => {
  it('renders table headers', () => {
    const table = winnerTable({
      winners: mockWinners,
      page: 1,
      pageSize: 10,
      sort: 'wins',
      order: 'ASC',
      onSortChange: vi.fn(),
    });

    const headers = table.querySelectorAll('.grid.grid-cols-5 > div');
    const texts = [...headers].map((h) => h.textContent);

    expect(texts.some((t) => t && t.includes('Wins'))).toBe(true);
    expect(texts.some((t) => t && t.includes('Best time'))).toBe(true);
  });

  it('renders rows with correct numbering', () => {
    const table = winnerTable({
      winners: mockWinners,
      page: 2,
      pageSize: 10,
      sort: 'wins',
      order: 'ASC',
      onSortChange: vi.fn(),
    });

    const rows = table.querySelectorAll('.grid.grid-cols-5');
    const dataRows = [...rows].slice(1);

    expect(dataRows[0].textContent).toContain('11');
    expect(dataRows[0].textContent).toContain('Alice');
    expect(dataRows[1].textContent).toContain('12');
    expect(dataRows[1].textContent).toContain('Bob');
  });

  it('calls onSortChange when clicking header', () => {
    const onSortChange = vi.fn();
    const table = winnerTable({
      winners: mockWinners,
      page: 1,
      pageSize: 10,
      sort: 'wins',
      order: 'ASC',
      onSortChange,
    });

    const winsHeader = [
      ...table.querySelectorAll('.grid.grid-cols-5 > div'),
    ].find(
      (element) => element.textContent && element.textContent.includes('Wins'),
    );

    if (!winsHeader) {
      throw new Error('winsHeader is null');
    }
    winsHeader.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onSortChange).toHaveBeenCalledWith('wins', 'DESC');
  });
});
