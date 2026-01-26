import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createGaragePage } from './garage-page';
import { carsStore } from '@/entities';
import '@/shared/test/mock';

vi.mock('@/entities', () => ({
  carsStore: {
    get: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  },
  carsQueryStore: {
    get: vi.fn(),
    set: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  },
  CARS_ON_PAGE: 7,
}));

vi.mock('../model/init', () => ({
  initCars: vi.fn(() => Promise.resolve(vi.fn())),
}));

vi.mock('../model/pagination', () => ({
  initGaragePagination: vi.fn(() => ({
    element: document.createElement('div'),
    update: vi.fn(),
    disable: vi.fn(),
  })),
}));

vi.mock('../model/controls', () => ({
  initGarageControls: vi.fn(() => ({
    element: document.createElement('div'),
    setEditValues: vi.fn(),
    setEditDisabled: vi.fn(),
    setAddDisabled: vi.fn(),
  })),
}));

vi.mock('../model/race-controls', () => ({
  initGarageRaceControls: vi.fn(() => ({
    element: document.createElement('div'),
    buttons: {
      start: document.createElement('button'),
      reset: document.createElement('button'),
      generate: document.createElement('button'),
    },
  })),
}));

vi.mock('../model/render', () => ({
  renderGarageCarList: vi.fn(),
}));

describe('garage-page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (carsStore.get as ReturnType<typeof vi.fn>).mockReturnValue({
      items: [],
      total: 0,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('createGaragePage', () => {
    it('should create a garage page instance with correct structure', () => {
      const garagePage = createGaragePage();

      expect(garagePage).toBeDefined();
      expect(garagePage.element).toBeInstanceOf(HTMLElement);
      expect(typeof garagePage.show).toBe('function');
      expect(typeof garagePage.hide).toBe('function');
    });

    it('should have show and hide methods that toggle hidden class', () => {
      const garagePage = createGaragePage();

      garagePage.show();
      expect(garagePage.element.classList.contains('hidden')).toBe(false);

      garagePage.hide();
      expect(garagePage.element.classList.contains('hidden')).toBe(true);
    });

    it('should call initCars during creation', async () => {
      const { initCars } = await import('../model/init');

      createGaragePage();

      expect(initCars).toHaveBeenCalledOnce();
    });

    it('should initialize all required components', async () => {
      const { initGaragePagination } = await import('../model/pagination');
      const { initGarageControls } = await import('../model/controls');
      const { initGarageRaceControls } = await import('../model/race-controls');

      const mockedInitGaragePagination = vi.mocked(initGaragePagination);
      const mockedInitGarageControls = vi.mocked(initGarageControls);
      const mockedInitGarageRaceControls = vi.mocked(initGarageRaceControls);

      createGaragePage();

      expect(mockedInitGaragePagination).toHaveBeenCalledOnce();
      expect(mockedInitGarageControls).toHaveBeenCalledOnce();
      expect(mockedInitGarageRaceControls).toHaveBeenCalledOnce();
    });

    it('should render car list when store updates', async () => {
      const { renderGarageCarList } = await import('../model/render');
      const mockedRenderGarageCarList = vi.mocked(renderGarageCarList);

      let storeCallback: (() => void) | undefined;

      const subscribeMock = vi.mocked(carsStore.subscribe);
      subscribeMock.mockImplementation((callback: () => void) => {
        storeCallback = callback;
        return vi.fn();
      });

      createGaragePage();

      expect(storeCallback).toBeDefined();

      storeCallback?.();

      expect(mockedRenderGarageCarList).toHaveBeenCalledOnce();
    });

    it('should handle selected car ID state correctly', async () => {
      const { initGarageControls } = await import('../model/controls');
      let getSelectedCarIdCallback: (() => number | null) | undefined;

      vi.mocked(initGarageControls).mockImplementation(
        (getSelectedCarId: () => number | null) => {
          getSelectedCarIdCallback = getSelectedCarId;
          return {
            element: document.createElement('div'),
            setEditValues: vi.fn(),
            setEditDisabled: vi.fn(),
            setAddDisabled: vi.fn(),
          };
        },
      );

      createGaragePage();

      expect(getSelectedCarIdCallback).toBeDefined();
      expect(getSelectedCarIdCallback?.()).toBeNull();
    });
  });

  describe('Page lifecycle', () => {
    it('should create page container with correct CSS classes', () => {
      const garagePage = createGaragePage();
      const { element } = garagePage;

      expect(element.tagName).toBe('DIV');
      expect(element.classList.contains('flex')).toBe(true);
      expect(element.classList.contains('flex-col')).toBe(true);
      expect(element.classList.contains('flex-1')).toBe(true);
      expect(element.classList.contains('w-full')).toBe(true);
      expect(element.classList.contains('max-w-5xl')).toBe(true);
      expect(element.classList.contains('pt-0')).toBe(true);
    });

    it('should contain all necessary child containers', () => {
      const garagePage = createGaragePage();
      const { element } = garagePage;

      const contentContainer = element.children[0];
      const paginationElement = element.children[1];

      expect(element.children.length).toBe(2);
      expect(contentContainer).toBeDefined();
      expect(paginationElement).toBeDefined();
    });

    it('should handle multiple show/hide calls correctly', () => {
      const garagePage = createGaragePage();
      const { element } = garagePage;

      expect(element.classList.contains('hidden')).toBe(false);

      garagePage.hide();
      expect(element.classList.contains('hidden')).toBe(true);

      garagePage.show();
      expect(element.classList.contains('hidden')).toBe(false);

      garagePage.hide();
      expect(element.classList.contains('hidden')).toBe(true);

      garagePage.show();
      expect(element.classList.contains('hidden')).toBe(false);
    });
  });
});
