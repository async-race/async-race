import { describe, it, expect, vi } from 'vitest';
import { winnerTableHeader } from './winner-table-header';

describe('winnerTableHeader', () => {
  it('renders label and arrows', () => {
    const header: HTMLElement = winnerTableHeader({
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
    const header: HTMLElement = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'time',
      order: 'ASC',
      onSortChange: vi.fn(),
    });

    const span: NodeListOf<HTMLSpanElement> = header.querySelectorAll('span');
    const arrowUp: HTMLSpanElement = span[1];
    const arrowDown: HTMLSpanElement = span[2];

    expect(arrowUp.className).toMatch(/opacity-30/);
    expect(arrowDown.className).toMatch(/opacity-30/);
  });

  it('highlights arrow up when active ASC', () => {
    const header: HTMLElement = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'wins',
      order: 'ASC',
      onSortChange: vi.fn(),
    });

    const span: NodeListOf<HTMLSpanElement> = header.querySelectorAll('span');
    const arrowUp: HTMLSpanElement = span[1];
    const arrowDown: HTMLSpanElement = span[2];

    expect(arrowUp.className).toMatch(/opacity-100/);
    expect(arrowDown.className).toMatch(/opacity-30/);
  });

  it('highlights arrow down when active DESC', () => {
    const header: HTMLElement = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'wins',
      order: 'DESC',
      onSortChange: vi.fn(),
    });

    const span: NodeListOf<HTMLSpanElement> = header.querySelectorAll('span');
    const arrowUp: HTMLSpanElement = span[1];
    const arrowDown: HTMLSpanElement = span[2];

    expect(arrowUp.className).toMatch(/opacity-30/);
    expect(arrowDown.className).toMatch(/opacity-100/);
  });

  it('calls onSortChange with DESC when clicking header while active ASC', () => {
    const onSortChange = vi.fn();
    const header: HTMLElement = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'wins',
      order: 'ASC',
      onSortChange,
    });

    header.click();

    expect(onSortChange).toHaveBeenCalledWith('wins', 'DESC');
  });

  it('calls onSortChange with ASC when clicking header while inactive', () => {
    const onSortChange = vi.fn();
    const header: HTMLElement = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'time',
      order: 'DESC',
      onSortChange,
    });

    header.click();

    expect(onSortChange).toHaveBeenCalledWith('wins', 'ASC');
  });

  it('calls onSortChange with ASC when clicking arrow up', () => {
    const onSortChange = vi.fn();
    const header: HTMLElement = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'wins',
      order: 'DESC',
      onSortChange,
    });

    const span: NodeListOf<HTMLSpanElement> = header.querySelectorAll('span');
    const arrowUp: HTMLSpanElement = span[1];
    arrowUp.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onSortChange).toHaveBeenCalledWith('wins', 'ASC');
  });

  it('calls onSortChange with DESC when clicking arrow down', () => {
    const onSortChange = vi.fn();
    const header: HTMLElement = winnerTableHeader({
      text: 'Wins',
      headerField: 'wins',
      sort: 'wins',
      order: 'ASC',
      onSortChange,
    });

    const span: NodeListOf<HTMLSpanElement> = header.querySelectorAll('span');
    const arrowDown: HTMLSpanElement = span[2];
    arrowDown.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(onSortChange).toHaveBeenCalledWith('wins', 'DESC');
  });
});
