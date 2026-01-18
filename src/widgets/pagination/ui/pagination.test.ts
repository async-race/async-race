import '@/shared/test/mock';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPagination } from './pagination';

describe('createPagination', () => {
  let page: number;
  let onChange: (page: number) => void;

  beforeEach(() => {
    page = 1;
    onChange = vi.fn();
    document.body.innerHTML = '';
  });

  it('should render pagination container with buttons', () => {
    const pagination = createPagination({
      getPage: () => page,
      getTotal: () => 10,
      pageSize: 2,
      onChange,
    });

    document.body.append(pagination.element);

    const buttons = pagination.element.querySelectorAll('button');

    expect(buttons).toHaveLength(3);
    expect(buttons[0].textContent).toBe('«');
    expect(buttons[1].textContent).toBe('1');
    expect(buttons[2].textContent).toBe('»');
  });

  it('should disable previous button on first page', () => {
    const pagination = createPagination({
      getPage: () => page,
      getTotal: () => 10,
      pageSize: 2,
      onChange,
    });

    const [previousButton] = pagination.element.querySelectorAll('button');

    expect(previousButton.disabled).toBe(true);
  });

  it('should disable next button on last page', () => {
    page = 5;

    const pagination = createPagination({
      getPage: () => page,
      getTotal: () => 10,
      pageSize: 2,
      onChange,
    });

    const buttons = pagination.element.querySelectorAll('button');
    const nextButton = buttons[2];

    expect(nextButton.disabled).toBe(true);
  });

  it('should call onChange with previous page when previous button clicked', () => {
    page = 3;

    const pagination = createPagination({
      getPage: () => page,
      getTotal: () => 10,
      pageSize: 2,
      onChange,
    });

    const [previousButton] = pagination.element.querySelectorAll('button');

    previousButton.click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('should call onChange with next page when next button clicked', () => {
    page = 2;

    const pagination = createPagination({
      getPage: () => page,
      getTotal: () => 10,
      pageSize: 2,
      onChange,
    });

    const buttons = pagination.element.querySelectorAll('button');
    const nextButton = buttons[2];

    nextButton.click();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('should not call onChange when clicking previous on first page', () => {
    page = 1;

    const pagination = createPagination({
      getPage: () => page,
      getTotal: () => 10,
      pageSize: 2,
      onChange,
    });

    const [previousButton] = pagination.element.querySelectorAll('button');

    previousButton.click();

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should update disabled state and current page on update()', () => {
    const pagination = createPagination({
      getPage: () => page,
      getTotal: () => 10,
      pageSize: 2,
      onChange,
    });

    page = 3;
    pagination.update();

    const buttons = pagination.element.querySelectorAll('button');
    const previousButton = buttons[0];
    const currentButton = buttons[1];
    const nextButton = buttons[2];

    expect(previousButton.disabled).toBe(false);
    expect(nextButton.disabled).toBe(false);
    expect(currentButton.textContent).toBe('3');
  });
});
