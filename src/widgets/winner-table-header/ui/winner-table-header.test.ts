import { describe, it, expect, vi } from 'vitest';
import { winnerTableHeader } from './winner-table-header';

describe('winnerTableHeader', () => {
  it('renders label and arrows', () => {
    const header = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'time',
      order: 'ASC',
      onSortChange: vi.fn(),
    });

    expect(header.textContent).toContain('Wins');
    expect(header.textContent).toContain('▲');
    expect(header.textContent).toContain('▼');
  });

  it('applies correct opacity when inactive', () => {
    const header = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'time',
      order: 'ASC',
      onSortChange: vi.fn(),
    });

    const arrows = header.querySelectorAll('span');
    const arrowUp = arrows[1];
    const arrowDown = arrows[2];

    expect(arrowUp.className).toMatch(/opacity-30/);
    expect(arrowDown.className).toMatch(/opacity-30/);
  });

  it('highlights arrow up when active ASC', () => {
    const header = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'wins',
      order: 'ASC',
      onSortChange: vi.fn(),
    });

    const arrows = header.querySelectorAll('span');
    const arrowUp = arrows[1];
    const arrowDown = arrows[2];

    expect(arrowUp.className).toMatch(/opacity-100/);
    expect(arrowDown.className).toMatch(/opacity-30/);
  });

  it('highlights arrow down when active DESC', () => {
    const header = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'wins',
      order: 'DESC',
      onSortChange: vi.fn(),
    });

    const arrows = header.querySelectorAll('span');
    const arrowUp = arrows[1];
    const arrowDown = arrows[2];

    expect(arrowUp.className).toMatch(/opacity-30/);
    expect(arrowDown.className).toMatch(/opacity-100/);
  });

  it('calls onSortChange with correct args on click', () => {
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
});
