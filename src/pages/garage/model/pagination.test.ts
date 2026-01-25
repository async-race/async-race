import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initGaragePagination } from './pagination';
import { carsStore, carsQueryStore, CARS_ON_PAGE } from '@/entities';
import { createPagination } from '@/widgets';

vi.mock('@/widgets', () => ({
  createPagination: vi.fn(),
}));

describe('initGaragePagination', () => {
  let element: HTMLElement;
  let disableMock: () => void;
  let updateMock: () => void;
  let mockedCreatePagination: ReturnType<
    typeof vi.mocked<typeof createPagination>
  >;

  beforeEach(() => {
    vi.clearAllMocks();

    element = document.createElement('div');
    updateMock = vi.fn();
    disableMock = vi.fn();
    mockedCreatePagination = vi.mocked(createPagination);
    mockedCreatePagination.mockReturnValue({
      update: updateMock,
      element: element,
      disable: disableMock,
    });

    carsQueryStore.set = vi.fn();
    carsQueryStore.get = vi.fn(() => ({ page: 1, limit: 10 }));
    carsStore.get = vi.fn(() => ({
      items: [{ id: 1, name: 'string', color: '#000000' }],
      total: 50,
    }));
  });

  it('should create pagination element with correct configuration', () => {
    const pagination = initGaragePagination();

    const arguments_ = mockedCreatePagination.mock.calls[0][0];
    expect(typeof arguments_.getPage).toBe('function');
    expect(typeof arguments_.getTotal).toBe('function');
    expect(typeof arguments_.onChange).toBe('function');
    expect(arguments_.pageSize).toBe(CARS_ON_PAGE);

    expect(pagination.update).toBeDefined();
  });

  it('should return the pagination element', () => {
    const pagination = initGaragePagination();

    expect(pagination).toEqual({
      update: updateMock,
      element: element,
      disable: disableMock,
    });
  });

  it('should call carsQueryStore.set and update when page changes', () => {
    initGaragePagination();
    const props = mockedCreatePagination.mock.calls[0][0];

    props.onChange(3);

    expect(carsQueryStore.set).toHaveBeenCalledWith({ page: 3 });
    expect(updateMock).toHaveBeenCalled();
  });

  it('should return current page from carsQueryStore.get', () => {
    initGaragePagination();
    const props = mockedCreatePagination.mock.calls[0][0];
    const page = props.getPage();

    expect(page).toBe(1);
    expect(carsQueryStore.get).toHaveBeenCalled();
  });

  it('should return total from carsStore.get', () => {
    initGaragePagination();
    const props = mockedCreatePagination.mock.calls[0][0];
    const total = props.getTotal();

    expect(total).toBe(50);
    expect(carsStore.get).toHaveBeenCalled();
  });
});
